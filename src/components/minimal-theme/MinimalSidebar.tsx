import React from 'react';
import { PieChart, User, ShoppingBag, BookOpen, Lock, AlertCircle, Rocket } from 'lucide-react';

export const MinimalSidebar: React.FC = () => {
  return (
    <aside className="minimal-sidebar-wrapper">
      <div className="minimal-sidebar-logo">
        <PieChart size={24} className="text-blue-600" />
        <span>Stackly</span>
      </div>

      {/* User Profile Card */}
      <div className="minimal-user-box">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
          alt="Jaydon Frankie"
          className="minimal-avatar-img"
        />
        <div>
          <p className="text-xs font-bold text-slate-800">Jaydon Frankie</p>
          <p className="text-[10px] font-semibold text-slate-400">Admin Manager</p>
        </div>
      </div>

      <nav className="minimal-nav-list">
        <a href="#" className="minimal-nav-link active"><PieChart size={18} /> Dashboard</a>
        <a href="#" className="minimal-nav-link"><User size={18} /> User</a>
        <a href="#" className="minimal-nav-link"><ShoppingBag size={18} /> Product</a>
        <a href="#" className="minimal-nav-link"><BookOpen size={18} /> Blog</a>
        <a href="#" className="minimal-nav-link"><Lock size={18} /> Login</a>
        <a href="#" className="minimal-nav-link"><AlertCircle size={18} /> Not Found</a>
      </nav>

      {/* Bottom Upgrade Card Widget */}
      <div className="minimal-cta-box">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xl">
          <Rocket size={24} />
        </div>
        <div>
          <p className="text-xs font-black text-slate-800">Get more?</p>
          <p className="text-[10px] text-slate-400 font-medium">From only $69</p>
        </div>
        <button className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-md">
          Upgrade to Pro
        </button>
      </div>
    </aside>
  );
};
