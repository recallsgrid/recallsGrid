import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
/** Count-up hook: animates from 0 to value on mount. */
export function useCountUp(value: number, duration = 1200) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    let raf = 0;
    startRef.current = null;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min((t - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // run once on mount for count-up feel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // keep in sync with jittering value after initial animation
  useEffect(() => {
    if (startRef.current !== null) setDisplay(value);
  }, [value]);
  return display;
}
/** Radial gauge (0-100). */
export function RadialGauge({
  value,
  suffix = '',
  color = '#3b82f6',
  size = 92





}: {value: number;suffix?: string;color?: string;size?: number;}) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - clamped / 100 * c;
  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size
      }}>
      
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(71,85,105,0.15)"
          strokeWidth={stroke} />
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{
            strokeDashoffset: offset
          }}
          transition={{
            type: 'spring',
            stiffness: 60,
            damping: 15
          }} />
        
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-extrabold text-rg-heading">
          {value.toFixed(value < 10 ? 1 : 0)}
          {suffix}
        </span>
      </div>
    </div>);

}
/** Mini sparkline from an array of values. */
export function Sparkline({
  data,
  color = '#3b82f6',
  width = 120,
  height = 36





}: {data: number[];color?: string;width?: number;height?: number;}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.
  map((v, i) => {
    const x = i / (data.length - 1) * width;
    const y = height - (v - min) / range * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).
  join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round" />
      
    </svg>);

}
/** Progress bar. */
export function ProgressBar({
  value,
  color = '#3b82f6'



}: {value: number;color?: string;}) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-rg-heading/10">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: color
        }}
        animate={{
          width: `${Math.max(0, Math.min(100, value))}%`
        }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 15
        }} />
      
    </div>);

}
/** Area/line chart with axis-free minimal styling. */
export function LineChart({
  data,
  color = '#3b82f6',
  height = 200




}: {data: number[];color?: string;height?: number;}) {
  const width = 480;
  if (data.length < 2) return null;
  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => ({
    x: i * stepX,
    y: height - (v - min) / range * height
  }));
  const line = points.
  map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).
  join(' ');
  const area = `0,${height} ${line} ${width},${height}`;
  const gid = `grad-${color.replace('#', '')}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      style={{
        height
      }}>
      
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <motion.polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          pathLength: 0
        }}
        animate={{
          pathLength: 1
        }}
        transition={{
          duration: 1,
          ease: 'easeInOut'
        }} />
      
    </svg>);

}