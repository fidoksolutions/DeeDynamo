import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, FileText,
  Receipt, Wallet, TrendingUp, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/clients',    icon: Users,           label: 'Clients'    },
  { to: '/services',   icon: Briefcase,       label: 'Services'   },
  { to: '/quotations', icon: FileText,        label: 'Quotations' },
  { to: '/invoices',   icon: Receipt,         label: 'Invoices'   },
  { to: '/expenses',   icon: Wallet,          label: 'Expenses'   },
  { to: '/reports',    icon: TrendingUp,      label: 'Reports'    },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col">
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-white font-bold text-xl tracking-tight">CRM Lite</h1>
        <p className="text-slate-400 text-xs mt-1">{user?.name}</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
               ${isActive
                 ? 'bg-blue-600 text-white'
                 : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-white text-sm border-t border-slate-700"
      >
        <LogOut size={18} /> Sign out
      </button>
    </aside>
  );
}
