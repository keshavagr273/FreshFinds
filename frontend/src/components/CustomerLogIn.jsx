import React, { useState } from "react";

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

const Login = ({ onSwitch, onNavigate }) => {
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    userID: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call for login
    console.log("Logging in as", role, form);
    // Simulate successful login and redirect to appropriate page
    if (role === "customer") {
      onNavigate && onNavigate('home');
    } else {
      onNavigate && onNavigate('overview'); // Merchant dashboard
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
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
                {role === "customer" ? "Customer ID" : "Merchant ID"}
              </label>
              <input
                type="text"
                name="userID"
                value={form.userID}
                onChange={handleChange}
                placeholder={`Enter your ${role} ID`}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="flex-1 outline-none"
                />
                <span
                  className="cursor-pointer ml-2"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
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
              className="text-purple-600 font-semibold cursor-pointer"
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