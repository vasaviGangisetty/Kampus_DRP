/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Search,
  Copy,
  Check,
} from 'lucide-react';
import {
  analyzeLookalike,
  generateBrandPermutations,
  calculateLevenshtein,
  calculateSimilarity,
  LookalikeResult,
  HOMOGLYPH_MAP,
  THREAT_AFFIXES,
} from '../utils/lookalike';
import { BrandProfile } from '../types/drp';

interface LookalikeEngineViewProps {
  brand: BrandProfile;
}

export const LookalikeEngineView: React.FC<LookalikeEngineViewProps> = ({ brand }) => {
  const [targetWord, setTargetWord] = useState<string>(brand.name);
  const [candidateInput, setCandidateInput] = useState<string>('karnpus_vc_support');
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);

  // Generate permutations for target
  const permutations = generateBrandPermutations(targetWord);

  // Analyze the candidate input
  const singleAnalysis = analyzeLookalike(targetWord, candidateInput);
  const rawDist = calculateLevenshtein(targetWord, candidateInput);
  const rawSim = calculateSimilarity(targetWord, candidateInput);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVariant(text);
    setTimeout(() => setCopiedVariant(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Bonus Feature
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Look-alike & Typosquatting Detection Engine
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Threat actors exploit human optical shortcuts to deceive founders, customers, and investors.
              This algorithmic engine analyzes <strong>character swaps</strong>, <strong>homoglyphs / visual twins</strong> (e.g. <span className="font-mono text-emerald-400">rn</span> for <span className="font-mono text-emerald-400">m</span>, <span className="font-mono text-emerald-400">0</span> for <span className="font-mono text-emerald-400">O</span>), <strong>threat affixes</strong> (<span className="font-mono text-emerald-400">_support</span>, <span className="font-mono text-emerald-400">_official</span>), and <strong>spacing/delimiter changes</strong>, while strictly suppressing normal generic names to prevent false-positives.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Live Comparator Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          Interactive Look-alike Testing Sandbox
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Target Legitimate Brand Name
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetWord}
                onChange={(e) => setTargetWord(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                placeholder="e.g. Kampus"
              />
              <button
                onClick={() => setTargetWord(brand.name)}
                className="whitespace-nowrap px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Reset to Brand
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Test Candidate String / Handle
            </label>
            <input
              type="text"
              value={candidateInput}
              onChange={(e) => setCandidateInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              placeholder="e.g. karnpus_vc or kampus-support"
            />
          </div>
        </div>

        {/* Live Evaluation Result Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                Algorithmic Verdict
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-mono text-sm text-slate-400">"{targetWord}"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="font-mono text-base font-bold text-white">"{candidateInput}"</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {singleAnalysis ? (
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase font-mono border ${
                    singleAnalysis.riskWeight === 'critical'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : singleAnalysis.riskWeight === 'high'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}
                >
                  {singleAnalysis.riskWeight} Risk Lookalike
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Normal / Benign String
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
              <p className="text-[10px] text-slate-500">Levenshtein Edit Distance</p>
              <p className="font-mono text-base font-bold text-white mt-0.5">{rawDist}</p>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
              <p className="text-[10px] text-slate-500">Structural Similarity</p>
              <p className="font-mono text-base font-bold text-emerald-400 mt-0.5">{rawSim}%</p>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
              <p className="text-[10px] text-slate-500">Detected Mutation Technique</p>
              <p className="font-mono text-xs font-semibold text-rose-300 mt-1 uppercase">
                {singleAnalysis ? singleAnalysis.technique.replace(/_/g, ' ') : 'None'}
              </p>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
              <p className="text-[10px] text-slate-500">False-Positive Filter</p>
              <p className="font-semibold text-xs text-slate-300 mt-1">
                {singleAnalysis ? 'Suppression Bypassed (Real Threat)' : 'Suppressed (Normal Name)'}
              </p>
            </div>
          </div>

          {singleAnalysis ? (
            <div className="text-xs text-slate-300 bg-rose-950/20 border border-rose-500/20 rounded-lg p-3">
              <strong className="text-rose-300">Detection Explanation: </strong>
              {singleAnalysis.explanation}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Candidate string shows no intentional malicious lookalike markers (no homoglyphs, no adjacent swaps, no threat affixes). Avoids over-flagging ordinary vocabulary.
            </p>
          )}
        </div>
      </div>

      {/* Permutation Generation Matrix for Proactive Defense */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Proactive Threat Surface: Generated Look-alike Permutations for "{targetWord}"
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              These high-risk permutations are pre-computed and actively queried across social platform graphs and app stores to detect squatting before weaponization.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="px-4 py-3">Variant String</th>
                <th className="px-4 py-3">Attack Technique</th>
                <th className="px-4 py-3">Edit Distance</th>
                <th className="px-4 py-3">Similarity</th>
                <th className="px-4 py-3">Risk Tier</th>
                <th className="px-4 py-3">Algorithmic Rationale</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {permutations.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-white">
                    {p.variant}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] uppercase bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {p.technique.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-slate-300">{p.levenshteinDistance}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-slate-300">{p.similarityPct}%</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        p.riskWeight === 'critical'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {p.riskWeight}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 max-w-xs truncate" title={p.explanation}>
                    {p.explanation}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleCopy(p.variant)}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                    >
                      {copiedVariant === p.variant ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reference Matrix: Homoglyphs and Threat Affixes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Optical Homoglyph Substitution Matrix</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Character substitution dictionary applied during text canonicalization to detect visually identical representations:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs font-mono">
            {Object.entries(HOMOGLYPH_MAP).slice(0, 12).map(([char, glyphs]) => (
              <div key={char} className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-emerald-400 font-bold">{char}</span>
                <span className="text-slate-500 mx-1">→</span>
                <span className="text-slate-300">{glyphs.slice(0, 3).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Monitored Threat Affixes & Suffixes</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Keywords heavily correlated with fraudulent helpdesks, scam giveaways, and executive deception:
          </p>
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {THREAT_AFFIXES.map((affix, idx) => (
              <span key={idx} className="bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded text-[11px]">
                _{affix}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
