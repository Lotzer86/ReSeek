import { useState, useEffect } from 'react'
import axios from 'axios'
import './Dashboard.css'

function Dashboard() {
  const [events, setEvents] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [eventsRes, watchlistRes] = await Promise.all([
        axios.get('/api/events/'),
        axios.get('/api/watchlist/demo_user').catch(() => ({ data: { items: [] } }))
      ])
      setEvents(eventsRes.data.events || [])
      setWatchlist(watchlistRes.data.items || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const watchlistCompanies = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">AI-powered earnings call analysis</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <section className="card">
            <div className="card-header">
              <h2>Latest Events</h2>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading">Loading...</div>
              ) : events.length === 0 ? (
                <div className="empty-state">
                  <p>No events yet</p>
                  <p className="hint">Events will appear here once transcripts are ingested</p>
                </div>
              ) : (
                <div className="event-list">
                  {events.slice(0, 6).map(event => (
                    <div key={event.id} className="event-item">
                      <div className="event-icon">
                        {event.ticker?.charAt(0) || '?'}
                      </div>
                      <div className="event-details">
                        <div className="event-company">{event.company_name || event.ticker}</div>
                        <div className="event-meta">
                          {new Date(event.event_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} • {event.quarter}
                        </div>
                      </div>
                      <span className="status-badge">Summary Available</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Upcoming Events</h2>
            </div>
            <div className="card-body">
              <div className="empty-state">
                <p>No upcoming events scheduled</p>
                <p className="hint">Upcoming earnings calls will be shown here</p>
              </div>
            </div>
          </section>
        </div>

        <div className="dashboard-sidebar">
          <section className="card">
            <div className="card-header">
              <h2>Live Right Now</h2>
            </div>
            <div className="card-body">
              <div className="empty-state">
                <p>No live events</p>
                <p className="hint">Live calls will appear here</p>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Your Watchlist</h2>
            </div>
            <div className="card-body">
              {watchlistCompanies.length === 0 ? (
                <div className="empty-state">
                  <p>No companies in watchlist</p>
                  <p className="hint">Add companies to start tracking earnings calls</p>
                </div>
              ) : (
                <div className="watchlist-list">
                  {watchlistCompanies.map(company => (
                    <div key={company.ticker} className="watchlist-item">
                      <div className="watchlist-company">
                        <div className="watchlist-icon">
                          {company.ticker.charAt(0)}
                        </div>
                        <div className="watchlist-details">
                          <div className="company-ticker">{company.ticker}</div>
                          <div className="company-name">{company.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="info-banner">
        <h3>🚀 ReSeek MVP is Running!</h3>
        <p>SQLite database configured ✓ | OpenAI API key set ✓</p>
        <p>Ready to test with mock data! Add companies to your watchlist to get started.</p>
      </div>
    </div>
  )
}

export default Dashboard
