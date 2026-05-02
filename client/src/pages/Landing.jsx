import { Link } from 'react-router-dom';
import { Layers, ArrowRight, LayoutDashboard, RefreshCcw, Shield, Zap } from 'lucide-react';
import FaultyTerminal  from "../animation/FaultyTerminal";

function Landing() {
  return (
    <div className="min-h-screen bg-bg-base text-white selection:bg-primary/30 overflow-hidden relative">
      {/* Faulty Terminal Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#A7EF9E"
          mouseReact
          mouseStrength={0.5}
          pageLoadAnimation
          brightness={0.6}
        />
      </div>
      {/* Subtle Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-green-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-bg-base/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 text-primary-light">
                <Layers size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight">ProjectPilot</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm font-medium text-text-muted hover:text-white transition-colors">Log In</Link>
              <Link to="/signup" className="text-sm font-medium btn-primary px-5 py-2.5">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 lg:pt-12 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-white/10 mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-yellow-500"></span>
            <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Built with React, Redux & Node.js</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight max-w-4xl mx-auto animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            A ProjectPilot, real-time <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">task manager.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white font-bold mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Experience seamless Kanban boards, instant state synchronization, and strict role-based access control, wrapped in a premium dark mode aesthetic.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <Link to="/signup" className="btn-primary px-8 py-4 text-lg w-full sm:w-auto flex items-center justify-center gap-2">
              Start Building <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-ghost px-8 py-4 text-lg w-full sm:w-auto">
              Sign In
            </Link>
          </div>

          {/* Abstract UI Preview */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent z-10 h-3/4 top-1/4"></div>
            <div className="glass-card p-2 rounded-2xl border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.1)] relative">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-bg-surface rounded-t-xl">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="bg-bg-container h-[400px] rounded-b-xl overflow-hidden p-6 relative">
                
                {/* Fake Kanban Layout */}
                <div className="flex gap-6 h-full opacity-60">
                  <div className="w-1/3 h-full glass-card border-white/5 bg-bg-surface p-4">
                    <div className="w-1/2 h-4 bg-white/10 rounded mb-6"></div>
                    <div className="w-full h-24 bg-white/5 rounded border border-white/5 mb-3"></div>
                    <div className="w-full h-24 bg-white/5 rounded border border-white/5"></div>
                  </div>
                  <div className="w-1/3 h-full glass-card border-white/5 bg-bg-surface p-4">
                    <div className="w-1/2 h-4 bg-primary/30 rounded mb-6"></div>
                    <div className="w-full h-32 bg-primary/10 rounded border border-primary/20"></div>
                  </div>
                  <div className="w-1/3 h-full glass-card border-white/5 bg-bg-surface p-4">
                    <div className="w-1/2 h-4 bg-emerald-500/30 rounded mb-6"></div>
                    <div className="w-full h-20 bg-white/5 rounded border border-white/5 mb-3"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actual Project Features */}
      <section className="relative z-10 py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by modern tech.</h2>
            <p className="text-text-muted">Everything you need in a full-stack technical evaluation project.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-8 border-white/5 hover:border-primary/30 transition-colors bg-bg-container">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-red-400 mb-6">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Visual Kanban Boards</h3>
              <p className="text-text-muted">A fully responsive grid layout allowing users to track tasks across To Do, In Progress, and Done statuses.</p>
            </div>

            <div className="glass-card p-8 border-white/5 hover:border-emerald-500/30 transition-colors bg-bg-container">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-yellow-400 mb-6">
                <RefreshCcw size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Redux Centralized State</h3>
              <p className="text-text-muted">Eliminates prop-drilling. Tasks are managed globally via Redux Toolkit with background polling for live UI updates.</p>
            </div>

            <div className="glass-card p-8 border-white/5 hover:border-green-500/30 transition-colors bg-bg-container">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Role-Based Security</h3>
              <p className="text-text-muted">Strict JWT authentication. Only Project Admins can create or delete tasks, while members can only update statuses.</p>
            </div>

            <div className="glass-card p-8 border-white/5 hover:border-blue-500/30 transition-colors bg-bg-container">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Deep Space Aesthetic</h3>
              <p className="text-text-muted">A premium dark mode UI built with Tailwind CSS, featuring glassmorphism, glowing accents, and high-fidelity typography.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 bg-bg-base">
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-white font-bold mb-2">
            <Layers size={18} className="text-primary" /> ProjectPilot
          </div>
          <p className="text-sm text-text-muted">Built with ❤ SHREYANASH GUPTA.</p>
        </div>
      </footer>

    </div>
  );
}

export default Landing;
