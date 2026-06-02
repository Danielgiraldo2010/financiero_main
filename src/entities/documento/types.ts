export type TipoDocumento =
  | 'CONTRATO'
  | 'ACTA'
  | 'RESOLUCION'
  | 'INFORME'
  | 'SOPORTE'
  | 'OTRO'

export interface Documento {
  id: number
  nombre: string
  tipo: TipoDocumento
  url: string
  entidadTipo: string
  entidadId: number
  tamanoBytes: number
  mimeType: string
  subidoPor: string
  createdAt: string
}
