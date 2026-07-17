import React, { useEffect, useRef, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  Brain,
  Database,
  Network,
  Search,
  Zap,
  Layers,
  Server,
  Shield,
  ChevronRight,
  CheckCircle2,
  Star,
  Quote,
  Plus,
  Minus,
  Facebook,
  Youtube,
  Linkedin } from
'lucide-react';
import { useSmoothScroll } from '../components/hooks/useSmoothScroll';

function PinterestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.5a9.5 9.5 0 0 0-3.47 17.82c-.06-.54-.12-1.37.02-1.96l1.12-4.77s-.29-.58-.29-1.43c0-1.34.78-2.34 1.76-2.34.83 0 1.23.62 1.23 1.37 0 .83-.53 2.07-.8 3.22-.23.96.48 1.74 1.43 1.74 1.71 0 3.03-1.8 3.03-4.39 0-2.29-1.64-3.89-3.98-3.89-2.71 0-4.3 2.03-4.3 4.13 0 .82.31 1.7.7 2.18.08.1.09.19.06.29l-.26 1.06c-.04.17-.14.21-.32.13-1.2-.56-1.84-2.3-1.84-3.69 0-3.01 2.19-5.77 6.3-5.77 3.31 0 5.88 2.36 5.88 5.51 0 3.29-2.08 5.94-4.97 5.94-0.97 0-1.89-.5-2.2-1.1l-.6 2.29c-.22.84-.8 1.9-1.2 2.54A9.5 9.5 0 1 0 12 2.5Z" />
    </svg>
  );
}
import { ParticleField } from '../components/shared/ParticleField';
import heroVideo from '../Assets/hero.mp4';
import {
  PrimaryButton,
  SecondaryButton,
  Reveal,
  NvidiaChip,
  PillBadge } from
