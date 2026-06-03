import type { EventoAgenda } from "../../model/types"
import { CalendarDays, CheckCircle2 } from "lucide-react"

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
      <div className="overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3 border-b border-[#dbe8f4] bg-[linear-gradient(90deg,rgba(237,244,251,0.92),rgba(255,255,255,1))] px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-[15px] border border-[#004b82]/18 bg-[#edf4fb] text-[#004b82] shadow-[0_10px_22px_rgba(0,75,130,0.10)]">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-base font-bold tracking-[-0.02em] text-[#004b82]">
            Actividad reciente
          </p>
        </div>

        <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf4fb] text-[#004b82]">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#1f2937]">Sin eventos proximos</p>
            <p className="mt-1 text-xs text-muted-foreground">La agenda no registra hitos pendientes.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#dbe8f4] bg-[linear-gradient(90deg,rgba(237,244,251,0.92),rgba(255,255,255,1))] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[15px] border border-[#004b82]/18 bg-[#edf4fb] text-[#004b82] shadow-[0_10px_22px_rgba(0,75,130,0.10)]">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-base font-bold tracking-[-0.02em] text-[#004b82]">
              Actividad reciente
            </p>
            <p className="text-xs font-medium text-muted-foreground">{proximos.length} eventos proximos</p>
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-2 p-4">
        {proximos.map((e) => {
          const prioridad = e.prioridad ?? "BAJA"

          return (
            <li
              key={e.id}
              className={`flex items-start gap-3 rounded-[16px] border p-3 text-xs shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out hover:shadow-[0_8px_18px_rgba(15,23,42,0.10)] ${
                PRIORIDAD_COLOR[prioridad] ??
                "text-gray-600 bg-gray-50 border-gray-200"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-sm font-bold uppercase shadow-sm">
                {prioridad?.[0] ?? "?"}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {e.titulo}
                </p>

                <p className="mt-1 text-xs font-medium opacity-75">
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
