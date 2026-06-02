import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useTiposProyecto } from "../hook"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

export function TiposProyectoPage() {
  const { data: items = [], isLoading } = useTiposProyecto()

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        title="Tipos de Proyecto"
        description="Catalogo de tipos de proyecto disponibles (solo lectura)"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Matriculas</TableHead>
              <TableHead>Nomina</TableHead>
              <TableHead>SAR</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Cargando...
                </TableCell>
              </TableRow>
            )}
            {items.map((tp) => (
              <TableRow key={tp.id}>
                <TableCell className="font-mono text-sm">{tp.codigo}</TableCell>
                <TableCell>{tp.nombre}</TableCell>
                <TableCell>
                  {tp.habilitaMatriculas
                    ? <CheckCircle className="h-4 w-4 text-green-600" />
                    : <XCircle className="h-4 w-4 text-muted-foreground" />}
                </TableCell>
                <TableCell>
                  {tp.habilitaNominaCatedratico
                    ? <CheckCircle className="h-4 w-4 text-green-600" />
                    : <XCircle className="h-4 w-4 text-muted-foreground" />}
                </TableCell>
                <TableCell>
                  {tp.habilitaSar
                    ? <CheckCircle className="h-4 w-4 text-green-600" />
                    : <XCircle className="h-4 w-4 text-muted-foreground" />}
                </TableCell>
                <TableCell>
                  <Badge variant={tp.estado === "ACTIVO" ? "default" : "secondary"}>
                    {tp.estado}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
