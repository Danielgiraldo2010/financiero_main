import { useEffect, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUIStore } from '@/shared/state/ui.store'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)

  useEffect(() => {
    const handler = () => setSidebarOpen(window.innerWidth >= 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [setSidebarOpen])

  return (
    <div className="relative flex h-screen overflow-hidden app-surface">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <Header />
        <main className="app-content-surface flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 md:px-7 md:py-7 lg:px-9 lg:py-8">
          <div className="mx-auto w-full min-w-0 max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
