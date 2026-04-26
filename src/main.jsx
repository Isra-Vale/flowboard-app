import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FlowBoard from './FlowBoard.jsx'

createRoot(document.getElementById('root')).render(
  <FlowBoard />
)
