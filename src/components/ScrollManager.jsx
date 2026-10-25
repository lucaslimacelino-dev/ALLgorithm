import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Rola para o topo ao trocar de página, ou até a âncora (#id) quando houver uma.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}
