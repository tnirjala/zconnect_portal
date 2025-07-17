import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  Calendar,
  FileText,
  MessageSquare,
  LayoutDashboard,
  User,
  LogOut,
  CalendarPlus,
  UserCheck,
  ClipboardList,
  Smile,
} from 'lucide-react';

const CounselorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const counselorData = { name: 'Counselor User', role: 'counselor' };

  // Detect active menu from current pathname
  const path = location.pathname;

  let activeMenu = 'dashboard';
  if (path.includes('/counselor/dashboard/sessions')) activeMenu = 'sessions';
  else if (path.includes('/counselor/dashboard/sessions')) activeMenu = 'participants';
  else if (path.includes('/counselor/dashboard/user-moods')) activeMenu = 'userMoods';

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/counselor/dashboard' },
    { key: 'sessions', label: 'Create Session', icon: <CalendarPlus className="w-5 h-5" />, path: '/counselor/dashboard/sessions' },
    { key: 'participants', label: 'Participants', icon: <UserCheck className="w-5 h-5" />, path: '/counselor/dashboard/sessions' },
    { key: 'userMoods', label: 'User Moods', icon: <Smile className="w-5 h-5" />, path: '/counselor/dashboard/user-moods' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 50%, #fce7f3 100%)',
          borderRight: '2px solid #f9a8d4',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          boxSizing: 'border-box',
          overflowY: 'auto',
          zIndex: 100,
          boxShadow: '4px 0 15px rgba(236, 72, 153, 0.1)',
        }}
      >
        {/* User info */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '1.5rem',
          padding: '1rem',
          borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)',
          border: '1px solid #f9a8d4',
        }}>
          <User style={{ color: '#be185d' }} />
          <div style={{ marginLeft: '0.75rem' }}>
            <h2 style={{ 
              fontWeight: 'bold', 
              fontSize: '1.125rem', 
              background: 'linear-gradient(135deg, #be185d 0%, #e11d48 50%, #be185d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {counselorData.name}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#a21caf' }}>{counselorData.role}</p>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flexGrow: 1 }}>
          {menuItems.map(({ key, icon, label, path }) => (
            <button
              key={key}
              onClick={() => navigate(path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                background: activeMenu === key 
                  ? 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)' 
                  : 'transparent',
                color: activeMenu === key ? 'white' : '#be185d',
                fontWeight: activeMenu === key ? '600' : '500',
                border: activeMenu === key ? '2px solid #f472b6' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                gap: '0.75rem',
                transition: 'all 0.3s ease',
                boxShadow: activeMenu === key ? '0 4px 15px rgba(244, 114, 182, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== key) {
                  e.target.style.background = 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)';
                  e.target.style.border = '2px solid #f9a8d4';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== key) {
                  e.target.style.background = 'transparent';
                  e.target.style.border = '2px solid transparent';
                }
              }}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: 'auto',
            background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            border: '2px solid #be185d',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(190, 24, 93, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #a21caf 0%, #dc2626 100%)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* Main content area */}
      <main
        style={{
          marginLeft: '250px',
          padding: '1rem',
          overflowY: 'auto',
          height: '100vh',
          flexGrow: 1,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 50%, #fce7f3 100%)',
        }}
      >
        {/* Dashboard Content - Only show on dashboard route */}
        {location.pathname === '/counselor/dashboard' ? (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            {/* Welcome Section */}
            <div style={{
              background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)',
              padding: '2rem',
              borderRadius: '1rem',
              marginBottom: '2rem',
              border: '2px solid #f9a8d4',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.1)',
            }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #be185d 0%, #e11d48 50%, #be185d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                textAlign: 'center',
              }}>
                Welcome, {counselorData.name}! 🌸
              </h1>
              <p style={{
                fontSize: '1.25rem',
                color: '#a21caf',
                textAlign: 'center',
                lineHeight: '1.6',
                marginBottom: '1.5rem',
              }}>
                Your comprehensive counseling management platform is ready to help you support your clients effectively.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}>
                  ✨ Manage Sessions
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}>
                  📊 Track Moods
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}>
                  👥 Monitor Participants
                </div>
              </div>
            </div>

            {/* How to Use Section */}
            <div style={{
              background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
              padding: '2rem',
              borderRadius: '1rem',
              marginBottom: '2rem',
              border: '2px solid #f9a8d4',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.1)',
            }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #be185d 0%, #e11d48 50%, #be185d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}>
                How to Use Your Dashboard
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}>
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #f9a8d4',
                  boxShadow: '0 4px 15px rgba(244, 114, 182, 0.1)',
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#be185d',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <CalendarPlus className="w-5 h-5" />
                    Create Sessions
                  </h3>
                  <p style={{ color: '#a21caf', lineHeight: '1.6' }}>
                    Schedule and organize counseling sessions with your clients. Set dates, times, and add session details to keep everything organized.
                  </p>
                </div>

                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #f9a8d4',
                  boxShadow: '0 4px 15px rgba(244, 114, 182, 0.1)',
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#be185d',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <UserCheck className="w-5 h-5" />
                    Manage Participants
                  </h3>
                  <p style={{ color: '#a21caf', lineHeight: '1.6' }}>
                    View and manage session participants. Track attendance, add notes, and maintain comprehensive records of all participants.
                  </p>
                </div>

                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #f9a8d4',
                  boxShadow: '0 4px 15px rgba(244, 114, 182, 0.1)',
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#be185d',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <Smile className="w-5 h-5" />
                    Monitor User Moods
                  </h3>
                  <p style={{ color: '#a21caf', lineHeight: '1.6' }}>
                    Track and analyze your clients' mood patterns over time. Gain insights into their emotional well-being and progress.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips Section */}
            <div style={{
              background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #f9a8d4',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.1)',
            }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #be185d 0%, #e11d48 50%, #be185d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}>
                Quick Links
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
              }}>
                <button
                  onClick={() => navigate('/counselor/dashboard/user-moods')}
                  style={{
                    background: 'white',
                    padding: '1.25rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #f9a8d4',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(244, 114, 182, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(244, 114, 182, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(244, 114, 182, 0.1)';
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#be185d', marginBottom: '0.5rem' }}>
                    User Moods
                  </h4>
                  <p style={{ color: '#a21caf', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Monitor and analyze client mood patterns
                  </p>
                </button>

                <button
                  onClick={() => navigate('/counselor/dashboard/sessions')}
                  style={{
                    background: 'white',
                    padding: '1.25rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #f9a8d4',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(244, 114, 182, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(244, 114, 182, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(244, 114, 182, 0.1)';
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#be185d', marginBottom: '0.5rem' }}>
                    Create Session
                  </h4>
                  <p style={{ color: '#a21caf', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Schedule new counseling sessions
                  </p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* This renders the matching child route component */
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default CounselorDashboard;