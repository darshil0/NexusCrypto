import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import {
  Settings,
  Shield,
  Smartphone,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  AlertTriangle,
  KeyRound,
} from 'lucide-react';
import { Badge, Button, Card, Modal } from '../components/ui/BaseComponents';

export const SettingsSecurityPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useDemo();

  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'danger'>('general');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Security Simulator States
  const [passwordInput, setPasswordInput] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(true);

  // Mock Password score calculation
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score, label: 'Moderate', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const pwdStrength = calculatePasswordStrength(passwordInput);

  const mockSessions = [
    {
      id: 'sess-1',
      device: 'Chrome on macOS (Current Session)',
      ip: '192.168.1.45 (Localhost Sandbox)',
      location: 'San Francisco, US',
      lastActive: 'Just now',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'Nexus App on iOS Simulator',
      ip: '10.0.0.12',
      location: 'New York, US',
      lastActive: '2 days ago',
      isCurrent: false,
    },
  ];

  const mockAuditLogs = [
    { id: '1', event: 'Paper Trading Terminal Launch', time: 'Today, 10:14 AM', status: 'Success' },
    { id: '2', event: 'Sandbox Faucet Credit ($25,000 USD)', time: 'Today, 09:30 AM', status: 'Success' },
    { id: '3', event: 'Two-Factor Authentication Verified', time: 'Yesterday, 04:12 PM', status: 'Success' },
    { id: '4', event: 'API Security Token Rotated', time: '3 days ago', status: 'Success' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Settings & Security Center</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage local sandbox preferences, test 2FA security simulators, and configure account safety rules.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'general'
              ? 'text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Preferences</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'security'
              ? 'text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security Simulator</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('danger')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'danger'
              ? 'text-rose-400 border-b-2 border-rose-500'
              : 'text-slate-400 hover:text-rose-300'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Sandbox</span>
        </button>
      </div>

      {/* Tab: General */}
      {activeTab === 'general' && (
        <div className="space-y-6 max-w-3xl">
          <Card className="p-6 space-y-6">
            <h3 className="text-base font-bold text-white">Appearance & Display</h3>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-sm block">Interface Theme</span>
                <span className="text-xs text-slate-400">Switch between dark crypto terminal and light mode</span>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    settings.theme === 'dark' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    settings.theme === 'light' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'system' })}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    settings.theme === 'system' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" /> System
                </button>
              </div>
            </div>

            {/* Currency Choice */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div>
                <span className="font-bold text-white text-sm block">Base Display Currency</span>
                <span className="text-xs text-slate-400">Primary fiat valuation currency</span>
              </div>
              <select
                value={settings.currency}
                onChange={(e) => updateSettings({ currency: e.target.value as 'USD' | 'EUR' | 'GBP' })}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Sound toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div>
                <span className="font-bold text-white text-sm block">Order Sound Effects</span>
                <span className="text-xs text-slate-400">Play simulated sound chime on order fills</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Security Simulator */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-3xl">
          {/* 2FA Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Two-Factor Authentication (MFA)</h3>
                  <span className="text-xs text-slate-400">Simulate TOTP Authenticator protection</span>
                </div>
              </div>
              <Badge variant={mfaEnabled ? 'emerald' : 'rose'}>
                {mfaEnabled ? 'Enabled (Demo)' : 'Disabled'}
              </Badge>
            </div>
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-400">Protects withdrawals and sensitive order actions</span>
              <button
                type="button"
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className="text-indigo-400 font-bold hover:underline"
              >
                {mfaEnabled ? 'Disable Simulation' : 'Enable Simulation'}
              </button>
            </div>
          </Card>

          {/* Password Strength Simulator */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Password Security Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Test password complexity. Real crypto platforms require strong unique passphrases to defend against credential stuffing.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Type a test password (e.g. Tr0ng#Passw0rd!)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />

              {passwordInput && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Complexity:</span>
                    <span className="font-bold text-slate-200">{pwdStrength.label}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`${pwdStrength.color} h-full transition-all duration-300`}
                      style={{ width: `${(pwdStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Trusted Devices Sessions */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Laptop className="w-4 h-4 text-sky-400" />
              <span>Simulated Active Sessions</span>
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {mockSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <div>
                    <div className="flex items-center gap-2 font-sans font-bold text-white">
                      <span>{sess.device}</span>
                      {sess.isCurrent && <Badge variant="emerald" size="sm">Current</Badge>}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      {sess.ip} • {sess.location} • {sess.lastActive}
                    </div>
                  </div>
                  {!sess.isCurrent && (
                    <button
                      type="button"
                      className="text-rose-400 text-xs font-sans hover:underline"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Security Audit Log */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">Security Event Audit Log</h3>
            <div className="divide-y divide-slate-800 font-mono text-xs">
              {mockAuditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-slate-200 block font-sans font-medium">{log.event}</span>
                    <span className="text-slate-500 text-[10px]">{log.time}</span>
                  </div>
                  <Badge variant="emerald" size="sm">{log.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Danger Zone / Reset Sandbox */}
      {activeTab === 'danger' && (
        <div className="space-y-6 max-w-3xl">
          <Card className="p-6 border-rose-900/50 bg-rose-950/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Reset Demo Sandbox Data</h3>
                <p className="text-xs text-slate-400">
                  This will wipe all paper trade history, orders, converted balances, and restore your initial seed account ($25,000 USD, 0.45 BTC, 4.2 ETH, 35 SOL).
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="danger"
                size="md"
                className="font-bold"
                onClick={() => setIsResetModalOpen(true)}
              >
                Reset All Balances & History
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Confirm Sandbox Reset"
      >
        <div className="space-y-4 font-sans text-sm text-slate-300">
          <p>
            Are you sure you want to reset all simulated paper balances, open orders, and transaction history back to default seed state?
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              className="flex-1 font-bold"
              onClick={() => {
                resetDemoData();
                setIsResetModalOpen(false);
              }}
            >
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
