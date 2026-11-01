# Probe Frontend & Full-Stack Suite ⚡

> **Evidence-Based Open Source Issue and Pull Request Triage**
> Hacktoberfest Hack Day Sonipat · Ashwin Anand ([@ashuwuin](https://github.com/ashuwuin)), Prachi Vats ([@Prachivats-21](https://github.com/Prachivats-21)), Kaashvi Saini ([@Kaashviw3spaces](https://github.com/Kaashviw3spaces))

A high-performance cyberpunk GUI client and standalone verification engine for **Probe**, built with **React 18**, **Vite**, **Tailwind CSS**, and interactive UI components from [React Bits](https://reactbits.dev).

This repository is **completely standalone**: it includes both the rich **React Bits GUI frontend** and the full **Python FastAPI backend engine** (`backend/`), with one-command orchestration.

---

## ✨ Features

- **React Bits `FluxLines` Background**: Real-time WebGL2 magnetic fluid shader with organic cyan and violet lines flowing across a deep `#08090d` canvas with cursor attraction.
- **React Bits `TechText` Hero Title**: Interactive CAD vector layout displaying `PROBE // EVIDENCE-BASED TRIAGE` with real-time letter bounding crosshairs (`18 × 28`), baseline alignment guides, draggable glyphs, and click shockwaves.
- **React Bits `TrueFocus` Subtitle**: Neon tracking corner brackets animating across subtitle keywords.
- **Full Python Backend Engine (`backend/`)**:
  - FastAPI webhook & live triage server.
  - Deterministic AST verification and static security filters.
  - Zero-network Docker sandbox reproduction engine.
  - Ollama & regex-based claim extractor.
  - Formal 4-rule truth-table logic with 0 wrong-invalid verdicts.
- **Interactive Triage Studio**:
  - 5 quick-load presets for standard test cases (`CONFIRMED`, `INVALID`, `CANNOT REPRODUCE`, `CONFIRMED`, `UNCERTAIN`).
  - Text & Python reproduction snippet input or direct GitHub Issue/PR URL triage.
  - Claims Truth Table inspector with deterministic verification breakdown.
  - GitHub Bot Report preview formatted in exact markdown.
- **5 Worked Examples View**: In-depth analysis of reproduced bugs, non-reproductions, and security blocks.
- **Benchmark Matrix View**: Real-time evaluation results across 17 benchmark test cases with 0 invalid-verdict errors.
- **Architecture & Rules Simulator**: Visual defense layers (AST safety, Docker sandbox isolation, formal logic) with live verification simulator.

---

## 🚀 One-Command Launch (Full-Stack)

Run both the FastAPI backend (`http://127.0.0.1:8000`) and the React Vite frontend (`http://127.0.0.1:5173`) with a single command:

```bash
./start.sh
```
*Or via npm:*
```bash
npm start
```

The script automatically sets up the Python virtual environment in `backend/.venv`, installs dependencies, launches the FastAPI server, and opens the Vite dev server with proxy routing enabled.

---

## 💻 Standalone Frontend Mode

You can also run the frontend entirely standalone without running Python:

```bash
npm install
npm run dev
```

The frontend includes offline fallback data for all worked examples, benchmark test matrix cases, and architectural simulator views.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite 6, Tailwind CSS 3
- **Animations & Shaders**: [React Bits](https://reactbits.dev) (WebGL2 & Canvas), `motion`
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn
- **Verification Engine**: Python AST, Docker API, GitHub REST API
