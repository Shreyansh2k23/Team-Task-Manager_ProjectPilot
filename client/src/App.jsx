import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import ProjectsDashboard from './pages/ProjectsDashboard';
import ProjectView from './pages/ProjectView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-base text-text-main overflow-x-hidden relative">
        {/* Subtle radial glows */}
        <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes (You can add PrivateRoute wrapper later) */}
          <Route path="/projects" element={<ProjectsDashboard />} />
          <Route path="/project/:projectId" element={<ProjectView />} />
          
          {/* Redirect to landing by default */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
