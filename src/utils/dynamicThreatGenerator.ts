/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Dynamic Threat Generation & Scanning Engine
 * Generates realistic, tailored threats across Social Media & App Stores
 * for ANY newly registered company or brand profile.
 * Guarantees that official assets are strictly whitelisted and never flagged.
 */

import { BrandProfile, SocialThreat, AppThreat } from '../types/drp';
import { generateBrandPermutations, calculateSimilarity, calculateLevenshtein } from './lookalike';

export function generateThreatsForCompany(brand: BrandProfile): {
  socialThreats: SocialThreat[];
  appThreats: AppThreat[];
} {
  const brandNorm = brand.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const brandDisplay = brand.name;
  const officialHandles = brand.officialSocials.map((s) => s.handle.toLowerCase());
  const officialBundleIds = brand.officialApps.map((a) => a.bundleId.toLowerCase());
  const primaryExec = brand.executives[0]?.name || 'Alex Mercer';

  const permutations = generateBrandPermutations(brandNorm);
  const homoglyphVariant = permutations.find((p) => p.technique === 'homoglyph')?.variant || `${brandNorm}1`;
  const swapVariant = permutations.find((p) => p.technique === 'character_swap')?.variant || `${brandNorm}_official`;

  const now = new Date();
  const dateStr = now.toISOString();

  // 1. DYNAMIC SOCIAL THREATS
  const socialThreats: SocialThreat[] = [
    // Threat 1: Fake Customer Support / Helpdesk (Added Word tactic)
    {
      id: `st-${brand.id}-01`,
      brandId: brand.id,
      platform: 'x',
      accountName: `${brandDisplay} Customer Support Desk`,
      handle: `${brandNorm}_support_desk`,
      profileUrl: `https://x.com/${brandNorm}_support_desk`,
      avatarUrl: brand.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      bio: `Official 24/7 Verified Customer Support & Inquiries for ${brandDisplay}. DM us immediately for account verification, priority ticketing, and portal login issues.`,
      creationDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
      followerCount: 312,
      isVerified: false,
      threatType: 'fake_support_helpdesk',
      riskScore: 96,
      severity: 'critical',
      detectionSignals: {
        nameSimilarityPct: 94,
        handleDistance: 13,
        lookalikeType: 'added_word',
        logoSimilarityPct: 98,
        bioKeywordsMatched: ['support', 'dm us immediately', 'verification', 'portal login'],
        followerAnomaly: true,
      },
      status: 'active_alert',
      evidenceHash: `sha256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}8f9a0b1c2d3e4f`,
      discoveredAt: dateStr,
      aiAnalysis: {
        summary: `Critical fake customer support profile masquerading as ${brandDisplay}. Exploits brand name and replicated avatar to solicit direct messages for credential harvesting.`,
        maliciousIntent: 'Credential theft, OTP harvesting, and social engineering targeting customer accounts.',
        recommendedAction: `File emergency Impersonation & Trademark takedown with X Trust & Safety. Add @${brandNorm}_support_desk to global blocklist.`,
        confidence: 0.98,
      },
    },

    // Threat 2: Optical Homoglyph / Typosquatting Twin (Homoglyph tactic)
    {
      id: `st-${brand.id}-02`,
      brandId: brand.id,
      platform: 'x',
      accountName: `${brandDisplay} Global`,
      handle: homoglyphVariant,
      profileUrl: `https://x.com/${homoglyphVariant}`,
      avatarUrl: brand.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      bio: `${brandDisplay} official announcements and community hub. Building the future of our ecosystem. Connect your account: http://verify-${brandNorm}.link/claim`,
      creationDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      followerCount: 1420,
      isVerified: false,
      threatType: 'impersonation_profile',
      riskScore: 93,
      severity: 'critical',
      detectionSignals: {
        nameSimilarityPct: 96,
        handleDistance: 2,
        lookalikeType: 'homoglyph',
        logoSimilarityPct: 95,
        bioKeywordsMatched: ['announcements', 'community hub', 'connect your account', 'claim'],
        followerAnomaly: true,
      },
      status: 'active_alert',
      evidenceHash: `sha256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}11223344`,
      discoveredAt: dateStr,
      aiAnalysis: {
        summary: `Homoglyph typosquatting attack using visual twin characters to optically clone ${brandDisplay}. Redirects traffic to an external phishing link.`,
        maliciousIntent: 'Phishing domain redirection and unauthorized token/credential collection.',
        recommendedAction: 'Dispatch immediate trademark notice to platform and initiate domain registrar abuse complaint.',
        confidence: 0.96,
      },
    },

    // Threat 3: Scam Giveaway / Token / Grant Allocation (Scam Lure tactic)
    {
      id: `st-${brand.id}-03`,
      brandId: brand.id,
      platform: 'telegram',
      accountName: `${brandDisplay} Rewards & Grants Allocation`,
      handle: `${brandNorm}_rewards_official`,
      profileUrl: `https://t.me/${brandNorm}_rewards_official`,
      avatarUrl: brand.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      bio: `${brandDisplay} official community allocation pool. 50,000 community rewards available for early adopters. Connect wallet or sign in to verify eligibility before registration ends.`,
      creationDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      followerCount: 5200,
      isVerified: false,
      threatType: 'scam_crypto_giveaway',
      riskScore: 98,
      severity: 'critical',
      detectionSignals: {
        nameSimilarityPct: 89,
        handleDistance: 17,
        lookalikeType: 'added_word',
        logoSimilarityPct: 92,
        bioKeywordsMatched: ['rewards', 'allocation pool', 'connect wallet', 'verify eligibility'],
        followerAnomaly: false,
      },
      status: 'under_review',
      evidenceHash: `sha256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}aabbccdd`,
      discoveredAt: dateStr,
      aiAnalysis: {
        summary: `High-risk financial scam masquerading as a community grant or token distribution from ${brandDisplay}. Lures users to link credentials to a malicious contract.`,
        maliciousIntent: 'Financial fraud, wallet draining, and brand reputation sabotage.',
        recommendedAction: 'Issue public security advisory on official handles and submit Telegram abuse report with cryptographic proof.',
        confidence: 0.99,
      },
    },

    // Threat 4: Executive Spoofing (targeting registered founder/CEO)
    {
      id: `st-${brand.id}-04`,
      brandId: brand.id,
      platform: 'linkedin',
      accountName: `${primaryExec} (${brandDisplay})`,
      handle: `${primaryExec.toLowerCase().replace(/\s+/g, '-')}-${brandNorm}-direct`,
      profileUrl: `https://linkedin.com/in/${primaryExec.toLowerCase().replace(/\s+/g, '-')}-${brandNorm}-direct`,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: `Executive at ${brandDisplay}. Connecting with partners, angel investors, and applicants. For urgent inquiries or private dealflow, reach out on WhatsApp/Telegram.`,
      creationDate: new Date(Date.now() - 25 * 86400000).toISOString().split('T')[0],
      followerCount: 94,
      isVerified: false,
      threatType: 'executive_spoof',
      riskScore: 91,
      severity: 'high',
      detectionSignals: {
        nameSimilarityPct: 92,
        handleDistance: 12,
        lookalikeType: 'spacing_delimiter',
        logoSimilarityPct: 35,
        bioKeywordsMatched: ['executive', brandDisplay.toLowerCase(), 'private dealflow', 'urgent inquiries'],
        followerAnomaly: true,
        executiveTargeted: primaryExec,
      },
      status: 'active_alert',
      evidenceHash: `sha256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}eeff0011`,
      discoveredAt: dateStr,
      aiAnalysis: {
        summary: `VIP Executive impersonation targeting ${primaryExec} at ${brandDisplay}. Attempts to redirect incoming business inquiries to unmonitored channels for spear-phishing.`,
        maliciousIntent: 'Executive spear-phishing, trade secret espionage, and fraudulent partnership solicitations.',
        recommendedAction: 'File LinkedIn Executive Impersonation claim with verified corporate email confirmation.',
        confidence: 0.94,
      },
    },
  ];

  // 2. DYNAMIC APP STORE THREATS
  const appThreats: AppThreat[] = [
    // Threat 1: Rogue Google Play Store App with Publisher Mismatch
    {
      id: `at-${brand.id}-01`,
      brandId: brand.id,
      store: 'google_play',
      appName: `${brandDisplay}: Mobile Client & Portal`,
      bundleId: `com.${brandNorm}.mobileapp.client`,
      publisherName: 'CloudWave Global Dev Ltd', // Publisher mismatch! (Official is brand.legalEntity)
      iconUrl: brand.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      downloadCount: '5,000+',
      rating: 2.3,
      reviewCount: 88,
      price: 'Free',
      releaseDate: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
      description: `The premier companion application for ${brandDisplay} users. Access your account, sync your profile data, and authenticate logins securely on mobile.`,
      threatType: 'unauthorized_developer',
      riskScore: 97,
      severity: 'critical',
      detectionSignals: {
        nameSimilarityPct: 95,
        publisherMismatch: true,
        logoSimilarityPct: 96,
        descriptionResemblancePct: 88,
        lookalikeType: 'added_word',
        suspiciousPermissions: [
          'android.permission.READ_SMS',
          'android.permission.SYSTEM_ALERT_WINDOW',
          'android.permission.READ_CONTACTS',
        ],
        fakeReviewRatioPct: 82,
      },
      status: 'active_alert',
      discoveredAt: dateStr,
      aiAnalysis: {
        summary: `Unauthorized rogue application mimicking ${brandDisplay} on Google Play. Published by entity "CloudWave Global Dev Ltd" instead of "${brand.legalEntity}". Requests dangerous SMS and Overlay permissions.`,
        maliciousIntent: 'Credential theft, OTP 2-factor authentication bypass, and deceptive brand association.',
        recommendedAction: `Submit Google Play Developer Abuse & Trademark Infringement report to Google Developer Policy Center.`,
      },
    },

    // Threat 2: Rogue Apple App Store App
    {
      id: `at-${brand.id}-02`,
      brandId: brand.id,
      store: 'apple_app_store',
      appName: `${brandDisplay} Companion Pro`,
      bundleId: `io.${brandNorm}.companion.pro`,
      publisherName: 'Apex Digital Softworks FZ-LLC', // Publisher mismatch
      iconUrl: brand.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      downloadCount: '1,200+',
      rating: 3.1,
      reviewCount: 34,
      price: '$2.99',
      releaseDate: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
      description: `Official companion tool for ${brandDisplay} mobile analytics and account management. Unlock pro features with in-app purchase.`,
      threatType: 'rogue_app',
      riskScore: 92,
      severity: 'critical',
      detectionSignals: {
        nameSimilarityPct: 91,
        publisherMismatch: true,
        logoSimilarityPct: 89,
        descriptionResemblancePct: 90,
        suspiciousPermissions: ['NSContactsUsageDescription'],
        fakeReviewRatioPct: 40,
      },
      status: 'active_alert',
      discoveredAt: dateStr,
      aiAnalysis: {
        summary: `Paid counterfeit application on Apple App Store infringing upon ${brandDisplay} trademarks and charging consumers without authorization.`,
        maliciousIntent: 'Consumer fraud, unauthorized monetization of brand goodwill, and misleading representation.',
        recommendedAction: 'Dispatch Apple App Store Legal Content Dispute Notice under the Digital Millennium Copyright Act.',
      },
    },

    // Threat 3: Repackaged Trojanized APK on 3rd-party mirror
    {
      id: `at-${brand.id}-03`,
      brandId: brand.id,
      store: 'third_party_apk',
      appName: `${brandNorm}-v2.4-modded.apk`,
      bundleId: `com.${brandNorm}.official.mod`,
      publisherName: 'Unknown / ModdedAPK Portal',
      iconUrl: brand.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      downloadCount: '3,800',
      rating: 1.5,
      reviewCount: 19,
      price: 'Free',
      releaseDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      description: `Modified release of ${brandDisplay} mobile client with premium features unlocked and ad-free browsing.`,
      threatType: 'trojanized_brand',
      riskScore: 99,
      severity: 'critical',
      detectionSignals: {
        nameSimilarityPct: 97,
        publisherMismatch: true,
        logoSimilarityPct: 100,
        descriptionResemblancePct: 82,
        suspiciousPermissions: [
          'RECEIVE_BOOT_COMPLETED',
          'ACCESS_FINE_LOCATION',
          'INTERNET',
          'READ_PHONE_STATE',
        ],
        fakeReviewRatioPct: 90,
      },
      status: 'active_alert',
      discoveredAt: dateStr,
      aiAnalysis: {
        summary: `Repackaged APK trojan hosting spyware payload on third-party mirror platforms (APKPure/Aptoide) using ${brandDisplay} branding.`,
        maliciousIntent: 'Spyware payload installation, unauthorized background data harvesting, and brand reputation poisoning.',
        recommendedAction: 'Send automated cease & desist to hosting CDN and submit file SHA-256 hash to Google Play Protect & VirusTotal.',
      },
    },
  ];

  // Filter out any threats that accidentally match official registered handles or apps (Strict Whitelist enforcement)
  const safeSocialThreats = socialThreats.filter(
    (t) => !officialHandles.includes(t.handle.toLowerCase())
  );
  const safeAppThreats = appThreats.filter(
    (a) => !officialBundleIds.includes(a.bundleId.toLowerCase())
  );

  return {
    socialThreats: safeSocialThreats,
    appThreats: safeAppThreats,
  };
}
