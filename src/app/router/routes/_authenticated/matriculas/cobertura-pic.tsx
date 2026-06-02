import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useCoberturasPic } from '@/features/matriculas/cobertura-pic/listar/hook'
import { useConfirmarGiroPic } from '@/features/matriculas/cobertura-pic/confirmar-giro/hook'
import { RegistrarCoberturaDialog } from '@/features/matriculas/cobertura-pic/registrar/ui/RegistrarCoberturaDialog'
import { ConfirmarGiroDialog } from '@/features/matriculas/cobertura-pic/confirmar-giro/ui/ConfirmarGiroDialog'
import { formatCOP } from '@/shared/lib/currency'
import type { CoberturaPickResponse } from '@/features/matriculas'

export const Route = createFileRoute('/_authenticated/matriculas/cobertura-pic')({
  staticData: { breadcrumb: 'Cobertura PIC' },
  component: CoberturaPicRoute,
})

function CoberturaPicRoute() {
  const vigencia = new Date().getFullYear()
  const { data, isLoading, isError } = useCoberturasPic(vigencia)
  const [openRegistrar, setOpenRegistrar] = useState(false)
  const [selectedGiro, setSelectedGiro] = useState<CoberturaPickResponse | null>(null)

  const items = data?.items ?? []

  if (isLoading) return <div className="text-sm text-muted-foreground">Cargando cobertura PIC...</div>
  if (isError) return <div className="text-sm text-destructive">Error al cargar cobertura PIC.</div>

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{data?.totalItems ?? 0} coberturas registradas</p>
          <button
            onClick={() => setOpenRegistrar(true)}
            className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90"
          >
            + Registrar Cobertura PIC
          </button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left p-2 font-medium">Programa</th>
                <th className="text-left p-2 font-medium">Municipio</th>
                <th className="text-left p-2 font-medium">Período</th>
                <th className="text-right p-2 font-medium">Estudiantes</th>
                <th className="text-right p-2 font-medium">% Cobertura</th>
                <th className="text-right p-2 font-medium">Valor PIC</th>
                <th className="text-left p-2 font-medium">Estado Giro</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-muted-foreground">
                    No hay coberturas PIC registradas para {vigencia}.
                  </td>
                </tr>
              )}
              {items.map((c) => (
                <tr key={c.id} className="border-t hover:bg-muted/20">
                  <td className="p-2">{c.programaNombre}</td>
                  <td className="p-2">{c.municipioNombre}</td>
                  <td className="p-2">{c.periodo}</td>
                  <td className="p-2 text-right">{c.numEstudiantesBeneficiarios}</td>
                  <td className="p-2 text-right">{`${c.porcentajeCobertura.toFixed(1)}%`}</td>
                  <td className="p-2 text-right font-mono">{formatCOP(c.valorTotalPic)}</td>
                  <td className="p-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.estadoGiro === 'CONFIRMADO' ? 'bg-green-100 text-green-800' :
                      c.estadoGiro === 'GIRADO' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {c.estadoGiro}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    {c.estadoGiro === 'PENDIENTE' && (
                      <button
                        onClick={() => setSelectedGiro(c)}
                        className="text-xs text-primary underline underline-offset-2"
                      >
                        Confirmar Giro
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RegistrarCoberturaDialog open={openRegistrar} onClose={() => setOpenRegistrar(false)} />
      {selectedGiro && (
        <ConfirmarGiroDialog
          coberturaId={selectedGiro.id}
          open={true}
          onClose={() => setSelectedGiro(null)}
        />
      )}
    </>
  )
}
