import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DONUT_COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f97316', '#eab308', '#ec4899', '#06b6d4', '#8b5cf6'];

const CATEGORY_EMOJI = {
  Rent: '🏠', Food: '🍔', Transport: '🚗', Utilities: '⚡', Shopping: '🛍️',
  Healthcare: '🏥', Entertainment: '🎬', Education: '📚', Salary: '💼',
  Freelance: '💻', Investment: '📈', Other: '📦'
};

function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
  return `₹${val}`;
}

function BarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color, fontWeight: 700 }}>
            {p.dataKey}: ₹{p.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Insights() {
  const { transactions, totalIncome, totalExpenses } = useApp();

  // Spend by category with progress bars
  const categorySpend = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'Expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    const list = Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const max = list[0]?.value || 1;
    return list.map(c => ({ ...c, pct: (c.value / max) * 100, sharePct: (c.value / totalExpenses) * 100 }));
  }, [transactions, totalExpenses]);

  // Monthly income vs expense
  const monthlyComparison = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
      if (t.type === 'Income') map[key].income += t.amount;
      else map[key].expense += t.amount;
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-6).map(m => ({
      ...m,
      label: new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }));
  }, [transactions]);

  // Donut for income vs expense
  const pieData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpenses },
  ];

  // Savings rate
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : '0.0';

  // Avg daily expense
  const uniqueDates = new Set(transactions.filter(t => t.type === 'Expense').map(t => t.date));
  const avgDaily = uniqueDates.size > 0
    ? (totalExpenses / uniqueDates.size).toFixed(0)
    : 0;

  return (
    <div className="page fade-in">
      {/* Summary mini cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Savings Rate', value: `${savingsRate}%`, icon: TrendingUp, color: 'var(--accent-green)' },
          { label: 'Avg Daily Spend', value: `₹${Number(avgDaily).toLocaleString('en-IN')}`, icon: TrendingDown, color: 'var(--accent-red)' },
          { label: 'Categories', value: categorySpend.length, icon: Wallet, color: 'var(--accent-blue)' },
          { label: 'Transactions', value: transactions.length, icon: Zap, color: 'var(--accent-violet)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="info-card">
            <div className="info-card-label">
              <Icon size={13} style={{ color }} />
              {label}
            </div>
            <div className="info-card-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="insights-grid">
        {/* Category breakdown */}
        <div className="bar-chart-card">
          <div className="card-header">
            <div className="card-title">Category Breakdown</div>
          </div>
          <div className="category-list">
            {categorySpend.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px 0' }}>No expenses yet</div>
            ) : (
              categorySpend.slice(0, 7).map((cat, i) => (
                <div key={cat.name} className="category-row">
                  <div className="category-icon" style={{ background: `${DONUT_COLORS[i % DONUT_COLORS.length]}22` }}>
                    {CATEGORY_EMOJI[cat.name] || '📦'}
                  </div>
                  <div className="category-row-info">
                    <div className="category-row-top">
                      <span className="category-row-name">{cat.name}</span>
                      <span className="category-row-amount" style={{ color: DONUT_COLORS[i % DONUT_COLORS.length] }}>
                        ₹{cat.value.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${cat.pct}%`, background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', width: 36, textAlign: 'right', flexShrink: 0 }}>
                    {cat.sharePct.toFixed(0)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Income vs Expense pie */}
        <div className="bar-chart-card">
          <div className="card-header">
            <div className="card-title">Income vs Expenses</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <PieChart width={180} height={180}>
              <Pie data={pieData} cx={85} cy={85} innerRadius={52} outerRadius={82} paddingAngle={4} dataKey="value">
                <Cell fill="#10b981" />
                <Cell fill="#f43f5e" />
              </Pie>
            </PieChart>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: i === 0 ? '#10b981' : '#f43f5e' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  ₹{d.value.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Net Savings</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: totalIncome >= totalExpenses ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                ₹{Math.abs(totalIncome - totalExpenses).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly comparison bar chart */}
      <div className="bar-chart-card" style={{ marginTop: 0 }}>
        <div className="card-header">
          <div className="card-title">Monthly Income vs Expenses</div>
          <span className="badge">Last 6 Months</span>
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={monthlyComparison} margin={{ top: 8, right: 4, left: -10, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
            <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
            <Tooltip content={<BarTooltip />} />
            <Legend wrapperStyle={{ fontSize: 13, color: 'var(--text-secondary)' }} />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
