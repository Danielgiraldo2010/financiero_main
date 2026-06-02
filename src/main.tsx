import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { bootstrap } from './app/bootstrap'
import './app.css'

// Sin MSW — el backend es real desde FE0 (FE0-I14)
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('No se encontró el elemento #root en el DOM')
}

createRoot(rootElement).render(
  <StrictMode>
    {bootstrap()}
  </StrictMode>,
)
