import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/shared/api/fetcher'
import type { HorasDictadas } from '../../../model/types'
import { RegistrarHorasDialog } from '../../registrar/ui/RegistrarHorasDialog'
import { horasKey } from '../../registrar/hook'

interface Props {
  planClasesId: number
}

// GET /api/v1/nomina/horas-dictadas?planClasesId={id}
// El endpoint no está en el listado principal del OpenAPI pero es necesario
// para mostrar el historial. Si el backend no lo implementa, la tabla
// mostrará empty state hasta que se registre la primera entrada.
async function fetchHorasByPlan(planClasesId: number): Promise<HorasDictadas[]> {
  const result = await fetcher(
    `/api/v1/nomina/horas-dictadas?planClasesId=${planClasesId}`,
  )
  // El backend puede devolver array directo o PagedResult
  return Array.isArray(result) ? result : (result as { items: HorasDictadas[] }).items
}

const MES_NOMBRES = [
  '', 'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

export function HorasTable({ planClasesId }: Props) {
  const [openDialog, setOpenDialog] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: horasKey(planClasesId),
    queryFn:  () => fetchHorasByPlan(planClasesId),
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Horas Dictadas
        </p>
        <button
          className="btn-ghost text-xs text-blue-600"
          onClick={() => setOpenDialog(true)}
        >
          + Registrar horas
        </button>
      </div>

      {isLoading && (
        <p className="text-xs text-muted">Cargando horas…</p>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <p className="text-xs text-muted italic">Sin registros de horas aún.</p>
      )}

      {data && data.length > 0 && (
        <table className="table w-full text-xs">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Proyectadas</th>
              <th>Reales</th>
              <th>Diferencia</th>
              <th>Justificación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((h) => (
              <tr key={h.id}>
                <td>{h.nombreMes || MES_NOMBRES[h.mes] || h.mes}</td>
                <td>{h.horasProyectadas}</td>
                <td>{h.horasReales}</td>
                <td className={
                  h.diferencia < 0
                    ? 'text-red-600 font-medium'
                    : h.diferencia > 0
                      ? 'text-green-600'
                      : ''
                }>
                  {h.diferencia > 0 ? '+' : ''}{h.diferencia}
                </td>
                <td>{h.justificacion ?? '—'}</td>
                <td>
                  <span className={h.estado === 'APROBADO' ? 'badge-success' : 'badge-neutral'}>
                    {h.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <RegistrarHorasDialog
        planClasesId={planClasesId}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  )
}
