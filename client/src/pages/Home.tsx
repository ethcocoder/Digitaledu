import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Zap, Users, BookOpen, Github, Linkedin, Mail, ChevronDown } from 'lucide-react';

/**
 * DigitalEdu Landing Page - Futuristic Neon Elegance Theme
 * 
 * Design Philosophy:
 * - Deep Navy (#0A1128) background with Neon Cyan (#00D9FF) and Gold (#FFD700) accents
 * - Glassmorphism effects with frosted glass containers
 * - Asymmetric layouts with diagonal elements and layered depth
 * - Kinetic animations: floating particles, glowing borders, smooth scroll reveals
 * - Typography: Space Mono (display), Poppins (headings), Inter (body)
 */

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-900/30 border-b border-cyan-400/20">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/digitaledu-logo_f62bdadc.png" alt="DigitalEdu Logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-sm hover:text-cyan-400 transition-colors">Features</a>
            <a href="#categories" className="text-sm hover:text-cyan-400 transition-colors">Categories</a>
            <a href="#team" className="text-sm hover:text-cyan-400 transition-colors">Team</a>
          </div>
          <Button className="btn-gradient text-xs md:text-sm">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663323609224/C6xAWVSEFURVdsUoL9Z5we/hero-background-W7gaeYGygzJGNcYoE8k5Rs.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950 z-10" />

        {/* Content */}
        <div className="relative z-20 container max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8 animate-fade-in-up flex justify-center">
            <img src="/manus-storage/digitaledu-logo_f62bdadc.png" alt="DigitalEdu" className="w-48 h-48 md:w-64 md:h-64 object-contain mb-8" />
          </div>
          <div className="mb-8 animate-fade-in-up">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-cyan-400">Connect</span>
              <br />
              <span className="text-white">the World of</span>
              <br />
              <span className="text-yellow-400">Education</span>
            </h1>
          </div>

          <p className="font-body text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            A global digital education center connecting all types of learning—from early childhood to Grade 12, university, and professional courses from any country curriculum.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="btn-gradient text-base font-semibold">
              Get Started
            </Button>
            <Button className="btn-gradient-outline text-base font-semibold">
              Explore Courses
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 flex justify-center animate-bounce">
            <ChevronDown className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-cyan-400">Why Choose</span>
              <br />
              <span className="text-white">DigitalEdu?</span>
            </h2>
            <p className="font-body text-slate-400 text-lg">
              Comprehensive learning solutions designed for every level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="glass-dark p-8 rounded-2xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-white">
                Global Curriculum
              </h3>
              <p className="font-body text-slate-400">
                Access courses from educational systems worldwide, ensuring diverse learning perspectives.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-dark p-8 rounded-2xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-white">
                All Learning Levels
              </h3>
              <p className="font-body text-slate-400">
                From early education through Grade 12, university, and professional development programs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-dark p-8 rounded-2xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-white">
                Smart Learning System
              </h3>
              <p className="font-body text-slate-400">
                AI-powered personalization adapts to each learner's pace and learning style.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-dark p-8 rounded-2xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-white">
                Global Community
              </h3>
              <p className="font-body text-slate-400">
                Connect with learners and educators from over 150 countries worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="relative py-24 bg-slate-950">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-yellow-400">Learning</span>
              <br />
              <span className="text-white">Categories</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <div className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <BookOpen className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-2xl font-bold text-white">Kids Education</h3>
                <p className="font-body text-sm text-slate-200 mt-2">Ages 3-8</p>
              </div>
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
            </div>

            {/* Category 2 */}
            <div className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <BookOpen className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-2xl font-bold text-white">School</h3>
                <p className="font-body text-sm text-slate-200 mt-2">Grade 1-12</p>
              </div>
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
            </div>

            {/* Category 3 */}
            <div className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <BookOpen className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-2xl font-bold text-white">University</h3>
                <p className="font-body text-sm text-slate-200 mt-2">All Years</p>
              </div>
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
            </div>

            {/* Category 4 */}
            <div className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-green-500 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <BookOpen className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-2xl font-bold text-white">Professional</h3>
                <p className="font-body text-sm text-slate-200 mt-2">Career Growth</p>
              </div>
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="glass-dark p-12 rounded-3xl border border-cyan-400/30">
            <h2 className="font-display text-4xl font-bold mb-6">
              <span className="text-cyan-400">About</span>
              <span className="text-white"> DigitalEdu</span>
            </h2>
            <p className="font-body text-lg text-slate-300 leading-relaxed mb-6">
              DigitalEdu is revolutionizing global education by creating a unified platform that transcends geographical and curriculum boundaries. Our mission is to democratize access to world-class education for learners of all ages and backgrounds.
            </p>
            <p className="font-body text-lg text-slate-300 leading-relaxed">
              We believe that education is the foundation of human progress. By connecting learners with educators and resources from around the world, we're building a future where quality education is accessible to everyone, regardless of where they live or their economic circumstances.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="relative py-24 bg-slate-950">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-yellow-400">Meet</span>
              <br />
              <span className="text-white">Our Team</span>
            </h2>
            <p className="font-body text-slate-400 text-lg">
              Paradox Team - Building the Future of Education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="glass-dark p-8 rounded-2xl text-center hover:border-yellow-400/50 transition-all duration-300">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 mx-auto mb-6 flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-slate-900">LZ</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">
                Latera Zelalem
              </h3>
              <p className="font-body text-yellow-400 font-semibold mb-3">CEO & Founder</p>
              <p className="font-body text-slate-400 text-sm">
                Visionary leader driving DigitalEdu's mission to transform global education through innovation and accessibility.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="glass-dark p-8 rounded-2xl text-center hover:border-yellow-400/50 transition-all duration-300">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 mx-auto mb-6 flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-slate-900">NE</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">
                Natnael Ermiyas
              </h3>
              <p className="font-body text-cyan-400 font-semibold mb-3">CTO</p>
              <p className="font-body text-slate-400 text-sm">
                Technical architect designing scalable systems that power seamless learning experiences for millions.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="glass-dark p-8 rounded-2xl text-center hover:border-yellow-400/50 transition-all duration-300">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-green-500 mx-auto mb-6 flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-slate-900">TA</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">
                Tadios Aschalew
              </h3>
              <p className="font-body text-cyan-400 font-semibold mb-3">Technical Manager</p>
              <p className="font-body text-slate-400 text-sm">
                Operations leader ensuring excellence in project delivery and technical implementation across all initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-cyan-400/20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <img src="/manus-storage/digitaledu-logo_f62bdadc.png" alt="DigitalEdu" className="w-12 h-12 object-contain mb-4" />
              <p className="font-body text-slate-400 text-sm">
                Connecting the world of education, one learner at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="font-body text-slate-400 hover:text-cyan-400 transition-colors text-sm">Features</a></li>
                <li><a href="#" className="font-body text-slate-400 hover:text-cyan-400 transition-colors text-sm">Courses</a></li>
                <li><a href="#" className="font-body text-slate-400 hover:text-cyan-400 transition-colors text-sm">Pricing</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-heading font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="font-body text-slate-400 hover:text-cyan-400 transition-colors text-sm">About</a></li>
                <li><a href="#" className="font-body text-slate-400 hover:text-cyan-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="font-body text-slate-400 hover:text-cyan-400 transition-colors text-sm">Careers</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-heading font-bold text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-cyan-400/20 flex items-center justify-center transition-colors">
                  <Github className="w-5 h-5 text-cyan-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-cyan-400/20 flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5 text-cyan-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-cyan-400/20 flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="font-body text-slate-500 text-sm">
              © 2026 DigitalEdu. All rights reserved. | Developed by Paradox Team
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="font-body text-slate-500 hover:text-cyan-400 transition-colors text-sm">Privacy</a>
              <a href="#" className="font-body text-slate-500 hover:text-cyan-400 transition-colors text-sm">Terms</a>
              <a href="#" className="font-body text-slate-500 hover:text-cyan-400 transition-colors text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
