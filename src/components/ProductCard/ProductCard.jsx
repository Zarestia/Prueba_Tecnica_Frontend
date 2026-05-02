import { useNavigate } from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product }) {
  const navigate = useNavigate()

  return (
    <article
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/product/${product.id}`)}
    >
      <div className="product-card__img-wrap">
        <img
          src={product.imgUrl}
          alt={`${product.brand} ${product.model}`}
          loading="lazy"
        />
      </div>
      <div className="product-card__info">
        <p className="product-card__brand">{product.brand}</p>
        <p className="product-card__model">{product.model}</p>
        <p className="product-card__price">
          {product.price ? `${product.price} €` : 'Consultar precio'}
        </p>
      </div>
    </article>
  )
}

export default ProductCard
