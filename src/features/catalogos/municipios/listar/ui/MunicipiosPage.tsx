import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useMunicipios } from "../hook"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export function MunicipiosPage() {
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState("")

  const { data, isLoading } = useMunicipios({ pagina, elementosPorPagina: 50, ...(busqueda ? { busqueda } : {}) })
  const items = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        title="Municipios"
        description="Catalogo de municipios (solo lectura)"
      />
      <Input placeholder="Buscar municipio..." value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }} className="max-w-sm" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo DANE</TableHead>
              <TableHead>Municipio</TableHead>
              <TableHead>Departamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Cargando...</TableCell></TableRow>}
            {items.map((m) => (
              <TableRow key={m.codigoMunicipio}>
                <TableCell className="font-mono text-sm">{m.codigoMunicipio}</TableCell>
                <TableCell>{m.nombre}</TableCell>
                <TableCell>{m.departamento}</TableCell>
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
    </div>
  )
}
