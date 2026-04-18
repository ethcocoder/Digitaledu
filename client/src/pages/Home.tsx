import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Zap, Users, BookOpen, Github, Linkedin, Mail, ChevronDown, ArrowRight, Play } from 'lucide-react';
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
 * - Interactive elements
 * - Premium aesthetic
 */

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-900/30 border-b border-cyan-400/10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/digitaledu-logo.png" alt="DigitalEdu" className="w-10 h-10 object-contain" />
            <span className="font-display text-lg font-bold">
              <span className="text-yellow-400">Digital</span>
              <span className="text-cyan-400">Edu</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-sm hover:text-cyan-400 transition-colors duration-300">Features</a>
            <a href="#categories" className="text-sm hover:text-cyan-400 transition-colors duration-300">Categories</a>
            <a href="#team" className="text-sm hover:text-cyan-400 transition-colors duration-300">Team</a>
          </div>
          <Button className="btn-gradient text-xs md:text-sm">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section with 3D Teacher Visual */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/hero-3d-teacher-7ih8TQoEaxdkPU6eUPz2LC.webp" 
            alt="Teacher" 
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10" />

        <div className="relative z-20 container max-w-6xl mx-auto px-4">
          <div className="max-w-2xl">
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h1 className="font-display text-6xl md:text-7xl font-bold mb-6 leading-tight">
                  <span className="text-cyan-400">Connect</span>
                  <br />
                  <span className="text-white">the World of</span>
                  <br />
                  <span className="text-yellow-400">Education</span>
                </h1>
              </div>

              <p className="font-body text-lg md:text-xl text-slate-300 max-w-lg leading-relaxed">
                A global digital education center connecting all types of learning—from early childhood to Grade 12, university, and professional courses from any country curriculum.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-gradient text-base font-semibold group">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button className="btn-gradient-outline text-base font-semibold flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-cyan-400/20">
                <div>
                  <p className="text-2xl font-bold text-cyan-400">150+</p>
                  <p className="text-sm text-slate-400">Countries</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">10K+</p>
                  <p className="text-sm text-slate-400">Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-400">1M+</p>
                  <p className="text-sm text-slate-400">Learners</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center animate-bounce z-20">
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </div>
      </section>

      {/* Student Learning Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-scroll-animate className="space-y-8">
              <h2 className="font-display text-5xl md:text-6xl font-bold">
                <span className="text-cyan-400">Learn</span>
                <br />
                <span className="text-white">Your Way</span>
              </h2>
              <p className="font-body text-lg text-slate-300 leading-relaxed">
                Whether you're a student diving into new subjects or a professional advancing your career, DigitalEdu adapts to your learning style and pace.
              </p>
              <ul className="space-y-4">
                {['Interactive lessons with real-time feedback', 'Personalized learning paths', 'Expert instructors worldwide'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="btn-gradient text-base font-semibold">Explore Learning</Button>
            </div>
            <div data-scroll-animate className="relative">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/hero-3d-student-BdWgEwEakpiqU8L3NQxzKV.webp" 
                alt="Student Learning" 
                className="rounded-2xl shadow-2xl shadow-cyan-500/20"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Integration Section */}
      <section className="relative py-32 bg-slate-950 overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-scroll-animate className="relative order-2 md:order-1">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/hero-3d-technology-2d4YXVPmMSXLWuwxWDZR7z.webp" 
                alt="Technology" 
                className="rounded-2xl shadow-2xl shadow-yellow-500/20"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>
            <div data-scroll-animate className="space-y-8 order-1 md:order-2">
              <h2 className="font-display text-5xl md:text-6xl font-bold">
                <span className="text-yellow-400">Connected</span>
                <br />
                <span className="text-white">Everywhere</span>
              </h2>
              <p className="font-body text-lg text-slate-300 leading-relaxed">
                Access your courses on any device, anytime, anywhere. Our platform seamlessly syncs across laptop, tablet, and mobile.
              </p>
              <ul className="space-y-4">
                {['Offline access to course materials', 'Sync progress across devices', 'Cloud-based learning platform'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="btn-gradient text-base font-semibold">Get Started Now</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-scroll-animate>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
              <span className="text-cyan-400">Why Choose</span>
              <br />
              <span className="text-white">DigitalEdu?</span>
            </h2>
            <p className="font-body text-slate-400 text-lg max-w-2xl mx-auto">
              Comprehensive learning solutions designed for every level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Globe,
                title: 'Global Curriculum',
                description: 'Access courses from educational systems worldwide.',
                color: 'from-cyan-400 to-blue-500',
              },
              {
                icon: BookOpen,
                title: 'All Learning Levels',
                description: 'From early education through professional development.',
                color: 'from-yellow-400 to-orange-500',
              },
              {
                icon: Zap,
                title: 'Smart Learning',
                description: 'AI-powered personalization adapts to your pace.',
                color: 'from-purple-400 to-pink-500',
              },
              {
                icon: Users,
                title: 'Global Community',
                description: 'Connect with learners from 150+ countries.',
                color: 'from-cyan-400 to-teal-500',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                data-scroll-animate
                className="glass-dark p-8 rounded-2xl hover:border-cyan-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/20 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="font-body text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Journey Section */}
      <section className="relative py-32 bg-slate-950 overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-scroll-animate>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
              <span className="text-yellow-400">Your Learning</span>
              <br />
              <span className="text-white">Journey Starts Here</span>
            </h2>
          </div>

          <div data-scroll-animate className="relative">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/learning-journey-Gmstv2eyV53SfXjyU7FTr9.webp" 
              alt="Learning Journey" 
              className="rounded-2xl shadow-2xl shadow-cyan-500/30 w-full"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-scroll-animate>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
              <span className="text-yellow-400">Learning</span>
              <br />
              <span className="text-white">Categories</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Kids Education', subtitle: 'Ages 3-8', gradient: 'from-pink-500 via-purple-500 to-indigo-500' },
              { title: 'School', subtitle: 'Grade 1-12', gradient: 'from-cyan-500 via-blue-500 to-indigo-500' },
              { title: 'University', subtitle: 'All Years', gradient: 'from-yellow-500 via-orange-500 to-red-500' },
              { title: 'Professional', subtitle: 'Career Growth', gradient: 'from-teal-500 via-green-500 to-emerald-500' },
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
      <section className="relative py-32 bg-slate-950 overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-scroll-animate>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
              <span className="text-cyan-400">Global</span>
              <br />
              <span className="text-white">Learning Network</span>
            </h2>
            <p className="font-body text-slate-400 text-lg max-w-2xl mx-auto">
              Connected with educators and learners across 150+ countries
            </p>
          </div>

          <div data-scroll-animate className="relative">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/global-network-Mxzjz2XnCzok6xecRo4N8T.webp" 
              alt="Global Network" 
              className="rounded-2xl shadow-2xl shadow-cyan-500/30 w-full"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container max-w-4xl mx-auto px-4 text-center" data-scroll-animate>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            <span className="text-cyan-400">About</span>
            <br />
            <span className="text-white">DigitalEdu</span>
          </h2>
          <p className="font-body text-lg text-slate-300 leading-relaxed mb-8">
            DigitalEdu is a revolutionary platform designed to democratize education globally. We believe that quality education should be accessible to everyone, regardless of their location, age, or background. Our mission is to connect learners and educators worldwide, breaking down barriers and creating opportunities for growth.
          </p>
          <p className="font-body text-lg text-slate-300 leading-relaxed">
            With courses spanning from early childhood education to professional development, we're building the future of learning—one student at a time.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="relative py-32 bg-slate-950">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-scroll-animate>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
              <span className="text-yellow-400">Meet the</span>
              <br />
              <span className="text-white">Paradox Team</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Latera Zelalem',
                role: 'CEO & Founder',
                bio: 'Visionary leader passionate about democratizing global education',
              },
              {
                name: 'Natnael Ermiyas',
                role: 'CTO',
                bio: 'Tech innovator building scalable solutions for millions of learners',
              },
              {
                name: 'Tadios Aschalew',
                role: 'Technical Manager',
                bio: 'Operations expert ensuring seamless platform performance',
              },
            ].map((member, idx) => (
              <div
                key={idx}
                data-scroll-animate
                className="glass-dark p-8 rounded-2xl text-center hover:border-cyan-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-yellow-400 mx-auto mb-6 flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-slate-900">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-white">
                  {member.name}
                </h3>
                <p className="font-body text-cyan-400 text-sm mb-4">{member.role}</p>
                <p className="font-body text-slate-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container max-w-4xl mx-auto px-4 text-center" data-scroll-animate>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">
            <span className="text-cyan-400">Ready to</span>
            <br />
            <span className="text-white">Transform Your Learning?</span>
          </h2>
          <p className="font-body text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
            Join millions of learners worldwide and start your educational journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-gradient text-base font-semibold">
              Start Learning Now
            </Button>
            <Button className="btn-gradient-outline text-base font-semibold">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-cyan-400/10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <img src="/digitaledu-logo.png" alt="DigitalEdu" className="w-12 h-12 object-contain mb-4" />
              <p className="font-body text-slate-400 text-sm">
                Connecting the world of education, one learner at a time.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Features</a></li>
                <li><a href="#categories" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Categories</a></li>
                <li><a href="#team" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Team</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-400/10 pt-8 text-center">
            <p className="font-body text-slate-500 text-sm">
              © 2026 DigitalEdu. All rights reserved. | Built by Paradox Team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
