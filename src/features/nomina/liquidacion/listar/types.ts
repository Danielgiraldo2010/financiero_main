// PagoNominaResponse: id, nominaEmpleadoId, empleadoNombre, fechaPago,
//   valorTotal, ordenPagoId|null, comprobantePago|null, urlSoporte|null,
//   estado, observaciones|null
export interface PagoNomina {
  id:               number
  nominaEmpleadoId: number
  empleadoNombre:   string
  fechaPago:        string
  valorTotal:       number
  ordenPagoId:      number | null
  comprobantePago:  string | null
  urlSoporte:       string | null
  estado:           string
  observaciones:    string | null
}
