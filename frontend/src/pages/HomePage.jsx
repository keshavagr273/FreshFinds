import React from 'react';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20 text-white"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(127, 19, 236, 0.5), rgba(100, 21, 255, 0.7)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBCnISOrX9R7OlkN_HtfVXNTBVizAzRaLvvb9X-i4gky66PFxJWDw_IBOkVgWOLRlCCRdmR3copl5AT7h6SyhmCjEBItIIfoACaR3WXJRB_nxLDLeZjA3RvwEJS70VAtmM1BvWVwUUJh8P74XjEe-oyjyJkwDl6V0cVyFIEtBpJasXyp_Bsux3LWNia5uZo0ffcIOXYSYVJ2CE_AelNxHRKSR2PJFVr-fEdKzsWHx63FkIk9chSmDBGswnjwufZYlFnSBpi6oLvM_GL")`
          }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl">
              Reduce Food Waste, Save Money
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
              Discover discounted 'near-expiry' products from local shops. Join us in our mission to minimize food waste and enjoy fresh, affordable food.
            </p>
            <button 
              onClick={() => onNavigate && onNavigate('shop')}
              className="mt-8 rounded-lg bg-white px-8 py-3 text-lg font-bold text-purple-600 shadow-lg transition-transform hover:scale-105"
            >
              Browse Marketplace
            </button>
          </div>
        </section>

        {/* Star Feature - Fruitify */}
        <section className="py-16 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-purple-900 px-4 py-2 rounded-full font-bold text-sm mb-6 animate-pulse">
                <span className="text-lg">⭐</span>
                STAR FEATURE
                <span className="text-lg">⭐</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Meet Fruitify
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-xl text-white/90 mb-8">
                Revolutionary AI-powered freshness detection technology that helps you make smarter purchasing decisions. 
                Get instant freshness scores and shelf-life predictions for all your produce! 🍎🤖
              </p>
              <button 
                onClick={() => onNavigate && onNavigate('analyzer')}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
              >
                🚀 Experience Fruitify Now
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why Choose Fresh Finds?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                Our platform connects you with local shops offering 'near-expiry' products at discounted prices. It's a win-win: you save money, and we reduce food waste.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-3 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-sm relative">
                <div className="absolute top-2 right-2 bg-yellow-400 text-purple-900 text-xs px-2 py-1 rounded-full font-bold">
                  FRUITIFY
                </div>
                <span className="text-purple-600 text-3xl">🤖</span>
                <h3 className="text-lg font-bold text-gray-900">AI-Powered Smart Shopping</h3>
                <p className="text-sm text-gray-600">
                  Our Fruitify technology analyzes freshness in real-time, helping you make informed decisions and reduce food waste with confidence.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <span className="text-purple-600 text-3xl">💰</span>
                <h3 className="text-lg font-bold text-gray-900">Save Money</h3>
                <p className="text-sm text-gray-600">
                  Enjoy significant discounts on high-quality food items that are still perfectly good to eat.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <span className="text-purple-600 text-3xl">❤️</span>
                <h3 className="text-lg font-bold text-gray-900">Support Local</h3>
                <p className="text-sm text-gray-600">
                  Support local businesses and communities by purchasing from nearby shops.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <span className="text-purple-600 text-3xl">🏪</span>
                <h3 className="text-lg font-bold text-gray-900">Discover Variety</h3>
                <p className="text-sm text-gray-600">
                  Discover unique and diverse food options from a variety of local vendors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-purple-50 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Join the Movement
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Sign up today and start making a difference. Whether you're a shopper looking for great deals or a shop wanting to reduce waste, Fresh Finds is the place for you.
            </p>
            <div className="mt-8 space-y-4">
              <button 
                onClick={() => onNavigate && onNavigate('analyzer')}
                className="relative rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 group"
              >
                <span className="flex items-center gap-2">
                  <span className="text-yellow-300">⭐</span>
                  Try Fruitify - AI Freshness Analyzer
                  <span className="bg-yellow-400 text-purple-900 text-xs px-2 py-1 rounded-full font-bold group-hover:animate-bounce">NEW</span>
                </span>
              </button>
              <p className="text-white/80 text-sm max-w-md mx-auto">
                🚀 Experience our revolutionary AI-powered freshness detection technology!
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a className="text-sm text-gray-500 hover:text-purple-600" href="#">Privacy Policy</a>
              <a className="text-sm text-gray-500 hover:text-purple-600" href="#">Terms of Service</a>
              <a className="text-sm text-gray-500 hover:text-purple-600" href="#">Contact Us</a>
            </div>
            <div className="flex justify-center space-x-6">
              <a className="text-gray-400 hover:text-purple-600" href="#">
                <span className="sr-only">Twitter</span>
                <span className="text-xl">🐦</span>
              </a>
              <a className="text-gray-400 hover:text-purple-600" href="#">
                <span className="sr-only">Instagram</span>
                <span className="text-xl">📷</span>
              </a>
              <a className="text-gray-400 hover:text-purple-600" href="#">
                <span className="sr-only">Facebook</span>
                <span className="text-xl">📘</span>
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-400">
            © 2024 Fresh Finds. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;