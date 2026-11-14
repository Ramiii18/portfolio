import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion'
import LangProvider from './components/LangProvider'
import Home from './pages/Home'

const CvPrint = lazy(() => import('./pages/CvPrint'))

export default function App() {
  return (
    <LangProvider>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: 'easeOut' }}>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/cv"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-white" />}>
                    <CvPrint />
                  </Suspense>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </MotionConfig>
      </LazyMotion>
    </LangProvider>
  )
}
