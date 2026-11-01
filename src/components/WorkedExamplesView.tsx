import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  FileCode,
  Terminal,
  ShieldCheck,
  GitPullRequest,
  ExternalLink,
  Code2,
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import StatusBadge from './StatusBadge';
import { WORKED_EXAMPLES, WorkedExample } from '../data/mockData';

export const WorkedExamplesView: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<WorkedExample>(WORKED_EXAMPLES[0]);

  return (
    <div className="space-y-6">
      {/* Example Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {WORKED_EXAMPLES.map((ex, index) => {
          const isSelected = selectedExample.id === ex.id;
          return (
            <button
              key={ex.id}
              onClick={() => setSelectedExample(ex)}
              className={`p-3.5 rounded-xl border text-left transition-all font-mono relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-cyan-400">CASE 0{index + 1}</span>
                <StatusBadge status={ex.expected_overall} size="sm" showIcon={false} />
              </div>
              <h4 className="text-xs font-semibold text-white truncate mb-1">
                {ex.title}
              </h4>
              <p className="text-[10px] text-gray-400 line-clamp-1">
                {ex.repo.local || ex.repo.github}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detail Showcase */}
      <SpotlightCard className="p-6 border-cyan-500/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                Case Study {selectedExample.id}
              </span>
              <span className="text-gray-500 font-mono">/</span>
              <span className="text-xs font-mono text-gray-400">
                {selectedExample.repo.local ? `Local Demo: ${selectedExample.repo.local}` : `GitHub: ${selectedExample.repo.github}`}
              </span>
            </div>
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-3">
              {selectedExample.title}
              <StatusBadge status={selectedExample.expected_overall} size="md" />
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ground Truth Matches: 100%</span>
            </div>
          </div>
        </div>

        {/* Provenance Explainer */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 font-mono text-xs text-gray-300 mb-6 flex items-start gap-3">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-cyan-300">Motivation & Provenance: </span>
            {selectedExample.provenance}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Text and Repro */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  Submitted Issue / PR Content
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-xs font-mono text-gray-300 whitespace-pre-wrap max-h-[320px] overflow-y-auto leading-relaxed">
                {selectedExample.input_content}
              </pre>
            </div>

            {selectedExample.diff_content && (
              <div>
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wide block mb-2 flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5" />
                  Pull Request Unified Diff
                </span>
                <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-xs font-mono text-emerald-300/90 whitespace-pre-wrap max-h-[220px] overflow-y-auto leading-relaxed">
                  {selectedExample.diff_content}
                </pre>
              </div>
            )}
          </div>

          {/* Right: Concrete Evidence Checks & Bot Output */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wide block mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Concrete Verification Checks
              </span>
              <div className="space-y-2.5">
                {selectedExample.checks.map((chk, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                          {chk.claim_id}
                        </span>
                        <span className="text-purple-300 uppercase">{chk.checker}</span>
                      </div>
                      <span
                        className={`text-xs uppercase font-bold px-2 py-0.5 rounded border ${
                          chk.outcome === 'supports'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : chk.outcome === 'contradicts'
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                            : 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300'
                        }`}
                      >
                        {chk.outcome}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">{chk.evidence}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono font-semibold text-gray-300 uppercase tracking-wide block mb-2 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                Generated Markdown Bot Comment
              </span>
              <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-xs font-mono text-cyan-200 whitespace-pre-wrap max-h-[300px] overflow-y-auto leading-relaxed">
                {selectedExample.output_markdown}
              </pre>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default WorkedExamplesView;
