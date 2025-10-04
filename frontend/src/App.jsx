import { useState } from 'react'
import './App.css'

// Import components
import Header from './components/Header'
import CustomerSignUp from './components/CustomerSignUp'
import CustomerLogIn from './components/CustomerLogIn'
import Cart from './components/Cart'
import FreshnessAnalyzer from './components/FreshnessAnalyzer'
import ShopDashboard from './pages/ShopDashboard'
import ShopDashboardOverview from './pages/ShopDashboardOverview'
import ProductDashboard from './pages/ProductDashboard'
import HomePage from './pages/HomePage'
import Account from './pages/Account'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={setCurrentView} />
      case 'login':
        return <CustomerLogIn onSwitch={() => setCurrentView('signup')} onNavigate={setCurrentView} />
      case 'signup':
        return <CustomerSignUp onSwitch={() => setCurrentView('login')} onNavigate={setCurrentView} />
      case 'account':
        return <Account onNavigate={setCurrentView} />
      case 'cart':
        return <Cart onNavigate={setCurrentView} />
      case 'analyzer':
        return <FreshnessAnalyzer onNavigate={setCurrentView} />
      case 'shop':
        return <ShopDashboard onNavigate={setCurrentView} searchQuery={searchQuery} />
      case 'overview':
        return <ShopDashboardOverview onNavigate={setCurrentView} />
      case 'product':
        return <ProductDashboard onNavigate={setCurrentView} searchQuery={searchQuery} />
      default:
        return <HomePage onNavigate={setCurrentView} />
    }
  }

  const showHeader = !['login', 'signup'].includes(currentView)

  return (
    <div className="App">
      {showHeader && (
        <Header 
          onNavigate={setCurrentView} 
          currentView={currentView} 
          onSearch={handleSearch}
        />
      )}
      <div className={showHeader ? 'pt-0' : ''}>
        {renderView()}
      </div>
      
      {/* Mobile Fruitify FAB - Only show on non-analyzer pages */}
      {showHeader && currentView !== 'analyzer' && (
        <button
          onClick={() => setCurrentView('analyzer')}
          className="fixed bottom-6 right-6 md:hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 z-50 animate-pulse"
          title="Try Fruitify - AI Freshness Analyzer"
        >
          <div className="flex items-center gap-2">
            <span className="text-yellow-300 text-lg">⭐</span>
            <span className="font-bold text-sm">AI</span>
          </div>
          <div className="absolute -top-1 -right-1 bg-yellow-400 text-purple-900 text-xs px-1.5 py-0.5 rounded-full font-bold">
            NEW
          </div>
        </button>
      )}
    </div>
  )
}

export default App
