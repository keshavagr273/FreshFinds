import React, { useState } from 'react';
import styles from '../components_css/Signup.module.css';

import axios from 'axios';
import { toast } from 'react-toastify';

// Icons (reuse or replace with relevant ones)
const UserIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#bbb" strokeWidth="2" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z"/></svg>
);
const IdIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#bbb" strokeWidth="2"/><path stroke="#bbb" strokeWidth="2" d="M7 9h6M7 13h4"/></svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#bbb" strokeWidth="2" d="M2 5.5A2.5 2.5 0 0 1 4.5 3h2A2.5 2.5 0 0 1 9 5.5v1A2.5 2.5 0 0 1 6.5 9h-2A2.5 2.5 0 0 1 2 6.5v-1ZM15 19.5A2.5 2.5 0 0 1 17.5 22h2A2.5 2.5 0 0 0 22 19.5v-1A2.5 2.5 0 0 0 19.5 16h-2A2.5 2.5 0 0 0 15 18.5v1ZM3 8.5v7A2.5 2.5 0 0 0 5.5 18h2A2.5 2.5 0 0 0 10 15.5v-7A2.5 2.5 0 0 0 7.5 6h-2A2.5 2.5 0 0 0 3 8.5ZM14 5.5A2.5 2.5 0 0 1 16.5 3h2A2.5 2.5 0 0 1 21 5.5v1A2.5 2.5 0 0 1 18.5 9h-2A2.5 2.5 0 0 1 14 6.5v-1ZM15 8.5v7A2.5 2.5 0 0 0 17.5 18h2A2.5 2.5 0 0 0 22 15.5v-7A2.5 2.5 0 0 0 19.5 6h-2A2.5 2.5 0 0 0 15 8.5Z"/></svg>
);
const EmailIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#bbb" strokeWidth="2"/><path stroke="#bbb" strokeWidth="2" d="M3 7l9 6 9-6"/></svg>
);
const LockIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="8" rx="2" stroke="#bbb" strokeWidth="2"/><path stroke="#bbb" strokeWidth="2" d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>
);
const EyeIcon = ({ open, onClick }) => (
  <span onClick={onClick} style={{ cursor: 'pointer', marginLeft: 6, display: 'flex', alignItems: 'center' }}>
    {!open ? '👁️' : '🙈'}
  </span>
);
const StoreIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#bbb" strokeWidth="2" d="M3 9l1-5h16l1 5M4 9h16v11H4V9Z"/></svg>
);

const Signup = ({ onSwitch, onModeChange, onSuccess, onNavigate }) => {
  const [form, setForm] = useState({
    username: '',
    customerID: '',
    phone: '',
    password: '',
    email: '',
    merchantID: '',
    storeName: ''
  });
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username.trim() ||
        !form.customerID.trim() ||
        !form.phone.trim() ||
        !form.email.trim() ||
        !form.password.trim() ||
        (role === 'customer' && !form.merchantID.trim())) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ""))) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    try {
      const endpoint = role === 'customer'
        ? 'http://localhost:3000/api/auth/customer-signup'
        : 'http://localhost:3000/api/auth/merchant-signup';

      const res = await axios.post(endpoint, form);
      if (onSuccess && res.data.user) {
        toast.success('Signup successful!');
        onSuccess(res.data.user);
        // Navigate to appropriate page after successful signup
        if (role === 'customer') {
          onNavigate && onNavigate('home');
        } else {
          onNavigate && onNavigate('overview');
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <>

      <div className={styles['signup-bg']}>
        <div className={styles['signup-card']}>
          <div className={styles['signup-title']}>
            {role === 'customer' ? 'Customer Signup' : 'Merchant Signup'}
          </div>
          <div className={styles['signup-subtitle']}>Create your account to get started.</div>

          <div className={styles['toggle-row']}>
            <button type="button" className={role === 'merchant' ? `${styles['toggle-btn']} ${styles['active']}` : styles['toggle-btn']} onClick={() => { setRole('merchant'); onSwitch && onSwitch('merchant'); }}>Merchant</button>
            <button type="button" className={role === 'customer' ? `${styles['toggle-btn']} ${styles['active']}` : styles['toggle-btn']} onClick={() => setRole('customer')}>Customer</button>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            <label className={styles['signup-label']}>Username</label>
            <div className={styles['input-row']}><UserIcon /><input name="username" placeholder="your_username" value={form.username} onChange={handleChange} /></div>

            <label className={styles['signup-label']}>{role === 'customer' ? 'Customer ID' : 'Merchant ID'}</label>
            <div className={styles['input-row']}><IdIcon /><input name={role === 'customer' ? 'customerID' : 'merchantID'} placeholder={`Enter your ${role} ID`} value={role === 'customer' ? form.customerID : form.merchantID} onChange={handleChange} /></div>

            <label className={styles['signup-label']}>Phone</label>
            <div className={styles['input-row']}><PhoneIcon /><input name="phone" placeholder="+91 12345 67890" value={form.phone} onChange={handleChange} /></div>

            <label className={styles['signup-label']}>Email</label>
            <div className={styles['input-row']}><EmailIcon /><input name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} /></div>

            <label className={styles['signup-label']}>Password</label>
            <div className={styles['input-row']}>
              <LockIcon />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <EyeIcon open={showPassword} onClick={() => setShowPassword((v) => !v)} />
            </div>

            {role === 'merchant' && (
              <>
                <label className={styles['signup-label']}>Store Name</label>
                <div className={styles['input-row']}><StoreIcon /><input name="storeName" placeholder="e.g. FreshMart" value={form.storeName} onChange={handleChange} /></div>
              </>
            )}

            <button className={styles['signup-btn']} type="submit">Sign Up</button>
          </form>

          <div className={styles['signup-footer']}>
            Already have an account?
            <span style={{ color: '#7c19e5', fontWeight: 600, marginLeft: 4, cursor: 'pointer' }} onClick={() => onModeChange && onModeChange('login')}>Login</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
