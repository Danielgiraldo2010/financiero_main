export interface PagedResult<T> {
  items: T[]
  total: number
  pagina: number
  tamanoPagina: number
  totalPaginas: number
}

export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
}

/** Params de paginacion — usa page/pageSize internamente,
 *  el fetcher los mapea a pagina/tamanoPagina al construir la query */
export interface PaginationParams {
  pagina: number
  tamanoPagina: number
}

/** Alias para codigo nuevo generado por scripts fe_01b+ */
export interface PageParams {
  page?: number
  pageSize?: number
}
