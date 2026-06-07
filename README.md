# FinAura Capital

<div align="center">

<img src="https://img.shields.io/badge/FinAura%20Capital-Wealth%20Management%20Suite-0A2540?style=for-the-badge&logo=goldman-sachs&logoColor=FFD700" alt="FinAura Capital Badge" />

<br />

[![NISM Certified](https://img.shields.io/badge/NISM%20Certified-Series%20V--A-008080?style=flat-square&logo=gitbook&logoColor=white)](https://drive.google.com/file/d/16VAKCq27GVd9-KcBID1b8h7cPZJPV8r3/view?usp=drive_link)
![AMFI Registered](https://img.shields.io/badge/AMFI%20Registered-ARN--353581-10B981?style=flat-square&logo=checkmarx&logoColor=white)
[![NJ Partner](https://img.shields.io/badge/NJ%20Wealth-Partner%20103924-F59E0B?style=flat-square&logo=handshake&logoColor=white)](http://p.njw.bz/103924)
![Compliance Standards](https://img.shields.io/badge/Compliance-SEBI%20%26%20AMFI-003087?style=flat-square&logo=shieldon&logoColor=white)

<br />

[**Live Platform**](https://finncap-in.vercel.app/) &nbsp;·&nbsp; [**NJ Wealth Portal**](http://p.njw.bz/103924) &nbsp;·&nbsp; [**WhatsApp Advisory**](https://wa.me/919423669236) &nbsp;·&nbsp; [**Instagram Profile**](https://www.instagram.com/finnauracapital) &nbsp;·&nbsp; [**LinkedIn**](https://www.linkedin.com/in/finaura-capital-813770388/)

</div>

---

## 📋 Executive Overview

**FinAura Capital** is an enterprise-grade financial analytics and wealth management advisory portal designed for modern retail and high-net-worth investors in India. Built and curated by **Shubham Dalvi** — a NISM-certified mutual fund distributor affiliated with NJ Wealth — the suite delivers institutional-quality planning and compound simulators through a premium, interactive user interface.

The platform bridges the gap between complex financial planning and everyday wealth management. By offering clients high-fidelity forecasting engines (SIP, SWP, Goal Planner, and Retirement Estimators) alongside a client-side, privacy-preserving WhatsApp routing system, FinAura Capital ensures seamless, secure, and compliance-first advisory workflows.

---

## 🏛️ System Architecture & Data Flow

FinAura Capital operates as a client-side calculation application to prioritize user privacy and ensure instant mathematical calculations with zero server lag.

```mermaid
graph TD
    Client([Client / Investor]) -->|Accesses Portal| UI[Bento Hub Dashboard]
    
    subgraph Client-Side Application Context
        UI -->|Route to| CalcSuite[Interactive Calculator Engines]
        UI -->|Display| AdvisoryCarousel[Advisory Tips Engine]
        
        subgraph CalcSuite
            SIP[SIP Calculator]
            SWP[SWP Planner]
            Goal[Goal Back-Calculator]
            Retire[Retirement Forecaster]
            Shield[Tactical Cash Shield]
        end
        
        CalcSuite -->|Continuous Inputs| MathEngine[Deterministic Financial Math Engine]
        MathEngine -->|Raw Projections| ChartEngine[Recharts Data Visualizer]
        ChartEngine -->|Render| UI
        
        UI -->|Engage Advisory| LeadEngine[WhatsApp Enquiry Form]
        LeadEngine -->|Construct Struct Text| WAProtocol[Native wa.me URI Protocol Handler]
    end
    
    subgraph External Systems
        WAProtocol -->|Secure Redirect| WAApp[Advisor WhatsApp Channel]
        UI -->|Verification Click| NJVerification[NJ Wealth Partner Verification Portal]
    end

    style UI fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff
    style CalcSuite fill:#1e293b,stroke:#475569,stroke-width:1px,color:#fff
    style MathEngine fill:#0f172a,stroke:#10b981,stroke-width:1px,color:#34d399
    style ExternalSystems fill:#1e1b4b,stroke:#6366f1,stroke-width:1px,color:#fff
```

---

## 🛡️ Regulatory Compliance & Distribution Credentials

FinAura Capital operates under a strict compliance framework. Below are the verified credentials of the distributor:

| Regulatory Attribute | Licensed Status / Value | Verification Source |
| :--- | :--- | :--- |
| **Licensed Distributor** | Shubham Dalvi | Individual Brokerage Code |
| **AMFI Registration Number** | **ARN-353581** | Association of Mutual Funds in India |
| **NISM Certification** | [Series V-A: Mutual Fund Distributors](https://drive.google.com/file/d/16VAKCq27GVd9-KcBID1b8h7cPZJPV8r3/view?usp=drive_link) | [NISM Certificate Verification](https://drive.google.com/file/d/16VAKCq27GVd9-KcBID1b8h7cPZJPV8r3/view?usp=drive_link) |
| **Franchise Affiliation** | NJ India Invest Pvt. Ltd. | NJ Wealth Distributor Network |
| **NJ Wealth Partner Code** | **103924** | Franchise Sub-broker Code |
| **Distributor Verification** | [p.njw.bz/103924](http://p.njw.bz/103924) | [Live Portal Verification Page](http://p.njw.bz/103924) |
| **Regulatory Jurisdiction** | SEBI & AMFI Compliant | Government of India |

---

## 🚀 Key Functional Features

### 1. Bento Grid Navigation Control Panel
An intuitive, responsive grid dashboard modeled after modern UI patterns. It dynamically guides users to specialized planning tools, educational materials, and verified distributor license cards.

### 2. High-Precision Calculator Engines
All calculators feature real-time update triggers, standard zero-clearing fallback routines, and synchronized visual representations:
*   **SIP Wealth Accumulator**: Models long-term compounding using systematic monthly inflows with variables for expected rate of return and time horizon.
*   **SWP Income Planner**: Simulates retirement income generation and estimates remaining corpus longevity across multiple return rates, helping clients define sustainable withdrawal schedules.
*   **Target Goal Planner**: Uses backward induction algorithms to determine the exact monthly contribution required to reach a specific financial goal.
*   **Comprehensive Retirement Planner**: Integrates variables such as current age, target retirement age, life expectancy, post-retirement inflation, and desired monthly income.
*   **Tactical Defensive Shield**: A risk-modeling module that calculates customized emergency fund sizes (3, 6, or 12 months) based on job security risk, fixed expenses, and dependents.

### 3. Privacy-First Lead Routing Engine
*   Unlike typical forms that store data on unsecured databases, FinAura Capital captures enquiry metrics (name, email, service interest, message) client-side.
*   The data is programmatically formatted into a structured, easily readable text layout and routed via a secure client-side redirect (`wa.me` deep link) directly to the advisor's WhatsApp.

### 4. Contextual Advisory Banner
A dynamic carousel providing rotating financial education tips, compliance warnings, and market reminders curated directly by the NISM-certified distributor.

---

## 🛠️ Technology Stack

| Layer | Implementation Component | Technical Features |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18+ (Vite Build) | Virtual DOM rendering for calculator responsiveness |
| **Styling Engine** | Tailwind CSS & Vanilla CSS | Modular styling, theme variable configuration |
| **Animation Engine** | Framer Motion | Viewport entrance animations and smooth micro-transitions |
| **Data Visualization** | Recharts | Responsive SVG vector line & bar charts |
| **Asset Icons** | Lucide React | Clean, scalable vector symbols |
| **Backend Integration** | Node.js / Express | Modular server endpoints for static assets |
| **Deep-linking Broker** | Native WA Protocol (`wa.me`) | Browser-to-app communication |

---

## 📥 Developer Installation & Configuration

### Prerequisites
*   **Node.js** Version $\ge$ 18.x
*   **npm** Version $\ge$ 9.x

### Deployment Instructions

```bash
# 1. Clone the repository codebase
git clone <your-repository-url>
cd finaura-capital

# 2. Install production and development dependencies
npm install

# 3. Establish environmental configuration files
cp .env.example .env
# Open the .env file in your editor and configure variables
```

### Script Profiles

*   **Local Development Server** (Runs server with Hot Module Replacement):
    ```bash
    npm run dev
    ```
*   **Build Engine** (Optimizes and builds production-ready assets):
    ```bash
    npm run build
    ```
*   **Local Production Preview**:
    ```bash
    npm run preview
    ```

---

## 🗂️ Codebase Structure

```
finaura-capital/
├── public/                  # Public static assets & global icons
├── src/                     # Source assets
│   ├── components/          # Reusable components
│   │   ├── BentoHub/        # Bento Layout Dashboard Component
│   │   ├── Calculators/     # Calculation Modules (SIP, SWP, Goal, etc.)
│   │   ├── AdvisoryBanner/  # Dynamic Rotating Tips Carousel
│   │   └── WhatsAppForm/    # Client Enquiry Handler
│   ├── pages/               # Top-level Page Router Views
│   ├── hooks/               # Custom Hooks (Math calculations, window size)
│   ├── utils/               # Financial mathematical logic helper functions
│   ├── styles/              # Global stylesheet variables and Tailwind config
│   └── main.jsx             # React framework bootstrap entry point
├── server/                  # Optional backend assets (Node.js/Express)
│   └── index.js
├── .env.example             # Template for configuration environment variables
├── tailwind.config.js       # Custom Tailwind configuration
├── vite.config.js           # Configuration schema for Vite compilation
└── package.json             # Package configuration file
```

---

## ⚙️ Configuration Variables (`.env`)

To run the application locally or on a production node, establish the following keys in your `.env` file at the root:

```env
# Application Context
VITE_APP_NAME=FinAura Capital
VITE_APP_URL=https://finncap-in.vercel.app/

# Advisory Channel Parameters
VITE_WA_NUMBER=919423669236
VITE_ADVISOR_NAME=Shubham Dalvi

# Distribution & Compliance Parameters
VITE_ARN_CODE=ARN-353581
VITE_NJ_PARTNER_CODE=103924
VITE_NJ_PORTAL_URL=https://p.njw.bz/103924
```

---

## 🏛️ Credentials & AMFI Code of Conduct

**Shubham Dalvi** operates as an AMFI-registered mutual fund distributor (ARN-353581) and is affiliated with the NJ Wealth network (Partner Code: 103924). All activities on the FinAura Capital platform strictly adhere to the guidelines set forth by:

1.  **SEBI** (Securities and Exchange Board of India): Advisory restrictions, transparency mandates, and investor data protections.
2.  **AMFI** (Association of Mutual Funds in India): Circular compliance, ethical distribution procedures, and structured commission disclosures.
3.  **NISM Series V-A standards**: Competency and professional advisory protocols.

*Distributor verification card can be checked at: [p.njw.bz/103924](http://p.njw.bz/103924)*

---

## 🤝 Professional Inquiries & Social Channels

| Platform | Channel Destination / Reference |
| :--- | :--- |
| **Instagram Business** | [@finnauracapital](https://www.instagram.com/finnauracapital) |
| **LinkedIn Professional** | [Shubham Dalvi — LinkedIn Profile](https://www.linkedin.com/in/finaura-capital-813770388/) |
| **Facebook Network** | [FinAura Capital Page](https://www.facebook.com/share/18ehkCsPPh/?mibextid=wwXIfr) |
| **Direct Advisory Line** | [WhatsApp Client Routing (+91 94236 69236)](https://wa.me/919423669236) |

---

## ⚠️ Standard Regulatory Disclaimer

> **Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future results.**
>
> FinAura Capital operates exclusively as an **AMFI-registered mutual fund distributor** (ARN-353581) and does not offer SEBI-registered investment advisory services. Calculators, analytics, and projections presented on this portal are for simulation and financial education purposes only, and should not be construed as investment advice, recommendations, or buy/sell requests.

---

<div align="center">

**FinAura Capital** &nbsp;·&nbsp; AMFI Registered ARN-353581 &nbsp;·&nbsp; NISM Series V-A Certified

*Systematically Compounding and Defending Your Hard-Earned Wealth*

</div>
