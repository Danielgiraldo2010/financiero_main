import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { SelectField } from '@/shared/ui/forms/SelectField'
import { formatCOP } from '@/shared/lib/currency'
import { useEmpleados } from '../hook'
import { RegistrarEmpleadoDialog } from '../../registrar/ui/RegistrarEmpleadoDialog'
import { DesactivarEmpleadoDialog } from '../../desactivar/ui/DesactivarEmpleadoDialog'
import {
  TIPO_EMPLEADO_OPTIONS,
  TIPO_EMPLEADO_LABELS,
} from '../../../model/constants'
import type { Empleado } from '../../../model/types'

const FILTRO_OPTIONS = [
  { value: '', label: 'Todos los tipos' },
  ...TIPO_EMPLEADO_OPTIONS,
]

export function EmpleadosPage() {
  const [tipoFiltro, setTipoFiltro]       = useState('')
  const [openRegistrar, setOpenRegistrar] = useState(false)
  const [empleadoADesact, setEmpleadoADesact] = useState<Empleado | null>(null)

  const { data, isLoading, isError } = useEmpleados(
    tipoFiltro ? { tipoEmpleado: tipoFiltro } : undefined,
  )

  return (
    <div className="space-y-4">
      <PageHeader
        title="Empleados"
        actions={
          <button className="btn-primary" onClick={() => setOpenRegistrar(true)}>
            Registrar
          </button>
        }
      />

      <div className="w-56">
        <SelectField
          label="Filtrar por tipo"
          options={FILTRO_OPTIONS}
          value={tipoFiltro}
          onChange={setTipoFiltro}
        />
      </div>

      {isLoading && <p className="text-sm text-muted">Cargando…</p>}
      {isError && (
        <p className="text-sm text-red-600">Error al cargar empleados.</p>
      )}

      {data && (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>Identificación</th>
                <th>Nombre Completo</th>
                <th>Tipo</th>
                <th>Cargo</th>
                <th>Salario Base</th>
                <th>Unidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((e) => (
                <tr key={e.id}>
                  <td>
                    {e.tipoIdentificacion} {e.numeroIdentificacion}
                  </td>
                  <td>{e.nombreCompleto}</td>
                  <td>{TIPO_EMPLEADO_LABELS[e.tipoEmpleado] ?? e.tipoEmpleado}</td>
                  <td>{e.cargo ?? '—'}</td>
                  <td>{formatCOP(e.salarioBaseMensual)}</td>
                  <td>{e.unidadEjecutoraId}</td>
                  <td>
                    <span className={
                      e.estado === 'ACTIVO' ? 'badge-success' : 'badge-neutral'
                    }>
                      {e.estado}
                    </span>
                  </td>
                  <td>
                    {e.estado === 'ACTIVO' && (
                      <button
                        className="btn-ghost text-red-600 text-xs"
                        onClick={() => setEmpleadoADesact(e)}
                      >
                        Desactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RegistrarEmpleadoDialog
        open={openRegistrar}
        onClose={() => setOpenRegistrar(false)}
      />

      {empleadoADesact && (
        <DesactivarEmpleadoDialog
          empleadoId={empleadoADesact.id}
          nombreCompleto={empleadoADesact.nombreCompleto}
          open={empleadoADesact !== null}
          onClose={() => setEmpleadoADesact(null)}
        />
      )}
    </div>
  )
}
