import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Save, Shield, Globe, Bell, Mail, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuperadminSettings() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email Services', icon: Mail },
    { id: 'database', label: 'Database & Backups', icon: Database },
  ];

  return (
    <AdminLayout title="Global System Settings">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className={`rounded-2xl border p-4 space-y-2 ${
            isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
          }`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                  activeTab === tab.id
                    ? isDark 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20' 
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                    : isDark
                      ? 'text-gray-400 hover:text-cyan-400 hover:bg-white/5 border border-transparent'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className={`flex-1 rounded-2xl border p-6 md:p-8 ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Platform Details</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Update the core information about DigitalEdu.</p>
              </div>
              
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Platform Name</label>
                  <input type="text" defaultValue="DigitalEdu Global" className={`w-full p-3 rounded-xl border outline-none transition-colors ${
                    isDark ? 'bg-slate-950 border-cyan-400/20 focus:border-cyan-400 text-white' : 'bg-gray-50 border-blue-100 focus:border-blue-500 text-gray-900'
                  }`} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold">Support Contact Email</label>
                  <input type="email" defaultValue="support@digitaledu.app" className={`w-full p-3 rounded-xl border outline-none transition-colors ${
                    isDark ? 'bg-slate-950 border-cyan-400/20 focus:border-cyan-400 text-white' : 'bg-gray-50 border-blue-100 focus:border-blue-500 text-gray-900'
                  }`} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-cyan-400/10 bg-slate-950/50 mt-8">
                  <div>
                    <h4 className="font-bold">Maintenance Mode</h4>
                    <p className="text-xs text-gray-400">Suspend access for all non-superadmin users.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-cyan-400/10 flex justify-end">
                <button className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-transform hover:scale-105 ${
                  isDark ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                }`}>
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {activeTab !== 'general' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-600'
              }`}>
                {tabs.find(t => t.id === activeTab)?.icon({ className: "w-8 h-8" })}
              </div>
              <h3 className="text-xl font-bold mb-2">{tabs.find(t => t.id === activeTab)?.label} Module</h3>
              <p className={`max-w-md text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                This configuration module is currently being optimized for the new enterprise architecture.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
