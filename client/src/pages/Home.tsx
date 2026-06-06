import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ChevronDown, Zap, Globe, Users, BookOpen, Rocket, Sun, Moon, User } from 'lucide-react';
import { LanguageThemeSwitcher } from '@/components/LanguageThemeSwitcher';
import { getDashboardPathForRole } from '@/lib/roles';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [, setLocation] = useLocation();
  const { t, language, theme } = useLanguage();
  const { user, logout, role } = useUser();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero section animations
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelector('.hero-title'),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(
        heroRef.current.querySelector('.hero-subtitle'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
      );

      gsap.fromTo(
        heroRef.current.querySelector('.hero-buttons'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: 'power3.out' }
      );

      // Floating animation for hero image
      gsap.to(heroRef.current.querySelector('.hero-image'), {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Scroll animations for sections
    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll('.fade-in-up'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );
    });

    // Parallax effect on scroll
    document.querySelectorAll('.parallax-bg').forEach((element) => {
      gsap.to(element, {
        y: 100,
        scrollTrigger: {
          trigger: element,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 backdrop-blur border-b ${
        isDark 
          ? 'bg-background/80 border-cyan-400/20' 
          : 'bg-white/80 border-blue-200/30'
      }`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/digitaledu-logo.png"
              alt="DigitalEdu"
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <span className={`text-lg md:text-xl font-bold hidden sm:inline-block ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>DigitalEdu</span>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className={`transition ${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-blue-600'}`}>
              {t('nav.features')}
            </a>
            <a href="#categories" className={`transition ${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-blue-600'}`}>
              {t('nav.categories')}
            </a>
            <a href="#team" className={`transition ${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-blue-600'}`}>
              {t('nav.team')}
            </a>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageThemeSwitcher />

            {/* CTA Button */}
            {user ? (
              <div className="relative group">
                <button
                  className={`px-4 md:px-6 py-2 text-sm md:text-base font-bold rounded-lg transition interactive whitespace-nowrap flex items-center gap-2 ${
                    isDark 
                      ? 'bg-slate-800 text-white hover:bg-slate-700' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">My Account</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'}`}>
                    <button
                      onClick={() => setLocation(getDashboardPathForRole(role))}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDark ? 'text-gray-300 hover:bg-slate-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Dashboard
                    </button>
                    <div className={`my-1 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`} />
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors text-red-500 hover:bg-red-500/10"
                    >
                      {t('auth.logout')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setLocation('/register')}
                className={`px-4 md:px-6 py-2 text-sm md:text-base font-bold rounded-lg transition interactive whitespace-nowrap ${
                  isDark 
                    ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-black hover:shadow-lg hover:shadow-cyan-400/50' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-600/50'
                }`}
              >
                {t('nav.getStarted')}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32"
      >
        {/* Animated background */}
        <div className="absolute inset-0 parallax-bg">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/hero-abstract-tech-JmL8HhTUPZ999pg9KpQKNE.webp')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full opacity-60 ${
                isDark ? 'bg-cyan-400' : 'bg-blue-500'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12 mt-8">
          {/* Left content */}
          <div className="flex-1 max-w-2xl">
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>{t('hero.connect')}</span>
              <br />
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{t('hero.theWorld')}</span>
              <br />
              <span className={isDark ? 'text-yellow-400' : 'text-yellow-500'}>{t('hero.education')}</span>
            </h1>

            <p className={`hero-subtitle text-lg mb-8 leading-relaxed max-w-xl ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('hero.description')}
            </p>

            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setLocation('/register')}
                className={`w-full sm:w-auto px-8 py-4 font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 interactive ${
                  isDark 
                    ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-black hover:shadow-cyan-400/50' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-blue-600/50'
                }`}
              >
                {t('hero.getStarted')}
              </button>
              <button
                onClick={() => setLocation('/login')}
                className={`w-full sm:w-auto px-8 py-4 font-bold rounded-lg transition-all duration-300 interactive border-2 ${
                  isDark 
                    ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/10' 
                    : 'border-blue-600 text-blue-600 hover:bg-blue-600/10'
                }`}
              >
                {t('hero.watchDemo')}
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`}>150+</p>
                <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('hero.countries')}</p>
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>10K+</p>
                <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('hero.courses')}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`}>1M+</p>
                <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('hero.learners')}</p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="flex-1 hero-image">
            <div
              className={`w-full h-96 lg:h-full rounded-2xl overflow-hidden border-2 shadow-2xl ${
                isDark 
                  ? 'border-cyan-400/30 shadow-cyan-400/20' 
                  : 'border-blue-300/50 shadow-blue-300/20'
              }`}
              style={{
                backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/morphing-shapes-J7tWxHzgZiJUXSfLAMrFRu.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className={`w-8 h-8 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className={`scroll-section py-20 ${
        isDark 
          ? 'bg-gradient-to-b from-background to-slate-900/20' 
          : 'bg-gradient-to-b from-white to-blue-50/30'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl font-bold mb-4">
              {t('features.why')} <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>DigitalEdu?</span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('features.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Globe,
                title: t('features.global'),
                desc: t('features.globalDesc'),
              },
              {
                icon: BookOpen,
                title: t('features.levels'),
                desc: t('features.levelsDesc'),
              },
              {
                icon: Zap,
                title: t('features.smart'),
                desc: t('features.smartDesc'),
              },
              {
                icon: Users,
                title: t('features.community'),
                desc: t('features.communityDesc'),
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`fade-in-up p-6 rounded-xl border transition-all duration-300 group ${
                  isDark 
                    ? 'border-cyan-400/20 bg-slate-900/50 backdrop-blur hover:border-cyan-400/50 hover:bg-slate-900/80' 
                    : 'border-blue-200/50 bg-white/50 backdrop-blur hover:border-blue-400/50 hover:bg-white/80'
                }`}
              >
                <feature.icon className={`w-12 h-12 mb-4 group-hover:scale-110 transition-transform ${
                  isDark ? 'text-cyan-400' : 'text-blue-600'
                }`} />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Landscape Section */}
      <section className="scroll-section py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/digital-landscape-bZppy9hYNWy9qgune3F8hw.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h2 className="fade-in-up text-5xl font-bold mb-6">
              {t('journey.your')} <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>{t('journey.starts')}</span>
            </h2>
            <p className={`fade-in-up text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('about.mission')}
            </p>
            <button className={`fade-in-up px-8 py-4 font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
              isDark 
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-yellow-400/50' 
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-yellow-500/50'
            }`}>
              {t('cta.start')}
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className={`scroll-section py-20 ${
        isDark ? 'bg-slate-900/30' : 'bg-blue-50/30'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl font-bold mb-4">
              {t('categories.learning')} <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>{t('categories.categories')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t('categories.kids'), subtitle: t('categories.kidsAge'), color: 'from-pink-500' },
              { title: t('categories.school'), subtitle: t('categories.schoolGrade'), color: 'from-blue-500' },
              { title: t('categories.university'), subtitle: t('categories.universityYears'), color: 'from-purple-500' },
              { title: t('categories.professional'), subtitle: t('categories.professionalGrowth'), color: 'from-green-500' },
            ].map((cat, i) => (
              <div
                key={i}
                className={`fade-in-up p-8 rounded-xl bg-gradient-to-br ${cat.color} to-transparent opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer transform hover:scale-105 border ${
                  isDark ? 'border-white/10' : 'border-white/20'
                }`}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-white/80">{cat.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Network Section */}
      <section className="scroll-section py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/tech-network-fci7FXp8fC67QushWDyyhG.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="fade-in-up text-5xl font-bold mb-6">
            {t('network.global')} <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>{t('network.network')}</span>
          </h2>
          <p className={`fade-in-up text-xl max-w-2xl mx-auto mb-12 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('network.subtitle')}
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className={`scroll-section py-20 ${isDark ? 'bg-slate-900/50' : 'bg-white/50'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="fade-in-up text-5xl font-bold mb-6">
              {t('about.about')} <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>DigitalEdu</span>
            </h2>
            <p className={`fade-in-up text-lg mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('about.mission')}
            </p>
            <p className={`fade-in-up text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('about.vision')}
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`scroll-section py-20 bg-gradient-to-b ${
        isDark 
          ? 'from-slate-900/30 to-background' 
          : 'from-blue-50/30 to-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl font-bold mb-4">
              {t('team.meet')} <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>{t('team.paradox')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: t('team.latera'),
                role: t('team.lateraRole'),
                bio: t('team.lateraBio'),
              },
              {
                name: t('team.natnael'),
                role: t('team.natnaelRole'),
                bio: t('team.natnaelBio'),
              },
              {
                name: t('team.tadios'),
                role: t('team.tadiosRole'),
                bio: t('team.tadiosBio'),
              },
            ].map((member, i) => (
              <div
                key={i}
                className={`fade-in-up p-6 rounded-xl border transition-all duration-300 ${
                  isDark 
                    ? 'border-cyan-400/20 bg-slate-900/50 backdrop-blur hover:border-cyan-400/50' 
                    : 'border-blue-200/50 bg-white/50 backdrop-blur hover:border-blue-400/50'
                }`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${
                  isDark 
                    ? 'from-cyan-400 to-yellow-400' 
                    : 'from-blue-600 to-yellow-500'
                } rounded-full mb-4`} />
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className={`font-semibold mb-3 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>{member.role}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`scroll-section py-20 border-t ${
        isDark 
          ? 'bg-gradient-to-r from-cyan-500/20 to-yellow-500/20 border-cyan-400/20' 
          : 'bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border-blue-200/30'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="fade-in-up text-5xl font-bold mb-6">
            {t('cta.ready')} <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>{t('cta.transform')}</span>
          </h2>
          <p className={`fade-in-up text-xl mb-8 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('cta.subtitle')}
          </p>
          <div className="fade-in-up flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setLocation('/register')}
              className={`px-8 py-4 font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 border interactive ${
                isDark 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-yellow-400/50 border-white/10' 
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-yellow-500/50 border-white/20'
              }`}
            >
              {t('cta.start')}
            </button>
            <button
              onClick={() => setLocation('/login')}
              className={`px-8 py-4 font-bold rounded-lg transition-all duration-300 interactive border-2 ${
                isDark 
                  ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400/10' 
                  : 'border-yellow-500 text-yellow-600 hover:bg-yellow-500/10'
              }`}
            >
              {t('cta.schedule')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 ${
        isDark 
          ? 'bg-slate-950 border-cyan-400/20' 
          : 'bg-gray-100 border-blue-200/30'
      }`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('footer.quickLinks')}</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>{t('nav.features')}</a></li>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>{t('nav.categories')}</a></li>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>{t('nav.team')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('footer.resources')}</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>{t('footer.blog')}</a></li>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>{t('footer.documentation')}</a></li>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>{t('footer.support')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('footer.followUs')}</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>Twitter</a></li>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>LinkedIn</a></li>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>DigitalEdu</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('footer.tagline')}</p>
            </div>
          </div>
          <div className={`border-t pt-8 text-center text-sm ${
            isDark 
              ? 'border-gray-800 text-gray-500' 
              : 'border-gray-300 text-gray-600'
          }`}>
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
