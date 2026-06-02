import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useBecasPosgrado } from '@/features/matriculas/becas-posgrado/listar/hook'
import { RegistrarBecaDialog } from '@/features/matriculas/becas-posgrado/registrar/ui/RegistrarBecaDialog'
import { RegistrarTransferenciaUEDialog } from '@/features/matriculas/becas-posgrado/transferir-ue/ui/RegistrarTransferenciaUEDialog'
import { formatCOP } from '@/shared/lib/currency'
import type { BecaPosgradoResponse } from '@/features/matriculas'

export const Route = createFileRoute('/_authenticated/matriculas/becas-posgrado')({
  staticData: { breadcrumb: 'Becas Posgrado' },
  component: BecasPosgradoRoute,
})

function BecasPosgradoRoute() {
  const vigencia = new Date().getFullYear()
  const { data, isLoading, isError } = useBecasPosgrado({ vigencia })
  const [openRegistrar, setOpenRegistrar] = useState(false)
  const [selectedTransferencia, setSelectedTransferencia] = useState<BecaPosgradoResponse | null>(null)

  const items = data?.items ?? []

  if (isLoading) return <div className="text-sm text-muted-foreground">Cargando becas...</div>
  if (isError) return <div className="text-sm text-destructive">Error al cargar becas.</div>

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{data?.totalItems ?? 0} becas registradas</p>
          <button
            onClick={() => setOpenRegistrar(true)}
            className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90"
          >
            + Registrar Beca
          </button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left p-2 font-medium">Convocatoria</th>
                <th className="text-left p-2 font-medium">Tipo</th>
                <th className="text-left p-2 font-medium">Programa</th>
                <th className="text-right p-2 font-medium">Beneficiarios</th>
                <th className="text-right p-2 font-medium">Valor Total</th>
                <th className="text-left p-2 font-medium">Estado</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-muted-foreground">
                    No hay becas registradas para {vigencia}.
                  </td>
                </tr>
              )}
              {items.map((b) => (
                <tr key={b.id} className="border-t hover:bg-muted/20">
                  <td className="p-2 text-xs">{b.convocatoriaMinciencias}</td>
                  <td className="p-2">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      {b.tipoBeca}
                    </span>
                  </td>
                  <td className="p-2">{b.programaNombre}</td>
                  <td className="p-2 text-right">{b.numBeneficiarios}</td>
                  <td className="p-2 text-right font-mono">{formatCOP(b.valorTotal)}</td>
                  <td className="p-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      b.estado === 'TRANSFERIDA_UE' ? 'bg-green-100 text-green-800' :
                      b.estado === 'GIRADA' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {b.estado}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    {b.estado !== 'TRANSFERIDA_UE' && (
                      <button
                        onClick={() => setSelectedTransferencia(b)}
                        className="text-xs text-primary underline underline-offset-2"
                      >
                        Registrar transferencia
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RegistrarBecaDialog open={openRegistrar} onClose={() => setOpenRegistrar(false)} />
      {selectedTransferencia && (
        <RegistrarTransferenciaUEDialog
          becaId={selectedTransferencia.id}
          open={true}
          onClose={() => setSelectedTransferencia(null)}
        />
      )}
    </>
  )
}
