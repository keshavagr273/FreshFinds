import React, { useState, useEffect } from 'react';
import { getUserAvatar } from '../utils/helpers';
import { toast } from 'react-toastify';
import axios from 'axios';

const Account = ({ onNavigate, user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(user?.avatar || getUserAvatar('male'));
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.username || 'User',
    email: user?.email || 'user@example.com',
    phoneNumber: user?.phone || 'Not provided',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update profile image when user prop changes
  useEffect(() => {
    if (user?.avatar) {
      setProfileImage(user.avatar);
    } else {
      setProfileImage(getUserAvatar('male'));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadToCloudinary = async (file) => {
    try {
      setIsUploading(true);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to upload profile photo');
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // Upload to backend API
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/upload/profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setProfileImage(response.data.data.avatar);
        toast.success('Profile photo updated successfully!');
        
        // Update user data in parent component
        if (onUpdateUser && response.data.data.user) {
          onUpdateUser(response.data.data.user);
        }
        
      } else {
        toast.error(response.data.message || 'Failed to upload image');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Upload to Cloudinary via backend
      uploadToCloudinary(file);
    }
  };

  const triggerPhotoUpload = () => {
    document.getElementById('photo-upload').click();
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
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-purple-200 group cursor-pointer" onClick={!isUploading ? triggerPhotoUpload : undefined}>
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className={`w-full h-full object-cover transition-all ${isUploading ? 'brightness-50' : 'group-hover:brightness-75'}`} 
                        />
                        <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-all ${
                          isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          {isUploading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <span className="text-white text-xs font-medium">📷</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Profile Picture</h3>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={triggerPhotoUpload}
                            type="button"
                            disabled={isUploading}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded disabled:opacity-50"
                          >
                            {isUploading ? 'Uploading...' : 'Change Photo'}
                          </button>
                          <span className="text-gray-300">|</span>
                          <button 
                            onClick={async () => {
                              try {
                                setIsUploading(true);
                                const token = localStorage.getItem('token');
                                
                                if (!token) {
                                  toast.error('Please log in to reset profile photo');
                                  return;
                                }

                                const response = await axios.delete(
                                  `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/upload/profile-image`,
                                  {
                                    headers: {
                                      'Authorization': `Bearer ${token}`
                                    }
                                  }
                                );

                                if (response.data.success) {
                                  setProfileImage(getUserAvatar('male'));
                                  toast.info('Profile photo reset to default');
                                  
                                  // Update user data in parent component
                                  if (onUpdateUser && response.data.data.user) {
                                    onUpdateUser(response.data.data.user);
                                  }
                                } else {
                                  toast.error(response.data.message || 'Failed to reset image');
                                }
                              } catch (error) {
                                console.error('Reset error:', error);
                                toast.error(error.response?.data?.message || 'Failed to reset image');
                              } finally {
                                setIsUploading(false);
                              }
                            }}
                            type="button"
                            disabled={isUploading}
                            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 rounded disabled:opacity-50"
                          >
                            {isUploading ? 'Resetting...' : 'Reset'}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG or GIF. Max size 5MB.
                        </p>
                      </div>
                      
                      {/* Hidden file input */}
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
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