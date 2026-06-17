# FinAura Capital

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active%20Production-success?style=for-the-badge&logo=statuspage" alt="Production Status" />
  <img src="https://img.shields.io/badge/Tech%20Stack-React%2019%20%7C%20Vite%20%7C%20Express-blue?style=for-the-badge&logo=react" alt="Tech Stack" />
  <img src="https://img.shields.io/badge/NISM-Certified%20Distributor-gold?style=for-the-badge&logo=credentials" alt="NISM Certified" />
</p>

> **Premium Wealth Management & Mutual Funds Advisory Suite**
>
> A high-fidelity, interactive financial advisory portal designed to empower retail investors with mathematical calculators, real-time market data tickers, dynamic news feeds, and an AI-driven financial education assistant. Led by NISM-Certified distributor Shubham Dalvi, the platform blends robust client tools with a direct WhatsApp-integrated advisory channel.

---

## 🔗 Credentials & Quick Connections

| Credentials & Regulatory Info | Client Portals & Actions | Digital Presence |
| :--- | :--- | :--- |
| 🛡️ **AMFI Registration:** [ARN-353581](http://p.njw.bz/103924) | 🔑 **Wealth Desk:** [EWA NJ Wealth Login](https://ewa.njindiaonline.com/ewa/login) | 💼 **LinkedIn:** [Shubham Dalvi Profile](https://www.linkedin.com/in/finaura-capital-813770388/) |
| 🎗️ **NJ Wealth Partner:** Code 103924 | 💬 **Advisory Channel:** [WhatsApp Enquiry](https://wa.me/919423669236) | 📸 **Instagram:** [@finnauracapital](https://www.instagram.com/finnauracapital) |
| 🎓 **Compliance:** NISM Series V-A | 📡 **System Health:** `/api/health` | 📘 **Facebook:** [FinAura Capital Page](https://www.facebook.com/share/18ehkCsPPh/?mibextid=wwXIfr) |

---

## 🏗️ System Architecture

FinAura Capital is structured as a fullstack application, leveraging a single unified Express server during development (integrated with Vite middlewares) and production:

```mermaid
graph TD
    subgraph Client ["Client Browser (React 19 SPA)"]
        UI["Interactive Dashboard (Bento Hub)"]
        Calc["Services & Financial Calculators (SIP/SWP/Retirement)"]
        Chat["Gemini AI Calculator Assistant UI"]
        WS_Client["WebSocket Ticker Client"]
    end

    subgraph Server ["Backend Gateway (Node.js / Express Server)"]
        ExpressApp["Express API Router"]
        WS_Server["WebSocket Server (ws)"]
        DriveProxy["Google Drive Image Proxy (/api/founder-image)"]
    end

    subgraph External ["External Services & APIs"]
        FMP["Financial Modeling Prep economic/economic & quote/ APIs"]
        News["Saurav.tech Business News API"]
        Gemini["Google Gemini AI API (gemini-3.5-flash)"]
        GDrive["Google Drive Asset Host (Founder Credentials Image)"]
    end

    %% Client to Server interactions
    Calc -->|POST /api/calculator-chat| ExpressApp
    UI -->|GET /api/founder-image| DriveProxy
    WS_Client <-->|Bi-directional WebSockets| WS_Server

    %% Server to External interactions
    ExpressApp -->|SDK: GoogleGenAI| Gemini
    WS_Server -->|economic/inflation & economic/interest-rate & quote/| FMP
    WS_Server -->|top-headlines/category/business| News
    DriveProxy -->|Binary Stream Buffering| GDrive
```

---

## 🌟 Core Pillars & Functional Highlights

### 🧭 Navigation & Bento Hub Control Panel
- **Bento Grid Layout**: A sleek navigation grid routing users seamlessly between equity allocations, compounding calculators, defensive cushions, and advisory credentials.
- **Contextual Advisory Banner**: Features rotating advisory guidelines authored by Shubham Dalvi, updating dynamically based on selected services and active filters.

### 📊 Interactive Compounding & Analytical Suite
- **Systematic Investment Plan (SIP) Outpost**: High-fidelity compounding simulation projecting principal capital vs. accrued returns, highlighting the final wealth multiplier.
- **Systematic Withdrawal Plan (SWP) Outpost**: Retirement cash-flow simulator that analyzes corpus sustainability, helping users determine safe withdrawal limits.
- **Goal & Retirement Planners**: Backward-calculators that compute the precise monthly savings required today to target a future inflation-adjusted nest egg.
- **Tactical Defensive Shield**: A customizable sandbox helping users budget a 3, 6, or 12-month occupational and emergency reserve against market volatility.
- **Enhanced UX Input Controls**: Advanced slider-input dual controls. Allows easy text clearing and backspacing without component freezes, falling back smoothly to `0`.

### 🤖 Gemini-Powered Calculator Assistant
- **Calculator Context Awareness**: An embedded educational chat widget that detects which calculator is active and reads its input parameters (e.g., principal, time, expected return) automatically.
- **Financial Literacy Agent**: Translates mathematical figures into plain-English summaries, explains the compounding curve, highlights assumptions (such as constant returns), and suggests actionable steps.
- **Zero-Key Deterministic Fallback**: In the absence of a configured Gemini API key, the system transitions to a local keyword-matching regex system to answer general questions on SIP, SWP, and market index returns.

### 📱 Zero-Overhead Lead Routing
- **WhatsApp Inquiry Generator**: A structured intake form allowing prospective clients to state their target services and details.
- **Parser Engine**: Converts the input fields into a clean, markdown-style textual summary, automatically redirecting the user to WhatsApp support (+91 94236 69236) for direct consultation.

---

## 🧮 Calculator Mathematical Formulations

All calculations inside `src/lib/calculatorMath.ts` are based on standard actuarial and financial compound formulas.

### 1. Systematic Investment Plan (SIP)
Calculates the Future Value ($FV$) of periodic monthly payments (Annuity Due):
$$FV = P \times \frac{(1 + r)^n - 1}{r} \times (1 + r)$$

Where:
- $P$ = Monthly installment amount.
- $r$ = Monthly interest rate ($\text{Annual Expected Return} \div 12 \div 100$).
- $n$ = Total number of compounding periods ($\text{Years} \times 12$).

---

### 2. Systematic Withdrawal Plan (SWP)
A recurrent monthly decay sequence tracks capital drawdown:
$$Balance_{m+1} = Balance_m \times (1 + r) - W$$

Where:
- $Balance_m$ = Remaining portfolio corpus at month $m$ ($Balance_0 = \text{Initial Corpus}$).
- $r$ = Monthly compounding growth rate ($\text{Annual Expected Return} \div 12 \div 100$).
- $W$ = Fixed monthly systematic withdrawal payout.
- *Sustainability Check*: If $Balance_m$ declines to $\le 0$ within 600 months (50 years), the strategy is marked as depleting; otherwise, it is flagged as indefinitely sustainable.

---

### 3. Systematic Transfer Plan (STP)
Relocates capital monthly from a low-volatility source fund (Debt) to a target asset (Equity):
$$SourceBalance_{m+1} = SourceBalance_m \times (1 + r_s) - T$$
$$TargetBalance_{m+1} = (TargetBalance_m + T) \times (1 + r_t)$$

Where:
- $r_s$ = Monthly interest rate of the Source Fund.
- $r_t$ = Monthly interest rate of the Target Fund.
- $T$ = Periodic transfer volume.

---

### 4. Nest-Egg Retirement Planner
1. **Inflation-Adjusted Monthly Expenses**:
   $$F_{exp} = C_{exp} \times (1 + I)^y$$
   Where $C_{exp}$ is current monthly expenditure, $I$ is the annual inflation rate, and $y$ is the years remaining until retirement ($\text{Retire Age} - \text{Current Age}$).
2. **Target Accumulation Corpus**:
   Assuming a standard post-retirement capital protection rate of $8\%$ p.a. and a $20$-year structured payout lifespan:
   $$r_{real} = \frac{1 + 0.08}{1 + I} - 1$$
   $$Corpus = (F_{exp} \times 12) \times \frac{1 - (1 + r_{real})^{-20}}{r_{real}}$$
3. **Required Monthly Pre-Retirement SIP Savings**:
   $$P_{savings} = \frac{Corpus}{\frac{(1 + r_{pre})^n - 1}{r_{pre}} \times (1 + r_{pre})}$$
   Where $r_{pre}$ is the expected pre-retirement asset compounding return rate.

---

### 5. Equated Monthly Installment (EMI)
Calculates monthly debt amortization installments:
$$EMI = P \times \frac{r(1 + r)^n}{(1 + r)^n - 1}$$

Where:
- $P$ = Loan Principal.
- $r$ = Monthly interest rate ($\text{Annual Rate} \div 12 \div 100$).
- $n$ = Loan term in months.

---

### 6. Goal-Based Planner
Solves for the required monthly systematic inflows ($P_{savings}$) to achieve a target future milestone sum ($FV_{target}$):
$$P_{savings} = \frac{FV_{target}}{\frac{(1 + r)^n - 1}{r} \times (1 + r)}$$

---

## 📡 WebSockets & REST API Specifications

The server exposes WebSockets for real-time updates and REST endpoints for UI interactivity.

### 1. WebSocket Event Broadcaster
In standalone/persistent mode, the server opens a WebSocket gateway on port `3000` to broadcast market indicators, stock quotes, and news updates:

#### Event: `STOCK_UPDATE`
Broadcasts stock updates. Simulated updates push every 2 seconds; live FMP data updates every 10 seconds.
```json
{
  "type": "STOCK_UPDATE",
  "data": [
    {
      "name": "NIFTY 50",
      "price": 24356.55,
      "change": 0.43,
      "high": 24410.2,
      "low": 24290.15,
      "volume": 245600000,
      "marketCap": 185000000000000
    }
  ]
}
```

#### Event: `MARKET_INDICATORS`
Broadcasts macroeconomic factors. Pushed on client initialization and updated every 10 minutes.
```json
{
  "type": "MARKET_INDICATORS",
  "data": {
    "inflation": 6.0,
    "interestRate": 8.5,
    "marketReturn": 12.0,
    "goldRate": 73245
  }
}
```

#### Event: `NEWS_UPDATE`
Broadcasts business news updates. Fetched and pushed every 5 minutes.
```json
{
  "type": "NEWS_UPDATE",
  "data": [
    {
      "title": "Market Update: NIFTY 50 hits new high",
      "description": "The Indian stock market continues its bullish trend...",
      "url": "https://example.com/news/1",
      "urlToImage": "https://picsum.photos/seed/market/800/400"
    }
  ]
}
```

---

### 2. REST API Routes

#### `GET /api/health`
- **Description**: Verifies service status.
- **Response**:
  ```json
  { "status": "ok" }
  ```

#### `GET /api/stocks`
- **Description**: Returns the latest list of simulated or FMP-fetched stocks.
- **Response**: Array of stock objects matching `STOCK_UPDATE` payload.

#### `GET /api/indicators`
- **Description**: Returns active inflation, interest rates, and expected benchmarks.
- **Response**: Matches `MARKET_INDICATORS` payload.

#### `GET /api/news`
- **Description**: Fetches top business news headlines.
- **Response**: Array of news articles matching `NEWS_UPDATE` payload.

#### `GET /api/founder-image`
- **Description**: Node proxy serving AMFI credential photo. Retrieves from Google Drive CDN bypass headers or redirects to thumbnail services.
- **Response**: `binary/octet-stream` JPEG image.

#### `POST /api/calculator-chat`
- **Description**: Context-aware assistant query endpoint.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "message": "Is this a sustainable SWP withdrawal rate?",
    "calculatorType": "swp",
    "calculatorData": {
      "corpus": 1000000,
      "withdrawal": 10000,
      "rate": 10,
      "remainingBalance": 0,
      "isSustainableIndefinitely": false
    },
    "history": [
      { "role": "user", "text": "What is my SWP summary?" },
      { "role": "model", "text": "Your SWP has a ₹10 Lakh corpus, withdrawing ₹10k/month at 10% expected return." }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "text": "Based on a ₹10,000 monthly withdrawal from a ₹1,000,000 corpus, your fund will eventually deplete because the annual withdrawal (12%) exceeds the expected growth rate (10%)..."
  }
  ```

---

## 🤖 AI Safety & Compliance Framework

The conversational engine in `/api/calculator-chat` is structured to adhere to strict SEBI (Securities and Exchange Board of India) and AMFI (Association of Mutual Funds in India) distribution rules:

```
                  [ User Input Message + Active Calculator Context ]
                                         │
                                         ▼
                     [ Prompt Engineering Compliance Filter ]
     ┌───────────────────────────────────┼───────────────────────────────────┐
     │                                   │                                   │
  [ Rule 1: No Fund Names ]    [ Rule 2: No Guaranteed Return ]    [ Rule 3: Add Risk Warnings ]
     │                                   │                                   │
     └───────────────────────────────────┼───────────────────────────────────┘
                                         ▼
                       [ Check GEMINI_API_KEY Presence ]
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
             [ Key Present ]                            [ Key Missing ]
                   │                                           │
         [ Call Google GenAI SDK ]                  [ Fallback Heuristic Engine ]
    (model: gemini-3.5-flash (medium))         (Deterministic Keyword Regex System)
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         ▼
                             [ Compliance Disclaimer ]
                 "These are estimates based on assumed constant returns..."
                                         │
                                         ▼
                            [ JSON Response Payload ]
```

### Prompt Constraints
The System Instruction guarantees that:
- **No Specific Product Recommendations**: The assistant does not mention mutual fund names, stock tickers, or specific financial instruments.
- **Disclaimers Mandatory**: Every growth projection is qualified with: *"These are estimates based on assumed constant returns. Actual market returns vary."*
- **No Performance Guarantees**: Return rates are treated strictly as variable inputs, not static outcomes.
- **Redirection**: Personalised financial advice queries trigger a prompt response: *"For personalised advice, connect with a SEBI-registered financial advisor."*

### Heuristic Fallback Engine
If the `GEMINI_API_KEY` is not set, a local keyword-matching algorithm parses the inputs:
- Payout queries trigger a structured math audit evaluating if the monthly SWP withdrawal is $\le \text{Corpus} \times \frac{r}{12}$.
- Compounding queries trigger a breakdown explaining the compounding curve multiplier effect.
- General index return requests output historic Large-cap (Nifty 50: ~13% CAGR) and Midcap (~16% CAGR) baselines for user context.

---

## 📂 Codebase Directory Structure

```
.
├── server.ts                 # Main Express server, WebSocket engine, and API routes
├── package.json              # Dependencies, build configs, and CLI scripts
├── tsconfig.json             # Compiler rules for TypeScript
├── vite.config.ts            # Bundler configuration and Tailwind CSS integration
├── vercel.json               # Serverless settings for Vercel deployment
├── .env.example              # Environment variables template
├── index.html                # Main entry HTML document for Vite
└── src
    ├── main.tsx              # React mounting root
    ├── App.tsx               # Client state manager and navigation router
    ├── index.css             # Tailwind global style directives and UI variables
    ├── components
    │   ├── About.tsx         # Founder credential cards, bio, and AMFI certifications
    │   ├── BentoHub.tsx      # Responsive Bento Grid navigation dashboard
    │   ├── CalculatorAIAssistant.tsx # Embedded Gemini Chat sidebar widget
    │   ├── Calculators.tsx   # Sliders, calculations, and tables for SIP/SWP/Goal
    │   ├── Contact.tsx       # WhatsApp form layout and parsing logic
    │   ├── FinauraLogo.tsx   # Custom vector branding emblem
    │   ├── Footer.tsx        # Dynamic footer with disclaimers and navigation links
    │   ├── Hero.tsx          # Marketing splash header and value proposition
    │   ├── HeroBackground.tsx# Visual background canvas / decorative components
    │   ├── MarketTicker.tsx  # WebSocket live market price ticker bar
    │   ├── Navbar.tsx        # Responsive client navbar header
    │   ├── NewsFeed.tsx      # WebSocket business news feed container
    │   ├── PartnerLoginModal.tsx # Login overlay shortcut for the EWA Desk Portal
    │   ├── Services.tsx      # Services component managing state between Calculators and Bento
    │   └── WhatsAppButton.tsx# Persistent floating button for quick WhatsApp access
    ├── hooks                 # Custom React utility hooks
    └── lib                   # Constants, helper functions, and shared configs
```

---

## 🛠️ Getting Started & Local Setup

### ⚙️ Environment Variables
The application's runtime behavior changes dynamically depending on the configured API keys in the `.env` file:

| Variable | Source | Required For | Fallback Behavior |
| :--- | :--- | :--- | :--- |
| `FINANCIAL_API_KEY` | [Financial Modeling Prep](https://financialmodelingprep.com/) | Real-time stock prices & economic indicators | Simulated stock random walk & economic parameters |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/) | Interactive Calculator Chat Assistant | Deterministic local rule engine (SIP, SWP, FD advice) |

### 🚀 Running the App Locally

1. **Clone the Repository**:
   ```bash
   git clone <your-repository-url>
   cd finaura-capital
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the project root based on the template:
   ```bash
   cp .env.example .env
   ```
   Add your respective `FINANCIAL_API_KEY` and `GEMINI_API_KEY` keys.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Verify TypeScript & Build Integrity**:
   - Run type-checking linter:
     ```bash
     npm run lint
     ```
   - Compile the static Vite client:
     ```bash
     npm run build
     ```

5. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   This compiles and mounts the Vite frontend middleware alongside the Express server, running on **`http://localhost:3000`**.

---

## ⚖️ Regulatory Compliance & Disclaimers

> [!WARNING]
> **Mutual Fund Disclaimer**: Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not an indicator of future returns.

> [!IMPORTANT]
> **Regulatory Information**: FinAura Capital operates as an authorized mutual fund distributor under the Association of Mutual Funds in India (AMFI) Guidelines.
> - **AMFI Registration Number (ARN):** ARN-353581
> - **NJ Wealth Partner Code:** 103924
> - **Principal Distributor Representative:** NISM Series V-A Certified Partner, Shubham Dalvi
> - **Client EWA Platform Provider:** NJ Wealth Desk (Link verified at [p.njw.bz/103924](http://p.njw.bz/103924))

---
*FinAura Capital — Systematically Compounding and Defending Your Hard-Earned Wealth.*
