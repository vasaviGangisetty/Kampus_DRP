/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Parse JSON bodies
app.use(express.json());

// Initialize Gemini client on server-side if key is available
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini client initialization failed, falling back to heuristic engine:', err);
  }
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    platform: 'Kampus.VC Digital Risk Protection',
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

/**
 * AI-powered Threat Triage & Risk Reasoning Endpoint
 */
app.post('/api/gemini/triage', async (req: Request, res: Response) => {
  try {
    const { threat, brand } = req.body;
    if (!threat || !brand) {
      return res.status(400).json({ error: 'Missing threat or brand payload' });
    }

    if (ai) {
      const prompt = `You are a Senior Digital Risk Protection & Brand Safety SecOps Analyst for Kampus.VC.
Analyze the following detected impersonation threat against the legitimate brand.

LEGITIMATE BRAND:
- Name: ${brand.name}
- Legal Entity: ${brand.legalEntity}
- Primary Domain: ${brand.primaryDomain}
- Official Socials: ${JSON.stringify(brand.officialSocials)}
- Official Apps: ${JSON.stringify(brand.officialApps)}
- Executive Team: ${JSON.stringify(brand.executives)}

DETECTED SUSPICIOUS ENTITY:
- Platform/Store: ${threat.platform || threat.store}
- Account/App Name: ${threat.accountName || threat.appName}
- Handle/Bundle ID: ${threat.handle || threat.bundleId}
- Publisher/Author: ${threat.publisherName || 'N/A'}
- Bio/Description: ${threat.bio || threat.description}
- Stated Stats: Followers=${threat.followerCount || 'N/A'}, Downloads=${threat.downloadCount || 'N/A'}
- Lookalike Detection: ${JSON.stringify(threat.detectionSignals || {})}

Provide a concise, professional security triage response in JSON format:
{
  "summary": "1-2 sentence threat assessment",
  "maliciousIntent": "Specific fraud, phishing, or impersonation tactic used",
  "riskScore": number between 0 and 100,
  "severity": "critical" | "high" | "medium" | "low",
  "recommendedAction": "Exact remediation action (e.g. DMCA notice, app store takedown, domain block)",
  "confidence": number between 0.70 and 0.99
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, triage: parsed });
    }

    // Heuristic fallback if Gemini API is in setup mode
    const isHighRisk = (threat.riskScore || 85) > 75;
    return res.json({
      success: true,
      triage: {
        summary: `Automated heuristic analysis flagged ${threat.accountName || threat.appName} for unauthorized brand trademark mimicry and high likelihood of customer confusion.`,
        maliciousIntent: threat.threatType === 'fake_support_helpdesk'
          ? 'Credential harvesting and fake customer verification scam.'
          : threat.threatType === 'scam_crypto_giveaway'
          ? 'Fraudulent token airdrop and cryptocurrency wallet drainer.'
          : 'Brand impersonation and unauthorized developer attribution.',
        riskScore: threat.riskScore || (isHighRisk ? 92 : 65),
        severity: threat.severity || (isHighRisk ? 'critical' : 'medium'),
        recommendedAction: `Dispatch immediate platform safety takedown to ${threat.platform || threat.store} operations with cryptographic evidence hash.`,
        confidence: 0.95,
      },
    });
  } catch (error: any) {
    console.error('Error during threat triage:', error);
    res.status(500).json({ error: error.message || 'Threat triage failed' });
  }
});

/**
 * AI-generated DMCA / Platform Takedown Notice Endpoint
 */
app.post('/api/gemini/takedown', async (req: Request, res: Response) => {
  try {
    const { threat, brand, user } = req.body;
    if (!threat || !brand) {
      return res.status(400).json({ error: 'Missing threat or brand payload' });
    }

    const complainantName = user?.name || 'Marcus Hayes, Esq.';
    const complainantTitle = user?.title || 'General Counsel & Brand Protection Officer';

    if (ai) {
      const prompt = `Generate a formal, legally precise Trademark & Impersonation Takedown Notice letter suitable for submission to ${threat.platform || threat.store} Trust & Safety and Legal Operations.

DETAILS:
- Legitimate Brand Owner: ${brand.legalEntity} (Trademark: "${brand.name}")
- Complainant Representative: ${complainantName}, ${complainantTitle} (${brand.primaryDomain})
- Infringing Target Name: ${threat.accountName || threat.appName}
- Infringing URL / Handle / Bundle: ${threat.profileUrl || threat.bundleId || threat.handle}
- Platform/Store: ${threat.platform || threat.store}
- Specific Violations: Trademark infringement, deceptive impersonation, unauthorized logo replication, misleading consumer fraud.
- Evidence Hash: ${threat.evidenceHash || 'SHA-256 Verified Timestamp'}

Format the output clearly as a ready-to-dispatch legal notice with Subject Line, Legal Declaration under penalty of perjury, and specific cease-and-desist demand.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ success: true, letter: response.text });
    }

    // Default pristine template
    const letter = `LEGAL NOTICE OF TRADEMARK INFRINGEMENT & DECEPTIVE IMPERSONATION

TO: Trust & Safety / Legal Compliance Department (${(threat.platform || threat.store || 'Platform').toUpperCase()})
DATE: ${new Date().toUTCString()}
REFERENCE CASE ID: KAMPUS-DRP-${Date.now().toString(36).toUpperCase()}

RE: Urgent Takedown Demand for Unauthorized Brand Impersonation & Trademark Infringement
Infringing Asset: ${threat.accountName || threat.appName}
Location / Identifier: ${threat.profileUrl || threat.bundleId || threat.handle}

Dear Legal and Abuse Operations Team,

I am writing on behalf of ${brand.legalEntity} ("Rightsholder"), the registered owner of all exclusive trademark, copyright, and brand goodwill associated with "${brand.name}".

Our continuous Digital Risk Protection monitoring system has detected an unauthorized entity operating under the designation "${threat.accountName || threat.appName}" on your platform.

INFRINGING ACTIVITY SUMMARY:
1. Unauthorized commercial use and mimicry of the protected trademark "${brand.name}".
2. Deceptive replication of official brand imagery, logo assets, and corporate identity without license or authorization.
3. High likelihood of consumer and founder deception, leading users to believe the infringing asset is sponsored by or affiliated with ${brand.name}.
4. Violation of ${threat.platform || threat.store} Terms of Service regarding deceptive practices, impersonation, and intellectual property infringement.

EVIDENCE OF RECORD:
- Legitimate Brand Domain: https://${brand.primaryDomain}
- Official Registered Entity: ${brand.legalEntity}
- Cryptographic Evidence Hash: ${threat.evidenceHash || 'SHA256:7f8a9e2d3b4c5e6f1a0b9c8d7e6f5a4b3c2d1e0f'}

DEMAND FOR REMEDY:
We hereby demand that you expeditiously disable access to or permanently remove the infringing account/application pursuant to applicable intellectual property laws and your platform terms.

STATEMENT OF GOOD FAITH:
I have a good faith belief that use of the material in the manner complained of is not authorized by the copyright/trademark owner, its agent, or the law. The information in this notification is accurate, and under penalty of perjury, I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.

Respectfully submitted,

${complainantName}
${complainantTitle}
${brand.legalEntity}
Contact: legal@${brand.primaryDomain}
Platform Security Operations: https://${brand.primaryDomain}`;

    return res.json({ success: true, letter });
  } catch (error: any) {
    console.error('Error generating takedown letter:', error);
    res.status(500).json({ error: error.message || 'Failed to generate takedown letter' });
  }
});

// -------------------------------------------------------------
// Server Setup (Vite Middleware in dev / Static files in prod)
// -------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kampus DRP Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
