import { useState } from 'react'

function CompanyLogo({ ticker, size = 'md', className = '' }) {
  const [logoSource, setLogoSource] = useState(0)
  
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

  const getCompanyDomain = (ticker) => {
    const domains = {
      'AAPL': 'apple.com',
      'MSFT': 'microsoft.com',
      'GOOGL': 'google.com',
      'GOOG': 'google.com',
      'AMZN': 'amazon.com',
      'META': 'meta.com',
      'TSLA': 'tesla.com',
      'NVDA': 'nvidia.com',
    }
    return domains[ticker]
  }

  const domain = getCompanyDomain(ticker)
  
  const logoSources = domain 
    ? [
        `https://logo.clearbit.com/${domain}`,
        `https://img.logo.dev/${domain}?token=pk_X-WewAjpSdC6R48E7VIGZg`,
        `https://asset.parqet.com/logo/${ticker}`,
        `https://eodhd.com/img/logos/US/${ticker}.png`,
      ]
    : [
        `https://asset.parqet.com/logo/${ticker}`,
        `https://eodhd.com/img/logos/US/${ticker}.png`,
        `https://elbstream.com/logos/symbol/${ticker}`,
      ]

  const handleError = () => {
    if (logoSource < logoSources.length - 1) {
      setLogoSource(logoSource + 1)
    } else {
      setLogoSource(-1)
    }
  }
  
  if (logoSource === -1) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg ${getCompanyColor(ticker)} flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
        <span>{ticker?.charAt(0)}</span>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden ${className}`}>
      <img
        src={logoSources[logoSource]}
        alt={`${ticker} logo`}
        className="w-full h-full object-contain p-1"
        onError={handleError}
      />
    </div>
  )
}

export default CompanyLogo
