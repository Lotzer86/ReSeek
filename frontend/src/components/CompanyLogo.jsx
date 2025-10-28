import { useState, useEffect } from 'react'

// Cache to remember which logo source worked for each ticker
const logoCache = new Map()

// Map ticker symbols to company domains for Clearbit Logo API
const getCompanyDomain = (ticker) => {
  const domainMap = {
    'AAPL': 'apple.com',
    'MSFT': 'microsoft.com',
    'GOOGL': 'google.com',
    'GOOG': 'google.com',
    'AMZN': 'amazon.com',
    'NVDA': 'nvidia.com',
    'META': 'meta.com',
    'TSLA': 'tesla.com',
    'AVGO': 'broadcom.com',
    'COST': 'costco.com',
    'NFLX': 'netflix.com',
    'ASML': 'asml.com',
    'AMD': 'amd.com',
    'ADBE': 'adobe.com',
    'PEP': 'pepsico.com',
    'CSCO': 'cisco.com',
    'TMUS': 't-mobile.com',
    'CMCSA': 'comcast.com',
    'INTC': 'intel.com',
    'INTU': 'intuit.com',
    'TXN': 'ti.com',
    'AMGN': 'amgen.com',
    'QCOM': 'qualcomm.com',
    'HON': 'honeywell.com',
    'AMAT': 'appliedmaterials.com',
    'SBUX': 'starbucks.com',
    'BKNG': 'booking.com',
    'GILD': 'gilead.com',
    'ISRG': 'intuitive.com',
    'VRTX': 'vrtx.com',
    'ADI': 'analog.com',
    'ADP': 'adp.com',
    'REGN': 'regeneron.com',
    'MDLZ': 'mondelezinternational.com',
    'PANW': 'paloaltonetworks.com',
    'MU': 'micron.com',
    'LRCX': 'lamresearch.com',
    'SNPS': 'synopsys.com',
    'CDNS': 'cadence.com',
    'KLAC': 'kla.com',
    'MELI': 'mercadolibre.com',
    'ABNB': 'airbnb.com',
    'CTAS': 'cintas.com',
    'MAR': 'marriott.com',
  }
  return domainMap[ticker] || `${ticker.toLowerCase()}.com`
}

function CompanyLogo({ ticker, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  
  useEffect(() => {
    // Check cache first
    if (logoCache.has(ticker)) {
      const cachedUrl = logoCache.get(ticker)
      if (cachedUrl === null) {
        setImageError(true)
      } else {
        setLogoUrl(cachedUrl)
      }
      return
    }
    
    // Use Clearbit Logo API (free, reliable, high coverage)
    const domain = getCompanyDomain(ticker)
    const primaryUrl = `https://logo.clearbit.com/${domain}`
    setLogoUrl(primaryUrl)
  }, [ticker])
  
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

  const handleImageError = () => {
    logoCache.set(ticker, null) // Cache that this ticker has no logo
    setImageError(true)
  }
  
  const handleImageLoad = () => {
    logoCache.set(ticker, logoUrl) // Cache the successful URL
  }
  
  if (imageError || !logoUrl) {
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
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  )
}

export default CompanyLogo
