import { formatCOP } from '@/shared/lib/currency'
import type { ConciliacionNomina } from '../api'

interface Props {
  resultado: ConciliacionNomina
  onClose:   () => void
}

export function ResultadoConciliacionPanel({ resultado, onClose }: Props) {
  const {
    nombreMes, vigencia, proyectoNombre,
    totalProyectado, totalLiquidadoGH, diferencia,
    estadoDiferencia, estado, requiereAjusteCdp, cdpAjusteId,
    observaciones,
  } = resultado

  const sinDiferencia = Math.abs(diferencia) < 0.01

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-gray-200 p-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-base">
            Conciliación {nombreMes} {vigencia}
          </span>
          <span className={`badge ${
            estado === 'CONCILIADO' ? 'badge-success' : 'badge-warning'
          }`}>
            {estado}
          </span>
        </div>

        <p className="text-muted text-xs">{proyectoNombre}</p>

        {/* Tabla de totales */}
        <div className="rounded-md border divide-y text-sm">
          <div className="grid grid-cols-2 px-3 py-2">
            <span className="text-muted">Total Proyectado (SF)</span>
            <span className="text-right font-mono">{formatCOP(totalProyectado)}</span>
          </div>
          <div className="grid grid-cols-2 px-3 py-2">
            <span className="text-muted">Total Liquidado GH</span>
            <span className="text-right font-mono">{formatCOP(totalLiquidadoGH)}</span>
          </div>
          <div className={`grid grid-cols-2 px-3 py-2 font-semibold ${
            sinDiferencia
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            <span>Diferencia ({estadoDiferencia})</span>
            <span className="text-right font-mono">
              {diferencia > 0 ? '+' : ''}{formatCOP(diferencia)}
            </span>
          </div>
        </div>

        {/* Advertencia ajuste CDP (07c-I4) */}
        {requiereAjusteCdp && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-medium text-amber-800">
              ⚠ Requiere ajuste de CDP
            </p>
            {cdpAjusteId && (
              <p className="text-xs text-amber-700 mt-1">
                CDP de ajuste sugerido: #{cdpAjusteId}
              </p>
            )}
            <p className="text-xs text-amber-600 mt-1">
              La diferencia supera el umbral permitido. El financiero debe gestionar el ajuste presupuestal antes de continuar.
            </p>
          </div>
        )}

        {observaciones && (
          <p className="text-xs text-muted">Obs: {observaciones}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  )
}
