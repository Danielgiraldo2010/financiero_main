export const costosParafiscalesKeys = {
  all:  () => ['nomina', 'costos-parafiscales']             as const,
  list: (p?: object) =>
          ['nomina', 'costos-parafiscales', 'list', p]     as const,
}