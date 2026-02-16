import React, { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((previous) => [...previous, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 2000 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              backgroundColor: toast.type === 'error' ? '#6E2C2C' : '#5F6F52',
              color: '#F5F1E8',
              borderRadius: 10,
              padding: '10px 14px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
              minWidth: 220,
              fontSize: 13,
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
