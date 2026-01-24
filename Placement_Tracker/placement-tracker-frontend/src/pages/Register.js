import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail, FiLock, FiUser, FiBriefcase, FiPhone, FiLinkedin, FiMapPin, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { authAPI, departmentAPI } from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  // Step management: 
  // Students: "role" -> "email" -> "otp" -> "form"
  // Mentors: "role" -> "email" -> "otp" -> "personal" -> "professional" -> "linkedin"
  const [currentStep, setCurrentStep] = useState("role");
  const [selectedRole, setSelectedRole] = useState(null); // "STUDENT" or "MENTOR"

  // OTP verification states (only for students)
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    placedCompany: "",
    placedPosition: "",
    phoneNumber: "",
    linkedinProfile: "",
    departmentId: "",
    placementYear: new Date().getFullYear(),
    graduationYear: new Date().getFullYear() + 1,
    location: "",
    contactVisibility: "PUBLIC",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentAPI.getAll();
        setDepartments(response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if email is GCT email (only required for students)
  const isGCTEmail = (email) => {
    return email && email.toLowerCase().endsWith("@gct.ac.in");
  };

  // Check if email is valid
  const isValidEmail = (email) => {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Strong password validation: At least 8 characters, 1 uppercase, 1 number
  const isStrongPassword = (password) => {
    if (!password || password.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpperCase && hasNumber;
  };

  // Get password strength message
  const getPasswordStrengthMessage = (password) => {
    if (!password) return "";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one capital letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return "Strong password ✓";
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Both students and mentors go through email/OTP verification
    setCurrentStep("email");
  };

  // Send OTP to email
  const handleSendOTP = async () => {
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    // Students need GCT email, mentors can use any email
    if (selectedRole === "STUDENT" && !isGCTEmail(formData.email)) {
      toast.error(
        "Only GCT email addresses (@gct.ac.in) are allowed for students"
      );
      return;
    }

    if (selectedRole === "MENTOR" && !isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setOtpSending(true);
    try {
      const response = await authAPI.sendOTP(formData.email);
      if (response.data.success) {
        toast.success("OTP sent to your email! Please check your inbox.", {
          autoClose: 8000,
        });
        setCurrentStep("otp");
        setCountdown(60);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpVerifying(true);
    try {
      const response = await authAPI.verifyOTP(formData.email, otp);
      if (response.data.success) {
        toast.success("Email verified successfully!");
        setEmailVerified(true);
        // After OTP, mentors go to personal details, students to form
        if (selectedRole === "MENTOR") {
          setCurrentStep("personal");
        } else {
          setCurrentStep("form");
        }
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setOtpVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOTP = () => {
    if (countdown === 0) {
      handleSendOTP();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Both students and mentors need email verification
    if (!emailVerified) {
      toast.error("Please verify your email first");
      return;
    }

    // Validate strong password
    if (!isStrongPassword(formData.password)) {
      toast.error("Password must be at least 8 characters with at least one capital letter and one number");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      };

      if (selectedRole === "STUDENT") {
        payload.departmentId = formData.departmentId;
        payload.graduationYear = parseInt(formData.graduationYear);
      }

      if (selectedRole === "MENTOR") {
        payload.placedCompany = formData.placedCompany;
        payload.placedPosition = formData.placedPosition;
        payload.phoneNumber = formData.phoneNumber;
        payload.linkedinProfile = formData.linkedinProfile;
        payload.departmentId = formData.departmentId;
        payload.placementYear = parseInt(formData.placementYear);
        payload.location = formData.location;
        payload.contactVisibility = formData.contactVisibility;
      }

      const response = await authAPI.register(payload);
      toast.success("Registration successful!");

      // Both students and mentors can login directly after registration
      login(response.data.user);
      if (selectedRole === "MENTOR") {
        navigate("/mentor-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 0: Role Selection (FIRST STEP)
  const renderRoleStep = () => (
    <div className="role-selection-step">
      <div className="role-selection-cards">
        <div className="role-card" onClick={() => handleRoleSelect("STUDENT")}>
          <h3>Student</h3>
           <p>Lets get started to share your interview experiences</p>
        </div>

        <div className="role-card" onClick={() => handleRoleSelect("MENTOR")}>
          <h3>Mentor</h3>
          <p>Alumni who got placed and wants to guide juniors</p>
        </div>
      </div>

      <div className="admin-note">
        <p>
          Note: Students need GCT email verification. Mentors can register
          with any email.
        </p>
      </div>
    </div>
  );

  // Step 1: Email Entry
  const renderEmailStep = () => (
    <div className="email-verification-step">
      <div className="step-indicator">
        <div className="step-dot completed"></div>
        <div className="step-dot active"></div>
        <div className="step-dot"></div>
        <div className="step-dot"></div>
      </div>

      <h2>Verify Your Email</h2>
      <p>
        {selectedRole === "STUDENT" 
          ? "Only GCT students (@gct.ac.in) can register as students"
          : "Enter your email to receive a verification code"}
      </p>

      <div className="email-input-group">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={selectedRole === "STUDENT" ? "yourrollno@gct.ac.in" : "your.email@example.com"}
          required
        />
        {selectedRole === "STUDENT" && formData.email && !isGCTEmail(formData.email) && (
          <span className="email-warning">
            Must be a GCT email (@gct.ac.in)
          </span>
        )}
      </div>

      <button
        type="button"
        className="auth-submit"
        onClick={handleSendOTP}
        disabled={otpSending || (selectedRole === "STUDENT" ? !isGCTEmail(formData.email) : !isValidEmail(formData.email))}
      >
        {otpSending ? "Sending OTP..." : "Send OTP"}
      </button>

      <button
        type="button"
        className="back-to-role-btn"
        onClick={() => {
          setCurrentStep("role");
          setSelectedRole(null);
        }}
      >
        ← Back to role selection
      </button>
    </div>
  );

  // Step 2: OTP Verification (only for students)
  const renderOTPStep = () => (
    <div className="otp-verification-step">
      <div className="step-indicator">
        <div className="step-dot completed"></div>
        <div className="step-dot completed"></div>
        <div className="step-dot active"></div>
        <div className="step-dot"></div>
      </div>

      <h2>Enter OTP</h2>
      <p>We've sent a 6-digit code to {formData.email}</p>

      <div className="form-group">
        <input
          type="text"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className="otp-input"
        />
      </div>
      <button
        type="button"
        className="auth-submit"
        onClick={handleVerifyOTP}
        disabled={otpVerifying || otp.length !== 6}
      >
        {otpVerifying ? "Verifying..." : "Verify OTP"}
      </button>
      <div className="otp-actions">
        <button
          type="button"
          className="resend-btn"
          onClick={handleResendOTP}
          disabled={countdown > 0}
        >
          {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
        </button>
        <button
          type="button"
          className="change-email-btn"
          onClick={() => {
            setCurrentStep("email");
            setOtp("");
          }}
        >
          Change Email
        </button>
      </div>
    </div>
  );

  // Step 3a: Personal Details (for Mentors) - Step 3 of 6
  const renderPersonalDetailsStep = () => (
    <div className="personal-details-step">
      <div className="step-indicator">
        <div className="step-dot completed"></div>
        <div className="step-dot completed"></div>
        <div className="step-dot active"></div>
        <div className="step-dot"></div>
        <div className="step-dot"></div>
        <div className="step-dot"></div>
      </div>

      <h2>Personal Information</h2>
      <p>Enter your basic details</p>

      <div className="role-badge-display">
        Registering as: <strong>Mentor</strong>
      </div>

      <div className="verified-email">
        <span className="verified-icon">✓</span>
        <span>{formData.email}</span>
        <span className="verified-badge">Verified</span>
      </div>

      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="form-group">
        <label>Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min 8 characters, 1 capital letter, 1 number"
          required
          minLength={8}
        />
        {formData.password && (
          <div className={`password-strength ${isStrongPassword(formData.password) ? 'strong' : 'weak'}`}>
            {getPasswordStrengthMessage(formData.password)}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="back-btn"
          onClick={() => setCurrentStep("otp")}
        >
          ← Back
        </button>
        <button
          type="button"
          className="auth-submit"
          onClick={() => {
            if (!formData.name || !formData.password) {
              toast.error("Please fill all required fields");
              return;
            }
            if (!isStrongPassword(formData.password)) {
              toast.error("Password must be at least 8 characters with 1 uppercase letter and 1 number");
              return;
            }
            setCurrentStep("professional");
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );

  // Step 3b: Professional Details (for Mentors) - Step 4 of 6
  const renderProfessionalDetailsStep = () => (
    <div className="professional-details-step">
      <div className="step-indicator">
        <div className="step-dot completed"></div>
        <div className="step-dot completed"></div>
        <div className="step-dot completed"></div>
        <div className="step-dot active"></div>
        <div className="step-dot"></div>
        <div className="step-dot"></div>
      </div>

      <h2>Professional Information</h2>
      <p>Tell us about your placement</p>

      <div className="mentor-fields">
        <div className="mentor-fields-grid">
          <div className="form-group">
            <label>Company Placed At *</label>
            <input
              type="text"
              name="placedCompany"
              value={formData.placedCompany}
              onChange={handleChange}
              placeholder="e.g., Google, Microsoft"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Position *</label>
            <input
              type="text"
              name="placedPosition"
              value={formData.placedPosition}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Department *</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.departmentName} ({d.departmentCode})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Placement Year *</label>
            <input
              type="number"
              name="placementYear"
              value={formData.placementYear}
              onChange={handleChange}
              placeholder="2026"
              min="2020"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bangalore, Karnataka"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Your contact number"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="back-btn"
          onClick={() => setCurrentStep("personal")}
        >
          ← Back
        </button>
        <button
          type="button"
          className="auth-submit"
          onClick={() => {
            if (!formData.placedCompany || !formData.placedPosition || !formData.departmentId || 
                !formData.placementYear || !formData.location || !formData.phoneNumber) {
              toast.error("Please fill all required fields");
              return;
            }
            setCurrentStep("linkedin");
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );

  // Step 3c: LinkedIn & Privacy (for Mentors) - Step 5 of 6
  const renderLinkedInStep = () => (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="step-indicator">
        <div className="step-dot completed"></div>
        <div className="step-dot completed"></div>
        <div className="step-dot completed"></div>
        <div className="step-dot completed"></div>
        <div className="step-dot active"></div>
        <div className="step-dot"></div>
      </div>

      <h2>LinkedIn & Privacy</h2>
      <p>Final step - Connect your profile</p>

      <div className="form-group">
        <label>LinkedIn Profile *</label>
        <input
          type="url"
          name="linkedinProfile"
          value={formData.linkedinProfile}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/yourprofile"
          required
        />
      </div>

      <div className="form-group privacy-section">
        <label>Contact Details Visibility *</label>
        <p className="privacy-description">
          Choose who can see your phone number and email
        </p>
        <div className="radio-options">
          <label className="radio-option">
            <input
              type="radio"
              name="contactVisibility"
              value="PUBLIC"
              checked={formData.contactVisibility === "PUBLIC"}
              onChange={handleChange}
            />
            <span className="radio-label">
              <strong>Public</strong> - All users can see my contact details
            </span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="contactVisibility"
              value="ADMIN_ONLY"
              checked={formData.contactVisibility === "ADMIN_ONLY"}
              onChange={handleChange}
            />
            <span className="radio-label">
              <strong>Admin Only</strong> - Only admins can see my contact details
            </span>
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="back-btn"
          onClick={() => setCurrentStep("professional")}
        >
          ← Back
        </button>
        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </div>
    </form>
  );

  // Step 3: Registration Form
  const renderFormStep = () => (
    <form className="auth-form" onSubmit={handleSubmit}>
      {selectedRole === "STUDENT" && (
        <div className="step-indicator">
          <div className="step-dot completed"></div>
          <div className="step-dot completed"></div>
          <div className="step-dot completed"></div>
          <div className="step-dot active"></div>
        </div>
      )}

      {selectedRole === "STUDENT" && (
        <div className="verified-email">
          <span className="verified-icon">✓</span>
          <span>{formData.email}</span>
          <span className="verified-badge">Verified</span>
        </div>
      )}

      <div className="role-badge-display">
        Registering as:{" "}
        <strong>
          {selectedRole === "STUDENT" ? "Student" : "Mentor"}
        </strong>
      </div>

      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      {/* Mentors enter email here since they skip OTP */}
      {selectedRole === "MENTOR" && (
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
      )}

      <div className="form-group">
        <label>Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min 8 characters, 1 capital letter, 1 number"
          required
          minLength={8}
        />
        {formData.password && (
          <div className={`password-strength ${isStrongPassword(formData.password) ? 'strong' : 'weak'}`}>
            {getPasswordStrengthMessage(formData.password)}
          </div>
        )}
      </div>

      {selectedRole === "STUDENT" && (
        <div className="student-fields">
          <div className="form-group">
            <label>Department *</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.departmentName} ({d.departmentCode})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Expected Graduation Year *</label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              placeholder="e.g., 2025"
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 5}
              required
            />
          </div>
        </div>
      )}

      {selectedRole === "MENTOR" && (
        <div className="mentor-fields">
          <h4>Professional Details</h4>
          
          <div className="mentor-fields-grid">
            <div className="form-group">
              <label>Company Placed At *</label>
              <input
                type="text"
                name="placedCompany"
                value={formData.placedCompany}
                onChange={handleChange}
                placeholder="e.g., Google, Microsoft"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                name="placedPosition"
                value={formData.placedPosition}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Department *</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.departmentName} ({d.departmentCode})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Placement Year *</label>
              <input
                type="number"
                name="placementYear"
                value={formData.placementYear}
                onChange={handleChange}
                placeholder="2026"
                min="2020"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Bangalore, Karnataka"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Your contact number"
                required
              />
            </div>
            
            <div className="form-group mentor-field-full">
              <label>LinkedIn Profile *</label>
              <input
                type="url"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                required
              />
            </div>
          </div>

          <div className="form-group privacy-section">
            <label>Contact Details Visibility *</label>
            <p className="privacy-description">
              Choose who can see your phone number and email
            </p>
            <div className="radio-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="contactVisibility"
                  value="PUBLIC"
                  checked={formData.contactVisibility === "PUBLIC"}
                  onChange={handleChange}
                />
                <span className="radio-label">
                  <strong>Public</strong> - All users can see my contact
                  details
                </span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="contactVisibility"
                  value="ADMIN_ONLY"
                  checked={formData.contactVisibility === "ADMIN_ONLY"}
                  onChange={handleChange}
                />
                <span className="radio-label">
                  <strong>Admin Only</strong> - Only admins can see my
                  contact details
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="auth-submit" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      {selectedRole === "MENTOR" && (
        <button
          type="button"
          className="back-to-role-btn"
          onClick={() => {
            setCurrentStep("role");
            setSelectedRole(null);
            setEmailVerified(false);
          }}
        >
          ← Back to role selection
        </button>
      )}
    </form>
  );

  return (
    <div className="register-page">
      {/* Left Side - Image */}
      <div className="register-image-section">
        <div className="image-overlay"></div>
        <Link to="/" className="back-link">
          <FiArrowLeft /> Back to Home
        </Link>
        <div className="image-content">
          <div className="brand-logo">
            <img src="/logo.jpeg" alt="GCT Logo" className="brand-logo-img" />
            <span>PlaceTrack</span>
          </div>
          <h2>Join Our Placement Community</h2>
          <p>Connect with placed seniors, share experiences, and prepare together for your dream companies.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="register-form-section">
        <div className="register-form-container">
          {/* Mobile Logo - shown only on smaller screens */}
          <div className="mobile-logo">
            <Link to="/" className="mobile-logo-link">
              <img src="/logo.jpeg" alt="GCT Logo" className="mobile-logo-img" />
              <span>PlaceTrack</span>
            </Link>
          </div>
          <div className="form-header">
            <h1>Create Account</h1>
          </div>

          {currentStep === "role" && renderRoleStep()}
          {currentStep === "email" && renderEmailStep()}
          {currentStep === "otp" && renderOTPStep()}
          {currentStep === "personal" && renderPersonalDetailsStep()}
          {currentStep === "professional" && renderProfessionalDetailsStep()}
          {currentStep === "linkedin" && renderLinkedInStep()}
          {currentStep === "form" && renderFormStep()}

          <p className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
