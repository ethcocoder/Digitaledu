import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Zap, Users, BookOpen, Github, Linkedin, Mail, ChevronDown, ArrowRight } from 'lucide-react';
import MorphingLogo from '@/components/MorphingLogo';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * DigitalEdu Premium Landing Page - Morphing Transitions Edition
 * 
 * Design Philosophy:
 * - Premium, modern aesthetic with 3D graphics
 * - Smooth morphing transitions between sections
 * - Parallax scrolling and dynamic motion
 * - Interactive 3D logo and elements
 * - Professional, sophisticated appearance
 */

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // GSAP animations for sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.5,
          },
        }
      );
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-900/20 border-b border-cyan-400/10">
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

      {/* Hero Section with 3D Logo */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950 z-10" />

        {/* Content */}
        <div className="relative z-20 container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
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
                <Button className="btn-gradient-outline text-base font-semibold">
                  Explore Courses
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

            {/* Right - 3D Logo */}
            <div className="hidden md:block">
              <MorphingLogo />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center animate-bounce">
            <ChevronDown className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-animate>
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
                description: 'Access courses from educational systems worldwide, ensuring diverse learning perspectives.',
                color: 'from-cyan-400 to-blue-500',
              },
              {
                icon: BookOpen,
                title: 'All Learning Levels',
                description: 'From early education through Grade 12, university, and professional development programs.',
                color: 'from-yellow-400 to-orange-500',
              },
              {
                icon: Zap,
                title: 'Smart Learning',
                description: 'AI-powered personalization adapts to each learner\'s pace and learning style.',
                color: 'from-purple-400 to-pink-500',
              },
              {
                icon: Users,
                title: 'Global Community',
                description: 'Connect with learners and educators from over 150 countries worldwide.',
                color: 'from-cyan-400 to-teal-500',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                data-animate
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

      {/* Categories Section */}
      <section ref={categoriesRef} id="categories" className="relative py-32 bg-slate-950">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20" data-animate>
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
                data-animate
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

      {/* About Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container max-w-4xl mx-auto px-4 text-center" data-animate>
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
          <div className="text-center mb-20" data-animate>
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
                data-animate
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

      {/* Footer */}
      <footer className="relative py-16 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-cyan-400/10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <img src="/digitaledu-logo.png" alt="DigitalEdu" className="w-12 h-12 object-contain mb-4" />
              <p className="font-body text-slate-400 text-sm">
                Connecting the world of education, one learner at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Features</a></li>
                <li><a href="#categories" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Categories</a></li>
                <li><a href="#team" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Team</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-heading font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Support</a></li>
              </ul>
            </div>

            {/* Social */}
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

          {/* Copyright */}
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
