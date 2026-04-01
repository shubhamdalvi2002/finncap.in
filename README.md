# FinAura Capital

Premium financial advisory platform for stocks, mutual funds, and wealth management with interactive investment calculators.

## Features

- **Real-time Market Dashboard**: Live tracking of NIFTY 50, SENSEX, and major Indian stocks.
- **Interactive Financial Calculators**:
  - **SIP Calculator**: Plan your Systematic Investment Plan with market-linked returns.
  - **EMI Calculator**: Calculate monthly loan repayments with interest breakdown.
  - **Goal Calculator**: Determine how much to save to reach your target wealth.
  - **Retirement Calculator**: Plan your post-retirement corpus and monthly savings.
  - **SWP Calculator**: Manage Systematic Withdrawal Plans for regular income.
  - **STP Calculator**: Optimize Systematic Transfer Plans between debt and equity.
- **Market Insights**: Live business news and key economic indicators (Inflation, Interest Rates).
- **Responsive Design**: Premium, dark-themed UI optimized for all devices.
- **Smart Data Sync**: WebSocket support for real-time updates with automatic HTTP polling fallback for serverless environments.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, WebSocket (`ws`).
- **Data APIs**: Financial Modeling Prep (Market Data), NewsAPI (Business News).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd finaura-capital
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your API keys:
   ```env
   FINANCIAL_API_KEY=your_fmp_api_key
   ```

### Development

Run the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel

This project is pre-configured for Vercel deployment:
1. Connect your repository to Vercel.
2. Add the `FINANCIAL_API_KEY` to your Project Settings > Environment Variables.
3. Vercel will automatically detect the configuration and deploy the app.

*Note: Since Vercel serverless functions do not support persistent WebSockets, the app will automatically switch to HTTP polling (every 15 seconds) to keep data updated.*

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---
*FinAura Capital - Empowering your wealth journey with data-driven insights.*