'../components/shared/ui';
import { Navbar } from '../components/shared/Navbar';
import { Pipeline } from '../components/shared/Pipeline';
import { DemoModal } from '../components/shared/DemoModal';
import persistenceSvg from '../Assets/persistence.svg';
import contextSvg from '../Assets/context.svg';
import knowledgeSvg from '../Assets/knowledge.svg';
import retrievalSvg from '../Assets/retrieval.svg';
import agentsSvg from '../Assets/agents.svg';
import knowledgeSystemsSvg from '../Assets/knowledgeSystems.svg';
import aiSvg from '../Assets/AI.svg';
import knowledgeRetrievalSvg from '../Assets/KnowledgeRetrieval.svg';
import contextualLayerSvg from '../Assets/ContextualLayer.svg';
import knowledgeGraphSvg from '../Assets/KnowledgeGraph.svg';
import dashboardSvg from '../Assets/15.svg';
import visualizeVideo from '../Assets/visualize.mp4';
import visualizeSvg from '../Assets/17.svg';
import sarahSvg from '../Assets/sarah.svg';
import logoSvg from '../Assets/logo.svg';
import marcusSvg from '../Assets/marcus.svg';
import priyaSvg from '../Assets/priya.svg';
export function LandingPage() {
  useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const [demoOpen, setDemoOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [contactSent, setContactSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const contactTimeoutRef = useRef<number | null>(null);
  const contactFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    return () => {
      if (contactTimeoutRef.current !== null) {
        window.clearTimeout(contactTimeoutRef.current);
      }
    };
  }, []);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setContactSent(true);

    if (contactTimeoutRef.current !== null) {
      window.clearTimeout(contactTimeoutRef.current);
    }

    contactTimeoutRef.current = window.setTimeout(() => {
      setContactSent(false);
      if (contactFormRef.current) {
        contactFormRef.current.reset();
      }
      setSubmitting(false);
      contactTimeoutRef.current = null;
    }, 4000);

    try {
      const response = await fetch('https://formspree.io/f/mrenbdoo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Form submission failed (${response.status})`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const plans = [
    {
      name: 'Starter',
      desc: 'A lightweight way to start giving your AI persistent memory with flexible usage-based pricing.',
      monthly: '$39',
      yearly: '$31',
      period: '/mo',
      cta: 'Start Free',
      checkoutUrls: {
        monthly: 'https://buy.stripe.com/test_8x28wOfRUftV6f96o18Ra00',
        yearly: 'https://buy.stripe.com/test_fZu28q214bdF5b5bIl8Ra01',
      },
      features: ['Up to 100k memories', 'Basic semantic retrieval', 'Email support'],
      buttonClass: 'bg-slate-950 text-white hover:bg-slate-900 shadow-lg shadow-slate-950/20'
    },
    {
      name: 'Team',
      desc: 'For product teams shipping copilots and agents across shared workflows.',
      monthly: '$89',
      yearly: '$71',
      period: '/mo',
      cta: 'Start Free Trial',
      checkoutUrls: {
        monthly: 'https://buy.stripe.com/test_8x24gy35895x1YTdQt8Ra02',
        yearly: 'https://buy.stripe.com/test_3cIcN4cFI2H9cDx7s58Ra03',
      },
      popular: true,
      features: ['Unlimited projects', 'Shared workspace access', 'Advanced analytics'],
      buttonClass: 'bg-rg-gradient-bg text-white hover:opacity-90'
    },
    {
      name: 'Enterprise',
      desc: 'For regulated organizations that need private deployment, custom controls, and SLAs.',
      monthly: 'Custom',
      yearly: 'Custom',
      period: '',
      cta: 'Contact Sales',
      features: ['Private deployment', 'Custom SLAs', 'Security reviews'],
      buttonClass: 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-600/20'
    }
  ];
  
  useEffect(() => {
    const handleHashScroll = () => {
      const sectionId = window.location.hash.replace('#', '');
      if (!sectionId) return;

      const target = document.getElementById(sectionId);
      if (target) {
        window.setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);

  useEffect(() => {
    // Initialize Tawk.to script
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = 'https://embed.tawk.to/6a5619ce03ec7a1d4cd00ce6/1jtg59kij';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);
    
    const cleanupChat = () => {
      document.querySelectorAll('[id*="tawk"], [class*="tawk"], iframe[src*="tawk.to"], script[src*="tawk.to"]').forEach((node) => node.remove());
      const tawkScript = document.getElementById('tawk-script');
      if (tawkScript) tawkScript.remove();
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }
      if (window.Tawk_LoadStart) {
        delete window.Tawk_LoadStart;
      }
    };

    const interval = window.setInterval(cleanupChat, 250);

    return () => {
      cleanupChat();
      window.clearInterval(interval);
    };
  }, []);
  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-rg-blue/20">
      <ParticleField density={80} opacity={0.6} />
      <Navbar variant="landing" />

      <main className="relative z-10 pb-20">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-10 pb-24 lg:pt-20 lg:pb-32 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <Reveal>
              <PillBadge className="mb-6">
                Enterprise AI Memory Infrastructure
              </PillBadge>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-rg-heading rg-tighter leading-[1.1] mb-6">
                Semantic Knowledge Retrieval for{' '}
                <span className="rg-gradient-text">
                  Enterprise AI Applications
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-rg-body mb-8 max-w-2xl mx-auto lg:mx-0">
                Enable continuity, personalization, and long-term reasoning with vector memory storage, contextual linking, and semantic recall infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <PrimaryButton
                  onClick={() => setDemoOpen(true)}
                  className="w-full sm:w-auto text-base py-3.5 px-8">
                  
                  Request Demo
                </PrimaryButton>
                <Link to="/product" className="w-full sm:w-auto">
                  <SecondaryButton className="w-full text-base py-3.5 px-8">
                    Cortex v2.0
                  </SecondaryButton>
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) =>
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-rg-bg bg-white/80 backdrop-blur flex items-center justify-center overflow-hidden">
                    
                      <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="Avatar"
                      className="w-full h-full object-cover" />
                    
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-rg-body">
                  Trusted by 500+ engineering teams
                </span>
              </div>
            </Reveal>
          </div>

          <div className="flex-1 relative w-full h-[400px] lg:h-[600px]">
            <motion.div
              style={{
                y: y1
              }}
              className="absolute inset-0">
              
              <video autoPlay muted loop className="w-full h-full object-cover rounded-2xl" src={heroVideo} />
            </motion.div>

            <motion.div
              style={{
                y: y2
              }}
              className="absolute top-10 -right-4 lg:-right-12 rg-glass-strong rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              
              <div className="w-12 h-12 rounded-full bg-rg-blue/10 flex items-center justify-center text-rg-blue">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-rg-heading">10M+</div>
                <div className="text-xs font-medium text-rg-body uppercase tracking-wider">
                  Memories Indexed
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                y: y1
              }}
              className="absolute bottom-32 -right-2 lg:-right-8 rg-glass-strong rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              
              <div className="w-12 h-12 rounded-full bg-rg-cyan/10 flex items-center justify-center text-rg-cyan">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-rg-heading">99.97%</div>
                <div className="text-xs font-medium text-rg-body uppercase tracking-wider">
                  Retrieval Accuracy
                </div>
              </div>
            </motion.div>

            <motion.div className="absolute bottom-10 left-0 lg:-left-10 rg-glass rounded-full px-5 py-2.5 flex items-center gap-2 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-rg-violet animate-pulse" />
              <span className="text-sm font-semibold text-rg-heading">
                500+ Enterprises · 40+ Countries
              </span>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="problem" className="max-w-7xl mx-auto px-6 py-24">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-rg-heading rg-tight mb-4">
              AI systems forget everything.
            </h2>
            <p className="text-lg text-rg-body max-w-2xl mx-auto">
              Without a persistent memory layer, your AI agents are trapped in a
              goldfish bowl.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
            {
              icon: Brain,
              text: 'No persistence across sessions'
            },
            {
              icon: Layers,
              text: 'Context lost across workflows'
            },
            {
              icon: Network,
              text: 'Knowledge fragmented across tools'
            },
            {
              icon: Search,
              text: 'Retrieval is slow or inaccurate'
            },
            {
              icon: Shield,
              text: 'Agents lose consistent understanding'
            },
            {
              icon: Server,
              text: "Knowledge systems aren't unified"
            }].
            map((item, i) =>
            <Reveal key={i} delay={i * 0.1}>
                <div className="rg-glass rounded-3xl p-8 h-full flex flex-col items-center text-center hover:rg-glass-strong transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`rounded-2xl bg-white/60 flex items-center justify-center text-rg-heading mb-6 shadow-sm ${i === 0 ? 'w-20 h-20' : 'w-14 h-14'}`}>
                    {i === 0 && (
                      <img src={persistenceSvg} alt="Persistence" className="w-14 h-14" />
                    )}
                    {i === 1 && (
                      <img src={contextSvg} alt="Context" className="w-10 h-10" />
                    )}
                    {i === 2 && (
                      <img src={knowledgeSvg} alt="Knowledge" className="w-10 h-10" />
                    )}
                    {i === 3 && (
                      <img src={retrievalSvg} alt="Retrieval" className="w-10 h-10" />
                    )}
                    {i === 4 && (
                      <img src={agentsSvg} alt="Agents" className="w-10 h-10" />
                    )}
                    {i === 5 && (
                      <img src={knowledgeSystemsSvg} alt="Knowledge Systems" className="w-10 h-10" />
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-rg-heading">
                    {item.text}
                  </h3>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* Solution Section */}
        <section id="overview" className="max-w-7xl mx-auto px-6 py-24">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-rg-heading rg-tight mb-4">
              The Unified AI Memory Layer
            </h2>
            <p className="text-lg text-rg-body max-w-2xl mx-auto">
              RecallsGrid provides the complete infrastructure to give your AI
              persistent, accurate, and scalable memory.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {[
            {
              col: 'lg:col-span-8',
              title: 'AI Memory Engine',
              icon: Database,
              color: 'text-rg-blue',
              bullets: [
              'Stores structured and unstructured knowledge',
              'Maintains long-term contextual memory',
              'Enables persistent learning across sessions']

            },
            {
              col: 'lg:col-span-4',
              title: 'Knowledge Retrieval',
              icon: Search,
              color: 'text-rg-cyan',
              bullets: [
              'Semantic search',
              'Vector similarity',
              'Enhances accuracy']

            },
            {
              col: 'lg:col-span-4',
              title: 'Contextual Layer',
              icon: Layers,
              color: 'text-rg-violet',
              bullets: [
              'Maintains context',
              'Links knowledge',
              'Dynamic relationships']

            },
            {
              col: 'lg:col-span-4',
              title: 'Knowledge Graph',
              icon: Network,
              color: 'text-rg-heading',
              bullets: [
              'Structures enterprise data',
              'Maps entity relations',
              'Improves reasoning']

            },
            {
              col: 'lg:col-span-4',
              title: 'Memory Dashboard',
              icon: Server,
              color: 'text-rg-blue',
              bullets: [
              'Displays memory clusters',
              'Tracks usage patterns',
              'Monitors performance']

            }].
            map((item, i) =>
            <Reveal key={i} delay={i * 0.1} className={item.col}>
                <motion.div
                whileHover={{
                  scale: 1.02,
                  rotateX: 2,
                  rotateY: 2
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
                className="rg-glass rounded-3xl p-8 h-full flex flex-col"
                style={{
                  perspective: 1000
                }}>
                
                  <div
                  className={`w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center ${item.color} mb-6 shadow-sm`}>
                  
                    {i === 0 && <img src={aiSvg} alt="AI Memory Engine" className="w-10 h-10" />}
                    {i === 1 && <img src={knowledgeRetrievalSvg} alt="Knowledge Retrieval" className="w-10 h-10" />}
                    {i === 2 && <img src={contextualLayerSvg} alt="Contextual Layer" className="w-10 h-10" />}
                    {i === 3 && <img src={knowledgeGraphSvg} alt="Knowledge Graph" className="w-10 h-10" />}
                    {i === 4 && <img src={dashboardSvg} alt="Memory Dashboard" className="w-10 h-10" />}
                  </div>
                  <h3 className="text-xl font-bold text-rg-heading mb-4">
                    {item.title}
                  </h3>
                  <ul className="space-y-3 mt-auto">
                    {item.bullets.map((b, j) =>
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-rg-body">
                    
                        <CheckCircle2 className="w-4 h-4 text-rg-blue mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                  )}
                  </ul>
                </motion.div>
              </Reveal>
            )}
          </div>
        </section>

        {/* How it works */}
        <section
          id="memory"
          className="max-w-7xl mx-auto px-6 py-24 overflow-hidden">
          
          <Reveal className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-rg-heading rg-tight mb-2">
                How it works
              </h2>
              <p className="text-lg text-rg-body">
                The complete pipeline from raw data to semantic recall.
              </p>
            </div>
            <NvidiaChip className="mt-4 md:mt-0" />
          </Reveal>

          <Reveal>
            <div className="rg-glass rounded-3xl p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0,transparent_100%)]" />
              <div className="relative z-10">
                <Pipeline
                  steps={[
                  'Data Ingestion',
                  'Embedding & Indexing',
                  'Context Linking',
                  'Knowledge Graph Builder',
                  'Retrieval & Ranking',
                  'Semantic Recall']
                  } />
                
              </div>
            </div>
          </Reveal>
        </section>

        {/* Dashboard Teaser */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <Reveal>
            <div className="rg-glass-strong rounded-[2.5rem] p-2 shadow-2xl border border-white/60">
              <div className="bg-rg-bg/30 rounded-[2rem] overflow-hidden border border-white/40">
                <div className="h-12 bg-white/40 backdrop-blur flex items-center px-6 border-b border-white/40 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rg-heading/20" />
                    <div className="w-3 h-3 rounded-full bg-rg-heading/20" />
                    <div className="w-3 h-3 rounded-full bg-rg-heading/20" />
                  </div>
                  <div className="mx-auto bg-white/50 rounded-md px-32 py-1 text-xs text-rg-body/60 font-medium">
                    app.recallsgrid.com
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-white/20">
                  <h3 className="text-2xl lg:text-4xl font-bold text-rg-heading mb-4">
                    Visualize Your AI's Memory
                  </h3>
                  <p className="text-rg-body mb-8 max-w-xl">
                    Monitor retrieval accuracy, explore knowledge graphs, and
                    manage data sources in real-time.
                  </p>
                  <Link to="/product">
                    <PrimaryButton className="py-3 px-6">
                      Cortex v2.0 <ChevronRight className="w-4 h-4" />
                    </PrimaryButton>
                  </Link>

                  <div className="w-full max-w-4xl mt-12 grid grid-cols-3 gap-4 opacity-80 pointer-events-none">
                    <div className="col-span-2 h-48 rounded-2xl border border-white/40 overflow-hidden">
                      <video autoPlay muted loop className="w-full h-full object-cover" src={visualizeVideo} />
                    </div>
                    <div className="col-span-1 h-48 bg-white/60 rounded-2xl border border-white/40 p-4 flex items-center justify-center">
                      <img src={visualizeSvg} alt="Visualization" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Marquee */}
        <section className="py-12 overflow-hidden border-y border-white/30 bg-white/10 backdrop-blur-sm">
          <div className="flex gap-4 rg-marquee-paused w-[200%]">
            <div className="flex gap-4 rg-marquee-track">
              {[
              'AI Engineers',
              'ML Teams',
              'Enterprise Knowledge Teams',
              'AI Agent Developers',
              'SaaS AI Platforms',
              'Customer Support AI Systems',
              'Research Organizations',
              'Data Science Teams'].
              map((tag, i) =>
              <div
                key={i}
                className="rg-glass rounded-full px-6 py-3 text-sm font-bold text-rg-heading whitespace-nowrap">
                
                  {tag}
                </div>
              )}
            </div>
            <div className="flex gap-4 rg-marquee-track">
              {[
              'AI Engineers',
              'ML Teams',
              'Enterprise Knowledge Teams',
              'AI Agent Developers',
              'SaaS AI Platforms',
              'Customer Support AI Systems',
              'Research Organizations',
              'Data Science Teams'].
              map((tag, i) =>
              <div
                key={i}
                className="rg-glass rounded-full px-6 py-3 text-sm font-bold text-rg-heading whitespace-nowrap">
                
                  {tag}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl lg:text-5xl font-bold text-rg-heading rg-tight mb-4">
              Simple, scalable pricing
            </h2>
            <p className="text-lg text-rg-body max-w-2xl mx-auto">
              Pay for what your AI remembers.
            </p>
          </Reveal>

          {/* Billing period toggle */}
          <Reveal className="mb-14 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 rg-glass rounded-full p-1.5">
              {(['monthly', 'yearly'] as const).map((period) =>
              <button
                key={period}
                onClick={() => setBilling(period)}
                className={`relative z-10 rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors ${billing === period ? 'text-white' : 'text-rg-body hover:text-rg-heading'}`}>
                
                  {billing === period &&
                <motion.span
                  layoutId="billing-toggle"
                  className="absolute inset-0 -z-10 rounded-full rg-gradient-bg"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 26
                  }} />

                }
                  {period}
                  {period === 'yearly' &&
                <span
                  className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${billing === 'yearly' ? 'bg-white/25 text-white' : 'bg-rg-blue/10 text-rg-blue'}`}>
                  
                      Save 20%
                    </span>
                }
                </button>
              )}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan, i) => {
              const price = billing === 'yearly' ? plan.yearly : plan.monthly;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div
                    className={`rg-glass rounded-3xl p-8 h-full flex flex-col relative ${plan.popular ? 'ring-2 ring-rg-blue shadow-xl shadow-rg-blue/10 md:scale-105 z-10 bg-white/90' : ''}`}>
                    {plan.popular &&
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rg-blue text-white text-xs font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    }
                    <h3 className="text-xl font-bold text-rg-heading mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-rg-body mb-6 min-h-[3.2rem]">
                      {plan.desc}
                    </p>
                    <div className="mb-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-rg-heading">
                        {price}
                      </span>
                      {plan.period &&
                        <span className="text-sm font-medium text-rg-body">
                          {plan.period}
                        </span>
                      }
                    </div>
                    {plan.popular && billing === 'yearly' &&
                      <p className="-mt-2 mb-5 text-xs font-semibold text-rg-blue">
                        Billed annually · save 20%
                      </p>
                    }
                    <ul className="mb-8 space-y-3 text-sm text-rg-body">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rg-blue" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <PrimaryButton
                      onClick={() => {
                        const checkoutUrl = plan.checkoutUrls?.[billing as 'monthly' | 'yearly'];
                        if (checkoutUrl) {
                          window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
                          return;
                        }
                        setDemoOpen(true);
                      }}
                      className={`w-full mt-auto ${plan.buttonClass}`}>
                      {plan.cta}
                    </PrimaryButton>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24">
          <Reveal className="text-center mb-16">
            <PillBadge className="mb-4">Customer Stories</PillBadge>
            <h2 className="text-3xl lg:text-5xl font-bold text-rg-heading rg-tight mb-4">
              Trusted by teams building the future
            </h2>
            <p className="text-lg text-rg-body max-w-2xl mx-auto">
              Engineering leaders rely on RecallsGrid to give their AI systems
              memory that scales.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
            {
              quote:
              'RecallsGrid cut our context-loss incidents to near zero. Our agents finally remember what happened last session — it changed how our whole team ships AI.',
              name: 'Sarah Chen',
              role: 'VP of AI, NeuralStack',
              img: 12
            },
            {
              quote:
              'Retrieval accuracy jumped past 99% within a week of switching. The knowledge graph gives us reasoning we could never get from raw vector search alone.',
              name: 'Marcus Reilly',
              role: 'Head of ML, Cortexa',
              img: 33
            },
            {
              quote:
              'The unified memory layer replaced three brittle in-house systems. Onboarding a new data source now takes minutes instead of a sprint.',
              name: 'Priya Nair',
              role: 'Staff Engineer, Loopwork',
              img: 48
            }].
            map((t, i) =>
            <Reveal key={i} delay={i * 0.1}>
                <motion.div
                whileHover={{
                  y: -4
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
                className="rg-glass rounded-3xl p-8 h-full flex flex-col">
                
                  <Quote className="w-8 h-8 text-rg-blue/30 mb-4" />
                  <div className="flex gap-0.5 mb-4">
                    {[0, 1, 2, 3, 4].map((s) =>
                  <Star
                    key={s}
                    className="w-4 h-4 fill-rg-cyan text-rg-cyan" />

                  )}
                  </div>
                  <p className="text-rg-body leading-relaxed mb-6 flex-1">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    {i === 0 && <img src={sarahSvg} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-white" />}
                    {i === 1 && <img src={marcusSvg} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-white" />}
                    {i === 2 && <img src={priyaSvg} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-white" />}
                  
                    <div>
                      <div className="font-bold text-rg-heading text-sm">
                        {t.name}
                      </div>
                      <div className="text-xs text-rg-body">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
          <Reveal className="text-center mb-14">
            <PillBadge className="mb-4">FAQ</PillBadge>
            <h2 className="text-3xl lg:text-5xl font-bold text-rg-heading rg-tight mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-rg-body max-w-xl mx-auto">
              Everything you need to know about giving your AI persistent
              memory.
            </p>
          </Reveal>

          <div className="space-y-4">
            {[
            {
              q: 'What is an AI memory layer?',
              a: "It's persistent infrastructure that stores, indexes, and retrieves context across sessions — so your AI systems keep long-term knowledge instead of starting from scratch on every request."
            },
            {
              q: 'How does retrieval stay so accurate?',
              a: 'RecallsGrid combines vector-based semantic search with a structured knowledge graph, ranking results by both similarity and relationship strength to reach 99%+ accuracy.'
            },
            {
              q: 'Which frameworks and data sources are supported?',
              a: 'You can connect databases, vector stores, document repositories, CRMs, conversation logs, and more. SDKs integrate cleanly with LangChain, LlamaIndex, and custom agents.'
            },
            {
              q: 'Is my data secure and isolated?',
              a: 'Yes. Every workspace is isolated, encrypted in transit and at rest, and Enterprise plans include custom data-residency and compliance controls.'
            },
            {
              q: 'How does pricing work?',
              a: 'Starter is usage-based, Team is a flat monthly or annual subscription, and Enterprise is custom-licensed. You can switch billing periods at any time.'
            }].
            map((item, i) =>
            <Reveal key={i} delay={i * 0.05}>
                <FaqItem question={item.q} answer={item.a} />
              </Reveal>
            )}
          </div>
        </section>

             {/* DOCS / API */}
      <section id="docs" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <PillBadge>Developer API — Coming Soon</PillBadge>
            <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">Ship memory into any model in 3 lines.</h2>
            <p className="mt-3 max-w-md text-ink-soft">
              Join the waitlist and be first in when our SDK opens to the public.
            </p>
            <WaitlistForm onSubmit={() => setWaitlistOpen(true)} />
          </Reveal>
          <Reveal delay={0.15}>
            <div className="glass-card overflow-hidden p-1.5">
              <div className="flex items-center gap-2 px-4 py-2 text-xs text-ink-soft">
                <Zap size={12} className="text-brand-blue" />
                recallsgrid.ts
              </div>
              <TypingSnippet />
            </div>
          </Reveal>
        </div>
      </section>

        {/* Final CTA */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <Reveal>
            <div className="rg-gradient-bg rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-rg-blue/20">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white rg-tight mb-6">
                  Give your AI a memory that lasts.
                </h2>
                <Link to="/product">
                  <PrimaryButton className="bg-slate-950 text-white hover:bg-slate-900 shadow-xl py-4 px-10 text-lg">
                    Cortex v2.0 <ChevronRight className="w-5 h-5" />
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <section id="contact" className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <Reveal>
          <div className="rounded-[2.5rem] border border-slate-200/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="max-w-xl">
                <PillBadge className="mb-4">Contact</PillBadge>
                <h2 className="text-3xl font-bold text-rg-heading sm:text-4xl">
                  Let’s talk about your AI memory roadmap.
                </h2>
                <p className="mt-4 text-lg text-rg-body">
                  Share your goals and we’ll help you map the right memory layer, integrations, and rollout plan.
                </p>
                <div className="mt-6 space-y-3 text-sm text-rg-body">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rg-blue" />
                    <span>Fast strategy guidance for pilot and production deployments.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rg-blue" />
                    <span>Support for knowledge graph setup, retrieval tuning, and integrations.</span>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 shadow-sm min-h-[400px]">
                <AnimatePresence mode="wait">
                  {contactSent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-slate-50/95 p-6 text-center"
                    >
                      <div>
                        <div className="mb-4 text-6xl text-rg-blue">✓</div>
                        <h3 className="mb-2 text-2xl font-bold text-rg-heading">Thank You!</h3>
                        <p className="text-rg-body">
                          We've received your message and will get back to you soon.
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <form
                  ref={contactFormRef}
                  onSubmit={handleContactSubmit}
                  className={`grid gap-4 w-full transition-opacity duration-200 ${contactSent ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
                >
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-rg-blue focus:ring-2 focus:ring-rg-blue/20"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Work email"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-rg-blue focus:ring-2 focus:ring-rg-blue/20"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-rg-blue focus:ring-2 focus:ring-rg-blue/20"
                  />
                  <textarea
                    rows={4}
                    name="message"
                    required
                    placeholder="Tell us about your AI memory use case"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-rg-blue focus:ring-2 focus:ring-rg-blue/20"
                  />
                  <PrimaryButton
                    type="submit"
                    className="w-full justify-center py-3.5"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending…' : 'Send message'}
                  </PrimaryButton>
                </form>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-7xl px-6 pb-10 lg:px-10">
        <div className="rounded-[2.5rem] bg-white/85 border border-slate-200/70 p-8 lg:p-12 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <img src={logoSvg} alt="RecallsGrid" className="h-32 w-32 mb-3" />
              <p className="mt-4 max-w-xs text-sm text-slate-500">
                The persistent memory layer for enterprise AI.
              </p>
            </div>
            <FooterCol title="Product" links={[{label: "Platform", href: "#overview"}, {label: "Memory Engine", href: "#memory"}, {label: "Knowledge Graph", href: "#overview"}, {label: "Pricing", href: "#pricing"}]} />
            <FooterCol title="Company" links={[{label: "About", href: "#problem"}, {label: "Careers", href: "#pricing"}, {label: "Contact", href: "#contact"}]} />
            <FooterCol title="Legal" links={[{label: "Privacy", href: "/privacy-policy"}, {label: "Terms", href: "/terms"}]} />
          </div>
          <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-200/70 pt-6 sm:flex-row">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} RecallsGrid. All rights reserved.</p>
            <div className="flex items-center gap-4 text-slate-500">
              {[
                { icon: Facebook, href: 'https://www.facebook.com/recallsgrid' },
                { icon: Youtube, href: 'https://www.youtube.com/@recallsgrid' },
                { icon: PinterestIcon, href: 'https://www.pinterest.com/recallsgrid/' },
                { icon: Linkedin, href: '' },
              ].map((item, i) => {
                const I = item.icon;
                const label = item.href.includes('pinterest') ? 'Pinterest' : item.href.includes('youtube') ? 'YouTube' : item.href === '' ? 'LinkedIn' : 'Facebook';
                return (
                  <a key={i} href={item.href} target={item.href ? '_blank' : undefined} rel={item.href ? 'noreferrer' : undefined} aria-label={label} title={label} className="rounded-full border border-slate-200/70 bg-white/80 p-2 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-950">
                    <I size={16} />
                  </a>
                );
              })}
              
            </div>
          </div>
        </div>
      </footer>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <DemoModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        variant="email"
        title="Join the API Waitlist"
        subtitle="Be the first to get access to our developer SDKs."
        cta="Join Waitlist" />
      
    </div>);

}
function FaqItem({ question, answer }: {question: string;answer: string;}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rg-glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
        
        <span className="text-base font-semibold text-rg-heading">
          {question}
        </span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rg-blue/10 text-rg-blue">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open &&
        <motion.div
          initial={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: 'auto',
            opacity: 1
          }}
          exit={{
            height: 0,
            opacity: 0
          }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="overflow-hidden">
          
            <p className="px-6 pb-5 text-rg-body leading-relaxed">{answer}</p>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
const SNIPPET_LINES = [
{
  text: 'import { RecallsGrid } from "recallsgrid"',
  cls: 'text-cyan-300'
},
{
  text: '',
  cls: ''
},
{
  text: 'const memory = new RecallsGrid(API_KEY)',
  cls: 'text-blue-300'
},
{
  text: '',
  cls: ''
},
{
  text: '// Store context across sessions',
  cls: 'text-slate-500'
},
{
  text: 'await memory.store(sessionId, data)',
  cls: 'text-blue-300'
},
{
  text: '',
  cls: ''
},
{
  text: '// Retrieve the most relevant memory',
  cls: 'text-slate-500'
},
{
  text: 'const context = await memory.recall(query)',
  cls: 'text-blue-300'
}];

function TypingSnippet() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charCount, setCharCount] = useState(0);
  useEffect(() => {
    if (visibleLines >= SNIPPET_LINES.length) {
      const reset = setTimeout(() => {
        setVisibleLines(0);
        setCharCount(0);
      }, 2600);
      return () => clearTimeout(reset);
    }
    const current = SNIPPET_LINES[visibleLines].text;
    if (charCount < current.length) {
      const t = setTimeout(() => setCharCount((c) => c + 1), 22);
      return () => clearTimeout(t);
    }
    const next = setTimeout(
      () => {
        setVisibleLines((l) => l + 1);
        setCharCount(0);
      },
      current.length === 0 ? 120 : 260
    );
    return () => clearTimeout(next);
  }, [visibleLines, charCount]);
  return (
    <div className="relative flex h-[360px] w-full flex-col overflow-hidden rounded-2xl bg-[#0f1729] p-6 pt-12 shadow-2xl sm:h-[430px]">
      <div className="absolute top-0 left-0 w-full h-8 bg-white/10 flex items-center px-4 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
      </div>
      <pre className="h-full overflow-x-auto overflow-y-hidden text-[13px] leading-6 font-mono">
        <code>
          {SNIPPET_LINES.map((line, i) => {
            if (i > visibleLines) return null;
            const shown =
            i < visibleLines ? line.text : line.text.slice(0, charCount);
            return (
              <div key={i} className={line.cls || 'text-slate-300'}>
                {shown || '\u00A0'}
                {i === visibleLines &&
                <span className="inline-block w-1.5 h-4 -mb-0.5 bg-rg-cyan animate-pulse" />
                }
              </div>);

          })}
        </code>
      </pre>
    </div>);

}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setOk(true);
      }}
      className="mt-6 flex max-w-md items-center gap-2 rounded-full border border-white/70 bg-white/80 p-1 pl-5 backdrop-blur"
    >
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-soft/60"
      />
      <AnimatePresence mode="wait">
        <motion.button
          key={ok ? "ok" : "join"}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          type="submit"
          className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
        >
          {ok ? "You're on the list ✓" : "Join the Waitlist"}
        </motion.button>
      </AnimatePresence>
    </form>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<{label: string; href: string}> }) {
  function scrollToSection(sectionId: string) {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${sectionId}`);
      return;
    }
    window.location.hash = sectionId;
  }

  return (
    <div>
      <div className="text-sm font-bold text-ink">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map((l) => {
          const isRouteLink = l.href.startsWith('/') && !l.href.startsWith('//');
          if (isRouteLink) {
            return (
              <li key={l.label}>
                <Link to={l.href} className="text-sm text-ink-soft transition hover:text-ink">
                  {l.label}
                </Link>
              </li>
            );
          }

          return (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={(e) => {
                  if (l.href.startsWith('#')) {
                    e.preventDefault();
                    scrollToSection(l.href.slice(1));
                  }
                }}
                className="text-sm text-ink-soft transition hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

