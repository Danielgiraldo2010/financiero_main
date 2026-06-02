// shared/api/fetcher.ts
// G1: TODO fetch del proyecto pasa por aqui -- nunca fetch directo en features
import { applyRequestInterceptor } from './interceptors/request'
import { applyResponseInterceptor } from './interceptors/response'

const API_URL = import.meta.env.VITE_API_URL as string | undefined
const BASE_URL = API_URL?.trim() ? API_URL.replace(/\/$/, '') : ''

function buildUrl(baseUrl: string, path: string): string {
  if (!baseUrl) {
    return path
  }

  if (path === baseUrl || path.startsWith(`${baseUrl}/`)) {
    return path
  }

  if (baseUrl.endsWith('/') && path.startsWith('/')) {
    return `${baseUrl}${path.slice(1)}`
  }

  if (!baseUrl.endsWith('/') && !path.startsWith('/')) {
    return `${baseUrl}/${path}`
  }

  return `${baseUrl}${path}`
}

export async function fetcher<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = buildUrl(BASE_URL, path)
  const firstInit = applyRequestInterceptor(url, init)
  const firstResponse = await fetch(url, firstInit)

  const retryFn = async (): Promise<T> => {
    const retryInit = applyRequestInterceptor(url, init)
    const retryResponse = await fetch(url, retryInit)
    return applyResponseInterceptor<T>(retryResponse)
  }

  return applyResponseInterceptor<T>(firstResponse, retryFn)
}
