import { useEffect, type ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

// Sistema de temas mínimo — shadcn/ui usa la clase 'dark' en <html>.
// En FE0 usamos el tema del sistema del usuario como punto de partida.
export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return <>{children}</>
}
