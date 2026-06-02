/**
 * Formatea un número como pesos colombianos.
 *   formatCOP(1234567)    → "$1.234.567"
 *   formatCOP(1234567.5)  → "$1.234.567,50"
 */
export function formatCOP(value: number): string {
  const hasDecimals = value % 1 !== 0
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(value)
}

/**
 * Parsea un string formateado de COP a número crudo.
 * "$1.234.567" → 1234567
 */
export function parseCOP(formatted: string): number {
  const cleaned = formatted.replace(/[^0-9,]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}
