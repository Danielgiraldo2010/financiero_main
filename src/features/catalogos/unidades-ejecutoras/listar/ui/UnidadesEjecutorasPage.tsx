import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useUnidadesEjecutoras } from "../hook"
import { UnidadEjecutoraFormDialog } from "../../crear/ui/UnidadEjecutoraFormDialog"
import { ModificarUEDialog } from "../../modificar/ui/ModificarUEDialog"
import { useDesactivarUnidadEjecutora } from "../../desactivar/hook"
import { useActivarUnidadEjecutora } from "../../activar/hook"
import type { UnidadEjecutoraResponse } from "../../../model/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function UnidadesEjecutorasPage() {
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const [crearOpen, setCrearOpen] = useState(false)
  const [editando, setEditando] = useState<UnidadEjecutoraResponse | null>(null)

  const { data, isLoading } = useUnidadesEjecutoras({
    pagina, elementosPorPagina: 20, ...(busqueda ? { busqueda } : {}),
  })
  const { mutate: desactivar, isPending: desactivando } = useDesactivarUnidadEjecutora()
  const { mutate: activar, isPending: activando } = useActivarUnidadEjecutora()

  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        title="Unidades Ejecutoras"
        description="Gestiona las unidades ejecutoras del sistema"
        actions={<Button onClick={() => setCrearOpen(true)}>+ Nueva UE</Button>}
      />
      <Input
        placeholder="Buscar por nombre o codigo..."
        value={busqueda}
        onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Superior</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>
            )}
            {!isLoading && items.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sin resultados</TableCell></TableRow>
            )}
            {items.map((ue) => (
              <TableRow key={ue.id}>
                <TableCell className="font-mono text-sm">{ue.codigo}</TableCell>
                <TableCell>{ue.nombre}</TableCell>
                <TableCell>{ue.nivel}</TableCell>
                <TableCell>{ue.padreNombre ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={ue.estado === "ACTIVO" ? "default" : "secondary"}>{ue.estado}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditando(ue)}>Editar</Button>
                    {ue.estado === "ACTIVO" ? (
                      <Button variant="outline" size="sm" disabled={desactivando} onClick={() => desactivar(ue.id)}>Desactivar</Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled={activando} onClick={() => activar(ue.id)}>Activar</Button>
                    )}
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
      <UnidadEjecutoraFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && (
        <ModificarUEDialog open={editando !== null} onClose={() => setEditando(null)} ue={editando} />
      )}
    </div>
  )
}
