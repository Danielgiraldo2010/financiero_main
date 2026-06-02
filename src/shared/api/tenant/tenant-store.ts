// shared/api/tenant/tenant-store.ts
// Almacen en memoria para X-Tenant-Id
// Separado de tenant.store (Zustand) para evitar dependencia circular
// Cuando _tenantId es null el header X-Tenant-Id NO se envía,
// lo que el backend interpreta como "todas las unidades" (modo SUPERADMIN global)

let _tenantId: string | null = null

export function getTenantId(): string | null { return _tenantId }
export function setTenantId(id: string): void { _tenantId = id }
export function clearTenantId(): void { _tenantId = null }