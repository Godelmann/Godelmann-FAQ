# Godelmann-FAQ — BACKLOG

> Stand: 2026-06-15 (Paket-Version **v0.0.0** — Scaffold, noch kein Release)
> Maintainer: Dietmar Scharf
>
> FAQ-System für godelmann.de (React/Vite/TS). Inhalte aus eigener Tabelle, Embed via Widget.
> Kontext + Sprint-Plan: GoCreate-Websites-Backlog, Sub-App 2
> ([`../../godelmann-gocreate/docs/BACKLOG.md`](../../godelmann-gocreate/docs/BACKLOG.md) → „Websites").
>
> Infrastruktur-BACKLOG: [`../../../docs/BACKLOG.md`](../../../docs/BACKLOG.md)


## Audit 2026-07-02 (Multi-Agent, verifiziert)

### P2

| Status | Aufgabe | Details |
|---|---|---|
| ⬚ | CLAUDE.md Tech-Stack-Drift beheben | `CLAUDE.md` behauptet „React 18 + Vite + TypeScript + Tailwind + shadcn/ui + SPASS" und „Shared Supabase mit GoCreate (Port 8010)" — tatsächlich ist das Projekt ein vanilla Vite-Scaffold mit React 19.2.4 ohne Tailwind, shadcn/ui, SPASS-Client oder Supabase-Anbindung (dependencies: nur `react` + `react-dom`). Doku an Realität angleichen oder als Ziel-Stack kennzeichnen. |
| ⬚ | Dev-Port 5009 in `vite.config.ts` konfigurieren | CLAUDE.md („Dev-Server auf http://localhost:5009") und `platform-control/docs/PORTS.md` weisen Port 5009 zu; `vite.config.ts` enthält aber kein `server: { port: 5009 }` — Vite startet auf Default 5173. Port-Paarung 5xxx/9xxx des Dev-First-Workflows herstellen. |
| ⬚ | npm audit: 1 high (vite 8.0.1) + 3 moderate fixen | vite 8.0.0–8.0.15 hat mehrere Advisories (GHSA-4w7w-66w2-5vf9 Path Traversal, GHSA-v2wj-q39q-566r `fs.deny`-Bypass, GHSA-p9ff-h696-f583 Arbitrary File Read via Dev-Server-WebSocket). Nur Dev-Server-relevant, aber der Dev-First-Workflow forwardet Ports. Fix via `npm audit fix`; dazu moderate: brace-expansion, js-yaml, postcss. |

### P3

| Status | Aufgabe | Details |
|---|---|---|
| ⬚ | README.md projektspezifisch machen | README ist das unveränderte „React + TypeScript + Vite"-Template — ohne Godelmann-FAQ-Zweck, Stages oder Verweis auf `docs/BACKLOG.md`. |
| ⬚ | Scaffold-Platzhalter ersetzen | `index.html` hat `lang="en"` und Platzhalter-Title `godelmann-faq`; `src/App.tsx` ist der Vite-Demo-Counter. Für den ersten Nutzen fehlen: `lang="de"`, echter Titel, FAQ-UI, Supabase/SPASS-Anbindung, Edge-Function `faq-public`, Embed-Widget (siehe Sprint-Plan Sub-App 2 im GoCreate-Websites-Backlog). |

_Keine P1-Findings._

---

---

## Release-Historie

_Noch kein Release — Projekt ist als Scaffold angelegt (v0.0.0)._

---

## Offen

| Status | Aufgabe | Details |
|---|---|---|
| ⬚ | Erste Ausbaustufe | Siehe Sprint-Plan im GoCreate-Websites-Backlog (Sub-App 2: DB `faq_entries`, GoCreate-UI-Editor, Public-Edge-Function `faq-public`, Embed-Widget, Analytics). |

---

## Doku-Pflege (Pflicht)

Der `> Stand:`-Kopf MUSS die aktuelle `package.json`-Version nennen; jedes gelieferte Release wird hier
nachgetragen (vom `/do-everything`-Frontend-Release-Sync-Check erzwungen — Memory `feedback_frontend_backlog_version_sync`).
