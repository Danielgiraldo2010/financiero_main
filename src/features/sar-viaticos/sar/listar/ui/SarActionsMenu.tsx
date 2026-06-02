import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui/primitives/button';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu';
import type { Sar } from '../../../model/types';
import { AprobarSarDialog }    from '../../acciones/ui/AprobarSarDialog';
import { AnularSarDialog }     from '../../acciones/ui/AnularSarDialog';
import { GenerarCdpSarDialog } from '../../acciones/ui/GenerarCdpSarDialog';
import { EjecutarSarDialog }   from '../../acciones/ui/EjecutarSarDialog';

type DialogType = 'aprobar' | 'anular' | 'cdp' | 'ejecutar' | null;

export function SarActionsMenu({ sar }: { sar: Sar }) {
  const [dialog, setDialog] = useState<DialogType>(null);
  const navigate = useNavigate();
  const close = () => setDialog(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => void navigate({ to: `/sar-viaticos/sar/${sar.id}` })}>
            Ver detalle
          </DropdownMenuItem>
          {sar.estado === 'BORRADOR' && (
            <DropdownMenuItem onClick={() => setDialog('aprobar')}>
              Aprobar (Decanatura)
            </DropdownMenuItem>
          )}
          {sar.estado === 'APROBADO' && (
            <DropdownMenuItem onClick={() => setDialog('cdp')}>
              Generar CDP
            </DropdownMenuItem>
          )}
          {sar.estado === 'CON_CDP' && (
            <DropdownMenuItem onClick={() => setDialog('ejecutar')}>
              Registrar ejecución
            </DropdownMenuItem>
          )}
          {(sar.estado === 'BORRADOR' || sar.estado === 'APROBADO') && (
            <DropdownMenuItem className="text-destructive" onClick={() => setDialog('anular')}>
              Anular
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AprobarSarDialog    sarId={sar.id} open={dialog === 'aprobar'}   onClose={close} />
      <AnularSarDialog     sarId={sar.id} open={dialog === 'anular'}    onClose={close} />
      <GenerarCdpSarDialog sarId={sar.id} open={dialog === 'cdp'}       onClose={close} />
      <EjecutarSarDialog   sarId={sar.id} horasAprobadas={sar.horasAprobadas}
                           open={dialog === 'ejecutar'} onClose={close} />
    </>
  );
}
