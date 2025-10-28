import { Star, Calendar } from 'lucide-react'

function WatchlistPanel({ watchlist = [] }) {
  const getCompanyColor = (ticker) => {
    const colors = {
      'AAPL': 'bg-purple-500',
      'MSFT': 'bg-blue-500',
      'GOOGL': 'bg-red-500',
      'AMZN': 'bg-orange-500',
    }
    return colors[ticker] || 'bg-brand'
  }

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-5 shadow-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-text">
          <Star size={18} className="text-brand" />
          Your Watchlist
        </h3>
        <p className="text-sm text-textMuted">No companies in your watchlist yet</p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-card">
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-text">
        <Star size={18} className="text-brand" />
        Your Watchlist
      </h3>
      <div className="space-y-3">
        {watchlist.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors cursor-pointer">
            <div className={`w-10 h-10 rounded-lg ${getCompanyColor(item.ticker)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
              <span className="text-sm">{item.ticker?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{item.company_name}</div>
              <div className="flex items-center gap-1 text-xs text-textMuted mt-0.5">
                <Calendar size={12} />
                <span>Next: Q4 2024</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WatchlistPanel
