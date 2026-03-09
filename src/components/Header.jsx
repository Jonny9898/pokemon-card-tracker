import FilterBar from './FilterBar'

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--header-height)',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: '16px',
    zIndex: 100,
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
  },
  menuBtn: {
    display: 'none',
    padding: '6px',
    fontSize: '1.25rem',
    color: 'var(--text-secondary)',
  },
  spacer: {
    flex: 1,
  },
}

export default function Header({ onToggleSidebar }) {
  return (
    <header style={styles.header}>
      <button
        style={styles.menuBtn}
        onClick={onToggleSidebar}
        className="menu-toggle"
        aria-label="Toggle sidebar"
      >
        &#9776;
      </button>
      <div style={styles.logoSection}>
        <img
          src={import.meta.env.BASE_URL + 'pokeball.svg'}
          alt="Pokeball"
          style={{ height: '28px', width: '28px' }}
        />
        <span style={{
          fontSize: '1.2rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.02em',
        }}>
          Pok<span style={{ color: 'var(--color-favorite)' }}>e</span>mon
        </span>
        <span style={styles.title}>Card Tracker</span>
      </div>

      <div style={styles.spacer} />

      <FilterBar />

      <div style={styles.spacer} />
    </header>
  )
}
