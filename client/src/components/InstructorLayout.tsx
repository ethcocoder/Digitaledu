import { ReactNode } from 'react';
import InstructorSidebar from './InstructorSidebar';
import { LanguageThemeSwitcher } from './LanguageThemeSwitcher';

interface InstructorLayoutProps {
  children: ReactNode;
  title: string;
}

export default function InstructorLayout({ children, title }: InstructorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <InstructorSidebar />
      <div className="pl-20 md:pl-72 transition-all duration-300">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-teal-200/50 dark:border-teal-500/10 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          <LanguageThemeSwitcher />
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
