import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ZConnectLanding from './components/ZConnectLanding';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgetPassword from './components/ForgetPassword';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageUsers from './components/admin/ManageUsers';
import StaffDashboard from './components/staff/StaffDashboard';
import Workshops from './components/staff/Workshops';
import WorkshopCategories from './components/staff/WorkshopCategories';
import ManageWorkshops from './components/admin/ManageWorkshops';
import WorkshopParticipants from './components/admin/WorkshopParticipants';
import UserDashboard from './components/user/UserDashboard';
import CounselorDashboard from './components/counselor/CounselorDashboard';
import CreateSession from './components/counselor/CreateSession';
import ViewParticipants from './components/staff/ViewParticipants';
import ManageSessions from './components/admin/ManageSessions';
import SessionParticipants from './components/admin/SessionParticipants';
import UserMoodList from './components/counselor/UserMoodList';
import CBTResources from './components/staff/CBTResources';
import CBTResourcesAdmin from './components/admin/CBTResourcesAdmin';
import CBTResourcesUser from './components/user/CBTResourcesUser';
import Contact from './components/Contact';
import Programs from './components/Programs';
import ContactMessages from './components/staff/ContactMessages';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ZConnectLanding />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/programs" element={<Programs />} />

        {/* Admin Routes with Nested Outlet Rendering */}
       <Route path="/admin" element={<AdminDashboard />}>
  <Route index element={<Navigate to="dashboard" replace />} />
  {/* <Route path="dashboard" element={<AdminDashboardStats />} /> */}
  <Route path="dashboard" element={<div />} />
  <Route path="users" element={<ManageUsers />} />
  <Route path="workshops" element={<ManageWorkshops/>} />
  <Route path="participants" element={<WorkshopParticipants/>} />
  <Route path="session-review" element={<ManageSessions/>} />
   <Route path="session-participants" element={<SessionParticipants/>} />
   <Route path="/admin/cbt-resources" element={<CBTResourcesAdmin />} />
</Route>

        {/* Staff Routes with Nested Routing */}
        <Route path="/staff" element={<StaffDashboard />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<h2>Welcome to Staff Dashboard</h2>} />
          <Route path="create-categories" element={<WorkshopCategories />} />
          <Route path="create-workshop" element={<Workshops />} />
          <Route path="view-participants" element={<ViewParticipants/>} /> 
          <Route path="contact-messages" element={<ContactMessages />} />
          <Route path="/staff/cbt-resources" element={<CBTResources />} />
        </Route>

       {/* User Dashboard */}
        <Route path="/userdashboard" element={<UserDashboard/>} />
        <Route path="/cbt-resources" element={<CBTResourcesUser />} />

        {/* Counselor Routes */}
        <Route path="/counselor" element={<CounselorDashboard/>}>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<h2>Welcome Counselor</h2>} />
  <Route path="dashboard/sessions" element={<CreateSession/>} />
  <Route path="clients" element={<div>Clients Page</div>} />
  <Route path="dashboard/participants" element={SessionParticipants}/> 
  <Route path="session-notes" element={<div>Session Notes Page</div>} />
  <Route path="dashboard/user-moods" element={<UserMoodList />} />
</Route>

        {/* Optional: 404 Not Found Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
