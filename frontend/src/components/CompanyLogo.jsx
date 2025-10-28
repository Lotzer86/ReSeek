import { useState } from 'react'

function CompanyLogo({ ticker, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false)
  
  const sizeClasses = {
    'sm': 'w-8 h-8 text-sm',
    'md': 'w-10 h-10 text-sm',
    'lg': 'w-12 h-12 text-base',
    'xl': 'w-16 h-16 text-2xl'
  }
  
  const getCompanyColor = (ticker) => {
    const colors = {
      'AAPL': 'bg-purple-500',
      'MSFT': 'bg-blue-500',
      'GOOGL': 'bg-red-500',
      'GOOG': 'bg-red-500',
      'AMZN': 'bg-orange-500',
      'META': 'bg-blue-600',
      'TSLA': 'bg-red-600',
      'NVDA': 'bg-green-600',
    }
    return colors[ticker] || 'bg-brand'
  }

  const logoUrl = `https://eodhd.com/img/logos/US/${ticker}.png`
  
  if (imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg ${getCompanyColor(ticker)} flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
        <span>{ticker?.charAt(0)}</span>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden ${className}`}>
      <img
        src={logoUrl}
        alt={`${ticker} logo`}
        className="w-full h-full object-contain p-1"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

export default CompanyLogo
