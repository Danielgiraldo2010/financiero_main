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
      <div className="border-b mb-6 overflow-x-auto">
        <nav className="flex gap-1 -mb-px min-w-max">
          {SUB_TABS.map((st) => (
            <button
              key={st.key}
              onClick={() => setTab(st.key)}
              className={[
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                tab === st.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground',
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