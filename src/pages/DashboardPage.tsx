import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  DatabaseIcon,
  NetworkIcon,
  SearchIcon,
  BarChart3Icon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon } from
'lucide-react';
import { useSmoothScroll } from '../components/hooks/useSmoothScroll';
import { ParticleField } from '../components/shared/ParticleField';
import { Navbar } from '../components/shared/Navbar';
import { Footer } from '../components/shared/Footer';
import { Pipeline } from '../components/shared/Pipeline';
import { NvidiaChip, Reveal } from '../components/shared/ui';
import { DataSources } from '../components/dashboard/DataSources';
import { InfraHealth } from '../components/dashboard/InfraHealth';
import { KnowledgeGraph } from '../components/dashboard/KnowledgeGraph';
import { MemoryAnalytics } from '../components/dashboard/MemoryAnalytics';
import { ActivityTable } from '../components/dashboard/ActivityTable';
import { ConnectSourceModal } from '../components/dashboard/ConnectSourceModal';
const NAV = [
{
  name: 'Overview',
  icon: LayoutDashboardIcon
},
{
  name: 'Data Sources',
  icon: DatabaseIcon
},
{
  name: 'Knowledge Graph',
  icon: NetworkIcon
},
{
  name: 'Retrieval Engine',
  icon: SearchIcon
},
{
  name: 'Analytics',
  icon: BarChart3Icon
},
{
  name: 'Settings',
  icon: SettingsIcon
}];

const PIPELINE_STEPS = [
'Memory Ingestion',
'Embedding & Indexing',
'Context Linking Engine',
'Knowledge Graph Builder',
'Retrieval & Ranking',
'Semantic Recall Engine'];

function SectionHeading({ title, sub }: {title: string;sub?: string;}) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-rg-heading rg-tight">
        {title}
      </h2>
      {sub && <p className="mt-1 text-sm text-rg-body">{sub}</p>}
    </div>);

}
export function DashboardPage() {
  useSmoothScroll();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('Overview');
  const [search, setSearch] = useState('');
  const [connectOpen, setConnectOpen] = useState(false);
  return (
    <div className="relative flex min-h-screen flex-col bg-rg-bg selection:bg-rg-blue/20">
      <ParticleField density={40} opacity={0.3} className="fixed inset-0" />

      <Navbar
        variant="dashboard"
        searchValue={search}
        onSearchChange={setSearch}
        onConnectSource={() => setConnectOpen(true)} />
      

      <div className="relative z-10 flex flex-1 pt-16">
        {/* Desktop sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: collapsed ? 76 : 248
          }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 28
          }}
          className="sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-white/40 bg-white/40 backdrop-blur-md md:flex">
          
          <div className="flex justify-end p-4">
            <button
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
              className="rounded-lg p-1.5 text-rg-body transition-colors hover:bg-white/60">
              
              {collapsed ?
              <ChevronRightIcon className="h-5 w-5" /> :

              <ChevronLeftIcon className="h-5 w-5" />
              }
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActive(item.name)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${isActive ? 'bg-white font-semibold text-rg-blue shadow-sm' : 'font-medium text-rg-body hover:bg-white/60'}`}>
                  
                  <Icon
                    className={`h-5 w-5 shrink-0 ${isActive ? 'text-rg-blue' : 'text-rg-body/70'}`} />
                  
                  {!collapsed &&
                  <span className="whitespace-nowrap">{item.name}</span>
                  }
                </button>);

            })}
          </nav>
        </motion.aside>

        {/* Main */}
        <main className="flex-1 overflow-x-hidden px-4 pb-28 pt-6 sm:px-6 md:pb-10 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold text-rg-heading rg-tight">
                {active}
              </h1>
              <div className="flex items-center gap-2 text-sm text-rg-body">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rg-nvidia" />
                All systems operational
              </div>
            </div>

            {/* 1. Data Sources */}
            <section>
              <div className="mb-5">
                <SectionHeading
                  title="Data Sources"
                  sub="Connect and manage your knowledge inputs." />
                
              </div>
              <DataSources />
            </section>

            {/* 2. AI Process Visualizer */}
            <Reveal>
              <section className="rg-glass rounded-3xl p-6 lg:p-8">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <SectionHeading title="AI Process Visualizer" />
                  <NvidiaChip />
                </div>
                <Pipeline steps={PIPELINE_STEPS} />
              </section>
            </Reveal>

            {/* 3. Infrastructure Health */}
            <section>
              <div className="mb-5">
                <SectionHeading
                  title="Infrastructure Health"
                  sub="Live platform metrics, refreshed in real time." />
                
              </div>
              <InfraHealth />
            </section>

            {/* 4. Knowledge Graph */}
            <Reveal>
              <section className="rg-glass rounded-3xl p-6 lg:p-8">
                <div className="mb-5">
                  <SectionHeading
                    title="Knowledge Graph"
                    sub="Explore entities and their relationships — drag, zoom, and click a node." />
                  
                </div>
                <KnowledgeGraph />
              </section>
            </Reveal>

            {/* 5. Memory Analytics */}
            <Reveal>
              <MemoryAnalytics />
            </Reveal>

            {/* 6. Recent Retrieval Activity */}
            <Reveal>
              <ActivityTable search={search} />
            </Reveal>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/40 bg-white/80 backdrop-blur-md md:hidden">
        {NAV.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium ${isActive ? 'text-rg-blue' : 'text-rg-body/70'}`}>
              
              <Icon className="h-5 w-5" />
              {item.name.split(' ')[0]}
            </button>);

        })}
      </nav>

      <Footer />
      <ConnectSourceModal
        open={connectOpen}
        onClose={() => setConnectOpen(false)} />
      
    </div>);

}