import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { formatCOP } from '@/shared/lib/currency'
import { usePuntosSalariales } from '../hook'
import { RegistrarPuntosDialog } from '../../registrar/ui/RegistrarPuntosDialog'

export function PuntosSalarialesPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const { data, isLoading, isError } = usePuntosSalariales()

  return (
    <div className="space-y-4">
      <PageHeader
        title="Puntos Salariales"
        actions={
          <button className="btn-primary" onClick={() => setOpenDialog(true)}>
            Registrar
          </button>
        }
      />

      {isLoading && <p className="text-sm text-muted">Cargando…</p>}
      {isError && (
        <p className="text-sm text-red-600">Error al cargar puntos salariales.</p>
      )}

      {data && (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>Vigencia</th>
                <th>Decreto</th>
                <th>Categoría</th>
                <th>Nivel</th>
                <th>Puntos Base</th>
                <th>Valor Punto</th>
                <th>Valor Hora Pregrado</th>
                <th>Valor Hora Posgrado</th>
                <th>Factor Cat.</th>
                <th>Vigente Desde</th>
                <th>Vigente Hasta</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id}>
                  <td>{p.vigencia}</td>
                  <td>{p.decretoNorma}</td>
                  <td>{p.categoria}</td>
                  <td>{p.nivel}</td>
                  <td>{p.puntosBase}</td>
                  <td>{formatCOP(p.valorPunto)}</td>
                  <td>{formatCOP(p.valorHoraCatedraPregrado)}</td>
                  <td>{formatCOP(p.valorHoraCatedraPosgrado)}</td>
                  <td>{p.factorCategoria}</td>
                  <td>{p.vigenteDesdE}</td>
                  <td>{p.vigenteHasta ?? '—'}</td>
                  <td>
                    <span className={p.estado === 'ACTIVO' ? 'badge-success' : 'badge-neutral'}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RegistrarPuntosDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  )
}
