# Probe Frontend GUI ⚡

> **Evidence-Based Open Source Issue and Pull Request Triage**
> Hacktoberfest Hack Day Sonipat · Ashwin Anand ([@ashuwuin](https://github.com/ashuwuin)), Prachi Vats ([@Prachivats-21](https://github.com/Prachivats-21)), Kaashvi Saini ([@Kaashviw3spaces](https://github.com/Kaashviw3spaces))

A high-performance cyberpunk GUI client for [Probe](https://github.com/ashuwuin/Probe), built with **React 18**, **Vite**, **Tailwind CSS**, and interactive UI components from [React Bits](https://reactbits.dev).

---

## ✨ Features

- **React Bits `FluxLines` Background**: Real-time WebGL2 magnetic fluid shader with organic cyan and violet lines flowing across a deep `#08090d` canvas with cursor attraction.
- **React Bits `TechText` Hero Title**: Interactive CAD vector layout displaying `PROBE // EVIDENCE-BASED TRIAGE` with real-time letter bounding crosshairs (`18 × 28`), baseline alignment guides, draggable glyphs, and click shockwaves.
- **React Bits `TrueFocus` Subtitle**: Neon tracking corner brackets animating across subtitle keywords.
- **Interactive Triage Studio**:
  - 5 quick-load presets for standard test cases (`CONFIRMED`, `INVALID`, `CANNOT REPRODUCE`, `CONFIRMED`, `UNCERTAIN`).
  - Text & Python reproduction snippet input or direct GitHub Issue/PR URL triage.
  - Claims Truth Table inspector with deterministic verification breakdown.
  - GitHub Bot Report preview formatted in exact markdown.
- **5 Worked Examples View**: In-depth analysis of reproduced bugs, non-reproductions, and security blocks.
- **Benchmark Matrix View**: Real-time evaluation results across 17 benchmark test cases with 0 invalid-verdict errors.
- **Architecture & Rules Simulator**: Visual defense layers (AST safety, Docker sandbox isolation, formal logic) with live verification simulator.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

The app will be available at **`http://127.0.0.1:5173/`**.

### 3. Production Build

```bash
npm run build
npm run preview
```

---

## 🔌 Backend Connection

The Vite dev server includes a reverse proxy in `vite.config.ts`:
- `/api` -> `http://127.0.0.1:8000/api`
- `/health` -> `http://127.0.0.1:8000/health`

To run the Probe Python backend alongside this frontend:
```bash
git clone https://github.com/ashuwuin/Probe.git
cd Probe
python -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn probe.app:app --host 127.0.0.1 --port 8000
```

---

## 🛠️ Tech Stack

- **Framework**: React 18 & TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS 3
- **Animations & Shaders**: [React Bits](https://reactbits.dev) (WebGL2 & Canvas), `motion`
- **Icons**: Lucide React
