import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import logoSvg from "../Assets/logo.svg";

/* =========================================================================
   RECALLSGRID — AI Memory & Cognitive Intelligence Command Center
   Single-file React/TSX dashboard. Drop into any React + Vite/TS project.
   Frontend only — all data mocked, all forms local state (no network calls).
   Theme tokens live in <style> below (search "design tokens" to re-skin).
   Layout: top pill-nav (desktop) collapsing to a full-screen section
   switcher + bottom quick-bar (mobile) — intentionally not a fixed sidebar.
   ========================================================================= */

type SectionId =
  | "overview" | "graph" | "retrieval" | "memory"
  | "ingestion" | "infra" | "integrations" | "reports" | "api" | "account";

/* ---------------------------- utils --------------------------------- */

function genSeries(n: number, base: number, vol: number): number[] {
  const arr = [base];
  for (let i = 1; i < n; i++) arr.push(Math.max(4, arr[i - 1] + (Math.random() - 0.47) * vol));
  return arr;
}

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------------------------- icon set -------------------------------- */

const ICONS: Record<string, string> = {
  brain: '<path d="M9.5 3a3 3 0 0 0-3 3v.3A3 3 0 0 0 4 9v1a3 3 0 0 0 1 2.2A3 3 0 0 0 4 15v1a3 3 0 0 0 3 3h.2A3 3 0 0 0 10 21h1V3Z"/><path d="M14.5 3a3 3 0 0 1 3 3v.3A3 3 0 0 1 20 9v1a3 3 0 0 1-1 2.2 3 3 0 0 1 1 2.8v1a3 3 0 0 1-3 3h-.2A3 3 0 0 1 14 21h-1V3Z"/>',
  grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  graph: '<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="12" cy="13" r="2.6"/><circle cx="6" cy="19" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8 7.5 10.5 11.5M15.5 11.5 16 7.5M10.5 15 7.5 17.5M13.5 15 16.5 17.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  ingest: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  grid2: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  api: '<path d="m18 16 4-4-4-4M6 8l-4 4 4 4"/><path d="m14.5 4-5 16"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20.8 14.5A9 9 0 1 1 9.5 3.2a7 7 0 0 0 11.3 11.3Z"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  down: '<path d="M12 5v14M5 12l7 7 7-7"/>',
  check: '<path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bell: '<path d="M17 7a5 5 0 0 0-10 0c0 5-3 6-3 6h16s-3-1-3-6"/><path d="M10.5 20a1.5 1.5 0 0 0 3 0"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
  anomaly: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 15V3M7 10l5 5 5-5"/><path d="M3 17v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m10.5 12.5 8-8M16 9l3 3M13 6l3 3"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>',
  filter: '<path d="M4 4h16l-6 8v6l-4 2v-8L4 4Z"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/>',
  cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6-1.6A5 5 0 0 0 6.5 19h11Z"/>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-4-.9L3 20l1-4.5A8.38 8.38 0 0 1 12.5 3a8.38 8.38 0 0 1 8.5 8.5Z"/>',
  crm: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
};

function Ic({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || "" }} />
  );
}

/* ---------------------------- app context -------------------------------- */

type AppCtxType = { navigate: (s: SectionId) => void; toast: (text: string) => void; theme: "dark" | "light" };
const AppCtx = React.createContext<AppCtxType>({ navigate: () => {}, toast: () => {}, theme: "dark" });
function useApp() { return React.useContext(AppCtx); }

let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const push = (text: string) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  };
  return { toasts, push };
}
function ToastStack({ toasts }: { toasts: { id: number; text: string }[] }) {
  return (
    <div className="rg-toaststack">
      {toasts.map((t) => <div className="rg-toast" key={t.id}><Ic name="check" size={14} />{t.text}</div>)}
    </div>
  );
}

/* ---------------------------- atoms ------------------------------------ */

function Card({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`rg-card ${className}`} style={style}>{children}</div>;
}

function SectionHead({ eyebrow, title, sub, actions }: { eyebrow?: string; title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="rg-pagehead">
      <div>
        {eyebrow && <div className="rg-eyebrow"><span className="rg-dot" />{eyebrow}</div>}
        <h1 className="rg-title">{title}</h1>
        {sub && <p className="rg-sub">{sub}</p>}
      </div>
      {actions && <div className="rg-actions">{actions}</div>}
    </div>
  );
}

function CardHead({ title, desc, right }: { title: string; desc?: string; right?: React.ReactNode }) {
  return (
    <div className="rg-cardhead">
      <div>
        <div className="rg-cardtitle">{title}</div>
        {desc && <div className="rg-carddesc">{desc}</div>}
      </div>
      {right}
    </div>
  );
}

function Delta({ dir, children }: { dir: "up" | "down" | "flat"; children: React.ReactNode }) {
  return <span className={`rg-delta rg-${dir}`}>{dir !== "flat" && <Ic name={dir} size={10} />}{children}</span>;
}

function StatusPill({ status }: { status: "healthy" | "watch" | "critical" }) {
  const label = status[0].toUpperCase() + status.slice(1);
  return <span className={`rg-status rg-${status}`}><span className="rg-sdot" />{label}</span>;
}

function Gauge({ pct, color, label, value }: { pct: number; color: string; label: string; value: string }) {
  const dash = 148 - (pct / 100) * 148;
  return (
    <div className="rg-gauge">
      <svg width="110" height="70" viewBox="0 0 110 65">
        <path d="M8 60 A47 47 0 0 1 102 60" fill="none" stroke="var(--surface-2)" strokeWidth="9" strokeLinecap="round" />
        <path d="M8 60 A47 47 0 0 1 102 60" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray="148" strokeDashoffset={dash} />
      </svg>
      <div className="rg-gaugeval">{value}</div>
      <div className="rg-gaugelabel">{label}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className={`rg-toggle ${checked ? "on" : ""}`} onClick={() => onChange(!checked)} aria-pressed={checked}>
      <span className="rg-toggle-knob" />
    </button>
  );
}

function getPasswordStrength(password: string) {
  if (!password) {
    return { score: 0, label: "Enter a password", color: "#94a3b8" };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (password.length >= 12) score += 1;

  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];

  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 4)],
    color: colors[Math.min(score, 4)],
  };
}

/* ================================================================
   SECTION: Memory Command Center (overview)
   ================================================================ */

const RECALL_KIND_STYLE: Record<string, { bg: string; fg: string; icon: string }> = {
  predict: { bg: "var(--cyan-dim)", fg: "var(--cyan)", icon: "bolt" },
  good: { bg: "var(--good-dim)", fg: "var(--good)", icon: "check" },
  signal: { bg: "var(--brand-dim)", fg: "var(--brand)", icon: "graph" },
  warn: { bg: "var(--warn-dim)", fg: "var(--warn)", icon: "anomaly" },
};

const INSIGHTS = [
  { t: "Long-term memory consolidated", time: "1m ago", body: "4,208 conversation-log fragments merged into 91 durable memory nodes for the support-agent knowledge base.", kind: "good" },
  { t: "Recall drift detected", time: "9m ago", body: "Semantic recall accuracy for 'billing disputes' cluster dipped 6% — re-embedding scheduled.", kind: "warn" },
  { t: "New entity relationships mapped", time: "24m ago", body: "Knowledge graph builder linked 18 new entities across the CRM and support-ticket sources.", kind: "signal" },
  { t: "Context window extended", time: "52m ago", body: "Agent 'Onboarding Assistant' now retains context across 340 sessions, up from 210.", kind: "predict" },
  { t: "Ingestion batch completed", time: "1h ago", body: "Document repository sync finished — 12,904 chunks embedded and indexed.", kind: "good" },
  { t: "Retrieval latency improved", time: "3h ago", body: "p95 recall latency down 22% after vector index re-partitioning.", kind: "signal" },
] as const;

function InsightsFeed() {
  return (
    <Card className="rg-pad">
      <CardHead title="Cognitive Activity Feed" desc="What the memory engine has been doing, in plain language" />
      <div className="rg-feed">
        {INSIGHTS.map((i, idx) => {
          const k = RECALL_KIND_STYLE[i.kind];
          return (
            <div className="rg-feeditem" key={idx}>
              <div className="rg-feedic" style={{ background: k.bg, color: k.fg }}><Ic name={k.icon} size={14} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="rg-feedtitle"><span>{i.t}</span><span className="rg-feedtime mono">{i.time}</span></div>
                <div className="rg-feedbody">{i.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function MemoryPulse() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 6000); return () => clearInterval(id); }, []);
  const { d, area } = useMemo(() => {
    const W = 660, H = 220, PAD = 20;
    const pts = genSeries(30, 120, 26);
    const max = Math.max(...pts) * 1.1;
    const step = (W - PAD * 2) / (pts.length - 1);
    let d = "";
    pts.forEach((p, i) => {
      const x = PAD + i * step, y = PAD + (H - PAD * 2) - (p / max) * (H - PAD * 2);
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    });
    const lastX = PAD + (pts.length - 1) * step;
    const area = d + `L ${lastX.toFixed(1)} ${(H - PAD).toFixed(1)} L ${PAD} ${(H - PAD).toFixed(1)} Z`;
    return { d, area };
  }, [tick]);
  return (
    <Card className="rg-pad">
      <CardHead title="Memory Writes / Recalls" desc="Vector writes and semantic recalls over the last 24h" />
      <svg viewBox="0 0 660 220" style={{ width: "100%", height: 220, overflow: "visible" }}>
        <defs>
          <linearGradient id="rgFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g, i) => <line key={i} x1={20} y1={20 + 180 * g} x2={640} y2={20 + 180 * g} stroke="var(--border-soft)" strokeWidth={1} />)}
        <path d={area} fill="url(#rgFill)" />
        <path d={d} fill="none" stroke="var(--brand)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="rg-legend">
        <div className="rg-legenditem"><span className="rg-swatch" style={{ background: "var(--brand)" }} />Recall volume</div>
        <div className="rg-legenditem"><span className="rg-swatch" style={{ background: "var(--cyan)" }} />Write volume</div>
      </div>
    </Card>
  );
}

function CognitivePipeline() {
  const steps = [
    { icon: "ingest", label: "Ingestion" },
    { icon: "layers", label: "Embedding & indexing" },
    { icon: "graph", label: "Context linking" },
    { icon: "crm", label: "Graph builder" },
    { icon: "search", label: "Retrieval & ranking" },
    { icon: "brain", label: "Semantic recall" },
  ];
  return (
    <Card className="rg-pad">
      <CardHead title="Memory Intelligence Pipeline" desc="How raw data becomes retrievable, contextual knowledge" />
      <div className="rg-pipeline">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className="rg-pipestep">
              <div className="rg-pipeic"><Ic name={s.icon} size={19} /></div>
              <div className="rg-pipelabel">{s.label}</div>
            </div>
            {i < steps.length - 1 && <div className="rg-pipeconnector" />}
          </React.Fragment>
        ))}
      </div>
      <span className="rg-nvidia"><Ic name="layers" size={12} />Powered by NVIDIA SDK</span>
    </Card>
  );
}

