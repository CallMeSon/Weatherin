import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AuthContext = createContext(null);

// Decode JWT payload without external library
function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const STORAGE_KEY = 'weatherin_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const googleBtnRef = useRef(null);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if token is expired
        if (parsed.exp && parsed.exp * 1000 > Date.now()) {
          setUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  // Google Sign-In callback
  const handleCredentialResponse = useCallback((response) => {
    const payload = decodeJwt(response.credential);
    if (payload) {
      const userData = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        sub: payload.sub,
        exp: payload.exp,
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
  }, []);

  // Initialize Google Identity Services
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_CLIENT_ID_HERE') {
      setIsLoading(false);
      return;
    }

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: true,
        });
        setIsLoading(false);
      }
    };

    // GIS script might already be loaded
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          initGoogle();
        }
      }, 100);
      // Timeout after 5s
      setTimeout(() => {
        clearInterval(checkInterval);
        setIsLoading(false);
      }, 5000);
    }
  }, [handleCredentialResponse]);

  const signIn = useCallback(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_CLIENT_ID_HERE') {
      console.warn('[Weatherin] Google Client ID belum di-set. Buka file .env dan isi VITE_GOOGLE_CLIENT_ID.');
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: render button in a temporary container and click it
          const tempDiv = document.createElement('div');
          tempDiv.style.position = 'fixed';
          tempDiv.style.top = '50%';
          tempDiv.style.left = '50%';
          tempDiv.style.transform = 'translate(-50%, -50%)';
          tempDiv.style.zIndex = '10000';
          tempDiv.style.background = 'var(--bg-card, #fff)';
          tempDiv.style.padding = '2rem';
          tempDiv.style.borderRadius = '16px';
          tempDiv.style.boxShadow = '0 25px 50px rgba(0,0,0,0.25)';
          tempDiv.id = 'google-signin-fallback';
          document.body.appendChild(tempDiv);

          // Backdrop
          const backdrop = document.createElement('div');
          backdrop.style.position = 'fixed';
          backdrop.style.inset = '0';
          backdrop.style.background = 'rgba(0,0,0,0.5)';
          backdrop.style.zIndex = '9999';
          backdrop.id = 'google-signin-backdrop';
          backdrop.onclick = () => {
            document.getElementById('google-signin-fallback')?.remove();
            backdrop.remove();
          };
          document.body.appendChild(backdrop);

          window.google.accounts.id.renderButton(tempDiv, {
            theme: 'outline',
            size: 'large',
            width: 300,
            text: 'signin_with',
          });
        }
      });
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    // Clean up fallback UI
    document.getElementById('google-signin-fallback')?.remove();
    document.getElementById('google-signin-backdrop')?.remove();
  }, []);

  const isConfigured = (() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    return clientId && clientId !== 'YOUR_CLIENT_ID_HERE';
  })();

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
