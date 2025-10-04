import React, { useState } from 'react';
import { getProductImage } from '../utils/helpers';

const Cart = ({ onNavigate }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Fresh Organic Bananas",
      price: 2.49,
      quantity: 3,
      image: getProductImage('fruits', 'banana')
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      price: 3.99,
      quantity: 2,
      image: getProductImage('vegetables', 'tomato')
    },
    {
      id: 3,
      name: "Artisan Bread",
      price: 2.99,
      quantity: 1,
      image: getProductImage('bakery', 'bread')
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryTax = () => {
    const subtotal = getSubtotal();
    // Delivery tax: $5 flat rate for orders under $50, free for orders over $50
    return subtotal >= 50 ? 0 : 5;
  };

  const getGSTTax = () => {
    const subtotal = getSubtotal();
    // GST: 10% on subtotal
    return subtotal * 0.10;
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    const deliveryTax = getDeliveryTax();
    const gstTax = getGSTTax();
    return (subtotal + deliveryTax + gstTax).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-display text-gray-800">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="flex h-full grow flex-col">
          {/* Main Content */}
          <div className="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-gray-900 tracking-light text-[32px] font-bold leading-tight">Shopping Cart</p>
                  <p className="text-gray-500 text-sm font-normal leading-normal">
                    Review your items and proceed to checkout
                  </p>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex flex-col gap-4 p-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-20"
                      style={{ backgroundImage: `url("${item.image}")` }}
                    ></div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-gray-900 text-base font-medium leading-normal">{item.name}</p>
                      <p className="text-gray-500 text-sm font-normal leading-normal">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex items-center justify-center rounded-full size-8 bg-gray-100 hover:bg-gray-200"
                      >
                        <span className="text-gray-600 text-sm">−</span>
                      </button>
                      <span className="text-gray-900 text-sm font-medium px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex items-center justify-center rounded-full size-8 bg-gray-100 hover:bg-gray-200"
                      >
                        <span className="text-gray-600 text-sm">+</span>
                      </button>
                    </div>
                    <p className="text-gray-900 text-base font-medium leading-normal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="flex flex-col gap-4 p-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-gray-900 text-lg font-bold mb-4">Order Summary</h3>
                  
                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-2">
                    <p className="text-gray-600 text-sm">Subtotal ({cartItems.length} items)</p>
                    <p className="text-gray-900 text-sm font-medium">${getSubtotal().toFixed(2)}</p>
                  </div>
                  
                  {/* Delivery Tax */}
                  <div className="flex justify-between items-center py-2">
                    <p className="text-gray-600 text-sm">
                      Delivery Fee
                      {getSubtotal() >= 50 && <span className="text-green-600 ml-1">(Free shipping over $50)</span>}
                    </p>
                    <p className="text-gray-900 text-sm font-medium">
                      {getDeliveryTax() === 0 ? 'FREE' : `$${getDeliveryTax().toFixed(2)}`}
                    </p>
                  </div>
                  
                  {/* GST Tax */}
                  <div className="flex justify-between items-center py-2">
                    <p className="text-gray-600 text-sm">GST (10%)</p>
                    <p className="text-gray-900 text-sm font-medium">${getGSTTax().toFixed(2)}</p>
                  </div>
                  
                  <hr className="my-4 border-gray-200" />
                  
                  {/* Total */}
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-900 text-lg font-bold">Total</p>
                    <p className="text-gray-900 text-xl font-bold">${getTotalPrice()}</p>
                  </div>
                  
                  <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-purple-700 transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;