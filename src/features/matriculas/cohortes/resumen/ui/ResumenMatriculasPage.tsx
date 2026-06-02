import { useState } from "react"
import { useResumenMatriculas } from "../hook"
import { useTenant } from "@/shared/hooks/useTenant"
import { TIPOS_MATRICULA } from "../../../model/constants"
import { formatCOP } from "@/shared/lib/currency"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { SelectField } from "@/shared/ui/forms/SelectField"

/**
 * INVARIANTE I4: tab-pivot por tipoMatricula con totales
 * INVARIANTE I6: muestra exactamente los 7 tipos del Manual
 */
export function ResumenMatriculasPage() {
  const currentYear = new Date().getFullYear()
  const [vigencia, setVigencia] = useState(currentYear)
  const [periodo, setPeriodo] = useState<string | undefined>(undefined)
  const [tabActivo, setTabActivo] = useState<string>("TODOS")

  const { tenantActivo } = useTenant()
  const unidadEjecutoraId = tenantActivo?.id ?? 0

  const { data, isLoading, isError } = useResumenMatriculas(vigencia, periodo, unidadEjecutoraId)

  const tiposConDatos = data?.porTipo ?? []

  // INVARIANTE I6: incluir todos los 7 tipos aunque tengan 0
  const resumenCompleto = TIPOS_MATRICULA.map((tipo) => {
    const encontrado = tiposConDatos.find((t) => t.tipoMatricula === tipo.value)
    return {
      tipoMatricula: tipo.value,
      descripcion: tipo.label,
      numEstudiantes: encontrado?.numEstudiantes ?? 0,
      valorTotal: encontrado?.valorTotal ?? 0,
      porcentaje: encontrado?.porcentaje ?? 0,
    }
  })

  const tipoActivo = resumenCompleto.find((t) => t.tipoMatricula === tabActivo)

  return (
    <div className="space-y-6 p-4">
      <PageHeader title="Resumen de Matrículas e Ingresos" />
      <div className="flex items-center justify-end gap-2">
        <div className="flex gap-2">
          <SelectField
            options={[currentYear - 1, currentYear, currentYear + 1].map((y) => ({ value: String(y), label: String(y) }))}
            value={String(vigencia)}
            onChange={(v) => setVigencia(Number(v))}
          />
          <SelectField
            options={[
              { value: "", label: "Todos los períodos" },
              { value: "1", label: "Período 1" },
              { value: "2", label: "Período 2" },
            ]}
            value={periodo ?? ""}
            onChange={(v) => setPeriodo(v || undefined)}
            placeholder="Todos los períodos"
          />
        </div>
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Cargando resumen...</div>}
      {isError && <div className="text-sm text-destructive">Error al cargar el resumen.</div>}

      {data && (
        <>
          {/* Totales globales */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Total Estudiantes</p>
              <p className="text-2xl font-bold">{data.totalEstudiantes.toLocaleString()}</p>
            </div>
            <div className="border rounded-lg p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Total Ingresos</p>
              <p className="text-2xl font-bold">{formatCOP(data.totalIngresos)}</p>
            </div>
            <div className="border rounded-lg p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Unidad Ejecutora</p>
              <p className="text-lg font-semibold">{data.unidadEjecutora}</p>
            </div>
          </div>

          {/* INVARIANTE I4: Tab-pivot por tipo */}
          <div>
            <div className="flex gap-1 border-b overflow-x-auto">
              <button
                onClick={() => setTabActivo("TODOS")}
                className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  tabActivo === "TODOS"
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Todos
              </button>
              {TIPOS_MATRICULA.map((tipo) => (
                <button
                  key={tipo.value}
                  onClick={() => setTabActivo(tipo.value)}
                  className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
                    tabActivo === tipo.value
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tipo.label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {tabActivo === "TODOS" ? (
                // Vista consolidada — INVARIANTE I6: los 7 tipos
                <table className="w-full text-sm border rounded-md overflow-hidden">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left p-2 font-medium">Tipo Matrícula</th>
                      <th className="text-right p-2 font-medium">Estudiantes</th>
                      <th className="text-right p-2 font-medium">Valor Total</th>
                      <th className="text-right p-2 font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumenCompleto.map((row) => (
                      <tr key={row.tipoMatricula} className="border-t hover:bg-muted/20">
                        <td className="p-2 font-medium">{row.descripcion}</td>
                        <td className="p-2 text-right">{row.numEstudiantes.toLocaleString()}</td>
                        <td className="p-2 text-right font-mono">{formatCOP(row.valorTotal)}</td>
                        <td className="p-2 text-right">{`${row.porcentaje.toFixed(1)}%`}</td>
                      </tr>
                    ))}
                    {/* Totales */}
                    <tr className="border-t bg-muted/20 font-semibold">
                      <td className="p-2">TOTAL</td>
                      <td className="p-2 text-right">{data.totalEstudiantes.toLocaleString()}</td>
                      <td className="p-2 text-right font-mono">{formatCOP(data.totalIngresos)}</td>
                      <td className="p-2 text-right">100%</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                // Vista de tipo específico
                tipoActivo && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 space-y-1">
                      <p className="text-sm text-muted-foreground">Estudiantes</p>
                      <p className="text-2xl font-bold">{tipoActivo.numEstudiantes.toLocaleString()}</p>
                    </div>
                    <div className="border rounded-lg p-4 space-y-1">
                      <p className="text-sm text-muted-foreground">Valor Total</p>
                      <p className="text-2xl font-bold">{formatCOP(tipoActivo.valorTotal)}</p>
                    </div>
                    <div className="border rounded-lg p-4 space-y-1">
                      <p className="text-sm text-muted-foreground">% del Total</p>
                      <p className="text-2xl font-bold">{`${tipoActivo.porcentaje.toFixed(1)}%`}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
