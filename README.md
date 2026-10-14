LIVE LINK:  https://kampus-drp.onrender.com
# Kampus DRP — Digital Risk Protection Platform

A digital risk protection platform designed to help organizations identify potential social media impersonation, fake brand profiles, suspicious accounts, and potentially malicious mobile applications.

## About the Project

Kampus DRP aims to protect venture studios, university startups, and emerging businesses from digital threats that misuse their brand identity. The platform combines suspicious profile analysis, look-alike name detection, brand verification, and AI-assisted threat assessment in a unified dashboard.

## Problem Statement

Cybercriminals create fake social media profiles, fraudulent company pages, and cloned mobile applications to deceive customers, steal credentials, and damage brand reputation. Early-stage startups and university spinouts may lack the resources to monitor these threats continuously.

Kampus DRP addresses this challenge by providing a centralized platform to assess suspicious digital assets and support threat investigation.

<img width="1151" height="632" alt="Screenshot 2026-10-14 185404" src="https://github.com/user-attachments/assets/c44b9549-890a-4ad3-81ed-08bbd44c4267" />

## Key Features



- **Social Media Monitoring:** Identify potentially fake profiles and pages impersonating legitimate brands.
- **Suspicious URL Analysis:** Examine submitted URLs for possible impersonation indicators.
- **Look-alike Detection:** Identify similar names, character substitutions, suspicious suffixes, and typosquatting patterns.
- **Brand Whitelisting:** Register verified company domains, social handles, and other authorized assets to reduce false alerts.
- **AI-Assisted Threat Analysis:** Use Google's Gemini AI to analyze available context and explain potential risks.
- **Mobile App Risk Assessment:** Review available application information for suspicious publishers, branding, and permissions.
- **Threat Dashboard:** Present risk classifications, detection explanations, and recommended mitigation steps.
- **Evidence and Reporting:** Organize findings to support investigation and reporting.
-< img width="1138" height="627" alt="Screenshot 2026-10-14 185416" src="https://github.com/user-attachments/assets/c40a5d1f-20ca-482a-89b7-f192759c2174" />

## Technology Stack


<img width="1120" height="583" alt="Screenshot 2026-10-14 185747" src="https://github.com/user-attachments/assets/1f7af0bc-578d-4fb0-8ea3-d917d469e6c5" />

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js and Express
- **Artificial Intelligence:** Google GenAI SDK
- **Deployment:** Render or another compatible hosting platform
- **Version Control:** Git and GitHub

## System Architecture


<img width="1132" height="592" alt="Screenshot 2026-10-14 185429" src="https://github.com/user-attachments/assets/ad808e8a-2158-46bf-8e24-b0374dc95ef5" />

1. **Input Layer:** Collect brand details, URLs, social media handles, or application information.
2. **Detection Layer:** Analyze name similarity, suspicious keywords, and available brand indicators.
3. **AI Analysis Layer:** Use Gemini to help explain suspicious patterns and assess potential threats.
4. **Results Layer:** Display risk classifications, supporting reasons, and recommended actions.
5. **Reporting Layer:** Present findings for further investigation and review.

## How It Works

1. Register a brand or organization.
2. Submit a suspicious URL, profile, or application for analysis.
3. Run the available detection checks.
4. Review the risk classification and explanation.
5. Follow the recommended investigation or mitigation steps.

## Getting Started

### Prerequisites

- Node.js and npm
- Git
- A Google Gemini API key if AI features are enabled

### Installation

Clone the repository:

```bash
git clone https://github.com/vasaviGangisetty/Kampus_DRP.git
cd Kampus_DRP
```

Install the dependencies:

```bash
npm install --legacy-peer-deps
```

Create a `.env` file in the appropriate project root and configure the required environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Replace the placeholder with your own API key. Do not commit the `.env` file to GitHub.

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal to access the application.

## Use Cases

- Detecting potentially fake company and brand profiles.
- Investigating suspicious social media accounts.
- Identifying look-alike brand names and URLs.
- Reviewing potentially suspicious mobile applications.
- Supporting brand safety assessments for startup portfolios.

## Limitations

Detection results depend on the available input data, configured integrations, and implemented analysis methods. Live monitoring, app-store scanning, automated takedowns, and reporting integrations require the relevant functionality and access to be configured. Risk assessments should be reviewed before taking enforcement action.

## Future Enhancements

- Integration with authorized social media and app-store data sources.
- Automated monitoring and threat notifications.
- Advanced logo similarity detection.
- Improved threat prioritization and investigation workflows.
- Portfolio-level reporting and downloadable security assessments.

## Team

**Digital Risk Protection Project Team**

Developed for the Kampus.VC Digital Risk Protection hackathon challenge.

## License

Add a suitable open-source license if you intend to distribute the project publicly.
