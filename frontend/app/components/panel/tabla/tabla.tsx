import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetDepartamento } from '@/hooks/use-departamentos';
import { useState } from 'react';
import {
  CreateTitular,
  createTitularSchema,
  Titular,
} from '@/lib/schemas/titulares.schema';
import {
  useCreateTitular,
  useRemoveTitular,
  useUpdateTitular,
} from '@/hooks/use-titulares';
import { useToastError } from '@/hooks/use-toast-error';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Row } from './row';
import { RowCreate } from './row-create';

type Props = {
  id_depto: number;
};

const Tabla = ({ id_depto }: Props) => {
  const { departamento, fetchDepartamento } = useGetDepartamento(id_depto);
  const [isCreating, setIsCreating] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const [activeId, setActiveId] = useState<number | null>(null);
  const initialState: CreateTitular = {
    nom_tit: '',
    ape_tit: '',
    email_tit: '',
    rol_tit: 'INQUILINO',
    more_tit: 0,
  };
  const [formData, setFormData] = useState<CreateTitular>(initialState);
  const [openConfirm, setOpenConfirm] = useState(false);

  const { create, error } = useCreateTitular();
  const { update, error: updateError } = useUpdateTitular();
  const { remove, error: removeError } = useRemoveTitular();

  useToastError(error ?? updateError ?? removeError);

  const handleCreateStart = () => {
    setFormErrors({});
    setActiveId(null);
    setFormData({
      nom_tit: '',
      ape_tit: '',
      email_tit: '',
      rol_tit: 'INQUILINO',
      more_tit: 0,
    });
    setIsCreating(true);
  };

  const handleEditStart = (titular: Titular) => {
    setFormErrors({});
    setIsCreating(false);
    setActiveId(titular.id_tit);
    setFormData({
      nom_tit: titular.nom_tit,
      ape_tit: titular.ape_tit ?? '',
      email_tit: titular.email_tit ?? '',
      rol_tit: titular.rol_tit,
      more_tit: 0,
    });
  };

  const handleValidate = () => {
    const result = createTitularSchema.safeParse(formData);

    if (!result.success) {
      setFormErrors(result.error.flatten().fieldErrors);
      return;
    }

    // Si pasa validación
    setOpenConfirm(true);
  };

  const handleSaveConfirmed = async () => {
    setOpenConfirm(false);

    let success = false;

    if (activeId === null) {
      const created = await create(id_depto, formData);
      if (created) {
        toast.success('Titular creado');
        success = true;
        // 🔥 limpiar y ocultar fila creación
        setFormData(initialState);
        setIsCreating(false);
      }
    } else {
      const updated = await update(activeId, formData);
      if (updated) {
        toast.success('Titular actualizado');
        success = true;
        // 🔥 salir de modo edición
        setActiveId(null);
      }
    }

    if (success) await fetchDepartamento();
  };

  const handleRemove = async (id_tit: number) => {
    const removed: any = await remove(id_depto, id_tit);
    if (removed) {
      toast.success(removed.message);
      await fetchDepartamento();
    }
  };

  return (
    <>
      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title={activeId === null ? '¿Crear titular?' : '¿Actualizar titular?'}
        confirmText={activeId === null ? 'Sí, crear' : 'Sí, actualizar'}
        onConfirm={handleSaveConfirmed}
      />
      <Button onClick={() => handleCreateStart()}>+ Agregar titular</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {departamento?.departamentos_titulares.map((i) => {
            const titular = i.titulares;
            const isEditing = activeId === titular.id_tit;
            return (
              <Row
                key={titular.id_tit}
                titular={titular}
                isEditing={isEditing}
                formData={formData}
                formErrors={formErrors}
                setFormData={setFormData}
                onEditStart={handleEditStart}
                onValidate={handleValidate}
                onCancel={() => setActiveId(null)}
                onRemove={handleRemove}
              />
            );
          })}
          {isCreating && (
            <RowCreate
              formData={formData}
              formErrors={formErrors}
              setFormData={setFormData}
              onValidate={handleValidate}
              onCancel={() => setIsCreating(false)}
            />
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default Tabla;
