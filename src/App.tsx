import { Navbar } from './components/Navbar';
import { MarketTicker } from './components/MarketTicker';
import { Hero } from './components/Hero';
import { MarketUpdate } from './components/MarketUpdate';
import { Services } from './components/Services';
import { Calculators } from './components/Calculators';
import { Blog } from './components/Blog';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

export default function App() {
  return (
    <div className="min-h-screen selection:bg-gold selection:text-bg-dark">
      <Navbar />
      <MarketTicker />
      <main className="pt-[36px]">
        <Hero />
        <MarketUpdate />
        <Services />
        <Calculators />
        <Blog />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
