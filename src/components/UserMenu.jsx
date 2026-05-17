import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, ChevronDown } from 'lucide-react';

export default function UserMenu() {
  const { user, signIn, signOut, isConfigured } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Not configured — show disabled hint
  if (!isConfigured) {
    return (
      <button
        className="navbar-icon-btn user-signin-btn"
        onClick={() => alert('Google Client ID belum di-set.\nBuka file .env dan isi VITE_GOOGLE_CLIENT_ID.')}
        title="Login belum tersedia"
        aria-label="Sign in not configured"
      >
        <User size={18} />
      </button>
    );
  }

  // Not logged in — show sign in button
  if (!user) {
    return (
      <button
        className="google-signin-btn"
        onClick={signIn}
        title="Masuk dengan Google"
        aria-label="Sign in with Google"
      >
        <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>Masuk</span>
      </button>
    );
  }

  // Logged in — show avatar and dropdown
  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-avatar-btn"
        onClick={() => setOpen(!open)}
        aria-label="User menu"
        aria-expanded={open}
      >
        <img
          src={user.picture}
          alt={user.name}
          className="user-avatar-img"
          referrerPolicy="no-referrer"
        />
        <ChevronDown size={14} className={`user-chevron ${open ? 'rotated' : ''}`} />
      </button>

      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <img
              src={user.picture}
              alt={user.name}
              className="user-dropdown-avatar"
              referrerPolicy="no-referrer"
            />
            <div className="user-dropdown-info">
              <div className="user-dropdown-name">{user.name}</div>
              <div className="user-dropdown-email">{user.email}</div>
            </div>
          </div>
          <div className="user-dropdown-divider" />
          <button
            className="user-dropdown-item user-dropdown-signout"
            onClick={() => {
              signOut();
              setOpen(false);
            }}
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      )}
    </div>
  );
}
