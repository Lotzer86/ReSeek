import { useState, useEffect } from 'react'
import { Mail, Bell, Tag, AlertCircle, Save, X, Plus, Trash2 } from 'lucide-react'

function Settings() {
  const [emails, setEmails] = useState([''])
  const [newEmail, setNewEmail] = useState('')
  const [keywords, setKeywords] = useState(['AI', 'cloud', 'margin'])
  const [newKeyword, setNewKeyword] = useState('')
  const [notificationFrequency, setNotificationFrequency] = useState('immediate')
  const [deflectionThreshold, setDeflectionThreshold] = useState(25)
  const [autoHighlight, setAutoHighlight] = useState(true)
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('reseek_settings')
      if (saved) {
        const settings = JSON.parse(saved)
        setEmails(settings.emails || [''])
        setKeywords(settings.keywords || ['AI', 'cloud', 'margin'])
        setNotificationFrequency(settings.notificationFrequency || 'immediate')
        setDeflectionThreshold(settings.deflectionThreshold || 25)
        setAutoHighlight(settings.autoHighlight !== false)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const saveSettings = () => {
    try {
      const settings = {
        emails: emails.filter(e => e.trim()),
        keywords,
        notificationFrequency,
        deflectionThreshold,
        autoHighlight
      }
      localStorage.setItem('reseek_settings', JSON.stringify(settings))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
    }
  }

  const addEmail = () => {
    if (newEmail.trim() && newEmail.includes('@')) {
      setEmails([...emails, newEmail.trim()])
      setNewEmail('')
    }
  }

  const removeEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Settings</h1>
          <p className="text-textMuted">Customize your ReSeek experience</p>
        </div>

        <div className="space-y-6">
          {/* Email Notifications Section */}
          <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                <Mail className="text-brand" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">Email Notifications</h2>
                <p className="text-sm text-textMuted">Receive AI summaries via email</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Email Addresses</label>
                <div className="space-y-2">
                  {emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          const newEmails = [...emails]
                          newEmails[index] = e.target.value
                          setEmails(newEmails)
                        }}
                        placeholder="your.email@company.com"
                        className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      {emails.length > 1 && (
                        <button
                          onClick={() => removeEmail(index)}
                          className="p-2 text-textMuted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                  placeholder="Add another email..."
                  className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                  onClick={addEmail}
                  className="px-4 py-2 bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>

              <div className="pt-4 border-t border-border">
                <label className="block text-sm font-medium text-text mb-2">Notification Frequency</label>
                <select
                  value={notificationFrequency}
                  onChange={(e) => setNotificationFrequency(e.target.value)}
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="immediate">Immediate - Send as soon as summary is ready</option>
                  <option value="daily">Daily Digest - Once per day</option>
                  <option value="weekly">Weekly Summary - Every Monday</option>
                  <option value="off">Off - No email notifications</option>
                </select>
              </div>
            </div>
          </div>

          {/* Term Highlighting Section */}
          <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Tag className="text-purple-400" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">Term Highlighting</h2>
                <p className="text-sm text-textMuted">Track important keywords in earnings calls</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="text-sm font-medium text-text">Auto-highlight in transcripts</label>
                  <p className="text-xs text-textMuted mt-1">Automatically highlight tracked terms</p>
                </div>
                <button
                  onClick={() => setAutoHighlight(!autoHighlight)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    autoHighlight ? 'bg-brand' : 'bg-card border border-border'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoHighlight ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Tracked Keywords</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {keywords.map((keyword) => (
                    <div
                      key={keyword}
                      className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full text-sm flex items-center gap-2"
                    >
                      <span>{keyword}</span>
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-purple-300 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Add keyword (e.g., AI, revenue, margin)..."
                    className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
              </div>

              <div className="bg-card rounded-lg p-4 border border-border/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-brand flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-xs text-textMuted">
                    <p className="font-semibold text-text mb-1">Pro Tip</p>
                    Keywords are case-insensitive and will be highlighted across all transcripts, summaries, and Q&A sections.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Preferences Section */}
          <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Bell className="text-orange-400" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">Alert Preferences</h2>
                <p className="text-sm text-textMuted">Configure when you want to be notified</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Deflection Score Threshold
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={deflectionThreshold}
                    onChange={(e) => setDeflectionThreshold(Number(e.target.value))}
                    className="flex-1"
                  />
                  <div className="w-16 text-center">
                    <span className={`text-lg font-bold ${
                      deflectionThreshold > 50 ? 'text-red-400' : 
                      deflectionThreshold > 25 ? 'text-orange-400' : 
                      'text-green-400'
                    }`}>
                      {deflectionThreshold}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-textMuted mt-2">
                  Alert me when Q&A deflection score exceeds this threshold
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between bg-surface rounded-lg border border-border p-6 shadow-card">
            <div className="text-sm text-textMuted">
              {saveStatus === 'saved' && (
                <span className="text-brand flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand rounded-full" />
                  Settings saved successfully
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  Error saving settings
                </span>
              )}
            </div>
            <button
              onClick={saveSettings}
              className="px-6 py-2.5 bg-brand text-bg rounded-lg hover:bg-brand/90 transition-colors flex items-center gap-2 font-semibold"
            >
              <Save size={18} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
