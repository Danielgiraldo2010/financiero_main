import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useDescuentos } from "../hook"
import { DescuentoFormDialog } from "../../crear/ui/DescuentoFormDialog"
import { ModificarDescuentoDialog } from "../../modificar/ui/ModificarDescuentoDialog"
import { useEliminarDescuento } from "../../eliminar/hook"
import type { DescuentoResponse } from "../../../model/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DescuentosPage() {
  const [pagina, setPagina] = useState(1)
  const [crearOpen, setCrearOpen] = useState(false)
  const [editando, setEditando] = useState<DescuentoResponse | null>(null)
  const { data, isLoading } = useDescuentos({ pagina, elementosPorPagina: 20 })
  const { mutate: eliminar, isPending: eliminando } = useEliminarDescuento()
  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1
  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader title="Descuentos" description="Catalogo de tipos de descuento aplicables a matriculas" actions={<Button onClick={() => setCrearOpen(true)}>+ Nuevo Descuento</Button>} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead><TableHead>Porcentaje</TableHead>
              <TableHead>Descripcion</TableHead><TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>}
            {!isLoading && items.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Sin resultados</TableCell></TableRow>}
            {items.map((d) => (
              <TableRow key={d.idDescuento}>
                <TableCell>{d.nombre}</TableCell>
                <TableCell>{d.porcentaje}%</TableCell>
                <TableCell className="text-muted-foreground">{d.descripcion ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditando(d)}>Editar</Button>
                    <Button variant="outline" size="sm" disabled={eliminando} onClick={() => eliminar(d.idDescuento)}>Eliminar</Button>
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
      <DescuentoFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && <ModificarDescuentoDialog open={editando !== null} onClose={() => setEditando(null)} item={editando} />}
    </div>
  )
}