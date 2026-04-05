import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, Lightbulb, TrendingUp,
  Wallet, Settings, LogOut, User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
  { to: '/analytics', label: 'Analytics', icon: TrendingUp },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { role } = useApp();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Wallet size={18} color="white" strokeWidth={2.5} />
        </div>
        <div className="sidebar-logo-text">
          Zorvyn Finance Vault
          <span>Smart Tracking</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {navItems.slice(0, 3).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
            end={to === '/'}
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 12 }}>Reports</div>
        {navItems.slice(3, 4).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 12 }}>System</div>
        {navItems.slice(4).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {role === 'Admin' ? 'A' : 'V'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {role === 'Admin' ? 'Admin User' : 'Viewer'}
            </div>
            <div className="sidebar-user-role">{role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
