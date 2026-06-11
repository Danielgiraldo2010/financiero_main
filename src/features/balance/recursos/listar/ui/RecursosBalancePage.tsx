import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { formatCOP } from '@/shared/lib/currency'
import { useVigencias } from '@/features/catalogos/vigencias/listar/hook'
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
  const { data: vigencias = [] } = useVigencias()
  const opcionesVigencia = vigencias.length > 0 ? vigencias : [{ anio: currentYear }]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Recursos de Balance"
        description="Gestión de excedentes financieros del cierre anterior"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium text-[#42556c]">Vigencia</label>
            <select
              value={vigencia}
              onChange={e => setVigencia(Number(e.target.value))}
              className="h-9 rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white px-3 text-sm text-[#1f2937] shadow-[0_4px_12px_rgba(15,23,42,0.08)] outline-none transition-all hover:border-[#004b82] hover:bg-[#edf4fb] focus:border-[#d5bb87]"
            >
              {opcionesVigencia.map(v => (
                <option key={v.anio} value={v.anio}>{v.anio}</option>
              ))}
            </select>
            <Button size="sm" onClick={() => setShowRegistrar(true)}>+ Registrar recurso</Button>
          </div>
        }
      />

      {isLoading && <p className="text-sm text-muted-foreground">Cargando recursos...</p>}

      <div className="overflow-x-auto rounded-[18px] border border-[#dbe3ed] bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#f8fbfe]">
            <tr>
              {['Tipo', 'Rubro origen', 'Valor identificado', 'Disponible', 'Incorporado', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {recursos.map(r => (
              <RecursoRow key={r.id} recurso={r} onIncorporar={() => setIncorporarTarget(r)} />
            ))}
            {!isLoading && recursos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#66768a]">
                  No hay recursos de balance para la vigencia {vigencia}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showRegistrar && <RegistrarRecursoDialog open onClose={() => setShowRegistrar(false)} />}
      {incorporarTarget && (
        <IncorporarRecursoDialog recurso={incorporarTarget} open onClose={() => setIncorporarTarget(null)} />
      )}
    </div>
  )
}

function RecursoRow({ recurso: r, onIncorporar }: { recurso: RecursoBalance; onIncorporar: () => void }) {
  const { mutate: validar, isPending: validando } = useValidarRecurso(r.id)
  return (
    <tr className="hover:bg-[#f8fbfe]">
      <td className="px-4 py-3">{r.tipo.replace(/_/g, ' ')}</td>
      <td className="max-w-[180px] truncate px-4 py-3 text-xs text-[#66768a]" title={r.rubroOrigenDescripcion ?? ''}>
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
          <Button size="xs" variant="secondary" onClick={() => validar(undefined)} disabled={validando}>
            {validando ? 'Validando...' : 'Validar'}
          </Button>
        )}
        {r.estado === 'VALIDADO' && (
          <Button size="xs" variant="outline" onClick={onIncorporar}>Incorporar</Button>
        )}
      </td>
    </tr>
  )
}
