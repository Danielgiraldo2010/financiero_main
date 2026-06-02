// src/features/nomina/empleados/model/queryKeys.ts
export const empleadosKeys = {
  all:    () => ['nomina', 'empleados']               as const,
  list:   (p?: object) =>
            ['nomina', 'empleados', 'list', p]        as const,
  detail: (id: number) => ['nomina', 'empleados', id] as const,
}