import { useState, useEffect } from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
  const [currentView, setCurrentView] = useState('login')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
        setCurrentView('home')
      } catch (error) {
        // Invalid saved data, clear it
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('userRole')
      }
    }
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    setUser(null)
    setIsAuthenticated(false)
    setCurrentView('login')
  }

  const renderView = () => {
    // If not authenticated, only show login/signup
    if (!isAuthenticated) {
      switch (currentView) {
        case 'signup':
          return (
            <CustomerSignUp 
              onSwitch={() => setCurrentView('login')} 
              onModeChange={setCurrentView}
              onNavigate={setCurrentView}
              onSuccess={handleLogin}
            />
          )
        case 'login':
        default:
          return (
            <CustomerLogIn 
              onSwitch={() => setCurrentView('signup')} 
              onNavigate={setCurrentView}
              onSuccess={handleLogin}
            />
          )
      }
    }

    // If authenticated, show all views
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={setCurrentView} />
      case 'login':
        return <CustomerLogIn onSwitch={() => setCurrentView('signup')} onNavigate={setCurrentView} onSuccess={handleLogin} />
      case 'signup':
        return <CustomerSignUp onSwitch={() => setCurrentView('login')} onModeChange={setCurrentView} onNavigate={setCurrentView} onSuccess={handleLogin} />
      case 'account':
        return <Account onNavigate={setCurrentView} user={user} />
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

  const showHeader = isAuthenticated && !['login', 'signup'].includes(currentView)

  return (
    <div className="App">
      {showHeader && (
        <Header 
          onNavigate={setCurrentView} 
          currentView={currentView} 
          onSearch={handleSearch}
          onLogout={handleLogout}
          user={user}
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
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App
