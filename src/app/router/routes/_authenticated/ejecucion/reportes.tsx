// src/app/router/routes/_authenticated/ejecucion/reportes.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SeguimientoCdpPage }    from '@/features/ejecucion'
import { EjecucionPorRubroPage } from '@/features/ejecucion'
import { GenerarAlertasPage }    from '@/features/ejecucion'

type SubTab = 'seguimiento' | 'por-rubro' | 'alertas'

const SUB_TABS: { label: string; key: SubTab }[] = [
  { label: 'Seguimiento CDP',  key: 'seguimiento' },
  { label: 'Por Rubro',        key: 'por-rubro'   },
  { label: 'Generar Alertas',  key: 'alertas'     },
]

function ReportesPage() {
  const [tab, setTab] = useState<SubTab>('seguimiento')

  return (
    <div className="space-y-0">
      <div className="sf-tabs-shell mb-6">
        <nav className="sf-tabs-nav">
          {SUB_TABS.map((st) => (
            <button
              key={st.key}
              onClick={() => setTab(st.key)}
              className={[
                'sf-tab',
                tab === st.key
                  ? 'sf-tab-active'
                  : '',
              ].join(' ')}
            >
              {st.label}
            </button>
          ))}
        </nav>
      </div>

      {tab === 'seguimiento' && <SeguimientoCdpPage />}
      {tab === 'por-rubro'   && <EjecucionPorRubroPage />}
      {tab === 'alertas'     && <GenerarAlertasPage />}
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/ejecucion/reportes')({
  staticData: { breadcrumb: 'Reportes' },
  component: ReportesPage,
})
