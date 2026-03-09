import { useState } from 'react'
import { useCollection } from '../contexts/CollectionContext'
import InlineEdit from './InlineEdit'

const styles = {
  tile: {
    position: 'relative',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    background: 'var(--bg-card)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  imageWrapper: {
    position: 'relative',
    aspectRatio: '2 / 3',
    overflow: 'hidden',
    background: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'filter 0.3s ease, opacity 0.3s ease',
  },
  checkbox: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 700,
    transition: 'all var(--transition)',
    zIndex: 2,
    border: 'none',
    cursor: 'pointer',
  },
  heart: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    transition: 'all var(--transition)',
    zIndex: 2,
    border: 'none',
    cursor: 'pointer',
  },
  info: {
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderTop: '1px solid var(--border-light)',
  },
  cardName: {
    flex: 1,
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}

export default function CardTile({ card, onClick }) {
  const { toggleCollected, toggleFavorited, renameCard } = useCollection()
  const [hovered, setHovered] = useState(false)

  const handleCollectedClick = (e) => {
    e.stopPropagation()
    toggleCollected(card.id)
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    toggleFavorited(card.id)
  }

  return (
    <div
      style={{
        ...styles.tile,
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(card)}
    >
      <div style={styles.imageWrapper}>
        <img
          src={`${import.meta.env.BASE_URL}images/${card.imageFilename}`}
          alt={card.displayName}
          loading="lazy"
          style={{
            ...styles.image,
            filter: card.isCollected ? 'none' : 'saturate(0.35)',
            opacity: card.isCollected ? 1 : 0.55,
          }}
        />
        <button
          style={{
            ...styles.checkbox,
            background: card.isCollected ? 'var(--color-collected)' : 'rgba(255,255,255,0.85)',
            color: card.isCollected ? 'white' : 'var(--text-tertiary)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}
          onClick={handleCollectedClick}
          title={card.isCollected ? 'Mark as not collected' : 'Mark as collected'}
        >
          {card.isCollected ? '\u2713' : ''}
        </button>
        <button
          style={{
            ...styles.heart,
            background: card.isFavorited ? 'var(--color-favorite)' : 'rgba(255,255,255,0.85)',
            color: card.isFavorited ? 'white' : 'var(--text-tertiary)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}
          onClick={handleFavoriteClick}
          title={card.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {card.isFavorited ? '\u2665' : '\u2661'}
        </button>
      </div>
      <div style={styles.info}>
        <span style={styles.cardName} onClick={e => e.stopPropagation()}>
          <InlineEdit
            value={card.displayName}
            onSave={(name) => renameCard(card.id, name)}
          />
        </span>
      </div>
    </div>
  )
}
