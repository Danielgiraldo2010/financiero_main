import { formatCOP } from '@/shared/lib/currency'
import { useDiferenciasConciliacion } from '../hook'
import { useConciliarBalance } from '../../conciliar/hook'
import { ESTADO_CONCILIACION_COLOR, UMBRAL_DIFERENCIA_CONCILIACION } from '../../../model/constants'

// FE10-I5: diferencias > umbral resaltadas en rojo
export function DiferenciasConciliacionTable() {
  const { data: diferencias = [], isLoading } = useDiferenciasConciliacion()
  const { mutate: conciliar, isPending } = useConciliarBalance()

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando diferencias...</p>

  return (
    <div className="overflow-x-auto rounded-[18px] border border-[#dbe3ed] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-[#f8fbfe]">
          <tr>
            {['Recurso Balance', 'Fecha corte', 'Diferencia', 'Estado', 'Accion'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {diferencias.map(d => {
            const excede = Math.abs(d.diferencia) > UMBRAL_DIFERENCIA_CONCILIACION
            return (
              <tr key={d.id} className={excede ? 'bg-red-50' : 'hover:bg-[#f8fbfe]'}>
                <td className="px-4 py-3">{d.recursoBalanceId}</td>
                <td className="px-4 py-3">{new Date(d.fechaCorte).toLocaleDateString('es-CO')}</td>
                <td className={`px-4 py-3 font-mono font-medium ${excede ? 'text-red-700' : ''}`}>
                  {formatCOP(d.diferencia)}
                  {excede && <span className="ml-1 text-xs text-red-700">sup. umbral</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_CONCILIACION_COLOR[d.estado]}`}>
                    {d.estado.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {d.estado === 'PENDIENTE' && (
                    <button
                      onClick={() => conciliar({ id: d.id })}
                      disabled={isPending}
                      className="text-xs text-blue-600 hover:underline disabled:opacity-40"
                    >
                      Conciliar
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
          {diferencias.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-[#66768a]">
                No hay diferencias pendientes de conciliacion.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
