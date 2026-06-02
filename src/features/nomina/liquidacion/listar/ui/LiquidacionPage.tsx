import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { formatCOP } from '@/shared/lib/currency'
import { useLiquidaciones } from '../hook'
import { LiquidarNominaDialog } from '../../liquidar/ui/LiquidarNominaDialog'
import { ConfirmarPagoDialog } from '../../confirmar-pago/ui/ConfirmarPagoDialog'
import type { NominaEmpleado } from '../api'

export function LiquidacionPage() {
  const [openLiquidar, setOpenLiquidar] = useState(false)
  const [nominaAPagar, setNominaAPagar] = useState<NominaEmpleado | null>(null)
  const [expandedId, setExpandedId]     = useState<number | null>(null)
  const [vigencia, setVigencia]         = useState<number>(new Date().getFullYear())
  const [mes, setMes]                   = useState<number>(new Date().getMonth() + 1)

  const { data, isLoading, isError } = useLiquidaciones({ vigencia, mes })

  return (
    <div className="space-y-4">
      <PageHeader
        title="Liquidación de Nómina"
        actions={
          <button className="btn-primary" onClick={() => setOpenLiquidar(true)}>
            Liquidar
          </button>
        }
      />

      {/* Filtros */}
      <div className="flex gap-3 items-end border-b pb-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Vigencia
          </label>
          <input
            type="number"
            className="input w-28"
            value={vigencia}
            min={2020}
            max={2099}
            onChange={(e) => setVigencia(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Mes
          </label>
          <input
            type="number"
            className="input w-20"
            value={mes}
            min={1}
            max={12}
            onChange={(e) => setMes(Number(e.target.value))}
          />
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted">Cargando…</p>}
      {isError && (
        <p className="text-sm text-red-600">Error al cargar liquidaciones.</p>
      )}

      {data && data.items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No hay liquidaciones para {mes}/{vigencia}.
        </p>
      )}

      {data && data.items.length > 0 && (
        <div className="space-y-2">
          {data.items.map((n) => (
            <div key={n.id} className="rounded-md border border-gray-200 bg-white">
              <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{n.empleadoNombre}</p>
                  <p className="text-xs text-muted">{n.tipoNomina}</p>
                </div>
                <div>
                  <p>{n.nombreMes} {n.vigencia} · {n.diasLaborados} días</p>
                  <p className="text-xs text-muted">
                    Dev: {formatCOP(n.totalDevengado)} · Ded: {formatCOP(n.totalDeducciones)}
                  </p>
                </div>
                <p className="font-semibold">{formatCOP(n.totalNeto)}</p>
                <span className={
                  n.estado === 'PAGADO'
                    ? 'badge-success'
                    : n.estado === 'LIQUIDADO'
                      ? 'badge-warning'
                      : 'badge-neutral'
                }>
                  {n.estado}
                </span>
                <div className="flex gap-2">
                  {n.estado === 'LIQUIDADO' && (
                    <button
                      className="btn-ghost text-xs text-green-700"
                      onClick={() => setNominaAPagar(n)}
                    >
                      Confirmar Pago
                    </button>
                  )}
                  <button
                    className="btn-ghost text-xs"
                    onClick={() => setExpandedId((p) => (p === n.id ? null : n.id))}
                  >
                    {expandedId === n.id ? '▲' : '▼'} Detalle
                  </button>
                </div>
              </div>

              {/* Detalle de conceptos */}
              {expandedId === n.id && n.detalle.length > 0 && (
                <div className="border-t border-gray-100 px-4 pb-3 pt-2">
                  <table className="table w-full text-xs">
                    <thead>
                      <tr>
                        <th>Concepto</th>
                        <th>Tipo</th>
                        <th>Base Cálculo</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {n.detalle.map((d) => (
                        <tr
                          key={d.id}
                          className={d.tipoConcepto === 'DEDUCCION' ? 'text-red-700' : ''}
                        >
                          <td>{d.conceptoNombre}</td>
                          <td>{d.tipoConcepto}</td>
                          <td>{d.baseCalculo != null ? formatCOP(d.baseCalculo) : '—'}</td>
                          <td className="font-mono">{formatCOP(d.valor)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <LiquidarNominaDialog
        open={openLiquidar}
        onClose={() => setOpenLiquidar(false)}
      />

      {nominaAPagar && (
        <ConfirmarPagoDialog
          nominaEmpleadoId={nominaAPagar.id}
          empleadoNombre={nominaAPagar.empleadoNombre}
          totalNeto={nominaAPagar.totalNeto}
          open={nominaAPagar !== null}
          onClose={() => setNominaAPagar(null)}
        />
      )}
    </div>
  )
}