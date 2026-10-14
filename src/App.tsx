/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BrandProfileView } from './components/BrandProfileView';
import { SocialMonitoringView } from './components/SocialMonitoringView';
import { AppMonitoringView } from './components/AppMonitoringView';
import { LookalikeEngineView } from './components/LookalikeEngineView';
import { PitchInvestorView } from './components/PitchInvestorView';
import { ThreatDetailModal } from './components/ThreatDetailModal';
import { UserProfileModal } from './components/UserProfileModal';
import { RegisterCompanyModal } from './components/RegisterCompanyModal';
import { generateThreatsForCompany } from './utils/dynamicThreatGenerator';
import {
  INITIAL_BRAND_PROFILES,
  INITIAL_SOCIAL_THREATS,
  INITIAL_APP_THREATS,
  INITIAL_PORTFOLIO_COMPANIES,
  INITIAL_PITCH_SUBMISSIONS,
  INITIAL_USER_PROFILES,
} from './data/mockData';
import { BrandProfile, SocialThreat, AppThreat, UserProfile, PitchSubmission } from './types/drp';
import { CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('social_monitoring');

  // Brands
  const [brands, setBrands] = useState<BrandProfile[]>(() => {
    const saved = localStorage.getItem('kampus_drp_brands');
    return saved ? JSON.parse(saved) : INITIAL_BRAND_PROFILES;
  });
  const [activeBrand, setActiveBrand] = useState<BrandProfile>(brands[0]);

  // Threats
  const [socialThreats, setSocialThreats] = useState<SocialThreat[]>(() => {
    const saved = localStorage.getItem('kampus_drp_social_threats');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_THREATS;
  });
  const [appThreats, setAppThreats] = useState<AppThreat[]>(() => {
    const saved = localStorage.getItem('kampus_drp_app_threats');
    return saved ? JSON.parse(saved) : INITIAL_APP_THREATS;
  });

  // Pitch Submissions & Portfolio
  const [pitchSubmissions, setPitchSubmissions] = useState<PitchSubmission[]>(() => {
    const saved = localStorage.getItem('kampus_drp_pitches');
    return saved ? JSON.parse(saved) : INITIAL_PITCH_SUBMISSIONS;
  });
  const [portfolioCompanies] = useState(INITIAL_PORTFOLIO_COMPANIES);

  // Users & Roles
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USER_PROFILES);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_PROFILES[0]);

  // Active Modals
  const [selectedThreat, setSelectedThreat] = useState<SocialThreat | AppThreat | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanNotification, setScanNotification] = useState<string | null>(null);

  // Persist state updates
  useEffect(() => {
    localStorage.setItem('kampus_drp_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('kampus_drp_social_threats', JSON.stringify(socialThreats));
  }, [socialThreats]);

  useEffect(() => {
    localStorage.setItem('kampus_drp_app_threats', JSON.stringify(appThreats));
  }, [appThreats]);

  useEffect(() => {
    localStorage.setItem('kampus_drp_pitches', JSON.stringify(pitchSubmissions));
  }, [pitchSubmissions]);

  // Brand registration handler for ANY company
  const handleRegisterCompany = (newBrand: BrandProfile) => {
    // Dynamically generate real-world threats tailored to the registered company
    const { socialThreats: newSocialThreats, appThreats: newAppThreats } = generateThreatsForCompany(newBrand);

    setBrands((prev) => [newBrand, ...prev]);
    setSocialThreats((prev) => [...newSocialThreats, ...prev]);
    setAppThreats((prev) => [...newAppThreats, ...prev]);
    setActiveBrand(newBrand);
    setActiveTab('social_monitoring');
    setScanNotification(
      `"${newBrand.name}" registered successfully! Threat scan complete: ${newSocialThreats.length} social threats & ${newAppThreats.length} rogue mobile apps flagged. Official assets whitelisted.`
    );
    setTimeout(() => setScanNotification(null), 7000);
  };

  // Brand update handler
  const handleUpdateBrand = (updated: BrandProfile) => {
    setBrands((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setActiveBrand(updated);
  };

  // Threat status handler
  const handleUpdateThreatStatus = (threatId: string, newStatus: any) => {
    setSocialThreats((prev) =>
      prev.map((t) => (t.id === threatId ? { ...t, status: newStatus } : t))
    );
    setAppThreats((prev) =>
      prev.map((t) => (t.id === threatId ? { ...t, status: newStatus } : t))
    );
  };

  // Takedown dispatch
  const handleDispatchTakedown = (threatId: string, letter: string) => {
    setSocialThreats((prev) =>
      prev.map((t) =>
        t.id === threatId ? { ...t, status: 'takedown_requested', takedownNotice: letter } : t
      )
    );
    setAppThreats((prev) =>
      prev.map((t) =>
        t.id === threatId ? { ...t, status: 'takedown_requested', takedownNotice: letter } : t
      )
    );
    setScanNotification(`Formal takedown notice dispatched for reference asset ID: ${threatId}`);
    setTimeout(() => setScanNotification(null), 4000);
  };

  // Real-time scan simulation across public graph feeds
  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Ensure current brand has active threats
      const existingSocial = socialThreats.filter((t) => t.brandId === activeBrand.id);
      if (existingSocial.length === 0) {
        const { socialThreats: freshSocial, appThreats: freshApp } = generateThreatsForCompany(activeBrand);
        setSocialThreats((prev) => [...freshSocial, ...prev]);
        setAppThreats((prev) => [...freshApp, ...prev]);
      }

      setIsScanning(false);
      setScanNotification(
        `Feeds Scanned: Checked 1,840 social accounts and 24 mobile app stores for "${activeBrand.name}". 0 owned assets flagged (Whitelisted), threats synchronized.`
      );
      setTimeout(() => setScanNotification(null), 6000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        activeBrand={activeBrand}
        brands={brands}
        onSelectBrand={(b) => setActiveBrand(b)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onTriggerScan={handleTriggerScan}
        isScanning={isScanning}
      />

      {/* Real-time Notification Banner */}
      {scanNotification && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-300 px-4 py-2.5 text-xs flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{scanNotification}</span>
            </span>
            <button
              onClick={() => setScanNotification(null)}
              className="text-slate-400 hover:text-white ml-4"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'social_monitoring' && (
          <SocialMonitoringView
            threats={socialThreats}
            brand={activeBrand}
            onSelectThreat={(t) => setSelectedThreat(t)}
            onUpdateThreatStatus={handleUpdateThreatStatus}
            onOpenTakedown={(t) => setSelectedThreat(t)}
          />
        )}

        {activeTab === 'app_monitoring' && (
          <AppMonitoringView
            threats={appThreats}
            brand={activeBrand}
            onSelectThreat={(t) => setSelectedThreat(t)}
            onUpdateThreatStatus={handleUpdateThreatStatus}
            onOpenTakedown={(t) => setSelectedThreat(t)}
          />
        )}

        {activeTab === 'brand_profile' && (
          <BrandProfileView
            brand={activeBrand}
            onUpdateBrand={handleUpdateBrand}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          />
        )}

        {activeTab === 'lookalike_engine' && (
          <LookalikeEngineView brand={activeBrand} />
        )}

        {activeTab === 'pitch_investor' && (
          <PitchInvestorView
            submissions={pitchSubmissions}
            portfolio={portfolioCompanies}
            onAddSubmission={(newSub) => setPitchSubmissions((prev) => [newSub, ...prev])}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Register Any Company Modal */}
      {isRegisterModalOpen && (
        <RegisterCompanyModal
          onClose={() => setIsRegisterModalOpen(false)}
          onRegisterCompany={handleRegisterCompany}
        />
      )}

      {/* Threat Dossier & Takedown Modal */}
      {selectedThreat && (
        <ThreatDetailModal
          threat={selectedThreat}
          brand={activeBrand}
          currentUser={currentUser}
          onClose={() => setSelectedThreat(null)}
          onDispatchTakedown={handleDispatchTakedown}
        />
      )}

      {/* User Persona & Settings Modal */}
      {isUserModalOpen && (
        <UserProfileModal
          currentUser={currentUser}
          availableUsers={users}
          onSelectUser={(u) => {
            setCurrentUser(u);
            setIsUserModalOpen(false);
          }}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
          }}
          onClose={() => setIsUserModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#070A0F] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Kampus.VC Applied AI Venture Studio</span>
            <span>·</span>
            <span>Digital Risk Protection (Social & App Monitoring)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('brand_profile')} className="hover:text-slate-200">
              Whitelist Engine
            </button>
            <button onClick={() => setActiveTab('pitch_investor')} className="hover:text-slate-200">
              Pitch & Portfolio
            </button>
            <span>·</span>
            <span className="font-mono text-emerald-500/80">Vercel & GitHub CI/CD Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
