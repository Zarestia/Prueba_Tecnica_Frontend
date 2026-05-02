import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import SearchBar from '../../components/SearchBar/SearchBar'
import ProductCard from '../../components/ProductCard/ProductCard'
import { MOCK_PRODUCTS } from '../../mocks'
import './ProductListPage.css'

const PAGE_SIZE = 8

function ProductListPage() {
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const sentinelRef = useRef(null)
  const observerRef = useRef(null)

  const filtered = MOCK_PRODUCTS.filter(p => {
    const q = query.toLowerCase()
    return p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)
  })

  const displayed = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  // Resetear visibles al cambiar la query, ya que el listado se ha filtrado y cambia el número de resultados
  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [query])

  // IntersectionObserver para animar tarjetas al entrar/salir del viewport
  useEffect(() => {
    const cardObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const aboveViewport = entry.boundingClientRect.top < 0

          if (entry.isIntersecting) {
            if (aboveViewport) {
              // Entra por arriba al subir: viene de opacity 0 sin y, más lento
              gsap.fromTo(
                entry.target,
                { opacity: 0, y: -40, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out' }
              )
            } else {
              // Entra por abajo al bajar
              gsap.fromTo(
                entry.target,
                { opacity: 0, y: 60, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
              )
            }
          } else if (aboveViewport) {
            gsap.to(entry.target, { opacity: 0, duration: 0.2, ease: 'none' })
          } else {
            gsap.to(entry.target, { opacity: 0, y: 60, scale: 0.9, duration: 0.4, ease: 'power2.in' })
          }
        })
      },
      { threshold: 0.1 }
    )
    observerRef.current = cardObserver
    return () => cardObserver.disconnect()
  }, [])

  // Callback para que cada tarjeta se registre al montarse, así el observer las va animando al entrar/salir del viewport
  const cardRef = useCallback(node => {
    if (node && observerRef.current) {
      gsap.set(node, { opacity: 0 })
      observerRef.current.observe(node)
    }
  }, [])

  // Sentinel para cargar más productos al hacer scroll, de esta manera los productos se van animando al entrar y no se montan todos de golpe, lo que mejora el rendimiento y la experiencia de usuario
  useEffect(() => {
    if (!sentinelRef.current) return
    const sentinel = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(v => v + PAGE_SIZE)
      }
    })
    sentinel.observe(sentinelRef.current)
    return () => sentinel.disconnect()
  }, [hasMore])

  return (
    <div className="plp">
      <div className="plp__toolbar">
        <h1 className="plp__title">Productos</h1>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {filtered.length === 0 ? (
        <p className="plp__empty">No hay resultados para "{query}"</p>
      ) : (
        <>
          <ul className="plp__grid" role="list">
            {displayed.map(product => (
              <li key={product.id} ref={cardRef}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          {/* Este div vacío al final del listado actúa como "sentinel" para el IntersectionObserver, 
          cuando entra en el viewport se cargan más productos, para cargar los productos progresivamente y animar su entrada */}
          {hasMore && <div ref={sentinelRef} className="plp__sentinel" />}
        </>
      )}
    </div>
  )
}

export default ProductListPage
