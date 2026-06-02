import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useApoyosMatricula } from "../hook"
import { ApoyoMatriculaFormDialog } from "../../crear/ui/ApoyoMatriculaFormDialog"
import { ModificarApoyoDialog } from "../../modificar/ui/ModificarApoyoDialog"
import type { ApoyoMatriculaResponse } from "../../../model/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ApoyosMatriculaPage() {
  const [pagina, setPagina] = useState(1)
  const [crearOpen, setCrearOpen] = useState(false)
  const [editando, setEditando] = useState<ApoyoMatriculaResponse | null>(null)
  const { data, isLoading } = useApoyosMatricula({ pagina, elementosPorPagina: 20 })
  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1
  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader title="Apoyos de Matricula" description="Catalogo de apoyos y auxilios para estudiantes" actions={<Button onClick={() => setCrearOpen(true)}>+ Nuevo Apoyo</Button>} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo</TableHead><TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead><TableHead>Rubro Ingreso</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>}
            {!isLoading && items.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin resultados</TableCell></TableRow>}
            {items.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-mono text-sm">{a.codigo}</TableCell>
                <TableCell>{a.nombre}</TableCell><TableCell>{a.tipo}</TableCell>
                <TableCell>{a.rubroIngresoNombre ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setEditando(a)}>Editar</Button>
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
      <ApoyoMatriculaFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && <ModificarApoyoDialog open={editando !== null} onClose={() => setEditando(null)} item={editando} />}
    </div>
  )
}