import { useCollection } from '../contexts/CollectionContext'
import CardTile from './CardTile'

const styles = {
  container: {
    padding: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(var(--card-min-width), 1fr))',
    gap: 'var(--grid-gap)',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '12px',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '4px',
    color: 'var(--text-secondary)',
  },
  emptyHint: {
    fontSize: '0.875rem',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    color: 'var(--text-tertiary)',
    fontSize: '1rem',
  },
  resultCount: {
    fontSize: '0.8125rem',
    color: 'var(--text-tertiary)',
    marginBottom: '12px',
  },
}

export default function CardGrid({ onCardClick }) {
  const { filteredCards, loading, filter, searchQuery } = useCollection()

  if (loading) {
    return <div style={styles.loading}>Loading your collection...</div>
  }

  return (
    <div style={styles.container}>
      {filteredCards.length > 0 && (
        <div style={styles.resultCount}>
          Showing {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''}
        </div>
      )}

      {filteredCards.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            {filter === 'favorites' ? '\u2661' : filter === 'collected' ? '\u2713' : '\uD83C\uDCCF'}
          </div>
          <div style={styles.emptyText}>
            {searchQuery
              ? 'No cards match your search'
              : filter === 'favorites'
              ? 'No favorite cards yet'
              : filter === 'collected'
              ? 'No collected cards yet'
              : filter === 'not_collected'
              ? 'All cards collected!'
              : 'No cards found'}
          </div>
          <div style={styles.emptyHint}>
            {searchQuery
              ? 'Try a different search term'
              : filter !== 'all'
              ? 'Try changing the filter'
              : ''}
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredCards.map(card => (
            <CardTile
              key={card.id}
              card={card}
              onClick={onCardClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
