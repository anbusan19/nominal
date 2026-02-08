
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import HowItWorks from './components/HowItWorks';
import Architecture from './components/Architecture';
import ProcessSteps from './components/ProcessSteps';
import AgentOS from './components/AgentOS';
import SetupGuide from './components/SetupGuide';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-brand-dark font-sans overflow-x-hidden selection:bg-brand-orange selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="architecture">
          <Architecture />
        </section>
        
        <section id="setup-guide">
          <SetupGuide />
        </section>
        <FAQ />
        <AgentOS />
      </main>
      <Footer />
    </div>
  );
}
