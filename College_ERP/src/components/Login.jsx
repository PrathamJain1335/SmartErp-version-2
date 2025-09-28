import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

// Components are loaded via routing, no need to import them here
import "../App.css";
import logo from "../assets/logo.png";
import background from "../assets/bg.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  
  // Demo mode: Check if we should auto-setup authentication
  useEffect(() => {
    const checkDemoMode = () => {
      // Check if user is trying to access a protected route but ended up on login
      const urlPath = window.location.hash || window.location.pathname;
      const isProtectedRoute = urlPath.includes('/student') || urlPath.includes('/faculty') || urlPath.includes('/admin');
      
      if (isProtectedRoute) {
        console.log('🔧 Login: Setting up demo authentication for protected route access');
        
        // Determine role from URL or default to student
        let demoRole = 'student';
        if (urlPath.includes('/faculty')) demoRole = 'faculty';
        if (urlPath.includes('/admin')) demoRole = 'admin';
        
        // Set up demo authentication
        const demoUsers = {
          student: {
            authToken: 'demo-student-auto-' + Date.now(),
            userRole: 'student',
            userId: 'JECRC-CSE-21-001',
            userProfile: {
              id: 'JECRC-CSE-21-001',
              name: 'Demo Student',
              fullName: 'Demo Student',
              email: 'demo.student@jecrc.edu',
              role: 'student',
              rollNo: 'JECRC-CSE-21-001',
              department: 'Computer Science Engineering',
              currentSemester: 6
            }
          },
          faculty: {
            authToken: 'demo-faculty-auto-' + Date.now(),
            userRole: 'faculty',
            userId: 'FAC001',
            userProfile: {
              id: 'FAC001',
              name: 'Dr. Demo Faculty',
              fullName: 'Dr. Demo Faculty',
              email: 'demo.faculty@jecrc.edu',
              role: 'faculty',
              department: 'Computer Science Department'
            }
          }
        };
        
        const userData = demoUsers[demoRole];
        if (userData) {
          // Set authentication data
          localStorage.setItem('authToken', userData.authToken);
          localStorage.setItem('userRole', userData.userRole);
          localStorage.setItem('userId', userData.userId);
          localStorage.setItem('userProfile', JSON.stringify(userData.userProfile));
          
          console.log(`✅ Auto-setup complete for ${demoRole}, redirecting...`);
          
          // Redirect to the appropriate portal
          setTimeout(() => {
            navigate(`/${demoRole}`);
          }, 100);
        }
      } else {
        // Regular login page visit - show demo quick access buttons
        console.log('🎆 Login page loaded - demo mode available');
      }
    };
    
    checkDemoMode();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.login({
        email,
        password,
        role
      });

      if (response.token) {
        setSuccess(`Login successful! Welcome ${response.user?.name || 'User'}`);
        // Small delay to show success message
        setTimeout(() => {
          navigate(`/${response.role}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.message.includes('Invalid email')) {
        errorMessage = 'Email not found. Please check your email address.';
      } else if (error.message.includes('Invalid password')) {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Using demo mode.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background" style={{ backgroundImage: `url(${background})` }}>
      <div className="overlay">
        <div className="login-container">
          <img src={logo} alt="JECRC University Logo" className="logo" />
          <h2 className="title">Log In</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Role Selection */}
            <select
              className="input-field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={{ marginBottom: '15px' }}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
            
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email Address"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            
            {/* Password Input */}
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword((v) => !v)}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                &#128065;
              </span>
            </div>
            
            {/* Success Message */}
            {success && (
              <div style={{
                color: '#22c55e',
                fontSize: '14px',
                textAlign: 'center',
                marginBottom: '10px',
                padding: '8px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '4px',
                animation: 'fadeIn 0.3s ease-in'
              }}>
                ✅ {success}
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div style={{
                color: '#ff4444',
                fontSize: '14px',
                textAlign: 'center',
                marginBottom: '10px',
                padding: '8px',
                backgroundColor: '#fff2f2',
                border: '1px solid #ffcccc',
                borderRadius: '4px',
                animation: 'shake 0.5s ease-in-out'
              }}>
                ❌ {error}
              </div>
            )}
            
            {/* Login Button */}
            <button 
              type="submit" 
              className="login-button"
              disabled={loading || success}
              style={{
                opacity: loading || success ? 0.8 : 1,
                cursor: loading || success ? 'not-allowed' : 'pointer',
                backgroundColor: success ? '#22c55e' : (loading ? '#6b7280' : ''),
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                  Logging in...
                </span>
              ) : success ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  ✓ Success! Redirecting...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>
          
          {/* Demo Quick Access Buttons */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              type="button"
              onClick={() => {
                console.log('🚀 Quick demo access: Student');
                localStorage.setItem('authToken', 'demo-student-quick-' + Date.now());
                localStorage.setItem('userRole', 'student');
                localStorage.setItem('userId', 'JECRC-CSE-21-001');
                localStorage.setItem('userProfile', JSON.stringify({
                  id: 'JECRC-CSE-21-001',
                  name: 'Demo Student',
                  role: 'student',
                  email: 'demo.student@jecrc.edu'
                }));
                navigate('/student');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              📚 Demo Student
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('🚀 Quick demo access: Faculty');
                localStorage.setItem('authToken', 'demo-faculty-quick-' + Date.now());
                localStorage.setItem('userRole', 'faculty');
                localStorage.setItem('userId', 'FAC001');
                localStorage.setItem('userProfile', JSON.stringify({
                  id: 'FAC001',
                  name: 'Dr. Demo Faculty',
                  role: 'faculty',
                  email: 'demo.faculty@jecrc.edu'
                }));
                navigate('/faculty');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              👨‍🏫 Demo Faculty
            </button>
          </div>
          
          <div className="forgot">Forgot Password? <a href="#">Click here</a></div>
          
          {/* Demo Credentials Info */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            fontSize: '12px',
            color: '#6c757d'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#495057' }}>Demo Credentials:</div>
            <div><strong>Student (Email):</strong> suresh.shah.21.1@jecrc.ac.in / student123</div>
            <div><strong>Student (Roll No):</strong> JECRC-CSE-21-001 / student123</div>
            <div><strong>Faculty:</strong> kavya.sharma1@jecrc.ac.in / faculty123</div>
            <div><strong>Admin:</strong> admin@jecrc.ac.in / admin123</div>
          </div>
          
          <div className="address">
            Plot No. IS-2036 to IS-2039 Ramchandrapura Industrial Area,
            Sitapura, Vidhani, Jaipur, Rajasthan 303905
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <LoginPage />;
}
