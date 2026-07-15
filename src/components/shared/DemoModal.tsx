import React, { useEffect, useState, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, XIcon } from 'lucide-react';
import { PrimaryButton } from './ui';
interface DemoModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  /** email-only capture variant (waitlist) */
  variant?: 'demo' | 'email';
  cta?: string;
}
export function DemoModal({
  open,
  onClose,
  title = 'Request a Demo',
  subtitle = 'See how RecallsGrid gives your AI persistent memory.',
  variant = 'demo',
  cta = 'Request Demo'
}: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: ''
  });
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setForm({
        name: '',
        email: '',
        company: ''
      });
    }
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
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
          aria-label={title}
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
            className="absolute right-4 top-4 rounded-full p-1.5 text-rg-body transition-colors hover:bg-rg-heading/5">
            
              <XIcon className="h-5 w-5" />
            </button>

            {submitted ?
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
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rg-nvidia/15">
              
                  <CheckIcon className="h-7 w-7 text-rg-nvidia" />
                </motion.div>
                <h3 className="text-xl font-bold text-rg-heading rg-tight">
                  You're all set!
                </h3>
                <p className="mt-2 text-sm text-rg-body">
                  {variant === 'email' ?
              "You've joined the waitlist — we'll be in touch soon." :
              'Thanks! Our team will reach out within one business day.'}
                </p>
                <PrimaryButton onClick={onClose} className="mt-6">
                  Done
                </PrimaryButton>
              </div> :

          <>
                <h3 className="text-2xl font-extrabold text-rg-heading rg-tight">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm text-rg-body">{subtitle}</p>
                <form onSubmit={submit} className="mt-6 space-y-4">
                  {variant === 'demo' &&
              <Field
                label="Full name"
                value={form.name}
                onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  name: v
                }))
                }
                placeholder="Ada Lovelace"
                required />

              }
                  <Field
                label="Work email"
                type="email"
                value={form.email}
                onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  email: v
                }))
                }
                placeholder="ada@company.com"
                required />
              
                  {variant === 'demo' &&
              <Field
                label="Company"
                value={form.company}
                onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  company: v
                }))
                }
                placeholder="Acme Corp"
                required />

              }
                  <PrimaryButton type="submit" className="w-full">
                    {cta}
                  </PrimaryButton>
                </form>
              </>
          }
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required







}: {label: string;value: string;onChange: (v: string) => void;placeholder?: string;type?: string;required?: boolean;}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-rg-heading">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/70 bg-white/70 px-4 py-2.5 text-sm text-rg-heading outline-none backdrop-blur transition-colors placeholder:text-rg-body/50 focus:border-rg-blue focus:ring-2 focus:ring-rg-blue/30" />
      
    </label>);

}