import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import ProductListPage from './pages/ProductListPage/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
