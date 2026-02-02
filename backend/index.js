const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


// Initialize Express app FIRST
const app = express(); 

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files for profile pictures
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS for your React app
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Import routes AFTER app is initialized
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const workshopRoutes = require('./routes/workshops');
const categoriesRoutes = require('./routes/categories');
const sessionRoutes = require('./routes/sessions');
const userRoutes = require('./routes/userProfiles');
const counselorRoutes = require('./routes/counselor');  
const cbtResourcesRouter = require('./routes/cbtResources');
const contactRoutes = require('./routes/contact');
const staffDashboardRoutes = require('./routes/staffDashboard');


// Mount the routes
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/workshops', workshopRoutes); 
app.use('/api/sessions', sessionRoutes);
app.use('/api/user', userRoutes);
app.use('/api', counselorRoutes);  
app.use('/api/cbt-resources', cbtResourcesRouter);
app.use('/api/contact', contactRoutes);
app.use('/api/staff', staffDashboardRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});

// const path = require('path');

// Serve frontend in production
// const frontendPath = path.join(__dirname, '../zconnect_portal/build');
// app.use(express.static(frontendPath));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });
