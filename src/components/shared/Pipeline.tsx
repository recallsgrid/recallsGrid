import React, { useRef, Fragment } from 'react';
import { motion, useInView } from 'framer-motion';
/**
 * Animated horizontal pipeline: labeled nodes connected by lines, with
 * particles continuously traveling left-to-right along the connectors once
 * the diagram scrolls into view. Wraps to a vertical flow on small screens.
 */
export function Pipeline({ steps }: {steps: string[];}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px'
  });
  return (
    <div ref={ref} className="relative">
      {/* Desktop / tablet: horizontal */}
      <div className="hidden md:flex items-start justify-between gap-2">
        {steps.map((step, i) =>
        <Fragment key={step}>
            <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={
            inView ?
            {
              opacity: 1,
              y: 0
            } :
            {}
            }
            transition={{
              delay: i * 0.12,
              duration: 0.5
            }}
            className="flex flex-col items-center text-center w-[120px] shrink-0">
            
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl rg-glass-strong">
                <span className="text-sm font-extrabold rg-gradient-text">
                  {i + 1}
                </span>
              </div>
              <span className="mt-3 text-xs font-semibold leading-tight text-rg-heading">
                {step}
              </span>
            </motion.div>

            {i < steps.length - 1 &&
          <div className="relative mt-7 h-0.5 flex-1 rounded-full bg-rg-blue/20">
                {inView &&
            [0, 1, 2].map((p) =>
            <motion.span
              key={p}
              className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full rg-gradient-bg shadow-[0_0_10px_rgba(34,211,238,0.9)]"
              initial={{
                left: '0%',
                opacity: 0
              }}
              animate={{
                left: ['0%', '100%'],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.3 + p * 0.6
              }} />

            )}
              </div>
          }
          </Fragment>
        )}
      </div>

      {/* Mobile: vertical */}
      <div className="flex flex-col gap-3 md:hidden">
        {steps.map((step, i) =>
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={
          inView ?
          {
            opacity: 1,
            x: 0
          } :
          {}
          }
          transition={{
            delay: i * 0.1
          }}
          className="flex items-center gap-3">
          
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl rg-glass-strong text-sm font-extrabold rg-gradient-text">
              {i + 1}
            </div>
            <span className="text-sm font-semibold text-rg-heading">
              {step}
            </span>
          </motion.div>
        )}
      </div>
    </div>);

}