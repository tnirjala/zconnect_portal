import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  MessageSquare,
  Calendar,
  UserPlus,
  MessageCircle,
  FileText,
  Home,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Shield,
  HeartHandshake,
  Scale,
  HandHeart,
  User,
  Edit2,
  Heart,
  Gamepad2,
  Brain,
  Sparkles,
  Zap,
  Star,
  Play
} from 'lucide-react';
import { FaHandsHelping, FaPeace } from 'react-icons/fa';
import RegisterWorkshop from './RegisterWorkshop';
import UserSessions from './UserSessions';
import TherapeuticGames from './TherapeuticGames';
import EditProfile from './EditProfile';
import MoodTracker from './MoodTracker';
import CBTResourcesUser from './CBTResourcesUser'; 

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [moodCheckInterval, setMoodCheckInterval] = useState(null);
  const [hoveredBox, setHoveredBox] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) navigate('/ZConnectLanding');
    try {
      const userData = JSON.parse(loggedInUser);
      setUser(userData);
      startMoodChecking(userData);
    } catch {
      navigate('/');
    }
    return () => {
      if (moodCheckInterval) clearInterval(moodCheckInterval);
    };
  }, [navigate]);

  const startMoodChecking = (userData) => {
    checkMoodStatus(userData);
    const interval = setInterval(() => checkMoodStatus(userData), 60 * 60 * 1000);
    setMoodCheckInterval(interval);
  };

  const checkMoodStatus = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/mood/check`, {
        headers: { 'user-id': userData?.id?.toString() }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.canLogMood) setShowMoodTracker(true);
      }
    } catch (error) {
      console.error('Error checking mood status:', error);
    }
  };

  const handleLogout = () => {
    if (moodCheckInterval) clearInterval(moodCheckInterval);
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  const handleCloseMoodTracker = () => setShowMoodTracker(false);

  const renderSidebar = () => (
    <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} md:block w-64 fixed md:static inset-0 z-40 border-r`}
         style={{ 
           backgroundColor: 'rgba(255, 255, 255, 0.95)', 
           borderColor: 'rgba(186, 80, 102, 0.2)',
           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
         }}>
      <div className="p-4 border-b flex justify-between items-center md:block"
           style={{ 
             backgroundColor: 'rgba(186, 80, 102, 0.1)',
             borderColor: 'rgba(186, 80, 102, 0.2)'
           }}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                 style={{ 
                   backgroundColor: 'rgba(186, 80, 102, 0.1)',
                   borderColor: 'rgba(186, 80, 102, 0.3)'
                 }}>
              <User size={20} style={{ color: '#BA5066' }} />
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full p-1"
                 style={{ backgroundColor: '#BA5066' }}>
              <HandHeart size={14} className="text-white" />
            </div>
          </div>
          <div>
            <p className="font-medium flex items-center space-x-2" style={{ color: '#BA5066' }}>
              <span>Welcome,</span>
              <button onClick={() => { setActiveTab('edit-profile'); setMobileSidebarOpen(false); }} 
                      title="Edit Profile" 
                      className="transition-colors hover:opacity-80"
                      style={{ color: '#BA5066' }}>
                <Edit2 size={16} />
              </button>
            </p>
            <p className="font-bold" style={{ color: '#8B3A4A' }}>{user?.name?.split(' ')[0]}</p>
          </div>
        </div>
        <button onClick={() => setMobileSidebarOpen(false)} 
                className="md:hidden p-1 rounded-md hover:bg-opacity-20 transition-colors"
                style={{ 
                  color: '#BA5066',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(186, 80, 102, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
          <X size={20} />
        </button>
      </div>

      <div className="p-4 border-b"
           style={{ 
             backgroundColor: 'rgba(186, 80, 102, 0.1)',
             borderColor: 'rgba(186, 80, 102, 0.2)'
           }}>
        <div className="flex items-center space-x-2" style={{ color: '#8B3A4A' }}>
          <FaPeace className="text-lg" />
          <p className="text-sm font-medium">Building peaceful communities together</p>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {[
          { label: 'Dashboard', icon: <Home size={18} />, key: 'dashboard' },
          { label: 'Workshops', icon: <Calendar size={18} />, key: 'workshops' },
          { label: 'Sessions', icon: <Calendar size={18} />, key: 'sessions' },
          { label: 'Games', icon: <Calendar size={18} />, key: 'games' },
          { label: 'CBT Resources', icon: <FileText size={18} />, key: 'cbt-resources' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-md transition-colors ${
              activeTab === tab.key ? 'font-semibold' : ''
            }`}
            style={{
              backgroundColor: activeTab === tab.key ? 'rgba(186, 80, 102, 0.1)' : 'transparent',
              color: activeTab === tab.key ? '#8B3A4A' : '#BA5066'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.key) {
                e.target.style.backgroundColor = 'rgba(186, 80, 102, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.key) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}

        <button onClick={() => setShowMoodTracker(true)} 
                className="w-full flex items-center space-x-3 p-3 rounded-md transition-colors"
                style={{ color: '#BA5066' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(186, 80, 102, 0.05)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
          <Heart size={18} style={{ color: '#BA5066' }} />
          <span>Log Mood</span>
        </button>

        {/* Animated Feature Boxes */}
        <div className="pt-4 space-y-3">
          {/* Play Games Box */}
          <div
            className="relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
              boxShadow: hoveredBox === 'games' ? '0 8px 25px rgba(255, 107, 107, 0.4)' : '0 4px 15px rgba(255, 107, 107, 0.2)'
            }}
            onMouseEnter={() => setHoveredBox('games')}
            onMouseLeave={() => setHoveredBox(null)}
            onClick={() => { setActiveTab('games'); setMobileSidebarOpen(false); }}
          >
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <div className="relative p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Gamepad2 size={24} className="text-white" />
                  <div className={`absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full ${hoveredBox === 'games' ? 'animate-pulse' : ''}`}></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Play Games</h3>
                  <p className="text-white text-xs opacity-90">Therapeutic Fun!</p>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-white rounded-full"
                    style={{
                      animation: hoveredBox === 'games' ? `pulse 1s ease-in-out ${i * 0.2}s infinite` : 'none'
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white bg-opacity-20 rounded-tl-full"></div>
          </div>

          {/* CBT Resources Box */}
          <div
            className="relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              boxShadow: hoveredBox === 'cbt' ? '0 8px 25px rgba(78, 205, 196, 0.4)' : '0 4px 15px rgba(78, 205, 196, 0.2)'
            }}
            onMouseEnter={() => setHoveredBox('cbt')}
            onMouseLeave={() => setHoveredBox(null)}
            onClick={() => { setActiveTab('cbt-resources'); setMobileSidebarOpen(false); }}
          >
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <div className="relative p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Brain size={24} className="text-white" />
                  <div className={`absolute -top-1 -right-1 ${hoveredBox === 'cbt' ? 'animate-spin' : ''}`}>
                    <Sparkles size={12} className="text-yellow-300" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">CBT Resources</h3>
                  <p className="text-white text-xs opacity-90">Mind Tools</p>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-white rounded-full"
                    style={{
                      animation: hoveredBox === 'cbt' ? `bounce 1s ease-in-out ${i * 0.1}s infinite` : 'none'
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-6 h-6 bg-white bg-opacity-20 rounded-bl-full"></div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t" style={{ borderColor: 'rgba(186, 80, 102, 0.2)' }}>
          <button onClick={handleLogout} 
                  className="w-full flex items-center space-x-3 p-3 rounded-md transition-colors"
                  style={{ color: '#BA5066' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(186, 80, 102, 0.05)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
            <LogOut size={18} style={{ color: '#BA5066' }} />
            <span>Log Out</span>
          </button>
        </div>
      </nav>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'workshops': return <RegisterWorkshop />;
      case 'sessions': return <UserSessions />;
      case 'games': return <TherapeuticGames />;
      case 'edit-profile': return <EditProfile user={user} setUser={setUser} />;
      case 'cbt-resources': return <CBTResourcesUser />;
      default:
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg shadow-md border"
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.95)',
                   borderColor: 'rgba(186, 80, 102, 0.2)'
                 }}>
              <div className="flex items-center space-x-3 mb-6">
                <Shield style={{ color: '#BA5066' }} size={24} />
                <h2 className="text-2xl font-bold" style={{ color: '#8B3A4A' }}>Youth Violence Prevention Dashboard</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    icon: <FaHandsHelping style={{ color: '#BA5066' }} className="text-xl" />,
                    title: 'Community Engagement',
                    text: 'Join our workshops to learn conflict resolution skills and build stronger communities.'
                  },
                  {
                    icon: <HeartHandshake style={{ color: '#BA5066' }} size={20} />,
                    title: 'Support Networks',
                    text: 'Connect with mentors and peers who can provide guidance and support.'
                  },
                  {
                    icon: <Scale style={{ color: '#BA5066' }} size={20} />,
                    title: 'Conflict Resolution',
                    text: 'Learn peaceful ways to resolve conflicts and prevent violent situations.'
                  }
                ].map((card, i) => (
                  <div key={i} 
                       className="p-4 rounded-lg border shadow-sm"
                       style={{ 
                         backgroundColor: 'rgba(255, 255, 255, 0.95)',
                         borderColor: 'rgba(186, 80, 102, 0.2)'
                       }}>
                    <div className="flex items-center space-x-3">
                      {card.icon}
                      <h3 className="font-semibold" style={{ color: '#8B3A4A' }}>{card.title}</h3>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: '#BA5066' }}>{card.text}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-lg border"
                   style={{ 
                     background: 'linear-gradient(to right, rgba(186, 80, 102, 0.1), rgba(186, 80, 102, 0.05))',
                     borderColor: 'rgba(186, 80, 102, 0.2)'
                   }}>
                <div className="flex items-center space-x-3 mb-4">
                  <Heart style={{ color: '#BA5066' }} size={24} />
                  <h3 className="text-xl font-bold" style={{ color: '#8B3A4A' }}>Daily Wellness Check</h3>
                </div>
                <p className="mb-4" style={{ color: '#BA5066' }}>
                  Taking care of your mental health is just as important as your physical health. 
                  Track your daily mood to help us provide better support and resources.
                </p>
                <button
                  onClick={() => setShowMoodTracker(true)}
                  className="px-6 py-3 rounded-md font-medium transition-colors flex items-center space-x-2 text-white hover:opacity-90"
                  style={{ backgroundColor: '#BA5066' }}
                >
                  <Heart size={18} />
                  <span>Log Today's Mood</span>
                </button>
              </div>
            </div>

            {/* Enhanced Feature Boxes for Main Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Play Games Feature Box */}
              <div
                className="relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:rotate-1"
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 50%, #FFB6B6 100%)',
                  boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
                  minHeight: '200px'
                }}
                onClick={() => setActiveTab('games')}
                onMouseEnter={() => setHoveredBox('games-main')}
                onMouseLeave={() => setHoveredBox(null)}
              >
                <div className="absolute inset-0 bg-white opacity-10"></div>
                <div className="absolute top-4 right-4">
                  <div className={`w-4 h-4 bg-yellow-300 rounded-full ${hoveredBox === 'games-main' ? 'animate-ping' : ''}`}></div>
                </div>
                <div className="relative p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <Gamepad2 size={32} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Play Games</h3>
                        <p className="text-white text-sm opacity-90">Therapeutic & Fun Activities</p>
                      </div>
                    </div>
                    <p className="text-white text-sm mb-4 opacity-90">
                      Engage in interactive therapeutic games designed to improve your mental wellness while having fun!
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`text-yellow-300 ${hoveredBox === 'games-main' ? 'animate-pulse' : ''}`}
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-white">
                      <Play size={16} />
                      <span className="text-sm font-medium">Start Playing</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-30">
                  <div
                    className="h-full bg-yellow-300 transition-all duration-1000"
                    style={{ width: hoveredBox === 'games-main' ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>

              {/* CBT Resources Feature Box */}
              <div
                className="relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1"
                style={{
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 50%, #5FB3AC 100%)',
                  boxShadow: '0 10px 30px rgba(78, 205, 196, 0.3)',
                  minHeight: '200px'
                }}
                onClick={() => setActiveTab('cbt-resources')}
                onMouseEnter={() => setHoveredBox('cbt-main')}
                onMouseLeave={() => setHoveredBox(null)}
              >
                <div className="absolute inset-0 bg-white opacity-10"></div>
                <div className="absolute top-4 right-4">
                  <div className={`${hoveredBox === 'cbt-main' ? 'animate-spin' : ''}`}>
                    <Sparkles size={24} className="text-yellow-300" />
                  </div>
                </div>
                <div className="relative p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <Brain size={32} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">CBT Resources</h3>
                        <p className="text-white text-sm opacity-90">Cognitive Behavioral Tools</p>
                      </div>
                    </div>
                    <p className="text-white text-sm mb-4 opacity-90">
                      Access powerful CBT techniques and resources to improve your mental health and thought patterns.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-white rounded-full"
                          style={{
                            animation: hoveredBox === 'cbt-main' ? `bounce 1s ease-in-out ${i * 0.1}s infinite` : 'none'
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-white">
                      <Zap size={16} />
                      <span className="text-sm font-medium">Explore Tools</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-30">
                  <div
                    className="h-full bg-yellow-300 transition-all duration-1000"
                    style={{ width: hoveredBox === 'cbt-main' ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen"
           style={{ backgroundColor: 'rgba(186, 80, 102, 0.1)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
             style={{ borderColor: '#BA5066' }}></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'rgba(186, 80, 102, 0.1)' }}>
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md shadow-sm"
        style={{ 
          backgroundColor: 'rgba(186, 80, 102, 0.1)',
          color: '#BA5066'
        }}
      >
        <Menu size={20} />
      </button>

      {renderSidebar()}

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {showMoodTracker && (
        <MoodTracker user={user} onClose={handleCloseMoodTracker} />
      )}
    </div>
  );
};

export default UserDashboard;