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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CCP-FMS Runtime Exception Caught:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('ccp_fms_state');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: '#0A0404', color: '#FFFFFF', padding: '24px', fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            maxWidth: '500px', width: '100%', backgroundColor: '#181010', border: '1px solid #8C1515',
            borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FDE68A', margin: '0 0 8px 0' }}>
              Cultural Center of the Philippines
            </h2>
            <div style={{ fontSize: '13px', color: '#E5E7EB', marginBottom: '20px' }}>
              Financial Management System — System Recovery Mode
            </div>
            <div style={{
              padding: '12px', backgroundColor: 'rgba(140,21,21,0.2)', border: '1px solid rgba(140,21,21,0.4)',
              borderRadius: '8px', fontSize: '12px', color: '#FCA5A5', fontFamily: 'monospace',
              textAlign: 'left', marginBottom: '24px', overflowX: 'auto'
            }}>
              {this.state.error?.toString()}
            </div>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#8C1515', color: '#FFFFFF', border: '1.5px solid #D4AF37',
                borderRadius: '8px', padding: '12px 24px', fontSize: '13px', fontWeight: 800,
                cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(140,21,21,0.4)'
              }}
            >
              Reset & Reload System Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </ErrorBoundary>
  );
}
