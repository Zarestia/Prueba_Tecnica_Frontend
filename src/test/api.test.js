import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

global.fetch = vi.fn()

async function importApi() {
  const mod = await import('../services/api.js')
  return mod
}

const mockProducts = [{ id: '1', brand: 'Apple', model: 'iPhone 15' }]

describe('api service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('llama a fetch y guarda en cache', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockProducts })

    const { getProducts } = await importApi()
    const result = await getProducts()

    expect(fetch).toHaveBeenCalledOnce()
    expect(result).toEqual(mockProducts)
    // tiene que haber guardado algo en localStorage
    expect(localStorage.getItem('cache:/product')).not.toBeNull()
  })

  it('segunda llamada usa cache, no fetch', async () => {
    localStorage.setItem('cache:/product', JSON.stringify({ data: mockProducts, ts: Date.now() }))

    const { getProducts } = await importApi()
    await getProducts()

    expect(fetch).not.toHaveBeenCalled()
  })

  it('ignora cache caducada y vuelve a pedir', async () => {
    // ts de hace más de una hora
    localStorage.setItem('cache:/product', JSON.stringify({
      data: [{ id: 'old' }],
      ts: Date.now() - 61 * 60 * 1000
    }))
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockProducts })

    const { getProducts } = await importApi()
    const result = await getProducts()

    expect(fetch).toHaveBeenCalledOnce()
    expect(result).toEqual(mockProducts)
  })

  it('lanza error si el api devuelve 500', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Server Error' })

    const { getProducts } = await importApi()
    await expect(getProducts()).rejects.toThrow('Error 500')
  })
})
