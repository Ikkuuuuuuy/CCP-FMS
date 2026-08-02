import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import LoginPage from './modules/Login/LoginPage';
import Dashboard from './modules/Dashboard/Dashboard';
import BURModule from './modules/BUR/BURModule';
import DVModule from './modules/DV/DVModule';
import LedgerModule from './modules/Ledger/LedgerModule';
import AuditLogModule from './modules/AuditLog/AuditLogModule';
import ReportsModule from './modules/Reports/ReportsModule';
import AccountOverviewModule from './modules/AccountOverview/AccountOverviewModule';
import TransactionLogsModule from './modules/TransactionLogs/TransactionLogsModule';
import UserManagementModule from './modules/UserManagement/UserManagementModule';
import './styles/index.css';

function AppShell() {
  const { state } = useApp();
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Show login if not authenticated
  if (!state.currentUser) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <Dashboard onNavigate={setActivePage} />;
      case 'reports':      return <ReportsModule />;
      case 'bur':          return <BURModule />;
      case 'dv':           return <DVModule />;
      case 'ledger':       return <LedgerModule />;
      case 'audit':        return <AuditLogModule />;
      case 'account':      return <AccountOverviewModule />;
      case 'transactions': return <TransactionLogsModule />;
      case 'users':        return <UserManagementModule />;
      default:             return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setMobileOpen(false);
        }}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="main-content">
        <TopBar
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            setMobileOpen(false);
          }}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
        />
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
