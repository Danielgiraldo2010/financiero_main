import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { useCostosParafiscales } from '../hook'
import { CargarParafiscalesDialog } from '../../cargar/ui/CargarParafiscalesDialog'
import { useAuthStore } from '@/shared/state/auth.store'

const ROLES_CARGAR = ['FINANCIERO_CENTRAL', 'SUPERADMIN']

export function ParafiscalesPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const { data, isLoading, isError } = useCostosParafiscales()
  const roles: string[] = useAuthStore((s) => s.roles ?? [])

  // 07c-I5: solo FINANCIERO_CENTRAL puede cargar (guard en botón)
  const puedeCargar = (ROLES_CARGAR as string[]).some((r) => roles.includes(r))

  return (
    <div className="space-y-4">
      <PageHeader
        title="Costos Parafiscales"
        {...(puedeCargar
          ? {
              actions: (
                <button className="btn-primary" onClick={() => setOpenDialog(true)}>
                  Cargar Costos
                </button>
              ),
            }
          : {})}
      />

      {isLoading && <p className="text-sm text-muted">Cargando…</p>}
      {isError && (
        <p className="text-sm text-red-600">Error al cargar costos parafiscales.</p>
      )}

      {data?.items && data.items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>Vigencia</th>
                <th>Mes</th>
                <th>Tipo Nómina</th>
                <th>Salud</th>
                <th>Pensión</th>
                <th>ARL</th>
                <th>Caja</th>
                <th>ICBF</th>
                <th>SENA</th>
                <th>Factor Prest.</th>
                <th>Factor Total</th>
                <th>Estado</th>
                <th>Cargado Por</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((c) => (
                <tr key={c.id}>
                  <td>{c.vigencia}</td>
                  <td>{c.mes}</td>
                  <td>{c.tipoNomina}</td>
                  <td>{c.porcSaludEmpleador}%</td>
                  <td>{c.porcPensionEmpleador}%</td>
                  <td>{c.porcArl}%</td>
                  <td>{c.porcCajaCompensacion}%</td>
                  <td>{c.porcIcbf}%</td>
                  <td>{c.porcSena}%</td>
                  <td>{c.factorPrestaciones}</td>
                  <td className="font-semibold">{c.factorTotalCosto}</td>
                  <td>
                    <span className={c.estado === 'ACTIVO' ? 'badge-success' : 'badge-neutral'}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="text-xs text-muted">{c.cargadoPor ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {puedeCargar && (
        <CargarParafiscalesDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </div>
  )
}
