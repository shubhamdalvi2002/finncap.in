import React from 'react';
import { motion } from 'motion/react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-bg-dark-3 border border-gold/20 rounded-[18px] p-10 shadow-2xl relative z-10">
            <h3 className="font-serif text-2xl text-gold font-bold mb-6">Why FinAura Capital?</h3>
            <ul className="flex flex-col gap-4">
              <AboutPoint>Personalised investment strategies aligned with your life goals</AboutPoint>
              <AboutPoint>Transparent advisory — no hidden charges, no conflicts</AboutPoint>
              <AboutPoint>End-to-end support from onboarding to portfolio review</AboutPoint>
              <AboutPoint>Access to top-performing funds and market instruments</AboutPoint>
              <AboutPoint>Regular performance tracking and rebalancing guidance</AboutPoint>
              <AboutPoint>Trusted platform partnership for seamless online investing</AboutPoint>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-[0.72rem] tracking-[0.14em] uppercase text-gold mb-2">About Us</div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">Empowering You to Make Smarter Financial Decisions</h2>
          <p className="text-muted-foreground font-light leading-relaxed mb-6">
            At FinAura Capital, we believe wealth creation is not just for the privileged few — it's for everyone with a plan. We bring together financial expertise and a client-first approach to guide you through every stage of your investment journey.
          </p>
          <p className="text-muted-foreground font-light leading-relaxed mb-10">
            Whether you're just starting out with your first SIP or looking to optimise a large corpus, our team is here to simplify complexity and help your money work harder for you.
          </p>
          <a href="#contact" className="bg-gold text-bg-dark px-8 py-3.5 rounded-full font-medium hover:bg-gold-light transition-all">
            Talk to Us Today
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const AboutPoint = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
    <span className="text-gold text-[0.6rem] mt-1.5 flex-shrink-0">◆</span>
    {children}
  </li>
);
