import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Agendamentos from './Agendamentos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Agendamentos />
  </StrictMode>,
)
