import { Input } from "@/shared/ui/primitives/input";
import { Search } from "lucide-react";
import { TIPOS_DOCUMENTO } from "../../shared/constants";

interface Props {
  q: string;
  tipo: string;
  onQChange: (val: string) => void;
  onTipoChange: (val: string) => void;
}

export function DocumentosFilters({ q, tipo, onQChange, onTipoChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Búsqueda libre */}
      <div className="relative min-w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
        <Input
          className="pl-9"
          placeholder="Buscar documento…"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
        />
      </div>

      {/* Tipo */}
      <select
        value={tipo}
        onChange={(e) => onTipoChange(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm min-w-44"
      >
        <option value="">Todos los tipos</option>
        {TIPOS_DOCUMENTO.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}
