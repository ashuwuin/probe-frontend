import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Lock,
  Terminal,
  FileCode,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Boxes,
  Workflow,
  Sparkles,
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import StatusBadge from './StatusBadge';

export const ArchitectureView: React.FC = () => {
  // Interactive Truth Table Simulator state
  const [claimType, setClaimType] = useState<'bug_behavior' | 'symbol_exists' | 'security_vuln' | 'pr_adds_tests'>('bug_behavior');
  const [astOutcome, setAstOutcome] = useState<'supports' | 'contradicts' | 'inconclusive' | 'none'>('supports');
  const [sandboxOutcome, setSandboxOutcome] = useState<'supports' | 'contradicts' | 'inconclusive' | 'none'>('supports');
  const [prDiffOutcome, setPrDiffOutcome] = useState<'supports' | 'contradicts' | 'inconclusive' | 'none'>('none');
  const [isLlmExtraction, setIsLlmExtraction] = useState<boolean>(true);

  // Compute simulated verdict based on Probe's rules
  let simulatedVerdict = 'uncertain';
  let ruleName = 'Default Fallback';
  let ruleExplanation = 'Without decisive evidence, Probe prefers `uncertain` to avoid misleading developers.';

  if (claimType === 'bug_behavior') {
    if (sandboxOutcome === 'supports') {
      simulatedVerdict = 'confirmed';
      ruleName = 'Rule 1: Sandbox Failure Reproduced';
      ruleExplanation = 'Sandbox reproduction ran the reported test snippet and reproduced the exact failure.';
    } else if (sandboxOutcome === 'contradicts') {
      simulatedVerdict = 'cannot-reproduce';
      ruleName = 'Rule 2: Sandbox Ran Cleanly';
      ruleExplanation = 'The reproduction snippet ran with exit code 0 without raising the reported exception.';
    } else if (astOutcome === 'contradicts') {
      if (isLlmExtraction) {
        simulatedVerdict = 'invalid';
        ruleName = 'Rule 3: Named Symbol Does Not Exist (LLM Extraction)';
        ruleExplanation = 'AST scanned all repo files and verified the target symbol does not exist.';
      } else {
        simulatedVerdict = 'uncertain';
        ruleName = 'Rule 3b: Regex Fallback Downgrade Safeguard';
        ruleExplanation = 'Regex fallback cannot definitively invalidate symbols; safely downgraded to uncertain.';
      }
    }
  } else if (claimType === 'symbol_exists') {
    if (astOutcome === 'supports') {
      simulatedVerdict = 'confirmed';
      ruleName = 'Rule 4: Symbol Verified by AST';
      ruleExplanation = 'AST found function/class/method definition in repository syntax tree.';
    } else if (astOutcome === 'contradicts') {
      simulatedVerdict = isLlmExtraction ? 'invalid' : 'uncertain';
      ruleName = 'Rule 5: Symbol Missing from AST';
      ruleExplanation = 'Symbol is missing from repository code.';
    }
  } else if (claimType === 'pr_adds_tests') {
    if (prDiffOutcome === 'supports') {
      simulatedVerdict = 'confirmed';
      ruleName = 'Rule 6: Test Functions Added in Diff';
      ruleExplanation = 'Unified diff includes modifications to test files with new test functions.';
    } else if (prDiffOutcome === 'contradicts') {
      simulatedVerdict = 'invalid';
      ruleName = 'Rule 7: Claimed Tests Missing from Diff';
      ruleExplanation = 'PR claims tests were added, but no test files were touched in the diff.';
    }
  }

  return (
    <div className="space-y-6">
      {/* 4 Pillars of Probe Defense */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SpotlightCard className="p-4 border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2">
            <Lock className="w-4 h-4" />
            1. Auth & Bot Guard
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">Cryptographic Webhooks</h4>
          <p className="text-xs font-mono text-gray-400 leading-relaxed">
            HMAC-SHA256 signature verification on every payload. Bot comment editing guard verifies <code className="text-cyan-300">REPORT_MARKER</code> and bot login to prevent impersonation.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase mb-2">
            <Cpu className="w-4 h-4" />
            2. Anti-Hallucination
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">Exact Quote Anchoring</h4>
          <p className="text-xs font-mono text-gray-400 leading-relaxed">
            Claims extracted via local <code className="text-purple-300">qwen3:8b</code> with <code className="text-purple-300">"think": false</code>. Every claim must quote verbatim text from the issue or PR.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
            <Boxes className="w-4 h-4" />
            3. Zero-Network Sandbox
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">Docker Isolation</h4>
          <p className="text-xs font-mono text-gray-400 leading-relaxed">
            Reproduction snippets run inside ephemeral containers with <code className="text-emerald-300">--network none</code>, 512MB RAM cap, and read-only repository mounts. Fork PRs require maintainer auth.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 border-yellow-500/20">
          <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs font-bold uppercase mb-2">
            <Workflow className="w-4 h-4" />
            4. Deterministic Truth
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">Mathematical Rules</h4>
          <p className="text-xs font-mono text-gray-400 leading-relaxed">
            Verdicts are calculated by pure Python AST logic and formal truth tables. LLM generates test hypotheses; deterministic checkers determine verdicts.
          </p>
        </SpotlightCard>
      </div>

      {/* Interactive Truth Table Simulator */}
      <SpotlightCard className="p-6 border-cyan-500/20">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
              Interactive Simulator
            </span>
            <h3 className="text-lg font-mono font-bold text-white">
              Probe Truth Table & Rules Engine
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10">
            src/probe/verdict.py
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-4 font-mono text-xs">
            <div>
              <label className="text-gray-400 block mb-1.5 font-semibold">1. Claim Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bug_behavior', label: 'Bug Behavior' },
                  { id: 'symbol_exists', label: 'Symbol Exists' },
                  { id: 'security_vuln', label: 'Security Vulnerability' },
                  { id: 'pr_adds_tests', label: 'PR Adds Tests' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setClaimType(t.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      claimType === t.id
                        ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-300 font-semibold'
                        : 'bg-black/50 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 block mb-1.5 font-semibold">
                  2. Static AST Outcome
                </label>
                <select
                  value={astOutcome}
                  onChange={(e) => setAstOutcome(e.target.value as any)}
                  className="w-full p-2.5 bg-black/60 border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="supports">Supports (Symbol Found)</option>
                  <option value="contradicts">Contradicts (Symbol Not Found)</option>
                  <option value="inconclusive">Inconclusive (External Dependency)</option>
                  <option value="none">None (Check Did Not Run)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-1.5 font-semibold">
                  3. Sandbox Reproduction
                </label>
                <select
                  value={sandboxOutcome}
                  onChange={(e) => setSandboxOutcome(e.target.value as any)}
                  className="w-full p-2.5 bg-black/60 border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="supports">Supports (Reproduced Error)</option>
                  <option value="contradicts">Contradicts (Ran Cleanly / Exit 0)</option>
                  <option value="inconclusive">Inconclusive (Timeout / Dependency)</option>
                  <option value="none">None (No Repro Code)</option>
                </select>
              </div>
            </div>

            {claimType === 'pr_adds_tests' && (
              <div>
                <label className="text-gray-400 block mb-1.5 font-semibold">
                  4. PR Diff Checker Outcome
                </label>
                <select
                  value={prDiffOutcome}
                  onChange={(e) => setPrDiffOutcome(e.target.value as any)}
                  className="w-full p-2.5 bg-black/60 border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="supports">Supports (New Test Functions Found)</option>
                  <option value="contradicts">Contradicts (Zero Test Files Touched)</option>
                  <option value="none">None</option>
                </select>
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                <input
                  type="checkbox"
                  checked={isLlmExtraction}
                  onChange={(e) => setIsLlmExtraction(e.target.checked)}
                  className="rounded border-white/20 bg-black/50 text-cyan-400 focus:ring-cyan-400"
                />
                <span>LLM Extracted Claim (Uncheck to test Regex Fallback safeguard)</span>
              </label>
            </div>
          </div>

          {/* Simulated Verdict Result Box */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-black/60 border border-white/10 font-mono">
            <div>
              <span className="text-[10px] uppercase text-gray-400 tracking-wider block mb-2">
                Simulated Formal Verdict
              </span>
              <div className="mb-4">
                <StatusBadge status={simulatedVerdict} size="lg" />
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 space-y-1.5 mb-3 text-xs">
                <span className="font-semibold text-cyan-400 block">{ruleName}</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">{ruleExplanation}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/80 border border-white/5 text-[10px] text-gray-400">
              <span className="text-cyan-300 font-semibold block mb-0.5">Invariance Rule:</span>
              "Decisive verdicts require concrete evidence. Never guess. When evidence is insufficient, return UNCERTAIN."
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default ArchitectureView;
