import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { formatCOP } from '@/shared/lib/currency'
import { useVigencias } from '@/features/catalogos/vigencias/listar/hook'
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
  const { data: vigencias = [] } = useVigencias()
  const opcionesVigencia = vigencias.length > 0 ? vigencias : [{ anio: currentYear }]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Recaudos Reales"
        description="Registro y conciliación de recursos efectivamente recibidos"
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
            <Button size="sm" onClick={() => setShowRegistrar(true)}>+ Registrar recaudo</Button>
          </div>
        }
      />

      {isLoading && <p className="text-sm text-muted-foreground">Cargando recaudos...</p>}

      <div className="overflow-x-auto rounded-[18px] border border-[#dbe3ed] bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#f8fbfe]">
            <tr>
              {['Giro', 'Entidad', 'Concepto', 'Fecha', 'Valor', 'Estado', 'Acción'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {recaudos.map(r => <RecaudoRow key={r.id} recaudo={r} />)}
            {!isLoading && recaudos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#66768a]">
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
    <tr className="hover:bg-[#f8fbfe]">
      <td className="px-4 py-3 font-mono text-xs">{r.numeroGiro}</td>
      <td className="max-w-[140px] truncate px-4 py-3" title={r.entidadPagadora}>{r.entidadPagadora}</td>
      <td className="max-w-[180px] truncate px-4 py-3" title={r.concepto}>{r.concepto}</td>
      <td className="px-4 py-3">{new Date(r.fechaGiro).toLocaleDateString('es-CO')}</td>
      <td className="px-4 py-3 font-mono">{formatCOP(r.valor)}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_COLOR[r.estado]}`}>
          {r.estado}
        </span>
      </td>
      <td className="px-4 py-3">
        {r.estado === 'PENDIENTE' && (
          <Button size="xs" variant="secondary" onClick={() => conciliar(undefined)} disabled={isPending}>
            {isPending ? 'Conciliando...' : 'Conciliar'}
          </Button>
        )}
      </td>
    </tr>
  )
}
