import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePlatformSettings } from '@/contexts/PlatformSettingsContext';
import { Globe, Shield, Bell, Mail, Database } from 'lucide-react';

export default function AdminSettings() {
  const { theme } = useLanguage();
  const { settings, loading } = usePlatformSettings();
  const isDark = theme === 'dark';

  const sections = [
    { icon: Globe, label: 'Platform', items: [
      { label: 'Platform Name', value: settings.platformName },
      { label: 'Support Email', value: settings.supportEmail },
      { label: 'Maintenance Mode', value: settings.maintenanceMode ? 'Active' : 'Off' },
      { label: 'Course Moderation', value: settings.courseModerationEnabled ? 'Enabled' : 'Disabled' },
    ]},
    { icon: Shield, label: 'Security', items: [
      { label: 'Email Verification', value: settings.requireEmailVerification ? 'Required' : 'Optional' },
      { label: 'Session Timeout', value: `${settings.sessionTimeoutMinutes} min` },
      { label: 'Max Login Attempts', value: String(settings.maxLoginAttempts) },
    ]},
    { icon: Bell, label: 'Notifications', items: [
      { label: 'Email Notifications', value: settings.emailNotificationsEnabled ? 'On' : 'Off' },
      { label: 'Push Notifications', value: settings.pushNotificationsEnabled ? 'On' : 'Off' },
      { label: 'Admin Alert Email', value: settings.adminAlertEmail },
    ]},
    { icon: Mail, label: 'Email Services', items: [
      { label: 'SMTP Host', value: settings.smtpHost || 'Not configured' },
      { label: 'SMTP Port', value: String(settings.smtpPort) },
      { label: 'From Email', value: settings.smtpFromEmail },
    ]},
    { icon: Database, label: 'Backups', items: [
      { label: 'Auto Backup', value: settings.autoBackupEnabled ? 'Enabled' : 'Disabled' },
      { label: 'Retention', value: `${settings.backupRetentionDays} days` },
    ]},
  ];

  return (
    <AdminLayout title="Platform Settings">
      <div className="space-y-6">
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          View platform configuration. Contact a superadmin to make changes.
        </p>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading settings...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <div key={section.label} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-yellow-400/10' : 'bg-white border-yellow-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold">{section.label}</h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {settings.updatedAt > 0 && (
          <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Last updated {new Date(settings.updatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
