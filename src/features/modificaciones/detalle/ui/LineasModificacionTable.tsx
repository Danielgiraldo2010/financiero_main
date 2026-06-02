// Tabla interna — usa @/components/ui/table directamente (no DataTable wrapper)
// porque necesita TableFooter con el balance débito/crédito (FE5-I6)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCOP } from '@/shared/lib/currency'
import type { LineaModificacion } from '../../model/types'

interface Props {
  lineas: LineaModificacion[]
}

export function LineasModificacionTable({ lineas }: Props) {
  const totalDebito  = lineas.filter((l) => l.tipoMovimiento === 'DEBITO') .reduce((s, l) => s + l.valor, 0)
  const totalCredito = lineas.filter((l) => l.tipoMovimiento === 'CREDITO').reduce((s, l) => s + l.valor, 0)
  const balanceado   = Math.abs(totalDebito - totalCredito) < 0.01

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rubro</TableHead>
            <TableHead>Movimiento</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Descripción</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {lineas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Sin líneas registradas
              </TableCell>
            </TableRow>
          ) : (
            lineas.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-sm">{l.rubro}</TableCell>
                <TableCell>
                  <Badge
                    variant={l.tipoMovimiento === 'DEBITO' ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {l.tipoMovimiento}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {l.esIngreso ? 'Ingreso' : 'Gasto'}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCOP(l.valor)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {l.descripcion ?? '—'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        {lineas.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="font-semibold">
                Balance{' '}
                {balanceado ? (
                  <span className="text-green-600 text-xs font-normal ml-1">✓ Cuadrado</span>
                ) : (
                  <span className="text-destructive text-xs font-normal ml-1">
                    ✗ Descuadrado — diferencia: {formatCOP(Math.abs(totalDebito - totalCredito))}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <div className="text-xs text-muted-foreground">Débito: {formatCOP(totalDebito)}</div>
                <div className="text-xs text-muted-foreground">Crédito: {formatCOP(totalCredito)}</div>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  )
}
