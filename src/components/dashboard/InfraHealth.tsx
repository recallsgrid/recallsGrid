import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  RadialGauge,
  Sparkline,
  ProgressBar,
  LineChart,
  useCountUp } from
'./Charts';
/** small helper: jittering value around a base */
function useJitter(base: number, amplitude: number, decimals = 0) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      const next = base + (Math.random() - 0.5) * amplitude * 2;
      setV(parseFloat(next.toFixed(decimals)));
    }, 2500);
    return () => clearInterval(id);
  }, [base, amplitude, decimals]);
  return v;
}
function Card({
  title,
  children,
  delay = 0




}: {title: string;children: React.ReactNode;delay?: number;}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
        scale: 0.98
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{
        y: -3
      }}
      className="rg-glass flex flex-col rounded-2xl p-5">
      
      <span className="text-xs font-semibold uppercase tracking-wide text-rg-body/70">
        {title}
      </span>
      <div className="mt-3 flex flex-1 flex-col">{children}</div>
    </motion.div>);

}
export function InfraHealth() {
  const nodes = useJitter(48210, 60);
  const latency = useJitter(42, 3);
  const accuracy = useJitter(99.7, 0.15, 2);
  const vecUtil = useJitter(76, 2);
  const graphDensity = useJitter(68, 2);
  const retention = useJitter(94.2, 0.4, 1);
  const nodesUp = useCountUp(nodes);
  const retentionUp = useCountUp(retention);
  const [spark, setSpark] = useState<number[]>(
    Array.from(
      {
        length: 16
      },
      () => 40 + Math.random() * 40
    )
  );
  const [throughput, setThroughput] = useState<number[]>(
    Array.from(
      {
        length: 20
      },
      () => 60 + Math.random() * 40
    )
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSpark((p) => [...p.slice(1), 40 + Math.random() * 40]);
      setThroughput((p) => [...p.slice(1), 60 + Math.random() * 40]);
    }, 2500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Active Memory Nodes" delay={0}>
        <div className="text-3xl font-extrabold text-rg-heading">
          {Math.round(nodesUp).toLocaleString()}
        </div>
        <div className="mt-auto pt-3">
          <Sparkline data={spark} color="#3b82f6" width={140} />
        </div>
      </Card>

      <Card title="Retrieval Latency" delay={0.05}>
        <div className="flex items-center justify-between">
          <RadialGauge value={100 - latency} color="#22d3ee" />
          <div className="text-right">
            <div className="text-2xl font-extrabold text-rg-heading">
              {latency}ms
            </div>
            <div className="text-xs text-rg-body">p95 latency</div>
          </div>
        </div>
      </Card>

      <Card title="Memory Accuracy Score" delay={0.1}>
        <div className="flex items-center justify-between">
          <RadialGauge value={accuracy} suffix="%" color="#3b82f6" />
          <div className="text-right">
            <div className="text-2xl font-extrabold text-rg-heading">
              {accuracy}%
            </div>
            <div className="text-xs text-rg-body">last 24h</div>
          </div>
        </div>
      </Card>

      <Card title="Vector DB Utilization" delay={0.15}>
        <div className="mt-auto">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-rg-heading">
              {vecUtil}%
            </span>
            <span className="text-xs text-rg-body">of capacity</span>
          </div>
          <ProgressBar value={vecUtil} color="#8b5cf6" />
        </div>
      </Card>

      <Card title="Knowledge Graph Density" delay={0.2}>
        <div className="flex items-center justify-between">
          <RadialGauge value={graphDensity} suffix="%" color="#8b5cf6" />
          <div className="text-right">
            <div className="text-2xl font-extrabold text-rg-heading">
              {graphDensity}%
            </div>
            <div className="text-xs text-rg-body">edge coverage</div>
          </div>
        </div>
      </Card>

      <Card title="System Throughput" delay={0.25}>
        <div className="mt-auto h-[72px]">
          <LineChart data={throughput} color="#22d3ee" height={72} />
        </div>
        <div className="mt-2 text-xs text-rg-body">ops / sec</div>
      </Card>

      <Card title="Context Retention Rate" delay={0.3}>
        <div className="flex flex-1 flex-col justify-center">
          <div className="text-3xl font-extrabold text-rg-heading">
            {retentionUp.toFixed(1)}%
          </div>
          <div className="mt-2">
            <ProgressBar value={retention} color="#3b82f6" />
          </div>
        </div>
      </Card>
    </div>);

}