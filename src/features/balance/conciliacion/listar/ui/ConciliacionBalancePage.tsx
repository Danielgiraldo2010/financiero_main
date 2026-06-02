import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { formatCOP } from '@/shared/lib/currency'
import { useConciliacionesBalance } from '../hook'
import { ESTADO_CONCILIACION_COLOR } from '../../../model/constants'
import { IniciarConciliacionDialog } from '../../iniciar/ui/IniciarConciliacionDialog'
import { DiferenciasConciliacionTable } from '../../diferencias/ui/DiferenciasConciliacionTable'

export function ConciliacionBalancePage() {
  const { data: conciliaciones = [], isLoading } = useConciliacionesBalance()
  const [showIniciar, setShowIniciar] = useState(false)
  const [tab, setTab] = useState<'listado' | 'diferencias'>('listado')

  return (
    <div className="space-y-4">
      <PageHeader title="Conciliacion de Balance" description="Control de diferencias entre sistema y tesoreria"
        actions={<button onClick={() => setShowIniciar(true)} className="btn-primary">
          + Nueva conciliacion
        </button>}
      />

      <div className="flex gap-1 border-b border-gray-200">
        {(['listado', 'diferencias'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'px-4 py-2 text-sm font-medium transition-colors capitalize',
              tab === t
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {t === 'listado' ? 'Conciliaciones' : 'Diferencias pendientes'}
          </button>
        ))}
      </div>

      {tab === 'listado' && (
        <>
          {isLoading && <p className="text-sm text-gray-500">Cargando...</p>}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Recurso', 'Fecha corte', 'Sistema', 'Tesoreria', 'Diferencia', 'Estado'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {conciliaciones.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{c.recursoBalanceId}</td>
                    <td className="px-4 py-3">{new Date(c.fechaCorte).toLocaleDateString('es-CO')}</td>
                    <td className="px-4 py-3 font-mono">{formatCOP(c.valorSistema)}</td>
                    <td className="px-4 py-3 font-mono">{formatCOP(c.valorTesoreria)}</td>
                    <td className={`px-4 py-3 font-mono ${c.diferencia !== 0 ? 'text-red-600 font-medium' : ''}`}>
                      {formatCOP(c.diferencia)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_CONCILIACION_COLOR[c.estado]}`}>
                        {c.estado.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
                {!isLoading && conciliaciones.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No hay conciliaciones registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'diferencias' && <DiferenciasConciliacionTable />}

      <IniciarConciliacionDialog open={showIniciar} onClose={() => setShowIniciar(false)} />
    </div>
  )
}
