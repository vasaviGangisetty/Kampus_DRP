/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SocialPlatform = 'x' | 'linkedin' | 'instagram' | 'facebook' | 'telegram' | 'tiktok' | 'youtube' | 'discord';
export type AppStorePlatform = 'apple_app_store' | 'google_play' | 'third_party_apk';
export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ThreatStatus = 'active_alert' | 'under_review' | 'takedown_requested' | 'resolved' | 'whitelisted';

export interface OfficialSocialAccount {
  id: string;
  platform: SocialPlatform;
  handle: string;
  url: string;
  verified: boolean;
  followerCount: number;
}

export interface OfficialAppAsset {
  id: string;
  store: 'apple_app_store' | 'google_play';
  appName: string;
  appId: string; // e.g. "id1678901234"
  bundleId: string; // e.g. "vc.kampus.app"
  publisherName: string; // e.g. "Kampus Studio Inc."
  officialUrl: string;
  rating?: number;
}

export interface OfficialExecutive {
  id: string;
  name: string;
  role: string;
  officialHandle?: string;
  emailPrefix?: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  legalEntity: string;
  alternateNames: string[];
  primaryDomain: string;
  officialDomains: string[];
  logoUrl: string;
  officialSocials: OfficialSocialAccount[];
  officialApps: OfficialAppAsset[];
  executives: OfficialExecutive[];
  keywords: string[];
  whitelistedTokens: string[];
  createdDate: string;
  lastUpdated: string;
}

export interface SocialThreat {
  id: string;
  brandId: string;
  platform: SocialPlatform;
  accountName: string;
  handle: string;
  profileUrl: string;
  avatarUrl: string;
  bio: string;
  creationDate: string;
  followerCount: number;
  isVerified: boolean;
  threatType:
    | 'impersonation_profile'
    | 'fake_company_page'
    | 'scam_crypto_giveaway'
    | 'fake_support_helpdesk'
    | 'executive_spoof'
    | 'phishing_lure';
  riskScore: number; // 0 - 100
  severity: ThreatSeverity;
  detectionSignals: {
    nameSimilarityPct: number;
    handleDistance: number;
    lookalikeType?: 'character_swap' | 'homoglyph' | 'added_word' | 'spacing_delimiter' | 'combosquatting';
    logoSimilarityPct: number;
    bioKeywordsMatched: string[];
    followerAnomaly: boolean;
    executiveTargeted?: string;
  };
  status: ThreatStatus;
  evidenceHash: string;
  discoveredAt: string;
  aiAnalysis?: {
    summary: string;
    maliciousIntent: string;
    recommendedAction: string;
    confidence: number;
  };
  takedownNotice?: string;
}

export interface AppThreat {
  id: string;
  brandId: string;
  store: AppStorePlatform;
  appName: string;
  bundleId: string;
  publisherName: string;
  iconUrl: string;
  downloadCount: string;
  rating: number;
  reviewCount: number;
  price: string;
  releaseDate: string;
  description: string;
  threatType:
    | 'rogue_app'
    | 'trojanized_brand'
    | 'unauthorized_developer'
    | 'phishing_portal'
    | 'fake_crypto_wallet';
  riskScore: number;
  severity: ThreatSeverity;
  detectionSignals: {
    nameSimilarityPct: number;
    publisherMismatch: boolean;
    logoSimilarityPct: number;
    descriptionResemblancePct: number;
    lookalikeType?: string;
    suspiciousPermissions: string[];
    fakeReviewRatioPct?: number;
  };
  status: ThreatStatus;
  discoveredAt: string;
  aiAnalysis?: {
    summary: string;
    maliciousIntent: string;
    recommendedAction: string;
  };
  takedownNotice?: string;
}

export interface PitchSubmission {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  universityOrLab: string;
  thesis: string;
  stage: 'Idea / Lab' | 'Pre-Seed' | 'Seed';
  targetAudience: string;
  brandAssets: {
    domain: string;
    socialHandles: string;
    appName?: string;
  };
  securityAuditScore: number; // 0 - 100
  exposureRisk: 'low' | 'moderate' | 'high';
  impersonationCount: number;
  submittedAt: string;
  status: 'Under Review' | 'Diligence Scheduled' | 'Shortlisted' | 'Funded';
  notes?: string;
}

export interface PortfolioCompany {
  id: string;
  name: string;
  legalName: string;
  sector: 'Applied AI & Agents' | 'Spatial & Robotics' | 'BioTech AI' | 'FinTech / Web3' | 'Developer Infrastructure';
  thesis: string;
  stage: 'Studio Co-build' | 'Seed' | 'Series A';
  kampusCohort: string;
  riskGrade: 'A+' | 'A' | 'B' | 'C' | 'F';
  activeSocialThreats: number;
  activeAppThreats: number;
  takedownSuccessRate: number; // e.g. 96
  lastAuditDate: string;
  domain: string;
  logoUrl: string;
}

export type UserRole = 'secops_analyst' | 'threat_hunter' | 'brand_counsel' | 'investor_partner';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  organization: string;
  avatarUrl: string;
  notificationsEnabled: boolean;
  webhookUrl?: string;
  twoFactorEnabled: boolean;
}
