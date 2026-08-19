import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  LogIn,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { authService } from '../services/auth.service';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requestedRole, setRequestedRole] = useState('EMPLOYEE');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simple password strength check
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: 'bg-slate-200' };
    if (pwd.length < 6) return { label: 'Weak (min 6 chars)', color: 'bg-rose-500' };
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    if (pwd.length >= 8 && hasLetters && hasNumbers && hasSpecial) {
      return { label: 'Strong', color: 'bg-emerald-500' };
    }
    return { label: 'Medium', color: 'bg-amber-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please fill in both First Name and Last Name.');
      return;
    }

    if (!email.toLowerCase().endsWith('@thestackly.com') && !email.toLowerCase().endsWith('@company.com')) {
      setError('Only official @thestackly.com or @company.com corporate email addresses are permitted.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await authService.signup({
        name: fullName,
        email: email,
        password: password,
        department: 'Engineering', // Default fallback
        role: requestedRole,
        location: 'Hyderabad'
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 font-sans overflow-y-auto lg:overflow-hidden bg-[#050B18]">
      
      {/* LEFT SECTION: Branding & Info */}
      <div className="order-2 lg:order-1 bg-[#050B18] p-8 md:p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden min-h-[50vh] lg:min-h-screen border-t lg:border-t-0 lg:border-r border-slate-800/80">
        
        {/* Subtle Background glow */}
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-8 relative z-10 my-auto">
          {/* Logo & Company Branding */}
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="text-xl font-black tracking-widest text-white leading-none">STACKLY</span>
          </div>

          {/* Heading Description */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">Join The Platform</p>
            <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
              Scale your team with intelligent insights.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg font-medium">
              Create your workspace today and get full visibility into your workforce operations and department analytics.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono relative z-10">
          <span>⚡ Fast setup • Enterprise grade • Secure</span>
          <span>© 2026 Workforce Analytics Dashboard</span>
        </div>
      </div>

      {/* RIGHT SECTION: Signup Form */}
      <div className="order-1 lg:order-2 bg-slate-50 dark:bg-[#0B1120] p-6 sm:p-12 lg:p-16 flex items-center justify-center min-h-[50vh] lg:min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Glassmorphism Card */}
        <div className="w-full max-w-[440px] p-6 sm:p-8 rounded-[20px] bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl relative z-10 space-y-6">
          
          {/* Header */}
          <div className="auth-header space-y-2">
            <div className="auth-icon w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            </div>
            <p className="secure-text text-[10px] uppercase font-black tracking-widest text-blue-500">New Workspace</p>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create an account</h2>
          </div>

          {/* Alert messages */}
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span className="font-semibold" id="signupMessage">{error}</span>
              </div>
            )}
            {isSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0" />
                <span className="font-semibold">Account created successfully! Redirecting to login...</span>
              </div>
            )}

            <form onSubmit={handleSignUpSubmit} className="space-y-4" id="signupForm">
              
              {/* First Name & Last Name */}
              <div className="flex gap-3">
                <div className="space-y-1.5 flex-1">
                  <label htmlFor="firstname" className="text-xs font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-wider">First Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-455 pointer-events-none" />
                    <input
                      type="text"
                      id="firstname"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full rounded-xl pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 flex-1">
                  <label htmlFor="lastname" className="text-xs font-extrabold text-slate-700 dark:text-slate-355 uppercase tracking-wider">Last Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-455 pointer-events-none" />
                    <input
                      type="text"
                      id="lastname"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full rounded-xl pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Work Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Work Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-455 pointer-events-none" />
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@thestackly.com"
                    className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Requested Role dropdown */}
              <div className="space-y-1.5">
                <label htmlFor="requestedRole" className="text-xs font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Requested Role</label>
                <select
                  id="requestedRole"
                  value={requestedRole}
                  onChange={(e) => setRequestedRole(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer shadow-sm"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>

              {/* Create Password */}
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="text-xs font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Create Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-455 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl pl-9 pr-10 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0 bg-transparent border-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Visual password strength indicator */}
                {password && (
                  <div className="space-y-1 mt-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Password Strength:</span>
                      <span className="uppercase">{strength.label}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength.color} ${
                        strength.label === 'Strong' ? 'w-full' : strength.label === 'Medium' ? 'w-2/3' : 'w-1/3'
                      }`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-455 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl pl-9 pr-10 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0 bg-transparent border-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="signupBtn"
                disabled={isLoading}
                style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#ffffff' }}
                className="w-full py-3 rounded-xl hover:scale-[1.01] font-extrabold text-xs shadow-lg shadow-blue-500/20 transition-all border-none cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? 'Creating Account...' : 'Create Account ➔'}
              </button>
            </form>
          </div>

          {/* Bottom text */}
          <div className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
              Sign in
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
