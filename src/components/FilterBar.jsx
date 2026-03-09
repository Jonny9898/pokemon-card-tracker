import { useState, useEffect } from 'react'
import { useCollection } from '../contexts/CollectionContext'

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    maxWidth: '500px',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-tertiary)',
    fontSize: '0.875rem',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 32px',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color var(--transition)',
  },
  select: {
    padding: '8px 28px 8px 12px',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B6B' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    minWidth: '140px',
  },
}

export default function FilterBar() {
  const { filter, setFilter, setSearchQuery } = useCollection()
  const [localSearch, setLocalSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, setSearchQuery])

  return (
    <div style={styles.container}>
      <div style={styles.searchWrapper}>
        <span style={styles.searchIcon}>&#128269;</span>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search cards..."
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
        />
      </div>
      <select
        style={styles.select}
        value={filter}
        onChange={e => setFilter(e.target.value)}
      >
        <option value="all">All Cards</option>
        <option value="collected">Collected</option>
        <option value="not_collected">Not Collected</option>
        <option value="favorites">Favorites</option>
      </select>
    </div>
  )
}
