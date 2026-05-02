import { FiX, FiTrash2 } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

function CartDropdown({ onClose }) {
  const { cartCount, cartItems, removeItem } = useCart()

  return (
    <div className="header__cart-dropdown">
      <div className="header__cart-header">
        <span>Carrito ({cartCount})</span>
        <button className="header__cart-close" onClick={onClose} aria-label="Cerrar">
          <FiX size={16} />
        </button>
      </div>
      {cartItems.length === 0 ? (
        <p className="header__cart-empty">El carrito está vacío</p>
      ) : (
        <ul className="header__cart-list">
          {cartItems.map((item, i) => (
            <li key={i} className="header__cart-item">
              <img src={item.imgUrl} alt={item.model} className="header__cart-img" />
              <div className="header__cart-info">
                <span className="header__cart-name">{item.brand} {item.model}</span>
                <span className="header__cart-opts">{item.storageName} · {item.colorName}</span>
              </div>
              <div className="header__cart-actions">
                {item.qty > 1 && <span className="header__cart-qty">{item.qty}</span>}
                <button className="header__cart-remove" onClick={() => removeItem(i)} aria-label="Eliminar">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CartDropdown
