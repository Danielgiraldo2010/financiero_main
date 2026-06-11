// shared/ui/layout/Header.tsx
import { Menu, ChevronDown, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Breadcrumbs } from './Breadcrumbs'
import { useUIStore } from '@/shared/state/ui.store'
import { useTenantStore } from '@/shared/state/tenant.store'
import { useAuthStore } from '@/shared/state/auth.store'
import { cn } from '@/shared/lib/cn'
import { useUnidadesEjecutoras } from '@/features/catalogos/unidades-ejecutoras/listar/hook'
import { useVigencias } from '@/features/catalogos/vigencias/listar/hook'

const VER_TODOS_VALUE = '__todos__'
const CONTROL_LABEL_CLASS =
  'pl-1 text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-[#6b7280]'
const CONTROL_TRIGGER_CLASS =
  'h-11 rounded-[14px] border-[rgba(15,23,42,0.08)] bg-white text-[#1f2937] shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out hover:border-[#004b82] hover:bg-[#edf4fb] focus-visible:border-[#d5bb87] focus-visible:ring-[#d5bb87]/30 data-placeholder:text-[#6b7280]'

export function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const vigenciaActiva = useUIStore((s) => s.vigenciaActiva)
  const setVigencia    = useUIStore((s) => s.setVigencia)

  const { tenantActivo, unidadesDisponibles, cambiarTenant, verTodos, setVerTodos } =
    useTenantStore()
  const { user, roles, logout } = useAuthStore()

  const esSuperadmin = roles.includes('SUPERADMIN')

  // Vigencias desde la BD — solo las operativas (excluye CERRADA y CONFIGURACION)
  const { data: vigencias = [] } = useVigencias()
  const vigenciasOperativas = vigencias.filter(
    (v) => v.estado !== 'CERRADA' && v.estado !== 'CONFIGURACION',
  )
  // Fallback: si el servidor aún no tiene vigencias, mostrar el año actual
  const opcionesVigencia = vigenciasOperativas.length > 0
    ? vigenciasOperativas
    : [{ id: 0, anio: new Date().getFullYear(), estado: 'EN_EJECUCION' }]

  const { data: catalogoData } = useUnidadesEjecutoras(
    esSuperadmin ? { pagina: 1, elementosPorPagina: 100 } : undefined,
  )
  const opcionesUE = esSuperadmin
    ? (catalogoData?.items ?? []).filter((ue) => ue.estado === 'ACTIVO')
    : unidadesDisponibles

  const displayName = user?.nombreCompleto ?? user?.userName ?? 'Usuario'

  const tituloUE = verTodos
    ? 'Todas las unidades'
    : (tenantActivo?.nombre ?? '—')

  const selectorUEValue = verTodos
    ? VER_TODOS_VALUE
    : tenantActivo
      ? String(tenantActivo.id)
      : ''

  const handleCambiarUE = (value: string | null) => {
    if (!value || value === VER_TODOS_VALUE) {
      setVerTodos()
      return
    }
    const ue = opcionesUE.find((u) => String(u.id) === value)
    if (ue) {
      cambiarTenant({
        id:      ue.id,
        nombre:  ue.nombre,
        codigo:  ('codigo' in ue ? (ue as { codigo?: string }).codigo : undefined) ?? '',
        rol:     'rol' in ue ? (ue as { rol: string }).rol : roles[0] ?? '',
        esActivo: true,
      })
    }
  }

  return (
    <header className="flex min-h-[72px] flex-wrap items-center gap-x-2 gap-y-2 bg-[linear-gradient(90deg,rgba(255,248,230,0.58),rgba(255,255,255,1)_36%,rgba(237,244,251,0.78))] px-3 py-2 text-[#1f2937] shadow-[0_4px_12px_rgba(15,23,42,0.08)] sm:gap-x-3 sm:px-4 lg:flex-nowrap lg:px-5">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Abrir menú"
        className="h-10 w-10 shrink-0 rounded-[12px] text-[#004b82] hover:bg-[#edf4fb] hover:text-[#004b82]"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Nombre de la UE activa */}
      <div className="flex min-w-0 flex-1 items-center overflow-hidden">
        <div className="flex min-h-11 min-w-0 flex-col justify-center">
          <p className="truncate text-sm font-bold leading-5 text-[#004b82] sm:text-base">{tituloUE}</p>
          <div className="mt-1 hidden min-h-4 items-center text-xs text-[#6b7280] sm:flex">
            <Breadcrumbs />
          </div>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-wrap items-end gap-2 sm:w-auto sm:flex-nowrap">
        {/* Selector de vigencia — cargado desde BD */}
        <div className="flex w-[100px] shrink-0 flex-col gap-1 sm:w-auto">
          <span className={CONTROL_LABEL_CLASS}>
            Vigencia actual
          </span>
          <Select
            value={String(vigenciaActiva)}
            onValueChange={(v) => setVigencia(Number(v))}
          >
            <SelectTrigger className={cn(CONTROL_TRIGGER_CLASS, 'w-full sm:w-28')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {opcionesVigencia.map((v) => (
                <SelectItem key={v.anio} value={String(v.anio)}>
                  {v.anio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selector de unidad ejecutora */}
        {(esSuperadmin || unidadesDisponibles.length > 1) && (
          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-none">
            <span className={CONTROL_LABEL_CLASS}>
              Unidad ejecutora
            </span>
            <Select value={selectorUEValue} onValueChange={handleCambiarUE}>
              <SelectTrigger className={cn(CONTROL_TRIGGER_CLASS, 'w-full sm:w-56 xl:w-60')}>
                <span className="truncate text-sm text-[#1f2937]">
                  {verTodos
                    ? '🌐 Todas las unidades'
                    : (tenantActivo?.nombre ?? 'Seleccionar...')}
                </span>
              </SelectTrigger>
              <SelectContent>
                {esSuperadmin && (
                  <SelectItem value={VER_TODOS_VALUE}>
                    🌐 Todas las unidades
                  </SelectItem>
                )}
                {opcionesUE.map((ue) => (
                  <SelectItem key={ue.id} value={String(ue.id)}>
                    {'codigo' in ue && (ue as { codigo?: string }).codigo
                      ? `${(ue as { codigo?: string }).codigo} — ${ue.nombre}`
                      : ue.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Menú de usuario */}
        <DropdownMenu>
          <div className="flex shrink-0 flex-col gap-1 sm:flex-none">
            <span className={cn(CONTROL_LABEL_CLASS, 'invisible')} aria-hidden="true">
              Usuario
            </span>
            <DropdownMenuTrigger className="inline-flex h-11 w-full items-center gap-2 rounded-[14px] border border-[rgba(15,23,42,0.08)] bg-white px-3 text-sm font-medium text-[#1f2937] shadow-[0_4px_12px_rgba(15,23,42,0.08)] outline-none transition-all duration-200 ease-out hover:border-[#d5bb87]/70 hover:bg-[#fff8e6] focus-visible:ring-2 focus-visible:ring-[#d5bb87]/35 sm:w-auto">
              <User className="h-4 w-4 shrink-0 text-[#004b82]" />
              <span className="min-w-0 max-w-[120px] truncate sm:max-w-[150px]">{displayName}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#6b7280]" />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent align="end" className="w-52 border-[rgba(15,23,42,0.08)] shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{displayName}</span>
                  <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
