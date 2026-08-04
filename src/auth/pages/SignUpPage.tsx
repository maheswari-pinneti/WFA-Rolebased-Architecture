import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StacklyLogo } from '../../components/common/StacklyLogo';
import {
  Mail,
  User,
  Building2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  LogIn,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const SignUpPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [roleType, setRoleType] = useState('EMPLOYEE');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.toLowerCase().endsWith('@thestackly.com')) {
      setError('Only official @thestackly.com corporate email addresses are permitted.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      login(email);
      navigate('/admin/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#0B1120] text-slate-100 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* PERFECTLY CENTERED SIGN UP CARD */}
      <div className="w-full max-w-[460px] mx-auto space-y-6 bg-slate-900 border border-slate-800 p-7 sm:p-9 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl">
        
        {/* Brand Header */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <StacklyLogo size={36} />
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Create Enterprise Account
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium max-w-xs mx-auto">
              Register your corporate profile to access Workforce Analytics.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {isSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Account created successfully! Provisioning session...</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">Full Name</label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Connor"
                style={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  color: '#FFFFFF'
                }}
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Corporate Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">Corporate Email</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah.connor@thestackly.com"
                style={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  color: '#FFFFFF'
                }}
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Department Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">Department</label>
            <div className="relative flex items-center">
              <Building2 size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  color: '#FFFFFF'
                }}
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors shadow-inner cursor-pointer"
              >
                <option value="Engineering">Engineering & Development</option>
                <option value="Human Resources">Human Resources & People</option>
                <option value="Product Operations">Product & Design Operations</option>
                <option value="Sales & Marketing">Enterprise Sales & Growth</option>
                <option value="Finance & Legal">Finance & Corporate Legal</option>
              </select>
            </div>
          </div>

          {/* Role Scope Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">Assigned Role Scope</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRoleType('EMPLOYEE')}
                style={{
                  backgroundColor: roleType === 'EMPLOYEE' ? '#2563EB' : '#1E293B',
                  borderColor: roleType === 'EMPLOYEE' ? '#3B82F6' : '#334155',
                  color: '#FFFFFF'
                }}
                className="py-2 px-3 rounded-xl text-xs font-extrabold border transition-all text-center cursor-pointer"
              >
                Employee
              </button>

              <button
                type="button"
                onClick={() => setRoleType('MANAGER')}
                style={{
                  backgroundColor: roleType === 'MANAGER' ? '#059669' : '#1E293B',
                  borderColor: roleType === 'MANAGER' ? '#10B981' : '#334155',
                  color: '#FFFFFF'
                }}
                className="py-2 px-3 rounded-xl text-xs font-extrabold border transition-all text-center cursor-pointer"
              >
                Dept Manager
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-xs text-slate-400 select-none cursor-pointer">
              I agree to the <span className="text-blue-400 underline">Enterprise Security Policy</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!agreeTerms}
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              color: '#FFFFFF',
              border: 'none'
            }}
            className="w-full py-3 rounded-xl font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:opacity-95"
          >
            <span>Register Enterprise Account</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Back to Sign In */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col items-center gap-3 text-center">
          <div className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline font-bold inline-flex items-center gap-1">
              <LogIn size={13} /> Sign In
            </Link>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
            <ShieldCheck size={12} className="text-emerald-400" /> 256-Bit Encrypted Registration Protocol
          </div>
        </div>

      </div>
    </div>
  );
};
