# Kampus.VC — Digital Risk Protection (DRP) Platform
### Specialized Social Media & Mobile App Store Impersonation Defense System

Built for **Kampus.VC Applied AI Venture Studio** to monitor, identify, prioritize, and neutralize:
1. **Fake or impersonating social media profiles** (X, LinkedIn, Telegram, Instagram, etc.)
2. **Fake company or brand pages** and malicious customer-support traps
3. **Scam accounts** using company identity for crypto giveaways, credential theft, and executive spoofing
4. **Suspicious mobile applications** imitating brands across Google Play, Apple App Store, and rogue APK repositories

---

## 🚀 Quick Start (Visual Studio Code)

### 1. Open in Visual Studio Code
```bash
git clone <your-github-repo-url>
cd kampus-drp
code .
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your optional `GEMINI_API_KEY` in `.env` for AI-assisted threat triage and automated legal takedown notices.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Deployment to Vercel

### Option A: One-Click GitHub Integration (Recommended)
1. Push your repository to **GitHub**:
   ```bash
   git add .
   git commit -m "Initial Kampus DRP platform commit"
   git push origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Select your GitHub repository.
4. Framework Preset: **Vite** (auto-detected via `vercel.json`).
5. Click **Deploy**. Any future commits to `main` will automatically trigger the GitHub Actions CI/CD workflow defined in `.github/workflows/deploy.yml`.

### Option B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

---

## 🛡️ Core Capabilities

- **Brand Profile Definition & Whitelist Exclusion**: Organizations register legitimate assets (name, official socials, verified apps, executive roster, registered domains). **Official assets are strictly whitelisted and never flagged as threats.**
- **Social Media Monitoring**: Real-time scanner identifying lookalikes, executive spoofs, fake helpdesks, and scam token airdrops.
- **App Store Monitoring**: Detection of publisher mismatches, intrusive permissions (`READ_SMS`, `SYSTEM_ALERT_WINDOW`), and repackaged rogue APKs.
- **Look-alike Permutation Engine**: Algorithmic detection of character swaps, homoglyphs (e.g., `0`/`O`, `rn`/`m`), added affixes (`_support`, `_official`), and spacing alterations.
- **AI Threat Triage & One-Click Takedowns**: Powered by Gemini (`gemini-3.8-flash`) to generate structured forensic rationales and formal DMCA/platform legal notices.
- **Interactive Architecture & Technical Spec**: Visual breakdown of crawlers, normalization, scoring pipeline, evidence vault, and takedown APIs.
- **Executive Presentation Deck**: 8-slide interactive pitch deck with live demo triggers.
- **Pitch Submission Portal**: University AI founders submit startups to Kampus.VC and receive an instant automated Brand Safety & DRP audit.
- **Investor Dashboard**: Portfolio company risk scorecard, takedown success metrics, and diligence export.
