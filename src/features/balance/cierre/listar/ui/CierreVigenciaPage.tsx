import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { formatCOP } from '@/shared/lib/currency'
import { useCierres } from '../hook'
import { ESTADO_CIERRE_LABEL, ESTADO_CIERRE_COLOR, ESTADO_CIERRE } from '../../../model/constants'
import type { CierreVigencia } from '../../../model/types'
import { IniciarCierreDialog } from '../../iniciar/ui/IniciarCierreDialog'
import { AprobarCierreDialog } from '../../acciones/ui/AprobarCierreDialog'
import { CerrarDefinitivoDialog } from '../../acciones/ui/CerrarDefinitivoDialog'

export function CierreVigenciaPage() {
  const { data: cierres = [], isLoading } = useCierres()
  const [showIniciar, setShowIniciar] = useState(false)
  const [aprobarTarget, setAprobarTarget] = useState<CierreVigencia | null>(null)
  const [cerrarTarget, setCerrarTarget] = useState<CierreVigencia | null>(null)

  return (
    <div className="space-y-4">
      <PageHeader
        title="Cierre de Vigencia"
        description="Gestión del proceso de cierre presupuestal anual"
        actions={<Button size="sm" onClick={() => setShowIniciar(true)}>+ Iniciar cierre</Button>}
      />

      {isLoading && <p className="text-sm text-muted-foreground">Cargando cierres...</p>}

      <div className="overflow-x-auto rounded-[18px] border border-[#dbe3ed] bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#f8fbfe]">
            <tr>
              {['Vigencia', 'Unidad Ejecutora', 'Fecha cierre', 'Excedente neto', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {cierres.map(c => (
              <tr key={c.id} className="hover:bg-[#f8fbfe]">
                <td className="px-4 py-3 font-medium">{c.vigencia}</td>
                <td className="px-4 py-3">{c.unidadEjecutoraName}</td>
                <td className="px-4 py-3">{new Date(c.fechaCierre).toLocaleDateString('es-CO')}</td>
                <td className="px-4 py-3 font-mono">{formatCOP(c.excedenteNeto)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_CIERRE_COLOR[c.estado]}`}>
                    {ESTADO_CIERRE_LABEL[c.estado]}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  {c.estado === ESTADO_CIERRE.EN_REVISION && (
                    <Button size="xs" variant="secondary" onClick={() => setAprobarTarget(c)}>Aprobar</Button>
                  )}
                  {c.estado === ESTADO_CIERRE.APROBADO && (
                    <Button size="xs" variant="destructive" onClick={() => setCerrarTarget(c)}>Cerrar definitivo</Button>
                  )}
                </td>
              </tr>
            ))}
            {!isLoading && cierres.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#66768a]">No hay cierres de vigencia registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <IniciarCierreDialog open={showIniciar} onClose={() => setShowIniciar(false)} />
      {aprobarTarget && <AprobarCierreDialog cierreId={aprobarTarget.id} open onClose={() => setAprobarTarget(null)} />}
      {cerrarTarget && <CerrarDefinitivoDialog cierreId={cerrarTarget.id} vigencia={cerrarTarget.vigencia} open onClose={() => setCerrarTarget(null)} />}
    </div>
  )
}
