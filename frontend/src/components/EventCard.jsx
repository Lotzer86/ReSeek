import { useNavigate } from 'react-router-dom'
import { FileText, Mic, BarChart } from 'lucide-react'

function EventCard({ event }) {
  const navigate = useNavigate()

  const getCompanyColor = (ticker) => {
    const colors = {
      'AAPL': 'bg-purple-500',
      'MSFT': 'bg-blue-500',
      'GOOGL': 'bg-red-500',
      'AMZN': 'bg-orange-500',
    }
    return colors[ticker] || 'bg-brand'
  }

  return (
    <div
      onClick={() => navigate(`/event/${event.id}`)}
      className="bg-card rounded-lg border border-border p-4 hover:bg-cardHover hover:border-borderLight hover:shadow-card-hover hover:scale-[1.01] transition-all cursor-pointer shadow-card"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-lg ${getCompanyColor(event.ticker)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
          <span>{event.ticker?.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text truncate">{event.company_name}</h4>
          <div className="flex items-center gap-2 text-xs text-textMuted mt-1">
            <span className="font-mono">{event.ticker}</span>
            <span>•</span>
            <span>{event.quarter} {event.fiscal_year}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {event.has_summary && (
          <span className="px-2 py-1 text-xs font-semibold bg-brand/20 text-brand rounded">
            SUMMARY AVAILABLE
          </span>
        )}
        {event.has_transcript && (
          <span className="px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded">
            TRANSCRIPT
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-textMuted">
        {event.has_transcript && <FileText size={14} />}
        {event.audio_url && <Mic size={14} />}
        {event.has_summary && <BarChart size={14} />}
      </div>

      <div className="text-xs text-textMuted mt-3">
        {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  )
}

export default EventCard
