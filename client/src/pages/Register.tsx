import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { authService } from '@/lib/firebase';
import gsap from 'gsap';
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, CheckCircle, Loader } from 'lucide-react';

export default function Register() {
  const [, setLocation] = useLocation();
  const { t, theme } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { user, error: authError } = await authService.register(
      formData.email,
      formData.password
    );

    if (authError) {
      setError(authError);
      setLoading(false);
    } else if (user) {
      setLocation('/');
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);
    const { user, error: authError } = await authService.loginWithGoogle();
    if (authError) {
      setError(authError);
      setLoading(false);
    } else if (user) {
      setLocation('/');
    }
  };

  const handleGithubRegister = async () => {
    setError('');
    setLoading(true);
    const { user, error: authError } = await authService.loginWithGithub();
    if (authError) {
      setError(authError);
      setLoading(false);
    } else if (user) {
      setLocation('/');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isDark = theme === 'dark';
  const accentColor = isDark ? 'yellow' : 'yellow';
  const primaryColor = isDark ? 'cyan' : 'blue';

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background text-foreground overflow-hidden flex items-center justify-center"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800' 
            : 'bg-gradient-to-br from-white via-blue-50 to-blue-100'
        }`} />

        <div
          className={`shape absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${
            isDark ? 'bg-yellow-500/10' : 'bg-yellow-400/10'
          }`}
          style={{ animation: 'float 6s ease-in-out infinite' }}
        />
        <div
          className={`shape absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-cyan-500/5' : 'bg-blue-400/10'
          }`}
          style={{ animation: 'float 8s ease-in-out infinite 1s' }}
        />
        <div
          className={`shape absolute top-1/2 left-1/2 w-80 h-80 rounded-full blur-3xl ${
            isDark ? 'bg-yellow-400/5' : 'bg-yellow-300/10'
          }`}
          style={{ animation: 'float 7s ease-in-out infinite 2s' }}
        />
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
            <span className={isDark ? 'text-yellow-400' : 'text-yellow-500'}>{t('auth.createAccount')}</span>
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t('auth.registerSubtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name Input */}
          <div className="form-element">
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('auth.fullName')}
            </label>
            <div className="relative">
              <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-yellow-400' : 'text-yellow-500'
              }`} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition ${
                  isDark 
                    ? 'bg-slate-800/50 border border-yellow-400/30 focus:border-yellow-400 focus:ring-yellow-400/20 text-white placeholder-gray-500' 
                    : 'bg-white/50 border border-yellow-300/50 focus:border-yellow-500 focus:ring-yellow-500/20 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="form-element">
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-yellow-400' : 'text-yellow-500'
              }`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition ${
                  isDark 
                    ? 'bg-slate-800/50 border border-yellow-400/30 focus:border-yellow-400 focus:ring-yellow-400/20 text-white placeholder-gray-500' 
                    : 'bg-white/50 border border-yellow-300/50 focus:border-yellow-500 focus:ring-yellow-500/20 text-gray-900 placeholder-gray-400'
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
                isDark ? 'text-yellow-400' : 'text-yellow-500'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 transition ${
                  isDark 
                    ? 'bg-slate-800/50 border border-yellow-400/30 focus:border-yellow-400 focus:ring-yellow-400/20 text-white placeholder-gray-500' 
                    : 'bg-white/50 border border-yellow-300/50 focus:border-yellow-500 focus:ring-yellow-500/20 text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition ${
                  isDark 
                    ? 'text-gray-400 hover:text-yellow-400' 
                    : 'text-gray-600 hover:text-yellow-600'
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

          {/* Confirm Password Input */}
          <div className="form-element">
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('auth.confirmPassword')}
            </label>
            <div className="relative">
              <CheckCircle className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-yellow-400' : 'text-yellow-500'
              }`} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 transition ${
                  isDark 
                    ? 'bg-slate-800/50 border border-yellow-400/30 focus:border-yellow-400 focus:ring-yellow-400/20 text-white placeholder-gray-500' 
                    : 'bg-white/50 border border-yellow-300/50 focus:border-yellow-500 focus:ring-yellow-500/20 text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition ${
                  isDark 
                    ? 'text-gray-400 hover:text-yellow-400' 
                    : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="form-element flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              className={`w-4 h-4 mt-1 rounded cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 border border-yellow-400/30' 
                  : 'bg-white border border-yellow-300/50'
              }`}
            />
            <label htmlFor="terms" className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('auth.agreeTerms')}{' '}
              <a href="#" className={`transition ${
                isDark 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-yellow-600 hover:text-yellow-700'
              }`}>
                {t('auth.termsOfService')}
              </a>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="form-element p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`form-element w-full py-3 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isDark 
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg hover:shadow-yellow-400/50' 
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg hover:shadow-yellow-500/50'
            }`}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {t('auth.loading')}
              </>
            ) : (
              <>
                {t('auth.createAccount')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="form-element my-8 flex items-center gap-4">
          <div className={`flex-1 h-px bg-gradient-to-r from-transparent ${
            isDark ? 'to-yellow-400/30' : 'to-yellow-400/30'
          }`} />
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t('auth.or')}</span>
          <div className={`flex-1 h-px bg-gradient-to-l from-transparent ${
            isDark ? 'to-yellow-400/30' : 'to-yellow-400/30'
          }`} />
        </div>

        {/* Social Register */}
        <div className="form-element grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading}
            className={`py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-slate-800/50 border border-yellow-400/20 hover:border-yellow-400/50 hover:bg-slate-800 text-gray-300' 
                : 'bg-white/50 border border-yellow-300/50 hover:border-yellow-500/50 hover:bg-white/80 text-gray-700'
            }`}
          >
            Google
          </button>
          <button
            type="button"
            onClick={handleGithubRegister}
            disabled={loading}
            className={`py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-slate-800/50 border border-yellow-400/20 hover:border-yellow-400/50 hover:bg-slate-800 text-gray-300' 
                : 'bg-white/50 border border-yellow-300/50 hover:border-yellow-500/50 hover:bg-white/80 text-gray-700'
            }`}
          >
            GitHub
          </button>
        </div>

        {/* Login Link */}
        <div className="form-element mt-8 text-center">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t('auth.haveAccount')}{' '}
            <button
              onClick={() => setLocation('/login')}
              className={`font-semibold transition ${
                isDark 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-yellow-600 hover:text-yellow-700'
              }`}
            >
              {t('auth.login')}
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
