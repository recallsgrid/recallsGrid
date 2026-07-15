import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart } from './Charts';
type Range = 'Daily' | 'Weekly' | 'Monthly';
const ACCURACY: Record<Range, number[]> = {
  Daily: [96.2, 97.1, 96.8, 98.0, 97.6, 98.4, 99.1, 98.9],
  Weekly: [94.5, 95.8, 96.2, 97.0, 97.9, 98.6, 99.2],
  Monthly: [90.1, 92.4, 93.8, 95.2, 96.9, 98.1, 99.0, 99.4]
};
const USAGE: Record<Range, number[]> = {
  Daily: [120, 180, 150, 240, 300, 260, 340, 410],
  Weekly: [800, 1100, 1400, 1250, 1700, 2100, 2400],
  Monthly: [4200, 5100, 6800, 7400, 9100, 10500, 12400]
};
const RANGES: Range[] = ['Daily', 'Weekly', 'Monthly'];
export function MemoryAnalytics() {
  const [range, setRange] = useState<Range>('Weekly');
  return (
    <div className="rg-glass rounded-2xl p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-rg-heading">Memory Analytics</h2>
        <div className="relative flex rounded-full bg-rg-heading/5 p-1">
          {RANGES.map((r) =>
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${range === r ? 'text-white' : 'text-rg-body hover:text-rg-heading'}`}>
            
              {range === r &&
            <motion.span
              layoutId="analytics-tab"
              className="absolute inset-0 -z-10 rounded-full rg-gradient-bg"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 26
              }} />

            }
              {r}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartPanel title="Retrieval Accuracy Trend" suffix="%" color="#3b82f6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`acc-${range}`}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -10
              }}
              transition={{
                duration: 0.3
              }}
              className="h-40">
              
              <LineChart data={ACCURACY[range]} color="#3b82f6" height={160} />
            </motion.div>
          </AnimatePresence>
        </ChartPanel>

        <ChartPanel title="Memory Usage Over Time" color="#8b5cf6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`use-${range}`}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -10
              }}
              transition={{
                duration: 0.3
              }}
              className="h-40">
              
              <LineChart data={USAGE[range]} color="#8b5cf6" height={160} />
            </motion.div>
          </AnimatePresence>
        </ChartPanel>
      </div>
    </div>);

}
function ChartPanel({
  title,
  children





}: {title: string;suffix?: string;color?: string;children: React.ReactNode;}) {
  return (
    <div className="rounded-2xl bg-white/40 p-4">
      <div className="mb-3 text-sm font-semibold text-rg-heading">{title}</div>
      {children}
    </div>);

}