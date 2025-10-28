import { useState, useEffect } from 'react'
import { Star, Plus, X, TrendingUp } from 'lucide-react'
import axios from 'axios'
import StockPicker from '../components/StockPicker'
import CompanyLogo from '../components/CompanyLogo'

function Watchlist() {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPicker, setShowPicker] = useState(false)
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get('/api/watchlist/demo_user')
      setWatchlist(res.data.items || [])
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (stock) => {
    try {
      await axios.post('/api/watchlist/demo_user/items', {
        ticker: stock.ticker,
        company_name: stock.company_name
      })
      setShowPicker(false)
      fetchWatchlist()
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
      fetchWatchlist()
    } catch (error) {
      console.error('Error removing from watchlist:', error)
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-textMuted">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-bg">
        <div className="max-w-screen-xl mx-auto p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-text flex items-center gap-3">
                  <Star size={32} className="text-brand" />
                  Your Watchlist
                </h1>
                <p className="text-textMuted">Track earnings calls from your favorite NASDAQ 100 companies</p>
              </div>
              <button
                onClick={() => setShowPicker(true)}
                className="px-4 py-2 bg-brand hover:bg-brand/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add Stocks
              </button>
            </div>
          </div>

          {watchlist.length === 0 ? (
            <div className="bg-surface rounded-lg border border-border p-12 text-center shadow-card">
              <Star size={48} className="text-brand mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-text mb-2">Your watchlist is empty</h3>
              <p className="text-textMuted mb-6">Add NASDAQ 100 stocks to track their earnings calls and get AI-powered insights</p>
              <button
                onClick={() => setShowPicker(true)}
                className="px-6 py-3 bg-brand hover:bg-brand/90 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Add Your First Stock
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {watchlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface rounded-lg border border-border p-4 hover:shadow-card-hover transition-all group cursor-pointer shadow-card"
                  onClick={() => {
                    // Navigate to events filtered by this ticker (future feature)
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <CompanyLogo ticker={item.ticker} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text truncate">{item.company_name}</h3>
                      <div className="text-sm font-mono font-semibold text-brand">{item.ticker}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(item.id)
                      }}
                      disabled={removing === item.id}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all"
                      title="Remove from watchlist"
                    >
                      <X size={16} className="text-red-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-textMuted">
                    <TrendingUp size={12} />
                    <span>Added {new Date(item.added_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

export default Watchlist
