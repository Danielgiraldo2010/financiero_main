import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { formatCOP } from '@/shared/lib/currency'
import { useCierres } from '../hook'
import {
  ESTADO_CIERRE_LABEL, ESTADO_CIERRE_COLOR,
  ESTADO_CIERRE,
} from '../../../model/constants'
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
        description="Gestion del proceso de cierre presupuestal anual"
        actions={<button onClick={() => setShowIniciar(true)} className="btn-primary">
          + Iniciar cierre
        </button>}
      />

      {isLoading && <p className="text-sm text-gray-500">Cargando cierres...</p>}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Vigencia', 'Unidad Ejecutora', 'Fecha cierre', 'Excedente neto', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {cierres.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
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
                    <button
                      onClick={() => setAprobarTarget(c)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Aprobar
                    </button>
                  )}
                  {c.estado === ESTADO_CIERRE.APROBADO && (
                    <button
                      onClick={() => setCerrarTarget(c)}
                      className="text-xs text-red-600 hover:underline font-medium"
                    >
                      Cerrar definitivo
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!isLoading && cierres.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No hay cierres de vigencia registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <IniciarCierreDialog open={showIniciar} onClose={() => setShowIniciar(false)} />

      {aprobarTarget && (
        <AprobarCierreDialog
          cierreId={aprobarTarget.id}
          open={true}
          onClose={() => setAprobarTarget(null)}
        />
      )}

      {cerrarTarget && (
        <CerrarDefinitivoDialog
          cierreId={cerrarTarget.id}
          vigencia={cerrarTarget.vigencia}
          open={true}
          onClose={() => setCerrarTarget(null)}
        />
      )}
    </div>
  )
}
