const BASE_URL = 'https://itx-frontend-test.onrender.com/api'
const CACHE_TTL = 60 * 60 * 1000 // 1 hora en ms

function getCached(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(key)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }))
  } catch {
    // Mostramos aviso en consola
    console.warn('No se pudo guardar en cache:', key)
  }
}
// Devolvemos la promesa para que el componente pueda manejar loading/error, aunque internamente use cache y fetch según el caso
async function get(path) {

  // Esperamos 1.5s para simular latencia de red y poder apreciar mejor las animaciones de carga, aunque la cache se devuelva instantáneamente. En un caso real, no haríamos esto, pero como el API es muy rápida, nos ayuda a visualizar mejor los estados de carga y las animaciones.
  // await new Promise(resolve => setTimeout(resolve, 1500))
  const key = `cache:${path}`
  const cached = getCached(key)
  if (cached) return cached

  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
  const data = await res.json()
  setCache(key, data)
  return data
}

// Utilizamos la funcion get para aprovechar la cache en las peticiones de productos, que son las que más se repiten y comparten datos
export async function getProducts() {
  return get('/product')
}

// Cacheamos la consulta del detalle de producto con otra key, aunque el detalle del producto tambien sea una consulta sobre un producto del listado, ya que la respuesta es completamente diferente, con mucho mas detalle de los productos.
// De esta manera, evitamos contaminar la cache del listado con datos que no se usan alli, optimizando el uso de la cache y evitando almacenar datos innecesarios.
export async function getProduct(id) {
  return get(`/product/${id}`)
}

// Devolvemos la promesa para que el componente pueda manejar loading/error.
// !!!! Siempre devuelve { count: 1 }, asi que guardaremos en cache los productos añadidos al carro para reflejar conteo
export async function addToCart({ id, colorCode, storageCode }) {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, colorCode, storageCode }),
  })
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
  return res.json()
}
