import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './frontend/css/index.css'
import App from './frontend/paginas/LandingPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
