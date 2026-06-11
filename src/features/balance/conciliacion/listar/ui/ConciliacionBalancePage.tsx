import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { Button } from '@/components/ui/button'
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
        actions={<Button size="sm" onClick={() => setShowIniciar(true)}>+ Nueva conciliación</Button>}
      />

      <div className="sf-tabs-shell">
        <div className="sf-tabs-nav">
        {(['listado', 'diferencias'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'sf-tab capitalize',
              tab === t
                ? 'sf-tab-active'
                : '',
            ].join(' ')}
          >
            {t === 'listado' ? 'Conciliaciones' : 'Diferencias pendientes'}
          </button>
        ))}
        </div>
      </div>

      {tab === 'listado' && (
        <>
          {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
          <div className="overflow-x-auto rounded-[18px] border border-[#dbe3ed] bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-[#f8fbfe]">
                <tr>
                  {['Recurso', 'Fecha corte', 'Sistema', 'Tesoreria', 'Diferencia', 'Estado'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {conciliaciones.map(c => (
                  <tr key={c.id} className="hover:bg-[#f8fbfe]">
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
                    <td colSpan={6} className="px-4 py-8 text-center text-[#66768a]">
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
