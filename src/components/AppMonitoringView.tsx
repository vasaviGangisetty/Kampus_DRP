/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Smartphone,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Send,
  Eye,
  CheckCircle2,
  Lock,
  ExternalLink,
  Flame,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { AppThreat, BrandProfile, AppStorePlatform } from '../types/drp';

interface AppMonitoringViewProps {
  threats: AppThreat[];
  brand: BrandProfile;
  onSelectThreat: (threat: AppThreat) => void;
  onUpdateThreatStatus: (threatId: string, newStatus: any) => void;
  onOpenTakedown: (threat: AppThreat) => void;
}

export const AppMonitoringView: React.FC<AppMonitoringViewProps> = ({
  threats,
  brand,
  onSelectThreat,
  onUpdateThreatStatus,
  onOpenTakedown,
}) => {
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const brandAppThreats = threats.filter((t) => t.brandId === brand.id);

  const filteredThreats = brandAppThreats.filter((t) => {
    if (storeFilter !== 'all' && t.store !== storeFilter) return false;
    if (
      searchQuery &&
      !t.appName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.bundleId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.publisherName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const criticalCount = brandAppThreats.filter((t) => t.severity === 'critical').length;
  const publisherMismatches = brandAppThreats.filter((t) => t.detectionSignals.publisherMismatch).length;

  return (
    <div className="space-y-6">
      {/* Official App Assets Banner (Demonstrating Zero-Flagged Legit Apps) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Authorized Legitimate Applications ({brand.officialApps.length})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Official registered publisher: <strong className="text-emerald-400">{brand.legalEntity}</strong>. These applications are strictly whitelisted and will never trigger false-positive threat alerts.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full whitespace-nowrap self-start md:self-auto">
            100% Whitelist Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {brand.officialApps.map((app) => (
            <div key={app.id} className="bg-slate-950/60 border border-emerald-500/20 rounded-lg p-3.5 flex items-start justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{app.appName}</span>
                  <span className="text-[10px] uppercase font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                    {app.store === 'apple_app_store' ? 'Apple iOS' : 'Google Play'}
                  </span>
                </div>
                <p className="font-mono text-slate-400 text-[11px] mt-1">{app.bundleId}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Publisher: {app.publisherName}</p>
              </div>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Excluded
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Flagged Mobile Apps</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-400">{brandAppThreats.length}</span>
            <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
              High Severity
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Publisher Mismatches</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-400">{publisherMismatches}</span>
            <span className="text-[11px] text-slate-400">Rogue Devs</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Intrusive Permissions Flagged</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-400">7</span>
            <span className="text-[11px] text-slate-400">SMS / Overlay</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Monitored App Stores</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">3</span>
            <span className="text-[11px] text-slate-400">Apple · Play · APK</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Filter by app name, rogue publisher, bundle ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 max-w-md w-full focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80 text-xs">
          {[
            { id: 'all', label: 'All Stores' },
            { id: 'google_play', label: 'Google Play' },
            { id: 'apple_app_store', label: 'Apple App Store' },
            { id: 'third_party_apk', label: 'Rogue APK Repos' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStoreFilter(st.id)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                storeFilter === st.id
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* App Threats List */}
      <div className="space-y-4">
        {filteredThreats.map((threat) => {
          const isCritical = threat.severity === 'critical';

          return (
            <div
              key={threat.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={threat.iconUrl}
                      alt={threat.appName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="uppercase font-mono text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {threat.store === 'apple_app_store'
                          ? 'Apple App Store'
                          : threat.store === 'google_play'
                          ? 'Google Play Store'
                          : 'Rogue APK Mirror'}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">{threat.appName}</h3>
                    </div>
                    <p className="text-xs font-mono text-rose-400 mt-1">
                      Bundle ID: {threat.bundleId}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Publisher:{' '}
                      <strong className="text-rose-300 font-semibold">{threat.publisherName}</strong>{' '}
                      <span className="text-rose-400 text-[10px] bg-rose-500/10 px-1 rounded ml-1 font-mono">
                        [UNAUTHORIZED DEV]
                      </span>
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Flame className="w-4 h-4 text-rose-400" />
                      <span className="text-base font-bold font-mono text-rose-400 tabular-nums">
                        {threat.riskScore}/100
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono text-slate-400">Risk Score</span>
                  </div>

                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                      threat.status === 'active_alert'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : threat.status === 'takedown_requested'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {threat.status === 'active_alert'
                      ? 'Active Threat'
                      : threat.status === 'takedown_requested'
                      ? 'Store Abuse Claim Filed'
                      : 'Removed'}
                  </span>
                </div>
              </div>

              {/* Signals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <p className="text-[10px] text-slate-500">Name Resemblance</p>
                  <p className="font-mono text-sm font-bold text-white mt-0.5">
                    {threat.detectionSignals.nameSimilarityPct}%
                  </p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <p className="text-[10px] text-slate-500">Logo Imitation</p>
                  <p className="font-mono text-sm font-bold text-rose-400 mt-0.5">
                    {threat.detectionSignals.logoSimilarityPct}% (pHash match)
                  </p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <p className="text-[10px] text-slate-500">Downloads Stated</p>
                  <p className="font-mono text-sm font-bold text-white mt-0.5">{threat.downloadCount}</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <p className="text-[10px] text-slate-500">Publisher Entity</p>
                  <p className="font-semibold text-rose-400 text-xs mt-0.5 truncate">Mismatch</p>
                </div>
              </div>

              {/* Suspicious Permissions Alert */}
              {threat.detectionSignals.suspiciousPermissions.length > 0 && (
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-[11px] uppercase tracking-wider">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    High-Risk Intrusive Permissions Requested (Credential / OTP Harvester)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {threat.detectionSignals.suspiciousPermissions.map((perm, idx) => (
                      <span key={idx} className="font-mono text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description preview */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">App Store Listing Description Copy:</span>
                <p className="italic">"{threat.description}"</p>
              </div>

              {/* Gemini Reasoning */}
              {threat.aiAnalysis && (
                <div className="flex items-start gap-2 text-xs bg-emerald-950/10 border border-emerald-500/20 rounded-lg p-2.5 text-slate-300">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-300 font-semibold">Gemini Security Intelligence: </strong>
                    {threat.aiAnalysis.summary}
                  </div>
                </div>
              )}

              {/* Formal Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onSelectThreat(threat)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                  <span>Investigate & Take Down</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateThreatStatus(threat.id, 'resolved')}
                    className="text-xs text-slate-400 hover:text-emerald-400 px-2 py-1 transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
