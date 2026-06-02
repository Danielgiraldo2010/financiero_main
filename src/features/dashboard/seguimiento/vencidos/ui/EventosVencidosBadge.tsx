import { Link } from "@tanstack/react-router"
import { useEventosVencidos } from "../hook"

export function EventosVencidosBadge() {
  const { data: vencidos = [] } = useEventosVencidos()

  if (vencidos.length === 0) return null

  return (
    <Link
      to="/dashboard"
      className="relative inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors hover:bg-muted"
      title={`${vencidos.length} evento(s) vencido(s)`}
    >
      <svg
        className="h-4 w-4 text-red-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <span className="tabular-nums text-red-600 font-semibold">{vencidos.length}</span>
    </Link>
  )
}
