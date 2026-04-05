import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Shield, Database, Bell, Trash2, RefreshCw } from 'lucide-react';
import { initialTransactions } from '../data/transactions';

export default function Settings() {
  const { theme, toggleTheme, role, setRole, transactions } = useApp();
  const [saved, setSaved] = useState(false);
  const [currency, setCurrency] = useState('INR (₹)');

  const handleReset = () => {
    if (window.confirm('Reset all transaction data to defaults? This cannot be undone.')) {
      localStorage.setItem('fv_transactions', JSON.stringify(initialTransactions));
      window.location.reload();
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page fade-in">
      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Appearance */}
        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">
              <Sun size={16} className="card-title-icon" />
              Appearance
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>Theme</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Switch between dark and light mode</div>
              </div>
              <button
                className="btn btn-outline"
                onClick={toggleTheme}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {theme === 'dark' ? <><Moon size={15} /> Dark Mode</> : <><Sun size={15} /> Light Mode</>}
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">
              <Shield size={16} className="card-title-icon" />
              Account & Role
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>Current Role</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Admin = full access. Analyst = read + filter. Viewer = read-only.
                </div>
              </div>
              <select
                className="filter-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Analyst">Analyst</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">
              <Database size={16} className="card-title-icon" />
              Data Management
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>Transaction Count</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {transactions.length} transactions stored locally
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-blue)' }}>
                {transactions.length} records
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-red)', marginBottom: 3 }}>Reset to Demo Data</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Restore original sample transactions. This will erase your data.
                </div>
              </div>
              <button className="btn btn-outline" onClick={handleReset} style={{ borderColor: 'rgba(244,63,94,0.3)', color: 'var(--accent-red)' }}>
                <RefreshCw size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">
              <Bell size={16} className="card-title-icon" />
              Preferences
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Currency Format</label>
              <select
                className="form-control"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>

            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={handleSave}>
              {saved ? '✓ Saved!' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* About */}
        <div className="ai-card">
          <div className="ai-card-header">
            ⚡ Zorvyn Finance Vault v1.0.0
          </div>
          <div className="ai-card-text">
            A modern finance tracking dashboard built with React, Vite, and Recharts.
            Data is stored locally in your browser — no server required.
            Export your data anytime using the CSV export button in the top bar.
          </div>
        </div>
      </div>
    </div>
  );
}
