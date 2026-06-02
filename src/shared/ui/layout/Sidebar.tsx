import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  DollarSign,
  FileEdit,
  GraduationCap,
  Users,
  Plane,
  TrendingUp,
  Scale,
  BarChart3,
  FileText,
  CalendarDays,
  CalendarRange,
  Library,
  Plug,
  UserCog,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react'
import { NavigationMenu } from '@/shared/ui/navigation/NavigationMenuImpl'
import type { NavItem } from '@/shared/ui/navigation/NavigationMenuImpl'
import { ROLES } from '@/shared/lib/constants'
import { useUIStore } from '@/shared/state/ui.store'
import { useAuthStore } from '@/shared/state/auth.store'
import { cn } from '@/shared/lib/cn'

const SIDEBAR_ITEMS: NavItem[] = [
  { label: 'Dashboard',      icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Proyectos',      icon: FolderKanban,    to: '/proyectos',      roles: [ROLES.COORDINADOR, ROLES.FINANCIERO, ROLES.DECANO, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] },
  { label: 'Catálogos',      icon: BookOpen,         to: '/catalogos/unidades-ejecutoras', roles: [ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] },
  { label: 'Presupuesto',    icon: DollarSign,       to: '/presupuesto',    roles: [ROLES.FINANCIERO, ROLES.FINANCIERO_CENTRAL, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] },
  { label: 'Modificaciones', icon: FileEdit,         to: '/modificaciones', roles: [ROLES.FINANCIERO, ROLES.FINANCIERO_CENTRAL, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] },
  { label: 'Matrículas',     icon: GraduationCap,    to: '/matriculas',     roles: [ROLES.FINANCIERO, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] },
  { label: 'Nómina',         icon: Users,            to: '/nomina',         roles: [ROLES.FINANCIERO, ROLES.FINANCIERO_CENTRAL, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] },
  { label: 'SAR / Viáticos', icon: Plane,            to: '/sar-viaticos',   roles: [ROLES.COORDINADOR, ROLES.FINANCIERO, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] },
  { label: 'Ejecución',      icon: TrendingUp,       to: '/ejecucion',      roles: [ROLES.FINANCIERO, ROLES.FINANCIERO_CENTRAL, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] },
  { label: 'Balance',        icon: Scale,            to: '/balance',        roles: [ROLES.FINANCIERO_CENTRAL, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] },
  { label: 'Estadísticas',   icon: BarChart3,        to: '/estadisticas' },
  { label: 'Documentos',     icon: FileText,         to: '/documentos' },
  { label: 'Agenda',         icon: CalendarDays,     to: '/agenda' },
  { label: 'Normatividad',   icon: Library,          to: '/normatividad' },
  { label: 'Integración',    icon: Plug,             to: '/integracion',    roles: [ROLES.SUPERADMIN] },
]

const ADMIN_ITEMS: NavItem[] = [
  { label: 'Usuarios',   icon: UserCog,       to: '/admin/usuarios',         roles: [ROLES.SUPERADMIN, ROLES.ADMIN_CENTRAL] },
  { label: 'Roles',      icon: ShieldCheck,   to: '/admin/roles',            roles: [ROLES.SUPERADMIN] },
  { label: 'Vigencias',  icon: CalendarRange, to: '/admin/vigencias',    roles: [ROLES.SUPERADMIN, ROLES.ADMIN_CENTRAL] },
  { label: 'Auditoría',  icon: ClipboardList, to: '/admin/auditoria',        roles: [ROLES.SUPERADMIN, ROLES.ADMIN_CENTRAL] },
]

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const roles = useAuthStore((s) => s.roles)

  const isAdmin = roles.includes(ROLES.SUPERADMIN) || roles.includes(ROLES.ADMIN_CENTRAL)

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-background transition-all duration-200',
        sidebarOpen ? 'w-60' : 'w-0 overflow-hidden',
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <span className="truncate text-sm font-semibold tracking-tight">
          SistemaFinanciero
        </span>
      </div>

      {/* Nav principal */}
      <div className="flex-1 overflow-y-auto p-2">
        <NavigationMenu items={SIDEBAR_ITEMS} />

        {/* Sección Administración — solo visible para SUPERADMIN y ADMIN_CENTRAL */}
        {isAdmin && (
          <div className="mt-4">
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Administración
            </p>
            <NavigationMenu items={ADMIN_ITEMS} />
          </div>
        )}
      </div>
    </aside>
  )
}
