import React from 'react';
import { LayoutDashboard, Table, CreditCard, Globe, Bell, User, LogIn, UserPlus } from 'lucide-react';

export const MaterialSidebar: React.FC = () => {
  return (
    <aside className="material-sidebar-wrapper">
      <div className="material-sidebar-logo">
        <div className="material-logo-icon">M</div>
        <span className="font-extrabold text-sm tracking-tight">Material Dashboard 2</span>
      </div>

      <nav className="material-nav-list">
        <a href="#" className="material-nav-link active"><LayoutDashboard size={18} /> Dashboard</a>
        <a href="#" className="material-nav-link"><Table size={18} /> Tables</a>
        <a href="#" className="material-nav-link"><CreditCard size={18} /> Billing</a>
        <a href="#" className="material-nav-link"><Globe size={18} /> RTL</a>
        <a href="#" className="material-nav-link"><Bell size={18} /> Notifications</a>
        <a href="#" className="material-nav-link"><User size={18} /> Profile</a>
        <a href="#" className="material-nav-link"><LogIn size={18} /> Sign In</a>
        <a href="#" className="material-nav-link"><UserPlus size={18} /> Sign Up</a>
      </nav>

      <button className="material-pro-upgrade">UPGRADE TO PRO</button>
    </aside>
  );
};
