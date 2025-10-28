import { Radio } from 'lucide-react'
import CompanyLogo from './CompanyLogo'

function LiveTickerList() {
  const liveEvents = [
    { ticker: 'MSFT', companyName: 'Microsoft' },
    { ticker: 'GOOGL', companyName: 'Alphabet' },
    { ticker: 'AAPL', companyName: 'Apple' },
    { ticker: 'NVDA', companyName: 'NVIDIA' },
  ]

  if (liveEvents.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Radio size={16} className="text-red-500 animate-pulse" />
          <h3 className="text-lg font-semibold text-text">Live Right Now</h3>
        </div>
        <p className="text-sm text-textMuted">No live earnings calls at the moment</p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Radio size={16} className="text-red-500 animate-pulse" />
        <h3 className="text-lg font-semibold text-text">Live Right Now</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {liveEvents.map((event) => (
          <div key={event.ticker} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="relative">
              <CompanyLogo ticker={event.ticker} size="lg" className="rounded-full" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-surface animate-pulse" />
            </div>
            <span className="text-xs font-medium text-textMuted">{event.ticker}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LiveTickerList
