import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ChevronDown, Zap, Globe, Users, BookOpen, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { t, language } = useLanguage();
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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
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
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
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
        <div className="relative z-10 container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <div className="flex-1 max-w-2xl">
            <h1 className="hero-title text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-cyan-400">{t('hero.connect')}</span>
              <br />
              <span className="text-white">{t('hero.theWorld')}</span>
              <br />
              <span className="text-yellow-400">{t('hero.education')}</span>
            </h1>

            <p className="hero-subtitle text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
              {t('hero.description')}
            </p>

            <div className="hero-buttons flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105">
                {t('hero.getStarted')}
              </button>
              <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-bold rounded-lg hover:bg-cyan-400/10 transition-all duration-300">
                {t('hero.watchDemo')}
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-bold text-yellow-400">150+</p>
                <p className="text-gray-400">{t('hero.countries')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-400">10K+</p>
                <p className="text-gray-400">{t('hero.courses')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-400">1M+</p>
                <p className="text-gray-400">{t('hero.learners')}</p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="flex-1 hero-image">
            <div
              className="w-full h-96 lg:h-full rounded-2xl overflow-hidden border-2 border-cyan-400/30 shadow-2xl shadow-cyan-400/20"
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
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="scroll-section py-20 bg-gradient-to-b from-background to-slate-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl font-bold mb-4">
              {t('features.why')} <span className="text-cyan-400">DigitalEdu?</span>
            </h2>
            <p className="text-xl text-gray-400">{t('features.subtitle')}</p>
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
                className="fade-in-up p-6 rounded-xl border border-cyan-400/20 bg-slate-900/50 backdrop-blur hover:border-cyan-400/50 hover:bg-slate-900/80 transition-all duration-300 group"
              >
                <feature.icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
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
              {t('journey.your')} <span className="text-cyan-400">{t('journey.starts')}</span>
            </h2>
            <p className="fade-in-up text-xl text-gray-300 mb-8">
              {t('about.mission')}
            </p>
            <button className="fade-in-up px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105">
              {t('cta.start')}
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="scroll-section py-20 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl font-bold mb-4">
              {t('categories.learning')} <span className="text-cyan-400">{t('categories.categories')}</span>
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
                className={`fade-in-up p-8 rounded-xl bg-gradient-to-br ${cat.color} to-transparent opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer transform hover:scale-105 border border-white/10`}
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
            {t('network.global')} <span className="text-cyan-400">{t('network.network')}</span>
          </h2>
          <p className="fade-in-up text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            {t('network.subtitle')}
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="scroll-section py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="fade-in-up text-5xl font-bold mb-6">
              {t('about.about')} <span className="text-cyan-400">DigitalEdu</span>
            </h2>
            <p className="fade-in-up text-lg text-gray-300 mb-6 leading-relaxed">
              {t('about.mission')}
            </p>
            <p className="fade-in-up text-lg text-gray-300 leading-relaxed">
              {t('about.vision')}
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="scroll-section py-20 bg-gradient-to-b from-slate-900/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl font-bold mb-4">
              {t('team.meet')} <span className="text-cyan-400">{t('team.paradox')}</span>
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
                className="fade-in-up p-6 rounded-xl border border-cyan-400/20 bg-slate-900/50 backdrop-blur hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-yellow-400 rounded-full mb-4" />
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-cyan-400 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="scroll-section py-20 bg-gradient-to-r from-cyan-500/20 to-yellow-500/20 border-t border-cyan-400/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="fade-in-up text-5xl font-bold mb-6">
            {t('cta.ready')} <span className="text-cyan-400">{t('cta.transform')}</span>
          </h2>
          <p className="fade-in-up text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="fade-in-up flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105">
              {t('cta.start')}
            </button>
            <button className="px-8 py-4 border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
              {t('cta.schedule')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-cyan-400/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition">{t('nav.features')}</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">{t('nav.categories')}</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">{t('nav.team')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">{t('footer.resources')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition">{t('footer.blog')}</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">{t('footer.documentation')}</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">{t('footer.support')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">{t('footer.followUs')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition">Twitter</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">DigitalEdu</h4>
              <p className="text-gray-400 text-sm">{t('footer.tagline')}</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
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
