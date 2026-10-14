/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  FileCheck,
  Send,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { PitchSubmission, PortfolioCompany, UserProfile } from '../types/drp';
import { calculateSimilarity, calculateLevenshtein } from '../utils/lookalike';

interface PitchInvestorViewProps {
  submissions: PitchSubmission[];
  portfolio: PortfolioCompany[];
  onAddSubmission: (sub: PitchSubmission) => void;
  currentUser: UserProfile;
}

export const PitchInvestorView: React.FC<PitchInvestorViewProps> = ({
  submissions,
  portfolio,
  onAddSubmission,
  currentUser,
}) => {
  const [subTab, setSubTab] = useState<'pitch_portal' | 'investor_dashboard'>('pitch_portal');

  // Pitch submission form
  const [startupName, setStartupName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [founderEmail, setFounderEmail] = useState('');
  const [universityOrLab, setUniversityOrLab] = useState('MIT CSAIL');
  const [thesis, setThesis] = useState('');
  const [stage, setStage] = useState<'Idea / Lab' | 'Pre-Seed' | 'Seed'>('Pre-Seed');
  const [domain, setDomain] = useState('');
  const [socials, setSocials] = useState('');
  const [appName, setAppName] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditSuccessBanner, setAuditSuccessBanner] = useState<PitchSubmission | null>(null);

  const handleSubmitPitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupName || !founderName || !founderEmail || !thesis) return;

    setIsAuditing(true);

    // Simulate real-time DRP brand audit computation
    setTimeout(() => {
      // Calculate security audit score based on domain completeness & name squatting resilience
      const cleanName = startupName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const squattingRisk = cleanName.length < 5 ? 2 : 0;
      const baseScore = Math.floor(82 + Math.random() * 15) - squattingRisk * 5;
      const exposureRisk = baseScore > 88 ? 'low' : baseScore > 75 ? 'moderate' : 'high';

      const newSubmission: PitchSubmission = {
        id: `pitch-${Date.now()}`,
        startupName,
        founderName,
        founderEmail,
        universityOrLab,
        thesis,
        stage,
        targetAudience: 'University AI Commercialization',
        brandAssets: {
          domain: domain || `${cleanName}.ai`,
          socialHandles: socials || `@${cleanName}`,
          appName: appName || undefined,
        },
        securityAuditScore: baseScore,
        exposureRisk,
        impersonationCount: squattingRisk,
        submittedAt: new Date().toISOString(),
        status: 'Under Review',
        notes: 'Submitted via Kampus.VC Founder Portal. Automated DRP security health audit generated.',
      };

      onAddSubmission(newSubmission);
      setAuditSuccessBanner(newSubmission);
      setIsAuditing(false);

      // Reset form
      setStartupName('');
      setFounderName('');
      setFounderEmail('');
      setThesis('');
      setDomain('');
      setSocials('');
      setAppName('');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Venture Studio Portal & Diligence Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kampus.VC Applied AI Venture Studio founder intake and investor portfolio risk monitoring.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setSubTab('pitch_portal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              subTab === 'pitch_portal'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Founder Pitch Submission
          </button>
          <button
            onClick={() => setSubTab('investor_dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              subTab === 'investor_dashboard'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Investor Portfolio Risk
          </button>
        </div>
      </div>

      {/* VIEW 1: Pitch Submission Portal */}
      {subTab === 'pitch_portal' && (
        <div className="space-y-6">
          {/* Success Banner if submitted */}
          {auditSuccessBanner && (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Pitch Received: {auditSuccessBanner.startupName} & Automated DRP Audit Complete!
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Assigned Brand Safety Score:{' '}
                    <strong className="text-emerald-400 font-mono">
                      {auditSuccessBanner.securityAuditScore}/100
                    </strong>{' '}
                    ({auditSuccessBanner.exposureRisk.toUpperCase()} EXPOSURE RISK). Registered into Kampus.VC Diligence Queue.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAuditSuccessBanner(null)}
                className="text-xs text-slate-400 hover:text-white self-start md:self-auto"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Submission Form + Value Proposition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-white">
                  Submit University AI Startup Thesis & Request DRP Audit
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Are you an ambitious university founder, PhD, or researcher? Pitch your thesis to Kampus.VC. All submissions automatically undergo an instant <strong>Digital Risk & Brand Safety Diligence Scan</strong> to protect your IP.
              </p>

              <form onSubmit={handleSubmitPitch} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Startup / Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SynapseAgent AI"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      University, Lab, or Institute *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stanford AI Lab, MIT CSAIL, Oxford"
                      value={universityOrLab}
                      onChange={(e) => setUniversityOrLab(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Lead Founder Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Founder Email (.edu preferred) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="founder@university.edu"
                      value={founderEmail}
                      onChange={(e) => setFounderEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Funding Stage
                    </label>
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Idea / Lab">Idea / University Lab Research</option>
                      <option value="Pre-Seed">Pre-Seed (Ready to Co-Build)</option>
                      <option value="Seed">Seed (Prototype Built)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Company Thesis & Applied AI Technical Innovation *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your foundational AI model, scientific breakthrough, or unfair technical advantage..."
                    value={thesis}
                    onChange={(e) => setThesis(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Brand Identifiers for DRP Audit */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 space-y-2">
                  <p className="text-[11px] font-semibold text-slate-300">
                    Brand Assets for Pre-emptive Impersonation & Squatting Audit:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Intended Domain (e.g. agent.ai)"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Intended Handle (e.g. @agent_ai)"
                      value={socials}
                      onChange={(e) => setSocials(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Mobile App Name (Optional)"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAuditing}
                    className="px-5 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAuditing ? 'Executing DRP Security Audit...' : 'Submit Pitch & Request Studio Co-Build'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Studio Info Card */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  About Kampus.VC Studio
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kampus.VC is an Applied AI Venture Studio that identifies promising opportunities, develops company theses, and co-builds those companies with ambitious university founders.
                </p>
                <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
                  <p>✓ Co-founding and capital injection</p>
                  <p>✓ University AI community connectivity</p>
                  <p>✓ Automated Digital Risk & IP protection</p>
                  <p>✓ Tier-1 angel and venture syndicate</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Why DRP in Venture Diligence?
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI startups with strong technical breakthroughs are prime targets for impersonation before launch. We ensure zero namespace collision and pre-emptively file protective takedowns.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Submissions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Active University Founder Pitch Submissions ({submissions.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                  <tr>
                    <th className="px-4 py-3">Startup Name</th>
                    <th className="px-4 py-3">Founder & Institution</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Brand Safety Score</th>
                    <th className="px-4 py-3">Exposure Risk</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3 text-right">Diligence Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">
                        {sub.startupName}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-200">{sub.founderName}</span>
                        <p className="text-[11px] text-slate-500">{sub.universityOrLab}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {sub.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 tabular-nums">
                        {sub.securityAuditScore}/100
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                            sub.exposureRisk === 'low'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {sub.exposureRisk}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full">
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Investor Portfolio Dashboard */}
      {subTab === 'investor_dashboard' && (
        <div className="space-y-6">
          {/* Investor KPI Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-medium">Protected Portfolio Co-builds</p>
              <p className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                {portfolio.length}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-medium">Portfolio Avg Takedown Rate</p>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">
                96.4%
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-medium">Mean Time to Takedown (MTTR)</p>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">
                18 hrs
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-medium">Total Impersonators Neutralized</p>
              <p className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                42
              </p>
            </div>
          </div>

          {/* Portfolio Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  Kampus.VC Portfolio Companies Risk & Brand Integrity Matrix
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live risk scorecard monitoring threats across all venture studio investments.
                </p>
              </div>

              <button
                onClick={() => {
                  const csv = `Company,Legal Name,Sector,Stage,Risk Grade,Active Threats,Takedown Rate,Domain\n` +
                    portfolio.map(p => `"${p.name}","${p.legalName}","${p.sector}","${p.stage}","${p.riskGrade}",${p.activeSocialThreats + p.activeAppThreats},"${p.takedownSuccessRate}%","${p.domain}"`).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `kampus-portfolio-drp-diligence-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                Export Diligence CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                  <tr>
                    <th className="px-4 py-3">Company & Sector</th>
                    <th className="px-4 py-3">Kampus Cohort</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Brand Safety Grade</th>
                    <th className="px-4 py-3">Active Threats</th>
                    <th className="px-4 py-3">Takedown Rate</th>
                    <th className="px-4 py-3">Last DRP Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {portfolio.map((co) => (
                    <tr key={co.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                            <img src={co.logoUrl} alt={co.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm">{co.name}</span>
                            <p className="text-[11px] text-slate-400">{co.sector}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-medium">{co.kampusCohort}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {co.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                            co.riskGrade.startsWith('A')
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {co.riskGrade}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums">
                        {co.activeSocialThreats + co.activeAppThreats > 0 ? (
                          <span className="text-rose-400 font-bold">
                            {co.activeSocialThreats + co.activeAppThreats} active
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium">0 threats</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 tabular-nums">
                        {co.takedownSuccessRate}%
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                        {co.lastAuditDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
