import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(() => {
    const saved = Number(localStorage.getItem('cart:count'))
    return isNaN(saved) ? 0 : saved
  })

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart:items')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  function addItem(item) {
    const idx = cartItems.findIndex(
      i => i.id === item.id && i.storageName === item.storageName && i.colorName === item.colorName
    )
    let updated
    if (idx !== -1) {
      updated = cartItems.map((i, n) => n === idx ? { ...i, qty: i.qty + 1 } : i)
    } else {
      updated = [...cartItems, { ...item, qty: 1 }]
    }
    const count = updated.reduce((acc, i) => acc + i.qty, 0)
    setCartItems(updated)
    setCartCount(count)
    localStorage.setItem('cart:items', JSON.stringify(updated))
    localStorage.setItem('cart:count', count)
  }

  function removeItem(index) {
    const item = cartItems[index]
    let updated
    if (item.qty > 1) {
      updated = cartItems.map((i, n) => n === index ? { ...i, qty: i.qty - 1 } : i)
    } else {
      updated = cartItems.filter((_, n) => n !== index)
    }
    const count = updated.reduce((acc, i) => acc + i.qty, 0)
    setCartItems(updated)
    setCartCount(count)
    localStorage.setItem('cart:items', JSON.stringify(updated))
    localStorage.setItem('cart:count', count)
  }

  return (
    <CartContext.Provider value={{ cartCount, cartItems, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
