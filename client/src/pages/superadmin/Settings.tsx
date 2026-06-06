import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { usePlatformSettings } from '@/contexts/PlatformSettingsContext';
import { Save, Shield, Globe, Bell, Mail, Database, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { settingsService } from '@/lib/settingsService';
import { PlatformSettings } from '../../../../shared/types';

type SettingsTab = 'general' | 'security' | 'notifications' | 'email' | 'database';

export default function SuperadminSettings() {
  const { theme } = useLanguage();
  const { user } = useUser();
  const { settings: loadedSettings, refresh } = usePlatformSettings();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState<PlatformSettings>(loadedSettings);
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setSettings(loadedSettings);
    setInitializing(false);
  }, [loadedSettings]);

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Globe },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'email' as const, label: 'Email Services', icon: Mail },
    { id: 'database' as const, label: 'Database & Backups', icon: Database },
  ];

  const update = <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    const { error } = await settingsService.savePlatformSettings(settings, user.uid);
    setSaving(false);
    if (error) {
      toast.error('Failed to save settings: ' + error);
      return;
    }
    toast.success('Settings saved successfully');
    await refresh();
  };

  const inputClass = `w-full p-3 rounded-xl border outline-none transition-colors ${
    isDark ? 'bg-slate-950 border-cyan-400/20 focus:border-cyan-400 text-white' : 'bg-gray-50 border-blue-100 focus:border-blue-500 text-gray-900'
  }`;

  const ToggleRow = ({
    title,
    description,
    checked,
    onCheckedChange,
    danger,
  }: {
    title: string;
    description: string;
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
    danger?: boolean;
  }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${
      isDark ? 'border-cyan-400/10 bg-slate-950/50' : 'border-blue-100 bg-gray-50'
    }`}>
      <div>
        <h4 className={`font-bold ${danger && checked ? 'text-red-500' : ''}`}>{title}</h4>
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );

  const SaveBar = () => (
    <div className="pt-6 mt-6 border-t border-cyan-400/10 flex items-center justify-between">
      {settings.updatedAt > 0 && (
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Last saved {new Date(settings.updatedAt).toLocaleString()}
        </p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`ml-auto flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-transform hover:scale-105 disabled:opacity-50 ${
          isDark ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
        }`}
      >
        {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );

  if (initializing) {
    return (
      <AdminLayout title="Global System Settings">
        <div className="flex justify-center py-20">
          <Loader className="w-10 h-10 animate-spin text-cyan-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Global System Settings">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className={`rounded-2xl border p-4 space-y-2 ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  activeTab === tab.id
                    ? isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20' : 'bg-blue-50 text-blue-600 border border-blue-200'
                    : isDark ? 'text-gray-400 hover:text-cyan-400 hover:bg-white/5' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`flex-1 rounded-2xl border p-6 md:p-8 ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Platform Details</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Core information about DigitalEdu.</p>
              </div>
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Platform Name</label>
                  <input type="text" value={settings.platformName} onChange={(e) => update('platformName', e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Support Contact Email</label>
                  <input type="email" value={settings.supportEmail} onChange={(e) => update('supportEmail', e.target.value)} className={inputClass} />
                </div>
                <ToggleRow
                  title="Maintenance Mode"
                  description="Suspend access for all non-superadmin users."
                  checked={settings.maintenanceMode}
                  onCheckedChange={(v) => update('maintenanceMode', v)}
                  danger
                />
                <ToggleRow
                  title="Course Moderation"
                  description="Require admin approval before courses are published."
                  checked={settings.courseModerationEnabled}
                  onCheckedChange={(v) => update('courseModerationEnabled', v)}
                />
              </div>
              <SaveBar />
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Security Policies</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Authentication and access control settings.</p>
              </div>
              <div className="space-y-4 max-w-2xl">
                <ToggleRow
                  title="Require Email Verification"
                  description="Users must verify email before accessing the platform."
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(v) => update('requireEmailVerification', v)}
                />
                <div className="space-y-2">
                  <label className="text-sm font-bold">Session Timeout (minutes)</label>
                  <input type="number" min={5} max={1440} value={settings.sessionTimeoutMinutes} onChange={(e) => update('sessionTimeoutMinutes', Number(e.target.value))} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Max Login Attempts</label>
                  <input type="number" min={3} max={20} value={settings.maxLoginAttempts} onChange={(e) => update('maxLoginAttempts', Number(e.target.value))} className={inputClass} />
                </div>
              </div>
              <SaveBar />
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Notification Settings</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Platform-wide notification preferences.</p>
              </div>
              <div className="space-y-4 max-w-2xl">
                <ToggleRow
                  title="Email Notifications"
                  description="Send email alerts for enrollments, approvals, and system events."
                  checked={settings.emailNotificationsEnabled}
                  onCheckedChange={(v) => update('emailNotificationsEnabled', v)}
                />
                <ToggleRow
                  title="Push Notifications"
                  description="Enable browser push notifications for real-time alerts."
                  checked={settings.pushNotificationsEnabled}
                  onCheckedChange={(v) => update('pushNotificationsEnabled', v)}
                />
                <div className="space-y-2">
                  <label className="text-sm font-bold">Admin Alert Email</label>
                  <input type="email" value={settings.adminAlertEmail} onChange={(e) => update('adminAlertEmail', e.target.value)} className={inputClass} />
                </div>
              </div>
              <SaveBar />
            </motion.div>
          )}

          {activeTab === 'email' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Email Services</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>SMTP configuration for transactional emails.</p>
              </div>
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-bold">SMTP Host</label>
                  <input type="text" value={settings.smtpHost} onChange={(e) => update('smtpHost', e.target.value)} placeholder="smtp.example.com" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">SMTP Port</label>
                    <input type="number" value={settings.smtpPort} onChange={(e) => update('smtpPort', Number(e.target.value))} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">From Email</label>
                    <input type="email" value={settings.smtpFromEmail} onChange={(e) => update('smtpFromEmail', e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
              <SaveBar />
            </motion.div>
          )}

          {activeTab === 'database' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Database & Backups</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Firestore backup and retention policies.</p>
              </div>
              <div className="space-y-4 max-w-2xl">
                <ToggleRow
                  title="Automatic Backups"
                  description="Schedule daily Firestore exports to cloud storage."
                  checked={settings.autoBackupEnabled}
                  onCheckedChange={(v) => update('autoBackupEnabled', v)}
                />
                <div className="space-y-2">
                  <label className="text-sm font-bold">Backup Retention (days)</label>
                  <input type="number" min={7} max={365} value={settings.backupRetentionDays} onChange={(e) => update('backupRetentionDays', Number(e.target.value))} className={inputClass} />
                </div>
              </div>
              <SaveBar />
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
