function MentionsList() {
  const mentions = [
    {
      id: 1,
      quote: 'We are seeing strong momentum in Azure with 30% YoY growth',
      company: 'MSFT',
      highlight: 'Azure',
      speaker: 'Satya Nadella',
    },
    {
      id: 2,
      quote: 'iPhone revenue exceeded expectations in all major markets',
      company: 'AAPL',
      highlight: 'iPhone',
      speaker: 'Tim Cook',
    },
    {
      id: 3,
      quote: 'Search continues to drive advertising revenue growth',
      company: 'GOOGL',
      highlight: 'Search',
      speaker: 'Sundar Pichai',
    },
  ]

  const getCompanyColor = (ticker) => {
    const colors = {
      'AAPL': 'text-purple-400 bg-purple-500/20',
      'MSFT': 'text-blue-400 bg-blue-500/20',
      'GOOGL': 'text-red-400 bg-red-500/20',
      'AMZN': 'text-orange-400 bg-orange-500/20',
    }
    return colors[ticker] || 'text-brand bg-brand/20'
  }

  const highlightMention = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, i) => {
      if (part.toLowerCase() === highlight.toLowerCase()) {
        return <span key={i} className="bg-brand/30 text-brand px-1 rounded">{part}</span>
      }
      return part
    })
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-card">
      <h3 className="text-lg font-semibold mb-5">Recent Mentions</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
        {mentions.map((mention) => (
          <div key={mention.id} className="bg-card rounded-lg p-3 border border-border shadow-sm hover:shadow-card hover:border-borderLight transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs font-mono font-semibold rounded ${getCompanyColor(mention.company)}`}>
                {mention.company}
              </span>
              <span className="text-xs text-textMuted">{mention.speaker}</span>
            </div>
            <p className="text-sm text-text leading-relaxed">
              &quot;{highlightMention(mention.quote, mention.highlight)}&quot;
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MentionsList
