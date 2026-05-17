import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, BellOff, Check, CheckCheck, Trash2, X } from 'lucide-react';

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
}

export default function NotificationPanel() {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    permissionStatus,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
    enableNotifications,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Don't show if not logged in
  if (!user) {
    return (
      <button className="navbar-icon-btn" title="Login untuk melihat notifikasi" aria-label="Notifications disabled" disabled>
        <BellOff size={18} />
      </button>
    );
  }

  return (
    <div className="notif-wrapper" ref={panelRef}>
      <button
        className="navbar-icon-btn notif-bell-btn"
        onClick={() => setOpen(!open)}
        title="Notifikasi"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-panel">
          {/* Header */}
          <div className="notif-panel-header">
            <h3 className="notif-panel-title">Notifikasi</h3>
            <div className="notif-panel-actions">
              {notifications.length > 0 && (
                <>
                  <button
                    className="notif-action-btn"
                    onClick={markAllAsRead}
                    title="Tandai semua sudah dibaca"
                  >
                    <CheckCheck size={16} />
                  </button>
                  <button
                    className="notif-action-btn notif-action-danger"
                    onClick={() => {
                      clearAll();
                    }}
                    title="Hapus semua"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
              <button
                className="notif-action-btn"
                onClick={() => setOpen(false)}
                title="Tutup"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Permission banner */}
          {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
            <div className="notif-permission-banner">
              <span>🔔 Aktifkan notifikasi browser untuk peringatan cuaca</span>
              <button
                className="notif-enable-btn"
                onClick={enableNotifications}
              >
                Aktifkan
              </button>
            </div>
          )}

          {/* List */}
          <div className="notif-panel-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={32} className="notif-empty-icon" />
                <p className="notif-empty-text">Belum ada notifikasi</p>
                <p className="notif-empty-sub">Notifikasi cuaca akan muncul otomatis saat kondisi tertentu terjadi.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notif-item ${notif.read ? 'notif-read' : 'notif-unread'}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notif-item-icon">{notif.icon}</div>
                  <div className="notif-item-content">
                    <div className="notif-item-title">{notif.title}</div>
                    <div className="notif-item-message">{notif.message}</div>
                    <div className="notif-item-time">{formatTimeAgo(notif.timestamp)}</div>
                  </div>
                  <button
                    className="notif-item-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notif.id);
                    }}
                    title="Hapus"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
