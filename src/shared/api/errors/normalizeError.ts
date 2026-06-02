// shared/api/errors/normalizeError.ts
import { ApiError } from './ApiError'

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (error instanceof Error) return new ApiError(error.message, 0)
  if (typeof error === 'string') return new ApiError(error, 0)
  return new ApiError('Error desconocido', 0)
}
