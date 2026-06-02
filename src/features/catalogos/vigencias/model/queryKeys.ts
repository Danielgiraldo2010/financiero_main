// features/catalogos/vigencias/model/queryKeys.ts

export const vigenciasKeys = {
  all:  ['catalogos', 'vigencias'] as const,
  list: (estado?: string) => [...vigenciasKeys.all, 'list', estado] as const,
  detail: (id: number)   => [...vigenciasKeys.all, 'detail', id] as const,
  unidades: (id: number) => [...vigenciasKeys.all, 'unidades', id] as const,
}
