import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check for hardcoded admin credentials
      if (formData.email === "harshavardhinin6@gmail.com" && formData.password === "admin123") {
        const adminUser = {
          email: "harshavardhinin6@gmail.com",
          fullName: "Admin",
          role: "ADMIN"
        };
        localStorage.setItem("adminUser", JSON.stringify(adminUser));
        localStorage.setItem("userRole", "ADMIN");
        toast.success("Admin login successful!");
        navigate("/admin-dashboard");
        setLoading(false);
        return;
      }

      // Regular login flow
      const response = await authAPI.login(formData);

      if (response.data.user.role === "ADMIN") {
        localStorage.setItem("adminUser", JSON.stringify(response.data.user));
        localStorage.setItem("userRole", "ADMIN");
        login(response.data.user);
        toast.success("Admin login successful!");
        navigate("/admin-dashboard");
      } else if (response.data.user.role === "MENTOR") {
        login(response.data.user);
        toast.success("Mentor login successful!");
        navigate("/mentor-dashboard");
      } else {
        login(response.data.user);
        toast.success("Login successful!");
        navigate("/student-dashboard");
      }
    } catch (error) {
      if (error.response?.data?.message === "MENTOR_NOT_APPROVED" || 
          error.response?.data?.message === "MENTOR_NOT_VERIFIED") {
        toast.warning(
          "Your mentor account is pending admin approval. You will receive an email with login credentials once approved."
        );
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Image */}
      <div className="login-image-section">
        <div className="image-overlay"></div>
        <Link to="/" className="back-link">
          <FiArrowLeft /> Back to Home
        </Link>
        <div className="image-content">
          <div className="brand-logo">
            <img src="/logo.jpeg" alt="GCT Logo" className="brand-logo-img" />
            <span>PlaceTrack</span>
          </div>
          <h2>Welcome to GCT Placement Portal</h2>
          <p>Connect with seniors, learn from their experiences, and prepare for your dream company.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="login-form-section">
        <div className="form-container">
          <div className="form-header">
            <h1>Sign in</h1>
            <p>Welcome back! Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="input-group">
              <div className="input-icon">
                <FiMail />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
            </div>

            {/* Password Input */}
            <div className="input-group">
              <div className="input-icon">
                <FiLock />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>

            {/* Sign Up Link */}
            <p className="signup-link">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
