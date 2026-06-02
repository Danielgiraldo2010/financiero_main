export const puntosSalarialesKeys = {
  all:  () => ['nomina', 'puntos-salariales']           as const,
  list: (p?: object) =>
          ['nomina', 'puntos-salariales', 'list', p]   as const,
}
