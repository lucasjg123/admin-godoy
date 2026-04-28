import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FormInput from '@/components/form-input';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Titular, CreateTitular } from '@/lib/schemas/titulares.schema';
import { titularRolEnum } from '@/lib/schemas/titularRolEnum.schema';

type Props = {
  titular: Titular;
  isEditing: boolean;
  formData: CreateTitular;
  formErrors: any;
  setFormData: React.Dispatch<React.SetStateAction<CreateTitular>>;
  onEditStart: (titular: Titular) => void;
  onValidate: () => void;
  onCancel: () => void;
  onRemove: (id: number) => void;
};



export const Row = ({
  titular,
  isEditing,
  formData,
  formErrors,
  setFormData,
  onEditStart,
  onValidate,
  onCancel,
  onRemove,
}: Props) => {
  // console.log('titular', titular);
  return (
    <TableRow className='align-top'>
      <TableCell className='align-top'>
        <FormInput
          value={isEditing ? formData.nom_tit : titular.nom_tit}
          disabled={!isEditing}
          onChange={(e) =>
            setFormData({ ...formData, nom_tit: e.target.value })
          }
          error={isEditing ? formErrors.nom_tit?.[0] : undefined}
        />
      </TableCell>

      <TableCell className='align-top'>
        <FormInput
          value={isEditing ? formData.ape_tit ?? '' : titular.ape_tit ?? ''}
          disabled={!isEditing}
          onChange={(e) =>
            setFormData({ ...formData, ape_tit: e.target.value })
          }
          error={isEditing ? formErrors.ape_tit?.[0] : undefined}
        />
      </TableCell>

      <TableCell className='align-top'>
        <FormInput
          value={isEditing ? formData.email_tit ?? '' : titular.email_tit ?? ''}
          disabled={!isEditing}
          onChange={(e) =>
            setFormData({ ...formData, email_tit: e.target.value.trim() === '' ? null: e.target.value.trim()  })
          }
          error={isEditing ? formErrors.email_tit?.[0] : undefined}
        />
      </TableCell>

      <TableCell className='align-top'>
        <Select
          value={isEditing ? formData.rol_tit : titular.rol_tit}
          disabled={!isEditing}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              rol_tit: value as CreateTitular['rol_tit'],
              email_tit: prev.email_tit,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {titularRolEnum.options.map((rol) => (
              <SelectItem key={rol} value={rol}>
                {rol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell className='align-top'>
        {isEditing ? (
          <div className='flex gap-2'>
            <Button size='sm' onClick={onValidate}>
              ✔
            </Button>
            <Button size='sm' variant='outline' onClick={onCancel}>
              ✖
            </Button>
          </div>
        ) : (
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => onEditStart(titular)}
            >
              Editar
            </Button>

            <ConfirmDialog
              trigger={
                <Button size='sm' variant='destructive'>
                  Eliminar
                </Button>
              }
              title='¿Eliminar titular?'
              confirmText='Sí, eliminar'
              onConfirm={() => onRemove(titular.id_tit)}
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
