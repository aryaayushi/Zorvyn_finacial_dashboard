import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Legend
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
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color, fontWeight: 700 }}>
            {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Analytics() {
  const { transactions } = useApp();

  // Daily cashflow for last 30 days
  const dailyCashflow = useMemo(() => {
    const map = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map[key] = { date: key, label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), income: 0, expense: 0, net: 0 };
    }
    transactions.forEach(t => {
      if (map[t.date]) {
        if (t.type === 'Income') map[t.date].income += t.amount;
        else map[t.date].expense += t.amount;
        map[t.date].net = map[t.date].income - map[t.date].expense;
      }
    });
    return Object.values(map);
  }, [transactions]);

  // Cumulative balance over time
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
        result.push({
          label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          balance: Math.max(running, 0)
        });
      } else if (result.length > 0) {
        result[result.length - 1].balance = Math.max(running, 0);
      }
    });
    return result;
  }, [transactions]);

  // Expense trend by month
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
        {/* Cumulative Balance Chart */}
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

        {/* Daily Cashflow + Expense trend side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="chart-card">
            <div className="card-header">
              <div className="card-title">Daily Cashflow</div>
              <span className="badge">Last 30 Days</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyCashflow.filter(d => d.income > 0 || d.expense > 0)} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
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
                <defs>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
