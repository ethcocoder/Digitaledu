import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'am';
type Theme = 'light' | 'dark';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.categories': 'Categories',
    'nav.team': 'Team',
    'nav.getStarted': 'Get Started',

    // Hero Section
    'hero.connect': 'Connect',
    'hero.theWorld': 'the World of',
    'hero.education': 'Education',
    'hero.description': 'A global digital education center connecting all types of learning—from early childhood to Grade 12, university, and professional courses from any country curriculum.',
    'hero.getStarted': 'Get Started',
    'hero.watchDemo': 'Watch Demo',
    'hero.countries': 'Countries',
    'hero.courses': 'Courses',
    'hero.learners': 'Learners',

    // Student Section
    'student.learn': 'Learn',
    'student.yourWay': 'Your Way',
    'student.description': 'Whether you\'re a student diving into new subjects or a professional advancing your career, DigitalEdu adapts to your learning style and pace.',
    'student.interactive': 'Interactive lessons with real-time feedback',
    'student.personalized': 'Personalized learning paths',
    'student.experts': 'Expert instructors worldwide',
    'student.explore': 'Explore Learning',

    // Technology Section
    'tech.connected': 'Connected',
    'tech.everywhere': 'Everywhere',
    'tech.description': 'Access your courses on any device, anytime, anywhere. Our platform seamlessly syncs across laptop, tablet, and mobile.',
    'tech.offline': 'Offline access to course materials',
    'tech.sync': 'Sync progress across devices',
    'tech.cloud': 'Cloud-based learning platform',
    'tech.getStarted': 'Get Started Now',

    // Features Section
    'features.why': 'Why Choose',
    'features.digitaledu': 'DigitalEdu?',
    'features.subtitle': 'Comprehensive learning solutions designed for every level',
    'features.global': 'Global Curriculum',
    'features.globalDesc': 'Access courses from educational systems worldwide.',
    'features.levels': 'All Learning Levels',
    'features.levelsDesc': 'From early education through professional development.',
    'features.smart': 'Smart Learning',
    'features.smartDesc': 'AI-powered personalization adapts to your pace.',
    'features.community': 'Global Community',
    'features.communityDesc': 'Connect with learners from 150+ countries.',

    // Journey Section
    'journey.your': 'Your Learning',
    'journey.starts': 'Journey Starts Here',

    // Categories Section
    'categories.learning': 'Learning',
    'categories.categories': 'Categories',
    'categories.kids': 'Kids Education',
    'categories.kidsAge': 'Ages 3-8',
    'categories.school': 'School',
    'categories.schoolGrade': 'Grade 1-12',
    'categories.university': 'University',
    'categories.universityYears': 'All Years',
    'categories.professional': 'Professional',
    'categories.professionalGrowth': 'Career Growth',

    // Global Network Section
    'network.global': 'Global',
    'network.network': 'Learning Network',
    'network.subtitle': 'Connected with educators and learners across 150+ countries',

    // About Section
    'about.about': 'About',
    'about.digitaledu': 'DigitalEdu',
    'about.mission': 'DigitalEdu is a revolutionary platform designed to democratize education globally. We believe that quality education should be accessible to everyone, regardless of their location, age, or background. Our mission is to connect learners and educators worldwide, breaking down barriers and creating opportunities for growth.',
    'about.vision': 'With courses spanning from early childhood education to professional development, we\'re building the future of learning—one student at a time.',

    // Team Section
    'team.meet': 'Meet the',
    'team.paradox': 'Paradox Team',
    'team.latera': 'Latera Zelalem',
    'team.lateraRole': 'CEO & Founder',
    'team.lateraBio': 'Visionary leader passionate about democratizing global education',
    'team.natnael': 'Natnael Ermiyas',
    'team.natnaelRole': 'CTO',
    'team.natnaelBio': 'Tech innovator building scalable solutions for millions of learners',
    'team.tadios': 'Tadios Aschalew',
    'team.tadiosRole': 'Technical Manager',
    'team.tadiosBio': 'Operations expert ensuring seamless platform performance',

    // CTA Section
    'cta.ready': 'Ready to',
    'cta.transform': 'Transform Your Learning?',
    'cta.subtitle': 'Join millions of learners worldwide and start your educational journey today.',
    'cta.start': 'Start Learning Now',
    'cta.schedule': 'Schedule a Demo',

    // Footer
    'footer.tagline': 'Connecting the world of education, one learner at a time.',
    'footer.quickLinks': 'Quick Links',
    'footer.resources': 'Resources',
    'footer.followUs': 'Follow Us',
    'footer.blog': 'Blog',
    'footer.documentation': 'Documentation',
    'footer.support': 'Support',
    'footer.copyright': '© 2026 DigitalEdu. All rights reserved. | Built by Paradox Team',

    // Auth Pages
    'auth.welcome': 'Welcome Back',
    'auth.loginSubtitle': 'Sign in to continue your learning journey',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.login': 'Sign In',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.or': 'Or continue with',
    'auth.noAccount': 'Do not have an account?',
    'auth.signUp': 'Sign up',
    'auth.createAccount': 'Create Account',
    'auth.registerSubtitle': 'Join millions of learners worldwide',
    'auth.fullName': 'Full Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.agreeTerms': 'I agree to the',
    'auth.termsOfService': 'Terms of Service',
    'auth.haveAccount': 'Already have an account?',
    'auth.loading': 'Loading...',
    'auth.logout': 'Logout',
    'auth.emailPlaceholder': 'you@example.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.namePlaceholder': 'John Doe',
    'auth.verifyingIdentity': 'Verifying Identity...',
    'auth.configuringDashboard': 'Configuring Dashboard...',
    'auth.selectRole': 'Select Your Role',
    'auth.student': 'Student',
    'auth.instructor': 'Instructor',
    
    // Dashboard General
    'dashboard.overview': 'Overview',
    'dashboard.users': 'User Management',
    'dashboard.courses': 'Course Lifecycle',
    'dashboard.analytics': 'Analytics',
    'dashboard.financials': 'Financials',
    'dashboard.settings': 'Settings',
    'dashboard.myLearning': 'My Learning',
    'dashboard.catalog': 'Course Catalog',
    'dashboard.achievements': 'Achievements',
    'dashboard.certificates': 'Certificates',
    'dashboard.logout': 'Sign Out',

    // Superadmin Overview
    'superadmin.title': 'Global Enterprise Overview',
    'superadmin.totalUsers': 'Total Users',
    'superadmin.totalCourses': 'Total Courses',
    'superadmin.revenue': 'Global Revenue',
    'superadmin.growth': 'Growth Projection',
    'superadmin.recentActivity': 'Recent Activity',

    // Admin Overview
    'admin.title': 'Platform Administration',
    'admin.pendingApprovals': 'Pending Approvals',
    'admin.activeUsers': 'Total Active Users',
    'admin.activeCourses': 'Active Courses',
    'admin.pendingCourseReviews': 'Pending Course Reviews',
    'admin.newUsers': 'New Users (30d)',
    'admin.totalRevenue': 'Total Revenue',
    'admin.recentActivity': 'Recent Platform Activity',

    // Student Dashboard
    'student.welcome': 'Welcome back!',
    'student.learningMomentum': 'Keep up the momentum!',
    'student.resume': 'Resume Learning',
    'student.inProgress': 'Courses in Progress',
    'student.completed': 'Completed Courses',
    'student.hours': 'Learning Hours',
    'student.continueLearning': 'Continue Learning',
    'student.lookingForMore': 'Looking for more?',
        'student.exploreCatalog': 'Explore Catalog',
    'student.recommendedForYou': 'Recommended for You',
    // Instructor Dashboard
    'instructor.title': 'Instructor Dashboard',
    'instructor.myCourses': 'My Courses',
    'instructor.students': 'My Students',
    'instructor.earnings': 'Earnings',
    'instructor.createCourse': 'Create New Course',
    'instructor.activeCourses': 'Active Courses',
    'instructor.draftCourses': 'Drafts',
    'instructor.pendingReviews': 'Under Review',
    'instructor.totalStudents': 'Total Enrollments',
    'instructor.totalEarnings': 'Total Revenue',
    'instructor.recentActivity': 'Recent Activity',
    'instructor.welcomeBack': 'Ready to share your knowledge? Manage your courses or create a new one.',
  },
  am: {
    // Navigation
    'nav.features': 'ባህሪዎች',
    'nav.categories': 'ምድቦች',
    'nav.team': 'ቡድን',
    'nav.getStarted': 'ጀምር',

    // Hero Section
    'hero.connect': 'ተገናኝ',
    'hero.theWorld': 'የዓለም',
    'hero.education': 'ትምህርት',
    'hero.description': 'ሁሉንም ዓይነት ትምህርት የሚያገናኝ ዓለምአቀፍ ዲጂታል ትምህርት ማእከል - ከልጅነት ጀምሮ እስከ 12ኛ ክፍል፣ ዩኒቨርሲቲ እና ከማንኛውም ሀገር ሥርዓተ ትምህርት ሙያዊ ኮርሶች።',
    'hero.getStarted': 'ጀምር',
    'hero.watchDemo': 'ማሳያ ተመልከት',
    'hero.countries': 'ሀገራት',
    'hero.courses': 'ኮርሶች',
    'hero.learners': 'ተማሪዎች',

    // Student Section
    'student.learn': 'ተማር',
    'student.yourWay': 'በራስህ መንገድ',
    'student.description': 'ምንም ይሁን እንደ ተማሪ ወደ አዲስ ርዕሰ ጉዳዮች ወይም ሙያዊ ሆነህ ስራህን እንደ ማሻሻል፣ DigitalEdu ከአንተ ትምህርት ዘይቤ እና ፍጥነት ጋር ይስተካከላል።',
    'student.interactive': 'ሪアルታይም ግብረመልስ ያለ ተግባራዊ ትምህርቶች',
    'student.personalized': 'ለግል የተወሰነ ትምህርት መንገዶች',
    'student.experts': 'ዓለም አቀፍ ባለሙያ መምህራን',
    'student.explore': 'ትምህርት ተመልከት',

    // Technology Section
    'tech.connected': 'ተገናኝተው',
    'tech.everywhere': 'በሁሉም ቦታ',
    'tech.description': 'በማንኛውም መሳሪያ ላይ ኮርሶችህን ተደራስ - በማንኛውም ጊዜ፣ በማንኛውም ቦታ። ፕላትፎርምናችን በላፕቶፕ፣ ታብሌት እና ሞባይል ላይ በተገቢ ሁኔታ ይመሳሰላል።',
    'tech.offline': 'ኮርስ ቁሳቁሶች ከመስመር ውጭ ተደራሽነት',
    'tech.sync': 'ሁሉም መሳሪያዎ ላይ ሁኔታ ተመሳሳይ ያድርጉ',
    'tech.cloud': 'ደመና ላይ ተመሰረተ ትምህርት ፕላትፎርም',
    'tech.getStarted': 'አሁን ጀምር',

    // Features Section
    'features.why': 'ለምን',
    'features.digitaledu': 'DigitalEdu?',
    'features.subtitle': 'ለእያንዳንዱ ደረጃ የተነደፈ ሁሉን አቀፍ ትምህርት መፍትሄዎች',
    'features.global': 'ዓለምአቀፍ ሥርዓተ ትምህርት',
    'features.globalDesc': 'ከዓለም ሙያዊ ትምህርት ስርዓቶች ኮርሶች ተደራስ።',
    'features.levels': 'ሁሉም ትምህርት ደረጃዎች',
    'features.levelsDesc': 'ከመጀመሪያ ትምህርት እስከ ሙያዊ ልማት።',
    'features.smart': 'ስሌት ትምህርት',
    'features.smartDesc': 'AI-ሊሆን የሚችል ግላዊነት ከአንተ ፍጥነት ጋር ይስተካከላል።',
    'features.community': 'ዓለምአቀፍ ማህበረሰብ',
    'features.communityDesc': 'ከ150+ ሀገራት ተማሪዎች ጋር ተገናኝ።',

    // Journey Section
    'journey.your': 'የአንተ ትምህርት',
    'journey.starts': 'መንገድ እዚህ ይጀምራል',

    // Categories Section
    'categories.learning': 'ትምህርት',
    'categories.categories': 'ምድቦች',
    'categories.kids': 'ልጆች ትምህርት',
    'categories.kidsAge': 'ዓመታት 3-8',
    'categories.school': 'ትምህርት ቤት',
    'categories.schoolGrade': 'ክፍል 1-12',
    'categories.university': 'ዩኒቨርሲቲ',
    'categories.universityYears': 'ሁሉም ዓመታት',
    'categories.professional': 'ሙያዊ',
    'categories.professionalGrowth': 'ስራ እድገት',

    // Global Network Section
    'network.global': 'ዓለምአቀፍ',
    'network.network': 'ትምህርት ኔትወርክ',
    'network.subtitle': 'ከ150+ ሀገራት መምህራን እና ተማሪዎች ጋር ተገናኝተው',

    // About Section
    'about.about': 'ስለ',
    'about.digitaledu': 'DigitalEdu',
    'about.mission': 'DigitalEdu ትምህርትን በዓለም ላይ ለሁሉም ተደራሽ ለማድረግ የተነደፈ አብዮታዊ ፕላትፎርም ነው። ጥራት ያለበት ትምህርት ምንም ይሁን እንደ ሰዎች ቦታ፣ ዕድሜ ወይም ዳራ ለሁሉም ተደራሽ መሆን አለበት ብለን እናምናለን። ሰላም ከሌለበት ነገር ወጥተው ለሁሉም ተማሪዎች እና መምህራን ዓለም አቀፍ ተገናኝነት መፍጠር ነው።',
    'about.vision': 'ከልጅነት ትምህርት ጀምሮ እስከ ሙያዊ ልማት ያለው ኮርሶች ያሉ ሲሆን፣ ትምህርትን ለወደፊት ሰው ሰው በሰው መሠረት እንገነባለን።',

    // Team Section
    'team.meet': 'ሁለተኛ',
    'team.paradox': 'Paradox ቡድን',
    'team.latera': 'ላተራ ዘላለም',
    'team.lateraRole': 'ዋና ሥራ አስፈፃሚ እና ተመሥራች',
    'team.lateraBio': 'ዓለምአቀፍ ትምህርትን ለሁሉም ተደራሽ ለማድረግ ፍቅር ያለ ራዕይ ያለ መሪ',
    'team.natnael': 'ናትናኤል ኤርሚያስ',
    'team.natnaelRole': 'ዋና ቴክኖሎጂ ሥራ አስፈፃሚ',
    'team.natnaelBio': 'ለሚሊዮን ተማሪዎች ሚዛናዊ መፍትሄዎች የሚገነቡ ቴክኖሎጂ ፈጠራ ሰው',
    'team.tadios': 'ታድዮስ አስቻለው',
    'team.tadiosRole': 'ቴክኒካል ሥራ አስተዳዳሪ',
    'team.tadiosBio': 'ፕላትፎርም አፈጻጸም ለስላሳ ለማድረግ ሥራ አስተዳዳሪ',

    // CTA Section
    'cta.ready': 'ዝግጁ ነህ',
    'cta.transform': 'ትምህርትህን ለውጥ?',
    'cta.subtitle': 'ከሚሊዮን ተማሪዎች ጋር ተገናኝተው ትምህርት ጉዞህ ዛሬ ጀምር።',
    'cta.start': 'አሁን ትምህርት ጀምር',
    'cta.schedule': 'ማሳያ ጊዜ ያሰናጁ',

    // Footer
    'footer.tagline': 'ትምህርትን በዓለም ላይ ለሁሉም ተደራሽ ለማድረግ - ሰው ሰው ሰው።',
    'footer.quickLinks': 'ፈጣን ሊንኮች',
    'footer.resources': 'ሀብቶች',
    'footer.followUs': 'ኡስ ተከተል',
    'footer.blog': 'ብሎግ',
    'footer.documentation': 'ሰነዶች',
    'footer.support': 'ድጋፍ',
    'footer.copyright': '© 2026 DigitalEdu. ሁሉም መብቶች የተጠበቁ ናቸው | በ Paradox ቡድን ተገንብቷል',
    // Auth Pages
    'auth.welcome': 'እንደገና ደህና መጣህ',
    'auth.loginSubtitle': 'ትምህርት ጉዞህን ለመቀጠል ይግቡ',
    'auth.email': 'ኢሜይል አድራሻ',
    'auth.password': 'ይለፍ ቃል',
    'auth.login': 'ይግቡ',
    'auth.rememberMe': 'አስታውስ',
    'auth.forgotPassword': 'ይለፍ ቃል ረስተሃል?',
    'auth.or': 'ወይም ከሚከተለው ጋር ቀጥል',
    'auth.noAccount': 'ሂሳብ የሉትም?',
    'auth.signUp': 'ተመዝገብ',
    'auth.createAccount': 'ሂሳብ ፍጠር',
    'auth.registerSubtitle': 'ከሚሊዮን ተማሪዎች ጋር ተገናኝተው',
    'auth.fullName': 'ሙሉ ስም',
    'auth.confirmPassword': 'ይለፍ ቃል ያረጋግጡ',
    'auth.agreeTerms': 'ከ ተስማምቻለሁ',
    'auth.termsOfService': 'የአገልግሎት ውል',
    'auth.haveAccount': 'ቀድሞ ሂሳብ አለህ?',
    'auth.loading': 'በመጫን ላይ...',
    'auth.logout': 'ውጣ',
    'auth.emailPlaceholder': 'you@example.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.namePlaceholder': 'ሙሉ ስም',
    'auth.verifyingIdentity': 'ማንነትን በማረጋገጥ ላይ...',
    'auth.configuringDashboard': 'ዳሽቦርድ በማስተካከል ላይ...',
    'auth.selectRole': 'ሚናዎን ይምረጡ',
    'auth.student': 'ተማሪ',
    'auth.instructor': 'መምህር',
    
    // Dashboard General
    'dashboard.overview': 'አጠቃላይ እይታ',
    'dashboard.users': 'የተጠቃሚ አስተዳደር',
    'dashboard.courses': 'የኮርስ አስተዳደር',
    'dashboard.analytics': 'ትንታኔ',
    'dashboard.financials': 'ፋይናንስ',
    'dashboard.settings': 'ቅንብሮች',
    'dashboard.myLearning': 'የእኔ ትምህርት',
    'dashboard.catalog': 'የኮርስ ዝርዝር',
    'dashboard.achievements': 'ስኬቶች',
    'dashboard.certificates': 'የምስክር ወረቀቶች',
    'dashboard.logout': 'ውጣ',

    // Superadmin Overview
    'superadmin.title': 'ዓለምአቀፍ ኢንተርፕራይዝ አጠቃላይ እይታ',
    'superadmin.totalUsers': 'ጠቅላላ ተጠቃሚዎች',
    'superadmin.totalCourses': 'ጠቅላላ ኮርሶች',
    'superadmin.revenue': 'ጠቅላላ ገቢ',
    'superadmin.growth': 'የእድገት ትንበያ',
    'superadmin.recentActivity': 'የቅርብ ጊዜ እንቅስቃሴዎች',

    // Admin Overview
    'admin.title': 'የፕላትፎርም አስተዳደር',
    'admin.pendingApprovals': 'በመጠባበቅ ላይ ያሉ',
    'admin.activeUsers': 'ጠቅላላ ንቁ ተጠቃሚዎች',
    'admin.activeCourses': 'ንቁ ኮርሶች',
    'admin.pendingCourseReviews': 'በግምገማ ላይ ያሉ ኮርሶች',
    'admin.newUsers': 'አዳዲስ ተጠቃሚዎች (30 ቀን)',
    'admin.totalRevenue': 'ጠቅላላ ገቢ',
    'admin.recentActivity': 'የቅርብ ጊዜ እንቅስቃሴ',

    // Student Dashboard
    'student.welcome': 'እንኳን ደህና መጣህ!',
    'student.learningMomentum': 'ፍጥነትዎን ይቀጥሉ!',
    'student.resume': 'ትምህርት ቀጥል',
    'student.inProgress': 'በመከናወን ላይ ያሉ ኮርሶች',
    'student.completed': 'የተጠናቀቁ ኮርሶች',
    'student.hours': 'የጥናት ሰዓታት',
    'student.continueLearning': 'ትምህርትዎን ይቀጥሉ',
    'student.lookingForMore': 'ተጨማሪ ይፈልጋሉ?',
        'student.exploreCatalog': 'ካታሎጉን ያስሱ',
    'student.recommendedForYou': 'ለእርስዎ የሚመከሩ',
    // Instructor Dashboard
    'instructor.title': 'የአስተማሪ ዳሽቦርድ',
    'instructor.myCourses': 'የእኔ ኮርሶች',
    'instructor.students': 'ተማሪዎቼ',
    'instructor.earnings': 'ገቢዎች',
    'instructor.createCourse': 'አዲስ ኮርስ ፍጠር',
    'instructor.activeCourses': 'ንቁ ኮርሶች',
    'instructor.draftCourses': 'ረቂቆች',
    'instructor.pendingReviews': 'በግምገማ ላይ',
    'instructor.totalStudents': 'ጠቅላላ ተመዝጋቢዎች',
    'instructor.totalEarnings': 'ጠቅላላ ገቢ',
    'instructor.recentActivity': 'የቅርብ ጊዜ እንቅስቃሴዎች',
    'instructor.welcomeBack': 'እውቀትዎን ለማካፈል ዝግጁ ነዎት? ኮርሶችዎን ያስተዳድሩ ወይም አዲስ ይፍጠሩ።',
  },
};;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'en';
    }
    return 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'dark';
    }
    return 'dark';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      const html = document.documentElement;
      if (newTheme === 'light') {
        html.classList.add('light-mode');
        html.classList.remove('dark');
      } else {
        html.classList.remove('light-mode');
        html.classList.add('dark');
      }
    }
  };

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.add('light-mode');
      html.classList.remove('dark');
    } else {
      html.classList.remove('light-mode');
      html.classList.add('dark');
    }
  }, [theme]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, theme, setTheme, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
