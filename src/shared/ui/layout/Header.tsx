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
import { useUnidadesEjecutoras } from '@/features/catalogos/unidades-ejecutoras/listar/hook'
import { useVigencias } from '@/features/catalogos/vigencias/listar/hook'

const VER_TODOS_VALUE = '__todos__'

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
    <header className="flex h-16 items-center gap-4 border-b border-[#d1d5db] bg-[linear-gradient(90deg,rgba(255,248,230,0.72),rgba(255,255,255,1)_36%,rgba(237,244,251,0.82))] px-3 text-[#1f2937] shadow-[0_8px_24px_rgba(0,75,130,0.08)] sm:px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Abrir menú"
        className="rounded-full text-[#004b82] hover:bg-[#edf4fb] hover:text-[#004b82]"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Nombre de la UE activa */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold leading-none text-[#004b82]">{tituloUE}</p>
        <div className="mt-0.5 text-xs text-[#6b7280]">
          <Breadcrumbs />
        </div>
      </div>

      {/* Selector de vigencia — cargado desde BD */}
      <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280] leading-none">
            Vigencia actual
          </span>
        <Select
          value={String(vigenciaActiva)}
          onValueChange={(v) => setVigencia(Number(v))}
        >
          <SelectTrigger className="h-9 w-28 border-[#d1d5db] bg-white text-[#1f2937] shadow-sm hover:border-[#004b82] hover:bg-[#edf4fb] focus-visible:border-[#d5bb87] focus-visible:ring-[#d5bb87]/30 data-placeholder:text-[#6b7280]">
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
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280] leading-none">
            Unidad ejecutora
          </span>
          <Select value={selectorUEValue} onValueChange={handleCambiarUE}>
            <SelectTrigger className="h-9 w-52 border-[#d1d5db] bg-white text-[#1f2937] shadow-sm hover:border-[#004b82] hover:bg-[#edf4fb] focus-visible:border-[#d5bb87] focus-visible:ring-[#d5bb87]/30 data-placeholder:text-[#6b7280]">
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
        <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d5bb87]/45 bg-white px-2.5 text-sm font-medium text-[#1f2937] transition-colors hover:bg-[#fff8e6] outline-none focus-visible:ring-2 focus-visible:ring-[#d5bb87]/35">
          <User className="h-4 w-4 shrink-0 text-[#004b82]" />
          <span className="max-w-[140px] truncate">{displayName}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#6b7280]" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52 border-[#d1d5db] shadow-[0_18px_40px_rgba(31,41,55,0.12)]">
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
    </header>
  )
}
