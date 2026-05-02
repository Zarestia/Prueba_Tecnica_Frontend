import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { MOCK_PRODUCT_DETAIL } from '../../mocks'
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
  // de momento tiramos del mock independientemente del id
  const { id } = useParams()
  const product = MOCK_PRODUCT_DETAIL

  const [selectedStorage, setSelectedStorage] = useState(product.internalMemory[0].code)
  const [selectedColor, setSelectedColor] = useState(product.colors[0].code)

  const imgRef = useRef(null)
  const infoRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(imgRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' })
    gsap.fromTo(infoRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 })
  }, [])

  function handleAddToCart(e) {
    e.preventDefault()
    alert(`Añadido: ${product.brand} ${product.model} — ${selectedStorage} / color ${selectedColor}`)
  }

  return (
    <div className="pdp">
      <Link to="/" className="pdp__back">← Volver al listado</Link>

      <div className="pdp__layout">
        <div className="pdp__img-col" ref={imgRef}>
          <img src={product.imgUrl} alt={`${product.brand} ${product.model}`} className="pdp__img" />
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
              <select id="storage" value={selectedStorage} onChange={e => setSelectedStorage(Number(e.target.value))}>
                {product.internalMemory.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
              </select>
            </div>
            <div className="pdp__field">
              <label htmlFor="color">Color</label>
              <select id="color" value={selectedColor} onChange={e => setSelectedColor(Number(e.target.value))}>
                {product.colors.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
              </select>
            </div>
            <button className="pdp__btn" onClick={handleAddToCart}>
              Añadir al carrito
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
