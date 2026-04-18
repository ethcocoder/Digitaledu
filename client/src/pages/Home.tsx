import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Zap, Users, BookOpen, Github, Linkedin, Mail, ChevronDown, ArrowRight, Play } from 'lucide-react';
import { LanguageThemeSwitcher } from '@/components/LanguageThemeSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * DigitalEdu Premium Landing Page - Production Level
 * 
 * Features:
 * - Professional 3D visuals (teacher, student, technology)
 * - Creative morphing transitions between sections
 * - Smooth scroll animations
 * - Multi-language support (English & Amharic)
 * - Light & Dark mode
 * - Interactive elements
 * - Premium aesthetic
 */

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const { t, theme } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Animate elements on scroll
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('[data-scroll-animate]');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !el.classList.contains('animated')) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
          );
          el.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
    <div className={`w-full overflow-hidden transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-slate-50 text-slate-900' 
        : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white/30 border-b border-blue-200/20'
          : 'bg-slate-900/30 border-b border-cyan-400/10'
      }`}>
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/digitaledu-logo.png" alt="DigitalEdu" className="w-10 h-10 object-contain" />
            <span className={`font-display text-lg font-bold ${
              theme === 'light' ? 'text-blue-600' : ''
            }`}>
              <span className={theme === 'light' ? 'text-orange-500' : 'text-yellow-400'}>Digital</span>
              <span className={theme === 'light' ? 'text-blue-600' : 'text-cyan-400'}>Edu</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className={`text-sm transition-colors duration-300 ${
              theme === 'light'
                ? 'hover:text-blue-600'
                : 'hover:text-cyan-400'
            }`}>{t('nav.features')}</a>
            <a href="#categories" className={`text-sm transition-colors duration-300 ${
              theme === 'light'
                ? 'hover:text-blue-600'
                : 'hover:text-cyan-400'
            }`}>{t('nav.categories')}</a>
            <a href="#team" className={`text-sm transition-colors duration-300 ${
              theme === 'light'
                ? 'hover:text-blue-600'
                : 'hover:text-cyan-400'
            }`}>{t('nav.team')}</a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageThemeSwitcher />
            <Button className={`text-xs md:text-sm ${
              theme === 'light'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'btn-gradient'
            }`}>{t('nav.getStarted')}</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Teacher Visual */}
      <section ref={heroRef} className={`relative min-h-screen flex items-center justify-center pt-20 overflow-hidden transition-colors duration-300 ${
        theme === 'light' ? 'bg-gradient-to-b from-blue-50 to-slate-100' : 'bg-slate-950'
      }`}>
        <div className="absolute inset-0 z-0">
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/hero-3d-teacher-7ih8TQoEaxdkPU6eUPz2LC.webp" 
            alt="Teacher" 
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
        </div>
        
        <div className={`absolute inset-0 ${
          theme === 'light'
            ? 'bg-gradient-to-r from-white via-white/70 to-transparent'
            : 'bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent'
        } z-10`} />

        <div className="relative z-20 container max-w-6xl mx-auto px-4">
          <div className="max-w-2xl">
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h1 className={`font-display text-6xl md:text-7xl font-bold mb-6 leading-tight ${
                  theme === 'light' ? 'text-slate-900' : ''
                }`}>
                  <span className={theme === 'light' ? 'text-blue-600' : 'text-cyan-400'}>{t('hero.connect')}</span>
                  <br />
                  <span className={theme === 'light' ? 'text-slate-700' : 'text-white'}>{t('hero.theWorld')}</span>
                  <br />
                  <span className={theme === 'light' ? 'text-orange-500' : 'text-yellow-400'}>{t('hero.education')}</span>
                </h1>
              </div>

              <p className={`font-body text-lg md:text-xl max-w-lg leading-relaxed ${
                theme === 'light' ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className={`text-base font-semibold group ${
                  theme === 'light'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'btn-gradient'
                }`}>
                  {t('hero.getStarted')}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button className={`text-base font-semibold flex items-center gap-2 ${
                  theme === 'light'
                    ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                    : 'btn-gradient-outline'
                }`}>
                  <Play className="w-4 h-4" />
                  {t('hero.watchDemo')}
                </Button>
              </div>

              {/* Stats */}
              <div className={`grid grid-cols-3 gap-6 pt-8 transition-colors duration-300 ${
                theme === 'light'
                  ? 'border-t border-blue-200'
                  : 'border-t border-cyan-400/20'
              }`}>
                <div>
                  <p className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-blue-600' : 'text-cyan-400'
                  }`}>150+</p>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  }`}>{t('hero.countries')}</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-orange-500' : 'text-yellow-400'
                  }`}>10K+</p>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  }`}>{t('hero.courses')}</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-blue-600' : 'text-cyan-400'
                  }`}>1M+</p>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  }`}>{t('hero.learners')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center animate-bounce z-20">
          <ChevronDown className={`w-8 h-8 ${
            theme === 'light' ? 'text-blue-600' : 'text-cyan-400'
          }`} />
        </div>
      </section>

      {/* Student Learning Section */}
      <section className={`relative py-32 transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white'
          : 'bg-gradient-to-b from-slate-950 to-slate-900'
      }`}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-scroll-animate className="space-y-8">
              <h2 className={`font-display text-5xl md:text-6xl font-bold ${
                theme === 'light' ? 'text-slate-900' : ''
              }`}>
                <span className={theme === 'light' ? 'text-blue-600' : 'text-cyan-400'}>{t('student.learn')}</span>
                <br />
                <span className={theme === 'light' ? 'text-slate-700' : 'text-white'}>{t('student.yourWay')}</span>
              </h2>
              <p className={`font-body text-lg leading-relaxed ${
                theme === 'light' ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {t('student.description')}
              </p>
              <ul className="space-y-4">
                {[t('student.interactive'), t('student.personalized'), t('student.experts')].map((item, idx) => (
                  <li key={idx} className={`flex items-center gap-3 ${
                    theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      theme === 'light' ? 'bg-blue-600' : 'bg-cyan-400'
                    }`} />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className={`text-base font-semibold ${
                theme === 'light'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'btn-gradient'
              }`}>{t('student.explore')}</Button>
            </div>
            <div data-scroll-animate className="relative">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/hero-3d-student-BdWgEwEakpiqU8L3NQxzKV.webp" 
                alt="Student Learning" 
                className={`rounded-2xl shadow-2xl ${
                  theme === 'light'
                    ? 'shadow-blue-500/20'
                    : 'shadow-cyan-500/20'
                }`}
              />
              <div className={`absolute inset-0 rounded-2xl ${
                theme === 'light'
                  ? 'bg-gradient-to-t from-white via-transparent to-transparent'
                  : 'bg-gradient-to-t from-slate-950 via-transparent to-transparent'
              }`} />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Integration Section */}
      <section className={`relative py-32 transition-colors duration-300 ${
        theme === 'light' ? 'bg-slate-100' : 'bg-slate-950'
      }`}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-scroll-animate className="relative order-2 md:order-1">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/hero-3d-technology-2d4YXVPmMSXLWuwxWDZR7z.webp" 
                alt="Technology" 
                className={`rounded-2xl shadow-2xl ${
                  theme === 'light'
                    ? 'shadow-orange-500/20'
                    : 'shadow-yellow-500/20'
                }`}
              />
              <div className={`absolute inset-0 rounded-2xl ${
                theme === 'light'
                  ? 'bg-gradient-to-t from-slate-100 via-transparent to-transparent'
                  : 'bg-gradient-to-t from-slate-950 via-transparent to-transparent'
              }`} />
            </div>
            <div data-scroll-animate className="space-y-8 order-1 md:order-2">
              <h2 className={`font-display text-5xl md:text-6xl font-bold ${
                theme === 'light' ? 'text-slate-900' : ''
              }`}>
                <span className={theme === 'light' ? 'text-orange-500' : 'text-yellow-400'}>{t('tech.connected')}</span>
                <br />
                <span className={theme === 'light' ? 'text-slate-700' : 'text-white'}>{t('tech.everywhere')}</span>
              </h2>
              <p className={`font-body text-lg leading-relaxed ${
                theme === 'light' ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {t('tech.description')}
              </p>
              <ul className="space-y-4">
                {[t('tech.offline'), t('tech.sync'), t('tech.cloud')].map((item, idx) => (
                  <li key={idx} className={`flex items-center gap-3 ${
                    theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      theme === 'light' ? 'bg-orange-500' : 'bg-yellow-400'
                    }`} />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className={`text-base font-semibold ${
                theme === 'light'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'btn-gradient'
              }`}>{t('tech.getStarted')}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`relative py-32 transition-colors duration-300 ${
        theme === 'light' ? 'bg-white' : 'bg-gradient-to-b from-slate-950 to-slate-900'
      }`}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-scroll-animate>
            <h2 className={`font-display text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'light' ? 'text-slate-900' : ''
            }`}>
              <span className={theme === 'light' ? 'text-blue-600' : 'text-cyan-400'}>{t('features.why')}</span>
              <br />
              <span className={theme === 'light' ? 'text-slate-700' : 'text-white'}>{t('features.digitaledu')}</span>
            </h2>
            <p className={`font-body text-lg max-w-2xl mx-auto ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Globe,
                title: t('features.global'),
                description: t('features.globalDesc'),
                color: theme === 'light' ? 'from-blue-400 to-blue-500' : 'from-cyan-400 to-blue-500',
              },
              {
                icon: BookOpen,
                title: t('features.levels'),
                description: t('features.levelsDesc'),
                color: theme === 'light' ? 'from-orange-400 to-orange-500' : 'from-yellow-400 to-orange-500',
              },
              {
                icon: Zap,
                title: t('features.smart'),
                description: t('features.smartDesc'),
                color: theme === 'light' ? 'from-purple-400 to-pink-500' : 'from-purple-400 to-pink-500',
              },
              {
                icon: Users,
                title: t('features.community'),
                description: t('features.communityDesc'),
                color: theme === 'light' ? 'from-teal-400 to-teal-500' : 'from-cyan-400 to-teal-500',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                data-scroll-animate
                className={`p-8 rounded-2xl transition-all duration-500 hover:shadow-lg group cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-blue-500/20'
                    : 'glass-dark hover:border-cyan-400/50 hover:shadow-cyan-500/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${
                    theme === 'light' ? 'text-white' : 'text-slate-900'
                  }`} />
                </div>
                <h3 className={`font-heading text-xl font-bold mb-3 ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  {feature.title}
                </h3>
                <p className={`font-body ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Journey Section */}
      <section className={`relative py-32 transition-colors duration-300 ${
        theme === 'light' ? 'bg-slate-100' : 'bg-slate-950'
      }`}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-scroll-animate>
            <h2 className={`font-display text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'light' ? 'text-slate-900' : ''
            }`}>
              <span className={theme === 'light' ? 'text-orange-500' : 'text-yellow-400'}>{t('journey.your')}</span>
              <br />
              <span className={theme === 'light' ? 'text-slate-700' : 'text-white'}>{t('journey.starts')}</span>
            </h2>
          </div>

          <div data-scroll-animate className="relative">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/learning-journey-Gmstv2eyV53SfXjyU7FTr9.webp" 
              alt="Learning Journey" 
              className={`rounded-2xl shadow-2xl w-full ${
                theme === 'light'
                  ? 'shadow-blue-500/20'
                  : 'shadow-cyan-500/30'
              }`}
            />
            <div className={`absolute inset-0 rounded-2xl ${
              theme === 'light'
                ? 'bg-gradient-to-t from-slate-100 via-transparent to-transparent'
                : 'bg-gradient-to-t from-slate-950 via-transparent to-transparent'
            }`} />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className={`relative py-32 transition-colors duration-300 ${
        theme === 'light' ? 'bg-white' : 'bg-gradient-to-b from-slate-950 to-slate-900'
      }`}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-scroll-animate>
            <h2 className={`font-display text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'light' ? 'text-slate-900' : ''
            }`}>
              <span className={theme === 'light' ? 'text-orange-500' : 'text-yellow-400'}>{t('categories.learning')}</span>
              <br />
              <span className={theme === 'light' ? 'text-slate-700' : 'text-white'}>{t('categories.categories')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t('categories.kids'), subtitle: t('categories.kidsAge'), gradient: 'from-pink-500 via-purple-500 to-indigo-500' },
              { title: t('categories.school'), subtitle: t('categories.schoolGrade'), gradient: 'from-cyan-500 via-blue-500 to-indigo-500' },
              { title: t('categories.university'), subtitle: t('categories.universityYears'), gradient: 'from-yellow-500 via-orange-500 to-red-500' },
              { title: t('categories.professional'), subtitle: t('categories.professionalGrowth'), gradient: 'from-teal-500 via-green-500 to-emerald-500' },
            ].map((category, idx) => (
              <div
                key={idx}
                data-scroll-animate
                className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-heading text-2xl font-bold text-white">{category.title}</h3>
                  <p className="font-body text-sm text-slate-200 mt-2">{category.subtitle}</p>
                </div>
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Network Section */}
      <section className={`relative py-32 transition-colors duration-300 ${
        theme === 'light' ? 'bg-slate-100' : 'bg-slate-950'
      }`}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-scroll-animate>
            <h2 className={`font-display text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'light' ? 'text-slate-900' : ''
            }`}>
              <span className={theme === 'light' ? 'text-blue-600' : 'text-cyan-400'}>{t('network.global')}</span>
              <br />
              <span className={theme === 'light' ? 'text-slate-700' : 'text-white'}>{t('network.network')}</span>
            </h2>
            <p className={`font-body text-lg max-w-2xl mx-auto ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              {t('network.subtitle')}
            </p>
          </div>

          <div data-scroll-animate className="relative">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/global-network-Mxzjz2XnCzok6xecRo4N8T.webp" 
              alt="Global Network" 
              className={`rounded-2xl shadow-2xl w-full ${
                theme === 'light'
                  ? 'shadow-blue-500/20'
                  : 'shadow-cyan-500/30'
              }`}
            />
            <div className={`absolute inset-0 rounded-2xl ${
              theme === 'light'
                ? 'bg-gradient-to-t from-slate-100 via-transparent to-transparent'
                : 'bg-gradient-to-t from-slate-950 via-transparent to-transparent'
            }`} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={`relative py-32 transition-colors duration-300 ${
        theme === 'light' ? 'bg-white' : 'bg-gradient-to-b from-slate-950 to-slate-900'
      }`}>
        <div className="container max-w-4xl mx-auto px-4 text-center" data-scroll-animate>
          <h2 className={`font-display text-5xl md:text-6xl font-bold mb-8 ${
            theme === 'light' ? 'text-slate-900' : ''
          }`}>
            <span className={theme === 'light' ? 'text-blue-600' : 'text-cyan-400'}>{t('about.about')}</span>
            <br />
            <span className={theme === 'light' ? 'text-slate-700' : 'text-white'}>{t('about.digitaledu')}</span>
          </h2>
          <p className={`font-body text-lg leading-relaxed mb-8 ${
            theme === 'light' ? 'text-slate-700' : 'text-slate-300'
          }`}>
            {t('about.mission')}
          </p>
          <p className={`font-body text-lg leading-relaxed ${
            theme === 'light' ? 'text-slate-700' : 'text-slate-300'
          }`}>
            {t('about.vision')}
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className={`relative py-32 transition-colors duration-300 ${
        theme === 'light' ? 'bg-slate-100' : 'bg-slate-950'
      }`}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-scroll-animate>
            <h2 className={`font-display text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'light' ? 'text-slate-900' : ''
            }`}>
              <span className={theme === 'light' ? 'text-orange-500' : 'text-yellow-400'}>{t('team.meet')}</span>
              <br />
              <span className={theme === 'light' ? 'text-slate-700' : 'text-white'}>{t('team.paradox')}</span>
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
            ].map((member, idx) => (
              <div
                key={idx}
                data-scroll-animate
                className={`p-8 rounded-2xl transition-all duration-500 hover:shadow-lg ${
                  theme === 'light'
                    ? 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-blue-500/20 text-center'
                    : 'glass-dark text-center hover:border-cyan-400/50 hover:shadow-cyan-500/20'
                }`}
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${
                  theme === 'light'
                    ? 'from-blue-400 to-orange-400'
                    : 'from-cyan-400 to-yellow-400'
                } mx-auto mb-6 flex items-center justify-center`}>
                  <span className={`font-display text-2xl font-bold ${
                    theme === 'light' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className={`font-heading text-xl font-bold mb-2 ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  {member.name}
                </h3>
                <p className={`font-body text-sm mb-4 ${
                  theme === 'light' ? 'text-blue-600' : 'text-cyan-400'
                }`}>{member.role}</p>
                <p className={`font-body text-sm ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`relative py-32 overflow-hidden transition-colors duration-300 ${
        theme === 'light' ? 'bg-white' : 'bg-gradient-to-b from-slate-950 to-slate-900'
      }`}>
        <div className="absolute inset-0 z-0">
          <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl ${
            theme === 'light' ? 'bg-blue-500/10' : 'bg-cyan-500/10'
          }`} />
          <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl ${
            theme === 'light' ? 'bg-orange-500/10' : 'bg-yellow-500/10'
          }`} />
        </div>

        <div className={`relative z-10 container max-w-4xl mx-auto px-4 text-center`} data-scroll-animate>
          <h2 className={`font-display text-5xl md:text-6xl font-bold mb-8 ${
            theme === 'light' ? 'text-slate-900' : ''
          }`}>
            <span className={theme === 'light' ? 'text-blue-600' : 'text-cyan-400'}>{t('cta.ready')}</span>
            <br />
            <span className={theme === 'light' ? 'text-slate-700' : 'text-white'}>{t('cta.transform')}</span>
          </h2>
          <p className={`font-body text-lg mb-12 max-w-2xl mx-auto ${
            theme === 'light' ? 'text-slate-700' : 'text-slate-300'
          }`}>
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className={`text-base font-semibold ${
              theme === 'light'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'btn-gradient'
            }`}>
              {t('cta.start')}
            </Button>
            <Button className={`text-base font-semibold ${
              theme === 'light'
                ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                : 'btn-gradient-outline'
            }`}>
              {t('cta.schedule')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative py-16 transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-slate-100 border-t border-slate-200'
          : 'bg-gradient-to-b from-slate-900 to-slate-950 border-t border-cyan-400/10'
      }`}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <img src="/digitaledu-logo.png" alt="DigitalEdu" className="w-12 h-12 object-contain mb-4" />
              <p className={`font-body text-sm ${
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {t('footer.tagline')}
              </p>
            </div>

            <div>
              <h4 className={`font-heading font-bold mb-4 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>{t('footer.quickLinks')}</h4>
              <ul className="space-y-2">
                <li><a href="#features" className={`text-sm transition-colors ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-blue-600'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}>{t('nav.features')}</a></li>
                <li><a href="#categories" className={`text-sm transition-colors ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-blue-600'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}>{t('nav.categories')}</a></li>
                <li><a href="#team" className={`text-sm transition-colors ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-blue-600'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}>{t('nav.team')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className={`font-heading font-bold mb-4 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>{t('footer.resources')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm transition-colors ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-blue-600'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}>{t('footer.blog')}</a></li>
                <li><a href="#" className={`text-sm transition-colors ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-blue-600'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}>{t('footer.documentation')}</a></li>
                <li><a href="#" className={`text-sm transition-colors ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-blue-600'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}>{t('footer.support')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className={`font-heading font-bold mb-4 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>{t('footer.followUs')}</h4>
              <div className="flex gap-4">
                <a href="#" className={`transition-colors ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-blue-600'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}>
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className={`transition-colors ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-blue-600'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}>
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className={`transition-colors ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-blue-600'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}>
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className={`border-t transition-colors ${
            theme === 'light' ? 'border-slate-200' : 'border-cyan-400/10'
          } pt-8 text-center`}>
            <p className={`font-body text-sm ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-500'
            }`}>
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
