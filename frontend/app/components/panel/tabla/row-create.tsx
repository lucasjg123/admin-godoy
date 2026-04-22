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
import { CreateTitular } from '@/lib/schemas/titulares.schema';
import { titularRolEnum } from '@/lib/schemas/titularRolEnum.schema';

type Props = {
  formData: CreateTitular;
  formErrors: any;
  setFormData: React.Dispatch<React.SetStateAction<CreateTitular>>;
  onValidate: () => void;
  onCancel: () => void;
};

export const RowCreate = ({
  formData,
  formErrors,
  setFormData,
  onValidate,
  onCancel,
}: Props) => {
  return (
    <TableRow>
      <TableCell className='align-top'>
        <FormInput
          value={formData.nom_tit}
          onChange={(e) =>
            setFormData({ ...formData, nom_tit: e.target.value })
          }
          error={formErrors.nom_tit?.[0]}
        />
      </TableCell>

      <TableCell className='align-top'>
        <FormInput
          value={formData.ape_tit ?? ''}
          onChange={(e) =>
            setFormData({ ...formData, ape_tit: e.target.value })
          }
          error={formErrors.ape_tit?.[0]}
        />
      </TableCell>

      <TableCell className='align-top'>
        <FormInput
          value={formData.email_tit ?? ''}
          onChange={(e) =>
            setFormData({ ...formData, email_tit: e.target.value })
          }
          error={formErrors.email_tit?.[0]}
        />
      </TableCell>

      <TableCell className='align-top'>
        <Select
          value={formData.rol_tit}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              rol_tit: value as CreateTitular['rol_tit'],
              email_tit: value === 'TITULAR' ? null : prev.email_tit,
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
        <div className='flex gap-2'>
          <Button size='sm' onClick={onValidate}>
            ✔
          </Button>
          <Button size='sm' variant='outline' onClick={onCancel}>
            ✖
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
