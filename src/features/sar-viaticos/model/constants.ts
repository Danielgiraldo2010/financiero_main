export const ESTADOS_SAR = [
  'BORRADOR', 'APROBADO', 'CON_CDP', 'EJECUTADO', 'ANULADO',
] as const;

export const LABEL_ESTADO_SAR: Record<string, string> = {
  BORRADOR:  'Borrador',
  APROBADO:  'Aprobado',
  CON_CDP:   'Con CDP',
  EJECUTADO: 'Ejecutado',
  ANULADO:   'Anulado',
};

export const ESTADOS_VIATICO = [
  'BORRADOR', 'APROBADO', 'CON_CDP', 'LIQUIDADO', 'ANULADO',
] as const;

export const LABEL_ESTADO_VIATICO: Record<string, string> = {
  BORRADOR:  'Borrador',
  APROBADO:  'Aprobado',
  CON_CDP:   'Con CDP',
  LIQUIDADO: 'Liquidado',
  ANULADO:   'Anulado',
};

export const FUENTES_SAR = [
  'GASTOS_OPERACIONALES_AC14',
  'EXCEDENTES_PROYECTO',
] as const;

export type FuenteSar = typeof FUENTES_SAR[number];

export const LABEL_FUENTE_SAR: Record<FuenteSar, string> = {
  GASTOS_OPERACIONALES_AC14: 'Gastos Operacionales (Ac. 14)',
  EXCEDENTES_PROYECTO:       'Excedentes del Proyecto',
};

export const TIPOS_PERSONAL_VIATICO = [
  'PLANTA_SERVIDOR', 'CATEDRATICO_AC44', 'SUPERNUMERARIO',
] as const;
export type TipoPersonalViatico = typeof TIPOS_PERSONAL_VIATICO[number];

export const LABEL_TIPO_PERSONAL: Record<TipoPersonalViatico, string> = {
  PLANTA_SERVIDOR:  'Planta / Servidores',
  CATEDRATICO_AC44: 'Catedratico (Ac. 44)',
  SUPERNUMERARIO:   'Supernumerario',
};

export const TIPOS_SAR = [
  'DOCENCIA', 'EXTENSION', 'INVESTIGACION', 'ADMINISTRACION',
] as const;

export const LABEL_TIPO_SAR: Record<string, string> = {
  DOCENCIA:       'Docencia',
  EXTENSION:      'Extensión',
  INVESTIGACION:  'Investigación',
  ADMINISTRACION: 'Administración',
};

export const SAR_HORAS_MAX = 80;
// Añadir al final de constants.ts

export const ZONAS_VIATICO = ['LOCAL', 'REGIONAL', 'NACIONAL', 'INTERNACIONAL'] as const;
export type ZonaViatico = typeof ZONAS_VIATICO[number];

export const LABEL_ZONA_VIATICO: Record<ZonaViatico, string> = {
  LOCAL:          'Local',
  REGIONAL:       'Regional',
  NACIONAL:       'Nacional',
  INTERNACIONAL:  'Internacional',
};

export const MUNICIPIO_TIPOS = ['CAPITAL', 'INTERMEDIO'] as const;
export type MunicipioTipo = typeof MUNICIPIO_TIPOS[number];

export const LABEL_MUNICIPIO_TIPO: Record<MunicipioTipo, string> = {
  CAPITAL:    'Capital',
  INTERMEDIO: 'Intermedio',
};