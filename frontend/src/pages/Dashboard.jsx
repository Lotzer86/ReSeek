import { useState, useEffect } from 'react'
import axios from 'axios'
import './Dashboard.css'

function Dashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events/')
      setEvents(response.data.events || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">AI-powered earnings call analysis</p>
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <h2>Live Right Now</h2>
          <p className="empty-state">No live events at the moment</p>
        </section>

        <section className="card">
          <h2>Latest Events</h2>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <p>No events yet</p>
              <p className="hint">Events will appear here once transcripts are ingested</p>
            </div>
          ) : (
            <div className="event-list">
              {events.slice(0, 5).map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-icon">
                    {event.ticker?.charAt(0) || '?'}
                  </div>
                  <div className="event-details">
                    <div className="event-company">{event.company_name || event.ticker}</div>
                    <div className="event-meta">
                      {new Date(event.event_date).toLocaleDateString()} • {event.quarter}
                    </div>
                  </div>
                  {event.has_summary && (
                    <span className="status-badge">Summary Available</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Upcoming Events</h2>
          <p className="empty-state">No upcoming events scheduled</p>
        </section>

        <section className="card">
          <h2>Your Watchlist</h2>
          <div className="empty-state">
            <p>No companies in watchlist</p>
            <p className="hint">Add companies to start tracking earnings calls</p>
          </div>
        </section>
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
