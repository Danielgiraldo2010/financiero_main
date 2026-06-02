import { TIPOS_NORMA, AMBITOS_NORMA } from "../../model/constants"

interface Props {
  tipo: string
  ambito: string
  vigente: string
  onTipo: (v: string) => void
  onAmbito: (v: string) => void
  onVigente: (v: string) => void
}

const selectClass =
  "h-9 rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 " +
  "disabled:cursor-not-allowed disabled:opacity-50"

export function NormatividadFilters({
  tipo,
  ambito,
  vigente,
  onTipo,
  onAmbito,
  onVigente,
}: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        className={selectClass}
        value={tipo}
        onChange={(e) => onTipo(e.target.value)}
      >
        <option value="">Todos los tipos</option>
        {TIPOS_NORMA.map((t: string) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={ambito}
        onChange={(e) => onAmbito(e.target.value)}
      >
        <option value="">Todos los ambitos</option>
        {AMBITOS_NORMA.map((a: string) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={vigente}
        onChange={(e) => onVigente(e.target.value)}
      >
        <option value="">Todas</option>
        <option value="true">Solo vigentes</option>
        <option value="false">No vigentes</option>
      </select>
    </div>
  )
}
