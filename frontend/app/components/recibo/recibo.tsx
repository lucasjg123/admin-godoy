import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Departamento } from '@/lib/schemas/departamento.schema';
import { useForm, FormProvider } from 'react-hook-form';
import ReciboFooter from './recibo-footer';
import ReciboContent from './recibo-content';
import { ReciboFormValues, reciboSchema } from '@/lib/schemas/recibo.schema';
import { mesesLista } from '@/types/meses';
import { useCreateRecibo, useSendRecibo } from '@/hooks/use-recibo';
import { useToastError } from '@/hooks/use-toast-error';
import { toast } from 'sonner';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';

type ReciboProps = {
  depto: Departamento;
  onClose: () => void;
};

const Recibo = ({ depto, onClose }: ReciboProps) => {
  const [reciboData, setReciboData] = useState<ReciboFormValues | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const titular = depto.departamentos_titulares[0].titulares;
  const now = new Date();
  const currentYear = now.getFullYear();
  const hour = now.getHours();
  const previousMonthIndex = new Date(
    now.getFullYear(),
    now.getMonth() - 1
  ).getMonth();
  // const defaultMonth = mesesLista[previousMonthIndex];
  const defaultMonth =
    depto.id_edif === 5 || depto.id_edif === 6
      ? mesesLista[now.getMonth()]
      : mesesLista[previousMonthIndex];
  const saludo = hour < 12 ? 'Buenos días' : 'Buenas tardes';

  const methods = useForm<ReciboFormValues>({
    resolver: zodResolver(reciboSchema),
    defaultValues: {
      id_depto: depto.id_depto,
      id_tit: titular.id_tit,
      anio: currentYear.toString(),
      meses: [defaultMonth],
      mensaje: `${saludo} ${titular.nom_tit}, ¿cómo estás?. Te envío el recibo de pago.\nMuchas gracias! Saludos!!`,
    },
    mode: 'onBlur', // o onBlur al salir
  });
  const { create, loading, error } = useCreateRecibo();
  const {
    sendRecibo,
    loading: sendLoading,
    error: sendError,
  } = useSendRecibo();
  useToastError(error ?? sendError);

  const onSubmit = async (data: ReciboFormValues) => {
    const created = await create(data);

    if (!created) return;
    toast.success('Recibo generado');

    const url = window.URL.createObjectURL(created);
    window.open(url, '_blank');

    setReciboData(data);
    setConfirmOpen(true);

    // onClose();
    // methods.reset();
  };

  const handleSend = async () => {
    if (!reciboData) return;
    await sendRecibo(reciboData); // tu endpoint de mail
    toast.success('Recibo enviado');
    setConfirmOpen(false);
    onClose(); // cierra el dialog principal
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-3xl'>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  RECIBO: {depto.edificios.nom_edif.toUpperCase()}{' '}
                  {depto.piso_depto} {depto.letra_depto}
                </DialogTitle>
                <DialogDescription />
              </DialogHeader>

              <ReciboContent                
                depto={depto}
              />

              <ReciboFooter />
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title='¿Desea enviar el recibo por correo?'
        confirmText='Enviar'
        onConfirm={handleSend}
      />
    </>
  );
};

export default Recibo;
