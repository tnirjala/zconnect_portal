import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Add animation styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 0.1;
          transform: scale(1);
        }
        50% {
          opacity: 0.2;
          transform: scale(1.05);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    

    try {
      const res = await axios.post('http://localhost:5000/api/login', form);
      setMessage({ text: res.data.message, type: 'success' });

      // Store user data in localStorage
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }



      const role = res.data.user?.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'counselor') {
        navigate('/counselor/dashboard');
      } else if (role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/userdashboard');
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Login failed',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" 
         style={{ 
           background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/image/loginbg.jpg")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
           position: 'relative'
         }}>
      
      {/* Animated Background Illustration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
             style={{ 
               background: 'radial-gradient(circle, #AF5D73 0%, transparent 70%)',
               animation: 'float 6s ease-in-out infinite'
             }}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 animate-pulse"
             style={{ 
               background: 'radial-gradient(circle, #AF5D73 0%, transparent 70%)',
               animation: 'float 8s ease-in-out infinite reverse'
             }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
             style={{ 
               background: 'radial-gradient(circle, #AF5D73 0%, transparent 70%)',
               animation: 'pulse 4s ease-in-out infinite'
             }}></div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden"
             style={{
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
               animation: 'slideIn 0.8s ease-out'
             }}>
          {/* Header */}
          <div className="py-6 px-8 relative" style={{ backgroundColor: '#AF5D73' }}>
            <h2 className="text-2xl font-bold text-white text-center" style={{ animation: 'fadeInDown 0.8s ease-out' }}>
              Welcome Back
            </h2>
            {/* Curvy bottom line */}
            <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden">
              <div className="w-full h-full" 
                   style={{
                     background: 'radial-gradient(ellipse 50% 100% at 50% 0%, transparent 49%, #AF5D73 50%)',
                     transform: 'scaleY(-1)'
                   }}></div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 transition-all bg-white"
                  style={{ 
                    outline: 'none',
                    borderColor: '#d1d5db',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#AF5D73';
                    e.target.style.boxShadow = '0 0 0 3px rgba(175, 93, 115, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 transition-all bg-white"
                    style={{ 
                      outline: 'none',
                      borderColor: '#d1d5db',
                      animation: 'fadeInUp 0.8s ease-out 0.4s both'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#AF5D73';
                      e.target.style.boxShadow = '0 0 0 3px rgba(175, 93, 115, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-500 hover:text-[#AF5D73] transition-colors" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-500 hover:text-[#AF5D73] transition-colors" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-2" style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}>
                  <Link 
                    to="/forget-password" 
                    className="text-sm hover:underline transition-colors"
                    style={{ color: '#AF5D73' }}
                    onMouseOver={(e) => e.target.style.color = '#8B4A5A'}
                    onMouseOut={(e) => e.target.style.color = '#AF5D73'}
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Message */}
              {message.text && (
                <div className={`p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
                     style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex justify-center items-center"
                style={{
                  backgroundColor: '#AF5D73',
                  animation: 'fadeInUp 0.8s ease-out 0.8s both',
                  opacity: isLoading ? 0.8 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = '#8B4A5A';
                }}
                onMouseOut={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = '#AF5D73';
                }}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center" style={{ animation: 'fadeInUp 0.8s ease-out 1s both' }}>
              <span className="text-sm text-gray-500">New to our platform? </span>
              <Link
                to="/signup"
                className="text-sm font-semibold underline ml-1 transition-colors"
                style={{ color: '#AF5D73' }}
                onMouseOver={(e) => e.target.style.color = '#8B4A5A'}
                onMouseOut={(e) => e.target.style.color = '#AF5D73'}
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;