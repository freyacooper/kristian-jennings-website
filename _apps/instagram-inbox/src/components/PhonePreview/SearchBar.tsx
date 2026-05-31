import { SearchIcon } from './icons'

/**
 * Instagram inbox search pill — full-width rounded grey pill with leading
 * magnifying glass and "Search" placeholder text.
 */
export function SearchBar() {
  return (
    <div
      style={{
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 8,
        paddingBottom: 20,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: 96,
          borderRadius: 24,
          background: 'var(--ig-search-bg)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 32,
          paddingRight: 32,
          gap: 20,
          color: 'var(--ig-search-text)',
        }}
      >
        <SearchIcon size={48} />
        <span style={{ fontSize: 42, fontWeight: 400 }}>Search</span>
      </div>
    </div>
  )
}
