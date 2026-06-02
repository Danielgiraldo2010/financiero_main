import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useFuentesRecursos } from "../hook"
import { FuenteRecursoFormDialog } from "../../crear/ui/FuenteRecursoFormDialog"
import { ModificarFuenteDialog } from "../../modificar/ui/ModificarFuenteDialog"
import type { FuenteRecursoResponse } from "../../../model/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function FuentesRecursosPage() {
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const [crearOpen, setCrearOpen] = useState(false)
  const [editando, setEditando] = useState<FuenteRecursoResponse | null>(null)
  const { data, isLoading } = useFuentesRecursos({ pagina, elementosPorPagina: 20, ...(busqueda ? { busqueda } : {}) })
  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1
  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader title="Fuentes de Recursos" description="Catalogo de fuentes de recursos presupuestales" actions={<Button onClick={() => setCrearOpen(true)}>+ Nueva Fuente</Button>} />
      <Input placeholder="Buscar fuente..." value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }} className="max-w-sm" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo</TableHead><TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead><TableHead>Descripcion</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>}
            {!isLoading && items.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin resultados</TableCell></TableRow>}
            {items.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-mono text-sm">{f.codigo}</TableCell>
                <TableCell>{f.nombre}</TableCell><TableCell>{f.tipo}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{f.descripcion ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setEditando(f)}>Editar</Button>
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
      <FuenteRecursoFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && <ModificarFuenteDialog open={editando !== null} onClose={() => setEditando(null)} item={editando} />}
    </div>
  )
}