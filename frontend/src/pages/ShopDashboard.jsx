import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getProductImage } from '../utils/helpers';

const ShopDashboard = ({ onNavigate, searchQuery = '', addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [remoteProducts, setRemoteProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseURL = useMemo(() => (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'), []);
  const origin = useMemo(() => baseURL.replace(/\/api$/, ''), [baseURL]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📋' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
    { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛' },
    { id: 'bakery', name: 'Bakery', icon: '🍞' },
    { id: 'protein', name: 'Fresh Fish', icon: '🐟' }
  ];

  const demoProducts = [
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
    },
    {
      id: 6,
      name: 'Organic Whole Milk',
      price: 3.99,
      originalPrice: 4.99,
      discount: 20,
      rating: 4.5,
      image: getProductImage('dairy', 'milk'),
      category: 'dairy',
      freshness: 92,
      expiryDays: 7
    },
    {
      id: 7,
      name: 'Fresh Apples',
      price: 2.99,
      originalPrice: 4.49,
      discount: 33,
      rating: 4.7,
      image: getProductImage('fruits', 'apple'),
      category: 'fruits',
      freshness: 89,
      expiryDays: 5
    },
    {
      id: 8,
      name: 'Organic Carrots',
      price: 1.99,
      originalPrice: 2.99,
      discount: 33,
      rating: 4.4,
      image: getProductImage('vegetables', 'carrot'),
      category: 'vegetables',
      freshness: 91,
      expiryDays: 10
    }
  ];

  // Generate a stable pseudo-random freshness between 70 and 95 based on id
  const getFreshnessFromId = (id) => {
    const s = String(id || '');
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    }
    const range = 26; // 70..95 inclusive
    return 50 + (hash % range);
  };

  // Stable pseudo-random rating between 3.2 and 4.7 based on id
  const getRatingFromId = (id) => {
    const s = String(id || '');
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash * 131 + s.charCodeAt(i)) >>> 0;
    }
    const min = 3.2;
    const max = 4.7;
    const frac = (hash % 1000) / 1000; // 0..1
    const val = min + frac * (max - min);
    // round to nearest 0.1 for nicer display
    return Math.round(val * 10) / 10;
  };

  // Map backend products into UI shape
  const mappedRemote = remoteProducts.map(p => {
    const raw = p.images?.[0]?.url || '';
    const normalized = raw.replace(/\\\\/g, '/').replace(/\\/g, '/');
    const img = normalized.startsWith('http') ? normalized : (normalized ? `${origin}/${normalized.startsWith('/') ? normalized.slice(1) : normalized}` : getProductImage(p.category || 'fruits', 'banana'));
    const originalPrice = Number(p.price) || 0;
    const discountPct = Number(p.discount) || 0;
    const finalPrice = Math.max(0, originalPrice - (originalPrice * discountPct) / 100);
    return {
      id: p._id,
      name: p.name,
      price: Number(finalPrice.toFixed(2)),
      originalPrice: originalPrice,
      discount: discountPct,
      rating: getRatingFromId(p._id || p.name),
      image: img,
      category: p.category || 'fruits',
      freshness: getFreshnessFromId(p._id || p.name),
      expiryDays: 5
    };
  });

  const products = mappedRemote.length > 0 ? mappedRemote : demoProducts;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseURL}/products?limit=100`);
        const list = res.data?.data || [];
        setRemoteProducts(list);
      } catch (e) {
        // keep demo fallback silently
        setRemoteProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [baseURL]);

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
              <p className="text-slate-600">{filteredProducts.length} products found {loading ? '(loading...)' : ''}</p>
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
                      <div className="flex">
                        {(() => {
                          const stars = [];
                          for (let i = 1; i <= 5; i++) {
                            if (product.rating >= i) {
                              stars.push(<span key={i} className="text-yellow-400">★</span>);
                            } else if (product.rating > i - 1 && product.rating < i && (product.rating - (i - 1)) >= 0.5) {
                              stars.push(
                                <span key={i} className="relative inline-block w-4 h-4 align-middle">
                                  <span className="absolute inset-0 text-slate-300">☆</span>
                                  <span className="absolute inset-0 text-yellow-400 overflow-hidden" style={{ width: '50%' }}>★</span>
                                </span>
                              );
                            } else {
                              stars.push(<span key={i} className="text-slate-300">☆</span>);
                            }
                          }
                          return stars;
                        })()}
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
                    
                    <button 
                      onClick={() => addToCart && addToCart(product)}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
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