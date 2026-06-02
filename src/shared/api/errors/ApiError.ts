// shared/api/errors/ApiError.ts
// Clase de error tipado -- envuelve todas las respuestas de error del backend
// G9: errors se mapea a campos de formulario via error.errors[campo]

export class ApiError extends Error {
  readonly status: number
  readonly errors: Record<string, string[]> | undefined

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }

  get isValidation(): boolean { return this.status === 422 }
  get isUnauthorized(): boolean { return this.status === 401 }
  get isForbidden(): boolean { return this.status === 403 }

  fieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0]
  }
}
