import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:pl-64 min-h-screen">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;