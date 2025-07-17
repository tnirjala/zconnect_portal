import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, message } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin/dashboard') setSelectedKey('dashboard');
    else if (path.startsWith('/admin/users')) setSelectedKey('users');
    else if (path.startsWith('/admin/workshops')) setSelectedKey('workshops');
    else if (path.startsWith('/admin/participants')) setSelectedKey('participants');
    else if (path.startsWith('/admin/session-review')) setSelectedKey('session-review');
    else if (path.startsWith('/admin/session-participants')) setSelectedKey('session-participants');
    else if (path.startsWith('/admin/cbt-resources')) setSelectedKey('cbt-resources');
    else setSelectedKey('');
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    message.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Manage Users</Link>,
    },
    {
      key: 'workshops',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/workshops">Workshops</Link>,
    },
    {
      key: 'participants',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/participants">Participants</Link>,
    },
    {
      key: 'session-review',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/session-review">Session Review</Link>,
    },
    {
      key: 'cbt-resources',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/cbt-resources">CBT Resources</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/session-participants">Session Participants</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
      style: {
        marginTop: 'auto',
        borderTop: '1px solid #AF5D73',
      },
    },
  ];

  // Simplified Dashboard content component
  const DashboardContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin!</h1>
            <p className="text-gray-600 mt-1">Manage your platform efficiently from this central dashboard.</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <UserOutlined />, label: 'Add User', color: 'bg-purple-500', route: '/admin/users' },
              { icon: <BookOutlined />, label: 'New Workshop', color: 'bg-blue-500', route: '/admin/workshops' },
              { icon: <FileTextOutlined />, label: 'CBT Resource', color: 'bg-green-500', route: '/admin/cbt-resources' },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.route)}
                className={`${action.color} text-white p-4 rounded-xl hover:opacity-90 transition-opacity flex flex-col items-center space-y-2`}
              >
                <div className="text-2xl">{action.icon}</div>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-6">Follow these steps to get the most out of your admin dashboard:</p>
          
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Manage Users",
                description: "Add, edit, or remove users from your system",
                action: "Go to Users",
                route: "/admin/users"
              },
              {
                step: 3,
                title: "Add CBT Resources",
                description: "Upload and organize CBT resources for participants",
                action: "Add Resources",
                route: "/admin/cbt-resources"
              },
              {
                step: 4,
                title: "Review Sessions",
                description: "Monitor and review session activities and participant progress",
                action: "Review Sessions",
                route: "/admin/session-review"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <button
                    onClick={() => navigate(item.route)}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm"
                  >
                    {item.action}
                    <ArrowRightOutlined className="ml-1 text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircleOutlined className="text-green-500 text-2xl mb-2" />
              <p className="text-sm text-green-700 font-medium">All Systems Operational</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CheckCircleOutlined className="text-blue-500 text-2xl mb-2" />
              <p className="text-sm text-blue-700 font-medium">Database Connected</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <CheckCircleOutlined className="text-purple-500 text-2xl mb-2" />
              <p className="text-sm text-purple-700 font-medium">Services Running</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        className="bg-gradient-to-b from-slate-50 to-blue-50 fixed h-screen left-0 shadow-lg"
        style={{
          position: 'fixed',
          height: '100vh',
          left: 0,
          boxShadow: '2px 0 16px 0 rgba(80, 80, 180, 0.10)',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
        }}
      >
        <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'justify-start px-6'} bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl`}>
          {collapsed ? 'AP' : 'Admin Panel'}
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          className="bg-transparent border-none mt-3"
          items={menuItems.map(({ onClick, ...item }) => ({
            ...item,
            onClick,
            className: 'rounded-3xl mx-2 my-1 hover:bg-purple-50 transition-all duration-200',
          }))}
          onClick={({ key }) => {
            if (key === 'logout') handleLogout();
            else setSelectedKey(key);
          }}
        />
      </Sider>

      <Layout className={`${collapsed ? 'ml-20' : 'ml-52'} transition-all duration-300 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50`}>
        <Content>{selectedKey === 'dashboard' ? <DashboardContent /> : <Outlet />}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;