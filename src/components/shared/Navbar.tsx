import React, { useEffect, useState, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SearchIcon,
  BellIcon,
  LogOutIcon,
  UserIcon,
  MenuIcon,
  XIcon } from
'lucide-react';
import { PrimaryButton } from './ui';
import { DemoModal } from './DemoModal';
import logoSvg from '../../Assets/logo.svg';
const LANDING_LINKS = [
{
  label: 'Platform',
  href: '#overview'
},
{
  label: 'Memory Engine',
  href: '#memory'
},
{
  label: 'Knowledge Graph',
  href: '#overview'
},
{
  label: 'Pricing',
  href: '#pricing'
}];

const NOTIFICATIONS = [
{
  title: 'New memory cluster indexed',
  time: '2 min ago',
  body: '48,210 vectors added to Product Specs.'
},
{
  title: 'Retrieval accuracy improved',
  time: '1 hr ago',
  body: 'Ranking model v3.2 raised accuracy to 99.97%.'
},
{
  title: 'Data source connected',
  time: '3 hrs ago',
  body: 'Slack Workspace is now syncing.'
}];

interface NavbarProps {
  variant?: 'landing' | 'dashboard';
  /** dashboard: value for the top-bar search input */
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  onConnectSource?: () => void;
}
export function Navbar({
  variant = 'landing',
  searchValue = '',
  onSearchChange,
  onConnectSource
}: NavbarProps) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isProductPage = location.pathname === '/product';
  const landingCtaLabel = isProductPage ? 'launch dashbord' : 'Cortex v2.0';
  const landingCtaTo = isProductPage ? '/dashboard' : '/product';
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const close = () => {
      setNotifOpen(false);
      setAvatarOpen(false);
    };
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);
  const glass = variant === 'dashboard' || scrolled;
  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${glass ? 'border-b border-white/40 bg-white/70 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}>
        
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-rg-heading">
            
            <img src={logoSvg} alt="RecallsGrid" className="h-32 w-32" />
          </Link>

          {variant === 'landing' ?
          <>
              <nav className="hidden items-center gap-6 text-sm font-medium text-rg-body lg:flex">
                {LANDING_LINKS.map((l) =>
              l.to ?
              <Link
                key={l.label}
                to={l.to}
                className="transition-colors hover:text-rg-heading">
                
                      {l.label}
                    </Link> :

              <a
                key={l.label}
                href={l.href}
                className="transition-colors hover:text-rg-heading">
                
                      {l.label}
                    </a>

              )}
              </nav>
              <div className="hidden lg:flex">
                <Link to={landingCtaTo}>
                  <PrimaryButton className="px-4 py-2 text-xs">
                    {landingCtaLabel}
                  </PrimaryButton>
                </Link>
              </div>
              <button
              className="rounded-lg p-2 text-rg-heading lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu">
              
                {mobileOpen ?
              <XIcon className="h-5 w-5" /> :

              <MenuIcon className="h-5 w-5" />
              }
              </button>
            </> :

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
              <div className="relative hidden w-40 sm:block md:w-64">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rg-body/50" />
                <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search memories..."
                className="w-full rounded-full border border-white/60 bg-white/50 py-1.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-rg-blue/30" />
              
              </div>
              <PrimaryButton
              onClick={onConnectSource}
              className="px-4 py-2 text-xs">
              
                Connect Source
              </PrimaryButton>

              {/* notifications */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setAvatarOpen(false);
                }}
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/50 text-rg-heading transition-colors hover:bg-white">
                
                  <BellIcon className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full rg-gradient-bg" />
                </button>
                <AnimatePresence>
                  {notifOpen &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.97
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.97
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 24
                  }}
                  className="rg-glass-strong absolute right-0 top-12 w-72 rounded-2xl p-2">
                  
                      <div className="px-3 py-2 text-sm font-bold text-rg-heading">
                        Notifications
                      </div>
                      {NOTIFICATIONS.map((n) =>
                  <div
                    key={n.title}
                    className="rounded-xl px-3 py-2.5 hover:bg-rg-heading/5">
                    
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-rg-heading">
                              {n.title}
                            </span>
                            <span className="text-[11px] text-rg-body/70">
                              {n.time}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-rg-body">
                            {n.body}
                          </p>
                        </div>
                  )}
                    </motion.div>
                }
                </AnimatePresence>
              </div>

              {/* avatar */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                onClick={() => {
                  setAvatarOpen((v) => !v);
                  setNotifOpen(false);
                }}
                aria-label="Account menu"
                className="flex h-9 w-9 items-center justify-center rounded-full rg-gradient-bg text-xs font-bold text-white">
                
                  AL
                </button>
                <AnimatePresence>
                  {avatarOpen &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.97
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.97
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 24
                  }}
                  className="rg-glass-strong absolute right-0 top-12 w-48 rounded-2xl p-2">
                  
                      <div className="border-b border-white/40 px-3 py-2">
                        <div className="text-sm font-semibold text-rg-heading">
                          Ada Lovelace
                        </div>
                        <div className="text-xs text-rg-body">
                          ada@recallsgrid.com
                        </div>
                      </div>
                      <button className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rg-heading hover:bg-rg-heading/5">
                        <UserIcon className="h-4 w-4" /> Profile
                      </button>
                      <Link
                    to="/"
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rg-heading hover:bg-rg-heading/5">
                    
                        <LogOutIcon className="h-4 w-4" /> Log out
                      </Link>
                    </motion.div>
                }
                </AnimatePresence>
              </div>
            </div>
          }
        </div>

        {/* mobile landing menu */}
        <AnimatePresence>
          {variant === 'landing' && mobileOpen &&
          <motion.div
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: 'auto'
            }}
            exit={{
              opacity: 0,
              height: 0
            }}
            className="overflow-hidden border-t border-white/40 bg-white/80 backdrop-blur-md lg:hidden">
            
              <div className="flex flex-col gap-1 px-6 py-4">
                {LANDING_LINKS.map((l) =>
              l.to ?
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-rg-heading hover:bg-rg-heading/5">
                
                      {l.label}
                    </Link> :

              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-rg-heading hover:bg-rg-heading/5">
                
                      {l.label}
                    </a>

              )}
                <PrimaryButton
                onClick={() => {
                  setMobileOpen(false);
                  setDemoOpen(true);
                }}
                className="mt-2">
                
                  Request Demo
                </PrimaryButton>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </header>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>);

}