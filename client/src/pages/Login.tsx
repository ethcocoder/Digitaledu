import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { authService } from '@/lib/firebase';
import gsap from 'gsap';
import { Eye, EyeOff, ArrowRight, Mail, Lock, Loader } from 'lucide-react';
import { LanguageThemeSwitcher } from '@/components/LanguageThemeSwitcher';

export default function Login() {
  const [, setLocation] = useLocation();
  const { t, theme } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyingRole, setVerifyingRole] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (containerRef.current) {
      // Animate form elements on mount
      gsap.fromTo(
        containerRef.current.querySelectorAll('.form-element'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );

      // Animate background shapes
      const shapes = containerRef.current.querySelectorAll('.shape');
      shapes.forEach((shape, i) => {
        gsap.to(shape, {
          y: Math.sin(i) * 20,
          duration: 4 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { user, error: authError } = await authService.login(email, password);
    
    if (authError) {
      setError(authError);
      setLoading(false);
    } else if (user) {
      setVerifyingRole(true);
      const { profile } = await authService.getUserProfile(user.uid);
      
      if (profile?.role === 'superadmin') {
        setLocation('/superadmin');
      } else if (profile?.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const { user, error: authError } = await authService.loginWithGoogle();
    if (authError) {
      setError(authError);
      setLoading(false);
    } else if (user) {
      setVerifyingRole(true);
      const { profile } = await authService.getUserProfile(user.uid);
      
      if (profile?.role === 'superadmin') {
        setLocation('/superadmin');
      } else if (profile?.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/');
      }
    }
  };

  const handleGithubLogin = async () => {
    setError('');
    setLoading(true);
    const { user, error: authError } = await authService.loginWithGithub();
    if (authError) {
      setError(authError);
      setLoading(false);
    } else if (user) {
      setVerifyingRole(true);
      const { profile } = await authService.getUserProfile(user.uid);
      
      if (profile?.role === 'superadmin') {
        setLocation('/superadmin');
      } else if (profile?.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/');
      }
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background text-foreground overflow-hidden flex items-center justify-center"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient background */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800' 
            : 'bg-gradient-to-br from-white via-blue-50 to-blue-100'
        }`} />

        {/* Animated shapes */}
        <div
          className={`shape absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${
            isDark ? 'bg-cyan-500/10' : 'bg-blue-400/10'
          }`}
          style={{ animation: 'float 6s ease-in-out infinite' }}
        />
        <div
          className={`shape absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-yellow-500/5' : 'bg-yellow-400/10'
          }`}
          style={{ animation: 'float 8s ease-in-out infinite 1s' }}
        />
        <div
          className={`shape absolute top-1/2 left-1/2 w-80 h-80 rounded-full blur-3xl ${
            isDark ? 'bg-cyan-400/5' : 'bg-blue-300/10'
          }`}
          style={{ animation: 'float 7s ease-in-out infinite 2s' }}
        />
      </div>

      {/* Language/Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageThemeSwitcher />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Back button */}
        <button
          onClick={() => setLocation('/')}
          className={`form-element mb-8 flex items-center gap-2 transition ${
            isDark 
              ? 'text-gray-400 hover:text-cyan-400' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          {t('nav.features')}
        </button>

        {/* Header */}
        <div className="form-element mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>{t('auth.welcome')}</span>
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t('auth.loginSubtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="form-element">
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-cyan-400' : 'text-blue-600'
              }`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className={`w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition ${
                  isDark 
                    ? 'bg-slate-800/50 border border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder-gray-500' 
                    : 'bg-white/50 border border-blue-200/50 focus:border-blue-600 focus:ring-blue-600/20 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-element">
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-cyan-400' : 'text-blue-600'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className={`w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 transition ${
                  isDark 
                    ? 'bg-slate-800/50 border border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder-gray-500' 
                    : 'bg-white/50 border border-blue-200/50 focus:border-blue-600 focus:ring-blue-600/20 text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition ${
                  isDark 
                    ? 'text-gray-400 hover:text-cyan-400' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-element flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className={`w-4 h-4 rounded cursor-pointer ${
                  isDark 
                    ? 'bg-slate-800 border border-cyan-400/30' 
                    : 'bg-white border border-blue-200/50'
                }`}
              />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t('auth.rememberMe')}</span>
            </label>
            <a href="#" className={`transition ${
              isDark 
                ? 'text-cyan-400 hover:text-cyan-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}>
              {t('auth.forgotPassword')}
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="form-element p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`form-element w-full py-3 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isDark 
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-black hover:shadow-lg hover:shadow-cyan-400/50' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-600/50'
            }`}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {verifyingRole ? t('auth.verifyingIdentity') : t('auth.loading')}
              </>
            ) : (
              <>
                {t('auth.login')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="form-element my-8 flex items-center gap-4">
          <div className={`flex-1 h-px bg-gradient-to-r from-transparent ${
            isDark ? 'to-cyan-400/30' : 'to-blue-400/30'
          }`} />
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t('auth.or')}</span>
          <div className={`flex-1 h-px bg-gradient-to-l from-transparent ${
            isDark ? 'to-cyan-400/30' : 'to-blue-400/30'
          }`} />
        </div>

        {/* Social Login */}
        <div className="form-element grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-slate-800/50 border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-slate-800 text-gray-300' 
                : 'bg-white/50 border border-blue-200/50 hover:border-blue-400/50 hover:bg-white/80 text-gray-700'
            }`}
          >
            Google
          </button>
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={loading}
            className={`py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-slate-800/50 border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-slate-800 text-gray-300' 
                : 'bg-white/50 border border-blue-200/50 hover:border-blue-400/50 hover:bg-white/80 text-gray-700'
            }`}
          >
            GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="form-element mt-8 text-center">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t('auth.noAccount')}{' '}
            <button
              onClick={() => setLocation('/register')}
              className={`font-semibold transition ${
                isDark 
                  ? 'text-cyan-400 hover:text-cyan-300' 
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              {t('auth.signUp')}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}
