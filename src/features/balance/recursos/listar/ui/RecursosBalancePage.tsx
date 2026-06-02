import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { formatCOP } from '@/shared/lib/currency'
import { useRecursosBalance } from '../hook'
import { useValidarRecurso } from '../../acciones/hook'
import { ESTADO_RECURSO_LABEL, ESTADO_RECURSO_COLOR } from '../../../model/constants'
import type { RecursoBalance } from '../../../model/types'
import { RegistrarRecursoDialog } from '../../registrar/ui/RegistrarRecursoDialog'
import { IncorporarRecursoDialog } from '../../acciones/ui/IncorporarRecursoDialog'

const currentYear = new Date().getFullYear()

export function RecursosBalancePage() {
  const [vigencia, setVigencia] = useState(currentYear)
  const [showRegistrar, setShowRegistrar] = useState(false)
  const [incorporarTarget, setIncorporarTarget] = useState<RecursoBalance | null>(null)

  const { data: recursos = [], isLoading } = useRecursosBalance(vigencia)

  return (
    <div className="space-y-4">
      <PageHeader title="Recursos de Balance" description="Gestion de excedentes financieros del cierre anterior"
        actions={<div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Vigencia</label>
          <input
            type="number"
            value={vigencia}
            onChange={e => setVigencia(Number(e.target.value))}
            className="input w-24"
            min={2000}
          />
          <button onClick={() => setShowRegistrar(true)} className="btn-primary">
            + Registrar recurso
          </button>
        </div>}
      />

      {isLoading && <p className="text-sm text-gray-500">Cargando recursos...</p>}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Tipo', 'Rubro origen', 'Valor identificado', 'Disponible', 'Incorporado', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {recursos.map(r => (
              <RecursoRow key={r.id} recurso={r} onIncorporar={() => setIncorporarTarget(r)} />
            ))}
            {!isLoading && recursos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No hay recursos de balance para la vigencia {vigencia}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showRegistrar && (
        <RegistrarRecursoDialog
          open
          onClose={() => setShowRegistrar(false)}
        />
      )}

      {incorporarTarget && (
        <IncorporarRecursoDialog
          recurso={incorporarTarget}
          open
          onClose={() => setIncorporarTarget(null)}
        />
      )}
    </div>
  )
}

function RecursoRow({ recurso: r, onIncorporar }: { recurso: RecursoBalance; onIncorporar: () => void }) {
  const { mutate: validar, isPending: validando } = useValidarRecurso(r.id)

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">{r.tipo.replace(/_/g, ' ')}</td>
      <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate" title={r.rubroOrigenDescripcion ?? ''}>
        {r.rubroOrigenDescripcion ?? '—'}
      </td>
      <td className="px-4 py-3 font-mono">{formatCOP(r.valorIdentificado)}</td>
      <td className="px-4 py-3 font-mono">{formatCOP(r.valorDisponible)}</td>
      <td className="px-4 py-3 font-mono">{formatCOP(r.valorIncorporado)}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_RECURSO_COLOR[r.estado]}`}>
          {ESTADO_RECURSO_LABEL[r.estado]}
        </span>
      </td>
      <td className="px-4 py-3 space-x-2">
        {r.estado === 'IDENTIFICADO' && (
          <button
            onClick={() => validar(undefined)}
            disabled={validando}
            className="text-xs text-blue-600 hover:underline disabled:opacity-40"
          >
            {validando ? 'Validando...' : 'Validar'}
          </button>
        )}
        {r.estado === 'VALIDADO' && (
          <button onClick={onIncorporar} className="text-xs text-green-600 hover:underline">
            Incorporar
          </button>
        )}
      </td>
    </tr>
  )
}
