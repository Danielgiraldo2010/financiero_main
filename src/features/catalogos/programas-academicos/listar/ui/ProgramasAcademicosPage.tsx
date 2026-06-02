import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useProgramasAcademicos } from "../hook"
import { ProgramaAcademicoFormDialog } from "../../crear/ui/ProgramaAcademicoFormDialog"
import { ModificarProgramaDialog } from "../../modificar/ui/ModificarProgramaDialog"
import { useDesactivarProgramaAcademico } from "../../desactivar/hook"
import { useActivarProgramaAcademico } from "../../activar/hook"
import type { ProgramaAcademicoResponse } from "../../../model/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function ProgramasAcademicosPage() {
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const [crearOpen, setCrearOpen] = useState(false)
  const [editando, setEditando] = useState<ProgramaAcademicoResponse | null>(null)
  const { data, isLoading } = useProgramasAcademicos({ pagina, elementosPorPagina: 20, ...(busqueda ? { busqueda } : {}) })
  const { mutate: desactivar, isPending: desactivando } = useDesactivarProgramaAcademico()
  const { mutate: activar, isPending: activando } = useActivarProgramaAcademico()
  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1
  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader title="Programas Academicos" description="Catalogo de programas academicos" actions={<Button onClick={() => setCrearOpen(true)}>+ Nuevo Programa</Button>} />
      <Input placeholder="Buscar programa..." value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }} className="max-w-sm" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo</TableHead><TableHead>Nombre</TableHead>
              <TableHead>Nivel</TableHead><TableHead>Facultad</TableHead>
              <TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>}
            {!isLoading && items.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sin resultados</TableCell></TableRow>}
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-sm">{p.codigo}</TableCell>
                <TableCell>{p.nombre}</TableCell><TableCell>{p.nivel}</TableCell>
                <TableCell>{p.facultadNombre ?? "—"}</TableCell>
                <TableCell><Badge variant={p.estado === "ACTIVO" ? "default" : "secondary"}>{p.estado}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditando(p)}>Editar</Button>
                    {p.estado === "ACTIVO"
                      ? <Button variant="outline" size="sm" disabled={desactivando} onClick={() => desactivar(p.id)}>Desactivar</Button>
                      : <Button variant="outline" size="sm" disabled={activando} onClick={() => activar(p.id)}>Activar</Button>}
                  </div>
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
      <ProgramaAcademicoFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && <ModificarProgramaDialog open={editando !== null} onClose={() => setEditando(null)} item={editando} />}
    </div>
  )
}