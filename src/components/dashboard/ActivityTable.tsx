import React, { useMemo, useState, memo } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  ChevronDownIcon } from
'lucide-react';
interface Activity {
  query: string;
  memory: string;
  confidence: number;
  time: string;
}
const DATA: Activity[] = [
{
  query: 'What is our refund policy?',
  memory: 'Terms of Service v2.4 · Section 3',
  confidence: 99.8,
  time: '2 min ago'
},
{
  query: 'How do I reset a password?',
  memory: 'User Guide · Account Management',
  confidence: 98.5,
  time: '15 min ago'
},
{
  query: 'Latest Q3 revenue numbers',
  memory: 'Q3 Financial Report 2026',
  confidence: 95.2,
  time: '1 hr ago'
},
{
  query: 'API rate limits',
  memory: 'Developer Docs · Rate Limiting',
  confidence: 99.1,
  time: '3 hrs ago'
},
{
  query: 'SSO configuration steps',
  memory: 'Admin Handbook · Identity',
  confidence: 91.4,
  time: '4 hrs ago'
},
{
  query: 'Data retention window',
  memory: 'Compliance Policy · GDPR',
  confidence: 88.7,
  time: '5 hrs ago'
},
{
  query: 'Enterprise onboarding flow',
  memory: 'Playbook · Customer Success',
  confidence: 96.9,
  time: '6 hrs ago'
},
{
  query: 'Vector index rebuild time',
  memory: 'Runbook · Infra Ops',
  confidence: 93.3,
  time: '8 hrs ago'
},
{
  query: 'Model fine-tuning cadence',
  memory: 'ML Ops Notes · Ranking',
  confidence: 84.1,
  time: '10 hrs ago'
},
{
  query: 'Support escalation matrix',
  memory: 'Support KB · Tier 2',
  confidence: 97.5,
  time: '12 hrs ago'
},
{
  query: 'Billing cycle change',
  memory: 'Finance FAQ · Subscriptions',
  confidence: 90.2,
  time: '1 day ago'
},
{
  query: 'Webhook retry behavior',
  memory: 'Developer Docs · Webhooks',
  confidence: 99.4,
  time: '1 day ago'
}];

const FILTERS = [
{
  label: 'All confidence',
  min: 0
},
{
  label: '90%+ only',
  min: 90
},
{
  label: '95%+ only',
  min: 95
},
{
  label: '99%+ only',
  min: 99
}];

const PAGE_SIZE = 5;
export function ActivityTable({ search }: {search: string;}) {
  const [localSearch, setLocalSearch] = useState('');
  const [filterIdx, setFilterIdx] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const effectiveSearch = (search || localSearch).toLowerCase();
  const filtered = useMemo(() => {
    return DATA.filter(
      (d) =>
      d.confidence >= FILTERS[filterIdx].min && (
      d.query.toLowerCase().includes(effectiveSearch) ||
      d.memory.toLowerCase().includes(effectiveSearch))
    );
  }, [effectiveSearch, filterIdx]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE
  );
  return (
    <div className="rg-glass overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-4 border-b border-white/40 p-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-rg-heading">
          Recent Retrieval Activity
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rg-body/50" />
            <input
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search activity..."
              className="w-full rounded-full border border-white/60 bg-white/50 py-1.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-rg-blue/30 sm:w-48" />
            
          </div>
          <div className="relative">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/50 px-3 py-1.5 text-sm font-medium text-rg-heading hover:bg-white">
              
              {FILTERS[filterIdx].label}
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {filterOpen &&
            <div className="rg-glass-strong absolute right-0 top-11 z-10 w-40 rounded-xl p-1.5">
                {FILTERS.map((f, i) =>
              <button
                key={f.label}
                onClick={() => {
                  setFilterIdx(i);
                  setFilterOpen(false);
                  setPage(0);
                }}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-rg-heading/5 ${filterIdx === i ? 'font-semibold text-rg-blue' : 'text-rg-heading'}`}>
                
                    {f.label}
                  </button>
              )}
              </div>
            }
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/30 text-xs uppercase text-rg-body">
            <tr>
              <th className="px-6 py-3 font-semibold">Query</th>
              <th className="px-6 py-3 font-semibold">Matched Memory</th>
              <th className="px-6 py-3 font-semibold">Confidence</th>
              <th className="px-6 py-3 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {rows.length === 0 ?
            <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-rg-body">
                  No matching retrieval events.
                </td>
              </tr> :

            rows.map((row, i) =>
            <tr key={i} className="transition-colors hover:bg-white/40">
                  <td className="px-6 py-4 font-medium text-rg-heading">
                    {row.query}
                  </td>
                  <td className="px-6 py-4 text-rg-body">{row.memory}</td>
                  <td className="px-6 py-4">
                    <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${row.confidence >= 95 ? 'bg-rg-blue/10 text-rg-blue' : row.confidence >= 90 ? 'bg-rg-violet/10 text-rg-violet' : 'bg-rg-heading/5 text-rg-body'}`}>
                  
                      {row.confidence.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-rg-body/70">
                    {row.time}
                  </td>
                </tr>
            )
            }
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-white/40 p-4 text-sm text-rg-body">
        <span>
          {filtered.length === 0 ?
          'No results' :
          `Showing ${safePage * PAGE_SIZE + 1}–${Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-white/60 disabled:opacity-40">
            
            <ChevronLeftIcon className="h-4 w-4" /> Prev
          </button>
          <span className="px-2 font-semibold text-rg-heading">
            {safePage + 1} / {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-white/60 disabled:opacity-40">
            
            Next <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>);

}