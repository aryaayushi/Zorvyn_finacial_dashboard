import { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';

function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
  return `₹${val}`;
}

function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color, fontWeight: 700, marginBottom: 2 }}>
            {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

const TIME_FILTERS = [
  { label: 'Last 7 Days', key: '7d' },
  { label: 'Last 30 Days', key: '30d' },
  { label: '6 Months', key: '6m' },
  { label: 'This Year', key: '1y' },
];

function getFilteredIncomeVsExpenses(transactions, filterKey) {
  const now = new Date();
  const map = {};

  let startDate;
  let groupBy; // 'day' | 'week' | 'month'

  if (filterKey === '7d') {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 6);
    groupBy = 'day';
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map[key] = { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), income: 0, expense: 0 };
    }
  } else if (filterKey === '30d') {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 29);
    groupBy = 'day';
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map[key] = { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), income: 0, expense: 0 };
    }
  } else if (filterKey === '6m') {
    groupBy = 'month';
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = { label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }), income: 0, expense: 0 };
    }
  } else if (filterKey === '1y') {
    groupBy = 'month';
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = { label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }), income: 0, expense: 0 };
    }
  }

  transactions.forEach(t => {
    const d = new Date(t.date);
    let key;
    if (groupBy === 'day') {
      key = t.date;
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    if (map[key]) {
      if (t.type === 'Income') map[key].income += t.amount;
      else map[key].expense += t.amount;
    }
  });

  return Object.values(map);
}

export default function Analytics() {
  const { transactions } = useApp();
  const [activeFilter, setActiveFilter] = useState('30d');

  const incomeVsExpenses = useMemo(
    () => getFilteredIncomeVsExpenses(transactions, activeFilter),
    [transactions, activeFilter]
  );

  const totalIncome = incomeVsExpenses.reduce((s, d) => s + d.income, 0);
  const totalExpense = incomeVsExpenses.reduce((s, d) => s + d.expense, 0);
  const netBalance = totalIncome - totalExpense;

  // Cumulative balance over time (all-time)
  const cumulativeBalance = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let running = 0;
    const result = [];
    const seen = {};
    sorted.forEach(tx => {
      running += tx.type === 'Income' ? tx.amount : -tx.amount;
      if (!seen[tx.date]) {
        seen[tx.date] = true;
        const d = new Date(tx.date);
        result.push({ label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), balance: Math.max(running, 0) });
      } else if (result.length > 0) {
        result[result.length - 1].balance = Math.max(running, 0);
      }
    });
    return result;
  }, [transactions]);

  // Expense trend by month (last 8 months)
  const expenseTrend = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'Expense').forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = (map[key] || 0) + t.amount;
    });
    return Object.entries(map).sort().slice(-8).map(([k, v]) => ({
      label: new Date(k + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      expense: v
    }));
  }, [transactions]);

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Income vs Expenses Chart ── */}
        <div className="chart-card">
          {/* Header + time filter buttons */}
          <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="card-title" style={{ fontSize: 16, fontWeight: 700 }}>Income vs Expenses</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Compare inflows and outflows over time
              </div>
            </div>

            {/* Time Filter Buttons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TIME_FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    background: activeFilter === f.key
                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                      : 'var(--bg-input)',
                    color: activeFilter === f.key ? '#fff' : 'var(--text-muted)',
                    boxShadow: activeFilter === f.key ? '0 4px 14px rgba(99,102,241,0.4)' : 'none',
                    transform: activeFilter === f.key ? 'translateY(-1px)' : 'none',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Pills */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '8px 16px' }}>
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginBottom: 2 }}>TOTAL INCOME</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>₹{totalIncome.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 10, padding: '8px 16px' }}>
              <div style={{ fontSize: 11, color: '#f43f5e', fontWeight: 600, marginBottom: 2 }}>TOTAL EXPENSES</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f43f5e' }}>₹{totalExpense.toLocaleString('en-IN')}</div>
            </div>
            <div style={{
              background: netBalance >= 0 ? 'rgba(99,102,241,0.1)' : 'rgba(244,63,94,0.1)',
              border: `1px solid ${netBalance >= 0 ? 'rgba(99,102,241,0.25)' : 'rgba(244,63,94,0.25)'}`,
              borderRadius: 10, padding: '8px 16px'
            }}>
              <div style={{ fontSize: 11, color: netBalance >= 0 ? '#6366f1' : '#f43f5e', fontWeight: 600, marginBottom: 2 }}>NET BALANCE</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: netBalance >= 0 ? '#6366f1' : '#f43f5e' }}>
                {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={incomeVsExpenses}
              margin={{ top: 8, right: 4, left: -10, bottom: 0 }}
              barCategoryGap="30%"
              barGap={4}
            >
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} interval={activeFilter === '30d' ? 4 : 0} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)', paddingTop: 10 }} />
              <Bar dataKey="income" name="Income" fill="url(#incomeGrad)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="expense" name="Expense" fill="url(#expenseGrad)" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Cumulative Balance Chart ── */}
        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">Cumulative Balance</div>
            <span className="badge">All Time</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cumulativeBalance} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} interval={Math.ceil(cumulativeBalance.length / 7)} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="balance" name="Balance" stroke="#6366f1" strokeWidth={2.5} fill="url(#cumGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Daily Cashflow + Expense Trend ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="chart-card">
            <div className="card-header">
              <div className="card-title">Daily Cashflow</div>
              <span className="badge">Last 30 Days</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={useMemo(() => getFilteredIncomeVsExpenses(transactions, '30d').filter(d => d.income > 0 || d.expense > 0), [transactions])}
                margin={{ top: 8, right: 4, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="card-header">
              <div className="card-title">Expense Trend</div>
              <span className="badge">Monthly</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={expenseTrend} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,63,94,0.08)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: 'var(--bg-card)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
