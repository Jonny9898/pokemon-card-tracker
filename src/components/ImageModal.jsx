import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useCollection } from '../contexts/CollectionContext'

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'var(--bg-overlay)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    position: 'relative',
    maxWidth: '420px',
    width: '100%',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-lg)',
    animation: 'modalIn 0.2s ease',
  },
  closeBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    fontSize: '1.125rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    border: 'none',
    cursor: 'pointer',
    lineHeight: 1,
  },
  image: {
    width: '100%',
    display: 'block',
  },
  info: {
    padding: '14px 16px',
    borderTop: '1px solid var(--border-light)',
  },
  cardName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '10px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  actionBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all var(--transition)',
    cursor: 'pointer',
    border: '1px solid var(--border-light)',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.4)',
    color: 'white',
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    zIndex: 2,
    transition: 'background var(--transition)',
  },
}

export default function ImageModal({ card, onClose, onNext, onPrev }) {
  const { toggleCollected, toggleFavorited } = useCollection()

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight') onNext()
    if (e.key === 'ArrowLeft') onPrev()
  }, [onClose, onNext, onPrev])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!card) return null

  return createPortal(
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>&times;</button>

        <button
          style={{ ...styles.navBtn, left: '-48px' }}
          onClick={onPrev}
          aria-label="Previous card"
        >
          &#8249;
        </button>

        <button
          style={{ ...styles.navBtn, right: '-48px' }}
          onClick={onNext}
          aria-label="Next card"
        >
          &#8250;
        </button>

        <img
          src={`${import.meta.env.BASE_URL}images/${card.imageFilename}`}
          alt={card.displayName}
          style={styles.image}
        />

        <div style={styles.info}>
          <div style={styles.cardName}>{card.displayName}</div>
          <div style={styles.actions}>
            <button
              style={{
                ...styles.actionBtn,
                background: card.isCollected ? 'var(--accent-light)' : 'transparent',
                borderColor: card.isCollected ? 'var(--accent)' : 'var(--border-light)',
                color: card.isCollected ? 'var(--accent)' : 'var(--text-secondary)',
              }}
              onClick={() => toggleCollected(card.id)}
            >
              {card.isCollected ? '\u2713 Collected' : 'Not Collected'}
            </button>
            <button
              style={{
                ...styles.actionBtn,
                background: card.isFavorited ? '#FEF2F2' : 'transparent',
                borderColor: card.isFavorited ? 'var(--color-favorite)' : 'var(--border-light)',
                color: card.isFavorited ? 'var(--color-favorite)' : 'var(--text-secondary)',
              }}
              onClick={() => toggleFavorited(card.id)}
            >
              {card.isFavorited ? '\u2665 Favorite' : '\u2661 Favorite'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
