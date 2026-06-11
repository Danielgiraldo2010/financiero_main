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
  "h-9 rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white px-3 text-sm text-[#1f2937] shadow-[0_4px_12px_rgba(15,23,42,0.08)] outline-none transition-all hover:border-[#004b82] hover:bg-[#edf4fb] focus:border-[#d5bb87] focus:ring-2 focus:ring-[#d5bb87]/30"

export function NormatividadFilters({ tipo, ambito, vigente, onTipo, onAmbito, onVigente }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select className={selectClass} value={tipo} onChange={(e) => onTipo(e.target.value)}>
        <option value="">Todos los tipos</option>
        {TIPOS_NORMA.map((t: string) => <option key={t} value={t}>{t}</option>)}
      </select>

      <select className={selectClass} value={ambito} onChange={(e) => onAmbito(e.target.value)}>
        <option value="">Todos los ámbitos</option>
        {AMBITOS_NORMA.map((a: string) => <option key={a} value={a}>{a}</option>)}
      </select>

      <select className={selectClass} value={vigente} onChange={(e) => onVigente(e.target.value)}>
        <option value="">Todas</option>
        <option value="true">Solo vigentes</option>
        <option value="false">No vigentes</option>
      </select>
    </div>
  )
}
