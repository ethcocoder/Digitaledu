import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { LanguageThemeSwitcher } from '@/components/LanguageThemeSwitcher';
import { Switch } from '@/components/ui/switch';
import { Save, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { settingsService } from '@/lib/settingsService';
import { UserPreferences } from '../../../shared/types';

interface UserSettingsPanelProps {
  accent?: 'yellow' | 'teal';
}

export default function UserSettingsPanel({ accent = 'yellow' }: UserSettingsPanelProps) {
  const { theme, language } = useLanguage();
  const { profile, user } = useUser();
  const isDark = theme === 'dark';
  const [preferences, setPreferences] = useState<UserPreferences>(
    settingsService.getUserPreferences(profile)
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPreferences(settingsService.getUserPreferences(profile));
  }, [profile]);

  const borderClass = accent === 'teal'
    ? isDark ? 'border-teal-500/10' : 'border-teal-100'
    : isDark ? 'border-yellow-500/10' : 'border-yellow-200';

  const cardClass = `p-6 rounded-2xl border ${isDark ? `bg-slate-900/40 ${borderClass}` : `bg-white ${borderClass}`}`;

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    const prefs: UserPreferences = {
      ...preferences,
      theme,
      language,
    };
    const { error } = await settingsService.saveUserPreferences(user.uid, prefs);
    setSaving(false);
    if (error) toast.error('Failed to save preferences: ' + error);
    else toast.success('Preferences saved!');
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className={cardClass}>
        <h3 className="font-bold text-lg mb-4">Profile</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Name</label>
            <p className="font-medium">{profile?.fullName}</p>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Email</label>
            <p className="font-medium">{profile?.email}</p>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Role</label>
            <p className="font-medium capitalize">{profile?.role}</p>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="font-bold text-lg mb-4">Appearance</h3>
        <LanguageThemeSwitcher />
      </div>

      <div className={cardClass}>
        <h3 className="font-bold text-lg mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Course updates and announcements</p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(v) => setPreferences((p) => ({ ...p, emailNotifications: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Real-time alerts in browser</p>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={(v) => setPreferences((p) => ({ ...p, pushNotifications: v }))}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 disabled:opacity-50 ${
          accent === 'teal'
            ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-white'
            : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
        }`}
      >
        {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}
