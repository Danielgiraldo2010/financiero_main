import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useRubrosIngreso } from "../hook"
import { RubroIngresoFormDialog } from "../../crear/ui/RubroIngresoFormDialog"
import { ModificarRubroIngresoDialog } from "../../modificar/ui/ModificarRubroIngresoDialog"
import { useDesactivarRubroIngreso } from "../../desactivar/hook"
import { useActivarRubroIngreso } from "../../activar/hook"
import type { RubroIngresoResponse } from "../../../model/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RubrosIngresoPage() {
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const [crearOpen, setCrearOpen] = useState(false)
  const [editando, setEditando] = useState<RubroIngresoResponse | null>(null)
  const { data, isLoading } = useRubrosIngreso({ pagina, elementosPorPagina: 20, ...(busqueda ? { busqueda } : {}) })
  const { mutate: desactivar, isPending: desactivando } = useDesactivarRubroIngreso()
  const { mutate: activar, isPending: activando } = useActivarRubroIngreso()
  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1
  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader title="Rubros de Ingreso" description="Catalogo de rubros presupuestales de ingreso" actions={<Button onClick={() => setCrearOpen(true)}>+ Nuevo Rubro</Button>} />
      <Input placeholder="Buscar rubro de ingreso..." value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }} className="max-w-sm" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo CICP</TableHead><TableHead>Nombre</TableHead>
              <TableHead>Categoria</TableHead><TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>}
            {!isLoading && items.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin resultados</TableCell></TableRow>}
            {items.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-sm">{r.codigoCicp}</TableCell>
                <TableCell>{r.nombre}</TableCell>
                <TableCell>{r.categoria ?? "—"}</TableCell>
                <TableCell><Badge variant={r.estado === "ACTIVO" ? "default" : "secondary"}>{r.estado}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditando(r)}>Editar</Button>
                    {r.estado === "ACTIVO"
                      ? <Button variant="outline" size="sm" disabled={desactivando} onClick={() => desactivar(r.id)}>Desactivar</Button>
                      : <Button variant="outline" size="sm" disabled={activando} onClick={() => activar(r.id)}>Activar</Button>}
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
      <RubroIngresoFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && <ModificarRubroIngresoDialog open={editando !== null} onClose={() => setEditando(null)} item={editando} />}
    </div>
  )
}