function InfraGaugesSmall() {
  return (
    <Card className="rg-pad">
      <CardHead title="Memory Infrastructure" desc="Live resource snapshot" />
      <div className="rg-gaugegrid">
        <Gauge pct={71} color="var(--brand)" value="71%" label="Vector DB util." />
        <Gauge pct={58} color="var(--cyan)" value="58%" label="GPU (embedding)" />
        <Gauge pct={44} color="var(--warn)" value="44%" label="Graph store I/O" />
        <Gauge pct={82} color="var(--good)" value="82%" label="Context retention" />
      </div>
    </Card>
  );
}

const MEMORY_DOMAINS = [
  { name: "support-conversations", nodes: "18,204", region: "Vector · us-east-1", status: "watch", drift: "412ms", acc: "1.8%", score: 61 },
  { name: "product-documentation", nodes: "6,910", region: "Vector · ap-south-1", status: "healthy", drift: "118ms", acc: "0.2%", score: 11 },
  { name: "crm-entity-graph", nodes: "3,344", region: "Graph · us-east-1", status: "critical", drift: "980ms", acc: "6.4%", score: 88 },
  { name: "billing-records", nodes: "9,102", region: "Vector · eu-west-1", status: "healthy", drift: "96ms", acc: "0.1%", score: 9 },
  { name: "agent-session-memory", nodes: "22,571", region: "Vector · ap-south-1", status: "healthy", drift: "54ms", acc: "0.0%", score: 5 },
  { name: "research-corpus", nodes: "5,027", region: "Vector · us-east-1", status: "watch", drift: "305ms", acc: "1.1%", score: 44 },
] as const;

