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

  // Show login if not authenticated
  if (!state.currentUser) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <Dashboard />;
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
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        <TopBar activePage={activePage} onNavigate={setActivePage} />
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
