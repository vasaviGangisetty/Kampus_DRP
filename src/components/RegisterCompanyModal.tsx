/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Building2,
  Globe,
  Share2,
  Smartphone,
  UserCheck,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { BrandProfile } from '../types/drp';

interface RegisterCompanyModalProps {
  onClose: () => void;
  onRegisterCompany: (newBrand: BrandProfile) => void;
}

export const RegisterCompanyModal: React.FC<RegisterCompanyModalProps> = ({
  onClose,
  onRegisterCompany,
}) => {
  const [name, setName] = useState('');
  const [legalEntity, setLegalEntity] = useState('');
  const [primaryDomain, setPrimaryDomain] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [officialXHandle, setOfficialXHandle] = useState('');
  const [officialLinkedIn, setOfficialLinkedIn] = useState('');
  const [officialTelegram, setOfficialTelegram] = useState('');
  const [officialAppName, setOfficialAppName] = useState('');
  const [officialAppBundle, setOfficialAppBundle] = useState('');
  const [executiveName, setExecutiveName] = useState('');
  const [executiveRole, setExecutiveRole] = useState('Founder & CEO');
  const [isRegistering, setIsRegistering] = useState(false);

  // Quick Preset Handlers
  const handleApplyPreset = (preset: {
    name: string;
    legal: string;
    domain: string;
    logo: string;
    x: string;
    linkedin: string;
    appName: string;
    appBundle: string;
    exec: string;
  }) => {
    setName(preset.name);
    setLegalEntity(preset.legal);
    setPrimaryDomain(preset.domain);
    setLogoUrl(preset.logo);
    setOfficialXHandle(preset.x);
    setOfficialLinkedIn(preset.linkedin);
    setOfficialAppName(preset.appName);
    setOfficialAppBundle(preset.appBundle);
    setExecutiveName(preset.exec);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !primaryDomain) return;

    setIsRegistering(true);

    const brandId = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + `-${Date.now().toString(36)}`;
    const legalName = legalEntity || `${name} Technologies Inc.`;
    const cleanXHandle = (officialXHandle || name).replace(/^@/, '');
    const cleanBundle = officialAppBundle || `com.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.app`;

    const newBrand: BrandProfile = {
      id: brandId,
      name,
      legalEntity: legalName,
      alternateNames: [name, name.replace(/\s+/g, ''), `${name} Official`],
      primaryDomain: primaryDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
      officialDomains: [primaryDomain.replace(/^https?:\/\//, ''), `app.${primaryDomain}`, `api.${primaryDomain}`],
      logoUrl:
        logoUrl ||
        `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80`,
      officialSocials: [
        {
          id: `soc-${Date.now()}-1`,
          platform: 'x',
          handle: cleanXHandle,
          url: `https://x.com/${cleanXHandle}`,
          verified: true,
          followerCount: 28500,
        },
        {
          id: `soc-${Date.now()}-2`,
          platform: 'linkedin',
          handle: officialLinkedIn || cleanXHandle.toLowerCase(),
          url: `https://linkedin.com/company/${officialLinkedIn || cleanXHandle.toLowerCase()}`,
          verified: true,
          followerCount: 15400,
        },
        ...(officialTelegram
          ? [
              {
                id: `soc-${Date.now()}-3`,
                platform: 'telegram' as const,
                handle: officialTelegram.replace(/^@/, ''),
                url: `https://t.me/${officialTelegram.replace(/^@/, '')}`,
                verified: false,
                followerCount: 6200,
              },
            ]
          : []),
      ],
      officialApps: [
        {
          id: `app-${Date.now()}-1`,
          store: 'apple_app_store',
          appName: officialAppName || `${name} Mobile`,
          appId: `id${Math.floor(100000000 + Math.random() * 900000000)}`,
          bundleId: cleanBundle,
          publisherName: legalName,
          officialUrl: `https://apps.apple.com/app/${cleanBundle}`,
          rating: 4.8,
        },
        {
          id: `app-${Date.now()}-2`,
          store: 'google_play',
          appName: officialAppName || `${name} Mobile`,
          appId: cleanBundle,
          bundleId: cleanBundle,
          publisherName: legalName,
          officialUrl: `https://play.google.com/store/apps/details?id=${cleanBundle}`,
          rating: 4.7,
        },
      ],
      executives: [
        {
          id: `exec-${Date.now()}-1`,
          name: executiveName || 'Alex Mercer',
          role: executiveRole,
          officialHandle: `${(executiveName || 'alex').toLowerCase().replace(/\s+/g, '_')}`,
          emailPrefix: `founder@${primaryDomain}`,
        },
      ],
      keywords: [name.toLowerCase(), 'official', 'portal', 'account', 'security'],
      whitelistedTokens: [
        name.toLowerCase(),
        name.toLowerCase().replace(/[\s.-]/g, ''),
        cleanXHandle.toLowerCase(),
        cleanBundle.toLowerCase(),
      ],
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      onRegisterCompany(newBrand);
      setIsRegistering(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Register Any Company / Brand Profile</h2>
              <p className="text-xs text-slate-400">
                Onboard any organization to immediately launch automated Social Media & App Store threat detection.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick 1-Click Presets */}
        <div className="p-6 pb-2 border-b border-slate-800/60 bg-slate-950/40">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono mb-2">
            Quick 1-Click Test Presets (or type your own company below):
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: 'FinTech: "FinVault Capital"',
                name: 'FinVault Capital',
                legal: 'FinVault Global Financial Corp.',
                domain: 'finvault.io',
                logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
                x: 'FinVaultCapital',
                linkedin: 'finvault-capital',
                appName: 'FinVault Mobile Banking',
                appBundle: 'com.finvault.banking',
                exec: 'Daniel Vance',
              },
              {
                label: 'AI Studio: "AegisBio AI"',
                name: 'AegisBio AI',
                legal: 'AegisBio Therapeutics Inc.',
                domain: 'aegisbio.ai',
                logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80',
                x: 'AegisBioAI',
                linkedin: 'aegisbio-ai',
                appName: 'AegisBio Diagnostics',
                appBundle: 'ai.aegisbio.diagnostics',
                exec: 'Dr. Evelyn Reed',
              },
              {
                label: 'SaaS: "CloudMatrix Systems"',
                name: 'CloudMatrix Systems',
                legal: 'CloudMatrix Technologies LLC',
                domain: 'cloudmatrix.dev',
                logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&auto=format&fit=crop&q=80',
                x: 'CloudMatrixDev',
                linkedin: 'cloudmatrix-systems',
                appName: 'CloudMatrix Console',
                appBundle: 'io.cloudmatrix.console',
                exec: 'Jordan Hayes',
              },
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          {/* Section 1: Basic Brand Identity */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> 1. Brand Identity & Domain
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brand / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp, Figma, Stripe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Domain *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. acme.com or fintech.io"
                  value={primaryDomain}
                  onChange={(e) => setPrimaryDomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Registered Legal Entity Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corporation Inc."
                  value={legalEntity}
                  onChange={(e) => setLegalEntity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Official Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Official Social Accounts (To Whitelist) */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> 2. Official Social Handles (Strictly Whitelisted)
            </h3>
            <p className="text-[11px] text-slate-400">
              Accounts entered here are strictly whitelisted and will never trigger threat alerts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Official X (Twitter)</label>
                <input
                  type="text"
                  placeholder="@OfficialHandle"
                  value={officialXHandle}
                  onChange={(e) => setOfficialXHandle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Official LinkedIn Company</label>
                <input
                  type="text"
                  placeholder="company-handle"
                  value={officialLinkedIn}
                  onChange={(e) => setOfficialLinkedIn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Official Telegram (Optional)</label>
                <input
                  type="text"
                  placeholder="channel_handle"
                  value={officialTelegram}
                  onChange={(e) => setOfficialTelegram(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Official Mobile Application */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> 3. Official Mobile Application (iOS & Google Play)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Official Mobile App Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Mobile Hub"
                  value={officialAppName}
                  onChange={(e) => setOfficialAppName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Official Bundle ID / Package Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. com.acme.app"
                  value={officialAppBundle}
                  onChange={(e) => setOfficialAppBundle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Key Personnel & Executive Protection */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> 4. Protected Key Executive / Founder
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Lead Founder / CEO Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={executiveName}
                  onChange={(e) => setExecutiveName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Co-Founder & CEO"
                  value={executiveRole}
                  onChange={(e) => setExecutiveRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300">Automated Threat Scan Trigger: </strong>
              Upon registration, the DRP engine will immediately scan social graphs and app store catalogs for typosquatting, lookalike profiles, publisher mismatches, and scam lures targeting this brand.
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isRegistering || !name}
              className="px-5 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRegistering ? 'Registering & Scanning Feeds...' : 'Register Company & Scan Threats'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
