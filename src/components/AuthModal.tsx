import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  Phone,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const { loginWithDetails, resetUserPassword } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>(initialMode);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Forgot Password / OTP Flow State
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1 = Enter Email/Phone, 2 = Verify OTP, 3 = Reset Password
  const [otpTarget, setOtpTarget] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Google Account Choice Modal State
  const [isGoogleSelecting, setIsGoogleSelecting] = useState(false);

  if (!isOpen) return null;

  // Handle Standard Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please fill in both email and password', 'error');
      return;
    }

    if (email.toLowerCase().includes('admin')) {
      loginWithDetails(email, 'Super Admin', '+91 90000 00000', 'admin');
      showToast('Welcome back, Super Admin!', 'success');
    } else {
      loginWithDetails(email, name || 'Raj Sahani', phone || '+91 98765 43210', 'user');
      showToast(`Successfully signed in as ${email}`, 'success');
    }
    onClose();
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      showToast('Please complete all fields (Name, Email, Phone, Password)', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    loginWithDetails(email, name, phone, 'user');
    showToast(`Account created successfully! Welcome to OneHost Cloud, ${name}!`, 'success');
    onClose();
  };

  // Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpTarget.trim()) {
      showToast('Please enter your registered Phone Number or Email', 'error');
      return;
    }

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setForgotStep(2);
    showToast(`🔑 Security Verification Code sent to ${otpTarget}! Demo Code: ${randomCode}`, 'info');
  };

  // Verify OTP Code
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp.trim()) {
      showToast('Please enter the 6-digit verification OTP', 'error');
      return;
    }

    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '582910' || enteredOtp.trim() === '123456') {
        setForgotStep(3);
        showToast('✅ OTP Verified Successfully! Set your new password below.', 'success');
      } else {
        showToast('Invalid OTP Code. Please enter the correct 6-digit code.', 'error');
      }
    }, 600);
  };

  // Final Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast('Please enter a new password', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    resetUserPassword(otpTarget, newPassword);
    showToast('🎉 Password reset successfully! You can now log in with your new password.', 'success');
    setMode('signin');
    setForgotStep(1);
    setEmail(otpTarget.includes('@') ? otpTarget : 'rajsahani.RgcS@gmail.com');
  };

  // Google OAuth Auth trigger
  const handleGoogleLogin = (googleEmail: string, googleName: string) => {
    loginWithDetails(googleEmail, googleName, '+91 98765 43210', 'user');
    showToast(`Authenticated via Google OAuth as ${googleEmail}`, 'success');
    setIsGoogleSelecting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header Bar */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-400">
              1
            </div>
            <div>
              <div className="font-bold text-lg text-white">OneHost Cloud Account</div>
              <div className="text-xs text-slate-400">
                {mode === 'signin' && 'Sign in to access hosting, AI models & domains'}
                {mode === 'register' && 'Create your free account with ₹1,000 wallet bonus'}
                {mode === 'forgot' && 'Reset your password via Mobile OTP verification'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Google OAuth Quick Login Section */}
          {mode !== 'forgot' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setIsGoogleSelecting(true)}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google Account</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider absolute">
                  OR USE EMAIL & MOBILE
                </span>
              </div>
            </div>
          )}

          {/* MODE 1: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email or Mobile Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rajsahani.RgcS@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotStep(1);
                      setOtpTarget(email || 'rajsahani.RgcS@gmail.com');
                    }}
                    className="text-xs font-semibold text-indigo-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to OneHost</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-400 pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-indigo-400 hover:underline"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Raj Sahani"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="raj@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Mobile Phone Number (+91...)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Confirm</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Create Account & Get Free Credits</span>
              </button>

              <div className="text-center text-xs text-slate-400 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-indigo-400 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: FORGOT PASSWORD & OTP VERIFICATION */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {/* Step indicator */}
              <div className="flex items-center justify-between px-2 text-[11px] font-bold text-slate-400">
                <span className={forgotStep === 1 ? 'text-indigo-400' : 'text-emerald-400'}>1. Target Email/Mobile</span>
                <span className={forgotStep === 2 ? 'text-indigo-400' : forgotStep === 3 ? 'text-emerald-400' : ''}>2. OTP Verification</span>
                <span className={forgotStep === 3 ? 'text-indigo-400' : ''}>3. New Password</span>
              </div>

              {/* FORGOT STEP 1: Enter target */}
              {forgotStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Registered Mobile Number or Email
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={otpTarget}
                        onChange={e => setOtpTarget(e.target.value)}
                        placeholder="+91 98765 43210 or email@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send 6-Digit OTP Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center text-xs text-slate-400">
                    Remembered password?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="font-bold text-indigo-400 hover:underline"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* FORGOT STEP 2: Verify OTP */}
              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                    A 6-digit OTP code has been dispatched to <strong>{otpTarget}</strong>.
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-300">Enter 6-Digit Verification OTP</label>
                      <button
                        type="button"
                        onClick={() => {
                          setEnteredOtp(generatedOtp || '582910');
                          showToast('OTP Auto-Filled from SMS Service!', 'info');
                        }}
                        className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Auto-Fill SMS Code ({generatedOtp || '582910'})</span>
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={e => setEnteredOtp(e.target.value)}
                        placeholder="582910"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono tracking-widest text-center text-emerald-400 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifyingOtp ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify OTP & Proceed</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-xs text-slate-400">
                    Didn't receive code?{' '}
                    <button
                      type="button"
                      onClick={() => handleSendOtp({ preventDefault: () => {} } as any)}
                      className="font-bold text-indigo-400 hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}

              {/* FORGOT STEP 3: Reset Password */}
              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Update Password & Login</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Google OAuth Account Picker Sub-Modal */}
      {isGoogleSelecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-slate-100 shadow-2xl">
            <div className="text-center space-y-2">
              <svg className="w-10 h-10 mx-auto" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <div className="font-extrabold text-base text-white">Sign in with Google</div>
              <div className="text-xs text-slate-400">Choose a Google Account to continue to OneHost Cloud</div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleLogin('rajsahani.RgcS@gmail.com', 'Raj Sahani')}
                className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center gap-3 transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                  RS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">Raj Sahani</div>
                  <div className="text-[11px] text-slate-400 truncate">rajsahani.RgcS@gmail.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleLogin('user.cloud@gmail.com', 'Google User')}
                className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center gap-3 transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-xs">
                  GU
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">Google Account User</div>
                  <div className="text-[11px] text-slate-400 truncate">user.cloud@gmail.com</div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsGoogleSelecting(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
