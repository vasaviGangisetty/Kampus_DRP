/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, User, Shield, Check, Bell, Lock } from 'lucide-react';
import { UserProfile, UserRole } from '../types/drp';

interface UserProfileModalProps {
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onUpdateUser: (updated: UserProfile) => void;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  availableUsers,
  onSelectUser,
  onUpdateUser,
  onClose,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(currentUser.webhookUrl || '');
  const [notifications, setNotifications] = useState(currentUser.notificationsEnabled);
  const [twoFactor, setTwoFactor] = useState(currentUser.twoFactorEnabled);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      webhookUrl,
      notificationsEnabled: notifications,
      twoFactorEnabled: twoFactor,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{currentUser.name}</h2>
              <p className="text-xs text-slate-400">{currentUser.title} · {currentUser.organization}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Switch Active Security Persona / Role
          </label>
          <div className="space-y-2">
            {availableUsers.map((u) => {
              const isSelected = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => onSelectUser(u)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{u.name}</span>
                    <span className="text-[11px] text-slate-400">{u.title}</span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                      isSelected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {u.role.replace(/_/g, ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferences Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              SecOps Incident Webhook (Slack / Discord / PagerDuty)
            </label>
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Send high-severity impersonation alerts immediately</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Enforce Hardware / Authenticator 2FA for Takedown Dispatch</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors"
            >
              Save Preferences
            </button>

            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
