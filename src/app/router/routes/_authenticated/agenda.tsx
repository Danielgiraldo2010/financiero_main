import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router"

const TABS = [
  { label: "Mi Agenda", to: "/agenda/mi-agenda" },
  { label: "Todos los eventos", to: "/agenda/eventos" },
] as const

function AgendaLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <div className="flex flex-col min-h-0">
      <div className="sf-tabs-shell px-3 md:px-6">
        <nav className="sf-tabs-nav">
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={[
                "sf-tab",
                pathname.startsWith(tab.to)
                  ? "sf-tab-active"
                  : "",
              ].join(" ")}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-0 py-4 md:px-6 md:py-6">
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/_authenticated/agenda")({
  staticData: { breadcrumb: "Agenda" },
  component: AgendaLayout,
})
