import { useEffect, type ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

// Tema claro único: la aplicación no debe heredar modo oscuro del sistema.
export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
  }, [])

  return <>{children}</>
}
