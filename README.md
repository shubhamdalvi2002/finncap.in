<div align="center">

<img src="https://img.shields.io/badge/NISM%20Certified-Series%20V--A-0A2540?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/ARN-103924-1A7F5A?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/SEBI%20%26%20AMFI-Compliant-003087?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />

<br /><br />

# FinAura Capital

### Premium Wealth Management & Mutual Funds Advisory Suite

*Systematically Compounding and Defending Your Hard-Earned Wealth*

<br />

[**Live Platform**](#) &nbsp;·&nbsp; [**NJ Wealth Portal**](http://p.njw.bz/103924) &nbsp;·&nbsp; [**WhatsApp Advisory**](https://wa.me/919423669236) &nbsp;·&nbsp; [**Instagram**](https://www.instagram.com/finnauracapital) &nbsp;·&nbsp; [**LinkedIn**](https://www.linkedin.com/in/finaura-capital-813770388/)

</div>

---

## Overview

**FinAura Capital** is a professional-grade wealth management and mutual fund advisory portal built for modern Indian investors. Led by **Shubham Dalvi** — a NISM Series V-A certified mutual fund distributor affiliated with NJ Wealth (ARN-103924) — the platform delivers institutional-quality investment tooling through an accessible, beautifully engineered interface.

The platform bridges the gap between sophisticated financial planning and everyday investor needs, offering interactive compounding simulators, goal-based planners, retirement calculators, and a direct WhatsApp-integrated advisory channel — all within a single, responsive application.

---

## Table of Contents

- [Platform Architecture](#platform-architecture)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Credentials & Compliance](#credentials--compliance)
- [Social Channels](#social-channels)
- [Disclaimer](#disclaimer)

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FinAura Capital                          │
│                  Wealth Management Portal                       │
├────────────────┬────────────────┬───────────────────────────────┤
│  Bento Hub     │  Analytics     │  Advisory Engine              │
│  Control Panel │  Suite         │                               │
│                │                │  • Rotating Tips Banner       │
│  • Navigation  │  • SIP/SWP     │  • WhatsApp Lead Form         │
│  • Services    │  • Goal Planner│  • Auto-formatted Messages    │
│  • Calculators │  • Retirement  │  • Direct WA Redirect         │
│  • Credentials │  • Defensive   │                               │
│                │    Shield      │                               │
├────────────────┴────────────────┴───────────────────────────────┤
│                    React 18 + Vite + Tailwind CSS               │
│              Framer Motion · Recharts · Lucide Icons            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Features

### Verified Distribution Infrastructure

| Attribute | Detail |
|-----------|--------|
| Certification | NISM Series V-A Mutual Fund Distributor |
| ARN Code | **ARN-103924** |
| Franchise | NJ Wealth |
| Verification URL | [p.njw.bz/103924](http://p.njw.bz/103924) |
| Regulatory Body | SEBI & AMFI Compliant |

---

### Bento Hub Control Panel

A bespoke, modern Bento Grid interface that serves as the primary navigation layer. The hub surfaces direct access to:

- Core equity allocation services
- Compounding and projection calculators
- Tactical reserve and defensive allocation sandboxes
- Founder credentials and NISM certification details

---

### Interactive Compounding & Analytics Suite

A comprehensive set of financial simulators designed for precision planning:

#### SIP Calculator — Systematic Investment Planner
Model long-term wealth accumulation through monthly investments with projected corpus breakdowns.

#### SWP Calculator — Structured Withdrawal Planner
Simulate systematic withdrawal schedules for retirement income planning, illustrating portfolio longevity across varying return rates.

#### Goal Planner
Backward-calculate the exact monthly investment required to achieve a defined financial goal within a target timeframe.

#### Retirement Planner
Project retirement corpus requirements based on current age, retirement age, life expectancy, inflation assumptions, and desired monthly income.

#### Tactical Defensive Shield
A customizable emergency fund sandbox that helps users structure 3, 6, or 12-month financial cushions calibrated to their occupational risk profile and monthly obligations.

#### Enhanced UX Input Engineering
All calculator fields support:
- Dual-mode input via **sliders** and **direct numeric entry**
- Graceful `0`-fallback on field clear
- Full backspace support without input-freeze hooks
- Real-time recalculation on every state change

---

### WhatsApp Enquiry Engine

Zero-friction lead capture and advisory routing:

1. Prospect completes a structured form (Name · Phone · Email · Selected Service · Message)
2. Responses are auto-formatted into a clean, structured text block
3. User is redirected to WhatsApp (`+91 94236 69236`) with the pre-composed message — one tap to send

No server-side storage. No third-party CRM dependencies. Privacy-first by design.

---

### Dynamic Advisory Banner

A rotating advisory tips carousel contextualised to the user's active investment filters and selected service, authored by Shubham Dalvi.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **UI Framework** | React 18+ |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS (custom theme variables) |
| **Animations** | Framer Motion (viewport entrance transitions) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Server** | Node.js / Express |
| **Communication** | Native `wa.me` WA protocol handler (client-side) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd finaura-capital

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your configuration values
```

### Development

```bash
# Start local development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
# Run linter checks
npm run lint

# Compile and optimise for production
npm run build

# Preview production build locally
npm run preview
```

Output artefacts are written to the `/dist` directory.

---

## Project Structure

```
finaura-capital/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BentoHub/        # Navigation grid
│   │   ├── Calculators/     # SIP, SWP, Goal, Retirement, Defensive
│   │   ├── AdvisoryBanner/  # Rotating tips carousel
│   │   └── WhatsAppForm/    # Enquiry engine
│   ├── pages/               # Route-level page components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Financial calculation helpers
│   ├── styles/              # Global styles and Tailwind config
│   └── main.jsx             # Application entry point
├── server/                  # Node.js / Express backend
│   └── index.js
├── .env.example             # Environment variable template
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Configuration

Create a `.env` file at the project root using `.env.example` as a template:

```env
# Application
VITE_APP_NAME=FinAura Capital
VITE_APP_URL=https://your-domain.com

# Advisory Contact
VITE_WA_NUMBER=919423669236
VITE_ADVISOR_NAME=Shubham Dalvi

# Distribution
VITE_ARN_CODE=ARN-103924
VITE_NJ_PORTAL_URL=https://p.njw.bz/103924
```

---

## Credentials & Compliance

**Shubham Dalvi** is a NISM Series V-A certified mutual fund distributor operating under ARN-103924, affiliated with the NJ Wealth franchise network. All advisory content and distribution activities on this platform are conducted in adherence to:

- **SEBI** (Securities and Exchange Board of India) regulations
- **AMFI** (Association of Mutual Funds in India) code of conduct
- **NISM Series V-A** certification standards for mutual fund distributors

Distributor verification: [p.njw.bz/103924](http://p.njw.bz/103924)

---

## Social Channels

| Platform | Handle / Link |
|----------|--------------|
| **Instagram** | [@finnauracapital](https://www.instagram.com/finnauracapital) |
| **LinkedIn** | [Shubham Dalvi — FinAura Capital](https://www.linkedin.com/in/finaura-capital-813770388/) |
| **Facebook** | [FinAura Capital](https://www.facebook.com/share/18ehkCsPPh/?mibextid=wwXIfr) |
| **WhatsApp** | [+91 94236 69236](https://wa.me/919423669236) |

---

## Disclaimer

> Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future results.
>
> FinAura Capital operates exclusively as an **AMFI-registered mutual fund distributor** (ARN-103924) and does not provide SEBI-registered investment advisory services. All content on this platform is for informational and educational purposes only and does not constitute financial advice.

---

<div align="center">

**FinAura Capital** &nbsp;·&nbsp; ARN-103924 &nbsp;·&nbsp; NISM Series V-A Certified

*Systematically Compounding and Defending Your Hard-Earned Wealth*

</div>
