interface DataTablePaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-sm text-muted-foreground">
        Mostrando {from}-{to} de {total} registros
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-sm hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Primera pagina"
        >
          {"<<"}
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-sm hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Pagina anterior"
        >
          {"<"}
        </button>
        <span className="px-3 text-sm">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-sm hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Pagina siguiente"
        >
          {">"}
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-sm hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Ultima pagina"
        >
          {">>"}
        </button>
      </div>
    </div>
  )
}
