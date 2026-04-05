import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Activity, Zap, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import AddTransactionModal from '../components/AddTransactionModal';

const DONUT_COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f97316', '#eab308', '#ec4899', '#06b6d4', '#8b5cf6'];

const CATEGORY_EMOJI = {
  Rent: '🏠', Food: '🍔', Transport: '🚗', Utilities: '⚡', Shopping: '🛍️',
  Healthcare: '🏥', Entertainment: '🎬', Education: '📚', Salary: '💼',
  Freelance: '💻', Investment: '📈', Other: '📦'
};

function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
  return `₹${val.toLocaleString('en-IN')}`;
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        fontSize: 13,
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
}

export default function Overview() {
  const { transactions, totalBalance, totalIncome, totalExpenses, role } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Balance trend - last 7 unique dates with cumulative balance
  const balanceTrend = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const days = [];
    const seen = new Set();
    let running = 0;

    sorted.forEach(tx => {
      running += tx.type === 'Income' ? tx.amount : -tx.amount;
      if (!seen.has(tx.date)) {
        seen.add(tx.date);
        const d = new Date(tx.date);
        days.push({
          label: d.toLocaleDateString('en-US', { weekday: 'short' }),
          balance: Math.max(running, 0),
          date: tx.date,
        });
      } else {
        if (days.length > 0) {
          days[days.length - 1].balance = Math.max(running, 0);
        }
      }
    });

    return days.slice(-7);
  }, [transactions]);

  // Spend analysis donut
  const spendByCategory = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'Expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Top spend category
  const topSpend = spendByCategory[0];

  // Monthly change
  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'Expense';
  }).reduce((s, t) => s + t.amount, 0);

  const lastMonth = transactions.filter(t => {
    const d = new Date(t.date);
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === prev.getMonth() && d.getFullYear() === prev.getFullYear() && t.type === 'Expense';
  }).reduce((s, t) => s + t.amount, 0);

  const monthlyChange = lastMonth > 0
    ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1)
    : 0;

  // AI Insight
  const aiInsight = useMemo(() => {
    if (!topSpend) return 'Start adding transactions to get personalized insights!';
    const pct = ((topSpend.value / totalExpenses) * 100).toFixed(0);
    const messages = [
      `Watch out! ${topSpend.name} makes up ${pct}% of your total expenses. Consider reviewing this category.`,
      `Your biggest expense is ${topSpend.name} at ₹${topSpend.value.toLocaleString('en-IN')} (${pct}% of spending).`,
      `Tip: Reducing ${topSpend.name} expenses by 10% would save ₹${(topSpend.value * 0.1).toFixed(0)} per period.`,
    ];
    return messages[Math.floor(Date.now() / 10000) % messages.length];
  }, [topSpend, totalExpenses]);

  return (
    <div className="page fade-in">
      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card balance">
          <div className="stat-info">
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">₹{totalBalance.toLocaleString('en-IN')}</div>
            <div className="stat-sub">Net position</div>
          </div>
          <div className="stat-icon">
            <Wallet size={24} strokeWidth={2} />
          </div>
        </div>

        <div className="stat-card income">
          <div className="stat-info">
            <div className="stat-label">Total Income</div>
            <div className="stat-value">+₹{totalIncome.toLocaleString('en-IN')}</div>
            <div className="stat-sub">All time earnings</div>
          </div>
          <div className="stat-icon">
            <TrendingUp size={24} strokeWidth={2} />
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-info">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">-₹{totalExpenses.toLocaleString('en-IN')}</div>
            <div className="stat-sub">All time spending</div>
          </div>
          <div className="stat-icon">
            <TrendingDown size={24} strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Balance Trend */}
        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">
              <Activity size={16} className="card-title-icon" />
              Balance Trend
            </div>
            <span className="badge">Last 7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={balanceTrend} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#balanceGrad)"
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: 'var(--bg-card)' }}
                activeDot={{ r: 6, fill: '#6366f1' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spend Analysis donut */}
        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">
              <Flame size={16} className="card-title-icon" />
              Spend Analysis
            </div>
          </div>
          <div className="donut-wrapper">
            <div className="donut-chart-area">
              <PieChart width={180} height={180}>
                <Pie
                  data={spendByCategory.length ? spendByCategory : [{ name: 'No data', value: 1 }]}
                  cx={85}
                  cy={85}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  onClick={(entry) => setActiveCategory(activeCategory === entry.name ? null : entry.name)}
                >
                  {(spendByCategory.length ? spendByCategory : [{ name: 'No data', value: 1 }]).map((entry, i) => (
                    <Cell 
                      key={i} 
                      fill={DONUT_COLORS[i % DONUT_COLORS.length]} 
                      style={{ cursor: 'pointer', transition: 'all 0.3s', opacity: activeCategory === null || activeCategory === entry.name ? 1 : 0.4, outline: 'none' }}
                      onClick={(e) => {
                         if (e && e.stopPropagation) e.stopPropagation();
                         setActiveCategory(activeCategory === entry.name ? null : entry.name);
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div 
                className="donut-center-label" 
                style={{ top: 25, left: 25, width: 120, height: 120, borderRadius: '50%', cursor: activeCategory !== null ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} 
                onClick={() => setActiveCategory(null)}
              >
                {activeCategory !== null && spendByCategory.find(c => c.name === activeCategory) ? (
                  <>
                    <div className="donut-total-label" style={{ fontSize: 10, marginBottom: 2, pointerEvents: 'none' }}>{activeCategory.toUpperCase()}</div>
                    <div className="donut-total-value" style={{ pointerEvents: 'none' }}>{formatCurrency(spendByCategory.find(c => c.name === activeCategory).value)}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2, pointerEvents: 'none' }}>
                      {((spendByCategory.find(c => c.name === activeCategory).value / totalExpenses) * 100).toFixed(1)}%
                    </div>
                  </>
                ) : (
                  <>
                    <div className="donut-total-label" style={{ pointerEvents: 'none' }}>TOTAL</div>
                    <div className="donut-total-value" style={{ pointerEvents: 'none' }}>{formatCurrency(totalExpenses)}</div>
                  </>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="donut-legend">
              {spendByCategory.slice(0, 5).map((item, i) => (
                <div key={item.name} className="donut-legend-item">
                  <div className="donut-legend-left">
                    <div className="legend-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    <span className="legend-name">{item.name}</span>
                  </div>
                  <span className="legend-pct">
                    {totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info cards + AI insight */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 18 }}>
        <div className="info-card">
          <div className="info-card-label">
            <Flame size={13} style={{ color: 'var(--accent-orange)' }} />
            Top Spend
          </div>
          <div className="info-card-value">
            {topSpend ? CATEGORY_EMOJI[topSpend.name] || '📦' : '—'} {topSpend?.name || 'N/A'}
          </div>
          <div className="info-card-sub">
            {topSpend ? `₹${topSpend.value.toLocaleString('en-IN')}` : 'No expenses yet'}
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-label">
            <TrendingDown size={13} style={{ color: monthlyChange > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }} />
            Monthly Trend
          </div>
          <div className="info-card-value" style={{ color: monthlyChange > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {monthlyChange > 0 ? '▲' : '▼'} {Math.abs(monthlyChange)}%
          </div>
          <div className="info-card-sub">vs last month spending</div>
        </div>

        <div className="ai-card">
          <div className="ai-card-header">
            <Zap size={16} />
            AI Insight
          </div>
          <div className="ai-card-text">{aiInsight}</div>
        </div>
      </div>

      {/* Floating add button for admin */}
      {role === 'Admin' && (
        <>
          <button
            onClick={() => setShowModal(true)}
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))',
              border: 'none',
              color: 'white',
              fontSize: 24,
              cursor: 'pointer',
              boxShadow: '0 6px 24px var(--accent-blue-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            title="Add Transaction"
          >
            +
          </button>
          {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
        </>
      )}
    </div>
  );
}
