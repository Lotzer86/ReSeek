import { Radio } from 'lucide-react'

function LiveTickerList() {
  const liveEvents = [
    { ticker: 'MSFT', companyName: 'Microsoft', color: 'bg-blue-500' },
    { ticker: 'GOOGL', companyName: 'Alphabet', color: 'bg-red-500' },
  ]

  if (liveEvents.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Radio size={16} className="text-red-500 animate-pulse" />
          <h3 className="text-lg font-semibold">Live Right Now</h3>
        </div>
        <p className="text-sm text-textMuted">No live earnings calls at the moment</p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Radio size={16} className="text-red-500 animate-pulse" />
        <h3 className="text-lg font-semibold">Live Right Now</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {liveEvents.map((event) => (
          <div key={event.ticker} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className={`w-12 h-12 rounded-full ${event.color} flex items-center justify-center text-white font-bold relative`}>
              <span className="text-sm">{event.ticker.charAt(0)}</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-surface animate-pulse" />
            </div>
            <span className="text-xs text-textMuted">{event.ticker}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LiveTickerList
