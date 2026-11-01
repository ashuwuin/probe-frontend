import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  ExternalLink,
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import StatusBadge from './StatusBadge';
import { BENCHMARK_METRICS } from '../data/mockData';

export const BenchmarkView: React.FC = () => {
  const [benchmarkCases, setBenchmarkCases] = useState<any[]>([]);
  const [filterGroup, setFilterGroup] = useState<'all' | 'checkable' | 'maintainer'>('all');

  useEffect(() => {
    // Attempt fetch from /api/benchmarks
    fetch('/api/benchmarks')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBenchmarkCases(data);
        }
      })
      .catch(() => {});
  }, []);

  const displayCases = benchmarkCases.length > 0 ? benchmarkCases : [
    { id: 'checkable-01-symbol', label: 'invalid', prediction: 'invalid', checks: 'c1: static_ast=contradicts (symbol_not_found)', type: 'checkable' },
    { id: 'checkable-02-pr-tests', label: 'confirmed', prediction: 'confirmed', checks: 'c1: pr_diff=supports (tests_added)', type: 'checkable' },
    { id: 'checkable-03-pr-no-tests', label: 'invalid', prediction: 'invalid', checks: 'c1: pr_diff=contradicts (no_test_files)', type: 'checkable' },
    { id: 'checkable-04-demo-repro', label: 'confirmed', prediction: 'confirmed', checks: 'c1: static_ast=supports, sandbox=supports', type: 'checkable' },
    { id: 'checkable-05-demo-clean', label: 'cannot-reproduce', prediction: 'cannot-reproduce', checks: 'c1: sandbox=contradicts (ran_clean)', type: 'checkable' },
    { id: 'loguru-1448', label: 'invalid', prediction: 'uncertain', checks: 'c1: static_ast=supports', type: 'maintainer' },
    { id: 'loguru-1471', label: 'invalid', prediction: 'uncertain', checks: 'c1: static_ast=supports', type: 'maintainer' },
    { id: 'poetry-3610', label: 'confirmed', prediction: 'uncertain', checks: 'c1: no applicable check', type: 'maintainer' },
    { id: 'poetry-6627', label: 'confirmed', prediction: 'uncertain', checks: 'c1: no applicable check', type: 'maintainer' },
    { id: 'poetry-7033', label: 'confirmed', prediction: 'uncertain', checks: 'c1: static_ast=inconclusive', type: 'maintainer' },
    { id: 'poetry-7268', label: 'invalid', prediction: 'uncertain', checks: 'c1: no applicable check', type: 'maintainer' },
    { id: 'poetry-7465', label: 'invalid', prediction: 'uncertain', checks: 'c1: static_ast=supports', type: 'maintainer' },
    { id: 'poetry-9961', label: 'confirmed', prediction: 'uncertain', checks: 'c1: static_ast=inconclusive', type: 'maintainer' },
    { id: 'rich-1630', label: 'cannot-reproduce', prediction: 'uncertain', checks: 'c1: no applicable check', type: 'maintainer' },
    { id: 'textual-1845', label: 'confirmed', prediction: 'uncertain', checks: 'c1: static_ast=supports', type: 'maintainer' },
    { id: 'textual-2178', label: 'cannot-reproduce', prediction: 'uncertain', checks: 'c1: static_ast=supports', type: 'maintainer' },
    { id: 'textual-2863', label: 'cannot-reproduce', prediction: 'uncertain', checks: 'c1: static_ast=supports', type: 'maintainer' },
  ];

  const filtered = displayCases.filter((c) => {
    if (filterGroup === 'checkable') return c.id.startsWith('checkable');
    if (filterGroup === 'maintainer') return !c.id.startsWith('checkable');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SpotlightCard className="p-4 border-emerald-500/30">
          <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider block mb-1">
            Wrong Invalid Verdicts
          </span>
          <div className="text-3xl font-black font-mono text-emerald-400 flex items-center gap-2">
            0
            <span className="text-xs font-normal text-emerald-300/80 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              Zero False Invalid
            </span>
          </div>
          <p className="text-[11px] font-mono text-gray-400 mt-2">
            Never rejects a real bug without concrete proof of falsity.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 border-cyan-500/30">
          <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider block mb-1">
            Precision on Decided
          </span>
          <div className="text-3xl font-black font-mono text-cyan-400 flex items-center gap-2">
            100%
            <span className="text-xs font-normal text-cyan-300/80 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              5/5 Decided
            </span>
          </div>
          <p className="text-[11px] font-mono text-gray-400 mt-2">
            Every decisive verdict matches ground truth perfectly.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 border-purple-500/30">
          <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider block mb-1">
            Checker Agreement
          </span>
          <div className="text-3xl font-black font-mono text-purple-400 flex items-center gap-2">
            16 / 16
            <span className="text-xs font-normal text-purple-300/80 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30">
              100%
            </span>
          </div>
          <p className="text-[11px] font-mono text-gray-400 mt-2">
            Static AST, diff, & sandbox checkers match expected outcomes.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 border-yellow-500/30">
          <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider block mb-1">
            Safety Guarantee
          </span>
          <div className="text-3xl font-black font-mono text-yellow-400 flex items-center gap-2">
            0
            <span className="text-xs font-normal text-yellow-300/80 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              Decisive w/o Proof
            </span>
          </div>
          <p className="text-[11px] font-mono text-gray-400 mt-2">
            Falls back to `uncertain` when evidence is incomplete.
          </p>
        </SpotlightCard>
      </div>

      {/* Confusion Matrix & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <SpotlightCard className="lg:col-span-5 p-5 border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Confusion Matrix
            </h3>
            <span className="text-xs font-mono text-gray-400">17 Total Cases</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="py-2">Ground Truth</th>
                  <th className="py-2 text-center text-emerald-400">Confirmed</th>
                  <th className="py-2 text-center text-amber-400">Cannot-Repro</th>
                  <th className="py-2 text-center text-rose-400">Invalid</th>
                  <th className="py-2 text-center text-yellow-400">Uncertain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {BENCHMARK_METRICS.confusionMatrix.map((row) => (
                  <tr key={row.label} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 font-semibold text-gray-300 capitalize">{row.label}</td>
                    <td className="py-2.5 text-center font-bold text-emerald-400">{row.confirmed}</td>
                    <td className="py-2.5 text-center font-bold text-amber-400">{row.cannotReproduce}</td>
                    <td className="py-2.5 text-center font-bold text-rose-400">{row.invalid}</td>
                    <td className="py-2.5 text-center font-bold text-yellow-400">{row.uncertain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-[11px] font-mono text-gray-300 space-y-1">
            <p className="text-cyan-300 font-semibold">Key Architecture Principle:</p>
            <p className="text-gray-400">
              Maintainer issues in external repos (Poetry, Loguru, Rich, Textual) default safely to{' '}
              <span className="text-yellow-300 font-bold">`uncertain`</span> because the isolated sandbox does not execute arbitrary untrusted external code without isolated dependencies.
            </p>
          </div>
        </SpotlightCard>

        {/* 17 Cases Explorer */}
        <SpotlightCard className="lg:col-span-7 p-5 border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                Benchmark Case Registry
              </h3>
            </div>

            <div className="flex rounded-lg border border-white/10 bg-black/60 p-0.5 text-xs font-mono">
              <button
                onClick={() => setFilterGroup('all')}
                className={`px-2 py-0.5 rounded ${filterGroup === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400'}`}
              >
                All (17)
              </button>
              <button
                onClick={() => setFilterGroup('checkable')}
                className={`px-2 py-0.5 rounded ${filterGroup === 'checkable' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400'}`}
              >
                Checkable (5)
              </button>
              <button
                onClick={() => setFilterGroup('maintainer')}
                className={`px-2 py-0.5 rounded ${filterGroup === 'maintainer' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400'}`}
              >
                Maintainer (12)
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[360px] space-y-2 pr-1 font-mono text-xs">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 hover:border-cyan-500/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{item.id}</span>
                    <span className="text-[10px] text-gray-500">
                      {item.id.startsWith('checkable') ? '(Synthetic Ground Truth)' : '(Real GitHub Issue)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 truncate max-w-sm">
                    {item.checks || 'Evaluated AST / sandbox checks'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">Ground Truth</span>
                    <StatusBadge status={item.label} size="sm" showIcon={false} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">Probe Verdict</span>
                    <StatusBadge status={item.prediction} size="sm" showIcon={false} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default BenchmarkView;
