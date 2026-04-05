import { Sun, Moon, Download, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PAGE_META = {
  '/': { title: 'Welcome back!', sub: 'Here is your dynamic financial overview.' },
  '/transactions': { title: 'Transactions', sub: 'Manage and search your transaction history.' },
  '/insights': { title: 'Insights', sub: 'Deep dive into your spending habits.' },
  '/analytics': { title: 'Analytics', sub: 'Detailed analytics and financial trends.' },
  '/settings': { title: 'Settings', sub: 'Customize your Zorvyn Finance Vault experience.' },
};

export default function Topbar({ pathname }) {
  const { theme, toggleTheme, role, setRole, transactions } = useApp();
  const meta = PAGE_META[pathname] || PAGE_META['/'];

  const handleExportCSV = () => {
    const headers = ['Date', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [t.date, t.category, t.type, t.amount]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zorvyn_finance_vault_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>{meta.title}</h1>
        <p>{meta.sub}</p>
      </div>

      <div className="topbar-right">
        {/* Theme Toggle */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Export CSV */}
        <button className="btn btn-outline" onClick={handleExportCSV}>
          <Download size={15} />
          Export CSV
        </button>

        {/* Role Selector */}
        <div className="role-select">
          <Shield size={15} style={{ color: 'var(--accent-blue)' }} />
          <span>Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Admin">Admin</option>
            <option value="Analyst">Analyst</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </div>
    </header>
  );
}
