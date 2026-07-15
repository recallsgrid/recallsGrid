import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
/** Solid black pill primary button with spring scale + shadow lift, magnetic pull. */
export function PrimaryButton({
  children,
  onClick,
  className = '',
  type = 'button',
  magnetic = true






}: {children: React.ReactNode;onClick?: () => void;className?: string;type?: 'button' | 'submit';magnetic?: boolean;}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pull, setPull] = useState({
    x: 0,
    y: 0
  });
  const onMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setPull({
      x: x * 0.25,
      y: y * 0.25
    });
  };
  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() =>
      setPull({
        x: 0,
        y: 0
      })
      }
      animate={{
        x: pull.x,
        y: pull.y
      }}
      whileHover={{
        scale: 1.04
      }}
      whileTap={{
        scale: 0.97
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-rg-heading px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rg-heading/20 transition-shadow hover:shadow-xl hover:shadow-rg-blue/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-rg-blue focus-visible:ring-offset-2 focus-visible:ring-offset-rg-bg ${className}`}>
      
      {children}
    </motion.button>);

}
/** White outline pill secondary button. */
export function SecondaryButton({
  children,
  onClick,
  className = '',
  type = 'button'





}: {children: React.ReactNode;onClick?: () => void;className?: string;type?: 'button' | 'submit';}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{
        scale: 1.04
      }}
      whileTap={{
        scale: 0.97
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/60 px-6 py-3 text-sm font-semibold text-rg-heading backdrop-blur transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rg-blue focus-visible:ring-offset-2 focus-visible:ring-offset-rg-bg ${className}`}>
      
      {children}
    </motion.button>);

}
/** Wraps a section and fades/slides/scales it up on scroll into view. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div'





}: {children: React.ReactNode;className?: string;delay?: number;as?: 'div' | 'section' | 'li';}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-80px'
  });
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      ref={ref}
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.98
      }}
      animate={
      inView ?
      {
        opacity: 1,
        y: 0,
        scale: 1
      } :
      {}
      }
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}>
      
      {children}
    </MotionTag>);

}
/** NVIDIA-green "Powered by NVIDIA SDK" chip. */
export function NvidiaChip({ className = '' }: {className?: string;}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-rg-nvidia/30 bg-rg-nvidia/10 px-3 py-1.5 text-xs font-semibold text-[#4d7a00] ${className}`}>
      
      <span className="h-2 w-2 rounded-full bg-rg-nvidia" />
      Powered by NVIDIA SDK
    </span>);

}
/** Small pill badge used above headings. */
export function PillBadge({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-1.5 text-xs font-semibold text-rg-heading backdrop-blur ${className}`}>
      
      {children}
    </span>);

}