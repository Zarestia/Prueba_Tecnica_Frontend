# Prueba Tecnica Frontend - Mobile Shop

Aplicación SPA para explorar y comprar dispositivos móviles. Prueba técnica front-end.

## Scripts

```bash
npm start       # Modo desarrollo (Vite dev server)
npm run build   # Compilación para producción
npm test        # Lanzamiento de tests (Vitest)
npm run lint    # Comprobación de código (ESLint)
```

## Requisitos

- Node.js 18+
- npm 9+

## Stack

- **React 19** + **Vite 8**
- **react-router-dom v7** — Enrutado SPA de cliente
- **GSAP** — Animaciones de entrada en tarjetas y detalle de producto
- **react-icons** — Iconografía
- **Vitest** + **@testing-library/react** — Testing

## API

Base URL: `https://itx-frontend-test.onrender.com/api`

| Endpoint | Descripción |
|---|---|
| `GET /product` | Listado de productos |
| `GET /product/:id` | Detalle de producto |
| `POST /cart` | Añadir producto a la cesta |

Los datos del API se cachean en `localStorage` durante 1 hora. Pasado ese tiempo se revalida la petición automáticamente.

## Decisiones técnicas

- **Infinite scroll** mediante `IntersectionObserver` sobre un sentinel, mostrando los productos de 8 en 8 para no montar todos los nodos a la vez.
- **Skeleton loading** en listado y detalle de productos para mejorar la percepción de carga.
- **CartContext** persiste el carrito en `localStorage` (items + count) para que sobreviva a recargas, ya que la API siempre devuelve `{ count: 1 }`
- Sin CSS frameworks — Estilos propios con CSS Modules por componente.
