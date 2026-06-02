/**
 * Permisos para el módulo de documentos.
 * Se evalúan en el componente con useAuthStore((s) => s.roles).
 */
export function canUploadDoc(roles: string[]): boolean {
  return roles.some((r) =>
    ["SUPERADMIN", "ADMIN_CENTRAL", "FINANCIERO", "DECANO", "COORDINADOR"].includes(r)
  );
}

export function canArchiveDoc(roles: string[]): boolean {
  return roles.some((r) =>
    ["SUPERADMIN", "ADMIN_CENTRAL", "FINANCIERO"].includes(r)
  );
}

export function canDeleteDoc(roles: string[]): boolean {
  return roles.some((r) => ["SUPERADMIN", "ADMIN_CENTRAL"].includes(r));
}

export function canEditDoc(roles: string[]): boolean {
  return roles.some((r) =>
    ["SUPERADMIN", "ADMIN_CENTRAL", "FINANCIERO"].includes(r)
  );
}
