import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { IniciarConciliacionDialog } from '../iniciar/ui/IniciarConciliacionDialog'
import { ResultadoConciliacionPanel } from '../iniciar/ui/ResultadoConciliacionPanel'
import { ImportarLiquidacionGHDialog } from '../../liquidacion-gh/importar/ui/ImportarLiquidacionGHDialog'
import type { ConciliacionNomina } from '../iniciar/api'

export function ConciliacionPage() {
  const [openConciliar, setOpenConciliar] = useState(false)
  const [openImportar,  setOpenImportar]  = useState(false)
  const [resultado, setResultado]         = useState<ConciliacionNomina | null>(null)

  // Parámetros para la importación GH (en producción vendrían de filtros/contexto)
  const [ghParams] = useState({ vigencia: new Date().getFullYear(), mes: new Date().getMonth() + 1, proyectoId: 0 })

  return (
    <div className="space-y-4">
      <PageHeader
        title="Conciliación de Nómina"
        actions={
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              onClick={() => setOpenImportar(true)}
            >
              Importar Liquidación GH
            </button>
            <button
              className="btn-primary"
              onClick={() => setOpenConciliar(true)}
            >
              Iniciar Conciliación
            </button>
          </div>
        }
      />

      <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        <p>
          Flujo: (1) Importar archivo GH → (2) Iniciar Conciliación → (3) Revisar diferencias
        </p>
        <p className="text-xs mt-1">
          La conciliación compara los totales del Sistema Financiero con los
          valores liquidados por Gestión Humana para el período seleccionado.
        </p>
      </div>

      {/* Resultado de la última conciliación ejecutada en esta sesión */}
      {resultado && (
        <ResultadoConciliacionPanel
          resultado={resultado}
          onClose={() => setResultado(null)}
        />
      )}

      <IniciarConciliacionDialog
        open={openConciliar}
        onClose={() => setOpenConciliar(false)}
        onSuccess={(r) => {
          setResultado(r)
          setOpenConciliar(false)
        }}
      />

      <ImportarLiquidacionGHDialog
        vigencia={ghParams.vigencia}
        mes={ghParams.mes}
        proyectoId={ghParams.proyectoId}
        open={openImportar}
        onClose={() => setOpenImportar(false)}
      />
    </div>
  )
}
