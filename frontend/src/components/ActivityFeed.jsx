import { Clock, TrendingUp, FileText } from 'lucide-react'

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
      color: 'bg-blue-500',
    },
    {
      id: 2,
      type: 'summary',
      company: 'AAPL',
      companyName: 'Apple',
      text: 'Q3 2024 summary generated',
      time: '3 hours ago',
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      id: 3,
      type: 'event',
      company: 'GOOGL',
      companyName: 'Alphabet',
      text: 'earnings call transcript uploaded',
      time: '5 hours ago',
      icon: Clock,
      color: 'bg-green-500',
    },
  ]

  const groupedActivities = [
    {
      label: 'Today',
      items: activities.slice(0, 2),
    },
    {
      label: 'Yesterday',
      items: activities.slice(2),
    },
  ]

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-card">
      <h3 className="text-lg font-semibold mb-5">Activity Feed</h3>
      <div className="space-y-6">
        {groupedActivities.map((group) => (
          <div key={group.label}>
            <div className="text-xs font-medium text-textMuted uppercase mb-3">{group.label}</div>
            <div className="space-y-3">
              {group.items.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex gap-3 items-start">
                    <div className={`w-8 h-8 rounded-full ${activity.color}/20 flex items-center justify-center flex-shrink-0`}>
                      <div className={`w-2 h-2 rounded-full ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{activity.company}</span>
                        <span className="text-xs text-textMuted">{activity.companyName}</span>
                      </div>
                      <p className="text-sm text-textMuted">{activity.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-textMuted" />
                        <span className="text-xs text-textMuted">{activity.time}</span>
                      </div>
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
