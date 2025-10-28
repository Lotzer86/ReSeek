import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, TrendingUp, DollarSign, Building2, Calendar } from 'lucide-react'
import CompanyLogo from '../components/CompanyLogo'

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
      'AAPL': 'border-purple-500',
      'MSFT': 'border-blue-500',
      'GOOGL': 'border-red-500',
      'AMZN': 'border-orange-500',
    }
    return colors[ticker] || 'border-brand'
  }

  const getPreviousEvents = (ticker) => {
    const events = {
      'AAPL': [
        { quarter: 'Q2 2024', date: 'July 15, 2024', revenue: '$85.8B', growth: '+5%', highlights: ['iPhone 15 launch success', 'Services growth 14%', 'Vision Pro early adoption'] },
        { quarter: 'Q1 2024', date: 'April 10, 2024', revenue: '$90.8B', growth: '+4%', highlights: ['Holiday quarter record', 'Mac revenue up 21%', 'Wearables strong growth'] },
        { quarter: 'Q4 2023', date: 'January 8, 2024', revenue: '$119.6B', growth: '+2%', highlights: ['Record services quarter', 'Greater China stabilizing', 'Operating margin 30.7%'] },
        { quarter: 'Q3 2023', date: 'October 12, 2023', revenue: '$89.5B', growth: '+1%', highlights: ['iPhone 14 Pro demand', 'India revenue doubling', 'Services all-time high'] },
      ],
      'MSFT': [
        { quarter: 'Q2 2024', date: 'July 18, 2024', revenue: '$56.2B', growth: '+15%', highlights: ['Azure growth 29%', 'GitHub Copilot adoption', 'Gaming revenue up 44%'] },
        { quarter: 'Q1 2024', date: 'April 16, 2024', revenue: '$61.9B', growth: '+17%', highlights: ['Copilot for M365 GA', 'LinkedIn revenue +10%', 'Xbox strong quarter'] },
        { quarter: 'Q4 2023', date: 'January 11, 2024', revenue: '$62.0B', growth: '+18%', highlights: ['Cloud hits $33.7B', 'AI momentum building', 'Teams users 320M'] },
        { quarter: 'Q3 2023', date: 'October 15, 2023', revenue: '$56.5B', growth: '+13%', highlights: ['Azure +28%', 'Surface revenue up', 'PC market stabilizing'] },
      ],
      'GOOGL': [
        { quarter: 'Q2 2024', date: 'July 20, 2024', revenue: '$74.6B', growth: '+14%', highlights: ['Search revenue strong', 'YouTube ads +13%', 'Cloud +29%'] },
        { quarter: 'Q1 2024', date: 'April 18, 2024', revenue: '$80.5B', growth: '+15%', highlights: ['AI integration in Search', 'Cloud profitability', 'Pixel 8 success'] },
        { quarter: 'Q4 2023', date: 'January 14, 2024', revenue: '$86.3B', growth: '+13%', highlights: ['Record advertising', 'Bard improvements', 'Waymo expansion'] },
        { quarter: 'Q3 2023', date: 'October 18, 2023', revenue: '$76.7B', growth: '+11%', highlights: ['Search dominance', 'YouTube Shorts growth', 'Cloud acceleration'] },
      ],
      'AMZN': [
        { quarter: 'Q2 2024', date: 'August 1, 2024', revenue: '$148.0B', growth: '+10%', highlights: ['Prime Day record', 'AWS growth 19%', 'Advertising +20%'] },
        { quarter: 'Q1 2024', date: 'May 2, 2024', revenue: '$143.3B', growth: '+13%', highlights: ['North America profitability', 'AWS stabilizing', 'Operating margin 10.7%'] },
        { quarter: 'Q4 2023', date: 'February 6, 2024', revenue: '$170.0B', growth: '+14%', highlights: ['Holiday season record', 'AWS $24.2B', 'International improving'] },
        { quarter: 'Q3 2023', date: 'October 26, 2023', revenue: '$143.1B', growth: '+13%', highlights: ['Prime members 200M+', 'AWS margin expansion', 'One-day delivery'] },
      ],
    }
    return events[ticker] || []
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
            <CompanyLogo ticker={event.ticker} size="xl" className="shadow-lg" />
            <div>
              <h1 className="text-3xl font-bold text-text">{event.company_name}</h1>
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
            {['summary', 'slides', 'qa', 'transcript', 'previous', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-brand text-bg'
                    : 'text-textMuted hover:text-text hover:bg-card'
                }`}
              >
                {tab === 'qa' ? 'Q&A Map' : tab === 'previous' ? 'Previous Events' : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                    <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                      <h2 className="text-xl font-semibold mb-6 text-text">Key Highlights</h2>
                      {summary.quicktake && summary.quicktake.length > 0 ? (
                        <div className="space-y-4">
                          {summary.quicktake.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-brand/5 to-transparent rounded-lg border-l-4 border-brand">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                                <span className="text-brand font-bold text-sm">{idx + 1}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-text leading-relaxed mb-2">{item.text}</p>
                                {item.timestamp && (
                                  <div className="flex items-center gap-3">
                                    <button 
                                      onClick={() => setActiveTab('transcript')}
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-brand/10 text-brand rounded hover:bg-brand/20 transition-colors"
                                    >
                                      <span className="font-mono">{item.timestamp}</span>
                                      <span>• View source</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-textMuted">No highlights available</p>
                      )}
                    </div>

                    <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                      <h2 className="text-xl font-semibold mb-6 text-text">Key Quotes</h2>
                      <div className="space-y-4">
                        {summary.extractive_quotes && summary.extractive_quotes.length > 0 ? (
                          summary.extractive_quotes.map((quote, idx) => (
                            <div key={idx} className={`pl-5 py-4 border-l-4 ${getCompanyColor(event.ticker)} bg-card rounded-r-lg hover:shadow-md transition-shadow`}>
                              <p className="text-text italic mb-3 leading-relaxed">&quot;{quote.quote}&quot;</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="font-semibold text-brand">{quote.speaker}</span>
                                  {quote.topic && (
                                    <>
                                      <span className="text-textMuted">•</span>
                                      <span className="text-textMuted">{quote.topic}</span>
                                    </>
                                  )}
                                </div>
                                {quote.timestamp && (
                                  <button 
                                    onClick={() => setActiveTab('transcript')}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-brand/10 text-brand rounded hover:bg-brand/20 transition-colors"
                                  >
                                    <span className="font-mono">{quote.timestamp}</span>
                                    <span>• View source</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-textMuted">No quotes available</p>
                        )}
                      </div>
                    </div>

                    {summary.guidance_table && Object.keys(summary.guidance_table).length > 0 && (
                      <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                        <h2 className="text-xl font-semibold mb-6 text-text">Guidance</h2>
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
                  <div className="bg-surface rounded-lg border border-border p-12 text-center shadow-card">
                    <p className="text-textMuted">No summary available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-4">
                {qaItems.length > 0 ? (
                  qaItems.map((item) => (
                    <div key={item.id} className="bg-surface rounded-lg border border-border p-6 shadow-card">
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
                  <div className="bg-surface rounded-lg border border-border p-12 text-center shadow-card">
                    <p className="text-textMuted">No Q&A items available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
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

            {activeTab === 'previous' && (
              <div className="space-y-4">
                <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                  <h2 className="text-xl font-semibold mb-6 text-text">Previous Earnings Calls</h2>
                  <div className="space-y-4">
                    {getPreviousEvents(event.ticker).map((prevEvent, idx) => (
                      <div key={idx} className="bg-card rounded-lg border border-border/50 p-5 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-text">{prevEvent.quarter}</h3>
                              <span className="px-2 py-1 bg-brand/10 text-brand text-xs font-semibold rounded">
                                {prevEvent.growth}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-textMuted">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>{prevEvent.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign size={14} />
                                <span className="font-semibold text-text">{prevEvent.revenue}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs text-textMuted font-semibold mb-2">KEY HIGHLIGHTS</div>
                          <ul className="space-y-1">
                            {prevEvent.highlights.map((highlight, hIdx) => (
                              <li key={hIdx} className="text-sm text-text flex items-start gap-2">
                                <span className="text-brand mt-1">•</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'slides' && (
              <div className="bg-surface rounded-lg border border-border p-12 text-center shadow-card">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-4 bg-brand/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-text text-lg mb-2 font-semibold">Presentation Slides</p>
                  <p className="text-textMuted text-sm">View the earnings presentation slides here</p>
                  <p className="text-textMuted text-xs mt-4 italic">Feature coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-surface rounded-lg border border-border p-12 text-center shadow-card">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-4 bg-brand/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="text-text text-lg mb-2 font-semibold">AI Chat</p>
                  <p className="text-textMuted text-sm">Ask questions about this earnings call using AI</p>
                  <p className="text-textMuted text-xs mt-4 italic">Feature coming soon</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface rounded-lg border border-border p-6 sticky top-24 shadow-card">
              <h3 className="text-lg font-semibold mb-6 text-text">Quick Facts</h3>
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
