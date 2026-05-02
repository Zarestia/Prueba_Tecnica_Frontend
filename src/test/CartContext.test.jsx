import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartProvider, useCart } from '../context/CartContext'

const iphone = { id: '1', brand: 'Apple', model: 'iPhone 15', imgUrl: '', storageName: '128GB', colorName: 'Negro' }

// componente auxiliar para poder interactuar con el contexto desde los tests
function TestCart() {
  const { cartCount, cartItems, addItem, removeItem } = useCart()
  return (
    <div>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="items">{cartItems.length}</span>
      <button onClick={() => addItem(iphone)}>add</button>
      <button onClick={() => removeItem(0)}>remove</button>
    </div>
  )
}

function setup() {
  render(<CartProvider><TestCart /></CartProvider>)
}

describe('CartContext', () => {
  beforeEach(() => localStorage.clear())

  it('arranca vacío', () => {
    setup()
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('items').textContent).toBe('0')
  })

  it('añadir un producto incrementa el contador', () => {
    setup()
    fireEvent.click(screen.getByText('add'))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('añadir el mismo producto dos veces agrupa en una sola entrada con qty 2', () => {
    setup()
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('add'))
    expect(screen.getByTestId('count').textContent).toBe('2')
    expect(screen.getByTestId('items').textContent).toBe('1') // un solo item agrupado
  })

  it('remove baja qty sin eliminar la entrada', () => {
    setup()
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('remove'))
    expect(screen.getByTestId('count').textContent).toBe('1')
    expect(screen.getByTestId('items').textContent).toBe('1')
  })

  it('remove con qty 1 elimina la entrada', () => {
    setup()
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('remove'))
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('items').textContent).toBe('0')
  })

  it('guarda el count en localStorage', () => {
    setup()
    fireEvent.click(screen.getByText('add'))
    expect(localStorage.getItem('cart:count')).toBe('1')
  })
})
