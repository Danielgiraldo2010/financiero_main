import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useRubrosGasto } from "../hook"
import { RubroGastoFormDialog } from "../../crear/ui/RubroGastoFormDialog"
import { ModificarRubroGastoDialog } from "../../modificar/ui/ModificarRubroGastoDialog"
import { useDesactivarRubroGasto } from "../../desactivar/hook"
import { useActivarRubroGasto } from "../../activar/hook"
import type { RubroGastoResponse } from "../../../model/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RubrosGastoPage() {
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const [crearOpen, setCrearOpen] = useState(false)
  const [editando, setEditando] = useState<RubroGastoResponse | null>(null)
  const { data, isLoading } = useRubrosGasto({ pagina, elementosPorPagina: 20, ...(busqueda ? { busqueda } : {}) })
  const { mutate: desactivar, isPending: desactivando } = useDesactivarRubroGasto()
  const { mutate: activar, isPending: activando } = useActivarRubroGasto()
  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1
  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader title="Rubros de Gasto" description="Catalogo de rubros presupuestales de gasto" actions={<Button onClick={() => setCrearOpen(true)}>+ Nuevo Rubro</Button>} />
      <Input placeholder="Buscar..." value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }} className="max-w-sm" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo CCP</TableHead><TableHead>Nombre</TableHead>
              <TableHead>Tipo Gasto</TableHead><TableHead>Clasificacion</TableHead>
              <TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>}
            {!isLoading && items.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sin resultados</TableCell></TableRow>}
            {items.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-sm">{r.codigoCcp}</TableCell>
                <TableCell>{r.nombre}</TableCell><TableCell>{r.tipoGasto}</TableCell>
                <TableCell>{r.clasificacionFunc}</TableCell>
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
      <RubroGastoFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && <ModificarRubroGastoDialog open={editando !== null} onClose={() => setEditando(null)} item={editando} />}
    </div>
  )
}