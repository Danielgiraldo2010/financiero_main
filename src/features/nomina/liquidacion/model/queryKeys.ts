export const liquidacionKeys = {
  all:  () => ['nomina', 'liquidacion']              as const,
  list: (p?: object) =>
          ['nomina', 'liquidacion', 'list', p]       as const,
}