import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTransferencias } from '@/features/matriculas/transferencias/listar/hook'
import { ConfirmarRecepcionDialog } from '@/features/matriculas/transferencias/confirmar/ui/ConfirmarRecepcionDialog'
import { formatCOP } from '@/shared/lib/currency'
import type { TransferenciaInternaResponse } from '@/features/matriculas'

export const Route = createFileRoute('/_authenticated/matriculas/transferencias')({
  staticData: { breadcrumb: 'Transferencias' },
  component: TransferenciasRoute,
})

function TransferenciasRoute() {
  const vigencia = new Date().getFullYear()
  const { data, isLoading, isError } = useTransferencias({ vigencia })
  const [selected, setSelected] = useState<TransferenciaInternaResponse | null>(null)

  const items = data?.items ?? []

  if (isLoading) return <div className="text-sm text-muted-foreground">Cargando transferencias...</div>
  if (isError) return <div className="text-sm text-destructive">Error al cargar transferencias.</div>

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{data?.totalItems ?? 0} transferencias registradas</p>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left p-2 font-medium">Unidad Destino</th>
                <th className="text-left p-2 font-medium">Tipo</th>
                <th className="text-left p-2 font-medium">Período</th>
                <th className="text-right p-2 font-medium">Valor</th>
                <th className="text-right p-2 font-medium">Recibido</th>
                <th className="text-left p-2 font-medium">Estado</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-muted-foreground">
                    No hay transferencias para {vigencia}.
                  </td>
                </tr>
              )}
              {items.map((t) => (
                <tr key={t.id} className="border-t hover:bg-muted/20">
                  <td className="p-2">{t.unidadEjecutoraNombre}</td>
                  <td className="p-2 text-xs">{t.tipoTransferenciaDesc}</td>
                  <td className="p-2">{t.periodo}</td>
                  <td className="p-2 text-right font-mono">{formatCOP(t.valor)}</td>
                  <td className="p-2 text-right font-mono">{formatCOP(t.valorRecibido)}</td>
                  <td className="p-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      t.estado === 'CONFIRMADO' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.estado}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    {t.estado !== 'CONFIRMADO' && (
                      <button
                        onClick={() => setSelected(t)}
                        className="text-xs text-primary underline underline-offset-2"
                      >
                        Confirmar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <ConfirmarRecepcionDialog
          transferenciaId={selected.id}
          valorEsperado={selected.valor}
          open={true}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
