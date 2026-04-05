import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Overview from './pages/Overview';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { useApp } from './context/AppContext';
import './index.css';

export default function App() {
  const location = useLocation();
  const { theme } = useApp();

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar />
      <div className="main-content">
        <Topbar pathname={location.pathname} />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}
