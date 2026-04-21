import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, CheckCircle } from 'lucide-react';

export default function Register() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.fullName &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    ) {
      setLocation('/');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background text-foreground overflow-hidden flex items-center justify-center"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />

        <div
          className="shape absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"
          style={{ animation: 'float 6s ease-in-out infinite' }}
        />
        <div
          className="shape absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
          style={{ animation: 'float 8s ease-in-out infinite 1s' }}
        />
        <div
          className="shape absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl"
          style={{ animation: 'float 7s ease-in-out infinite 2s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Back button */}
        <button
          onClick={() => setLocation('/')}
          className="form-element mb-8 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          {t('nav.features')}
        </button>

        {/* Header */}
        <div className="form-element mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-yellow-400">{t('auth.createAccount')}</span>
          </h1>
          <p className="text-gray-400">{t('auth.registerSubtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name Input */}
          <div className="form-element">
            <label className="block text-sm font-medium mb-3 text-gray-300">
              {t('auth.fullName')}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="form-element">
            <label className="block text-sm font-medium mb-3 text-gray-300">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-element">
            <label className="block text-sm font-medium mb-3 text-gray-300">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition"
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
            <label className="block text-sm font-medium mb-3 text-gray-300">
              {t('auth.confirmPassword')}
            </label>
            <div className="relative">
              <CheckCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition"
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
              className="w-4 h-4 mt-1 bg-slate-800 border border-yellow-400/30 rounded cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-400">
              {t('auth.agreeTerms')}{' '}
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition">
                {t('auth.termsOfService')}
              </a>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="form-element w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            {t('auth.createAccount')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Divider */}
        <div className="form-element my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-400/30" />
          <span className="text-gray-500 text-sm">{t('auth.or')}</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-400/30" />
        </div>

        {/* Social Register */}
        <div className="form-element grid grid-cols-2 gap-4">
          <button className="py-3 bg-slate-800/50 border border-yellow-400/20 rounded-lg hover:border-yellow-400/50 hover:bg-slate-800 transition text-gray-300">
            Google
          </button>
          <button className="py-3 bg-slate-800/50 border border-yellow-400/20 rounded-lg hover:border-yellow-400/50 hover:bg-slate-800 transition text-gray-300">
            GitHub
          </button>
        </div>

        {/* Login Link */}
        <div className="form-element mt-8 text-center">
          <p className="text-gray-400">
            {t('auth.haveAccount')}{' '}
            <button
              onClick={() => setLocation('/login')}
              className="text-yellow-400 hover:text-yellow-300 font-semibold transition"
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
