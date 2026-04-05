import { useState, useMemo } from 'react';
import { Trash2, Plus, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddTransactionModal from '../components/AddTransactionModal';

export default function Transactions() {
  const { transactions, deleteTransaction, role } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map(t => t.category))];
    return cats.sort();
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.category.toLowerCase().includes(q) || (t.note || '').toLowerCase().includes(q));
    }

    if (filterType !== 'All') list = list.filter(t => t.type === filterType);
    if (filterCategory !== 'All') list = list.filter(t => t.category === filterCategory);

    list.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return list;
  }, [transactions, search, filterType, filterCategory, sortBy]);

  const totalFiltered = useMemo(() => {
    const income = filtered.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense };
  }, [filtered]);

  return (
    <div className="page fade-in">
      <div className="table-card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <span className="table-title">Recent Transactions</span>
            <div className="search-input-wrap">
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                placeholder="Filter by category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <select
              className="filter-select"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="filter-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>

          {role === 'Admin' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={15} />
              Add Transaction
            </button>
          )}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">No transactions found</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Try adjusting your filters or add a new transaction
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                {role !== 'Viewer' && <th>Note</th>}
                {role === 'Admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id} className="tx-row">
                  <td className="tx-date">{tx.date}</td>
                  <td className="tx-category">{tx.category}</td>
                  <td>
                    <span className={`type-badge ${tx.type.toLowerCase()}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`tx-amount ${tx.type.toLowerCase()}`}>
                    {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                  {role !== 'Viewer' && (
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {tx.note || '—'}
                    </td>
                  )}
                  {role === 'Admin' && (
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => deleteTransaction(tx.id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div className="table-footer">
          <span>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
          <span style={{ display: 'flex', gap: 20 }}>
            <span style={{ color: 'var(--accent-green)' }}>
              +₹{totalFiltered.income.toLocaleString('en-IN')}
            </span>
            <span style={{ color: 'var(--accent-red)' }}>
              -₹{totalFiltered.expense.toLocaleString('en-IN')}
            </span>
          </span>
        </div>
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
