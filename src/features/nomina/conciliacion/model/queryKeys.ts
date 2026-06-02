export const conciliacionKeys = {
  all:  () => ['nomina', 'conciliacion']                  as const,
  list: (p?: Record<string, unknown>) =>
          ['nomina', 'conciliacion', 'list', p]           as const,
}
