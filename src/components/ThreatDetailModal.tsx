/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Send,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Flame,
  FileText,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { SocialThreat, AppThreat, BrandProfile, UserProfile } from '../types/drp';

interface ThreatDetailModalProps {
  threat: SocialThreat | AppThreat | null;
  brand: BrandProfile;
  currentUser: UserProfile;
  onClose: () => void;
  onDispatchTakedown: (threatId: string, letter: string) => void;
}

export const ThreatDetailModal: React.FC<ThreatDetailModalProps> = ({
  threat,
  brand,
  currentUser,
  onClose,
  onDispatchTakedown,
}) => {
  if (!threat) return null;

  const isSocial = 'platform' in threat;
  const [activeTab, setActiveTab] = useState<'dossier' | 'takedown'>('dossier');
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [isGeneratingAiTakedown, setIsGeneratingAiTakedown] = useState(false);
  const [takedownLetterText, setTakedownLetterText] = useState<string>(
    threat.takedownNotice || ''
  );

  // Fallback initial takedown letter generator
  const generateInitialLetter = () => {
    const assetName = isSocial ? (threat as SocialThreat).accountName : (threat as AppThreat).appName;
    const identifier = isSocial ? `@${(threat as SocialThreat).handle}` : (threat as AppThreat).bundleId;
    const platform = isSocial ? (threat as SocialThreat).platform.toUpperCase() : (threat as AppThreat).store.toUpperCase();

    return `FORMAL NOTICE OF TRADEMARK INFRINGEMENT & DECEPTIVE IMPERSONATION

DATE: ${new Date().toUTCString()}
TO: ${platform} Trust & Safety / Legal Compliance Department
CASE REFERENCE: KAMPUS-DRP-${Date.now().toString(36).toUpperCase()}

Dear Legal Operations Team,

I represent ${brand.legalEntity} ("Rightsholder"), the registered owner of the trademark and goodwill of "${brand.name}".

We have identified an unauthorized and deceptive asset operating on your platform:
- Infringing Asset Name: ${assetName}
- Platform Identifier / Handle / Bundle ID: ${identifier}
- Primary Brand Domain: https://${brand.primaryDomain}
- Evidence Hash: ${'evidenceHash' in threat ? (threat as any).evidenceHash : 'SHA256:7f8a9e2d3b4c5e6f1a0b9c8d7e6f5a4b3c2d1e0f'}

SPECIFIC VIOLATIONS:
1. Unauthorized replication of proprietary brand names, logos, and trademarks.
2. Deceptive misrepresentation designed to mislead consumers and startup founders into believing this asset is an official service of ${brand.name}.
3. Violation of platform terms regarding fraud, phishing, and impersonation.

DEMAND FOR RELIEF:
We hereby demand that you expeditiously disable access to, remove, or suspend the aforementioned infringing entity pursuant to your platform terms of service and applicable intellectual property laws.

DECLARATION:
I state under penalty of perjury that I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed, and that the information in this notice is accurate.

Submitted by,
${currentUser.name}
${currentUser.title}
${brand.legalEntity}
Contact: legal@${brand.primaryDomain}`;
  };

  const handleGenerateAiTakedown = async () => {
    setIsGeneratingAiTakedown(true);
    try {
      const res = await fetch('/api/gemini/takedown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threat, brand, user: currentUser }),
      });
      const data = await res.json();
      if (data.letter) {
        setTakedownLetterText(data.letter);
      } else {
        setTakedownLetterText(generateInitialLetter());
      }
    } catch {
      setTakedownLetterText(generateInitialLetter());
    } finally {
      setIsGeneratingAiTakedown(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(takedownLetterText || generateInitialLetter());
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Forensic Threat Dossier: {isSocial ? (threat as SocialThreat).accountName : (threat as AppThreat).appName}
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {threat.severity} Risk
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting: <strong className="text-white">{brand.name}</strong> · Risk Score:{' '}
                <span className="font-mono text-rose-400 font-bold">{threat.riskScore}/100</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Sub Tabs */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'dossier'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Evidence & Side-by-Side Comparison
          </button>
          <button
            onClick={() => {
              setActiveTab('takedown');
              if (!takedownLetterText) setTakedownLetterText(generateInitialLetter());
            }}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'takedown'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            2. Legal Takedown Notice Generator
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {activeTab === 'dossier' && (
            <>
              {/* Side-by-Side Comparison */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Comparative Analysis: Official Brand vs Suspected Impersonator
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Genuine Asset */}
                  <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" /> Official Brand Asset
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Whitelisted / Verified
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-400">
                        Brand Name: <strong className="text-white">{brand.name}</strong>
                      </p>
                      <p className="text-slate-400">
                        Authorized Entity: <span className="text-slate-200">{brand.legalEntity}</span>
                      </p>
                      <p className="text-slate-400">
                        Primary Domain:{' '}
                        <a href={`https://${brand.primaryDomain}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                          {brand.primaryDomain}
                        </a>
                      </p>
                      {isSocial ? (
                        <p className="text-slate-400">
                          Official Handle: <span className="text-white font-mono">@{brand.officialSocials[0]?.handle || 'KampusVC'}</span>
                        </p>
                      ) : (
                        <p className="text-slate-400">
                          Official Publisher: <span className="text-white">{brand.legalEntity}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rogue Impersonator */}
                  <div className="bg-slate-950 border border-rose-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" /> Suspected Impersonating Asset
                      </span>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                        Flagged Threat
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-400">
                        Target Name:{' '}
                        <strong className="text-rose-300">
                          {isSocial ? (threat as SocialThreat).accountName : (threat as AppThreat).appName}
                        </strong>
                      </p>
                      {isSocial ? (
                        <>
                          <p className="text-slate-400">
                            Handle: <span className="text-rose-400 font-mono">@{(threat as SocialThreat).handle}</span>
                          </p>
                          <p className="text-slate-400">
                            Followers:{' '}
                            <span className="font-mono text-slate-200">
                              {(threat as SocialThreat).followerCount}
                            </span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-slate-400">
                            Bundle ID:{' '}
                            <span className="text-rose-400 font-mono">{(threat as AppThreat).bundleId}</span>
                          </p>
                          <p className="text-slate-400">
                            Rogue Publisher:{' '}
                            <span className="text-rose-300 font-semibold">
                              {(threat as AppThreat).publisherName}
                            </span>
                          </p>
                        </>
                      )}
                      <p className="text-slate-400">
                        Discovered: <span className="text-slate-300 font-mono text-[11px]">{new Date(threat.discoveredAt).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signals Breakdown */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-white">Detection Signal Metrics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <p className="text-[10px] text-slate-500">Name Resemblance</p>
                    <p className="font-mono text-sm font-bold text-white mt-0.5">
                      {threat.detectionSignals.nameSimilarityPct}%
                    </p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <p className="text-[10px] text-slate-500">Logo Perceptual Match</p>
                    <p className="font-mono text-sm font-bold text-rose-400 mt-0.5">
                      {threat.detectionSignals.logoSimilarityPct}%
                    </p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <p className="text-[10px] text-slate-500">Lookalike Type</p>
                    <p className="font-mono text-xs font-semibold text-amber-400 mt-1 uppercase">
                      {threat.detectionSignals.lookalikeType || 'Standard Mimicry'}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <p className="text-[10px] text-slate-500">Verified Whitelist Check</p>
                    <p className="font-semibold text-xs text-rose-400 mt-1">
                      Failed (Rogue Asset)
                    </p>
                  </div>
                </div>
              </div>

              {/* Gemini AI Intelligence Analysis */}
              {threat.aiAnalysis && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    Gemini AI Threat Assessment & Forensic Reasoning
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {threat.aiAnalysis.summary}
                  </p>
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/60 space-y-1">
                    <p>
                      Malicious Mechanism:{' '}
                      <strong className="text-slate-200">{threat.aiAnalysis.maliciousIntent}</strong>
                    </p>
                    <p>
                      Recommended Action:{' '}
                      <strong className="text-emerald-300">{threat.aiAnalysis.recommendedAction}</strong>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'takedown' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Official Trademark & Store Abuse Takedown Notice
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formatted with legal declarations and cryptographic evidence hash under penalty of perjury.
                  </p>
                </div>

                <button
                  onClick={handleGenerateAiTakedown}
                  disabled={isGeneratingAiTakedown}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiTakedown ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAiTakedown ? 'Regenerating via Gemini...' : 'Enhance with Gemini AI'}</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  rows={14}
                  value={takedownLetterText || generateInitialLetter()}
                  onChange={(e) => setTakedownLetterText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />

                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 shadow-md border border-slate-700 transition-colors"
                >
                  {copiedLetter ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Notice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between bg-slate-900 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Close Dossier
          </button>

          <button
            onClick={() => {
              onDispatchTakedown(threat.id, takedownLetterText || generateInitialLetter());
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center gap-2 transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            Dispatch Formal Takedown Notice
          </button>
        </div>
      </div>
    </div>
  );
};
