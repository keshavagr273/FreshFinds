import React, { useState } from 'react';
import { getProductImage } from '../utils/helpers';

const ProductDashboard = ({ onNavigate, searchQuery = '', addToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState({
    id: 1,
    name: 'Artisan Fresh Bread',
    price: 2.99,
    originalPrice: 3.99,
    discount: 25,
    rating: 4.6,
    reviewCount: 89,
    description: 'Freshly baked artisan bread made with premium flour and traditional baking methods. Perfect for sandwiches or toast.',
    images: [
      getProductImage('bakery', 'bread'),
      getProductImage('bakery', 'bread'),
      getProductImage('bakery', 'bread')
    ],
    category: 'Bakery',
    freshness: 90,
    expiryDate: '2025-10-06',
    nutritionalInfo: {
      calories: 280,
      protein: '8g',
      carbs: '54g',
      fat: '2g',
      fiber: '4g'
    },
    ingredients: ['Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar', 'Olive Oil'],
    inStock: true,
    seller: 'FreshMart Bakery'
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = [
    { id: 2, name: 'Fresh Organic Bananas', price: 2.49, image: getProductImage('fruits', 'banana') },
    { id: 3, name: 'Fresh Tomatoes', price: 3.99, image: getProductImage('vegetables', 'tomato') },
    { id: 4, name: 'Farm Fresh Eggs', price: 4.49, image: getProductImage('dairy', 'egg') },
    { id: 5, name: 'Atlantic Fresh Fish', price: 12.99, image: getProductImage('protein', 'fish') }
  ];

  const handleAddToCart = () => {
    if (addToCart && selectedProduct) {
      for (let i = 0; i < quantity; i++) {
        addToCart(selectedProduct);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 font-display text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="flex flex-col min-h-screen">

        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-600 dark:text-gray-300">
              <button 
                onClick={() => onNavigate && onNavigate('home')}
                className="hover:text-purple-600 transition-colors"
              >
                Home
              </button>
              <span className="mx-2">/</span>
              <button 
                onClick={() => onNavigate && onNavigate('shop')}
                className="hover:text-purple-600 transition-colors"
              >
                {selectedProduct.category}
              </button>
              <span className="mx-2">/</span>
              <span className="text-purple-600">{selectedProduct.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                  <img
                    src={selectedProduct.images[currentImageIndex]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex gap-3 overflow-x-auto">
                  {selectedProduct.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-purple-600' : 'border-gray-300'
                      }`}
                    >
                      <img src={image} alt={`${selectedProduct.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {selectedProduct.freshness}% Fresh
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                      -{selectedProduct.discount}% OFF
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedProduct.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(selectedProduct.rating))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        ({selectedProduct.rating}) · {selectedProduct.reviewCount} reviews
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-purple-600">${selectedProduct.price}</span>
                    <span className="text-xl text-gray-500 line-through">${selectedProduct.originalPrice}</span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Product Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Seller:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedProduct.seller}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Expires:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedProduct.expiryDate}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Category:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedProduct.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Stock:</span>
                    <span className={`ml-2 ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedProduct.inStock}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Nutritional Info */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Nutritional Information (per serving)</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Calories: {selectedProduct.nutritionalInfo.calories}</div>
                    <div>Protein: {selectedProduct.nutritionalInfo.protein}</div>
                    <div>Carbs: {selectedProduct.nutritionalInfo.carbs}</div>
                    <div>Fat: {selectedProduct.nutritionalInfo.fat}</div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.ingredients.map((ingredient, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((product) => (
                  <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                      <p className="text-purple-600 font-bold">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDashboard;