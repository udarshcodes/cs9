import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,        // FAQs are static — never refetch unless explicitly invalidated
      gcTime: 30 * 60 * 1000,    // keep unused cache for 30 min
      retry: 1,
      refetchOnWindowFocus: false, // landing page FAQs rarely need this
    },
  },
})
