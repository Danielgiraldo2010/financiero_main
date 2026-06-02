import { QueryClient } from '@tanstack/react-query'

// Singleton — compartido por toda la app.
// FE0-I2: staleTime=5min, retry=1, refetchOnWindowFocus=false
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
      throwOnError: false,
    },
    mutations: {
      throwOnError: false,
    },
  },
})
