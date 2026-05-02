import { Link, useLocation } from 'react-router-dom'
import { FiSmartphone, FiShoppingCart } from 'react-icons/fi'
import './Header.css'

const SEGMENT_LABELS = {
  product: 'Detalle',
  cart: 'Carrito',
}

function Header() {
  const location = useLocation()

  const crumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .filter(seg => SEGMENT_LABELS[seg])
    .map(seg => SEGMENT_LABELS[seg])

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
            <div className="header__logo-icon">
                <FiSmartphone size={20} /> 
            </div>
            <div className="header__logo-text">
                Mobile Shop
            </div>
        </Link>
        <nav className="breadcrumbs">
          <Link to="/">Inicio</Link>
          {crumbs.map(label => (
            <span key={label}>
              <span className="sep">/</span>
              <span>&nbsp;{label}</span>
            </span>
          ))}
        </nav>
        <div className="header__cart">
          <FiShoppingCart size={20} />
          <span className="header__cart-count">0</span>
        </div>
      </div>
    </header>
  )
}

export default Header
