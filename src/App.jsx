import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { I18nProvider } from './i18n'
import ScrollManager from './components/ScrollManager'
import Landing from './pages/Landing'
import Library from './pages/Library'
import AlgorithmPage from './pages/AlgorithmPage'
import CategoryPage from './pages/CategoryPage'

export default function App() {
  return (
    <I18nProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollManager />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/algoritmos" element={<Library />} />
            <Route path="/algoritmos/:id" element={<AlgorithmPage />} />
            <Route path="/categorias/:id" element={<CategoryPage />} />
            {/* Rota antiga, mantida para links já compartilhados */}
            <Route path="/dashboard" element={<Navigate to="/algoritmos" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </I18nProvider>
  )
}
