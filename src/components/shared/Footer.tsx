import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube } from 'lucide-react';
import logoSvg from '../../Assets/logo.svg';

function PinterestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.5a9.5 9.5 0 0 0-3.47 17.82c-.06-.54-.12-1.37.02-1.96l1.12-4.77s-.29-.58-.29-1.43c0-1.34.78-2.34 1.76-2.34.83 0 1.23.62 1.23 1.37 0 .83-.53 2.07-.8 3.22-.23.96.48 1.74 1.43 1.74 1.71 0 3.03-1.8 3.03-4.39 0-2.29-1.64-3.89-3.98-3.89-2.71 0-4.3 2.03-4.3 4.13 0 .82.31 1.7.7 2.18.08.1.09.19.06.29l-.26 1.06c-.04.17-.14.21-.32.13-1.2-.56-1.84-2.3-1.84-3.69 0-3.01 2.19-5.77 6.3-5.77 3.31 0 5.88 2.36 5.88 5.51 0 3.29-2.08 5.94-4.97 5.94-0.97 0-1.89-.5-2.2-1.1l-.6 2.29c-.22.84-.8 1.9-1.2 2.54A9.5 9.5 0 1 0 12 2.5Z" />
    </svg>
  );
}

function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${sectionId}`);
    return;
  }

  if (window.location.pathname !== '/') {
    window.location.href = `/#${sectionId}`;
    return;
  }

  window.location.hash = sectionId;
}

export function Footer() {
  return (
    <footer className="border-t border-white/40 bg-rg-bg/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="text-xl font-extrabold text-rg-heading tracking-tight flex items-center gap-2 mb-4">
              
              <img src={logoSvg} alt="RecallsGrid" className="h-32 w-32" />
            </Link>
            <p className="text-sm text-rg-body mb-6">
              The AI Memory & Knowledge Retrieval Platform for Persistent
              Intelligence.
            </p>
            <div className="flex items-center gap-4 text-rg-body">
              <a href="https://www.facebook.com/recallsgrid" target="_blank" rel="noreferrer" className="hover:text-rg-heading transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@recallsgrid" target="_blank" rel="noreferrer" className="hover:text-rg-heading transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.pinterest.com/recallsgrid/" target="_blank" rel="noreferrer" aria-label="Pinterest" title="Pinterest" className="hover:text-rg-heading transition-colors">
                <PinterestIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-rg-heading mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-rg-body">
              <li>
                <a href="http://localhost:5173/#overview" className="hover:text-rg-heading transition-colors">
                  Platform
                </a>
              </li>
              <li>
                <a href="http://localhost:5173/#memory" className="hover:text-rg-heading transition-colors">
                  Memory Engine
                </a>
              </li>
              <li>
                <a href="http://localhost:5173/#overview" className="hover:text-rg-heading transition-colors">
                  Knowledge Graph
                </a>
              </li>
              <li>
                <a href="http://localhost:5173/#pricing" className="hover:text-rg-heading transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-rg-heading mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-rg-body">
              <li>
                <a href="#problem" className="hover:text-rg-heading transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-rg-heading transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-rg-heading transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-rg-heading mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-rg-body">
              <li>
                <Link to="/privacy-policy" className="hover:text-rg-heading transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-rg-heading transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>


        </div>

        <div className="border-t border-white/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-rg-body">
            © {new Date().getFullYear()} RecallsGrid Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>);

}