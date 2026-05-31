import { MicIcon, SearchIcon } from './icons'

/**
 * iOS 17 search pill — rounded grey pill with leading magnifying glass,
 * "Search" placeholder, and a trailing mic icon (Siri voice search).
 */
export function SearchBar() {
  return (
    <div
      style={{
        paddingLeft: 52,
        paddingRight: 52,
        paddingTop: 4,
        paddingBottom: 24,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: 100,
          borderRadius: 32,
          background: 'var(--ios-search-bg)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 32,
          paddingRight: 32,
          gap: 18,
          color: 'var(--ios-secondary-text)',
        }}
      >
        <SearchIcon size={48} />
        <span style={{ fontSize: 47, fontWeight: 400 }}>Search</span>
        <div style={{ flex: 1 }} />
        <MicIcon size={48} />
      </div>
    </div>
  )
}
