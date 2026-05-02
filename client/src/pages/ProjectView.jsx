import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../utils/api';
import { getTasks, getDashboardStats, createTask, updateTaskStatus, optimisticUpdateStatus, deleteTask } from '../features/tasks/taskSlice';
import { ArrowLeft, UserPlus, Plus, Calendar, Clock, CheckCircle, Circle, BarChart2, LayoutDashboard, Trash2, Quote } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const motivationalQuotes = [
  "“The secret of getting ahead is getting started.” – Mark Twain",
  "“It always seems impossible until it's done.” – Nelson Mandela",
  "“Don't watch the clock; do what it does. Keep going.” – Sam Levenson",
  "“Quality is not an act, it is a habit.” – Aristotle",
  "“The only way to do great work is to love what you do.” – Steve Jobs",
  "“Success is not final, failure is not fatal: it is the courage to continue that counts.” – Winston Churchill",
  "“Great things in business are never done by one person. They're done by a team of people.” – Steve Jobs",
  "“Productivity is being able to do things that you were never able to do before.” – Franz Kafka",
  "“Amateurs sit and wait for inspiration, the rest of us just get up and go to work.” – Stephen King"
];

function ProjectView() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  // Subscribe to Redux store instead of local state
  const { tasks, stats } = useSelector((state) => state.tasks);

  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' or 'analytics'
  const [isProjectAdmin, setIsProjectAdmin] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);

  // Modals state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: ''
  });
  
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    // Initial fetch
    dispatch(getTasks(projectId));
    dispatch(getDashboardStats(projectId));

    // Fetch once on mount. We rely on optimistic UI updates for local state changes 
    // to keep the app ultra-lightweight and save 100% of background polling resources.

    const checkAdmin = async () => {
      try {
        const { data } = await api.get('/projects');
        const proj = data.data.find(p => p._id === projectId);
        if (proj) {
          const userId = user?.user?._id || user?._id;
          setIsProjectAdmin(proj.admin._id === userId || proj.admin === userId);
          setProjectMembers(proj.members);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkAdmin();

  }, [projectId, user, dispatch]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${projectId}/members`, { email: memberEmail });
      alert('Member added successfully!');
      setShowMemberModal(false);
      setMemberEmail('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const payload = { ...newTask, project: projectId };
    if (!payload.assignedTo) {
      delete payload.assignedTo;
    }
    
    // Dispatch Redux thunk to create task
    await dispatch(createTask(payload)).unwrap();
    
    setShowTaskModal(false);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
    // Refresh stats after creating a new task
    dispatch(getDashboardStats(projectId));
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    // 1. Optimistic Update directly in Redux
    dispatch(optimisticUpdateStatus({ taskId, status: newStatus }));

    try {
      // 2. Perform the actual API call via Thunk
      await dispatch(updateTaskStatus({ taskId, status: newStatus })).unwrap();
      // 3. Re-fetch stats to update analytics dashboard
      dispatch(getDashboardStats(projectId));
    } catch (error) {
      // Revert if error
      dispatch(getTasks(projectId));
      alert(error || 'Not authorized to update this task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        dispatch(getDashboardStats(projectId));
      } catch (error) {
        alert(error || 'Failed to delete task');
      }
    }
  };

  const renderKanbanColumn = (status, title) => {
    const columnTasks = tasks.filter(t => t.status === status);
    
    return (
      <div className="flex-1 glass-card p-4 border border-white/5 bg-bg-surface/50">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          {status === 'To Do' && <Circle size={16} className="text-yellow-400" />}
          {status === 'In Progress' && <Clock size={16} className="text-orange-400" />}
          {status === 'Done' && <CheckCircle size={16} className="text-green-400" />}
          {title} <span className="bg-primary/20 text-primary-light font-mono text-xs py-0.5 px-2 rounded-full ml-auto">{columnTasks.length}</span>
        </h3>
        
        <div className="space-y-4">
          {columnTasks.map(task => (
            <div key={task._id} className="glass-card task-glow p-4 border-l-2" style={{
              borderLeftColor: task.priority === 'High' ? '#f43f5e' : task.priority === 'Medium' ? '#f59e0b' : '#10b981'
            }}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white pr-6">{task.title}</h4>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded font-mono ${
                    task.priority === 'High' ? 'bg-[#f43f5e]/10 text-[#f43f5e]' : 
                    task.priority === 'Medium' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 
                    'bg-[#10b981]/10 text-[#10b981]'
                  }`}>
                    {task.priority}
                  </span>
                  {isProjectAdmin && (
                    <button onClick={() => handleDeleteTask(task._id)} className="text-text-muted hover:text-[#f43f5e] transition-colors" title="Delete Task">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              {task.description && <p className="text-sm text-text-muted mb-3 line-clamp-2">{task.description}</p>}
              
              <div className="flex justify-between items-center text-xs text-text-muted mt-4 border-t pt-3 border-white/10">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div className="font-medium bg-white/5 px-2 py-1 rounded border border-white/10">
                  {task.assignedTo?.name || 'Unassigned'}
                </div>
              </div>

              {/* Status Actions */}
              <div className="mt-4 flex gap-2">
                {status !== 'To Do' && (
                  <button onClick={() => handleUpdateStatus(task._id, 'To Do')} className="text-xs text-text-muted hover:text-white transition-colors">← To Do</button>
                )}
                {status !== 'In Progress' && (
                  <button onClick={() => handleUpdateStatus(task._id, 'In Progress')} className="text-xs text-primary hover:text-primary-light transition-colors mx-auto">In Progress</button>
                )}
                {status !== 'Done' && (
                  <button onClick={() => handleUpdateStatus(task._id, 'Done')} className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors ml-auto">Done →</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <nav className="glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b border-primary/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/projects')} className="text-text-muted hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-white">Project View</h1>
            </div>
            
            <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setActiveTab('kanban')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'kanban' ? 'bg-primary/20 text-primary-light' : 'text-text-muted hover:text-white'}`}
              >
                <LayoutDashboard size={16} /> Board
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-primary/20 text-primary-light' : 'text-text-muted hover:text-white'}`}
              >
                <BarChart2 size={16} /> Analytics
              </button>
            </div>

            <div className="flex items-center gap-3">
              {isProjectAdmin && (
                <>
                  <button onClick={() => setShowMemberModal(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm btn-ghost">
                    <UserPlus size={16} /> Add Member
                  </button>
                  <button onClick={() => setShowTaskModal(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm btn-primary">
                    <Plus size={16} /> Create Task
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'kanban' ? (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {renderKanbanColumn('To Do', 'To Do')}
            {renderKanbanColumn('In Progress', 'In Progress')}
            {renderKanbanColumn('Done', 'Done')}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Project Analytics</h2>
            {stats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="glass-card p-6 border-white/10">
                    <h3 className="text-text-muted text-sm font-medium mb-1">Total Tasks</h3>
                    <p className="text-4xl font-mono font-bold text-white">{stats.totalTasks}</p>
                  </div>
                  <div className="glass-card p-6 border-red-500/20">
                    <h3 className="text-[#f43f5e] text-sm font-medium mb-1">Overdue Tasks</h3>
                    <p className="text-4xl font-mono font-bold text-[#f43f5e]">{stats.overdueTasks}</p>
                  </div>
                </div>

                <div className="glass-card p-6 border-white/10">
                  <h3 className="text-text-muted text-sm font-medium mb-6">Tasks by Status Overview</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'To Do', value: stats.tasksByStatus['To Do'], color: '#9ca3af' },
                          { name: 'In Progress', value: stats.tasksByStatus['In Progress'], color: '#6366f1' },
                          { name: 'Done', value: stats.tasksByStatus['Done'], color: '#10b981' }
                        ]}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        barSize={60}
                      >
                        <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af' }} />
                        <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af' }} allowDecimals={false} />
                        <RechartsTooltip 
                          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                          contentStyle={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {
                            [
                              { name: 'To Do', color: '#9ca3af' },
                              { name: 'In Progress', color: '#6366f1' },
                              { name: 'Done', color: '#10b981' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Motivational Quote */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-4">
        <div className="glass-card p-6 border-l-4 border-l-primary relative overflow-hidden group hover:bg-white/5 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Quote size={40} className="text-white" />
          </div>
          <p className="text-lg md:text-xl font-medium text-white/90 italic relative z-10 leading-relaxed pr-12">
            {currentQuote}
          </p>
        </div>
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Add Project Member</h3>
            <form onSubmit={handleAddMember}>
              <input type="email" required placeholder="User Email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} className="w-full px-3 py-2 glass-input mb-4" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowMemberModal(false)} className="px-4 py-2 btn-ghost">Cancel</button>
                <button type="submit" className="px-4 py-2 btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <input type="text" required placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full px-3 py-2 glass-input" />
              <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="w-full px-3 py-2 glass-input" rows="2"></textarea>
              <input type="date" required value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className="w-full px-3 py-2 glass-input" />
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-text-muted mb-1">Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className="w-full px-3 py-2 glass-input [&>option]:bg-bg-surface">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-text-muted mb-1">Assign To</label>
                  <select value={newTask.assignedTo} onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} className="w-full px-3 py-2 glass-input [&>option]:bg-bg-surface">
                    <option value="">Unassigned</option>
                    {projectMembers.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 btn-ghost">Cancel</button>
                <button type="submit" className="px-4 py-2 btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectView;
