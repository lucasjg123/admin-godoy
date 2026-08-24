// pdfjs-dist no declara "exports" en su package.json, por eso el resolver nodenext de TS no encuentra este subpath aunque Node si lo resuelve en runtime
declare module 'pdfjs-dist/legacy/build/pdf.mjs' {
  export interface PDFPageProxy {
    getViewport(params: { scale: number }): { width: number; height: number };
    getTextContent(): Promise<{
      items: Array<{ str: string; transform: number[] }>;
    }>;
  }

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    destroy(): Promise<void>;
  }

  export function getDocument(src: { data: Uint8Array }): {
    promise: Promise<PDFDocumentProxy>;
  };
}
