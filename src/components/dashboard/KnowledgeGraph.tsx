import React, { useCallback, useEffect, useState, useRef } from 'react';
import { XIcon, ZoomInIcon, ZoomOutIcon, MaximizeIcon } from 'lucide-react';
interface GNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  fixed?: boolean;
}
interface GEdge {
  source: string;
  target: string;
}
const NODE_DEFS: {
  id: string;
  label: string;
  type: string;
}[] = [
{
  id: 'core',
  label: 'Memory Core',
  type: 'System'
},
{
  id: 'sess',
  label: 'Session Context',
  type: 'Context'
},
{
  id: 'user',
  label: 'User Profiles',
  type: 'Entity'
},
{
  id: 'docs',
  label: 'Document Store',
  type: 'Source'
},
{
  id: 'vec',
  label: 'Vector Index',
  type: 'Index'
},
{
  id: 'graph',
  label: 'Entity Graph',
  type: 'Graph'
},
{
  id: 'conv',
  label: 'Conversation Logs',
  type: 'Source'
},
{
  id: 'kb',
  label: 'Knowledge Base',
  type: 'Source'
},
{
  id: 'ret',
  label: 'Retrieval Engine',
  type: 'System'
},
{
  id: 'rank',
  label: 'Ranking Model',
  type: 'Model'
},
{
  id: 'ent1',
  label: 'Product Specs',
  type: 'Entity'
},
{
  id: 'ent2',
  label: 'Support Tickets',
  type: 'Entity'
}];

const EDGE_DEFS: GEdge[] = [
{
  source: 'core',
  target: 'sess'
},
{
  source: 'core',
  target: 'vec'
},
{
  source: 'core',
  target: 'graph'
},
{
  source: 'core',
  target: 'ret'
},
{
  source: 'sess',
  target: 'user'
},
{
  source: 'sess',
  target: 'conv'
},
{
  source: 'vec',
  target: 'docs'
},
{
  source: 'vec',
  target: 'kb'
},
{
  source: 'graph',
  target: 'ent1'
},
{
  source: 'graph',
  target: 'ent2'
},
{
  source: 'graph',
  target: 'user'
},
{
  source: 'ret',
  target: 'rank'
},
{
  source: 'ret',
  target: 'vec'
},
{
  source: 'kb',
  target: 'docs'
},
{
  source: 'conv',
  target: 'ent2'
}];

