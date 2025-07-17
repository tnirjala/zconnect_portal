import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  User,
  LogOut,
  CalendarPlus,
  Mail,
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
} from 'lucide-react';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [dashboardStats, setDashboardStats] = useState({
    totalCategories: 0,
    totalWorkshops: 0,
    pendingWorkshops: 0,
    approvedWorkshops: 0,
    rejectedWorkshops: 0,
    totalParticipants: 0,
  });

  const [loading, setLoading] = useState(true);
  const staffData = JSON.parse(localStorage.getItem('user')) || { name: 'Staff User', role: 'staff' };

  const path = location.pathname;

  let activeMenu = 'dashboard';
  if (path.includes('/staff/create-categories')) activeMenu = 'createCategories';
  else if (path.includes('/staff/cbt-resources')) activeMenu = 'cbtResources';
  else if (path.includes('/staff/create-workshop')) activeMenu = 'createWorkshop';
  else if (path.includes('/staff/view-participants')) activeMenu = 'viewWorkshop';
  else if (path.includes('/staff/contact-messages')) activeMenu = 'contactMessages';

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/staff/dashboard' },
    { key: 'createCategories', label: 'Create Categories', icon: <Plus className="w-5 h-5" />, path: '/staff/create-categories' },
    { key: 'createWorkshop', label: 'Create Workshop', icon: <CalendarPlus className="w-5 h-5" />, path: '/staff/create-workshop' },
    { key: 'viewWorkshop', label: 'View Participants', icon: <Users className="w-5 h-5" />, path: '/staff/view-participants' },
    { key: 'contactMessages', label: 'Contact Messages', icon: <Mail className="w-5 h-5" />, path: '/staff/contact-messages' },
    { key: 'cbtResources', label: 'CBT Resources', icon: <MessageSquare className="w-5 h-5" />, path: '/staff/cbt-resources' },
  ];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/staff/dashboard/stats');
        if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
        const data = await res.json();
        setDashboardStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeMenu === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeMenu]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              value
            )}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => navigate('/staff/create-categories')}
          className="flex items-center gap-3 w-full p-3 text-left bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Category</span>
        </button>
        <button
          onClick={() => navigate('/staff/create-workshop')}
          className="flex items-center gap-3 w-full p-3 text-left bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
        >
          <CalendarPlus className="w-5 h-5" />
          <span>Create New Workshop</span>
        </button>
        <button
          onClick={() => navigate('/staff/view-participants')}
          className="flex items-center gap-3 w-full p-3 text-left bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
        >
          <Users className="w-5 h-5" />
          <span>View Participants</span>
        </button>
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {staffData.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Categories"
          value={dashboardStats.totalCategories}
          icon={<BookOpen className="w-6 h-6" />}
          color="text-blue-600"
          subtitle="Workshop categories"
        />
        <StatCard
          title="Total Workshops"
          value={dashboardStats.totalWorkshops}
          icon={<Calendar className="w-6 h-6" />}
          color="text-green-600"
          subtitle="All workshops"
        />
        <StatCard
          title="Pending Approval"
          value={dashboardStats.pendingWorkshops}
          icon={<Clock className="w-6 h-6" />}
          color="text-yellow-600"
          subtitle="Awaiting review"
        />
        <StatCard
          title="Total Participants"
          value={dashboardStats.totalParticipants}
          icon={<Users className="w-6 h-6" />}
          color="text-purple-600"
          subtitle="Across all workshops"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Approved Workshops"
          value={dashboardStats.approvedWorkshops}
          icon={<CheckCircle className="w-6 h-6" />}
          color="text-green-600"
          subtitle="Live sessions"
        />
        <StatCard
          title="Rejected Workshops"
          value={dashboardStats.rejectedWorkshops}
          icon={<XCircle className="w-6 h-6" />}
          color="text-red-600"
          subtitle="Requires revisions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 bottom-0 z-50 shadow-sm">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-gray-800">{staffData.name}</h2>
              <p className="text-sm text-gray-600 capitalize">{staffData.role}</p>
            </div>
          </div>

          <nav className="flex-1">
            <div className="space-y-1">
              {menuItems.map(({ key, icon, label, path }) => (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeMenu === key
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {icon}
                  <span className="ml-3">{label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="p-6">{path === '/staff/dashboard' ? <DashboardContent /> : <Outlet />}</div>
      </main>
    </div>
  );
};

export default StaffDashboard;
