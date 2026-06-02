import type { EventoAgenda } from "../../model/types"

interface Props {
  eventos?: EventoAgenda[]
}

const PRIORIDAD_COLOR: Record<string, string> = {
  ALTA: "text-red-600 bg-red-50 border-red-200",
  MEDIA: "text-yellow-700 bg-yellow-50 border-yellow-200",
  BAJA: "text-blue-600 bg-blue-50 border-blue-200",
}

export function AgendaWidget({ eventos = [] }: Props) {
  const proximos = Array.isArray(eventos)
    ? eventos
        .filter((e) => !e.cumplido)
        .slice(0, 6)
    : []

  if (proximos.length === 0) {
    return (
      <div className="rounded-lg border bg-background p-4 shadow-sm">
        <p className="mb-3 text-sm font-medium">
          Proximos eventos
        </p>

        <p className="text-sm text-muted-foreground">
          Sin eventos proximos.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium">
        Proximos eventos
      </p>

      <ul className="flex flex-col gap-2">
        {proximos.map((e) => {
          const prioridad = e.prioridad ?? "BAJA"

          return (
            <li
              key={e.id}
              className={`flex items-start gap-2 rounded-md border p-2 text-xs ${
                PRIORIDAD_COLOR[prioridad] ??
                "text-gray-600 bg-gray-50 border-gray-200"
              }`}
            >
              <span className="mt-0.5 font-semibold uppercase">
                {prioridad?.[0] ?? "?"}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {e.titulo}
                </p>

                <p className="text-xs opacity-70">
                  {e.fechaEvento}
                  {e.diasRestantes !== null
                    ? ` · ${e.diasRestantes}d`
                    : ""}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}