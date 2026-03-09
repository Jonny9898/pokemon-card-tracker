const styles = {
  container: {
    width: '100%',
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: '4px',
  },
  track: {
    width: '100%',
    height: '6px',
    background: 'var(--border-light)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  trackSmall: {
    height: '4px',
  },
  fill: {
    height: '100%',
    background: 'var(--accent)',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
    minWidth: '0',
  },
}

export default function ProgressBar({ current, total, showLabel = true, size = 'md' }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div style={styles.container}>
      {showLabel && (
        <div style={styles.label}>
          <span>{current} / {total}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div style={{ ...styles.track, ...(size === 'sm' ? styles.trackSmall : {}) }}>
        <div style={{ ...styles.fill, width: `${percentage}%` }} />
      </div>
    </div>
  )
}
