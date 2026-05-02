import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../components/ProductCard/ProductCard'

const product = { id: 'abc', brand: 'Samsung', model: 'Galaxy S23', price: 799, imgUrl: 'https://example.com/img.jpg' }

function renderCard(p = product) {
  render(<MemoryRouter><ProductCard product={p} /></MemoryRouter>)
}

describe('ProductCard', () => {
  it('muestra marca, modelo y precio', () => {
    renderCard()
    expect(screen.getByText('Samsung')).toBeInTheDocument()
    expect(screen.getByText('Galaxy S23')).toBeInTheDocument()
    expect(screen.getByText('799 €')).toBeInTheDocument()
  })

  it('si no hay precio muestra texto alternativo', () => {
    renderCard({ ...product, price: 0 })
    expect(screen.getByText('Consultar precio')).toBeInTheDocument()
  })

  it('el alt de la imagen tiene marca y modelo', () => {
    renderCard()
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Samsung Galaxy S23')
  })

  it('tiene tabIndex 0 para navegación con teclado', () => {
    renderCard()
    expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0')
  })
})
