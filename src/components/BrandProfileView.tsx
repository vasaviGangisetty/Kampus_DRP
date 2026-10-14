/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Globe,
  Share2,
  Smartphone,
  UserCheck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { BrandProfile, OfficialSocialAccount, OfficialAppAsset, OfficialExecutive, SocialPlatform } from '../types/drp';

interface BrandProfileViewProps {
  brand: BrandProfile;
  onUpdateBrand: (updated: BrandProfile) => void;
  onOpenRegisterModal?: () => void;
}

export const BrandProfileView: React.FC<BrandProfileViewProps> = ({
  brand,
  onUpdateBrand,
  onOpenRegisterModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'socials' | 'apps' | 'executives' | 'whitelist'>(
    'overview'
  );

  // New social account form state
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState<SocialPlatform>('x');
  const [newSocialHandle, setNewSocialHandle] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // New app form state
  const [showAddApp, setShowAddApp] = useState(false);
  const [newAppStore, setNewAppStore] = useState<'apple_app_store' | 'google_play'>('apple_app_store');
  const [newAppName, setNewAppName] = useState('');
  const [newAppBundleId, setNewAppBundleId] = useState('');
  const [newAppPublisher, setNewAppPublisher] = useState('');

  // New executive state
  const [showAddExec, setShowAddExec] = useState(false);
  const [newExecName, setNewExecName] = useState('');
  const [newExecRole, setNewExecRole] = useState('');
  const [newExecHandle, setNewExecHandle] = useState('');

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialHandle) return;

    const newSocial: OfficialSocialAccount = {
      id: `soc-${Date.now()}`,
      platform: newSocialPlatform,
      handle: newSocialHandle.replace(/^@/, ''),
      url: newSocialUrl || `https://${newSocialPlatform}.com/${newSocialHandle.replace(/^@/, '')}`,
      verified: true,
      followerCount: 1000,
    };

    onUpdateBrand({
      ...brand,
      officialSocials: [...brand.officialSocials, newSocial],
      whitelistedTokens: Array.from(new Set([...brand.whitelistedTokens, newSocialHandle.toLowerCase()])),
      lastUpdated: new Date().toISOString().split('T')[0],
    });

    setNewSocialHandle('');
    setNewSocialUrl('');
    setShowAddSocial(false);
  };

  const handleRemoveSocial = (id: string) => {
    onUpdateBrand({
      ...brand,
      officialSocials: brand.officialSocials.filter((s) => s.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName || !newAppBundleId) return;

    const newApp: OfficialAppAsset = {
      id: `app-${Date.now()}`,
      store: newAppStore,
      appName: newAppName,
      appId: `id${Math.floor(100000000 + Math.random() * 900000000)}`,
      bundleId: newAppBundleId,
      publisherName: newAppPublisher || brand.legalEntity,
      officialUrl: `https://apps.apple.com/app/${newAppBundleId}`,
      rating: 5.0,
    };

    onUpdateBrand({
      ...brand,
      officialApps: [...brand.officialApps, newApp],
      whitelistedTokens: Array.from(new Set([...brand.whitelistedTokens, newAppBundleId.toLowerCase()])),
      lastUpdated: new Date().toISOString().split('T')[0],
    });

    setNewAppName('');
    setNewAppBundleId('');
    setNewAppPublisher('');
    setShowAddApp(false);
  };

  const handleRemoveApp = (id: string) => {
    onUpdateBrand({
      ...brand,
      officialApps: brand.officialApps.filter((a) => a.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddExec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExecName || !newExecRole) return;

    const newExec: OfficialExecutive = {
      id: `exec-${Date.now()}`,
      name: newExecName,
      role: newExecRole,
      officialHandle: newExecHandle,
    };

    onUpdateBrand({
      ...brand,
      executives: [...brand.executives, newExec],
      lastUpdated: new Date().toISOString().split('T')[0],
    });

    setNewExecName('');
    setNewExecRole('');
    setNewExecHandle('');
    setShowAddExec(false);
  };

  const handleRemoveExec = (id: string) => {
    onUpdateBrand({
      ...brand,
      executives: brand.executives.filter((e) => e.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6">
      {/* Brand Header & Whitelist Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">{brand.name}</h1>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Protected Entity
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Legal: <span className="text-slate-300 font-medium">{brand.legalEntity}</span>
                <span className="mx-2 text-slate-600">·</span>
                Domain: <a href={`https://${brand.primaryDomain}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">{brand.primaryDomain}</a>
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                <span>Alternates: {brand.alternateNames.join(', ')}</span>
                <span>·</span>
                <span>Created: {brand.createdDate}</span>
                <span>·</span>
                <span className="text-slate-400">Last Synced: {brand.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Exclusion Guarantee Metric + Register New Company CTA */}
          <div className="flex flex-col gap-2 md:max-w-xs w-full">
            <div className="bg-slate-950/60 border border-emerald-500/30 rounded-lg p-3.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                Exclusion Engine Active
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                <strong className="text-white font-mono">{brand.officialSocials.length + brand.officialApps.length + brand.officialDomains.length}</strong> verified official assets are strictly whitelisted. Zero false-positive threat alerts will trigger on owned accounts.
              </p>
            </div>

            {onOpenRegisterModal && (
              <button
                onClick={onOpenRegisterModal}
                className="w-full py-2 px-3 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Register Another Company
              </button>
            )}
          </div>
        </div>

        {/* Sub Navigation Segmented Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-800/80 mt-6 pt-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Asset Overview', count: brand.officialSocials.length + brand.officialApps.length },
            { id: 'socials', label: 'Official Social Accounts', count: brand.officialSocials.length },
            { id: 'apps', label: 'Official Mobile Apps', count: brand.officialApps.length },
            { id: 'executives', label: 'Protected Executives', count: brand.executives.length },
            { id: 'whitelist', label: 'Exclusion & Tokens', count: brand.whitelistedTokens.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB: Overview */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Social Footprint */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Share2 className="w-4 h-4 text-emerald-400" />
                Verified Socials ({brand.officialSocials.length})
              </div>
              <button
                onClick={() => setActiveSubTab('socials')}
                className="text-xs text-emerald-400 hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="space-y-3 mt-4">
              {brand.officialSocials.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <span className="uppercase font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {s.platform}
                    </span>
                    <span className="text-white font-medium">@{s.handle}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {s.followerCount ? `${(s.followerCount / 1000).toFixed(1)}k` : 'Verified'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Mobile Apps */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                Official Apps ({brand.officialApps.length})
              </div>
              <button
                onClick={() => setActiveSubTab('apps')}
                className="text-xs text-emerald-400 hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="space-y-3 mt-4">
              {brand.officialApps.map((a) => (
                <div key={a.id} className="text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{a.appName}</span>
                    <span className="uppercase font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {a.store === 'apple_app_store' ? 'iOS' : 'Play Store'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 truncate">{a.bundleId}</p>
                  <p className="text-[11px] text-slate-500">Publisher: {a.publisherName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Protected Executives */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Protected Key Personnel ({brand.executives.length})
              </div>
              <button
                onClick={() => setActiveSubTab('executives')}
                className="text-xs text-emerald-400 hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="space-y-3 mt-4">
              {brand.executives.map((e) => (
                <div key={e.id} className="text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{e.name}</span>
                    {e.officialHandle && (
                      <span className="text-[11px] text-emerald-400 font-mono">@{e.officialHandle}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{e.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: Socials Management */}
      {activeSubTab === 'socials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Registered Legitimate Social Accounts</h2>
            <button
              onClick={() => setShowAddSocial(!showAddSocial)}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Official Account
            </button>
          </div>

          {showAddSocial && (
            <form onSubmit={handleAddSocial} className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Platform</label>
                <select
                  value={newSocialPlatform}
                  onChange={(e) => setNewSocialPlatform(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="x">X / Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="telegram">Telegram</option>
                  <option value="youtube">YouTube</option>
                  <option value="discord">Discord</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Handle / Username</label>
                <input
                  type="text"
                  placeholder="e.g. KampusVC"
                  value={newSocialHandle}
                  onChange={(e) => setNewSocialHandle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Profile URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-500 text-slate-950 rounded hover:bg-emerald-400 transition-colors"
                >
                  Save & Whitelist
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSocial(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Official Handle</th>
                  <th className="px-4 py-3">Verification</th>
                  <th className="px-4 py-3">Followers</th>
                  <th className="px-4 py-3">Exclusion Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {brand.officialSocials.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono uppercase text-slate-300">{s.platform}</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      <a href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-emerald-400">
                        @{s.handle}
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Rightsholder
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-slate-300">
                      {s.followerCount ? s.followerCount.toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Whitelisted (Never Flagged)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemoveSocial(s.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB: Apps Management */}
      {activeSubTab === 'apps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Registered Official Mobile Applications</h2>
            <button
              onClick={() => setShowAddApp(!showAddApp)}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Official App
            </button>
          </div>

          {showAddApp && (
            <form onSubmit={handleAddApp} className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Store</label>
                <select
                  value={newAppStore}
                  onChange={(e) => setNewAppStore(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="apple_app_store">Apple App Store (iOS)</option>
                  <option value="google_play">Google Play Store (Android)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">App Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kampus Founder Hub"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Bundle ID / Package Name</label>
                <input
                  type="text"
                  placeholder="e.g. vc.kampus.founderhub"
                  value={newAppBundleId}
                  onChange={(e) => setNewAppBundleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-500 text-slate-950 rounded hover:bg-emerald-400 transition-colors"
                >
                  Whitelist App
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddApp(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brand.officialApps.map((a) => (
              <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {a.store === 'apple_app_store' ? 'Apple App Store' : 'Google Play'}
                    </span>
                    <h3 className="text-base font-semibold text-white mt-2">{a.appName}</h3>
                    <p className="text-xs font-mono text-emerald-400">{a.bundleId}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveApp(a.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 space-y-1">
                  <p>Authorized Publisher: <strong className="text-slate-200">{a.publisherName}</strong></p>
                  <p>Store ID: <span className="font-mono text-slate-300">{a.appId}</span></p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Authorized Genuine Application (Excluded from Threat Scans)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: Protected Executives */}
      {activeSubTab === 'executives' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Protected Key Personnel & VIPs</h2>
              <p className="text-xs text-slate-400">Threat actors frequently create fake partner or founder profiles to solicit investment or intercept pitch decks.</p>
            </div>
            <button
              onClick={() => setShowAddExec(!showAddExec)}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Executive
            </button>
          </div>

          {showAddExec && (
            <form onSubmit={handleAddExec} className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={newExecName}
                  onChange={(e) => setNewExecName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Role / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Managing Partner"
                  value={newExecRole}
                  onChange={(e) => setNewExecRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Official Handle (X/LinkedIn)</label>
                <input
                  type="text"
                  placeholder="e.g. alexmercer_vc"
                  value={newExecHandle}
                  onChange={(e) => setNewExecHandle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-500 text-slate-950 rounded hover:bg-emerald-400 transition-colors"
                >
                  Protect VIP
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExec(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brand.executives.map((e) => (
              <div key={e.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                    {e.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{e.name}</h3>
                    <p className="text-xs text-slate-400">{e.role}</p>
                    {e.officialHandle && (
                      <p className="text-xs font-mono text-emerald-400 mt-0.5">Official: @{e.officialHandle}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveExec(e.id)}
                  className="text-slate-500 hover:text-rose-400 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: Exclusion Tokens */}
      {activeSubTab === 'whitelist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Lock className="w-4 h-4 text-emerald-400" />
            Active Whitelist Exclusion Tokens
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The detection engine evaluates incoming accounts against these tokens. If an exact match belongs to the verified profile, threat classification is immediately aborted with zero false-positives.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {brand.whitelistedTokens.map((token, idx) => (
              <span key={idx} className="font-mono text-xs bg-slate-950 border border-slate-800 px-3 py-1 rounded text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {token}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
