import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/badge'
import { DataTable, type ColumnDef } from '@/shared/ui/data/DataTable'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { useModificaciones } from '../hook'
import { ModificacionesFilters } from './ModificacionesFilters'
import { RegistrarModificacionDialog } from '../../registrar/ui/RegistrarModificacionDialog'
import {
  ESTADO_MODIFICACION_LABELS,
  ESTADO_MODIFICACION_VARIANTS,
  ESTADO_MODIFICACION_DOT,
  ESTADO_MODIFICACION_TOOLTIP,
} from '../../model/constants'
import type { ModificacionesParams, SolicitudModificacionResumen } from '../../model/types'

const columns: ColumnDef<SolicitudModificacionResumen>[] = [
  { accessorKey: 'numeroSolicitud', header: 'Nº Solicitud' },
  { accessorKey: 'fechaSolicitud',  header: 'Fecha' },
  { accessorKey: 'vigencia',        header: 'Vigencia' },
  {
    accessorKey: 'tipoModificacion',
    header: 'Tipo',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.tipoModificacion.replace(/_/g, ' ')}</span>
    ),
  },
  { accessorKey: 'unidadSolicitante', header: 'Unidad solicitante' },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.original.estado
      return (
        <div className="flex items-center gap-2" title={ESTADO_MODIFICACION_TOOLTIP[estado]}>
          <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${ESTADO_MODIFICACION_DOT[estado]}`} />
          <Badge variant={ESTADO_MODIFICACION_VARIANTS[estado]} className="text-xs">
            {ESTADO_MODIFICACION_LABELS[estado]}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'siguienteAccion',
    header: 'Siguiente acción',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.siguienteAccion}</span>
    ),
  },
]

const PAGE_SIZE = 15

export function ModificacionesPage() {
  const navigate                    = useNavigate()
  const [params, setParams]         = useState<ModificacionesParams>({ pagina: 1, tamanoPagina: PAGE_SIZE })
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading, isError } = useModificaciones(params)

  // Fix EOT: con exactOptionalPropertyTypes no se puede pasar `prop={value | undefined}`.
  // Se debe omitir la prop cuando no hay datos — renderizado condicional.
  const paginationConfig = data
    ? {
        page:         params.pagina ?? 1,
        pageSize:     PAGE_SIZE,
        total:        data.total,
        onPageChange: (p: number) => setParams((prev) => ({ ...prev, pagina: p })),
      }
    : undefined

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        title="Modificaciones presupuestales"
        description="Traslados de recursos entre rubros — doble firma requerida (I-GF-798)"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva modificación
          </Button>
        }
      />

      <ModificacionesFilters params={params} onChange={setParams} />

      {/* Fix EOT: renderizado condicional para omitir pagination cuando es undefined */}
      {paginationConfig ? (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          onRowClick={(row) => { void navigate({ to: '/modificaciones/$id', params: { id: String(row.id) } }) }}
          pagination={paginationConfig}
        />
      ) : (
        <DataTable
          columns={columns}
          data={[]}
          isLoading={isLoading}
          isError={isError}
          onRowClick={(row) => { void navigate({ to: '/modificaciones/$id', params: { id: String(row.id) } }) }}
        />
      )}

      <RegistrarModificacionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}
