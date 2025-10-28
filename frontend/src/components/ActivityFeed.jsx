import { Clock, TrendingUp, FileText, Sparkles } from 'lucide-react'
import CompanyLogo from './CompanyLogo'

function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: 'mention',
      company: 'MSFT',
      companyName: 'Microsoft',
      text: 'mentioned "cloud revenue" 7x in transcript',
      time: '2 hours ago',
      icon: TrendingUp,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
    },
    {
      id: 2,
      type: 'summary',
      company: 'AAPL',
      companyName: 'Apple',
      text: 'Q3 2024 summary generated',
      time: '3 hours ago',
      icon: Sparkles,
      iconColor: 'text-brand',
      iconBg: 'bg-brand/10',
    },
    {
      id: 3,
      type: 'event',
      company: 'GOOGL',
      companyName: 'Alphabet',
      text: 'earnings call transcript uploaded',
      time: '5 hours ago',
      icon: FileText,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
    },
  ]

  const groupedActivities = [
    {
      label: 'TODAY',
      items: activities.slice(0, 2),
    },
    {
      label: 'YESTERDAY',
      items: activities.slice(2),
    },
  ]

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-card">
      <h3 className="text-lg font-semibold mb-5 text-text">Activity Feed</h3>
      <div className="space-y-5">
        {groupedActivities.map((group) => (
          <div key={group.label}>
            <div className="text-xs font-bold text-textMuted tracking-wider mb-3">{group.label}</div>
            <div className="space-y-4">
              {group.items.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex gap-3 items-start hover:bg-card/50 p-2 rounded-lg transition-colors -mx-2">
                    <CompanyLogo ticker={activity.company} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-text">{activity.company}</span>
                        <span className="text-xs text-textMuted">{activity.companyName}</span>
                      </div>
                      <p className="text-sm text-textMuted leading-relaxed">{activity.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={12} className="text-textMuted opacity-60" />
                        <span className="text-xs text-textMuted opacity-60">{activity.time}</span>
                      </div>
                    </div>
                    <div className={`${activity.iconBg} p-1.5 rounded-lg flex-shrink-0`}>
                      <Icon size={14} className={activity.iconColor} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityFeed
