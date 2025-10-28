import { useState } from 'react'
import { Star, Calendar, Plus, X } from 'lucide-react'
import StockPicker from './StockPicker'
import axios from 'axios'

function WatchlistPanel({ watchlist = [], onUpdate }) {
  const [showPicker, setShowPicker] = useState(false)
  const [removing, setRemoving] = useState(null)

  const getCompanyColor = (ticker) => {
    const colors = {
      'AAPL': 'bg-purple-500',
      'MSFT': 'bg-blue-500',
      'GOOGL': 'bg-red-500',
      'GOOG': 'bg-red-500',
      'AMZN': 'bg-orange-500',
      'META': 'bg-blue-600',
      'TSLA': 'bg-red-600',
      'NVDA': 'bg-green-600',
    }
    return colors[ticker] || 'bg-brand'
  }

  const handleAdd = async (stock) => {
    try {
      await axios.post('/api/watchlist/demo_user/items', {
        ticker: stock.ticker,
        company_name: stock.company_name
      })
      setShowPicker(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      alert(error.response?.data?.detail || 'Failed to add stock to watchlist')
    }
  }

  const handleRemove = async (itemId) => {
    if (removing === itemId) return
    
    setRemoving(itemId)
    try {
      await axios.delete(`/api/watchlist/items/${itemId}`)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error removing from watchlist:', error)
    } finally {
      setRemoving(null)
    }
  }

  return (
    <>
      <div className="bg-surface rounded-lg border border-border p-5 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-text">
            <Star size={18} className="text-brand" />
            Your Watchlist
          </h3>
          <button
            onClick={() => setShowPicker(true)}
            className="p-2 hover:bg-card rounded-lg transition-colors group"
            title="Add stock"
          >
            <Plus size={18} className="text-brand group-hover:text-brand/80" />
          </button>
        </div>

        {(!watchlist || watchlist.length === 0) ? (
          <div className="text-center py-8">
            <p className="text-sm text-textMuted mb-3">No companies in your watchlist yet</p>
            <button
              onClick={() => setShowPicker(true)}
              className="px-4 py-2 bg-brand hover:bg-brand/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Add Stocks
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {watchlist.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors group">
                <div className={`w-10 h-10 rounded-lg ${getCompanyColor(item.ticker)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  <span className="text-sm">{item.ticker?.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate text-text">{item.company_name}</div>
                  <div className="flex items-center gap-1 text-xs text-textMuted mt-0.5">
                    <span className="font-mono font-semibold">{item.ticker}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={removing === item.id}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all"
                  title="Remove from watchlist"
                >
                  <X size={14} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <StockPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onAdd={handleAdd}
        watchlistItems={watchlist}
      />
    </>
  )
}

export default WatchlistPanel
