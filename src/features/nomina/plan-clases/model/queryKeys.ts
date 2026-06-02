export const planClasesKeys = {
  all:  () => ['nomina', 'plan-clases']             as const,
  list: (p?: object) =>
          ['nomina', 'plan-clases', 'list', p]      as const,
}