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
import { useNavigate } from '@tanstack/react-router'
import { NavigationMenu } from '@/shared/ui/navigation/NavigationMenuImpl'
import type { NavItem } from '@/shared/ui/navigation/NavigationMenuImpl'
import { ROLES } from '@/shared/lib/constants'
import { useUIStore } from '@/shared/state/ui.store'
import { useAuthStore } from '@/shared/state/auth.store'
import { BrandMark } from '@/shared/ui/branding/BrandMark'
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
]

const ADMIN_ITEMS: NavItem[] = [
  { label: 'Usuarios',   icon: UserCog,       to: '/admin/usuarios',         roles: [ROLES.SUPERADMIN, ROLES.ADMIN_CENTRAL] },
  { label: 'Roles',      icon: ShieldCheck,   to: '/admin/roles',            roles: [ROLES.SUPERADMIN] },
  { label: 'Vigencias',  icon: CalendarRange, to: '/admin/vigencias',    roles: [ROLES.SUPERADMIN, ROLES.ADMIN_CENTRAL] },
  { label: 'Auditoría',  icon: ClipboardList, to: '/admin/auditoria',        roles: [ROLES.SUPERADMIN, ROLES.ADMIN_CENTRAL] },
  { label: 'Integración', icon: Plug,          to: '/integracion',            roles: [ROLES.SUPERADMIN] },
]

const NAV_GROUPS: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Gestión',
    items: [
      SIDEBAR_ITEMS.find((item) => item.label === 'Dashboard')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'Proyectos')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'Catálogos')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'Documentos')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'Agenda')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'Normatividad')!,
    ],
  },
  {
    title: 'Financiero',
    items: [
      SIDEBAR_ITEMS.find((item) => item.label === 'Presupuesto')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'Ejecución')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'Balance')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'Estadísticas')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'Modificaciones')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'SAR / Viáticos')!,
    ],
  },
  {
    title: 'Académico',
    items: [
      SIDEBAR_ITEMS.find((item) => item.label === 'Matrículas')!,
      SIDEBAR_ITEMS.find((item) => item.label === 'Nómina')!,
    ],
  },
  {
    title: 'Administración',
    items: ADMIN_ITEMS,
  },
]

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const roles = useAuthStore((s) => s.roles)
  const navigate = useNavigate()

  const canSeeItem = (item: NavItem) =>
    !item.roles || item.roles.some((role) => roles.includes(role))

  return (
    <aside
      className={cn(
        'flex flex-col bg-white text-[#1f2937] shadow-[10px_0_40px_rgba(0,75,130,0.08)] transition-all duration-300',
        sidebarOpen ? 'w-60' : 'w-0 overflow-hidden',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between bg-[linear-gradient(90deg,rgba(0,75,130,0.16),rgba(237,244,251,0.88)_58%,rgba(255,255,255,1))] px-3">
        <button
          type="button"
          onClick={() => navigate({ to: '/dashboard' })}
          className="w-full rounded-[14px] px-2 py-1 text-left transition-colors hover:bg-[#edf4fb]"
          aria-label="Sistema Financiero"
        >
          <BrandMark
            size="sm"
            showText={sidebarOpen}
            className={cn(!sidebarOpen && 'justify-center')}
          />
        </button>
      </div>

      {/* Nav principal */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {NAV_GROUPS.filter((group) => group.items.some(canSeeItem)).map((group) => (
            <div key={group.title} className="border-t border-[#004b82]/10 pt-4 first:border-t-0 first:pt-0">
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b7280]">
                {group.title}
              </p>
              <NavigationMenu items={group.items} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
