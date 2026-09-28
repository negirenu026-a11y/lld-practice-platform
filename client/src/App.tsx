import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Boxes } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { ProblemDetails } from './pages/ProblemDetails';
import { Practice } from './pages/Practice';
import { Feedback } from './pages/Feedback';
import { History } from './pages/History';

function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-500/15 text-indigo-400 shadow-sm shadow-indigo-500/5'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
    }`;

  return (
    <nav className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
            <Boxes className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-sm font-bold text-slate-200 tracking-wide">
            LLD<span className="text-indigo-400">Practice</span>
          </span>
        </NavLink>
        <div className="flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="px-4 sm:px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/problems/:id" element={<ProblemDetails />} />
            <Route path="/practice/:id" element={<Practice />} />
            <Route path="/feedback/:submissionId" element={<Feedback />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
