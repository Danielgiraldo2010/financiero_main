// src/features/proyectos/presupuesto/lineas/ui/PresupuestoProyectoTab.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react"
import { useLineasPresupuesto } from "../hook"
import { useIniciarPresupuesto } from "../../iniciar/hook"
import { AprobacionesPanel } from "../../aprobaciones/ui/AprobacionesPanel"
import { LineasIngresoTable } from "./LineasIngresoTable"
import { LineasGastoTable } from "./LineasGastoTable"
import type { Proyecto } from "@/features/proyectos/model/types"

interface CatalogosProps {
  rubrosIngreso:  { id: number; nombre: string }[]
  rubrosGasto:    { id: number; nombre: string }[]
  fuentesRecurso: { id: number; nombre: string }[]
}
interface PresupuestoProyectoTabProps extends CatalogosProps { proyecto: Proyecto }
type SubTab = "ingresos" | "gastos" | "resumen"

const formatCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v)

export function PresupuestoProyectoTab({ proyecto, rubrosIngreso, rubrosGasto, fuentesRecurso }: PresupuestoProyectoTabProps) {
  const [subTab, setSubTab] = useState<SubTab>("ingresos")
  const vigencia = proyecto.vigenciaActiva ?? new Date().getFullYear()
  const { data: presupuesto, isLoading, error } = useLineasPresupuesto(proyecto.id, vigencia)
  const iniciar = useIniciarPresupuesto(proyecto.id)

  if (isLoading) return (
    <div className="space-y-3"><Skeleton className="h-24 w-full" /><Skeleton className="h-64 w-full" /></div>
  )
  if (error && !error.message.includes("404")) return (
    <div className="flex items-center gap-2 rounded border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      <AlertCircle className="h-4 w-4 shrink-0" />{error.message}
    </div>
  )
  if (!presupuesto || presupuesto.estado === "SIN_PRESUPUESTO") return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <ArrowRightLeft className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">Sin presupuesto iniciado</p>
        <p className="text-sm text-muted-foreground mt-1">Vigencia {vigencia}</p>
      </div>
      {proyecto.estado === "ACTIVO"
        ? <Button onClick={() => iniciar.mutate({ vigencia })} disabled={iniciar.isPending}>
            {iniciar.isPending ? "Iniciando..." : "Iniciar Borrador"}
          </Button>
        : <p className="text-sm text-muted-foreground">El proyecto debe estar <strong>ACTIVO</strong>.</p>
      }
      {iniciar.error && <p className="text-sm text-destructive">{iniciar.error.message}</p>}
    </div>
  )

  const editable   = presupuesto.estado === "BORRADOR" || presupuesto.estado === "REVISADO"
  const diferencia = presupuesto.balance

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">

      {/* ── Izquierda: subtabs + tablas ── */}
      <div className="space-y-0 min-w-0">
        {/* Subtabs con identidad de color */}
        <div className="sf-tabs-shell">
          <div className="sf-tabs-nav">
          {/* Ingresos — verde */}
          <button type="button" onClick={() => setSubTab("ingresos")}
            className={[
              "sf-tab flex items-center gap-1.5",
              subTab === "ingresos"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "hover:text-emerald-800",
            ].join(" ")}>
            <TrendingUp className="h-3.5 w-3.5" />
            Ingresos
            {presupuesto.totalIngresosProy > 0 && (
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs tabular-nums text-emerald-700">
                {formatCOP(presupuesto.totalIngresosProy)}
              </span>
            )}
          </button>

          {/* Gastos — rosa */}
          <button type="button" onClick={() => setSubTab("gastos")}
            className={[
              "sf-tab flex items-center gap-1.5",
              subTab === "gastos"
                ? "border-rose-600 bg-rose-50 text-rose-800"
                : "hover:text-rose-800",
            ].join(" ")}>
            <TrendingDown className="h-3.5 w-3.5" />
            Gastos
            {presupuesto.totalGastosProy > 0 && (
              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-xs tabular-nums text-rose-700">
                {formatCOP(presupuesto.totalGastosProy)}
              </span>
            )}
          </button>

          {/* Resumen */}
          <button type="button" onClick={() => setSubTab("resumen")}
            className={[
              "sf-tab flex items-center gap-1.5",
              subTab === "resumen"
                ? "sf-tab-active"
                : "",
            ].join(" ")}>
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Resumen
          </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="pt-4">
          {subTab === "ingresos" && (
            <LineasIngresoTable
              proyectoId={proyecto.id} vigencia={vigencia}
              lineas={presupuesto.ingresos} estadoPresupuesto={presupuesto.estado}
              rubrosIngreso={rubrosIngreso} fuentesRecurso={fuentesRecurso}
              editable={editable}
            />
          )}
          {subTab === "gastos" && (
            <LineasGastoTable
              proyectoId={proyecto.id} vigencia={vigencia}
              lineas={presupuesto.gastos} estadoPresupuesto={presupuesto.estado}
              rubrosGasto={rubrosGasto} fuentesRecurso={fuentesRecurso}
              editable={editable}
            />
          )}
          {subTab === "resumen" && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Card className="border-emerald-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <p className="text-xs text-muted-foreground">Total ingresos</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-700 tabular-nums">{formatCOP(presupuesto.totalIngresosProy)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{presupuesto.ingresos.length} línea{presupuesto.ingresos.length !== 1 ? "s" : ""}</p>
                  </CardContent>
                </Card>
                <Card className="border-rose-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="h-4 w-4 text-rose-600" />
                      <p className="text-xs text-muted-foreground">Total gastos</p>
                    </div>
                    <p className="text-lg font-bold text-rose-700 tabular-nums">{formatCOP(presupuesto.totalGastosProy)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{presupuesto.gastos.length} línea{presupuesto.gastos.length !== 1 ? "s" : ""}</p>
                  </CardContent>
                </Card>
                <Card className={diferencia < 0 ? "border-amber-300" : "border-emerald-200"}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Diferencia</p>
                    </div>
                    <p className={`text-lg font-bold tabular-nums ${diferencia < 0 ? "text-amber-600" : "text-emerald-700"}`}>
                      {formatCOP(diferencia)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {diferencia === 0 ? "Equilibrado ✓" : diferencia > 0 ? "Superávit" : "Déficit"}
                    </p>
                  </CardContent>
                </Card>
              </div>
              {diferencia !== 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Presupuesto con {diferencia > 0 ? "superávit" : "déficit"} de {formatCOP(Math.abs(diferencia))}.
                    Se recomienda balancear antes de aprobar.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Derecha: panel de aprobaciones ── */}
      <div>
        <AprobacionesPanel
          proyectoId={proyecto.id}
          vigencia={vigencia}
          estadoPresupuesto={presupuesto.estado}
          {...(presupuesto.siguientePaso !== undefined && { siguientePaso: presupuesto.siguientePaso })}
        />
      </div>
    </div>
  )
}
