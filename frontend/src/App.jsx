import { useState, useEffect } from 'react'
import './App.css'
import { ToastContainer, toast } from 'react-toastify'
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
import MerchantAddProduct from './pages/MerchantAddProduct'
import MerchantMyProducts from './pages/MerchantMyProducts'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const role = (user && user.role) || localStorage.getItem('userRole')

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
        // Direct to appropriate landing based on role
        const savedRole = parsedUser?.role || localStorage.getItem('userRole')
        if (savedRole === 'merchant') {
          setCurrentView('analyzer')
        } else {
          setCurrentView('home')
        }
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
    // Navigate based on role immediately after auth
    if (userData?.role === 'merchant') {
      setCurrentView('analyzer')
    } else {
      setCurrentView('home')
    }
  }

  const handleUpdateUser = (updatedUserData) => {
    setUser(updatedUserData)
    localStorage.setItem('user', JSON.stringify(updatedUserData))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    setUser(null)
    setIsAuthenticated(false)
    setCartItems([])
    setCurrentView('login')
  }

  const handleUpdateCart = (newCartItems) => {
    setCartItems(newCartItems)
  }

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      const updatedItems = cartItems.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      setCartItems(updatedItems)
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image || '/images/default-product.jpg'
      }
      setCartItems([...cartItems, newItem])
    }
    
    // Show success message
    toast.success(`${product.name} added to cart!`)
  }

  const handleNavigation = (targetView) => {
    // Pages that require authentication
    const protectedPages = ['shop', 'account', 'cart', 'analyzer', 'overview', 'product', 'merchant-add-product', 'merchant-my-products']
    
    if (protectedPages.includes(targetView) && !isAuthenticated) {
      // Redirect to login if trying to access protected page without authentication
      setCurrentView('login')
      return
    }
    // Role-based guards
    if (role === 'merchant' && (targetView === 'home' || targetView === 'shop')) {
      setCurrentView('analyzer')
      return
    }
    if (role !== 'merchant' && (targetView === 'overview' || targetView === 'product' || targetView === 'merchant-add-product' || targetView === 'merchant-my-products')) {
      setCurrentView('home')
      return
    }

    // Allow navigation to the target view
    setCurrentView(targetView)
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />
      case 'login':
        return isAuthenticated
          ? (role === 'merchant' ? <FreshnessAnalyzer onNavigate={handleNavigation} /> : <HomePage onNavigate={handleNavigation} />)
          : (
            <CustomerLogIn 
              onSwitch={() => setCurrentView('signup')} 
              onNavigate={handleNavigation}
              onSuccess={handleLogin}
            />
          )
      case 'signup':
        return (
          <CustomerSignUp 
            onSwitch={() => setCurrentView('login')} 
            onModeChange={setCurrentView}
            onNavigate={handleNavigation}
            onSuccess={handleLogin}
          />
        )
      case 'account':
        return isAuthenticated ? <Account onNavigate={handleNavigation} user={user} onUpdateUser={handleUpdateUser} /> : <CustomerLogIn onSwitch={() => setCurrentView('signup')} onNavigate={handleNavigation} onSuccess={handleLogin} />
      case 'cart':
        return isAuthenticated ? <Cart onNavigate={handleNavigation} cartItems={cartItems} onUpdateCart={handleUpdateCart} /> : <CustomerLogIn onSwitch={() => setCurrentView('signup')} onNavigate={handleNavigation} onSuccess={handleLogin} />
      case 'analyzer':
        return isAuthenticated ? <FreshnessAnalyzer onNavigate={handleNavigation} /> : <CustomerLogIn onSwitch={() => setCurrentView('signup')} onNavigate={handleNavigation} onSuccess={handleLogin} />
      case 'shop':
        return isAuthenticated ? <ShopDashboard onNavigate={handleNavigation} searchQuery={searchQuery} addToCart={addToCart} /> : <CustomerLogIn onSwitch={() => setCurrentView('signup')} onNavigate={handleNavigation} onSuccess={handleLogin} />
      case 'overview':
        return isAuthenticated ? <ShopDashboardOverview onNavigate={handleNavigation} /> : <CustomerLogIn onSwitch={() => setCurrentView('signup')} onNavigate={handleNavigation} onSuccess={handleLogin} />
      case 'product':
        return isAuthenticated ? <ProductDashboard onNavigate={handleNavigation} searchQuery={searchQuery} addToCart={addToCart} /> : <CustomerLogIn onSwitch={() => setCurrentView('signup')} onNavigate={handleNavigation} onSuccess={handleLogin} />
      case 'merchant-add-product':
        return isAuthenticated && role === 'merchant' ? <MerchantAddProduct onNavigate={handleNavigation} /> : <CustomerLogIn onSwitch={() => setCurrentView('signup')} onNavigate={handleNavigation} onSuccess={handleLogin} />
      case 'merchant-my-products':
        return isAuthenticated && role === 'merchant' ? <MerchantMyProducts /> : <CustomerLogIn onSwitch={() => setCurrentView('signup')} onNavigate={handleNavigation} onSuccess={handleLogin} />
      default:
        return <HomePage onNavigate={handleNavigation} />
    }
  }

  const showHeader = true // Show header on all pages

  return (
    <div className="App">
      {showHeader && (
        <Header 
          onNavigate={handleNavigation} 
          currentView={currentView} 
          onSearch={handleSearch}
          onLogout={handleLogout}
          user={user}
          cartItems={cartItems}
          isAuthenticated={isAuthenticated}
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
