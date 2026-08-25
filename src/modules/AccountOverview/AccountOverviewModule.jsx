import React, { useState, useRef } from 'react';
import {
  Shield, Key, Globe, Lock, CheckCircle, AlertTriangle,
  Camera, Upload, Trash2, Edit3, Eye, EyeOff, Save, X, User, Check
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function AccountOverviewModule() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const fileInputRef = useRef(null);

  // Security & 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Modals & UI States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Jose Reyes',
    email: currentUser?.email || 'jose.reyes@culturalcenter.gov.ph',
    phone: currentUser?.phone || '+63 (02) 8832-1125 local 1402',
    division: currentUser?.division || 'Financial Services Division (FSD)',
    avatar: currentUser?.avatar || 'JR',
  });

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Active Sessions Mock Data
  const activeSessions = [
    { id: 1, device: 'Chrome on Windows 11 (Current)', ip: '112.198.102.45', location: 'CCP Complex, Pasay City', time: 'Active Now' },
    { id: 2, device: 'Safari on iPad Pro', ip: '112.198.102.88', location: 'CCP Admin Building', time: '2 hours ago' },
  ];

  // Trigger temporary toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle Profile Picture File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      dispatch({
        type: 'USER_UPDATE_PROFILE',
        payload: { avatarPhoto: dataUrl }
      });
      showToast('✓ Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Remove Profile Picture
  const handleRemovePhoto = () => {
    dispatch({
      type: 'USER_UPDATE_PROFILE',
      payload: { avatarPhoto: null }
    });
    showToast('✓ Profile picture removed. Initials avatar restored.');
  };

  // Handle Save Profile Details
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      alert('Full Name is required.');
      return;
    }

    dispatch({
      type: 'USER_UPDATE_PROFILE',
      payload: {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
        division: profileForm.division.trim(),
        avatar: profileForm.avatar.trim().toUpperCase() || 'JR',
      }
    });

    setIsEditProfileOpen(false);
    showToast('✓ Account profile details updated successfully!');
  };

  // Calculate Password Strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: '#D1D5DB' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#EF4444' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: '#F59E0B' };
    return { score: 3, label: 'Strong', color: '#10B981' };
  };

  const passStrength = getPasswordStrength(passwordForm.newPassword);

  // Handle Change Password Submit
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match. Please re-check.');
      return;
    }

    dispatch({
      type: 'USER_CHANGE_PASSWORD',
      payload: {
        newPassword: passwordForm.newPassword,
      }
    });

    setIsChangePasswordOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('🔒 Password updated successfully under GovPKI standard!');
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Success Notification Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          backgroundColor: '#065F46', color: '#FFFFFF', padding: '14px 20px',
          borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700,
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <CheckCircle size={18} style={{ color: '#34D399' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF', padding: '20px 24px', borderRadius: '12px',
        border: '1px solid #E8E2D9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1A1209', margin: 0 }}>Account Overview & Profile</h2>
          <p style={{ fontSize: '13px', color: '#6B6355', marginTop: '2px' }}>
            User profile details, custom avatar, GovPKI credentials, and account security
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px', backgroundColor: '#ECFDF5',
            color: '#065F46', border: '1px solid #A7F3D0', fontSize: '12px', fontWeight: 700
          }}>
            <CheckCircle size={14} /> GovPKI Certified Active Account
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
        
        {/* Left Column: User Profile & Photo Card */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
          padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          
          {/* Avatar Container with Upload Hover Overlay */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #BFA046, #D4AF37)', color: '#000',
                fontSize: '34px', fontWeight: 800, display: 'flex', alignItems: 'center',
                justifyContent: 'center', boxShadow: '0 6px 18px rgba(191,160,70,0.3)',
                border: '3.5px solid #FFF', cursor: 'pointer', overflow: 'hidden',
                position: 'relative'
              }}
              title="Click to change profile picture"
            >
              {currentUser?.avatarPhoto ? (
                <img
                  src={currentUser.avatarPhoto}
                  alt={currentUser?.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                currentUser?.avatar || 'JR'
              )}

              {/* Hover Overlay Icon */}
              <div style={{
                position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s ease', color: '#FFF'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <Camera size={26} />
              </div>
            </div>

            {/* Hidden Real File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />

            {/* Small Camera Button Badge */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute', bottom: '2px', right: '2px',
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: '#8C1515', color: '#FFFFFF', border: '2px solid #FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
              title="Upload Photo"
            >
              <Upload size={14} />
            </button>
          </div>

          {/* Quick Photo Actions */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '4px 10px', fontSize: '11px', fontWeight: 700, borderRadius: '6px',
                backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <Upload size={12} /> Upload Photo
            </button>
            {currentUser?.avatarPhoto && (
              <button
                onClick={handleRemovePhoto}
                style={{
                  padding: '4px 10px', fontSize: '11px', fontWeight: 700, borderRadius: '6px',
                  backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                }}
              >
                <Trash2 size={12} /> Remove
              </button>
            )}
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1A1209', margin: 0 }}>
            {currentUser?.name || 'Jose Reyes'}
          </h3>
          <span style={{
            display: 'inline-block', fontSize: '11px', fontWeight: 700, color: '#8C1515',
            backgroundColor: '#FDF0F0', border: '1px solid rgba(140,21,21,0.2)',
            padding: '3px 12px', borderRadius: '12px', marginTop: '6px'
          }}>
            {currentUser?.roleLabel || 'Admin / Budget Officer'}
          </span>
          <p style={{ fontSize: '12px', color: '#6B6355', marginTop: '6px', marginBottom: '12px' }}>
            {currentUser?.email || 'jose.reyes@culturalcenter.gov.ph'}
          </p>

          {/* Edit Profile & Change Password Primary Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '16px' }}>
            <button
              onClick={() => {
                setProfileForm({
                  name: currentUser?.name || 'Jose Reyes',
                  email: currentUser?.email || 'jose.reyes@culturalcenter.gov.ph',
                  phone: currentUser?.phone || '+63 (02) 8832-1125 local 1402',
                  division: currentUser?.division || 'Financial Services Division (FSD)',
                  avatar: currentUser?.avatar || 'JR',
                });
                setIsEditProfileOpen(true);
              }}
              style={{
                width: '100%', padding: '9px 14px', borderRadius: '6px', fontSize: '12px',
                fontWeight: 700, backgroundColor: '#8C1515', color: '#FFFFFF', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: '0 2px 4px rgba(140,21,21,0.2)'
              }}
            >
              <Edit3 size={14} /> Edit Profile Information
            </button>

            <button
              onClick={() => {
                setPasswordError('');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setIsChangePasswordOpen(true);
              }}
              style={{
                width: '100%', padding: '9px 14px', borderRadius: '6px', fontSize: '12px',
                fontWeight: 700, backgroundColor: '#FFFFFF', color: '#1E293B', border: '1px solid #D1D5DB',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <Key size={14} style={{ color: '#D4AF37' }} /> Change Password
            </button>
          </div>

          {/* Profile Details List */}
          <div style={{
            width: '100%', borderTop: '1px solid #F3F4F6', pt: '16px',
            display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>Contact No:</span>
              <span style={{ fontWeight: 700, color: '#1A1209' }}>{currentUser?.phone || '+63 (02) 8832-1125'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>Division / Office:</span>
              <span style={{ fontWeight: 700, color: '#1A1209' }}>{currentUser?.division || 'Financial Services Division (FSD)'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>User ID:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#8C1515' }}>{currentUser?.id || 'CCP-USER-001'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>GovPKI Cert:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#059669', fontWeight: 600 }}>PH-DICT-88942-PKI</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>Account Status:</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>ACTIVE & CERTIFIED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>Password Changed:</span>
              <span style={{ color: '#4B5563', fontWeight: 600 }}>{currentUser?.passwordLastChanged || 'Recent'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Permissions & Security Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Role Permissions Matrix */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
            padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Shield size={20} style={{ color: '#BFA046' }} />
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1209', margin: 0 }}>Role Permissions & Access Matrix</h4>
                <p style={{ fontSize: '12px', color: '#6B6355', margin: 0 }}>System scopes granted under COA/GAM security protocols</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(currentUser?.permissions || [
                'bur.create', 'bur.certify', 'bur.approve', 'dv.create', 'dv.certify',
                'ledger.entry', 'ledger.view', 'audit.export', 'system.configure'
              ]).map((perm) => (
                <span
                  key={perm}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '6px', backgroundColor: '#F8F6F3',
                    border: '1px solid #E8E2D9', fontSize: '11px', fontFamily: 'monospace',
                    fontWeight: 600, color: '#1A1209'
                  }}
                >
                  <CheckCircle size={12} style={{ color: '#059669' }} />
                  {perm}
                </span>
              ))}
            </div>
          </div>

          {/* Security & Authentication Options */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
            padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Lock size={20} style={{ color: '#2563EB' }} />
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1209', margin: 0 }}>GovPKI Security & 2FA Settings</h4>
                <p style={{ fontSize: '12px', color: '#6B6355', margin: 0 }}>Multi-factor authentication and session management</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>GovPKI Digital Certificate (2FA)</div>
                  <div style={{ fontSize: '12px', color: '#6B6355' }}>Mandatory digital signing for BUR obligations & DV approvals</div>
                </div>
                <button
                  onClick={() => {
                    const newVal = !twoFactorEnabled;
                    setTwoFactorEnabled(newVal);
                    showToast(newVal ? '✓ GovPKI 2FA is now ENABLED' : '⚠️ GovPKI 2FA has been DISABLED');
                  }}
                  style={{
                    padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    backgroundColor: twoFactorEnabled ? '#ECFDF5' : '#FEF2F2',
                    color: twoFactorEnabled ? '#047857' : '#DC2626',
                    border: twoFactorEnabled ? '1px solid #A7F3D0' : '1px solid #FCA5A5'
                  }}
                >
                  {twoFactorEnabled ? 'ENABLED & VERIFIED' : 'DISABLED'}
                </button>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>Automatic Session Timeout</div>
                  <div style={{ fontSize: '12px', color: '#6B6355' }}>Locks session after inactivity to prevent unauthorized access</div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>30 Minutes</span>
              </div>
            </div>
          </div>

          {/* Active Sessions Table */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
            padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1209', margin: '0 0 12px 0' }}>Active Login Sessions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: '8px', border: '1px solid #F3F4F6', backgroundColor: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Globe size={18} style={{ color: '#6B6355' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{session.device}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>IP: {session.ip} · {session.location}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                    backgroundColor: session.time === 'Active Now' ? '#ECFDF5' : '#F3F4F6',
                    color: session.time === 'Active Now' ? '#047857' : '#6B7280'
                  }}>
                    {session.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. EDIT PROFILE MODAL */}
      {/* ========================================================================= */}
      {isEditProfileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', width: '100%', maxWidth: '480px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #E5E7EB', overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: '#FAFAFA'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} style={{ color: '#8C1515' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#111827' }}>
                  Edit Profile Information
                </h3>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact / Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Division / Office</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.division}
                  onChange={(e) => setProfileForm({ ...profileForm, division: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Avatar Initials (2 Letters)</label>
                <input
                  type="text"
                  maxLength={2}
                  className="form-control"
                  style={{ width: '80px', textTransform: 'uppercase', fontWeight: 700 }}
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value.toUpperCase() })}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#8C1515', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={15} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CHANGE PASSWORD MODAL */}
      {/* ========================================================================= */}
      {isChangePasswordOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', width: '100%', maxWidth: '460px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #E5E7EB', overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: '#FAFAFA'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} style={{ color: '#D4AF37' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#111827' }}>
                  Change GovPKI Password
                </h3>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleChangePassword} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {passwordError && (
                <div style={{
                  padding: '10px 14px', borderRadius: '6px', backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <AlertTriangle size={15} />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Current Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    className="form-control"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF'
                    }}
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF'
                    }}
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordForm.newPassword && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                      <span style={{ color: '#6B7280' }}>Password Strength:</span>
                      <span style={{ color: passStrength.color }}>{passStrength.label}</span>
                    </div>
                    <div style={{ height: '4px', width: '100%', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(passStrength.score / 3) * 100}%`,
                        backgroundColor: passStrength.color,
                        transition: 'all 0.3s ease'
                      }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    className="form-control"
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF'
                    }}
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div style={{
                padding: '10px 12px', borderRadius: '6px', backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB', fontSize: '11px', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '4px'
              }}>
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Security Guidelines:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {passwordForm.newPassword.length >= 6 ? <Check size={12} style={{ color: '#10B981' }} /> : '•'} At least 6 characters in length
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/[0-9]/.test(passwordForm.newPassword) ? <Check size={12} style={{ color: '#10B981' }} /> : '•'} Includes numeric digits (0-9)
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#8C1515', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Key size={15} /> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
