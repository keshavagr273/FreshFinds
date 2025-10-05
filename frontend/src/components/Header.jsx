import React, { useState } from 'react';
import { getUserAvatar } from '../utils/helpers';

const Header = ({ onNavigate, currentView = 'shop', onSearch, onLogout, user, cartItems = [], isAuthenticated = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const role = (user && user.role) || localStorage.getItem('userRole');
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-2 text-xl font-bold text-slate-900 hover:text-purple-600 transition-colors"
            >
              <span className="text-purple-600 text-3xl">🛒</span>
              FreshFinds
            </button>
            <nav className="hidden md:flex items-center gap-6">
              {role !== 'merchant' && (
                <>
                  <button 
                    onClick={() => onNavigate && onNavigate('home')}
                    className={`text-sm font-medium transition-colors ${
                      currentView === 'home' 
                        ? 'text-purple-600' 
                        : 'text-slate-600 hover:text-purple-600'
                    }`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('shop')}
                    className={`text-sm font-medium transition-colors ${
                      currentView === 'shop' || currentView === 'product'
                        ? 'text-purple-600' 
                        : 'text-slate-600 hover:text-purple-600'
                    }`}
                  >
                    Browse
                  </button>
                </>
              )}
              <button 
                onClick={() => onNavigate && onNavigate('analyzer')}
                className={`relative flex items-center gap-1 text-sm font-medium transition-colors pr-8 ${
                  currentView === 'analyzer' 
                    ? 'text-purple-600' 
                    : 'text-slate-600 hover:text-purple-600'
                }`}
                title="AI-Powered Freshness Analysis"
              >
                <span className="text-yellow-500">⭐</span>
                Fruitify
                <span className="absolute -top-2 -right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
              </button>
              {isAuthenticated && role === 'merchant' && (
                <>
                  <button 
                    onClick={() => onNavigate && onNavigate('overview')}
                    className={`text-sm font-medium transition-colors ${
                      currentView === 'overview' 
                        ? 'text-purple-600' 
                        : 'text-slate-600 hover:text-purple-600'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('merchant-my-products')}
                    className={`text-sm font-medium transition-colors ${
                      currentView === 'merchant-my-products' 
                        ? 'text-purple-600' 
                        : 'text-slate-600 hover:text-purple-600'
                    }`}
                  >
                    My Products
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('merchant-add-product')}
                    className={`text-sm font-medium transition-colors ${
                      currentView === 'merchant-add-product' 
                        ? 'text-purple-600' 
                        : 'text-slate-600 hover:text-purple-600'
                    }`}
                  >
                    Add Product
                  </button>
                </>
              )}
              {isAuthenticated && (
                <button 
                  onClick={() => onNavigate && onNavigate('account')}
                  className={`text-sm font-medium transition-colors ${
                    currentView === 'account' 
                      ? 'text-purple-600' 
                      : 'text-slate-600 hover:text-purple-600'
                  }`}
                >
                  Account
                </button>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated && role !== 'merchant' && (
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-2.5 text-slate-400">
                  🔍
                </span>
              </div>
            )}
            
            {isAuthenticated && role !== 'merchant' && (
              <button 
                onClick={() => onNavigate && onNavigate('cart')}
                className="relative p-2 text-slate-600 hover:text-purple-600 transition-colors"
              >
                <span className="text-xl">🛒</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            
            {isAuthenticated ? (
              <div className="relative group">
                <button 
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-colors cursor-pointer"
                  title="My Account"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition-colors">
                      <span className="text-white text-sm font-semibold">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  )}
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user?.username || 'User'}
                    </div>
                    <button
                      onClick={() => onNavigate && onNavigate('account')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Account
                    </button>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate && onNavigate('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('signup')}
                  className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;