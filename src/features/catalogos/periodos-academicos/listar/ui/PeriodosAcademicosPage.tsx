import { useState } from "react"
import { useUIStore } from "@/shared/state/ui.store"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { usePeriodosAcademicos } from "../hook"
import { PeriodoAcademicoFormDialog } from "../../crear/ui/PeriodoAcademicoFormDialog"
import { ModificarPeriodoDialog } from "../../modificar/ui/ModificarPeriodoDialog"
import { useCerrarPeriodoAcademico } from "../../cerrar/hook"
import type { PeriodoAcademicoResponse } from "../../../model/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function PeriodosAcademicosPage() {
  const vigenciaActiva = useUIStore((s) => s.vigenciaActiva)
  const [pagina, setPagina] = useState(1)
  const [crearOpen, setCrearOpen] = useState(false)
  const [editando, setEditando] = useState<PeriodoAcademicoResponse | null>(null)
  const { data, isLoading } = usePeriodosAcademicos({ pagina, elementosPorPagina: 20, vigencia: vigenciaActiva })
  const { mutate: cerrar, isPending: cerrando } = useCerrarPeriodoAcademico()
  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1
  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader title="Periodos Academicos" description={`Periodos de la vigencia ${vigenciaActiva}`} actions={<Button onClick={() => setCrearOpen(true)}>+ Nuevo Periodo</Button>} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vigencia</TableHead><TableHead>Periodo</TableHead>
              <TableHead>Nombre</TableHead><TableHead>Inicio</TableHead>
              <TableHead>Fin</TableHead><TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>}
            {!isLoading && items.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Sin resultados</TableCell></TableRow>}
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.vigencia}</TableCell><TableCell>{p.periodo}</TableCell>
                <TableCell>{p.nombre}</TableCell><TableCell>{p.fechaInicio}</TableCell>
                <TableCell>{p.fechaFin}</TableCell>
                <TableCell><Badge variant={p.estado === "ACTIVO" ? "default" : "secondary"}>{p.estado}</Badge></TableCell>
                <TableCell className="text-right">
                  {p.estado === "ACTIVO" && (
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditando(p)}>Editar</Button>
                      <Button variant="outline" size="sm" disabled={cerrando} onClick={() => cerrar(p.id)}>Cerrar</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPaginas > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>Anterior</Button>
          <span className="text-sm text-muted-foreground">{pagina} / {totalPaginas}</span>
          <Button variant="outline" size="sm" disabled={pagina === totalPaginas} onClick={() => setPagina((p) => p + 1)}>Siguiente</Button>
        </div>
      )}
      <PeriodoAcademicoFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && <ModificarPeriodoDialog open={editando !== null} onClose={() => setEditando(null)} item={editando} />}
    </div>
  )
}