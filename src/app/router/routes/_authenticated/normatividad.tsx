import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router"

const TABS = [
  { label: "Normas", to: "/normatividad/normas" },
] as const

function NormatividadLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <div className="flex flex-col min-h-0">
      <div className="sf-tabs-shell px-6">
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
      <div className="px-6 py-6">
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/_authenticated/normatividad")({
  staticData: { breadcrumb: "Normatividad" },
  component: NormatividadLayout,
})
