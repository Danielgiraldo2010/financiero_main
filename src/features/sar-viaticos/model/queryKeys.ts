export const sarViaticosKeys = {
  all: ['sar-viaticos'] as const,

  sar:       () => [...sarViaticosKeys.all, 'sar'] as const,
  sarList:   (params?: object) =>
    [...sarViaticosKeys.sar(), 'list', params ?? {}] as const,
  sarDetail: (id: number) => [...sarViaticosKeys.sar(), 'detail', id] as const,

  tarifas:      () => [...sarViaticosKeys.all, 'tarifas'] as const,
  tarifasList:  (params?: object) =>
    [...sarViaticosKeys.tarifas(), 'list', params ?? {}] as const,
  tarifaDetail: (id: number) =>
    [...sarViaticosKeys.tarifas(), 'detail', id] as const,

  viaticos:       () => [...sarViaticosKeys.all, 'viaticos'] as const,
  viaticosList:   (params?: object) =>
    [...sarViaticosKeys.viaticos(), 'list', params ?? {}] as const,
  viaticosDetail: (id: number) =>
    [...sarViaticosKeys.viaticos(), 'detail', id] as const,

  resumen: (vigencia?: number) =>
    [...sarViaticosKeys.all, 'resumen', vigencia ?? 'all'] as const,
} as const;
