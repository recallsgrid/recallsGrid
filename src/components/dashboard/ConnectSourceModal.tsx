import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  XIcon,
  CheckIcon,
  DatabaseIcon,
  BoxesIcon,
  FileTextIcon,
  PlugIcon } from
'lucide-react';
import { PrimaryButton } from '../shared/ui';
const TYPES = [
{
  name: 'Database',
  icon: DatabaseIcon
},
{
  name: 'Vector Store',
  icon: BoxesIcon
},
{
  name: 'Documents',
  icon: FileTextIcon
},
{
  name: 'API Source',
  icon: PlugIcon
}];

export function ConnectSourceModal({
  open,
  onClose



}: {open: boolean;onClose: () => void;}) {
  const [type, setType] = useState(0);
  const [name, setName] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (open) {
      setType(0);
      setName('');
      setDone(false);
    }
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open &&
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        data-lenis-prevent>
        
          <div
          className="absolute inset-0 bg-rg-heading/40 backdrop-blur-sm"
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Connect a data source"
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.97
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 26
          }}
          className="rg-glass-strong relative z-10 w-full max-w-md rounded-3xl p-7">
          
            <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1.5 text-rg-body hover:bg-rg-heading/5">
            
              <XIcon className="h-5 w-5" />
            </button>

            {done ?
          <div className="flex flex-col items-center py-6 text-center">
                <motion.div
              initial={{
                scale: 0
              }}
              animate={{
                scale: 1
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 18
              }}
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rg-blue/15">
              
                  <CheckIcon className="h-7 w-7 text-rg-blue" />
                </motion.div>
                <h3 className="text-xl font-bold text-rg-heading">
                  Source connected
                </h3>
                <p className="mt-2 text-sm text-rg-body">
                  {name || 'Your source'} is now syncing into RecallsGrid.
                </p>
                <PrimaryButton onClick={onClose} className="mt-6">
                  Done
                </PrimaryButton>
              </div> :

          <>
                <h3 className="text-2xl font-extrabold text-rg-heading rg-tight">
                  Connect a data source
                </h3>
                <p className="mt-1.5 text-sm text-rg-body">
                  Pick a source type and give it a name to start indexing.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {TYPES.map((t, i) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.name}
                    onClick={() => setType(i)}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${type === i ? 'border-rg-blue bg-rg-blue/10' : 'border-white/60 bg-white/50 hover:bg-white'}`}>
                    
                        <Icon
                      className={`h-5 w-5 ${type === i ? 'text-rg-blue' : 'text-rg-body'}`} />
                    
                        <span className="text-sm font-semibold text-rg-heading">
                          {t.name}
                        </span>
                      </button>);

              })}
                </div>

                <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
              className="mt-5">
              
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-rg-heading">
                      Source name
                    </span>
                    <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Production Postgres"
                  className="w-full rounded-xl border border-white/70 bg-white/70 px-4 py-2.5 text-sm text-rg-heading outline-none placeholder:text-rg-body/50 focus:border-rg-blue focus:ring-2 focus:ring-rg-blue/30" />
                
                  </label>
                  <PrimaryButton type="submit" className="mt-5 w-full">
                    Connect {TYPES[type].name}
                  </PrimaryButton>
                </form>
              </>
          }
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}