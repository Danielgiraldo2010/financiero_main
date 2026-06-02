// Wrappers tipados sobre import.meta.env
// Falla en build si las variables requeridas no están definidas.

function requireEnv(key: string): string {
  const value = import.meta.env[key] as string | undefined
  if (!value) {
    throw new Error(`[env] Variable de entorno requerida no definida: ${key}`)
  }
  return value
}

export const env = {
  API_URL: import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '/api' : ''),
  APP_NAME: import.meta.env.VITE_APP_NAME ?? 'Sistema Financiero',
  IS_DEV: import.meta.env.DEV as boolean,
} as const
