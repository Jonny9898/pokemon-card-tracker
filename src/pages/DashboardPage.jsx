import { useState, useCallback } from 'react'
import { CollectionProvider, useCollection } from '../contexts/CollectionContext'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import CardGrid from '../components/CardGrid'
import ImageModal from '../components/ImageModal'

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalCard, setModalCard] = useState(null)
  const { filteredCards } = useCollection()

  const handleCardClick = useCallback((card) => {
    setModalCard(card)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalCard(null)
  }, [])

  const handleNextCard = useCallback(() => {
    if (!modalCard || filteredCards.length === 0) return
    const idx = filteredCards.findIndex(c => c.id === modalCard.id)
    const nextIdx = (idx + 1) % filteredCards.length
    setModalCard(filteredCards[nextIdx])
  }, [modalCard, filteredCards])

  const handlePrevCard = useCallback(() => {
    if (!modalCard || filteredCards.length === 0) return
    const idx = filteredCards.findIndex(c => c.id === modalCard.id)
    const prevIdx = (idx - 1 + filteredCards.length) % filteredCards.length
    setModalCard(filteredCards[prevIdx])
  }, [modalCard, filteredCards])

  // Keep modal card in sync with collection state changes
  const currentModalCard = modalCard
    ? filteredCards.find(c => c.id === modalCard.id) || modalCard
    : null

  return (
    <div className="dashboard">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main-content">
        <CardGrid onCardClick={handleCardClick} />
      </main>

      {currentModalCard && (
        <ImageModal
          card={currentModalCard}
          onClose={handleCloseModal}
          onNext={handleNextCard}
          onPrev={handlePrevCard}
        />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <CollectionProvider>
      <DashboardContent />
    </CollectionProvider>
  )
}
