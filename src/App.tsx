import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Cpu,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  ExternalLink,
  Zap,
} from 'lucide-react';

// React Bits Flux Lines & Components
import FluxLines from './components/reactbits/FluxLines/FluxLines';
import TechText from './components/reactbits/TechText/TechText';
import DecryptedText from './components/reactbits/DecryptedText/DecryptedText';
import TrueFocus from './components/reactbits/TrueFocus/TrueFocus';

import TriageStudio from './components/TriageStudio';
import WorkedExamplesView from './components/WorkedExamplesView';
import BenchmarkView from './components/BenchmarkView';
import ArchitectureView from './components/ArchitectureView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'studio' | 'examples' | 'benchmarks' | 'architecture'>('studio');
  const [serverOnline, setServerOnline] = useState<boolean>(true);
  const [modelName, setModelName] = useState<string>('qwen3:8b');
  const [techTextMode, setTechTextMode] = useState<'vector' | 'decrypt'>('vector');

  // Check health and service info on mount
  useEffect(() => {
    fetch('/health')
      .then((res) => {
        if (res.ok) setServerOnline(true);
      })
      .catch(() => setServerOnline(false));

    fetch('/api/info')
      .then((res) => (res.ok ? res.json() : null))
      .then((info) => {
        if (info?.model) setModelName(info.model);
      })
      .catch(() => {});
  }, []);

  return (
    <div
      style={{ backgroundColor: '#08090d' }}
      className="relative min-h-screen text-gray-100 flex flex-col font-sans bg-[#08090d] overflow-x-hidden"
    >
      {/* 1. Official React Bits Flux Lines (WebGL fluid background) */}
      <FluxLines
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        colors={['#00f0ff', '#8b5cf6', '#06b6d4', '#a855f7']}
        speed={0.35}
        scale={1.5}
        turbulence={0.8}
        fluidity={0.12}
        rimWidth={0.25}
        sharpness={2.0}
        shimmer={1.2}
        glow={2.0}
        lineWidth={1.2}
        flowDirection="down"
        opacity={0.65}
        mouseInteraction={true}
        mouseStrength={0.8}
        clickSwirl={true}
        transparent={false}
        backgroundColor="#08090d"
      />

      {/* Main Content Layer (above WebGL Canvas) */}
      <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Diagnostic Status Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <div>
              <span className="font-bold tracking-wider text-white text-sm">PROBE</span>
              <span className="text-[10px] text-cyan-400 block -mt-0.5">v0.1.0 · Autonomous Bot</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Webhook Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-300">
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-[11px]">Server: {serverOnline ? '127.0.0.1:8000' : 'Offline'}</span>
            </div>

            {/* Model Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-300">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px]">{modelName}</span>
            </div>

            {/* Test Suite Status */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px]">554/554 Tests Passing</span>
            </div>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/ashuwuin/Probe"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="text-[11px]">GitHub</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="my-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-1 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Problem 2: Evidence-Based Issue & PR Triage</span>
          </div>

          {/* MAIN MIDDLE SHOW: Official React Bits TechText Component */}
          <div className="relative py-2 max-w-5xl mx-auto flex flex-col items-center justify-center">
            <div className="w-full h-32 sm:h-36 max-w-4xl mx-auto flex items-center justify-center">
              <TechText
                text="PROBE // EVIDENCE-BASED TRIAGE"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                fontSize={38}
                fontWeight={800}
                color="#00f0ff"
                accentColor="#c084fc"
                align="center"
                reach={160}
                softness={0.7}
                dashLength={4}
                dashGap={3}
                strokeWidth={1.5}
                lineStyle="dashed"
                reveal="area"
                specks={10}
                selection={true}
                labels={true}
                draggable={true}
                clickKick={true}
                bounce={0.4}
                sweep={true}
                speed={0.4}
                intro="none"
                guides={true}
                className="w-full h-full"
              />
            </div>

            <p className="mt-1 text-xs font-mono text-cyan-300/80 tracking-widest uppercase">
              Deterministic AST · Isolated Zero-Network Sandbox · Formal Truth Table
            </p>
          </div>

          {/* Subtitle using React Bits TrueFocus effect */}
          <div className="max-w-3xl mx-auto pt-1">
            <TrueFocus
              sentence="Zero-Hallucination GitHub App · Deterministic AST Sandbox Verification"
              wordClassName="text-sm sm:text-base font-mono font-medium text-gray-300"
              manualMode={false}
              blurAmount={1.0}
              unfocusedOpacity={0.65}
              borderColor="#00f0ff"
              glowColor="rgba(0, 240, 255, 0.6)"
              cornerSize={8}
              borderWidth={1.5}
              animationDuration={0.6}
              pauseBetweenAnimations={1.5}
            />
          </div>

          <p className="text-xs font-mono text-gray-400 pt-2">
            Hacktoberfest Hack Day Sonipat · Ashwin Anand (<span className="text-cyan-400">@ashuwuin</span>), Prachi Vats (<span className="text-cyan-400">@Prachivats-21</span>), Kaashvi Saini (<span className="text-cyan-400">@Kaashviw3spaces</span>)
          </p>
        </section>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md font-mono text-xs shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'studio'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Interactive Triage Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('examples')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'examples'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>5 Worked Examples</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'benchmarks'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Benchmark Results (17 Cases)</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'architecture'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Architecture & Truth Table</span>
            </button>
          </div>
        </div>

        {/* Tab Viewport */}
        <main className="flex-1 pb-12">
          {activeTab === 'studio' && <TriageStudio />}
          {activeTab === 'examples' && <WorkedExamplesView />}
          {activeTab === 'benchmarks' && <BenchmarkView />}
          {activeTab === 'architecture' && <ArchitectureView />}
        </main>

        {/* Footer */}
        <footer className="pt-6 border-t border-white/10 text-center font-mono text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>Probe · Evidence-Based Open Source Triage</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Zero Network Sandbox</span>
            <span className="text-gray-400">·</span>
            <span className="text-cyan-400">Deterministic AST</span>
            <span className="text-gray-400">·</span>
            <span className="text-purple-400">Qwen3:8b Local</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
