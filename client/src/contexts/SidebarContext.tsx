import { createContext, useContext, useState, ReactNode } from 'react';

type SidebarMode = 'expanded' | 'collapsed';

interface SidebarContextType {
  mode: SidebarMode;
  toggle: () => void;
  setMode: (m: SidebarMode) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  mode: 'expanded',
  toggle: () => {},
  setMode: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SidebarMode>('expanded');
  const toggle = () => setMode((m) => (m === 'expanded' ? 'collapsed' : 'expanded'));
  return (
    <SidebarContext.Provider value={{ mode, toggle, setMode }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
