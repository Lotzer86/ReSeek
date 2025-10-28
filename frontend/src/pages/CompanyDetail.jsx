import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, TrendingUp, DollarSign, Building2, Calendar } from 'lucide-react'

function CompanyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [summary, setSummary] = useState(null)
  const [qaItems, setQaItems] = useState([])
  const [transcript, setTranscript] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  const fetchEventDetails = async () => {
    try {
      const [detailRes, transcriptRes] = await Promise.all([
        axios.get(`/api/events/${id}`),
        axios.get(`/api/events/${id}/transcript`).catch(() => ({ data: null }))
      ])
      
      setEvent(detailRes.data)
      setSummary(detailRes.data.summary || null)
      setQaItems(detailRes.data.qa_items || [])
      setTranscript(transcriptRes.data)
    } catch (error) {
      console.error('Error fetching event details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCompanyColor = (ticker) => {
    const colors = {
      'AAPL': 'bg-purple-500',
      'MSFT': 'bg-blue-500',
      'GOOGL': 'bg-red-500',
      'AMZN': 'bg-orange-500',
    }
    return colors[ticker] || 'bg-brand'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-textMuted">Loading...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-textMuted mb-4">Event not found</p>
          <button onClick={() => navigate('/')} className="text-brand hover:underline">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-textMuted hover:text-text mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl ${getCompanyColor(event.ticker)} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
              {event.ticker?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{event.company_name}</h1>
              <div className="flex items-center gap-3 text-textMuted mt-1">
                <span className="font-mono text-sm font-semibold">{event.ticker}</span>
                <span>•</span>
                <span className="text-sm">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span className="text-sm">{event.quarter} {event.fiscal_year}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-1 mt-6">
            {['summary', 'qa', 'transcript', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-brand text-bg'
                    : 'text-textMuted hover:text-text hover:bg-card'
                }`}
              >
                {tab === 'qa' ? 'Q&A Map' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                {summary ? (
                  <>
                    <div className="bg-surface rounded-lg border border-border p-6">
                      <h2 className="text-xl font-semibold mb-4">Key Highlights</h2>
                      <ul className="space-y-3">
                        {summary.quicktake?.highlights?.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-start gap-4 pb-3 border-b border-border/50 last:border-0">
                            <span className="text-text flex-1">{item.text}</span>
                            {item.citation && (
                              <span className="px-2 py-1 text-xs font-mono font-semibold bg-brand/20 text-brand rounded flex-shrink-0">
                                {item.citation.timestamp}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-surface rounded-lg border border-border p-6">
                      <h2 className="text-xl font-semibold mb-4">Key Quotes</h2>
                      <div className="space-y-4">
                        {summary.extractive_quotes?.map((quote, idx) => (
                          <div key={idx} className={`pl-4 py-3 border-l-4 ${getCompanyColor(event.ticker)} bg-card rounded-r-lg`}>
                            <p className="text-text italic mb-2">&quot;{quote.quote}&quot;</p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-semibold text-brand">{quote.speaker}</span>
                              <span className="text-textMuted">•</span>
                              <span className="text-textMuted font-mono">{quote.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {summary.guidance_table && Object.keys(summary.guidance_table).length > 0 && (
                      <div className="bg-surface rounded-lg border border-border p-6">
                        <h2 className="text-xl font-semibold mb-4">Guidance</h2>
                        <div className="space-y-3">
                          {Object.entries(summary.guidance_table).map(([period, metrics]) => (
                            <div key={period} className="bg-card rounded-lg p-4">
                              <div className="font-semibold text-brand mb-2">{period}</div>
                              <ul className="space-y-1 text-sm">
                                {Object.entries(metrics).map(([key, value]) => (
                                  <li key={key} className="flex justify-between">
                                    <span className="text-textMuted">{key}:</span>
                                    <span className="text-text font-medium">{value}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-surface rounded-lg border border-border p-12 text-center">
                    <p className="text-textMuted">No summary available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-4">
                {qaItems.length > 0 ? (
                  qaItems.map((item) => (
                    <div key={item.id} className="bg-surface rounded-lg border border-border p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-semibold text-text">{item.analyst_name}</div>
                          <div className="text-sm text-textMuted">{item.analyst_firm}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.deflection_score > 30 
                            ? 'bg-red-500/20 text-red-400' 
                            : item.deflection_score > 15 
                            ? 'bg-orange-500/20 text-orange-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          Deflection: {item.deflection_score}%
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-card rounded-lg p-4">
                          <div className="text-xs text-textMuted font-semibold mb-1">QUESTION</div>
                          <p className="text-text">{item.question}</p>
                          <span className="text-xs text-textMuted font-mono mt-2 inline-block">{item.question_timestamp}</span>
                        </div>
                        <div className="bg-card rounded-lg p-4">
                          <div className="text-xs text-textMuted font-semibold mb-1">ANSWER</div>
                          <p className="text-text">{item.answer}</p>
                          <span className="text-xs text-textMuted font-mono mt-2 inline-block">{item.answer_timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-surface rounded-lg border border-border p-12 text-center">
                    <p className="text-textMuted">No Q&A items available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="bg-surface rounded-lg border border-border p-6">
                {transcript ? (
                  <pre className="text-sm text-text whitespace-pre-wrap font-mono leading-relaxed">
                    {transcript.raw_text}
                  </pre>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-textMuted">No transcript available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-surface rounded-lg border border-border p-12 text-center">
                <p className="text-text text-lg mb-2">Chat feature coming soon</p>
                <p className="text-textMuted text-sm">Ask questions about this earnings call using AI</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface rounded-lg border border-border p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-textMuted text-sm mb-1">
                    <TrendingUp size={14} />
                    <span>Market Cap</span>
                  </div>
                  <div className="text-text font-semibold">$2.8T</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-textMuted text-sm mb-1">
                    <Building2 size={14} />
                    <span>Sector</span>
                  </div>
                  <div className="text-text font-semibold">Technology</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-textMuted text-sm mb-1">
                    <DollarSign size={14} />
                    <span>Last Close</span>
                  </div>
                  <div className="text-text font-semibold">$175.43</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-textMuted text-sm mb-1">
                    <Calendar size={14} />
                    <span>Next Earnings</span>
                  </div>
                  <div className="text-text font-semibold">Q4 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetail
