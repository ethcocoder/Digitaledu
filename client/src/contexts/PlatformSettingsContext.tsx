import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { PlatformSettings, DEFAULT_PLATFORM_SETTINGS } from '../../../shared/types';
import { settingsService } from '@/lib/settingsService';

interface PlatformSettingsContextType {
  settings: PlatformSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const PlatformSettingsContext = createContext<PlatformSettingsContextType>({
  settings: DEFAULT_PLATFORM_SETTINGS,
  loading: true,
  refresh: async () => {},
});

export function PlatformSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { settings: data } = await settingsService.getPlatformSettings();
    setSettings(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <PlatformSettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </PlatformSettingsContext.Provider>
  );
}

export function usePlatformSettings() {
  return useContext(PlatformSettingsContext);
}
