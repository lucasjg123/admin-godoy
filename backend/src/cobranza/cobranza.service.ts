import { Injectable } from '@nestjs/common';
import { departamentos } from '@prisma/client';
import type { PDFPageProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { ExpensaCupon } from './types/expensa-cupon.type';
import { GastosComunesService } from 'src/gastos-comunes/gastos-comunes.service';
import { DepartamentosService } from 'src/departamentos/departamentos.service';

const toNumber = (valor?: string | null): number | null => {
  if (!valor) return null;
  return Number(valor.replace(/\./g, '').replace(',', '.'));
};

const parseDate = (dateStr?: string | null): Date | null => {
  if (!dateStr) return null;
  // Parse DD/MM/YY format (e.g., "10/08/26" -> August 10, 2026)
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  
  // YY format: 00-99 -> 2000-2099
  const fullYear = year < 100 ? 2000 + year : year;
  const date = new Date(fullYear, month - 1, day);
  
  // Validate the date
  return isNaN(date.getTime()) ? null : date;
};

interface TextItem {
  str: string;
  x: number;
  y: number;
}

@Injectable()
export class CobranzaService {
  constructor(private readonly gastosComunesService: GastosComunesService,
    private readonly departamentosService: DepartamentosService
  ) {}
  async parse(buffer: Buffer): Promise<ExpensaCupon[]> {
    // pdfjs-dist es ESM-only, se importa dinamicamente desde este modulo CJS
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
      .promise;

    let fullText = '';
    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      const page = await doc.getPage(pageNum);
      fullText += (await this.extractPageColumns(page)) + '\n';
    }
    await doc.destroy();

    const blocks = fullText
      .split(/(?=CONSORCIO\s+EDIFICIO)/g)
      .map((b) => b.trim())
      .filter(Boolean);

    return blocks.map((block) => this.parseCupon(block));
  }

  // separa el texto de la pagina en columna izquierda y derecha usando coordenadas
  private async extractPageColumns(page: PDFPageProxy): Promise<string> {
    const viewport = page.getViewport({ scale: 1 });
    const midX = viewport.width / 2;
    const content = await page.getTextContent();

    const left: TextItem[] = [];
    const right: TextItem[] = [];

    for (const item of content.items) {
      const x = item.transform[4];
      const y = item.transform[5];
      (x < midX ? left : right).push({ str: item.str, x, y });
    }

    const toColumnText = (items: TextItem[]) => {
      const sorted = [...items].sort((a, b) => b.y - a.y);
      const rows: TextItem[][] = [];
      const rowTolerance = 3; // px de variacion de baseline tolerados dentro de una misma fila

      for (const item of sorted) {
        const currentRow = rows[rows.length - 1];
        const refY = currentRow?.[0]?.y;
        if (currentRow && refY !== undefined && Math.abs(refY - item.y) <= rowTolerance) {
          currentRow.push(item);
        } else {
          rows.push([item]);
        }
      }

      return rows
        .map((rowItems) =>
          [...rowItems]
            .sort((a, b) => a.x - b.x)
            .map((i) => i.str)
            .join(' '),
        )
        .join('\n');
    };

    return `${toColumnText(left)}\n${toColumnText(right)}`;
  }

  private parseCupon(block: string): ExpensaCupon {
    const get = (re: RegExp) => block.match(re)?.[1]?.trim() ?? null;

    const participacion = block.match(
      /%\s*Participaci[oó]n\s*([\d,]+)\s*\$?\s*([\d.,]+)/,
    );
    const vto1 = block.match(/1\s*Vto\.?\s*([\d/]+)\s*\$?\s*([\d.,]+)/);
    const vto2 = block.match(/2\s*Vto\.?\s*([\d/]+)\s*\$?\s*([\d.,]+)/);
    const adeuda = this.parseAdeuda(block);

    return {
      edificio: get(/CONSORCIO\s+EDIFICIO\s+([^\n]+)/),
      ubicacion: get(/Ubicaci[oó]n\s*:?\s*([^\n]+)/),
      titular: get(/Titular\s*:?\s*([^\n]+)/),
      periodo: get(/EXPENSAS\s+MES\s+([\d/]+)/),
      monto_gc: toNumber(
        get(/Expensas Ordinarias\s*\$?\s*([\d.,]+)/),
      ),
      porcentaje_participacion: participacion
        ? Number(participacion[1].replace(',', '.'))
        : null,
      monto: toNumber(participacion?.[2] ?? null),
      adeuda,
      vto_1: vto1
        ? { fecha: vto1[1], monto: toNumber(vto1[2]) }
        : null,
      vto_2: vto2
        ? { fecha: vto2[1], monto: toNumber(vto2[2]) }
        : null,
    };
  }

  // extraccion de deuda
  private parseAdeuda(block: string): string | null {
    const match = block.match(
      /%\s*Participaci[oó]n[^\n]*\n[\s\S]*?(ADEUDA[\s\S]*?)1\s*Vto\.?/i
    );
    if (!match) return null;

    return match[1].replace(/\s+/g, ' ').trim();
  }

  private parsePisoLetra(ubicacion: string | null, idEdif: number): { piso: string | null; letra: string | null } {
    const ID_EDIF_KARA = 9;
    const ORDINALES: Record<string, string> = {
      PRIMER: '1', SEGUNDO: '2', TERCER: '3', CUARTO: '4', QUINTO: '5',
      SEXTO: '6', SEPTIMO: '7', OCTAVO: '8', NOVENO: '9', DECIMO: '10',
    };
    if (!ubicacion) return { piso: null, letra: null };
    const normalized = ubicacion.replace(/\s+/g, ' ').trim();

    if (idEdif === ID_EDIF_KARA) {
      // "PRIMER PISO" -> piso_depto fijo "PISO", letra_depto = número del ordinal
      const match = normalized.match(/^([A-ZÁÉÍÓÚ]+)\s+PISO$/i);
      const numero = match ? ORDINALES[match[1].toUpperCase()] : undefined;
      return numero ? { piso: 'PISO', letra: numero } : { piso: null, letra: null };
    }

    // resto de edificios: último token = letra, lo demás = piso
    const tokens = normalized.split(' ');
    if (tokens.length < 2) return { piso: normalized, letra: null };
    return { piso: tokens.slice(0, -1).join(' '), letra: tokens[tokens.length - 1] };
  }

  // actualizar datos
	// - [ ] iterar cupones 
	// - [ ] identificar departamentos
	// - [ ] (posible actuaizar lector pdf para q separe en letra y depto)
	// 	  > ver la mejor forma de matchear
	// - [ ]  actualizar expensas
  async aplicar(buffer: Buffer, idEdif: number): Promise<departamentos[] | undefined> {
    const cupones = await this.parse(buffer);
    console.log('Aplicando cupones:', cupones);

    if (cupones.length == 0) return;

    const cupon = cupones[0];
    // actulizamos gasto comun con los datos del cupon
    await this.gastosComunesService.update(idEdif, {
      monto_gc: cupon.monto_gc || undefined,
      vto1_gc: parseDate(cupon.vto_1?.fecha) || undefined,
      vto2_gc: parseDate(cupon.vto_2?.fecha) || undefined,
    });

    let departamentos: departamentos[] =[];
    // iteramos cupones y actualizamos expensas de cada departamento
    for (const cupon of cupones) {
      //identificar departamento por ubicacion
      const { piso, letra } = this.parsePisoLetra(cupon.ubicacion, idEdif); 
      const depto = await this.departamentosService.findByPisoLetra(idEdif, piso, letra);
       if (!depto) {
        console.warn(`No se encontró departamento para ubicacion="${cupon.ubicacion}"`);
        continue;
      }
      departamentos.push(depto);
      // campos a actualizar en expensas: monto_participacion, vto1, vto2, deuda.

      // Actualizamos expensas del departamento correspondiente
      // await this.gastosComunesService.updateExpensas(idEdif, {
      //   porcentaje,
      //   vto1: montoVto1,
      //   vto2: montoVto2,
      // });
    }
    return departamentos;   
      
  }
}