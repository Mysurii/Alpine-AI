
import Router from './pages/router'
import toast, { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useAuthStore from './stores/auth.store'
import { useEffect } from 'react'


const queryClient = new QueryClient( {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
} )

function App () {
  const { setUser } = useAuthStore()

  useEffect( () => {
    const user = localStorage.getItem( 'user' )
    if ( user ) {
      try {
        setUser( JSON.parse( user ) )
      } catch ( err ) {
        toast.error( 'Could not find user' )
      }
    }
  }, [ setUser ] )

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  )
}

export default App
