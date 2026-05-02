import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import { Mail, Lock, Layers } from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      navigate('/projects');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex bg-bg-base">
      {/* Left Side - Form*/}
      <div className="w-full lg:w-[480px] xl:w-[560px] bg-bg-surface flex flex-col justify-center p-8 sm:p-12 border-l border-white/5 relative z-20">
        <div className="w-full max-w-[400px] mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-6 text-primary">
              <Layers size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-text-muted text-sm">Sign in to ProjectPilot Pro to continue.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono text-text-muted mb-2 uppercase tracking-widest">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-text-muted mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 px-4 mt-6 flex justify-center items-center gap-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'} <span>→</span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white hover:text-primary transition-colors font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Side - Hero / Visuals */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-24 relative overflow-hidden bg-[#0a0a12]">
        {/* Abstract Background Waves */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[40%] -left-20 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute top-[60%] right-0 w-[500px] h-[400px] bg-green-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
          <div className="absolute top-[50%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <div className="absolute top-[55%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-y-3"></div>
          <div className="absolute top-[45%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent -skew-y-2"></div>
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Your team's <br />
            <span className="text-primary-light">command center.</span>
          </h1>

          {/* Floating UI Widgets */}
          <div className="mt-16 relative h-64">
            {/* Widget 1: Launch Alpha */}
            <div className="absolute top-0 right-10 glass-card p-4 border-white/5 bg-bg-container/80 w-32 shadow-2xl animate-float">
              <p className="text-[10px] font-mono text-text-muted mb-2 text-center uppercase tracking-wider">Launch Alpha</p>
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="100, 100" className="text-white/10 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path strokeDasharray="75, 100" className="text-primary-light stroke-current drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" strokeWidth="3" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">75%</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Online Team */}
            <div className="absolute bottom-10 left-0 glass-card p-3 border-white/5 bg-bg-container/80 flex items-center gap-3 shadow-xl animate-float" style={{animationDelay: '1s'}}>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-900 border-2 border-bg-container flex items-center justify-center text-xs text-white">JD</div>
                <div className="w-8 h-8 rounded-full bg-green-900 border-2 border-bg-container flex items-center justify-center text-xs text-white">SM</div>
              </div>
              <div>
                <p className="text-xs font-medium text-white">Design Team</p>
                <p className="text-[10px] text-emerald-400">+14 online</p>
              </div>
            </div>

            {/* Widget 3: Sprint Velocity */}
            <div className="absolute bottom-[-20px] left-48 glass-card p-4 border-white/5 bg-bg-container/80 w-48 shadow-xl animate-float" style={{animationDelay: '2s'}}>
              <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Sprint Velocity</p>
                <span className="text-primary text-[10px]">↗</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-1 h-3 bg-[#f43f5e] rounded-full"></div><span className="text-xs text-white">Critical</span></div><span className="text-xs font-mono text-white">12</span></div>
                <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-1 h-3 bg-[#f59e0b] rounded-full"></div><span className="text-xs text-text-muted">Medium</span></div><span className="text-xs font-mono text-text-muted">34</span></div>
                <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-1 h-3 bg-primary rounded-full"></div><span className="text-xs text-text-muted">Low</span></div><span className="text-xs font-mono text-text-muted">8</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>


      
    </div>
  );
}

export default Login;
