import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

// Icons
const UserIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
    <path stroke="#bbb" strokeWidth="2" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="8" rx="2" stroke="#bbb" strokeWidth="2"/>
    <path stroke="#bbb" strokeWidth="2" d="M8 11V7a4 4 0 1 1 8 0v4"/>
  </svg>
);

const EyeSVG = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffSVG = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const EyeIcon = ({ open, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={open ? 'Hide password' : 'Show password'}
    className="text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
  >
    {open ? <EyeOffSVG /> : <EyeSVG />}
  </button>
);

const Login = ({ onSwitch, onNavigate, onSuccess }) => {
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    userID: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.userID.trim() || !form.password.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const endpoint = role === 'customer'
        ? `${baseURL}/auth/customer-login`
        : `${baseURL}/auth/merchant-login`;
      
      const loginData = {
        userID: form.userID,
        password: form.password
      };

      const res = await axios.post(endpoint, loginData);
      
      if (res.data.token && res.data.user) {
        const safeUser = {
          _id: res.data.user._id,
          username: res.data.user.username,
          email: res.data.user.email,
          role: res.data.user.role,
          avatar: res.data.user.avatar
        };
        // Store authentication data
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(safeUser));
        localStorage.setItem('userRole', safeUser.role);
        
        toast.success('Login successful!');
        
        // Call onSuccess callback; App will handle redirect based on role
        if (onSuccess) {
          onSuccess(res.data.user);
        }
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4 pt-20">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6">
          <h2 className="text-2xl font-bold text-center mb-2">
            {role === "customer" ? "Customer Login" : "Merchant Login"}
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Welcome! Please login to your account.
          </p>

          {/* Toggle */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg border ${
                role === "merchant"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-300 text-gray-600"
              }`}
              onClick={() => setRole("merchant")}
            >
              Merchant
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg border ${
                role === "customer"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-300 text-gray-600"
              }`}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {role === "customer" ? "Username or Email" : "Email or Merchant ID"}
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500">
                <UserIcon />
                <input
                  id="userID"
                  type="text"
                  name="userID"
                  autoComplete="username"
                  aria-label={role === "customer" ? "Username or Email" : "Email or Merchant ID"}
                  aria-required="true"
                  value={form.userID}
                  onChange={handleChange}
                  placeholder={role === "customer" ? "Enter your username or email" : "Enter your email or merchant ID"}
                  className="flex-1 outline-none ml-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500">
                <LockIcon />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  aria-label="Password"
                  aria-required="true"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="flex-1 outline-none ml-2"
                />
                <div className="ml-2">
                  <EyeIcon open={showPassword} onClick={() => setShowPassword((v) => !v)} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-purple-600 font-semibold cursor-pointer hover:text-purple-700"
              onClick={() => onSwitch && onSwitch("signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;