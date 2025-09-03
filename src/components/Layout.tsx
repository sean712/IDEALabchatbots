import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen bg-slate-50">
      <main className="h-full p-4 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;