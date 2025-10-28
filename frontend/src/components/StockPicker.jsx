import { useState, useEffect } from 'react'
import { X, Search, Plus, Check } from 'lucide-react'
import axios from 'axios'

function StockPicker({ isOpen, onClose, onAdd, watchlistItems = [] }) {
  const [stocks, setStocks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchStocks()
    }
  }, [isOpen])

  const fetchStocks = async () => {
    try {
      const res = await axios.get('/api/watchlist/stocks/nasdaq100')
      setStocks(res.data.stocks || [])
    } catch (error) {
      console.error('Error fetching stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStocks = stocks.filter(stock => 
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isInWatchlist = (ticker) => {
    return watchlistItems.some(item => item.ticker === ticker)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg border border-border w-full max-w-2xl max-h-[80vh] flex flex-col shadow-card-hover">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text">Add to Watchlist</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <X size={20} className="text-textMuted" />
          </button>
        </div>

        <div className="p-6 border-b border-border">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
            <input
              type="text"
              placeholder="Search by ticker or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12 text-textMuted">Loading stocks...</div>
          ) : filteredStocks.length === 0 ? (
            <div className="text-center py-12 text-textMuted">No stocks found</div>
          ) : (
            <div className="space-y-2">
              {filteredStocks.map((stock) => {
                const inWatchlist = isInWatchlist(stock.ticker)
                return (
                  <div
                    key={stock.ticker}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      inWatchlist
                        ? 'bg-brand/10 border-brand/30'
                        : 'bg-card border-border hover:border-borderLight hover:shadow-sm'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-text">{stock.ticker}</div>
                      <div className="text-sm text-textMuted truncate">{stock.company_name}</div>
                    </div>
                    <button
                      onClick={() => !inWatchlist && onAdd(stock)}
                      disabled={inWatchlist}
                      className={`ml-3 p-2 rounded-lg transition-colors ${
                        inWatchlist
                          ? 'bg-brand/20 text-brand cursor-not-allowed'
                          : 'bg-brand hover:bg-brand/90 text-white'
                      }`}
                    >
                      {inWatchlist ? <Check size={18} /> : <Plus size={18} />}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border">
          <div className="text-sm text-textMuted">
            {filteredStocks.length} stocks available • {watchlistItems.length} in watchlist
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockPicker
