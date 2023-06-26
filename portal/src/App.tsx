import { BrowserRouter } from 'react-router-dom'
import Router from './pages/router'
import { Toaster } from 'react-hot-toast'

function App () {

  return (
    <>
      <Toaster />
      <Router />
    </>
  )
}

export default App
