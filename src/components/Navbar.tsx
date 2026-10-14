/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Bell, User, Sparkles, RefreshCw } from 'lucide-react';
import { UserProfile, BrandProfile } from '../types/drp';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  activeBrand: BrandProfile;
  brands: BrandProfile[];
  onSelectBrand: (brand: BrandProfile) => void;
  onOpenUserModal: () => void;
  onOpenRegisterModal: () => void;
  onTriggerScan: () => void;
  isScanning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  activeBrand,
  brands,
  onSelectBrand,
  onOpenUserModal,
  onOpenRegisterModal,
  onTriggerScan,
  isScanning,
}) => {
  const navItems = [
    { id: 'social_monitoring', label: 'Social Monitoring' },
    { id: 'app_monitoring', label: 'App Store Monitor' },
    { id: 'brand_profile', label: 'Brand Profile' },
    { id: 'lookalike_engine', label: 'Look-alike Engine' },
    { id: 'pitch_investor', label: 'Pitch & Investors' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark with subtle security mark + brand switcher + Register CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('social_monitoring')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                Kampus <span className="text-emerald-400 font-semibold">DRP</span>
              </span>
            </button>

            {/* Brand switcher dropdown & Register Company Button */}
            <div className="hidden sm:flex items-center ml-2 border-l border-slate-800 pl-3 gap-2">
              <label htmlFor="brand-select" className="sr-only">Select Monitored Brand</label>
              <select
                id="brand-select"
                value={activeBrand.id}
                onChange={(e) => {
                  const found = brands.find((b) => b.id === e.target.value);
                  if (found) onSelectBrand(found);
                }}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <button
                onClick={onOpenRegisterModal}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded transition-colors whitespace-nowrap"
                title="Register any new company to find threats"
              >
                + Register Brand
              </button>
            </div>
          </div>

          {/* Zone 2: 5–7 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  activeTab === item.id
                    ? 'text-emerald-400 font-semibold'
                    : 'hover:text-slate-200'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action button + user profile affordance */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onTriggerScan}
              disabled={isScanning}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${
                isScanning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-sm'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Feeds...' : 'Scan Now'}</span>
            </button>

            <button
              onClick={onOpenUserModal}
              title={`Switch role (${currentUser.title})`}
              className="flex items-center gap-2 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-300 transition-colors whitespace-nowrap shrink-0"
            >
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <User className="w-3 h-3" />
              </div>
              <span className="hidden md:inline font-mono text-[11px] text-slate-400">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded">
                {currentUser.role === 'secops_analyst'
                  ? 'SecOps'
                  : currentUser.role === 'threat_hunter'
                  ? 'Hunter'
                  : currentUser.role === 'brand_counsel'
                  ? 'Legal'
                  : 'Investor'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar for smaller screens */}
      <div className="lg:hidden border-t border-slate-800 px-4 py-2 overflow-x-auto flex items-center gap-3 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              activeTab === item.id
                ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
