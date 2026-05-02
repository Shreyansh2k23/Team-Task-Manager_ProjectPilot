import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import api from '../utils/api';
import { LogOut, Plus, Folder } from 'lucide-react';

function ProjectsDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data.data);
      } catch (error) {
        console.error('Error fetching projects', error);
      }
    };

    fetchProjects();
  }, [user, navigate]);

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', newProject);
      setProjects([...projects, data.data]);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating project', error);
      alert('Failed to create project');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b border-primary/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Folder className="text-primary" />
              ProjectPilot Pro
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-text-muted">Hello, {user?.user?.name || user?.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium btn-ghost"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold text-white">Your Projects</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 btn-primary px-4 py-2"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <Folder className="mx-auto h-12 w-12 text-primary/50 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
            <p className="text-text-muted mb-6">Get started by creating your first project.</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 btn-primary px-4 py-2"
            >
              <Plus size={18} />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="glass-card p-6 cursor-pointer group hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-text-muted text-sm mb-4 line-clamp-2">
                  {project.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between text-xs text-text-muted border-t pt-4 border-white/10">
                  <span>Admin: {project.admin?.name || 'You'}</span>
                  <span className="bg-primary/20 text-[#8b5cf6] border border-primary/30 px-2 py-1 rounded-full font-mono">
                    {project.members?.length || 1} Member(s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 glass-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 glass-input"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 btn-primary"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsDashboard;
