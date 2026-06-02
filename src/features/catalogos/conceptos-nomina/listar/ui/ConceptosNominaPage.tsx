import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useConceptosNomina } from "../hook"
import { ConceptoNominaFormDialog } from "../../crear/ui/ConceptoNominaFormDialog"
import { ModificarConceptoDialog } from "../../modificar/ui/ModificarConceptoDialog"
import { useDesactivarConceptoNomina } from "../../desactivar/hook"
import { useActivarConceptoNomina } from "../../activar/hook"
import type { ConceptoNominaResponse } from "../../../model/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

export function ConceptosNominaPage() {
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const [crearOpen, setCrearOpen] = useState(false)
  const [editando, setEditando] = useState<ConceptoNominaResponse | null>(null)
  const { data, isLoading } = useConceptosNomina({ pagina, elementosPorPagina: 20, ...(busqueda ? { busqueda } : {}) })
  const { mutate: desactivar, isPending: desactivando } = useDesactivarConceptoNomina()
  const { mutate: activar, isPending: activando } = useActivarConceptoNomina()
  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1
  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader title="Conceptos de Nomina" description="Catalogo de conceptos para liquidacion de nomina" actions={<Button onClick={() => setCrearOpen(true)}>+ Nuevo Concepto</Button>} />
      <Input placeholder="Buscar concepto..." value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }} className="max-w-sm" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo</TableHead><TableHead>Nombre</TableHead><TableHead>Tipo</TableHead>
              <TableHead>Factor Sal.</TableHead><TableHead>% Aplic.</TableHead>
              <TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>}
            {!isLoading && items.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Sin resultados</TableCell></TableRow>}
            {items.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-sm">{c.codigo}</TableCell>
                <TableCell>{c.nombre}</TableCell><TableCell>{c.tipo}</TableCell>
                <TableCell>{c.esFactorSalarial ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}</TableCell>
                <TableCell>{c.porcentajeAplicacion != null ? `${c.porcentajeAplicacion}%` : "—"}</TableCell>
                <TableCell><Badge variant={c.estado === "ACTIVO" ? "default" : "secondary"}>{c.estado}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditando(c)}>Editar</Button>
                    {c.estado === "ACTIVO"
                      ? <Button variant="outline" size="sm" disabled={desactivando} onClick={() => desactivar(c.id)}>Desactivar</Button>
                      : <Button variant="outline" size="sm" disabled={activando} onClick={() => activar(c.id)}>Activar</Button>}
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
      <ConceptoNominaFormDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {editando && <ModificarConceptoDialog open={editando !== null} onClose={() => setEditando(null)} item={editando} />}
    </div>
  )
}