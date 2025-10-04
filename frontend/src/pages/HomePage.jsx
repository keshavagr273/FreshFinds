import React from 'react';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="relative flex min-h-[80vh] items-center justify-center bg-cover bg-center py-24 text-white" 
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(127, 19, 236, 0.8), rgba(57, 12, 121, 0.9)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBCnISOrX9R7OlkN_HtfVXNTBVizAzRaLvvb9X-i4gky66PFxJWDw_IBOkVgWOLRlCCRdmR3copl5AT7h6SyhmCjEBItIIfoACaR3WXJRB_nxLDLeZjA3RvwEJS70VAtmM1BvWVwUUJh8P74XjEe-oyjyJkwDl6V0cVyFIEtBpJasXyp_Bsux3LWNia5uZo0ffcIOXYSYVJ2CE_AelNxHRKSR2PJFVr-fEdKzsWHx63FkIk9chSmDBGswnjwufZYlFnSBpi6oLvM_GL")'
          }}
        >
          <div className="mx-auto max-w-4xl text-center px-4">
            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl md:text-7xl">
              Reduce Food Waste, Save Money
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90 sm:text-xl">
              Discover discounted near-expiry products from local shops. Join us to minimize food waste and enjoy fresh, affordable food.
            </p>
            <button 
              onClick={() => onNavigate && onNavigate('shop')}
              className="mt-10 inline-block rounded-full bg-white px-10 py-4 text-lg font-bold text-purple-600 shadow-2xl transition-transform hover:scale-105"
            >
              Browse Marketplace
            </button>
          </div>
        </section>

        {/* What is FreshFinds Section */}
        <section className="py-20 sm:py-28 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  What is FreshFinds?
                </h2>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                  FreshFinds is an AI-powered freshness detection and marketplace platform. We connect you with local shops offering discounted near-expiry products. Save money, support local businesses, and reduce food waste — all in one place.
                </p>
                <button 
                  onClick={() => onNavigate && onNavigate('analyzer')}
                  className="mt-8 inline-block rounded-full border border-purple-600 px-8 py-3 text-base font-bold text-purple-600 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/10"
                >
                  Learn How It Works
                </button>
              </div>
              <div className="flex justify-center items-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
                  <div className="relative bg-gray-50 dark:bg-gray-800/30 p-8 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-4">
                    <span className="text-purple-600 text-6xl">🔍</span>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Freshness Detection & Marketplace
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-28 bg-gray-50 dark:bg-black/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Why Choose FreshFinds?
              </h2>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center gap-3 rounded-xl bg-white dark:bg-gray-900 p-8 shadow-sm transition-shadow hover:shadow-lg">
                <span className="text-green-600 text-4xl">🌱♻️</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Eco-Friendly</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Reduce food waste and its environmental impact.
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 rounded-xl bg-white dark:bg-gray-900 p-8 shadow-sm transition-shadow hover:shadow-lg">
                <span className="text-yellow-600 text-4xl">💰🛒</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Save Money</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access high-quality fresh food at affordable prices.
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 rounded-xl bg-white dark:bg-gray-900 p-8 shadow-sm transition-shadow hover:shadow-lg">
                <span className="text-blue-600 text-4xl">🏪🤝</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Support Local</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Help local farmers and small businesses in your community thrive.
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 rounded-xl bg-white dark:bg-gray-900 p-8 shadow-sm transition-shadow hover:shadow-lg">
                <span className="text-purple-600 text-4xl">�🥕🍌</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Discover Variety</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Explore fresh fruits, vegetables, and exciting food items from local shops.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-purple-600 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join the Movement
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Be a part of the solution. Sign up today to start saving money and fighting food waste with FreshFinds.
            </p>
            <div className="mt-10">
              <button 
                onClick={() => onNavigate && onNavigate('shop')}
                className="rounded-full bg-white px-8 py-3 text-lg font-bold text-purple-600 shadow-lg transition-transform hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-black/20 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-purple-600 text-2xl">🌱</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">FreshFinds</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400" href="#">
                Privacy Policy
              </a>
              <a className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400" href="#">
                Terms of Service
              </a>
              <a className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400" href="#">
                Contact Us
              </a>
            </div>
            <div className="flex justify-center space-x-6">
              <a className="text-gray-400 hover:text-purple-600" href="#">
                <span className="sr-only">Twitter</span>
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a className="text-gray-400 hover:text-purple-600" href="#">
                <span className="sr-only">Instagram</span>
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.228 6.702a.75.75 0 011.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 111.06-1.06l1.72 1.72 4.01-4.02z" fillRule="evenodd"></path>
                </svg>
              </a>
              <a className="text-gray-400 hover:text-purple-600" href="#">
                <span className="sr-only">Facebook</span>
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            © 2024 FreshFinds. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
