import './SearchBar.css'

function SearchBar({ value, onChange }) {
  return (
    <input
      className="searchbar"
      type="search"
      placeholder="Buscar por marca o modelo..."
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Buscar productos"
    />
  )
}

export default SearchBar
