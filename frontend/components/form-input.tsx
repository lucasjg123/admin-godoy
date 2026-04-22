import { Input } from './ui/input';
import { Label } from './ui/label';

type FormInputProps = {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormInput = ({ id, label, error, ...props }: FormInputProps) => {
  return (
    <div className='flex flex-col gap-1'>
      {label && id && (
        <Label htmlFor={id} className={error ? 'text-red-500' : ''}>
          {label}
        </Label>
      )}

      <Input
        id={id}
        aria-invalid={!!error}
        className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
        {...props}
      />

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
};

export default FormInput;
