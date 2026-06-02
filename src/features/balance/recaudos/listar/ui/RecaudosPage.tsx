import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { formatCOP } from '@/shared/lib/currency'
import { useRecaudos } from '../hook'
import { useConciliarRecaudo } from '../../conciliar/hook'
import type { RecaudoReal } from '../../../model/types'
import { RegistrarRecaudoDialog } from '../../registrar/ui/RegistrarRecaudoDialog'

const currentYear = new Date().getFullYear()

const ESTADO_COLOR: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  CONCILIADO: 'bg-green-100 text-green-700',
  ANULADO: 'bg-red-100 text-red-700',
}

export function RecaudosPage() {
  const [vigencia, setVigencia] = useState(currentYear)
  const [showRegistrar, setShowRegistrar] = useState(false)
  const { data: recaudos = [], isLoading } = useRecaudos(vigencia)

  return (
    <div className="space-y-4">
      <PageHeader title="Recaudos Reales" description="Registro y conciliacion de recursos efectivamente recibidos"
        actions={<div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Vigencia</label>
          <input
            type="number"
            value={vigencia}
            onChange={e => setVigencia(Number(e.target.value))}
            className="input w-24"
          />
          <button onClick={() => setShowRegistrar(true)} className="btn-primary">
            + Registrar recaudo
          </button>
        </div>}
      />

      {isLoading && <p className="text-sm text-gray-500">Cargando recaudos...</p>}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Giro', 'Entidad', 'Concepto', 'Fecha', 'Valor', 'Estado', 'Accion'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {recaudos.map(r => <RecaudoRow key={r.id} recaudo={r} />)}
            {!isLoading && recaudos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No hay recaudos para la vigencia {vigencia}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RegistrarRecaudoDialog open={showRegistrar} onClose={() => setShowRegistrar(false)} />
    </div>
  )
}

function RecaudoRow({ recaudo: r }: { recaudo: RecaudoReal }) {
  const { mutate: conciliar, isPending } = useConciliarRecaudo(r.id)
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 font-mono text-xs">{r.numeroGiro}</td>
      <td className="px-4 py-3 max-w-[140px] truncate" title={r.entidadPagadora}>{r.entidadPagadora}</td>
      <td className="px-4 py-3 max-w-[180px] truncate" title={r.concepto}>{r.concepto}</td>
      <td className="px-4 py-3">{new Date(r.fechaGiro).toLocaleDateString('es-CO')}</td>
      <td className="px-4 py-3 font-mono">{formatCOP(r.valor)}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_COLOR[r.estado]}`}>
          {r.estado}
        </span>
      </td>
      <td className="px-4 py-3">
        {r.estado === 'PENDIENTE' && (
          <button
            onClick={() => conciliar(undefined)}
            disabled={isPending}
            className="text-xs text-blue-600 hover:underline disabled:opacity-40"
          >
            {isPending ? 'Conciliando...' : 'Conciliar'}
          </button>
        )}
      </td>
    </tr>
  )
}
