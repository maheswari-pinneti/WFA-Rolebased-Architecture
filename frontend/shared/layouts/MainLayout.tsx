import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { EnterpriseHeader } from './components/EnterpriseHeader';
import { Sidebar } from './components/Sidebar';
import { SupportModal } from '../components/SupportModal';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Initialize collapsed state from localStorage (default to false / expanded on desktop)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Save collapsed state changes to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <div data-role={role} className="app-shell min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Fixed Enterprise Header */}
      <EnterpriseHeader onToggleSidebar={toggleSidebar} onOpenHelp={() => setSupportModalOpen(true)} />

      {/* Main Body */}
      <div className="main-body flex-1 flex relative">
        {/* Sleek Dynamic Modular Sidebar Navigation */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onOpenSupport={() => setSupportModalOpen(true)}
        />

        {/* Main Content Region */}
        <main className={`app-main flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 transition-all duration-300 ${
          collapsed ? 'md:ml-[64px]' : 'md:ml-[250px]'
        }`}>
          {children}
        </main>
      </div>

      {/* Support & IT Helpdesk Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </div>
  );
};

