import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '../components/SearchBar/SearchBar'

describe('SearchBar', () => {
  it('se renderiza el input', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('llama a onChange al escribir', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'samsung' } })
    expect(onChange).toHaveBeenCalledWith('samsung')
  })

  it('refleja el value que le llega por prop', () => {
    render(<SearchBar value="apple" onChange={() => {}} />)
    expect(screen.getByRole('searchbox')).toHaveValue('apple')
  })
})
