import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiZoomIn, FiX } from 'react-icons/fi'
import { gsap } from 'gsap'
import { getProduct, addToCart } from '../../services/api'
import { useCart } from '../../context/CartContext'
import './ProductDetailPage.css'

const FIELDS = [
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'price', label: 'Precio', format: v => `${v} €` },
  { key: 'cpu', label: 'CPU' },
  { key: 'ram', label: 'RAM' },
  { key: 'os', label: 'Sistema Operativo' },
  { key: 'displayResolution', label: 'Resolución' },
  { key: 'battery', label: 'Batería' },
  { key: 'primaryCamera', label: 'Cámara principal' },
  { key: 'secondaryCmera', label: 'Cámara frontal' },
  { key: 'dimensions', label: 'Dimensiones' },
  { key: 'weight', label: 'Peso' },
]

function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStorage, setSelectedStorage] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  const imgRef = useRef(null)
  const infoRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProduct(id)
      .then(data => {
        setProduct(data)
        setSelectedStorage(data.options?.storages?.[0]?.code ?? null)
        setSelectedColor(data.options?.colors?.[0]?.code ?? null)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!product || !imgRef.current || !infoRef.current) return
    gsap.fromTo(imgRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' })
    gsap.fromTo(infoRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 })
  }, [product])

  function handleAddToCart(e) {
    e.preventDefault()
    const storageCode = selectedStorage ?? product.options?.storages?.[0]?.code
    const colorCode = selectedColor ?? product.options?.colors?.[0]?.code
    setAddingToCart(true)
    addToCart({ id: product.id, colorCode, storageCode })
      .then(res => {
        const storageName = product.options?.storages?.find(s => s.code === storageCode)?.name
        const colorName = product.options?.colors?.find(c => c.code === colorCode)?.name
        addItem({ id: product.id, brand: product.brand, model: product.model, imgUrl: product.imgUrl, storageName, colorName })
      })
      .catch(() => console.error('No se pudo añadir al carrito'))
      .finally(() => setAddingToCart(false))
  }

  if (loading) return (
    <div className="pdp">
      <div className="pdp__skeleton-back" />
      <div className="pdp__layout">
        <div className="pdp__skeleton-img-col">
          <div className="pdp__skeleton-block pdp__skeleton-img-box" />
        </div>
        <div className="pdp__skeleton-info-col">
          <div className="pdp__skeleton-block pdp__skeleton-title" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="pdp__skeleton-block pdp__skeleton-row" style={{ width: `${60 + (i % 3) * 15}%` }} />
          ))}
          <div className="pdp__skeleton-block pdp__skeleton-select" />
          <div className="pdp__skeleton-block pdp__skeleton-select" />
          <div className="pdp__skeleton-block pdp__skeleton-btn" />
        </div>
      </div>
    </div>
  )
  if (error) return <p className="pdp__status pdp__status--error">Error: {error}</p>

  return (
    <div className="pdp">
      <Link to="/" className="pdp__back">← Volver al listado</Link>

      <div className="pdp__layout">
        <div className="pdp__img-col" ref={imgRef}>
          <img src={product.imgUrl} alt={`${product.brand} ${product.model}`} className="pdp__img" />
          <button className="pdp__zoom-btn" onClick={() => setZoomed(true)} aria-label="Ver imagen ampliada">
            <FiZoomIn size={18} />
          </button>
        </div>

        <div className="pdp__info-col" ref={infoRef}>
          <section className="pdp__description">
            <h2>Descripción</h2>
            <dl>
              {FIELDS.map(({ key, label, format }) => {
                const val = product[key]
                if (!val && val !== 0) return null
                const display = Array.isArray(val) ? val.join(', ') : format ? format(val) : val
                return (
                  <div key={key} className="pdp__row">
                    <dt>{label}</dt>
                    <dd>{display}</dd>
                  </div>
                )
              })}
            </dl>
          </section>

          <section className="pdp__actions">
            <h2>Opciones</h2>
            <div className="pdp__field">
              <label htmlFor="storage">Almacenamiento</label>
              <select id="storage" value={selectedStorage ?? product.options?.storages?.[0]?.code ?? ''} onChange={e => setSelectedStorage(Number(e.target.value))}>
                {product.options.storages.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
              </select>
            </div>
            <div className="pdp__field">
              <label htmlFor="color">Color</label>
              <select id="color" value={selectedColor ?? product.options?.colors?.[0]?.code ?? ''} onChange={e => setSelectedColor(Number(e.target.value))}>
                {product.options.colors.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
              </select>
            </div>
            <button className="pdp__btn" onClick={handleAddToCart} disabled={addingToCart}>
              {addingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
            </button>
          </section>
        </div>
      </div>
      {zoomed && (
        <div className="pdp__lightbox" onClick={() => setZoomed(false)}>
          <button className="pdp__lightbox-close" onClick={() => setZoomed(false)} aria-label="Cerrar">
            <FiX size={24} />
          </button>
          <img
            src={product.imgUrl}
            alt={`${product.brand} ${product.model}`}
            className="pdp__lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