function DomainTable() {
  const { navigate } = useApp();
  return (
    <Card className="rg-pad" style={{ marginBottom: 16 }}>
      <CardHead title="Memory Domains" desc="Recall drift and accuracy per knowledge domain"
        right={<button className="rg-btn rg-btnsm" onClick={() => navigate("memory")}>View all <Ic name="chevron" size={13} /></button>} />
      <div className="rg-tablewrap">
        <table className="rg-table">
          <thead><tr><th>Domain</th><th>Status</th><th>Nodes</th><th>Recall latency</th><th>Drift rate</th><th>Anomaly score</th></tr></thead>
          <tbody>
            {MEMORY_DOMAINS.map((s) => {
              const scoreColor = s.score > 70 ? "var(--crit)" : s.score > 35 ? "var(--warn)" : "var(--good)";
              return (
                <tr className="rg-row" key={s.name}>
                  <td><div className="rg-svcname">{s.name}</div><div className="rg-svcsub mono">{s.region}</div></td>
                  <td><StatusPill status={s.status as any} /></td>
                  <td className="mono">{s.nodes}</td>
                  <td className="mono">{s.drift}</td>
                  <td className="mono">{s.acc}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="rg-scorebar"><div style={{ width: `${s.score}%`, background: scoreColor }} /></div>
                      <span className="mono" style={{ fontSize: 11 }}>{s.score}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const INCIDENTS_MINI = [
  { sev: "crit", title: "crm-entity-graph accuracy drop", meta: ["MEM-2031", "9m open", "2 domains"], tag: "Critical" },
  { sev: "warn", title: "support-conversations recall drift", meta: ["MEM-2028", "41m open", "1 domain"], tag: "Watching" },
  { sev: "warn", title: "research-corpus embedding backlog", meta: ["MEM-2021", "1h 2m open", "1 domain"], tag: "Watching" },
] as const;

function IncidentsMini() {
  return (
    <Card className="rg-pad">
      <CardHead title="Open Memory Alerts" desc="Auto-correlated across domains" />
      <div>
        {INCIDENTS_MINI.map((i, idx) => {
          const color = i.sev === "crit" ? "var(--crit)" : "var(--warn)";
          const bg = i.sev === "crit" ? "var(--crit-dim)" : "var(--warn-dim)";
          return (
            <div className="rg-incident" key={idx}>
              <div className="rg-incsev" style={{ background: color }} />
              <div style={{ flex: 1 }}>
                <div className="rg-inctitle"><span>{i.title}</span><span className="rg-inctag" style={{ background: bg, color }}>{i.tag}</span></div>
                <div className="rg-incmeta mono">{i.meta.map((m, j) => <span key={j}>{m}</span>)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function KpiStrip() {
  const items = [
    { label: "Active memory nodes", val: "65,158", icon: "brain", bg: "var(--brand-dim)", fg: "var(--brand)", delta: <Delta dir="up">+3.1%</Delta> },
    { label: "Retrieval latency (p95)", val: "212ms", icon: "clock", bg: "var(--cyan-dim)", fg: "var(--cyan)", delta: <Delta dir="down">−18ms vs. yday</Delta> },
    { label: "Memory accuracy score", val: "96.4%", icon: "check", bg: "var(--good-dim)", fg: "var(--good)", delta: <Delta dir="up">+0.4%</Delta> },
    { label: "Vector DB utilization", val: "71%", icon: "db", bg: "var(--warn-dim)", fg: "var(--warn)", delta: <Delta dir="flat">stable</Delta> },
    { label: "Knowledge graph density", val: "4.2x", icon: "graph", bg: "var(--brand-dim)", fg: "var(--brand)", delta: <Delta dir="up">+0.3x this week</Delta> },
    { label: "Context retention rate", val: "88.9%", icon: "shield", bg: "var(--good-dim)", fg: "var(--good)", delta: <Delta dir="up">Best in class</Delta> },
  ];
  return (
    <div className="rg-kpigrid">
      {items.map((it, i) => (
        <Card className="rg-kpi" key={i}>
          <div className="rg-kpitop">
            <span className="rg-kpilabel">{it.label}</span>
            <div className="rg-kpiicon" style={{ background: it.bg, color: it.fg }}><Ic name={it.icon} size={15} /></div>
          </div>
          <div className="rg-kpival mono">{it.val}</div>
          {it.delta}
        </Card>
      ))}
    </div>
  );
}

function Overview() {
  const { navigate, toast } = useApp();
  return (
    <>
      <SectionHead
        eyebrow="Live: memory engine reporting"
        title="Memory Command Center"
        sub="Persistent AI memory, contextual recall and knowledge-graph intelligence, in one view."
        actions={<>
          <button className="rg-btn" onClick={() => {
            const rows = MEMORY_DOMAINS.map((s) => `${s.name},${s.region},${s.status},${s.drift},${s.acc},${s.score}`).join("\n");
            downloadTextFile("recallsgrid-command-center-report.csv", "domain,store,status,recall_latency,drift_rate,anomaly_score\n" + rows);
            toast("Report exported.");
          }}><Ic name="download" size={15} />Export report</button>
          <button className="rg-btn rg-btnprimary" onClick={() => { navigate("integrations"); toast("Choose a source to connect."); }}><Ic name="plus" size={15} />Connect source</button>
        </>}
      />
      <KpiStrip />
      <div className="rg-gridmain"><MemoryPulse /><InsightsFeed /></div>
      <div className="rg-gridmain"><CognitivePipeline /><InfraGaugesSmall /></div>
      <DomainTable />
      <div className="rg-gridbottom"><IncidentsMini /><SavedQueriesTeaser /></div>
    </>
  );
}

function SavedQueriesTeaser() {
  const { navigate } = useApp();
  return (
    <Card className="rg-pad">
      <CardHead title="Frequent Recalls" desc="Most-used retrieval queries this week"
        right={<button className="rg-btn rg-btnsm" onClick={() => navigate("retrieval")}>Open console <Ic name="chevron" size={13} /></button>} />
      <div className="rg-listrows">
        {["What did the customer say about refund policy?", "Summarize onboarding steps for enterprise plan", "Prior incidents linked to auth-service outages", "Last quarter's churn drivers by segment"].map((q) => (
          <div className="rg-listrow" key={q}><span className="mono" style={{ fontSize: 12 }}>{q}</span><Ic name="search" size={13} /></div>
        ))}
      </div>
    </Card>
  );
}

/* ================================================================
   SECTION: Knowledge Graph Explorer
   ================================================================ */

function KnowledgeGraph() {
  const nodes = [
    { id: "cust", label: "Customer", x: 90, y: 110, status: "healthy" },
    { id: "ticket", label: "Support Ticket", x: 250, y: 40, status: "watch" },
    { id: "order", label: "Order", x: 250, y: 180, status: "healthy" },
    { id: "product", label: "Product", x: 430, y: 40, status: "healthy" },
    { id: "agent", label: "AI Agent", x: 430, y: 180, status: "critical" },
    { id: "policy", label: "Refund Policy", x: 600, y: 110, status: "watch" },
  ] as const;
  const edges = [["cust", "ticket"], ["cust", "order"], ["ticket", "agent"], ["order", "product"], ["agent", "policy"], ["ticket", "policy"]];
  const colorOf = (s: string) => s === "critical" ? "var(--crit)" : s === "watch" ? "var(--warn)" : "var(--good)";
  const find = (id: string) => nodes.find((n) => n.id === id)!;
  const { toast } = useApp();
  const [depth, setDepth] = useState(2);

  return (
    <>
      <SectionHead eyebrow="Knowledge Graph" title="Entity & Relationship Explorer" sub="How RecallsGrid links entities across your connected sources." />
      <Card className="rg-pad" style={{ marginBottom: 16 }}>
        <CardHead title="Live entity graph" desc="Support-conversations domain, depth-limited traversal" />
        <svg viewBox="0 0 680 220" style={{ width: "100%", height: 260 }}>
          {edges.map(([a, b], i) => { const A = find(a), B = find(b); return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--border)" strokeWidth={1.5} />; })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={30} fill="var(--surface-2)" stroke={colorOf(n.status)} strokeWidth={2} />
              <circle cx={n.x} cy={n.y} r={4} fill={colorOf(n.status)} />
              <text x={n.x} y={n.y + 46} textAnchor="middle" fontSize={11} fill="var(--text-dim)" fontFamily="Manrope, sans-serif">{n.label}</text>
            </g>
          ))}
        </svg>
        <div className="rg-sliderrow" style={{ marginTop: 6 }}>
          <span className="rg-carddesc" style={{ whiteSpace: "nowrap" }}>Traversal depth</span>
          <input type="range" min={1} max={4} value={depth} onChange={(e) => { setDepth(Number(e.target.value)); toast(`Traversal depth set to ${e.target.value}.`); }} className="rg-slider" />
          <span className="mono rg-sliderval">{depth} hops</span>
        </div>
      </Card>
      <div className="rg-gridmain">
        <Card className="rg-pad">
          <CardHead title="Strongest relationships" desc="Ranked by co-occurrence weight" />
          <div className="rg-listrows">
            {[
              { s: "Customer → Support Ticket", c: 96 },
              { s: "AI Agent → Refund Policy", c: 82 },
              { s: "Order → Product", c: 74 },
              { s: "Support Ticket → Refund Policy", c: 58 },
            ].map((r, i) => (
              <div className="rg-listrow" key={i}>
                <span>{r.s}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="rg-scorebar" style={{ width: 120 }}><div style={{ width: `${r.c}%`, background: r.c > 80 ? "var(--brand)" : r.c > 50 ? "var(--cyan)" : "var(--good)" }} /></div>
                  <span className="mono" style={{ fontSize: 11 }}>{r.c}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rg-pad">
          <CardHead title="Entity types tracked" desc="Across all connected sources" />
          <div className="rg-listrows">
            {[
              { n: "Customers", v: "8,204" }, { n: "Products", v: "412" },
              { n: "Support tickets", v: "22,910" }, { n: "Orders", v: "31,558" },
              { n: "Policies & documents", v: "1,204" },
            ].map((e) => (
              <div className="rg-listrow" key={e.n}><span>{e.n}</span><span className="mono">{e.v}</span></div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

/* ================================================================
   SECTION: Retrieval Engine (semantic search console)
   ================================================================ */

const RETRIEVAL_RESULTS = [
  { src: "support-conversations", snippet: "Customer asked about the 30-day refund window for annual plans and whether proration applies.", sim: 94 },
  { src: "product-documentation", snippet: "Refunds are issued within 5–7 business days once a cancellation request is confirmed.", sim: 88 },
  { src: "crm-entity-graph", snippet: "Account linked to 2 prior refund requests, both resolved without escalation.", sim: 76 },
  { src: "billing-records", snippet: "Last invoice shows a partial credit applied on March 14 for a service disruption.", sim: 61 },
];

function RetrievalEngine() {
  const { toast } = useApp();
  const [query, setQuery] = useState("What is our refund policy for enterprise customers?");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<typeof RETRIEVAL_RESULTS | null>(RETRIEVAL_RESULTS);
  const [topK, setTopK] = useState(4);

  function runQuery(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) { toast("Type a question to recall memory."); return; }
    setRunning(true);
    setTimeout(() => {
      setResults(RETRIEVAL_RESULTS.slice(0, topK));
      setRunning(false);
      toast("Recall complete.");
    }, 700);
  }

  return (
    <>
      <SectionHead eyebrow="Retrieval" title="Semantic Retrieval Console" sub="Ask a question, see what the memory engine recalls and why." />
      <Card className="rg-pad" style={{ marginBottom: 16 }}>
        <form onSubmit={runQuery}>
          <div className="rg-filterbar">
            <input className="rg-select" style={{ flex: 1, minWidth: 240 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask anything across your connected memory…" />
            <select className="rg-select" value={topK} onChange={(e) => setTopK(Number(e.target.value))}>
              {[3, 4, 5, 8].map((k) => <option key={k} value={k}>Top {k}</option>)}
            </select>
            <button className="rg-btn rg-btnprimary" type="submit" disabled={running}>{running ? "Recalling…" : <><Ic name="search" size={14} />Recall</>}</button>
          </div>
        </form>
      </Card>
      <Card className="rg-pad">
        <CardHead title="Recalled memory" desc={results ? `${results.length} matches, ranked by semantic similarity` : "Run a query to see results"} />
        <div className="rg-listrows">
          {(results || []).map((r, i) => (
            <div className="rg-listrow" key={i} style={{ alignItems: "flex-start" }}>
              <div style={{ maxWidth: "72%" }}>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)", marginBottom: 4 }}>{r.src}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{r.snippet}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div className="rg-scorebar" style={{ width: 70 }}><div style={{ width: `${r.sim}%`, background: r.sim > 85 ? "var(--brand)" : r.sim > 65 ? "var(--cyan)" : "var(--good)" }} /></div>
                <span className="mono" style={{ fontSize: 11 }}>{r.sim}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Memory Explorer (vector store)
   ================================================================ */

function MemoryExplorer() {
  const { toast } = useApp();
  const [domain, setDomain] = useState("All domains");
  const [range, setRange] = useState("24h");
  const [tag, setTag] = useState("");
  const cells = useMemo(() => Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => Math.random())), [domain, range]);

  return (
    <>
      <SectionHead eyebrow="Explore" title="Memory Explorer" sub="Browse vector memory clusters and their similarity patterns." />
      <Card className="rg-pad" style={{ marginBottom: 16 }}>
        <div className="rg-filterbar">
          <select className="rg-select" value={domain} onChange={(e) => setDomain(e.target.value)}>
            {["All domains", ...MEMORY_DOMAINS.map((d) => d.name)].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="rg-select" value={range} onChange={(e) => setRange(e.target.value)}>
            {["1h", "6h", "24h", "7d", "30d"].map((r) => <option key={r}>{r}</option>)}
          </select>
          <input className="rg-select" style={{ flex: 1, minWidth: 160 }} placeholder="Filter by tag: source:crm" value={tag} onChange={(e) => setTag(e.target.value)} />
          <button className="rg-btn rg-btnsm" onClick={() => toast(`Filtered to ${domain} · ${range}.`)}><Ic name="filter" size={13} />Apply</button>
        </div>
      </Card>
      <Card className="rg-pad" style={{ marginBottom: 16 }}>
        <CardHead title="Domain table" desc="Every knowledge domain currently indexed" />
        <div className="rg-tablewrap">
          <table className="rg-table">
            <thead><tr><th>Domain</th><th>Status</th><th>Nodes</th><th>Recall latency</th><th>Drift rate</th><th>Anomaly score</th></tr></thead>
            <tbody>
              {MEMORY_DOMAINS.map((s) => {
                const scoreColor = s.score > 70 ? "var(--crit)" : s.score > 35 ? "var(--warn)" : "var(--good)";
                return (
                  <tr className="rg-row" key={s.name}>
                    <td><div className="rg-svcname">{s.name}</div><div className="rg-svcsub mono">{s.region}</div></td>
                    <td><StatusPill status={s.status as any} /></td>
                    <td className="mono">{s.nodes}</td>
                    <td className="mono">{s.drift}</td>
                    <td className="mono">{s.acc}</td>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="rg-scorebar"><div style={{ width: `${s.score}%`, background: scoreColor }} /></div><span className="mono" style={{ fontSize: 11 }}>{s.score}</span></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="rg-pad">
        <CardHead title="Similarity heatmap" desc="Vector cluster activity by hour, last 7 days" />
        <div className="rg-heatdaylabels">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="rg-heatrowwrap">
          <div className="rg-heathours">{["00", "04", "08", "12", "16", "20"].map((h) => <span key={h}>{h}</span>)}</div>
          <div className="rg-heatmap">
            {cells.map((col, d) => (
              <div className="rg-heatcol" key={d}>
                {col.map((v, h) => {
                  let bg = "var(--surface-2)";
                  if (v > 0.93) bg = "var(--crit)"; else if (v > 0.8) bg = "var(--warn)"; else if (v > 0.6) bg = "var(--brand-dim)";
                  return <div className="rg-heatcell" style={{ background: bg }} key={h} title={`Day ${d + 1}, ${h}:00`} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Ingestion Pipeline
   ================================================================ */

const SOURCES = [
  { name: "Enterprise database", cat: "Structured", icon: "db", status: "healthy" },
  { name: "AI models & agents", cat: "Runtime", icon: "brain", status: "healthy" },
  { name: "Document repositories", cat: "Unstructured", icon: "doc", status: "watch" },
  { name: "Vector databases", cat: "Vector", icon: "layers", status: "healthy" },
  { name: "CRM system", cat: "Structured", icon: "crm", status: "healthy" },
  { name: "ERP system", cat: "Structured", icon: "server", status: "critical" },
  { name: "API data sources", cat: "Streaming", icon: "api", status: "healthy" },
  { name: "Conversation logs", cat: "Unstructured", icon: "chat", status: "watch" },
];

function IngestionPipeline() {
  const { toast } = useApp();
  return (
    <>
      <SectionHead eyebrow="Ingest" title="Ingestion Pipeline" sub="Every source feeding RecallsGrid's memory engine, and its sync health." />
      <div className="rg-intgrid">
        {SOURCES.map((it) => (
          <Card className="rg-pad rg-intcard" key={it.name}>
            <div className="rg-inticon"><Ic name={it.icon} size={18} /></div>
            <div style={{ flex: 1 }}>
              <div className="rg-svcname">{it.name}</div>
              <div className="rg-svcsub">{it.cat}</div>
            </div>
            <StatusPill status={it.status as any} />
          </Card>
        ))}
      </div>
      <Card className="rg-pad" style={{ marginTop: 16 }}>
        <CardHead title="Ingestion throughput" desc="Chunks embedded per minute, last hour"
          right={<button className="rg-btn rg-btnsm" onClick={() => toast("Manual sync triggered for all sources.")}><Ic name="ingest" size={13} />Sync now</button>} />
        <div className="rg-listrows">
          {[
            { n: "Documents chunked & embedded", v: "1,204 / min" },
            { n: "Conversation turns processed", v: "3,880 / min" },
            { n: "CRM records reconciled", v: "612 / min" },
            { n: "Failed / retried chunks", v: "18 / min" },
          ].map((r) => <div className="rg-listrow" key={r.n}><span>{r.n}</span><span className="mono">{r.v}</span></div>)}
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Infrastructure
   ================================================================ */

const NODES = [
  { name: "vec-node-a1", role: "vector-store", region: "ap-south-1a", cpu: 71, mem: 58, status: "watch" },
  { name: "vec-node-a2", role: "vector-store", region: "ap-south-1b", cpu: 44, mem: 39, status: "healthy" },
  { name: "graph-node-b1", role: "graph-store", region: "ap-south-1a", cpu: 88, mem: 92, status: "critical" },
  { name: "graph-node-b2", role: "graph-store", region: "ap-south-1b", cpu: 33, mem: 41, status: "healthy" },
  { name: "embed-gpu-c1", role: "gpu-embedding", region: "us-east-1a", cpu: 27, mem: 63, status: "healthy" },
  { name: "cache-node-d1", role: "context-cache", region: "us-east-1b", cpu: 52, mem: 77, status: "watch" },
] as const;

function Infrastructure() {
  return (
    <>
      <SectionHead eyebrow="Infrastructure" title="Infrastructure" sub="Every node powering vector storage, graph indexing and embedding." />
      <div className="rg-gridmain" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 16 }}>
        <Card className="rg-kpi"><div className="rg-kpilabel">Nodes online</div><div className="rg-kpival mono">142 / 146</div><Delta dir="flat">97.2% healthy</Delta></Card>
        <Card className="rg-kpi"><div className="rg-kpilabel">Clusters</div><div className="rg-kpival mono">9</div><Delta dir="up">3 regions</Delta></Card>
        <Card className="rg-kpi"><div className="rg-kpilabel">Avg GPU util.</div><div className="rg-kpival mono">58%</div><Delta dir="up">+6% today</Delta></Card>
        <Card className="rg-kpi"><div className="rg-kpilabel">Avg memory</div><div className="rg-kpival mono">61%</div><Delta dir="flat">stable</Delta></Card>
      </div>
      <Card className="rg-pad">
        <CardHead title="Node fleet" desc="Compute resources across regions" />
        <div className="rg-tablewrap">
          <table className="rg-table">
            <thead><tr><th>Node</th><th>Role</th><th>Region</th><th>CPU</th><th>Memory</th><th>Status</th></tr></thead>
            <tbody>
              {NODES.map((n) => (
                <tr className="rg-row" key={n.name}>
                  <td className="mono">{n.name}</td>
                  <td>{n.role}</td>
                  <td className="mono">{n.region}</td>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="rg-scorebar"><div style={{ width: `${n.cpu}%`, background: n.cpu > 80 ? "var(--crit)" : n.cpu > 60 ? "var(--warn)" : "var(--good)" }} /></div><span className="mono" style={{ fontSize: 11 }}>{n.cpu}%</span></div></td>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="rg-scorebar"><div style={{ width: `${n.mem}%`, background: n.mem > 80 ? "var(--crit)" : n.mem > 60 ? "var(--warn)" : "var(--good)" }} /></div><span className="mono" style={{ fontSize: 11 }}>{n.mem}%</span></div></td>
                  <td><StatusPill status={n.status as any} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Integrations
   ================================================================ */

const INTEGRATIONS = [
  { name: "Salesforce", cat: "CRM", icon: "crm" },
  { name: "PostgreSQL", cat: "Database", icon: "db" },
  { name: "Pinecone", cat: "Vector DB", icon: "layers" },
  { name: "Notion", cat: "Docs", icon: "doc" },
  { name: "Slack", cat: "Conversation logs", icon: "chat" },
  { name: "Zendesk", cat: "Support", icon: "bell" },
  { name: "SAP", cat: "ERP", icon: "server" },
  { name: "S3", cat: "Object storage", icon: "cloud" },
  { name: "REST API", cat: "Custom", icon: "api" },
];

function Integrations() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ Salesforce: true, PostgreSQL: true, Slack: true });
  return (
    <>
      <SectionHead eyebrow="Connect" title="Integrations" sub="Bring every knowledge source into one memory layer." />
      <div className="rg-intgrid">
        {INTEGRATIONS.map((it) => {
          const on = !!connected[it.name];
          return (
            <Card className="rg-pad rg-intcard" key={it.name}>
              <div className="rg-inticon"><Ic name={it.icon} size={18} /></div>
              <div style={{ flex: 1 }}>
                <div className="rg-svcname">{it.name}</div>
                <div className="rg-svcsub">{it.cat}</div>
              </div>
              <button className={`rg-btn rg-btnsm ${on ? "" : "rg-btnprimary"}`} onClick={() => setConnected((c) => ({ ...c, [it.name]: !on }))}>
                {on ? "Connected" : "Connect"}
              </button>
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* ================================================================
   SECTION: Reports
   ================================================================ */

const FREQ_OPTIONS = ["Daily · 09:00", "Weekly · Mondays 08:00", "Bi-weekly", "Monthly · 1st"];

function Reports() {
  const { toast } = useApp();
  const [reports, setReports] = useState([
    { name: "Weekly Memory Health Summary", freq: "Weekly · Mondays 08:00", last: "Jul 8, 2026" },
    { name: "Monthly Retrieval Accuracy Report", freq: "Monthly · 1st", last: "Jul 1, 2026" },
    { name: "Drift & Anomaly Digest", freq: "Daily · 09:00", last: "Today" },
    { name: "Knowledge Graph Growth Report", freq: "Bi-weekly", last: "Jun 28, 2026" },
  ]);
  const [editing, setEditing] = useState<string | null>(null);

  function scheduleReport() {
    const name = `Custom Report ${reports.length + 1}`;
    setReports((r) => [...r, { name, freq: "Weekly · Mondays 08:00", last: "Not yet sent" }]);
    toast(`${name} scheduled.`);
  }
  function download(r: { name: string; freq: string; last: string }) {
    downloadTextFile(`${r.name.replace(/\s+/g, "-").toLowerCase()}.txt`,
      `RecallsGrid report: ${r.name}\nSchedule: ${r.freq}\nLast sent: ${r.last}\n\nThis is a generated placeholder export.`);
    toast(`${r.name} downloaded.`);
  }
  return (
    <>
      <SectionHead eyebrow="Reports" title="Reports" sub="Scheduled and on-demand summaries for stakeholders."
        actions={<button className="rg-btn rg-btnprimary" onClick={scheduleReport}><Ic name="plus" size={15} />Schedule report</button>} />
      <Card className="rg-pad">
        <CardHead title="Scheduled reports" desc="Auto-generated and delivered" />
        <div className="rg-listrows">
          {reports.map((r) => (
            <div key={r.name}>
              <div className="rg-listrow">
                <div><div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div><div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{r.freq} · last sent {r.last}</div></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="rg-btn rg-btnsm" onClick={() => download(r)}><Ic name="download" size={13} />Download</button>
                  <button className="rg-btn rg-btnsm" onClick={() => setEditing(editing === r.name ? null : r.name)}>{editing === r.name ? "Close" : "Edit"}</button>
                </div>
              </div>
              {editing === r.name && (
                <div className="rg-filterbar" style={{ paddingBottom: 12 }}>
                  <select className="rg-select" value={r.freq} onChange={(e) => {
                    const freq = e.target.value;
                    setReports((rs) => rs.map((x) => (x.name === r.name ? { ...x, freq } : x)));
                  }}>
                    {FREQ_OPTIONS.map((f) => <option key={f}>{f}</option>)}
                  </select>
                  <button className="rg-btn rg-btnsm rg-btnprimary" onClick={() => { setEditing(null); toast(`${r.name} updated.`); }}>Save</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Developer API
   ================================================================ */

function randomKey() {
  const chars = "abcdef0123456789";
  let s = "rg_live_sk_";
  for (let i = 0; i < 32; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function DeveloperAPI() {
  const { toast } = useApp();
  const [revealed, setRevealed] = useState(false);
  const [key, setKey] = useState("rg_live_sk_4a2f8c1d9b7e6019a2f3c8b7d1e5a904");
  const masked = key.slice(0, 12) + "•".repeat(18) + key.slice(-4);
  return (
    <>
      <SectionHead eyebrow="Build" title="Developer API" sub="Pull memory writes, retrievals and graph data into your own tools." />
      <div className="rg-gridmain">
        <Card className="rg-pad">
          <CardHead title="API key" desc="Use this key to authenticate memory API requests" />
          <div className="rg-listrow" style={{ borderTop: "none", paddingTop: 0 }}>
            <span className="mono" style={{ fontSize: 12.5 }}>{revealed ? key : masked}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="rg-btn rg-btnsm" onClick={() => setRevealed((r) => !r)}><Ic name="eye" size={13} />{revealed ? "Hide" : "Reveal"}</button>
              <button className="rg-btn rg-btnsm" onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(key).catch(() => {});
                toast("API key copied.");
              }}><Ic name="copy" size={13} />Copy</button>
              <button className="rg-btn rg-btnsm" onClick={() => { setKey(randomKey()); setRevealed(false); toast("API key rotated. Update your integrations."); }}>Rotate</button>
            </div>
          </div>
        </Card>
        <Card className="rg-pad">
          <CardHead title="Docs" desc="Reference & guides" />
          <div className="rg-listrows">
            {["Quickstart", "Memory write API", "Semantic retrieval API", "Knowledge graph API", "Webhooks"].map((d) => (
              <div className="rg-listrow" key={d} onClick={() => toast(`${d}: docs coming soon.`)} style={{ cursor: "pointer" }}><span>{d}</span><Ic name="chevron" size={13} /></div>
            ))}
          </div>
          <span className="rg-nvidia" style={{ background: "var(--brand-dim)", color: "var(--brand)", borderColor: "transparent" }}>Full docs coming soon</span>
        </Card>
      </div>
      <Card className="rg-pad">
        <CardHead title="Example request" desc="Recall the top-4 most relevant memories for a query" />
        <pre className="rg-code mono">{`curl https://api.recallsgrid.com/v1/memory/recall \\
  -H "Authorization: Bearer ${masked}" \\
  -d '{"query":"refund policy for enterprise customers","top_k":4}'`}</pre>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Account / Settings  (frontend only)
   ================================================================ */

function AccountSettings() {
  const { toast } = useApp();
  const [name, setName] = useState("Harishan Sivalingam");
  const [email] = useState("harishan@recallsgrid.com");
  const [role, setRole] = useState("Founder · RecallsGrid Technologies");
  const [savedMsg, setSavedMsg] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSlack, setNotifSlack] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);

  const [sessions, setSessions] = useState([
    { id: 1, label: "Chrome · Colombo, LK", you: true },
    { id: 2, label: "Safari · San Francisco, US", you: false },
  ]);
  const [deactivated, setDeactivated] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setPhoto(reader.result as string); toast("Photo updated."); };
    reader.readAsDataURL(file);
  }
  function signOutSession(id: number) {
    setSessions((s) => s.filter((x) => x.id !== id));
    toast("Signed out of that device.");
  }
  function deactivateAccount() {
    if (window.confirm("Deactivate your account? This can't be undone here.")) {
      setDeactivated(true);
      toast("Account deactivated.");
    }
  }
  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavedMsg("Profile updated.");
    setTimeout(() => setSavedMsg(""), 2500);
  }
  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!curPw || !newPw || !confirmPw) { setPwMsg({ type: "error", text: "Fill in all password fields." }); return; }
    if (newPw.length < 8) { setPwMsg({ type: "error", text: "New password must be at least 8 characters." }); return; }
    if (newPw !== confirmPw) { setPwMsg({ type: "error", text: "New password and confirmation don't match." }); return; }
    setPwMsg({ type: "success", text: "Password changed successfully." });
    setCurPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwMsg(null), 3000);
  }

  return (
    <>
      <SectionHead eyebrow="Account" title="Settings" sub="Manage your profile, security and notification preferences." />
      <div className="rg-gridmain">
        <Card className="rg-pad">
          <CardHead title="Profile" desc="Your identity across RecallsGrid" />
          <form onSubmit={saveProfile}>
            <div className="rg-formrow">
              <div className="avatar" style={{ width: 56, height: 56, fontSize: 18, backgroundImage: photo ? `url(${photo})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
                {!photo && name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
              <button type="button" className="rg-btn rg-btnsm" onClick={() => fileInputRef.current?.click()}><Ic name="image" size={13} />Change photo</button>
            </div>
            <label className="rg-label">Full name</label>
            <input className="rg-input" value={name} onChange={(e) => setName(e.target.value)} />
            <label className="rg-label">Email address</label>
            <input className="rg-input" value={email} disabled />
            <label className="rg-label">Role</label>
            <input className="rg-input" value={role} onChange={(e) => setRole(e.target.value)} />
            <div className="rg-formfoot">
              {savedMsg && <span className="rg-msg rg-msgsuccess">{savedMsg}</span>}
              <button className="rg-btn rg-btnprimary" type="submit">Save changes</button>
            </div>
          </form>
        </Card>
        <Card className="rg-pad">
          <CardHead title="Change password" desc="Choose a strong password you don't use elsewhere" />
          <form onSubmit={changePassword}>
            <label className="rg-label">Current password</label>
            <input className="rg-input" type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} placeholder="••••••••" />
            <label className="rg-label">New password</label>
            <input className="rg-input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="At least 8 characters" />
            <label className="rg-label">Confirm new password</label>
            <input className="rg-input" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter new password" />
            <div className="rg-formfoot">
              {pwMsg && <span className={`rg-msg ${pwMsg.type === "error" ? "rg-msgerror" : "rg-msgsuccess"}`}>{pwMsg.text}</span>}
              <button className="rg-btn rg-btnprimary" type="submit">Update password</button>
            </div>
          </form>
        </Card>
      </div>
      <div className="rg-gridmain">
        <Card className="rg-pad">
          <CardHead title="Notifications" desc="Choose how RecallsGrid reaches you" />
          <div className="rg-listrow" style={{ borderTop: "none", paddingTop: 4 }}><span>Email alerts for critical memory alerts</span><Toggle checked={notifEmail} onChange={setNotifEmail} /></div>
          <div className="rg-listrow"><span>Slack notifications</span><Toggle checked={notifSlack} onChange={setNotifSlack} /></div>
          <div className="rg-listrow"><span>Weekly digest email</span><Toggle checked={notifDigest} onChange={setNotifDigest} /></div>
        </Card>
        <Card className="rg-pad">
          <CardHead title="Sessions" desc="Where you're signed in" />
          <div className="rg-listrows">
            {sessions.map((s) => (
              <div className="rg-listrow" key={s.id}>
                <span>{s.label}{s.you && <span style={{ color: "var(--good)", fontWeight: 600 }}> · This device</span>}</span>
                {s.you ? <span className="mono" style={{ fontSize: 11 }}>Active now</span> :
                  <button className="rg-btn rg-btnsm" onClick={() => signOutSession(s.id)}><Ic name="logout" size={13} />Sign out</button>}
              </div>
            ))}
            {sessions.length === 1 && <div style={{ fontSize: 12, color: "var(--text-faint)", paddingTop: 10 }}>No other active sessions.</div>}
          </div>
        </Card>
      </div>
      <Card className="rg-pad" style={{ borderColor: "var(--crit-dim)" }}>
        <CardHead title="Danger zone" desc="These actions are permanent" />
        <div className="rg-listrow" style={{ borderTop: "none", paddingTop: 4 }}>
          <span>Deactivate account{deactivated && <span style={{ color: "var(--crit)", fontWeight: 600 }}> · Deactivated</span>}</span>
          <button className="rg-btn" disabled={deactivated} style={{ color: "var(--crit)", borderColor: "var(--crit-dim)", opacity: deactivated ? 0.5 : 1 }} onClick={deactivateAccount}>
            <Ic name="trash" size={13} />{deactivated ? "Deactivated" : "Deactivate"}
          </button>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   Sidebar + Topbar
   ================================================================ */

const NAV_GROUPS: { group: string; items: { id: SectionId; label: string; icon: string; badge?: string; badgeColor?: string; live?: boolean }[] }[] = [
  { group: "Monitor", items: [
    { id: "overview", label: "Command Center", icon: "grid", live: true },
    { id: "graph", label: "Knowledge Graph", icon: "graph" },
    { id: "retrieval", label: "Retrieval Console", icon: "search" },
    { id: "memory", label: "Memory Explorer", icon: "brain" },
  ]},
  { group: "Operations", items: [
    { id: "ingestion", label: "Ingestion", icon: "ingest" },
    { id: "infra", label: "Infrastructure", icon: "server", badge: "1", badgeColor: "crit" },
    { id: "integrations", label: "Integrations", icon: "grid2" },
  ]},
  { group: "Account", items: [
    { id: "reports", label: "Reports", icon: "doc" },
    { id: "api", label: "Developer API", icon: "api" },
    { id: "account", label: "Settings", icon: "gear" },
  ]},
];
const NAV = NAV_GROUPS.flatMap((g) => g.items);

function Sidebar({ active, onNavigate, open, onClose, userEmail, onSignOut }: { active: SectionId; onNavigate: (s: SectionId) => void; open: boolean; onClose: () => void; userEmail?: string | null; onSignOut: () => void }) {
  return (
    <>
      <div className={`rg-overlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`rg-sidebar ${open ? "open" : ""}`}>
        <div className="rg-brand">
          <img src={logoSvg} alt="RecallsGrid" style={{ width: 132, height: 52, objectFit: "contain" }} />
        </div>
        <div style={{ height: 1, margin: "0 16px 8px", background: "linear-gradient(90deg, rgba(124,92,255,0.35), rgba(124,92,255,0.04))" }} />
        <nav className="rg-navscroll">
          {NAV_GROUPS.map((g) => (
            <div className="rg-navgroup" key={g.group}>
              <div className="rg-navlabel">{g.group}</div>
              {g.items.map((it) => (
                <a key={it.id} className={`rg-navitem ${active === it.id ? "active" : ""}`} onClick={() => onNavigate(it.id)}>
                  <Ic name={it.icon} size={17} />
                  {it.label}
                  {it.live && <span className="rg-livedot" />}
                  {it.badge && <span className="rg-badge" style={it.badgeColor === "crit" ? { background: "var(--crit-dim)", color: "var(--crit)" } : undefined}>{it.badge}</span>}
                </a>
              ))}
            </div>
          ))}
        </nav>
        <div className="rg-sidebarfoot">
          <div className="avatar">{userEmail ? userEmail.charAt(0).toUpperCase() : "U"}</div>
          <div><div className="rg-footname">{userEmail || "Signed in user"}</div><div className="rg-footrole">Firebase account</div></div>
        </div>
        <div style={{ padding: "12px 16px" }}>
          <button type="button" className="rg-btn rg-btnsm" onClick={onSignOut}><Ic name="logout" size={13} />Sign out</button>
        </div>
      </aside>
    </>
  );
}

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "crm-entity-graph accuracy drop", body: "Anomaly score up to 88, MEM-2031 opened.", time: "9m ago", read: false, kind: "warn" as const },
  { id: 2, title: "Recall drift detected", body: "Billing-disputes cluster recall accuracy dipped 6%.", time: "9m ago", read: false, kind: "warn" as const },
  { id: 3, title: "Context window extended", body: "Onboarding Assistant now spans 340 sessions.", time: "52m ago", read: false, kind: "predict" as const },
  { id: 4, title: "Weekly Memory Health Summary sent", body: "Delivered to your inbox.", time: "3h ago", read: false, kind: "good" as const },
];

function Topbar({ onMenu, section, theme, onToggleTheme, userEmail }: { onMenu: () => void; section: SectionId; theme: "dark" | "light"; onToggleTheme: () => void; userEmail?: string | null }) {
  const { toast, navigate } = useApp();
  const now = useLiveClock();
  const [latency, setLatency] = useState(212);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: SectionId; label: string }[]>([]);

  useEffect(() => {
    const id = setInterval(() => setLatency(180 + Math.round(Math.random() * 70)), 2600);
    return () => clearInterval(id);
  }, []);

  const label = NAV.find((i) => i.id === section)?.label || "Command Center";

  const handleSearchChange = (value: string) => {
    setQuery(value);
    const normalized = value.trim().toLowerCase();
    if (!normalized) { setSearchResults([]); return; }
    setSearchResults(NAV.filter((item) => item.label.toLowerCase().includes(normalized) || item.id.toLowerCase().includes(normalized)).slice(0, 6));
  };
  const activateSearchResult = (result: { id: SectionId; label: string }) => { navigate(result.id); setQuery(""); setSearchResults([]); };
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") { event.preventDefault(); if (searchResults.length > 0) activateSearchResult(searchResults[0]); }
    else if (event.key === "Escape") { setQuery(""); setSearchResults([]); }
  };

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);
  const unread = notifs.filter((n) => !n.read).length;
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) { if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false); }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="rg-topbar">
      <button className="rg-burger" onClick={onMenu} aria-label="Toggle menu"><Ic name="menu" size={20} /></button>
      <div className="rg-search" style={{ position: "relative" }}>
        <Ic name="search" size={15} />
        <input value={query} onChange={(e) => handleSearchChange(e.target.value)} onKeyDown={handleSearchKeyDown} placeholder={`Search ${label.toLowerCase()}…`} />
        <span className="rg-kbd">⌘K</span>
        {searchResults.length > 0 && (
          <div className="rg-searchpanel">
            {searchResults.map((result) => <button key={result.id} type="button" className="rg-searchitem" onClick={() => activateSearchResult(result)}>{result.label}</button>)}
          </div>
        )}
      </div>
      <div className="rg-topbarright">
        <div className="rg-pill"><span className="rg-pulsedot" /><span className="mono">{latency}ms recall</span></div>
        <div className="rg-liveclock">
          <span className="mono rg-clocktime">{now.toISOString().substr(11, 8)}</span>
          <span className="rg-clockdate">UTC · {now.toISOString().substr(0, 10)}</span>
        </div>
        <div className="rg-notifwrap" ref={notifRef}>
          <button className="rg-iconbtn" aria-label="Notifications" onClick={() => setNotifOpen((o) => !o)}>
            <Ic name="bell" size={16} />
            {unread > 0 && <span className="rg-notifcount">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="rg-notifpanel">
              <div className="rg-notifhead">
                <span>Notifications</span>
                {unread > 0 && <button className="rg-notifmarkall" onClick={() => setNotifs((n) => n.map((x) => ({ ...x, read: true })))}>Mark all read</button>}
              </div>
              <div className="rg-notiflist">
                {notifs.length === 0 && <div className="rg-notifempty">You're all caught up.</div>}
                {notifs.map((n) => {
                  const k = RECALL_KIND_STYLE[n.kind] || RECALL_KIND_STYLE.signal;
                  return (
                    <div key={n.id} className={`rg-notifitem ${n.read ? "read" : ""}`} onClick={() => setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}>
                      <div className="rg-feedic" style={{ background: k.bg, color: k.fg, width: 26, height: 26 }}><Ic name={k.icon} size={12} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="rg-feedtitle"><span>{n.title}</span><span className="rg-feedtime mono">{n.time}</span></div>
                        <div className="rg-feedbody">{n.body}</div>
                      </div>
                      {!n.read && <span className="rg-notifdot" />}
                    </div>
                  );
                })}
              </div>
              {notifs.length > 0 && <button className="rg-notifclearall" onClick={() => { setNotifs([]); toast("Notifications cleared."); }}>Clear all</button>}
            </div>
          )}
        </div>
        <button className="rg-iconbtn" aria-label="Toggle theme" onClick={onToggleTheme}><Ic name={theme === "dark" ? "sun" : "moon"} size={16} /></button>
        <div className="rg-userchip">
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 11.5 }}>{userEmail ? userEmail.charAt(0).toUpperCase() : "U"}</div>
          <div><div className="rg-username">Signed in user</div><div className="rg-usermail">{userEmail || "No email"}</div></div>
        </div>
      </div>
    </header>
  );
}

/* ================================================================
   Root component
   ================================================================ */

export function DashboardPage() {
  const [section, setSection] = useState<SectionId>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const { toasts, push } = useToasts();

  const navigate = (s: SectionId) => { setSection(s); setMobileOpen(false); };
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [section]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError("");

    if (authMode === "signup") {
      if (password !== confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
      if (passwordStrength.score < 2) {
        setAuthError("Use a stronger password with at least 8 characters and a number or symbol.");
        return;
      }
    }

    setAuthLoading(true);

    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      push(authMode === "signup" ? "Account created successfully." : "Signed in successfully.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      push("Signed in with Google.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Google sign-in failed.";
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    push("Signed out.");
  };

  const ctxValue = useMemo(() => ({ navigate, toast: push, theme }), [theme]);

  useLayoutEffect(() => {
    const cleanupChat = () => {
      document.querySelectorAll('[id*="tawk"], [class*="tawk"], iframe[src*="tawk.to"], script[src*="tawk.to"]').forEach((node) => node.remove());
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }
      if (window.Tawk_LoadStart) {
        delete window.Tawk_LoadStart;
      }
    };

    cleanupChat();
    const interval = window.setInterval(cleanupChat, 250);
    return () => {
      window.clearInterval(interval);
      cleanupChat();
    };
  }, []);

  const sectionMap: Record<SectionId, React.ReactNode> = {
    overview: <Overview />,
    graph: <KnowledgeGraph />,
    retrieval: <RetrievalEngine />,
    memory: <MemoryExplorer />,
    ingestion: <IngestionPipeline />,
    infra: <Infrastructure />,
    integrations: <Integrations />,
    reports: <Reports />,
    api: <DeveloperAPI />,
    account: <AccountSettings />,
  };

  if (!user) {
    return (
      <div className="rg-app" data-theme={theme} style={{ justifyContent: "center", alignItems: "center", padding: 24, position: "relative" }}>
        <style>{CSS}</style>
        <button
          type="button"
          onClick={() => window.location.assign("/")}
          style={{ position: "absolute", top: 20, left: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(15, 23, 42, 0.08)", background: "rgba(255,255,255,0.95)", color: "#334155", fontWeight: 700, fontSize: 13, boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)", zIndex: 2 }}
        >
          ← Back to home
        </button>
        <div style={{ width: "100%", maxWidth: 460, border: "1px solid rgba(15, 23, 42, 0.08)", borderRadius: 28, padding: 28, background: "linear-gradient(135deg, #ffffff 0%, #f7fbff 100%)", boxShadow: "0 24px 90px rgba(15, 23, 42, 0.12)", backdropFilter: "blur(14px)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <img src={logoSvg} alt="RecallsGrid" style={{ width: 180, height: 68, objectFit: "contain" }} />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <button type="button" onClick={() => setAuthMode("login")} style={{ flex: 1, borderRadius: 999, padding: "10px 12px", border: authMode === "login" ? "1px solid #2563eb" : "1px solid #e2e8f0", background: authMode === "login" ? "#eff6ff" : "#ffffff", color: authMode === "login" ? "#1d4ed8" : "#334155", fontWeight: 700 }}>
              Login
            </button>
            <button type="button" onClick={() => setAuthMode("signup")} style={{ flex: 1, borderRadius: 999, padding: "10px 12px", border: authMode === "signup" ? "1px solid #0f766e" : "1px solid #e2e8f0", background: authMode === "signup" ? "#f0fdfa" : "#ffffff", color: authMode === "signup" ? "#0f766e" : "#334155", fontWeight: 700 }}>
              Sign up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: "grid", gap: 12 }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email address" style={{ borderRadius: 14, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0f172a", padding: "12px 14px", outline: "none" }} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password" style={{ borderRadius: 14, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0f172a", padding: "12px 14px", outline: "none" }} />
            {authMode === "signup" ? (
              <>
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" required placeholder="Confirm password" style={{ borderRadius: 14, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0f172a", padding: "12px 14px", outline: "none" }} />
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
                    <span>Password strength</span>
                    <span style={{ color: passwordStrength.color, fontWeight: 700 }}>{passwordStrength.label}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(passwordStrength.score / 4) * 100}%`, background: passwordStrength.color, transition: "width 0.2s ease" }} />
                  </div>
                </div>
              </>
            ) : null}
            {authError ? <div style={{ color: "#ff8fa3", fontSize: 13 }}>{authError}</div> : null}
            <button type="submit" disabled={authLoading} style={{ borderRadius: 14, padding: "12px 14px", border: "none", background: "linear-gradient(90deg, #7c5cff, #22d3ee)", color: "white", fontWeight: 800 }}>
              {authLoading ? "Please wait..." : authMode === "signup" ? "Create account" : "Log in"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 12px", color: "#8ba0cc", fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            <span>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          </div>

          <button type="button" onClick={handleGoogleAuth} disabled={authLoading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 14, border: "1px solid #dadce0", background: "#ffffff", color: "#3c4043", padding: "12px 14px", fontWeight: 700, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.54 2.36 30.18 0 24 0 14.64 0 6.4 5.48 2.56 13.44l7.98 6.2C13.1 13.01 18.18 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24c0-1.56-.14-3.06-.4-4.5H24v8.5h12.9c-.56 2.98-2.2 5.5-4.7 7.2l7.3 5.67c4.25-3.91 6.7-9.67 6.7-16.87z" />
              <path fill="#FBBC05" d="M10.54 19.64l-7.98-6.2C.9 15.5 0 19.56 0 24c0 4.44.9 8.5 2.56 12.16l7.98-6.2c-1.1-3.2-1.1-6.72 0-9.92z" />
              <path fill="#34A853" d="M24 47.5c6.48 0 11.92-2.15 15.9-5.84l-7.3-5.67c-2.03 1.36-4.64 2.16-8.6 2.16-5.82 0-10.9-3.51-13.46-8.64l-7.98 6.2C6.4 42.52 14.64 47.5 24 47.5z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppCtx.Provider value={ctxValue}>
      <div className="rg-app" data-theme={theme}>
        <style>{CSS}</style>
        <Sidebar active={section} onNavigate={navigate} open={mobileOpen} onClose={() => setMobileOpen(false)} userEmail={user?.email} onSignOut={handleSignOut} />
        <div className="rg-main">
          <Topbar onMenu={() => setMobileOpen((o) => !o)} section={section} theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} userEmail={user?.email} />
          <main className="rg-content">
            {sectionMap[section]}
            <div className="rg-footernote">
              <span>RecallsGrid Memory Console · v1.0.0 · Region: ap-south-1</span>
              <span>
                <a href="https://www.facebook.com/recallsgrid" target="_blank" rel="noreferrer">Facebook</a>
                {' · '}
                <a href="https://www.youtube.com/@recallsgrid" target="_blank" rel="noreferrer">YouTube</a>
                {' · '}
                <a href="https://www.pinterest.com/recallsgrid/" target="_blank" rel="noreferrer">Pinterest</a>
                {' · '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("api"); }}>Developer API</a>
                {' · '}
                <a href="#" onClick={(e) => { e.preventDefault(); push("Docs coming soon."); }}>Docs (coming soon)</a>
                {' · '}
                <a href="#" onClick={(e) => { e.preventDefault(); push("All systems operational."); }}>Status page</a>
              </span>
            </div>
          </main>
        </div>
        <ToastStack toasts={toasts} />
      </div>
    </AppCtx.Provider>
  );
}

export default DashboardPage;

/* ================================================================
   Styles — cognitive indigo/cyan theme (design tokens below)
   ================================================================ */

const CSS = `
:root{
  /* ---- design tokens ---- */
  --bg:#07070d; --bg-1:#0a0a13; --surface:#0d0d1a; --surface-2:#12122200; --surface-2:#12122a; --surface-hover:#181832;
  --border:#232345; --border-soft:#191933;
  --text:#eceaf7; --text-dim:#9793b8; --text-faint:#615d82;

  --brand:#7c5cff; --brand-dim:#7c5cff22; --brand-glow:#7c5cff55;
  --cyan:#22d3ee; --cyan-dim:#22d3ee22;
  --warn:#f5a623; --warn-dim:#f5a62322;
  --crit:#ff4d6d; --crit-dim:#ff4d6d22;
  --good:#33e6a0; --good-dim:#33e6a022;

  --radius:14px;
  --font-display:'Manrope',sans-serif; --font-body:'Inter',sans-serif; --font-mono:'IBM Plex Mono',monospace;
}
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.rg-app,.rg-app *{box-sizing:border-box;}
.rg-app{
  font-family:var(--font-body); color:var(--text); min-height:100vh; -webkit-font-smoothing:antialiased;
  background:
    radial-gradient(ellipse 1100px 550px at 85% -10%, #1c1240 0%, transparent 60%),
    radial-gradient(ellipse 900px 500px at 0% 10%, #0d1f38 0%, transparent 55%),
    var(--bg);
  display:flex;
}
.rg-app a{color:inherit;text-decoration:none;cursor:pointer;}
.rg-app button{font-family:inherit;cursor:pointer;}
.mono{font-family:var(--font-mono);}

/* sidebar */
.rg-sidebar{ width:252px; flex-shrink:0; background:var(--bg-1); border-right:1px solid var(--border-soft); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; z-index:60; transition:transform .25s ease; }
.rg-brand{ display:flex; align-items:center; gap:10px; padding:18px 16px 12px; }
.rg-brandmark{ width:36px; height:36px; border-radius:10px; display:grid; place-items:center; color:#fff; background:linear-gradient(140deg,var(--brand),#3a1f8f); box-shadow:0 0 22px var(--brand-glow); flex-shrink:0; }
.rg-brandname{ font-family:var(--font-display); font-weight:700; font-size:15.5px; line-height:1.1; }
.rg-brandsub{ font-size:10px; color:var(--text-faint); text-transform:uppercase; letter-spacing:1.1px; margin-top:1px; }
.rg-navscroll{ flex:1; overflow-y:auto; padding:6px 12px 12px; }
.rg-navgroup{ margin-top:18px; }
.rg-navgroup:first-child{ margin-top:4px; }
.rg-navlabel{ font-size:10.5px; font-weight:600; color:var(--text-faint); text-transform:uppercase; letter-spacing:1.4px; padding:0 10px 8px; }
.rg-navitem{ display:flex; align-items:center; gap:11px; padding:9px 10px; border-radius:9px; font-size:13.5px; font-weight:500; color:var(--text-dim); position:relative; transition:background .15s,color .15s; }
.rg-navitem:hover{ background:var(--surface-hover); color:var(--text); }
.rg-navitem.active{ background:linear-gradient(90deg, var(--brand-dim), transparent); color:var(--text); }
.rg-navitem.active::before{ content:''; position:absolute; left:-12px; top:8px; bottom:8px; width:3px; background:var(--brand); border-radius:3px; }
.rg-sidebarfoot{ border-top:1px solid var(--border-soft); padding:14px 16px; display:flex; align-items:center; gap:10px; }
.rg-footname{ font-size:13px; font-weight:600; }
.rg-footrole{ font-size:11px; color:var(--text-faint); }

/* main column + topbar */
.rg-main{ flex:1; min-width:0; display:flex; flex-direction:column; }
.rg-topbar{ position:sticky; top:0; z-index:50; display:flex; align-items:center; gap:16px; padding:14px 28px; background:rgba(7,7,13,.82); backdrop-filter:blur(14px); border-bottom:1px solid var(--border-soft); }
.rg-burger{ display:none; background:none; border:none; color:var(--text-dim); padding:6px; }
.rg-search{ flex:1; max-width:380px; display:flex; align-items:center; gap:9px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:9px 12px; color:var(--text-faint); }
.rg-search input{ background:none; border:none; outline:none; color:var(--text); font-size:13px; width:100%; font-family:inherit; }
.rg-search input::placeholder{ color:var(--text-faint); }
.rg-searchpanel{ position:absolute; top:calc(100% + 8px); left:0; right:0; z-index:90; background:var(--surface); border:1px solid var(--border); border-radius:12px; box-shadow:0 20px 50px #000a; overflow:hidden; }
.rg-searchitem{ width:100%; text-align:left; padding:10px 14px; font-size:13px; color:var(--text); background:transparent; border:none; cursor:pointer; transition:background .15s; }
.rg-searchitem:hover{ background:var(--surface-hover); }
.rg-kbd{ font-family:var(--font-mono); font-size:10.5px; color:var(--text-faint); background:var(--surface-2); border:1px solid var(--border); padding:2px 6px; border-radius:5px; }
.rg-topbarright{ margin-left:auto; display:flex; align-items:center; gap:16px; }
.rg-liveclock{ display:flex; flex-direction:column; align-items:flex-end; line-height:1.25; }
.rg-clocktime{ font-size:12.5px; color:var(--text); }
.rg-clockdate{ font-size:10.5px; color:var(--text-faint); }
.rg-pill{ display:flex; align-items:center; gap:6px; font-size:11.5px; color:var(--text-dim); background:var(--surface); border:1px solid var(--border); padding:6px 11px; border-radius:20px; }
.rg-pulsedot{ width:7px; height:7px; border-radius:50%; background:var(--good); position:relative; flex-shrink:0; }
.rg-pulsedot::after{ content:''; position:absolute; inset:-4px; border-radius:50%; border:1px solid var(--good); animation:rgPulse 2s ease-out infinite; }
@keyframes rgPulse{ 0%{ transform:scale(.6); opacity:.9; } 100%{ transform:scale(1.9); opacity:0; } }
.rg-iconbtn{ position:relative; width:36px; height:36px; border-radius:10px; display:grid; place-items:center; background:var(--surface); border:1px solid var(--border); color:var(--text-dim); }
.rg-iconbtn:hover{ background:var(--surface-hover); color:var(--text); }
.rg-notifcount{ position:absolute; top:-5px; right:-5px; background:var(--crit); color:#fff; font-size:9.5px; font-weight:700; border-radius:20px; padding:1px 5px; border:2px solid var(--bg-1); }
.rg-userchip{ display:flex; align-items:center; gap:10px; padding-left:14px; border-left:1px solid var(--border-soft); }
.rg-username{ font-size:12.5px; font-weight:600; }
.rg-usermail{ font-size:10.5px; color:var(--text-faint); }
.avatar{ width:34px; height:34px; border-radius:50%; flex-shrink:0; background:linear-gradient(140deg,var(--brand),#3a1f8f); display:grid; place-items:center; font-family:var(--font-display); font-weight:700; font-size:13px; color:#fff; }

/* top pill nav (desktop) */
.rg-livedot{ margin-left:auto; width:6px; height:6px; border-radius:50%; background:var(--good); box-shadow:0 0 8px var(--good); }
.rg-badge{ margin-left:auto; font-size:10px; font-weight:700; background:var(--cyan-dim); color:var(--cyan); padding:1px 7px; border-radius:20px; }

/* content */
.rg-content{ padding:24px 28px 90px; max-width:1560px; width:100%; margin:0 auto; }
.rg-pagehead{ display:flex; align-items:flex-end; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-bottom:22px; }
.rg-eyebrow{ display:flex; align-items:center; gap:8px; font-size:11.5px; font-weight:600; color:var(--cyan); text-transform:uppercase; letter-spacing:1.4px; margin-bottom:8px; }
.rg-dot{ width:5px; height:5px; border-radius:50%; background:var(--cyan); }
.rg-title{ font-family:var(--font-display); font-size:27px; font-weight:800; letter-spacing:-.3px; }
.rg-sub{ color:var(--text-dim); font-size:13.5px; margin-top:6px; max-width:560px; }
.rg-actions{ display:flex; gap:10px; }
.rg-btn{ display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:600; padding:10px 16px; border-radius:10px; border:1px solid var(--border); background:var(--surface); color:var(--text); transition:background .15s; white-space:nowrap; }
.rg-btn:hover{ background:var(--surface-hover); }
.rg-btnsm{ padding:7px 12px; font-size:12px; }
.rg-btnprimary{ background:linear-gradient(135deg,var(--brand),#4a2ac9); border-color:transparent; color:#fff; }
.rg-btnprimary:hover{ filter:brightness(1.12); }

.rg-kpigrid{ display:grid; grid-template-columns:repeat(6,1fr); gap:14px; margin-bottom:22px; }
.rg-card{ background:var(--surface); border:1px solid var(--border-soft); border-radius:var(--radius); }
.rg-kpi{ padding:17px 18px; transition:border-color .2s,transform .2s; }
.rg-kpi:hover{ border-color:var(--border); transform:translateY(-2px); }
.rg-kpitop{ display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.rg-kpiicon{ width:30px; height:30px; border-radius:8px; display:grid; place-items:center; }
.rg-kpilabel{ font-size:11px; color:var(--text-faint); font-weight:500; }
.rg-kpival{ font-size:22px; font-weight:700; letter-spacing:-.5px; margin-bottom:8px; }
.rg-delta{ display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; padding:2px 7px; border-radius:20px; }
.rg-up{ color:var(--good); background:var(--good-dim); }
.rg-down{ color:var(--crit); background:var(--crit-dim); }
.rg-flat{ color:var(--warn); background:var(--warn-dim); }

.rg-gridmain{ display:grid; grid-template-columns:2fr 1fr; gap:16px; margin-bottom:16px; align-items:start; }
.rg-gridbottom{ display:grid; grid-template-columns:1.15fr 1fr; gap:16px; }
.rg-pad{ padding:20px 22px; }
.rg-cardhead{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:16px; }
.rg-cardtitle{ font-family:var(--font-display); font-size:15px; font-weight:700; }
.rg-carddesc{ font-size:12px; color:var(--text-faint); margin-top:3px; }
.rg-legend{ display:flex; gap:16px; margin-top:12px; flex-wrap:wrap; }
.rg-legenditem{ display:flex; align-items:center; gap:7px; font-size:11.5px; color:var(--text-dim); }
.rg-swatch{ width:14px; height:3px; border-radius:2px; display:inline-block; }

.rg-feed{ display:flex; flex-direction:column; gap:2px; max-height:404px; overflow-y:auto; padding-right:4px; }
.rg-feeditem{ display:flex; gap:11px; padding:12px 4px; border-bottom:1px solid var(--border-soft); }
.rg-feeditem:last-child{ border-bottom:none; }
.rg-feedic{ width:28px; height:28px; border-radius:8px; flex-shrink:0; display:grid; place-items:center; margin-top:1px; }
.rg-feedtitle{ font-size:12.5px; font-weight:600; display:flex; justify-content:space-between; gap:8px; }
.rg-feedtime{ font-size:10px; color:var(--text-faint); font-weight:500; flex-shrink:0; }
.rg-feedbody{ font-size:12px; color:var(--text-dim); margin-top:3px; line-height:1.5; }

.rg-pipeline{ display:flex; align-items:center; gap:0; overflow-x:auto; padding:10px 2px 4px; }
.rg-pipestep{ display:flex; flex-direction:column; align-items:center; gap:8px; min-width:98px; flex-shrink:0; }
.rg-pipeic{ width:44px; height:44px; border-radius:12px; display:grid; place-items:center; background:var(--surface-2); border:1px solid var(--border); color:var(--brand); }
.rg-pipelabel{ font-size:11px; text-align:center; color:var(--text-dim); font-weight:500; line-height:1.3; }
.rg-pipeconnector{ flex:1; height:2px; min-width:20px; background:linear-gradient(90deg,var(--border),var(--brand-dim),var(--border)); position:relative; top:-22px; }
.rg-nvidia{ display:inline-flex; align-items:center; gap:6px; margin-top:14px; font-size:10.5px; color:var(--good); background:var(--good-dim); border:1px solid #33e6a033; padding:5px 11px; border-radius:20px; font-weight:600; letter-spacing:.3px; }

.rg-gaugegrid{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.rg-gauge{ display:flex; flex-direction:column; align-items:center; gap:8px; padding:8px 0; }
.rg-gaugeval{ font-family:var(--font-mono); font-size:15px; font-weight:600; margin-top:-52px; }
.rg-gaugelabel{ font-size:11px; color:var(--text-faint); text-align:center; }

.rg-tablewrap{ overflow-x:auto; margin:0 -22px; padding:0 22px; }
.rg-table{ width:100%; border-collapse:collapse; font-size:12.5px; min-width:640px; }
.rg-table th{ text-align:left; font-size:10.5px; text-transform:uppercase; letter-spacing:.8px; color:var(--text-faint); font-weight:600; padding:0 12px 10px; }
.rg-table td{ padding:12px 12px; border-top:1px solid var(--border-soft); vertical-align:middle; }
.rg-row:hover td{ background:var(--surface-hover); }
.rg-svcname{ font-weight:600; font-size:13px; }
.rg-svcsub{ font-size:11px; color:var(--text-faint); }
.rg-status{ display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:600; padding:4px 10px; border-radius:20px; }
.rg-sdot{ width:6px; height:6px; border-radius:50%; }
.rg-status.rg-healthy{ background:var(--good-dim); color:var(--good); }
.rg-status.rg-healthy .rg-sdot{ background:var(--good); }
.rg-status.rg-watch{ background:var(--warn-dim); color:var(--warn); }
.rg-status.rg-watch .rg-sdot{ background:var(--warn); }
.rg-status.rg-critical{ background:var(--crit-dim); color:var(--crit); }
.rg-status.rg-critical .rg-sdot{ background:var(--crit); }
.rg-scorebar{ width:70px; height:5px; border-radius:5px; background:var(--surface-2); overflow:hidden; }
.rg-scorebar>div{ height:100%; border-radius:5px; }

.rg-heatdaylabels{ display:flex; gap:4px; margin-bottom:6px; margin-left:26px; }
.rg-heatdaylabels span{ width:15px; font-size:9.5px; color:var(--text-faint); text-align:center; }
.rg-heatrowwrap{ display:flex; gap:6px; overflow-x:auto; }
.rg-heathours{ display:flex; flex-direction:column; gap:4px; width:20px; }
.rg-heathours span{ height:15px; font-size:9px; color:var(--text-faint); line-height:15px; }
.rg-heatmap{ display:flex; gap:4px; }
.rg-heatcol{ display:flex; flex-direction:column; gap:4px; }
.rg-heatcell{ width:15px; height:15px; border-radius:4px; }

.rg-incident{ display:flex; gap:12px; padding:13px 0; border-bottom:1px solid var(--border-soft); }
.rg-incident:last-child{ border-bottom:none; }
.rg-incsev{ width:4px; border-radius:4px; flex-shrink:0; }
.rg-inctitle{ font-size:13px; font-weight:600; display:flex; justify-content:space-between; gap:10px; }
.rg-incmeta{ font-size:11px; color:var(--text-faint); margin-top:4px; display:flex; gap:10px; flex-wrap:wrap; }
.rg-inctag{ font-size:10px; font-weight:600; padding:2px 8px; border-radius:20px; }

.rg-filterbar{ display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
.rg-select{ background:var(--surface-2); border:1px solid var(--border); color:var(--text); border-radius:9px; padding:9px 12px; font-size:12.5px; font-family:inherit; outline:none; }
.rg-listrows{ display:flex; flex-direction:column; }
.rg-listrow{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 0; border-top:1px solid var(--border-soft); font-size:12.5px; }
.rg-listrows .rg-listrow:first-child{ border-top:none; }
.rg-sliderrow{ display:flex; align-items:center; gap:14px; }
.rg-slider{ flex:1; accent-color:var(--brand); }
.rg-sliderval{ font-size:13px; width:54px; text-align:right; }

.rg-intgrid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.rg-intcard{ display:flex; align-items:center; gap:12px; }
.rg-inticon{ width:38px; height:38px; border-radius:10px; background:var(--surface-2); border:1px solid var(--border); color:var(--brand); display:grid; place-items:center; flex-shrink:0; }

.rg-code{ background:var(--surface-2); border:1px solid var(--border); border-radius:10px; padding:16px 18px; font-size:12px; overflow-x:auto; color:var(--text-dim); line-height:1.6; }

.rg-formrow{ display:flex; align-items:center; gap:14px; margin-bottom:18px; }
.rg-label{ display:block; font-size:11.5px; font-weight:600; color:var(--text-faint); margin:14px 0 6px; text-transform:uppercase; letter-spacing:.6px; }
.rg-label:first-of-type{ margin-top:0; }
.rg-input{ width:100%; background:var(--surface-2); border:1px solid var(--border); color:var(--text); border-radius:9px; padding:10px 13px; font-size:13px; font-family:inherit; outline:none; transition:border-color .15s; }
.rg-input:focus{ border-color:var(--brand); }
.rg-input:disabled{ color:var(--text-faint); cursor:not-allowed; }
.rg-formfoot{ display:flex; align-items:center; justify-content:flex-end; gap:14px; margin-top:18px; }
.rg-msg{ font-size:12px; font-weight:600; }
.rg-msgsuccess{ color:var(--good); }
.rg-msgerror{ color:var(--crit); }

.rg-toggle{ width:42px; height:24px; border-radius:20px; background:var(--surface-2); border:1px solid var(--border); position:relative; padding:0; transition:background .15s; flex-shrink:0; }
.rg-toggle.on{ background:var(--brand); border-color:var(--brand); }
.rg-toggle-knob{ position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform .15s; }
.rg-toggle.on .rg-toggle-knob{ transform:translateX(18px); }

.rg-footernote{ margin-top:30px; padding-top:20px; border-top:1px solid var(--border-soft); display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; font-size:11.5px; color:var(--text-faint); }
.rg-footernote a:hover{ color:var(--brand); }

/* mobile sidebar overlay */
.rg-overlay{ display:none; position:fixed; inset:0; background:#000a; z-index:55; }
.rg-overlay.show{ display:block; }

/* notifications dropdown */
.rg-notifwrap{ position:relative; }
.rg-notifpanel{ position:absolute; top:calc(100% + 10px); right:0; width:340px; max-width:88vw; background:var(--surface); border:1px solid var(--border); border-radius:14px; box-shadow:0 20px 50px #000a; z-index:80; overflow:hidden; }
.rg-notifhead{ display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-bottom:1px solid var(--border-soft); font-size:13px; font-weight:600; }
.rg-notifmarkall{ background:none; border:none; color:var(--brand); font-size:11.5px; font-weight:600; }
.rg-notiflist{ max-height:320px; overflow-y:auto; }
.rg-notifitem{ display:flex; gap:10px; padding:12px 16px; border-bottom:1px solid var(--border-soft); cursor:pointer; position:relative; transition:background .15s; }
.rg-notifitem:hover{ background:var(--surface-hover); }
.rg-notifitem:last-child{ border-bottom:none; }
.rg-notifitem.read{ opacity:.55; }
.rg-notifdot{ position:absolute; top:14px; right:14px; width:7px; height:7px; border-radius:50%; background:var(--brand); }
.rg-notifempty{ padding:24px 16px; text-align:center; font-size:12.5px; color:var(--text-faint); }
.rg-notifclearall{ width:100%; padding:11px; background:none; border:none; border-top:1px solid var(--border-soft); font-size:12px; font-weight:600; color:var(--text-dim); }
.rg-notifclearall:hover{ background:var(--surface-hover); color:var(--text); }

/* toasts */
.rg-toaststack{ position:fixed; bottom:20px; right:20px; display:flex; flex-direction:column; gap:8px; z-index:100; }
.rg-toast{ display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); color:var(--text); font-size:12.5px; font-weight:500; padding:11px 16px; border-radius:10px; box-shadow:0 10px 30px #0008; animation:rgToastIn .2s ease; }
.rg-toast svg{ color:var(--good); flex-shrink:0; }
@keyframes rgToastIn{ from{ transform:translateY(8px); opacity:0; } to{ transform:translateY(0); opacity:1; } }

@media (max-width:1180px){
  .rg-kpigrid{ grid-template-columns:repeat(3,1fr); }
  .rg-gridmain{ grid-template-columns:1fr; }
  .rg-gridbottom{ grid-template-columns:1fr; }
  .rg-intgrid{ grid-template-columns:repeat(2,1fr); }
}
@media (max-width:860px){
  .rg-sidebar{ position:fixed; left:0; top:0; transform:translateX(-100%); box-shadow:0 0 40px #000c; }
  .rg-sidebar.open{ transform:translateX(0); }
  .rg-burger{ display:grid; place-items:center; }
  .rg-search{ display:none; }
  .rg-content{ padding:18px 16px 50px; }
  .rg-topbar{ padding:12px 14px; top:0; }
  .rg-userchip .rg-username,.rg-userchip .rg-usermail{ display:none; }
  .rg-liveclock{ display:none; }
}
@media (max-width:640px){
  .rg-kpigrid{ grid-template-columns:repeat(2,1fr); }
  .rg-title{ font-size:22px; }
  .rg-actions{ width:100%; }
  .rg-actions .rg-btn{ flex:1; justify-content:center; }
  .rg-intgrid{ grid-template-columns:1fr; }
  .rg-brandsub{ display:none; }
}
@media (max-width:420px){
  .rg-kpigrid{ grid-template-columns:1fr 1fr; }
  .rg-pad{ padding:16px; }
}

/* light theme override */
.rg-app[data-theme="light"]{
  --bg:#f5f4fb; --bg-1:#ffffff; --surface:#ffffff; --surface-2:#eeecf8; --surface-hover:#e6e3f5;
  --border:#dcd8ee; --border-soft:#e7e4f6;
  --text:#161327; --text-dim:#5c5580; --text-faint:#8f89ac;
  --good-dim:#33e6a020; --warn-dim:#f5a62320; --crit-dim:#ff4d6d18; --cyan-dim:#22d3ee18; --brand-dim:#7c5cff14;
}
.rg-app[data-theme="light"]{
  background:
    radial-gradient(ellipse 1100px 550px at 85% -10%, #e7e0ff 0%, transparent 60%),
    radial-gradient(ellipse 900px 500px at 0% 10%, #dcefff 0%, transparent 55%),
    var(--bg);
}
.rg-app[data-theme="light"] .rg-topbar{ background:rgba(245,244,251,.85); }
.rg-app[data-theme="light"] .avatar{ color:#fff; }

@media (prefers-reduced-motion: reduce){ .rg-app *{ animation:none!important; transition:none!important; } }
`;