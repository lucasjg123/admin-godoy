'use client';

import { Card } from '@/components/ui/card';
import Menu from './components/menu';
import Tabla from './components/tabla';
import { useSearchDepartamentos } from '@/hooks/use-departamentos';
import { useState } from 'react';
import { Departamento } from '@/lib/schemas/departamento.schema';
import Recibo from './components/recibo/recibo';
import Panel from './components/panel/panel';
import { toast } from 'sonner';

export default function Home() {
  const { departamentos, search, loading } = useSearchDepartamentos();
  const [selectedDepto, setSelectedDepto] = useState<Departamento | null>(null);
  const [openRecibo, setOpenRecibo] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const dialogOpen = openRecibo || openPanel;

  const handleRowClick = (depto: Departamento) => {
    if (!depto.departamentos_titulares[0]?.titulares.email_tit) {
      toast.error('El titular no tiene email');
      return;
    }

    setSelectedDepto(depto);
    setOpenRecibo(true);
  };  

  return (
    <Card className='max-w-7xl mx-auto mt-5'>
      <Menu
        onSearch={search}
        onClickPanel={() => setOpenPanel(true)}
        dialogOpen={dialogOpen}
      />
      <Tabla
        data={departamentos}
        loading={loading}
        selected={selectedDepto}
        onRowClick={handleRowClick}
        onRadioSelect={setSelectedDepto}
      />
      {openRecibo && selectedDepto && (
        <Recibo depto={selectedDepto} onClose={() => setOpenRecibo(false)} />
      )}
      {openPanel && selectedDepto && (
        <Panel depto={selectedDepto} onClose={() => setOpenPanel(false)} />
      )}
    </Card>
  );
}
