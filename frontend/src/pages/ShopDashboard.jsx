import React, { useState } from 'react';
import { getProductImage } from '../utils/helpers';

const ShopDashboard = ({ onNavigate, searchQuery = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📋' },
    { id: 'fruits', name: 'Fruits', icon: '�' },
    { id: 'vegetables', name: 'Vegetables', icon: '🍅' },
    { id: 'dairy', name: 'Dairy & Eggs', icon: '�' },
    { id: 'bakery', name: 'Bakery', icon: '🍞' },
    { id: 'protein', name: 'Fresh Fish', icon: '🐟' }
  ];

  const products = [
    {
      id: 1,
      name: 'Fresh Organic Bananas',
      price: 2.49,
      originalPrice: 3.49,
      discount: 29,
      rating: 4.6,
      image: getProductImage('fruits', 'banana'),
      category: 'fruits',
      freshness: 88,
      expiryDays: 3
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      price: 3.99,
      originalPrice: 5.99,
      discount: 33,
      rating: 4.7,
      image: getProductImage('vegetables', 'tomato'),
      category: 'vegetables',
      freshness: 92,
      expiryDays: 5
    },
    {
      id: 3,
      name: 'Artisan Bread',
      price: 2.99,
      originalPrice: 3.99,
      discount: 25,
      rating: 4.6,
      image: getProductImage('bakery', 'bread'),
      category: 'bakery',
      freshness: 90,
      expiryDays: 2
    },
    {
      id: 4,
      name: 'Fresh Farm Eggs',
      price: 4.49,
      originalPrice: 5.99,
      discount: 25,
      rating: 4.8,
      image: getProductImage('dairy', 'egg'),
      category: 'dairy',
      freshness: 95,
      expiryDays: 10
    },
    {
      id: 5,
      name: 'Fresh Atlantic Fish',
      price: 12.99,
      originalPrice: 16.99,
      discount: 24,
      rating: 4.9,
      image: getProductImage('protein', 'fish'),
      category: 'protein',
      freshness: 94,
      expiryDays: 1
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 font-display text-slate-800 min-h-screen">
      <div className="flex flex-col min-h-screen">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
          <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Fresh Deals, Delivered Daily
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover premium quality produce at unbeatable prices
            </p>
            <button 
              onClick={() => {
                const productsSection = document.getElementById('products-section');
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <main id="products-section" className="flex-1 py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-slate-600">{filteredProducts.length} products found</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      -{product.discount}%
                    </div>
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {product.freshness}% Fresh
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">{product.name}</h3>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(product.rating))}
                      </div>
                      <span className="text-sm text-slate-600">({product.rating})</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-purple-600">${product.price}</span>
                      <span className="text-sm text-slate-500 line-through">${product.originalPrice}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                      <span>Expires in {product.expiryDays} days</span>
                      <span className="text-green-600 font-medium">In Stock</span>
                    </div>
                    
                    <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12">
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-purple-400 text-2xl">🛒</span>
                  <span className="text-xl font-bold">FreshFinds</span>
                </div>
                <p className="text-slate-400">Your trusted partner for fresh, quality produce delivered right to your door.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white">Fruits</a></li>
                  <li><a href="#" className="hover:text-white">Vegetables</a></li>
                  <li><a href="#" className="hover:text-white">Dairy</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Returns</a></li>
                  <li><a href="#" className="hover:text-white">Shipping</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; 2025 FreshFinds. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ShopDashboard;