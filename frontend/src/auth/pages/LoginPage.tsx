import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_HOME_PATHS } from '../../security/roles/roles';
import { authService } from '../services/auth.service';
import { useTheme } from '../../design-system/theme/theme';
import { StacklyLogo } from '../../components/common/StacklyLogo';
import {
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Lock,
  User,
  Hash,
  Briefcase,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';

const ROLE_DETAILS = {
  admin: {
    label: 'Admin Portal',
    email: 'admin@thestackly.com',
    roleName: 'Administrator',
    accessLevel: 'Super Admin (Full Access)',
    permissions: 'Read/Write All, Audit Logs, Security Policies',
    dashboard: 'Admin Control Center'
  },
  hr: {
    label: 'HR Manager',
    email: 'hr@thestackly.com',
    roleName: 'HR Manager',
    accessLevel: 'Department Admin',
    permissions: 'Employee Profiles, Leaves, Attendance Analytics',
    dashboard: 'HR Operations Center'
  },
  manager: {
    label: 'Team Manager',
    email: 'manager@thestackly.com',
    roleName: 'Department Manager',
    accessLevel: 'Team Scope (Read/Write)',
    permissions: 'Department Scoped Analytics, Approval Roster',
    dashboard: 'Manager Dashboard'
  },
  lead: {
    label: 'Team Lead',
    email: 'lead@thestackly.com',
    roleName: 'Team Lead',
    accessLevel: 'Team Scope (Read-Only)',
    permissions: 'Team Productivity Metrics, Attendance Logs',
    dashboard: 'Lead Dashboard'
  },
  employee: {
    label: 'Employee',
    email: 'employee@thestackly.com',
    roleName: 'Employee',
    accessLevel: 'Self Service',
    permissions: 'View Profile, Request Leaves, Attendance Logs',
    dashboard: 'Employee Dashboard'
  }
};

export const LoginPage: React.FC = () => {
  const { login, verifyMfa, resendMfa, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mfaChannel, setMfaChannel] = useState<'email' | 'sms'>('email');

  // Active form tab: 'login' | 'otp' | 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'otp' | 'signup'>(() => {
    const savedTab = sessionStorage.getItem('login_active_tab');
    return (savedTab === 'otp' || savedTab === 'signup') ? savedTab : 'login';
  });
  
  // Selected role config
  const [selectedRole, setSelectedRole] = useState<'admin' | 'hr' | 'manager' | 'lead' | 'employee'>('admin');

  // Forms states
  const [email, setEmail] = useState('admin@thestackly.com');
  const [password, setPassword] = useState('StacklyWFA2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP inputs & session states
  const [otpValues, setOtpValues] = useState<string[]>(() => {
    const hint = sessionStorage.getItem('mfa_otp_dev_hint');
    return hint ? hint.split('') : ['', '', '', '', '', ''];
  });
  const [challengeId, setChallengeId] = useState<string | null>(() => sessionStorage.getItem('mfa_challenge_id'));
  const [expiresAt, setExpiresAt] = useState<string | null>(() => sessionStorage.getItem('mfa_expires_at'));
  const [timer, setTimer] = useState(0);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.removeItem('mfa_challenge_id');
      sessionStorage.removeItem('mfa_expires_at');
      sessionStorage.removeItem('mfa_otp_dev_hint');
      sessionStorage.removeItem('login_active_tab');
      const homePath = ROLE_HOME_PATHS[role] || '/admin/dashboard';
      navigate(homePath);
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    if (challengeId) {
      sessionStorage.setItem('mfa_challenge_id', challengeId);
    } else {
      sessionStorage.removeItem('mfa_challenge_id');
    }
  }, [challengeId]);

  useEffect(() => {
    sessionStorage.setItem('login_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (expiresAt) {
      sessionStorage.setItem('mfa_expires_at', expiresAt);
    } else {
      sessionStorage.removeItem('mfa_expires_at');
    }
  }, [expiresAt]);

  useEffect(() => {
    if (!expiresAt) {
      setTimer(0);
      return;
    }
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setTimer(remaining);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    if (expiresAt && timer === 0) {
      setError('OTP expired. Please request a new OTP.');
      setOtpValues(['', '', '', '', '', '']);
    }
  }, [expiresAt, timer]);

  const handleRoleSelect = (roleKey: 'admin' | 'hr' | 'manager' | 'lead' | 'employee') => {
    setSelectedRole(roleKey);
    setEmail(ROLE_DETAILS[roleKey].email);
    setPassword('StacklyWFA2026!');
    setError('');
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '');
    if (!digit && value !== '') return;
    const newOtp = [...otpValues];
    newOtp[index] = digit.substring(digit.length - 1);
    setOtpValues(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-submit when exactly 6 digits entered
    const currentCode = [...newOtp];
    currentCode[index] = digit.substring(digit.length - 1);
    const codeStr = currentCode.join('');
    if (codeStr.length === 6 && !codeStr.includes('')) {
      verifyMfaAction(codeStr);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      const newOtp = text.split('');
      setOtpValues(newOtp);
      otpRefs[5].current?.focus();
      verifyMfaAction(text);
    }
  };

  const handleResendOtp = async () => {
    if (!challengeId) {
      setError('MFA session expired or invalid. Please request a new code.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const res = await resendMfa(challengeId);
      setChallengeId(res.challengeId);
      setExpiresAt(res.expiresAt);
      setOtpValues(['', '', '', '', '', '']);
      let otpStr = '';
      if (res.otpDevHint) {
        otpStr = res.otpDevHint.toString();
        setOtpValues(otpStr.split(''));
        sessionStorage.setItem('mfa_otp_dev_hint', otpStr);
      } else {
        sessionStorage.removeItem('mfa_otp_dev_hint');
      }
      setSuccessMsg('MFA verification code has been resent.');
      if (otpStr) {
        verifyMfaAction(otpStr, res.challengeId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const emailDomain = email.trim().toLowerCase();
    if (!emailDomain.endsWith('@thestackly.com') && !emailDomain.endsWith('@company.com')) {
      setError('Only official @thestackly.com or @company.com company email addresses are permitted.');
      return;
    }

    setIsLoading(true);
    try {
      const res = (await authService.login(email.trim(), password)) as any;
      if (res.requiresMfa) {
        setChallengeId(res.challengeId);
        setExpiresAt(res.expiresAt);
        setOtpValues(['', '', '', '', '', '']);
        let otpStr = '';
        if (res.otpDevHint) {
          otpStr = res.otpDevHint.toString();
          setOtpValues(otpStr.split(''));
          sessionStorage.setItem('mfa_otp_dev_hint', otpStr);
        } else {
          sessionStorage.removeItem('mfa_otp_dev_hint');
        }
        setActiveTab('otp');
        setSuccessMsg('OTP Code has been generated.');
        if (otpStr) {
          verifyMfaAction(otpStr, res.challengeId);
        }
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfaAction = async (otpCode: string, currentChallengeId: string | null = challengeId) => {
    if (!currentChallengeId) {
      setError('MFA session expired or invalid. Please request a new code.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await verifyMfa(currentChallengeId, otpCode);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
      setOtpValues(['', '', '', '', '', '']);
      sessionStorage.removeItem('mfa_otp_dev_hint');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otpValues.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }
    await verifyMfaAction(otpCode);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!agreeTerms) {
      setError('You must agree to the Terms & Privacy Policy.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.signup({
        name: fullName,
        email: email,
        password: password,
        department: department,
        role: 'EMPLOYEE'
      });
      setSuccessMsg('Account registered successfully! Try logging in.');
      setFullName('');
      setEmployeeId('');
      setDepartment('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setActiveTab('login');
    } catch (err: any) {
      setError(err.message || 'Failed to register account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans bg-[#050B18] text-slate-100 p-4 transition-colors duration-300 relative overflow-y-auto">
      
      {/* Glow behind login elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Panel/Card */}
      <div className="w-full max-w-[460px] p-6 sm:p-8 rounded-[20px] bg-[#0B1224]/85 backdrop-blur-xl border border-slate-800/80 shadow-2xl relative z-10 space-y-6">
        
        {/* Logo and Welcome Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          {/* Logo with Wave shape */}
          <div className="flex items-center gap-2 mb-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#38BDF8]"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="text-lg font-black tracking-widest text-[#38BDF8]">STACKLY</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 font-medium">Sign in to access your dashboard</p>
        </div>

        {/* Alerts / Error messages */}
        {(error || successMsg) && (
          <div className="space-y-2">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle size={14} className="shrink-0" />
                <span className="font-semibold" id="errorMessage">{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2 animate-fadeIn">
                <ShieldCheck size={14} className="shrink-0" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Form elements */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4" id="loginForm">
            {/* Roles Selection */}
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roles</label>
              <div className="relative">
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => handleRoleSelect(e.target.value as any)}
                  className="w-full appearance-none bg-[#050B18] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#10B981] transition-colors cursor-pointer shadow-sm font-semibold"
                >
                  <option value="admin">Admin — Sarah Connor</option>
                  <option value="hr">HR Manager — Elena Rostova</option>
                  <option value="manager">Team Manager — David Sterling</option>
                  <option value="lead">Team Lead — Marcus Vance</option>
                  <option value="employee">Employee — Alex Mercer</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email / Employee ID</label>
              <input
                type="email"
                id="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@thestackly.com"
                className="w-full bg-[#050B18] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#10B981] transition-colors font-semibold"
              />
            </div>

            {/* MFA Delivery Channel Dropdown/Radios */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MFA Delivery Channel</label>
              <div className="flex items-center gap-6 py-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-350">
                  <input
                    type="radio"
                    name="mfaChannel"
                    value="email"
                    checked={mfaChannel === 'email'}
                    onChange={() => setMfaChannel('email')}
                    className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 bg-[#050B18] border-slate-800"
                  />
                  Email
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-350">
                  <input
                    type="radio"
                    name="mfaChannel"
                    value="sms"
                    checked={mfaChannel === 'sms'}
                    onChange={() => setMfaChannel('sms')}
                    className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 bg-[#050B18] border-slate-800"
                  />
                  SMS
                </label>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#050B18] border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#10B981] transition-colors font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-800 bg-[#050B18] text-emerald-500 focus:ring-emerald-500"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => alert('Demo Reset: Verification code is always 849201.')}
                className="text-[#10B981] hover:underline font-bold bg-transparent border-none p-0 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                id="loginBtn"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] active:scale-[0.99] transition-all text-white font-black text-xs tracking-wider cursor-pointer border-none shadow-md shadow-emerald-500/10"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-slate-800" />
                <span className="px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">OR</span>
                <div className="flex-1 border-t border-slate-800" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('otp');
                  setError('');
                  setSuccessMsg('');
                }}
                className="w-full py-2.5 rounded-xl bg-transparent border border-slate-800 text-slate-300 hover:bg-slate-800/40 text-xs font-bold transition-all cursor-pointer"
              >
                Login with OTP
              </button>
            </div>
          </form>
        )}

        {/* OTP tab */}
        {activeTab === 'otp' && (
          <form onSubmit={handleOtpLoginSubmit} className="space-y-4">
            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Corporate Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@thestackly.com"
                  className="flex-1 bg-[#050B18] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#10B981] transition-colors font-semibold"
                />
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0 || isLoading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 border-none cursor-pointer"
                >
                  {timer > 0 ? `Resend (${timer}s)` : 'Resend'}
                </button>
              </div>
            </div>

            {/* OTP input fields */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">6-Digit OTP Code</label>
                <span className="text-[9px] text-slate-500 font-bold font-mono">Resend OTP in 00:{timer.toString().padStart(2, '0')}</span>
              </div>
              <div className="flex justify-between gap-2 py-1">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    required
                    maxLength={1}
                    value={val}
                    disabled={timer === 0 || isLoading}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-12 rounded-xl text-center text-sm font-black font-mono bg-[#050B18] border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner disabled:opacity-50"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timer > 0 || isLoading}
                className="text-blue-500 hover:underline font-bold bg-transparent border-none p-0 cursor-pointer disabled:opacity-50 disabled:no-underline"
              >
                Resend OTP code
              </button>
              <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#10B981] animate-pulse" /> Auto Verify Enabled
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || timer === 0}
              className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-emerald-500/10 border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? 'Verifying...' : 'Sign In with OTP'}
            </button>

            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-slate-800" />
              <span className="px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">OR</span>
              <div className="flex-1 border-t border-slate-800" />
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccessMsg('');
              }}
              className="w-full py-2.5 rounded-xl bg-transparent border border-slate-800 text-slate-300 hover:bg-slate-800/40 text-xs font-bold transition-all cursor-pointer"
            >
              Back to Password Login
            </button>
          </form>
        )}

        {/* Bottom controls: Privacy Policy | Terms, Light/Dark Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <a href="#" className="hover:underline text-[#10B981]">Privacy Policy</a>
            <a href="#" className="hover:underline text-[#10B981]">Terms</a>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#050B18] border border-slate-800 text-[10px] text-slate-200 hover:bg-slate-800 font-bold transition-colors cursor-pointer"
          >
            <span className="text-amber-500 font-black">●</span> {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Footer link to sign up */}
        <div className="text-center text-xs text-slate-400 pt-1">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#10B981] hover:underline font-bold">
            Create account
          </Link>
        </div>

      </div>
    </div>
  );
};
