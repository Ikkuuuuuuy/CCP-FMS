import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, AlertCircle, RefreshCw, Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { MOCK_USERS } from '../../data/seedData';
import { useApp } from '../../contexts/AppContext';

// Canvas-processed Transparent Official CCP Golden Logo Emblem
function CCPOfficialEmblem({ size = 80 }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = '/ccp-official-logo.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const cropHeight = Math.floor(img.height * 0.72);
      canvas.width = img.width;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, cropHeight, 0, 0, img.width, cropHeight);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 190 && g > 190 && b > 190) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setDataUrl(canvas.toDataURL());
    };
  }, []);

  if (!dataUrl) {
    return <div style={{ width: `${size}px`, height: `${size}px`, margin: '0 auto' }} />;
  }

  return (
    <img
      src={dataUrl}
      alt="Official CCP Emblem"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        margin: '0 auto',
        display: 'block',
        filter: 'drop-shadow(0 4px 12px rgba(212,175,55,0.35))'
      }}
    />
  );
}

export default function LoginPage() {
  const { dispatch } = useApp();
  const [viewMode, setViewMode] = useState('login'); // 'login' | 'forgot_password'
  const [selectedUserId, setSelectedUserId] = useState(MOCK_USERS[0].id);
  const selectedUser = MOCK_USERS.find((u) => u.id === selectedUserId) || MOCK_USERS[0];

  // Real Login Inputs
  const [username, setUsername] = useState('jose.reyes@ccp.gov.ph');
  const [password, setPassword] = useState('GovFMS@2026!Secure');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Loading & Security State
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Dynamically match selected or entered account
    const matchedUser = MOCK_USERS.find(u => u.id === selectedUserId)
      || MOCK_USERS.find(u => username.toLowerCase().includes(u.name.toLowerCase().split(' ')[0]))
      || MOCK_USERS[0];

    // Instant login dispatch
    dispatch({ type: 'LOGIN', payload: matchedUser });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsSendingReset(true);
    setTimeout(() => {
      setIsSendingReset(false);
      setResetSent(true);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      backgroundColor: '#0A0404',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          radial-gradient(circle at 50% 25%, rgba(140,21,21,0.40) 0%, transparent 60%),
          radial-gradient(circle at 15% 85%, rgba(191,160,70,0.15) 0%, transparent 50%),
          radial-gradient(circle at 85% 15%, rgba(140,21,21,0.25) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Heritage Diamond Pattern Overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 1.5px, transparent 1.5px)',
        backgroundSize: '32px 32px'
      }} />

      {/* Glassmorphism Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'rgba(20, 13, 13, 0.92)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(212, 175, 55, 0.45)',
        borderRadius: '20px',
        padding: '36px 30px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(140,21,21,0.35)',
        boxSizing: 'border-box'
      }}>

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ marginBottom: '14px' }}>
            <CCPOfficialEmblem size={82} />
          </div>

          <div style={{
            fontSize: '12.5px',
            fontWeight: 800,
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#D4AF37',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: '1.3'
          }}>
            CULTURAL CENTER<br />OF THE PHILIPPINES
          </div>

          <h1 style={{
            fontSize: '19px',
            fontWeight: 900,
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginTop: '6px',
            marginBottom: '4px',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)'
          }}>
            FINANCIAL MANAGEMENT SYSTEM
          </h1>
        </div>

        {/* VIEW 1: Login Form */}
        {viewMode === 'login' ? (
          <form onSubmit={handleLoginSubmit}>

            {/* Error Alert Box */}
            {errorMessage && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 12px', backgroundColor: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px',
                color: '#FCA5A5', fontSize: '11.5px', marginBottom: '16px'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Username Input */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)',
                marginBottom: '6px'
              }}>
                Government Email / Employee ID
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. jose.reyes@ccp.gov.ph"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <KeyRound size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#D4AF37' }} />
              </div>
            </div>

            {/* Password Input with Forgot Password Button */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                  GovPortal Password
                </label>
                <button
                  type="button"
                  onClick={() => { setViewMode('forgot_password'); setResetSent(false); setResetEmail(username); }}
                  style={{
                    background: 'none', border: 'none', color: '#D4AF37', fontSize: '11px',
                    fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline'
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  style={{
                    width: '100%',
                    padding: '11px 36px 11px 36px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#D4AF37' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Account Selection Dropdown for Instant Bypass */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)',
                marginBottom: '6px'
              }}>
                Select Account (Bypass Access)
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => {
                  const u = MOCK_USERS.find(user => user.id === e.target.value);
                  if (u) {
                    setSelectedUserId(u.id);
                    setUsername(`${u.name.toLowerCase().replace(/\s+/g, '.')}@ccp.gov.ph`);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                {MOCK_USERS.map((u) => (
                  <option key={u.id} value={u.id} style={{ backgroundColor: '#1A1212', color: '#FFF' }}>
                    {u.name} — {u.roleLabel}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              style={{
                width: '100%',
                padding: '14px',
                background: isAuthenticating ? '#521212' : 'linear-gradient(135deg, #8C1515 0%, #B81D1D 50%, #8C1515 100%)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: isAuthenticating ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 6px 20px rgba(140, 21, 21, 0.4)',
                transition: 'all 150ms ease'
              }}
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>
        ) : (
          /* VIEW 2: Forgot Password Screen */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                Reset Your Password
              </h2>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>
                Enter your government email address below and we will send you password reset instructions.
              </p>
            </div>

            {resetSent ? (
              <div style={{
                textAlign: 'center', padding: '20px 16px', backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', marginBottom: '20px'
              }}>
                <CheckCircle size={36} style={{ color: '#10B981', margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#A7F3D0', marginBottom: '4px' }}>
                  Reset Instructions Sent!
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                  Check your inbox at <span style={{ color: '#D4AF37', fontWeight: 700 }}>{resetEmail}</span> for your temporary reset link.
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '6px' }}>
                    Government Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="e.g. jose.reyes@ccp.gov.ph"
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 36px',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#D4AF37' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingReset}
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: 'linear-gradient(135deg, #8C1515 0%, #B81D1D 50%, #8C1515 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isSendingReset ? (
                    <span>Sending Reset Link...</span>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Reset Instructions</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => setViewMode('login')}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={14} /> Back to Log In
            </button>
          </div>
        )}

        {/* Footer Branding */}
        <div style={{
          textAlign: 'center',
          marginTop: '22px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          fontSize: '10px',
          color: '#D4AF37',
          fontWeight: 700,
          letterSpacing: '0.08em'
        }}>
          CULTURAL CENTER OF THE PHILIPPINES<br />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>REPUBLIC OF THE PHILIPPINES</span>
        </div>

      </div>
    </div>
  );
}
