import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin } from 'lucide-react';
import logoSvg from '../../Assets/logo.svg';

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
              <a href="#" className="hover:text-rg-heading transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-rg-heading transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-rg-heading transition-colors">
                <Linkedin className="w-5 h-5" />
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
            <h4 className="font-bold text-rg-heading mb-4 text-sm">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-rg-body">
              <li>
                <a href="#pricing" className="hover:text-rg-heading transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-rg-heading mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-rg-body">
              <li>
                <a href="#overview" className="hover:text-rg-heading transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-rg-heading transition-colors">
                  Terms
                </a>
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