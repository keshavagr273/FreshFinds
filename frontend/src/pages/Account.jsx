import React, { useState } from 'react';
import { getUserAvatar } from '../utils/helpers';

const Account = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
    // Add save logic here
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'orders', label: 'Orders' },
    { id: 'notifications', label: 'Notifications' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50">
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
              Account Settings
            </h1>
            
            <div className="bg-white p-2 rounded-xl shadow-sm border border-purple-100">
              {/* Tab Navigation */}
              <div className="flex border-b border-purple-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 text-center py-3 px-4 text-sm font-bold border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 sm:p-8 space-y-8">
                {activeTab === 'profile' && (
                  <>
                    {/* Profile Picture Section */}
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-200">
                        <img 
                          src={getUserAvatar('male')} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Profile Picture</h3>
                        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                          Change Photo
                        </button>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Personal Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fullName">
                            Full Name
                          </label>
                          <input
                            className="w-full bg-gray-50 border border-purple-300 focus:ring-purple-500 focus:border-purple-500 rounded-lg text-gray-900 placeholder:text-gray-400 transition-all p-3"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            type="text"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                            Email Address
                          </label>
                          <input
                            className="w-full bg-gray-50 border border-purple-300 focus:ring-purple-500 focus:border-purple-500 rounded-lg text-gray-900 placeholder:text-gray-400 transition-all p-3"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            type="email"
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phoneNumber">
                            Phone Number
                          </label>
                          <input
                            className="w-full bg-gray-50 border border-purple-300 focus:ring-purple-500 focus:border-purple-500 rounded-lg text-gray-900 placeholder:text-gray-400 transition-all p-3"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            type="tel"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="border-purple-200" />

                    {/* Change Password */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Change Password
                      </h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="currentPassword">
                            Current Password
                          </label>
                          <input
                            className="w-full md:max-w-md bg-gray-50 border border-purple-300 focus:ring-purple-500 focus:border-purple-500 rounded-lg text-gray-900 placeholder:text-gray-400 transition-all p-3"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            type="password"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="newPassword">
                              New Password
                            </label>
                            <input
                              className="w-full bg-gray-50 border border-purple-300 focus:ring-purple-500 focus:border-purple-500 rounded-lg text-gray-900 placeholder:text-gray-400 transition-all p-3"
                              id="newPassword"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              placeholder="••••••••"
                              type="password"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirmPassword">
                              Confirm New Password
                            </label>
                            <input
                              className="w-full bg-gray-50 border border-purple-300 focus:ring-purple-500 focus:border-purple-500 rounded-lg text-gray-900 placeholder:text-gray-400 transition-all p-3"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="••••••••"
                              type="password"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button 
                        onClick={handleSaveChanges}
                        className="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </>
                )}

                {activeTab === 'addresses' && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Address Management</h3>
                    <p className="text-gray-600 mb-6">Manage your delivery addresses</p>
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Add New Address
                    </button>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Order History</h3>
                    <p className="text-gray-600 mb-6">View your past orders and track current ones</p>
                    <button 
                      onClick={() => onNavigate && onNavigate('cart')}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      View Cart
                    </button>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h3>
                    <p className="text-gray-600 mb-6">Manage your email and push notifications</p>
                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Order Updates</span>
                        <input type="checkbox" defaultChecked className="text-purple-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Promotional Emails</span>
                        <input type="checkbox" className="text-purple-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">New Deals Alerts</span>
                        <input type="checkbox" defaultChecked className="text-purple-600" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;