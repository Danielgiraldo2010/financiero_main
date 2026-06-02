import { useState } from "react"
import { useUIStore } from "@/shared/state/ui.store"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useFechasLimite } from "../hook"
import { FechaLimiteFormDialog } from "../../crear/ui/FechaLimiteFormDialog"
import { ModificarFechaLimiteDialog } from "../../modificar/ui/ModificarFechaLimiteDialog"
import { useEliminarFechaLimite } from "../../eliminar/hook"
import type { FechaLimiteResponse } from "../../../model/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function FechasLimitePage() {
  const vigenciaActiva = useUIStore((s) => s.vigenciaActiva)
  const [pagina, setPagina] = useState(1)
  const [crearOpen, setCrearOpen] = useState(false)
  const [editando, setEditando] = useState<FechaLimiteResponse | null>(null)
  const { data, isLoading } = useFechasLimite({ pagina, elementosPorPagina: 20, vigencia: vigenciaActiva })
  const { mutate: eliminar, isPending: eliminando } = useEliminarFechaLimite()
  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1
  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader title="Fechas Limite" description={`Fechas clave para la vigencia ${vigenciaActiva}`} actions={<Button onClick={() => setCrearOpen(true)}>+ Nueva Fecha</Button>} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead><TableHead>Nombre</TableHead>
              <TableHead>Fecha Limite</TableHead><TableHead>Recordatorio</TableHead>
              <TableHead>UE</TableHead><TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>}
            {!isLoading && items.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sin resultados</TableCell></TableRow>}
            {items.map((fl) => (
              <TableRow key={fl.id}>
                <TableCell>{fl.tipoLimite}</TableCell><TableCell>{fl.nombre}</TableCell>
                <TableCell>{fl.fechaLimite}</TableCell><TableCell>{fl.fechaRecordatorio ?? "—"}</TableCell>
                <TableCell>{fl.unidadEjecutoraNombre ?? "Global"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditando(fl)}>Editar</Button>
                    <Button variant="outline" size="sm" disabled={eliminando} onClick={() => eliminar(fl.id)}>Eliminar</Button>
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
      <FechaLimiteFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && <ModificarFechaLimiteDialog open={editando !== null} onClose={() => setEditando(null)} item={editando} />}
    </div>
  )
}