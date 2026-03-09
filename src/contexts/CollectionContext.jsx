import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const CollectionContext = createContext(null)

const STORAGE_KEY = 'pokemon-tracker-collection'
const NAMES_KEY = 'pokemon-tracker-names'

function loadFromStorage(key, fallback = {}) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

export function CollectionProvider({ children }) {
  const [cards, setCards] = useState([])
  const [groups, setGroups] = useState([])
  const [activeGroupId, setActiveGroupId] = useState(null)
  const [activeTripId, setActiveTripId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/cards-data.json')
      .then(r => r.json())
      .then(data => {
        const collection = loadFromStorage(STORAGE_KEY)
        const nameOverrides = loadFromStorage(NAMES_KEY)

        const flatCards = []
        const groupsWithCounts = data.groups.map(g => {
          const groupNameKey = `group:${g.id}`
          return {
            ...g,
            displayName: nameOverrides[groupNameKey] || g.displayName,
            trips: g.trips.map(t => {
              const tripNameKey = `trip:${t.id}`
              let collectedCount = 0
              const tripCards = t.cards.map(c => {
                const cardNameKey = `card:${c.id}`
                const state = collection[c.id] || {}
                const isCollected = !!state.collected
                if (isCollected) collectedCount++
                flatCards.push({
                  id: c.id,
                  sectionNumber: c.sectionNumber,
                  displayName: nameOverrides[cardNameKey] || c.displayName,
                  imageFilename: c.imageFilename,
                  sortOrder: c.sortOrder,
                  tripId: t.id,
                  groupId: g.id,
                  isCollected,
                  isFavorited: !!state.favorited,
                })
                return c
              })
              return {
                ...t,
                displayName: nameOverrides[tripNameKey] || t.displayName,
                cardCount: tripCards.length,
                collectedCount,
              }
            }),
          }
        })

        setGroups(groupsWithCounts)
        setCards(flatCards)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load card data:', err)
        setLoading(false)
      })
  }, [])

  const persistCollection = useCallback((updatedCards) => {
    const collection = {}
    updatedCards.forEach(c => {
      if (c.isCollected || c.isFavorited) {
        collection[c.id] = { collected: c.isCollected, favorited: c.isFavorited }
      }
    })
    saveToStorage(STORAGE_KEY, collection)
  }, [])

  const toggleCollected = useCallback((cardId) => {
    setCards(prev => {
      const updated = prev.map(c =>
        c.id === cardId ? { ...c, isCollected: !c.isCollected } : c
      )
      persistCollection(updated)
      return updated
    })

    setGroups(prev => prev.map(g => ({
      ...g,
      trips: g.trips.map(t => {
        const card = cards.find(c => c.id === cardId)
        if (!card || t.id !== card.tripId) return t
        const delta = card.isCollected ? -1 : 1
        return { ...t, collectedCount: t.collectedCount + delta }
      }),
    })))
  }, [cards, persistCollection])

  const toggleFavorited = useCallback((cardId) => {
    setCards(prev => {
      const updated = prev.map(c =>
        c.id === cardId ? { ...c, isFavorited: !c.isFavorited } : c
      )
      persistCollection(updated)
      return updated
    })
  }, [persistCollection])

  const renameCard = useCallback((cardId, name) => {
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, displayName: name } : c
    ))
    const nameOverrides = loadFromStorage(NAMES_KEY)
    nameOverrides[`card:${cardId}`] = name
    saveToStorage(NAMES_KEY, nameOverrides)
  }, [])

  const renameGroup = useCallback((groupId, name) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, displayName: name } : g
    ))
    const nameOverrides = loadFromStorage(NAMES_KEY)
    nameOverrides[`group:${groupId}`] = name
    saveToStorage(NAMES_KEY, nameOverrides)
  }, [])

  const renameTrip = useCallback((tripId, name) => {
    setGroups(prev => prev.map(g => ({
      ...g,
      trips: g.trips.map(t =>
        t.id === tripId ? { ...t, displayName: name } : t
      ),
    })))
    const nameOverrides = loadFromStorage(NAMES_KEY)
    nameOverrides[`trip:${tripId}`] = name
    saveToStorage(NAMES_KEY, nameOverrides)
  }, [])

  const filteredCards = useMemo(() => {
    let result = [...cards]

    if (activeTripId) {
      result = result.filter(c => c.tripId === activeTripId)
    } else if (activeGroupId) {
      result = result.filter(c => c.groupId === activeGroupId)
    }

    switch (filter) {
      case 'collected':
        result = result.filter(c => c.isCollected)
        break
      case 'not_collected':
        result = result.filter(c => !c.isCollected)
        break
      case 'favorites':
        result = result.filter(c => c.isFavorited)
        break
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.displayName.toLowerCase().includes(q)
      )
    }

    return result
  }, [cards, activeGroupId, activeTripId, filter, searchQuery])

  const stats = useMemo(() => {
    const total = cards.length
    const collected = cards.filter(c => c.isCollected).length
    const favorited = cards.filter(c => c.isFavorited).length
    return { total, collected, favorited }
  }, [cards])

  return (
    <CollectionContext.Provider value={{
      cards,
      groups,
      filteredCards,
      stats,
      loading,
      activeGroupId,
      activeTripId,
      filter,
      searchQuery,
      setActiveGroupId,
      setActiveTripId,
      setFilter,
      setSearchQuery,
      toggleCollected,
      toggleFavorited,
      renameCard,
      renameGroup,
      renameTrip,
    }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider')
  return ctx
}
