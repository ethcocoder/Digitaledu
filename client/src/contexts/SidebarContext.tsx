import { createContext, useContext, useState, ReactNode } from 'react';

type SidebarMode = 'expanded' | 'collapsed';

interface SidebarContextType {
  mode: SidebarMode;
  mobileOpen: boolean;
  toggle: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
  setMode: (m: SidebarMode) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  mode: 'expanded',
  mobileOpen: false,
  toggle: () => {},
  toggleMobile: () => {},
  closeMobile: () => {},
  setMode: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SidebarMode>('expanded');
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggle = () => setMode((m) => (m === 'expanded' ? 'collapsed' : 'expanded'));
  const toggleMobile = () => setMobileOpen((o) => !o);
  const closeMobile = () => setMobileOpen(false);
  return (
    <SidebarContext.Provider value={{ mode, mobileOpen, toggle, toggleMobile, closeMobile, setMode }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
