import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DatabaseIcon,
  BotIcon,
  FileTextIcon,
  BoxesIcon,
  Building2Icon,
  PlugIcon,
  MessagesSquareIcon,
  BookOpenIcon } from
'lucide-react';
import { Reveal } from '../shared/ui';
const SOURCES = [
{
  name: 'Enterprise Databases',
  icon: DatabaseIcon,
  connected: true
},
{
  name: 'AI Models & Agents',
  icon: BotIcon,
  connected: true
},
{
  name: 'Document Repositories',
  icon: FileTextIcon,
  connected: true
},
{
  name: 'Vector Databases',
  icon: BoxesIcon,
  connected: true
},
{
  name: 'CRM/ERP Systems',
  icon: Building2Icon,
  connected: false
},
{
  name: 'API Data Sources',
  icon: PlugIcon,
  connected: false
},
{
  name: 'Conversation Logs',
  icon: MessagesSquareIcon,
  connected: true
},
{
  name: 'Knowledge Bases',
  icon: BookOpenIcon,
  connected: false
}];

export function DataSources() {
  const [state, setState] = useState<boolean[]>(SOURCES.map((s) => s.connected));
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SOURCES.map((s, i) => {
        const connected = state[i];
        const Icon = s.icon;
        return (
          <Reveal key={s.name} delay={i * 0.05}>
            <motion.div
              whileHover={{
                y: -3,
                scale: 1.01
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              className="rg-glass flex h-full flex-col rounded-2xl p-5">
              
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${connected ? 'bg-rg-blue/10 text-rg-blue' : 'bg-rg-heading/5 text-rg-body/60'}`}>
                  
                  <Icon className="h-5 w-5" />
                </div>
                <button
                  onClick={() =>
                  setState((prev) =>
                  prev.map((v, idx) => idx === i ? !v : v)
                  )
                  }
                  role="switch"
                  aria-checked={connected}
                  aria-label={`Toggle ${s.name}`}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${connected ? 'rg-gradient-bg' : 'bg-rg-heading/15'}`}>
                  
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${connected ? 'translate-x-6' : 'translate-x-1'}`} />
                  
                </button>
              </div>
              <h3 className="mt-4 text-sm font-bold text-rg-heading">
                {s.name}
              </h3>
              <span
                className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${connected ? 'bg-rg-blue/10 text-rg-blue' : 'bg-rg-heading/5 text-rg-body/70'}`}>
                
                <span
                  className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-rg-blue' : 'bg-rg-body/40'}`} />
                
                {connected ? 'Connected' : 'Not Connected'}
              </span>
            </motion.div>
          </Reveal>);

      })}
    </div>);

}