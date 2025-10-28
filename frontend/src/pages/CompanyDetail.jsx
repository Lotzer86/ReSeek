import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './CompanyDetail.css'

function CompanyDetail() {
  const { id } = useParams()
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

  if (loading) {
    return (
      <div className="company-detail">
        <div className="loading-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="company-detail">
        <div className="error-container">
          <p>Event not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="company-detail">
      <div className="detail-header">
        <div className="header-content">
          <div className="company-icon-large">
            {event.ticker?.charAt(0) || '?'}
          </div>
          <div className="header-info">
            <h1>{event.company_name}</h1>
            <div className="event-metadata">
              <span className="ticker">{event.ticker}</span>
              <span className="separator">•</span>
              <span>{new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="separator">•</span>
              <span>{event.quarter} {event.fiscal_year}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        <button 
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button 
          className={`tab ${activeTab === 'qa' ? 'active' : ''}`}
          onClick={() => setActiveTab('qa')}
        >
          Q&A Map
        </button>
        <button 
          className={`tab ${activeTab === 'transcript' ? 'active' : ''}`}
          onClick={() => setActiveTab('transcript')}
        >
          Transcript
        </button>
        <button 
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
      </div>

      <div className="detail-content">
        {activeTab === 'summary' && (
          <div className="summary-tab">
            {summary ? (
              <>
                <section className="summary-section">
                  <h2>Key Highlights</h2>
                  <ul className="highlights-list">
                    {summary.quicktake?.highlights?.map((item, idx) => (
                      <li key={idx}>
                        <span>{item.text}</span>
                        {item.citation && (
                          <a href="#" className="citation-link" onClick={(e) => e.preventDefault()}>
                            [{item.citation.timestamp}]
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="summary-section">
                  <h2>Key Quotes</h2>
                  <div className="quotes-list">
                    {summary.extractive_quotes?.map((quote, idx) => (
                      <div key={idx} className="quote-item">
                        <div className="quote-text">"{quote.quote}"</div>
                        <div className="quote-meta">
                          <span className="speaker">{quote.speaker}</span>
                          <span className="timestamp">{quote.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {summary.guidance_table && (
                  <section className="summary-section">
                    <h2>Guidance</h2>
                    <div className="guidance-table">
                      {Object.entries(summary.guidance_table).map(([period, metrics]) => (
                        <div key={period} className="guidance-row">
                          <strong>{period}:</strong>
                          <ul>
                            {Object.entries(metrics).map(([key, value]) => (
                              <li key={key}>{key}: {value}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <div className="empty-state">No summary available</div>
            )}
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="qa-tab">
            {qaItems.length > 0 ? (
              <div className="qa-list">
                {qaItems.map((item) => (
                  <div key={item.id} className="qa-item">
                    <div className="qa-header">
                      <div className="analyst-info">
                        <strong>{item.analyst_name}</strong>
                        <span className="firm">{item.analyst_firm}</span>
                      </div>
                      <div className={`deflection-badge deflection-${item.deflection_score > 30 ? 'high' : item.deflection_score > 15 ? 'medium' : 'low'}`}>
                        Deflection: {item.deflection_score}%
                      </div>
                    </div>
                    <div className="question">
                      <strong>Q:</strong> {item.question_text}
                      <span className="timestamp">{item.question_timestamp}</span>
                    </div>
                    <div className="answer">
                      <strong>A:</strong> {item.answer_text}
                      <span className="timestamp">{item.answer_timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No Q&A items available</div>
            )}
          </div>
        )}

        {activeTab === 'transcript' && (
          <div className="transcript-tab">
            {transcript ? (
              <div className="transcript-text">
                <pre>{transcript.raw_text}</pre>
              </div>
            ) : (
              <div className="empty-state">No transcript available</div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-tab">
            <div className="empty-state">
              <p>Chat feature coming soon</p>
              <p className="hint">Ask questions about this earnings call using AI</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyDetail
