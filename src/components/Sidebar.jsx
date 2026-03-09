import { useState } from 'react'
import { useCollection } from '../contexts/CollectionContext'
import ProgressBar from './ProgressBar'
import InlineEdit from './InlineEdit'

const styles = {
  sidebar: {
    position: 'fixed',
    top: 'var(--header-height)',
    left: 0,
    bottom: 0,
    width: 'var(--sidebar-width)',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-light)',
    overflowY: 'auto',
    padding: '16px',
    zIndex: 90,
    transition: 'transform 0.3s ease',
  },
  sectionTitle: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-tertiary)',
    marginBottom: '8px',
    marginTop: '16px',
  },
  overallStats: {
    marginBottom: '20px',
    padding: '12px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  statsValue: {
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  allCardsBtn: {
    width: '100%',
    padding: '8px 12px',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    transition: 'background var(--transition)',
    marginBottom: '4px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  groupItem: {
    marginBottom: '4px',
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'background var(--transition)',
    gap: '8px',
  },
  chevron: {
    fontSize: '0.625rem',
    color: 'var(--text-tertiary)',
    transition: 'transform 0.2s ease',
    flexShrink: 0,
    width: '12px',
  },
  groupName: {
    flex: 1,
    fontSize: '0.875rem',
    fontWeight: 500,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  groupCount: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },
  tripList: {
    marginLeft: '20px',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
  },
  tripItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 12px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background var(--transition)',
    gap: '8px',
    fontSize: '0.8125rem',
  },
  tripName: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tripCount: {
    fontSize: '0.6875rem',
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },
}

export default function Sidebar({ isOpen }) {
  const {
    groups,
    stats,
    activeGroupId,
    activeTripId,
    setActiveGroupId,
    setActiveTripId,
    renameGroup,
    renameTrip,
  } = useCollection()

  const [expandedGroups, setExpandedGroups] = useState(new Set(groups.map(g => g.id)))

  const toggleExpand = (groupId) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  const handleGroupClick = (groupId) => {
    setActiveGroupId(activeGroupId === groupId ? null : groupId)
    setActiveTripId(null)
  }

  const handleTripClick = (tripId, groupId) => {
    if (activeTripId === tripId) {
      setActiveTripId(null)
      setActiveGroupId(null)
    } else {
      setActiveTripId(tripId)
      setActiveGroupId(groupId)
    }
  }

  const handleAllCards = () => {
    setActiveGroupId(null)
    setActiveTripId(null)
  }

  const totalCollected = groups.reduce(
    (sum, g) => sum + g.trips.reduce((s, t) => s + t.collectedCount, 0),
    0
  )

  return (
    <aside
      style={{
        ...styles.sidebar,
        ...(isOpen ? {} : {}),
      }}
      className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
    >
      <div style={styles.overallStats}>
        <div style={styles.statsRow}>
          <span>Total Cards</span>
          <span style={styles.statsValue}>{stats.total}</span>
        </div>
        <div style={styles.statsRow}>
          <span>Collected</span>
          <span style={styles.statsValue}>{stats.collected}</span>
        </div>
        <div style={styles.statsRow}>
          <span>Favorites</span>
          <span style={{ ...styles.statsValue, color: 'var(--color-favorite)' }}>{stats.favorited}</span>
        </div>
        <ProgressBar current={totalCollected} total={stats.total} />
      </div>

      <button
        style={{
          ...styles.allCardsBtn,
          background: !activeGroupId && !activeTripId ? 'var(--accent-light)' : 'transparent',
          color: !activeGroupId && !activeTripId ? 'var(--accent)' : 'var(--text-primary)',
        }}
        onClick={handleAllCards}
      >
        All Cards
      </button>

      <div style={styles.sectionTitle}>Collections</div>

      {groups.map(group => {
        const isExpanded = expandedGroups.has(group.id)
        const isActive = activeGroupId === group.id && !activeTripId
        const groupCollected = group.trips.reduce((s, t) => s + t.collectedCount, 0)
        const groupTotal = group.trips.reduce((s, t) => s + t.cardCount, 0)

        return (
          <div key={group.id} style={styles.groupItem}>
            <div
              style={{
                ...styles.groupHeader,
                background: isActive ? 'var(--accent-light)' : 'transparent',
              }}
              onMouseOver={e => {
                if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'
              }}
              onMouseOut={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span
                style={{
                  ...styles.chevron,
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
                onClick={(e) => { e.stopPropagation(); toggleExpand(group.id) }}
              >
                &#9658;
              </span>
              <span
                style={styles.groupName}
                onClick={() => handleGroupClick(group.id)}
              >
                <InlineEdit
                  value={group.displayName}
                  onSave={(name) => renameGroup(group.id, name)}
                />
              </span>
              <span style={styles.groupCount}>{groupCollected}/{groupTotal}</span>
            </div>

            {isExpanded && (
              <div style={styles.tripList}>
                {group.trips.map(trip => {
                  const isTripActive = activeTripId === trip.id

                  return (
                    <div
                      key={trip.id}
                      style={{
                        ...styles.tripItem,
                        background: isTripActive ? 'var(--accent-light)' : 'transparent',
                        color: isTripActive ? 'var(--accent)' : 'var(--text-secondary)',
                      }}
                      onMouseOver={e => {
                        if (!isTripActive) e.currentTarget.style.background = 'var(--bg-hover)'
                      }}
                      onMouseOut={e => {
                        if (!isTripActive) e.currentTarget.style.background = isTripActive ? 'var(--accent-light)' : 'transparent'
                      }}
                      onClick={() => handleTripClick(trip.id, group.id)}
                    >
                      <span style={styles.tripName}>
                        <InlineEdit
                          value={trip.displayName}
                          onSave={(name) => renameTrip(trip.id, name)}
                        />
                      </span>
                      <span style={styles.tripCount}>
                        {trip.collectedCount}/{trip.cardCount}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </aside>
  )
}
