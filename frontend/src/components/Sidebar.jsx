import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Star, Calendar, FileText, Settings, User } from 'lucide-react'

function Sidebar() {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Watchlist', path: '/watchlist', icon: Star },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Transcripts', path: '/transcripts', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-text">ReSeek</div>
          <span className="px-2 py-0.5 text-xs font-semibold bg-brand text-bg rounded">MVP</span>
        </div>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-brand/10 text-brand'
                  : 'text-textMuted hover:bg-card hover:text-text'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-card cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
            <User size={16} className="text-brand" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Demo User</div>
            <div className="text-xs text-textMuted">demo@reseek.ai</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
