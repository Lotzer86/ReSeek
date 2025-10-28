import { useState, useEffect } from 'react'
import axios from 'axios'
import ActivityFeed from '../components/ActivityFeed'
import LiveTickerList from '../components/LiveTickerList'
import EventCard from '../components/EventCard'
import MentionsList from '../components/MentionsList'
import WatchlistPanel from '../components/WatchlistPanel'
import { Calendar, TrendingUp } from 'lucide-react'

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
        axios.get('/api/watchlist/demo_user')
      ])
      setEvents(eventsRes.data.events || [])
      setWatchlist(watchlistRes.data.items || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshWatchlist = async () => {
    try {
      const res = await axios.get('/api/watchlist/demo_user')
      setWatchlist(res.data.items || [])
    } catch (error) {
      console.error('Error refreshing watchlist:', error)
    }
  }

  const upcomingEvents = events.filter(e => e.event_status === 'upcoming').slice(0, 4)
  const latestEvents = events.filter(e => e.event_status === 'completed').slice(0, 6)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-textMuted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-screen-2xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-text">Dashboard</h1>
          <p className="text-textMuted">AI-powered earnings call analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <LiveTickerList />
            <ActivityFeed />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-text">
                  <TrendingUp size={20} className="text-brand" />
                  Latest Events
                </h2>
              </div>
              
              {latestEvents.length === 0 ? (
                <div className="text-center py-12 text-textMuted">
                  <p>No events yet</p>
                  <p className="text-sm mt-2">Events will appear here once transcripts are ingested</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {latestEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>

            {upcomingEvents.length > 0 && (
              <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-text">
                  <Calendar size={20} className="text-brand" />
                  Upcoming Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-6">
            <MentionsList />
            <WatchlistPanel watchlist={watchlist} onUpdate={refreshWatchlist} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