const TYPE_COLOR: Record<string, string> = {
  System: '#3b82f6',
  Context: '#22d3ee',
  Entity: '#8b5cf6',
  Source: '#0f1729',
  Index: '#3b82f6',
  Graph: '#8b5cf6',
  Model: '#22d3ee'
};
export function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GNode[]>([]);
  const viewRef = useRef({
    scale: 1,
    ox: 0,
    oy: 0
  });
  const dragRef = useRef<{
    node: GNode | null;
    panning: boolean;
    lastX: number;
    lastY: number;
  }>({
    node: null,
    panning: false,
    lastX: 0,
    lastY: 0
  });
  const [selected, setSelected] = useState<GNode | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const neighbors = useCallback((id: string) => {
    const set = new Set<string>();
    for (const e of EDGE_DEFS) {
      if (e.source === id) set.add(e.target);
      if (e.target === id) set.add(e.source);
    }
    return set;
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    // seed nodes near center
    nodesRef.current = NODE_DEFS.map((n, i) => ({
      ...n,
      x:
      200 +
      Math.cos(i / NODE_DEFS.length * Math.PI * 2) * 120 +
      Math.random() * 20,
      y:
      160 +
      Math.sin(i / NODE_DEFS.length * Math.PI * 2) * 120 +
      Math.random() * 20,
      vx: 0,
      vy: 0,
      r: n.type === 'System' ? 22 : 15
    }));
    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    let rafId = 0;
    const step = () => {
      const nodes = nodesRef.current;
      const cx = W / 2;
      const cy = H / 2;
      // repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let d2 = dx * dx + dy * dy || 0.01;
          const d = Math.sqrt(d2);
          const force = 2400 / d2;
          const fx = dx / d * force;
          const fy = dy / d * force;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
      }
      // springs
      for (const e of EDGE_DEFS) {
        const a = nodes.find((n) => n.id === e.source)!;
        const b = nodes.find((n) => n.id === e.target)!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const target = 110;
        const f = (d - target) * 0.008;
        const fx = dx / d * f;
        const fy = dy / d * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
      // gravity + integrate
      for (const n of nodes) {
        n.vx += (cx - n.x) * 0.0015;
        n.vy += (cy - n.y) * 0.0015;
        n.vx *= 0.85;
        n.vy *= 0.85;
        if (!n.fixed) {
          n.x += n.vx;
          n.y += n.vy;
        }
      }
      draw();
      rafId = requestAnimationFrame(step);
    };
    const draw = () => {
      const { scale, ox, oy } = viewRef.current;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(ox, oy);
      ctx.scale(scale, scale);
      const nodes = nodesRef.current;
      const sel = selectedIdRef.current;
      const active = sel ? neighbors(sel) : null;
      // edges
      for (const e of EDGE_DEFS) {
        const a = nodes.find((n) => n.id === e.source)!;
        const b = nodes.find((n) => n.id === e.target)!;
        const hot = sel && (e.source === sel || e.target === sel);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = hot ? 'rgba(59,130,246,0.85)' : 'rgba(71,85,105,0.22)';
        ctx.lineWidth = hot ? 2 : 1;
        ctx.stroke();
      }
      // nodes
      for (const n of nodes) {
        const dim = sel && n.id !== sel && !(active && active.has(n.id));
        const color = TYPE_COLOR[n.type] || '#3b82f6';
        ctx.globalAlpha = dim ? 0.28 : 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        if (n.id === sel) {
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#fff';
          ctx.stroke();
        } else {
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'rgba(255,255,255,0.7)';
          ctx.stroke();
        }
        // label
        ctx.globalAlpha = dim ? 0.35 : 1;
        ctx.fillStyle = '#0f1729';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + n.r + 13);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };
    // coordinate helpers
    const toWorld = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const { scale, ox, oy } = viewRef.current;
      return {
        x: (clientX - rect.left - ox) / scale,
        y: (clientY - rect.top - oy) / scale
      };
    };
    const hitNode = (clientX: number, clientY: number) => {
      const w = toWorld(clientX, clientY);
      return (
        nodesRef.current.find(
          (n) => Math.hypot(n.x - w.x, n.y - w.y) <= n.r + 4
        ) || null);

    };
    const onDown = (e: PointerEvent) => {
      const n = hitNode(e.clientX, e.clientY);
      if (n) {
        dragRef.current.node = n;
        n.fixed = true;
      } else {
        dragRef.current.panning = true;
      }
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMoveP = (e: PointerEvent) => {
      const d = dragRef.current;
      if (d.node) {
        const w = toWorld(e.clientX, e.clientY);
        d.node.x = w.x;
        d.node.y = w.y;
        d.node.vx = 0;
        d.node.vy = 0;
      } else if (d.panning) {
        viewRef.current.ox += e.clientX - d.lastX;
        viewRef.current.oy += e.clientY - d.lastY;
        d.lastX = e.clientX;
        d.lastY = e.clientY;
      }
    };
    const onUp = (e: PointerEvent) => {
      const d = dragRef.current;
      const moved = Math.hypot(e.clientX - d.lastX, e.clientY - d.lastY) > 3;
      if (d.node) {
        d.node.fixed = false;
        if (!moved) {
          selectedIdRef.current =
          selectedIdRef.current === d.node.id ? null : d.node.id;
          setSelected(
            selectedIdRef.current ?
            nodesRef.current.find((n) => n.id === selectedIdRef.current)! :
            null
          );
        }
      } else if (d.panning && !moved) {
        selectedIdRef.current = null;
        setSelected(null);
      }
      d.node = null;
      d.panning = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const v = viewRef.current;
      const delta = -e.deltaY * 0.0015;
      const nextScale = Math.min(2.4, Math.max(0.4, v.scale * (1 + delta)));
      // zoom toward cursor
      v.ox = mx - (mx - v.ox) * (nextScale / v.scale);
      v.oy = my - (my - v.oy) * (nextScale / v.scale);
      v.scale = nextScale;
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMoveP);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('wheel', onWheel, {
      passive: false
    });
    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMoveP);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [neighbors]);
  const zoom = (factor: number) => {
    const v = viewRef.current;
    v.scale = Math.min(2.4, Math.max(0.4, v.scale * factor));
  };
  const reset = () => {
    viewRef.current = {
      scale: 1,
      ox: 0,
      oy: 0
    };
  };
  const connections = selected ?
  EDGE_DEFS.filter(
    (e) => e.source === selected.id || e.target === selected.id
  ).map((e) => {
    const otherId = e.source === selected.id ? e.target : e.source;
    return NODE_DEFS.find((n) => n.id === otherId)!;
  }) :
  [];
  return (
    <div className="relative">
      <div
        ref={wrapRef}
        className="relative h-[420px] w-full touch-none overflow-hidden rounded-2xl bg-white/40"
        data-lenis-prevent>
        
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-grab active:cursor-grabbing" />
        

        {/* zoom controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          <ControlBtn onClick={() => zoom(1.2)} label="Zoom in">
            <ZoomInIcon className="h-4 w-4" />
          </ControlBtn>
          <ControlBtn onClick={() => zoom(0.83)} label="Zoom out">
            <ZoomOutIcon className="h-4 w-4" />
          </ControlBtn>
          <ControlBtn onClick={reset} label="Reset view">
            <MaximizeIcon className="h-4 w-4" />
          </ControlBtn>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 text-xs font-medium text-rg-body/70">
          Drag nodes · scroll to zoom · click a node for details
        </div>

        {/* side panel */}
        {selected &&
        <div className="rg-glass-strong absolute right-3 bottom-3 top-3 w-60 overflow-y-auto rounded-2xl p-5 rg-thin-scroll">
            <div className="flex items-start justify-between">
              <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{
                background: TYPE_COLOR[selected.type]
              }}>
              
                <span className="text-xs font-bold">
                  {selected.label.charAt(0)}
                </span>
              </div>
              <button
              onClick={() => {
                selectedIdRef.current = null;
                setSelected(null);
              }}
              aria-label="Close details"
              className="rounded-full p-1 text-rg-body hover:bg-rg-heading/5">
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <h4 className="mt-3 text-base font-bold text-rg-heading">
              {selected.label}
            </h4>
            <span className="mt-1 inline-block rounded-full bg-rg-heading/5 px-2 py-0.5 text-xs font-semibold text-rg-body">
              {selected.type}
            </span>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-rg-body/70">
              Connected to ({connections.length})
            </div>
            <ul className="mt-2 space-y-1.5">
              {connections.map((c) =>
            <li
              key={c.id}
              className="flex items-center gap-2 text-sm text-rg-heading">
              
                  <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: TYPE_COLOR[c.type]
                }} />
              
                  {c.label}
                </li>
            )}
            </ul>
          </div>
        }
      </div>
    </div>);

}
function ControlBtn({
  children,
  onClick,
  label




}: {children: React.ReactNode;onClick: () => void;label: string;}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg rg-glass-strong text-rg-heading transition-transform hover:scale-105">
      
      {children}
    </button>);

}