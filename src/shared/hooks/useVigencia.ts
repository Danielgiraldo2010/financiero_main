import { useUIStore } from '@/shared/state/ui.store'

/**
 * Acceso conveniente a la vigencia fiscal activa.
 * El selector de vigencia vive en ui.store — no prop drilling (G13).
 */
export function useVigencia() {
  const vigenciaActiva = useUIStore((s) => s.vigenciaActiva)
  const setVigencia = useUIStore((s) => s.setVigencia)
  return { vigenciaActiva, setVigencia }
}
