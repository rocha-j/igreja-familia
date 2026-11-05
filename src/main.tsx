import { StrictMode } from 'react'
import { MotionConfig } from 'framer-motion'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ScrollProvider } from './motion/ScrollProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <MotionConfig reducedMotion="user">
        <ScrollProvider>
          <App />
        </ScrollProvider>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)
