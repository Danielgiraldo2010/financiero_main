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
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Unidades Ejecutoras"
        description="Gestiona las unidades ejecutoras del sistema"
        actions={<Button size="sm" onClick={() => setCrearOpen(true)}>+ Nueva UE</Button>}
      />
      <Input
        placeholder="Buscar por nombre o código..."
        value={busqueda}
        onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }}
        className="max-w-sm"
      />
      <div className="overflow-x-auto rounded-[18px] border border-[#dbe3ed] bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f8fbfe] hover:bg-[#f8fbfe]">
              <TableHead className="w-24 px-3 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">Código</TableHead>
              <TableHead className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">Nombre</TableHead>
              <TableHead className="w-16 px-3 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">Nivel</TableHead>
              <TableHead className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">Superior</TableHead>
              <TableHead className="w-24 min-w-[80px] px-3 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">Estado</TableHead>
              <TableHead className="w-32 px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-[#4b5c70]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">Cargando...</TableCell></TableRow>
            )}
            {!isLoading && items.length === 0 && (
              <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">Sin resultados</TableCell></TableRow>
            )}
            {items.map((ue) => (
              <TableRow key={ue.id} className="hover:bg-[#f8fbfe]">
                <TableCell className="px-3 py-3 font-mono text-sm text-[#1f2937]">{ue.codigo}</TableCell>
                <TableCell className="px-3 py-3">
                  <span className="block text-sm font-medium leading-snug text-[#1f2937]">{ue.nombre}</span>
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-[#4b5c70]">{ue.nivel}</TableCell>
                <TableCell className="px-3 py-3">
                  <span className="block text-sm leading-snug text-[#4b5c70] break-words">{ue.padreNombre ?? '—'}</span>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <Badge variant={ue.estado === 'ACTIVO' ? 'default' : 'secondary'}>{ue.estado}</Badge>
                </TableCell>
                <TableCell className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="outline" size="xs" onClick={() => setEditando(ue)}>Editar</Button>
                    {ue.estado === 'ACTIVO' ? (
                      <Button variant="outline" size="xs" disabled={desactivando} onClick={() => desactivar(ue.id)}>Desactivar</Button>
                    ) : (
                      <Button variant="outline" size="xs" disabled={activando} onClick={() => activar(ue.id)}>Activar</Button>
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
          <Button variant="secondary" size="sm" disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>Anterior</Button>
          <span className="text-sm text-muted-foreground">{pagina} / {totalPaginas}</span>
          <Button variant="secondary" size="sm" disabled={pagina === totalPaginas} onClick={() => setPagina((p) => p + 1)}>Siguiente</Button>
        </div>
      )}
      <UnidadEjecutoraFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && (
        <ModificarUEDialog open={editando !== null} onClose={() => setEditando(null)} ue={editando} />
      )}
    </div>
  )
}
