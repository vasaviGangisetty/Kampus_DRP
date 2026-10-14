/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Send,
  Eye,
  ShieldAlert,
  Flame,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { SocialThreat, BrandProfile, SocialPlatform, ThreatSeverity } from '../types/drp';

interface SocialMonitoringViewProps {
  threats: SocialThreat[];
  brand: BrandProfile;
  onSelectThreat: (threat: SocialThreat) => void;
  onUpdateThreatStatus: (threatId: string, newStatus: any) => void;
  onOpenTakedown: (threat: SocialThreat) => void;
}

export const SocialMonitoringView: React.FC<SocialMonitoringViewProps> = ({
  threats,
  brand,
  onSelectThreat,
  onUpdateThreatStatus,
  onOpenTakedown,
}) => {
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered threats
  const filteredThreats = threats.filter((threat) => {
    if (threat.brandId !== brand.id) return false;
    if (platformFilter !== 'all' && threat.platform !== platformFilter) return false;
    if (severityFilter !== 'all' && threat.severity !== severityFilter) return false;
    if (
      searchQuery &&
      !threat.accountName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !threat.handle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !threat.bio.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Calculate metrics
  const criticalCount = threats.filter((t) => t.brandId === brand.id && t.severity === 'critical').length;
  const activeAlerts = threats.filter((t) => t.brandId === brand.id && t.status === 'active_alert').length;
  const takedownsDispatched = threats.filter((t) => t.brandId === brand.id && t.status === 'takedown_requested').length;

  return (
    <div className="space-y-6">
      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Active Threat Alerts</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">{activeAlerts}</span>
            <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
              Needs Action
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Critical Look-alikes & Scams</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-400">{criticalCount}</span>
            <span className="text-[11px] text-slate-400">Score &gt; 90</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Takedowns Dispatched</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-400">{takedownsDispatched}</span>
            <span className="text-[11px] text-slate-400">In Progress</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Whitelisted Official Assets</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {brand.officialSocials.length}
            </span>
            <span className="text-[11px] text-emerald-400/80 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 0 False-Positives
            </span>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Search & Segmented Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search threats by handle, name, bio keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Platform Segmented Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80 text-xs">
            {['all', 'x', 'linkedin', 'telegram', 'instagram'].map((plat) => (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors uppercase font-mono ${
                  platformFilter === plat
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {plat === 'all' ? 'All Channels' : plat}
              </button>
            ))}
          </div>

          {/* Severity Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical (&gt;90)</option>
            <option value="high">High (75-90)</option>
            <option value="medium">Medium (50-74)</option>
          </select>
        </div>
      </div>

      {/* Threats Feed List */}
      <div className="space-y-4">
        {filteredThreats.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No Threat Alerts Matching Filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              All active social media profiles within this filter set have been investigated, whitelisted, or neutralized.
            </p>
          </div>
        ) : (
          filteredThreats.map((threat) => {
            const isCritical = threat.severity === 'critical';
            const officialSocial = brand.officialSocials.find((s) => s.platform === threat.platform);

            return (
              <div
                key={threat.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all space-y-4"
              >
                {/* Header row: Platform, Handle, Risk Score, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="uppercase font-mono text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {threat.platform}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white tracking-tight">{threat.accountName}</h3>
                        <span className="text-xs font-mono text-emerald-400 hover:underline">
                          @{threat.handle}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Discovered: {new Date(threat.discoveredAt).toLocaleDateString()} · Registered: {threat.creationDate}
                      </p>
                    </div>
                  </div>

                  {/* Score & Status badges */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Flame className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`} />
                        <span className={`text-sm font-bold font-mono tabular-nums ${isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
                          {threat.riskScore}/100
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">{threat.severity} Risk</span>
                    </div>

                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                        threat.status === 'active_alert'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : threat.status === 'takedown_requested'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : threat.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {threat.status === 'active_alert'
                        ? 'Active Alert'
                        : threat.status === 'takedown_requested'
                        ? 'Takedown In Flight'
                        : threat.status === 'resolved'
                        ? 'Resolved'
                        : 'Under Review'}
                    </span>
                  </div>
                </div>

                {/* Threat Type Banner & Look-alike technique */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Threat Classification:</span>
                  <span className="bg-slate-950 text-slate-200 border border-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">
                    {threat.threatType.replace(/_/g, ' ').toUpperCase()}
                  </span>

                  {threat.detectionSignals.lookalikeType && (
                    <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-rose-400" />
                      Lookalike: {threat.detectionSignals.lookalikeType.replace(/_/g, ' ')}
                    </span>
                  )}

                  {threat.detectionSignals.executiveTargeted && (
                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                      Targeting Executive: {threat.detectionSignals.executiveTargeted}
                    </span>
                  )}
                </div>

                {/* Impersonator Bio & Red Flags */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs space-y-2">
                  <p className="text-slate-300 italic">"{threat.bio}"</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/50">
                    <span className="text-slate-500 text-[11px]">Flagged Lure Keywords:</span>
                    {threat.detectionSignals.bioKeywordsMatched.map((kw, i) => (
                      <span key={i} className="text-[10px] bg-rose-500/10 text-rose-300 px-1.5 py-0.5 rounded font-mono">
                        {kw}
                      </span>
                    ))}
                    <span className="text-slate-500 text-[11px] ml-auto font-mono tabular-nums">
                      Followers: {threat.followerCount} · Name Sim: {threat.detectionSignals.nameSimilarityPct}% · Logo Match: {threat.detectionSignals.logoSimilarityPct}%
                    </span>
                  </div>
                </div>

                {/* Live Comparison with Official Asset */}
                {officialSocial && (
                  <div className="bg-slate-950/40 border border-slate-800/50 rounded-lg p-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Legitimate Official Asset:
                        </span>
                        <span className="text-white font-mono">@{officialSocial.handle}</span>
                        <span className="text-slate-500">({officialSocial.followerCount.toLocaleString()} followers)</span>
                      </div>
                      <div className="text-rose-400 font-mono">
                        vs Impersonator: @{threat.handle} (Distance: {threat.detectionSignals.handleDistance})
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Rationale Preview */}
                {threat.aiAnalysis && (
                  <div className="flex items-start gap-2 text-xs bg-emerald-950/10 border border-emerald-500/20 rounded-lg p-2.5 text-slate-300">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300 font-semibold">Gemini Threat Forensic: </strong>
                      {threat.aiAnalysis.summary}
                    </div>
                  </div>
                )}

                {/* Formal Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => onSelectThreat(threat)}
                    className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-300" />
                    <span>Investigate & Take Down</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {threat.status !== 'resolved' ? (
                      <button
                        onClick={() => onUpdateThreatStatus(threat.id, 'resolved')}
                        className="text-xs text-slate-400 hover:text-emerald-400 px-2 py-1 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateThreatStatus(threat.id, 'active_alert')}
                        className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 transition-colors"
                      >
                        Reopen Alert
                      </button>
                    )}

                    <button
                      onClick={() => onUpdateThreatStatus(threat.id, 'whitelisted')}
                      className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 transition-colors"
                      title="Whitelist if confirmed partner"
                    >
                      Whitelist / False Positive
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
