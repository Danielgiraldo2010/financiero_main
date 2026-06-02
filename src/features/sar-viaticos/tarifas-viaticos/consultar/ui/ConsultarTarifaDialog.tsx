import { Dialog }    from '@/shared/ui/modal/Dialog';
import { Button }    from '@/shared/ui/primitives/button';
import { formatCOP } from '@/shared/lib/currency';
import { useTarifaViatico } from '../../listar/hook';
import {
  LABEL_TIPO_PERSONAL,
  LABEL_ZONA_VIATICO,
  LABEL_MUNICIPIO_TIPO,
} from '../../../model/constants';
import type { TipoPersonalViatico, ZonaViatico, MunicipioTipo } from '../../../model/constants';

interface Props { id: number; open: boolean; onClose: () => void; }

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-0 text-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

export function ConsultarTarifaDialog({ id, open, onClose }: Props) {
  const { data, isLoading } = useTarifaViatico(id);

  return (
    <Dialog open={open} onClose={onClose} title="Detalle de Tarifa" maxWidth="md">
      {isLoading && <p className="text-sm text-muted-foreground py-4">Cargando...</p>}
      {data && (
        <div className="space-y-1">
          <Row label="ID"             value={data.id} />
          <Row label="Vigencia"       value={data.vigencia} />
          <Row label="Tipo personal"  value={LABEL_TIPO_PERSONAL[data.tipoPersonal as TipoPersonalViatico] ?? data.tipoPersonal} />
          <Row label="Zona"           value={LABEL_ZONA_VIATICO[data.zona as ZonaViatico] ?? data.zona} />
          <Row label="Tipo municipio" value={LABEL_MUNICIPIO_TIPO[data.municipioTipo as MunicipioTipo] ?? data.municipioTipo} />
          <Row label="Pernoctacion"   value={data.incluyePernoctacion ? 'Si' : 'No'} />
          {data.horasMinimasDict != null && (
            <Row label="Horas min. dictado" value={data.horasMinimasDict} />
          )}
          <Row label="Dia completo"   value={<span className="font-mono">{formatCOP(data.valorDiaCompleto)}</span>} />
          <Row label="Medio dia"      value={<span className="font-mono">{formatCOP(data.valorMedioDia)}</span>} />
          <Row label="Transporte"     value={<span className="font-mono">{formatCOP(data.valorTransporte)}</span>} />
          <Row label="Norma"          value={data.normaAplicable} />
          <Row label="Vigente desde"  value={data.vigenteDesde?.toString().slice(0, 10)} />
          <Row label="Vigente hasta"  value={data.vigenteHasta?.toString().slice(0, 10) ?? '—'} />
          <Row label="Estado"         value={
            <span className={data.estado === 'VIGENTE' ? 'text-green-700 font-medium' : 'text-destructive'}>
              {data.estado}
            </span>
          } />
        </div>
      )}
      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={onClose}>Cerrar</Button>
      </div>
    </Dialog>
  );
}
