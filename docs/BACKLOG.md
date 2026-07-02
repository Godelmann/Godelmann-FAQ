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

> Multi-Agent-Audit (Repo + Live Test/Prod). **Detail je Finding: eigene `docs/FINDING-<ID>.md`** (verlinkt).
> Ergebnis: **5 Findings** — P1: 0 · P2: 3 · P3: 2. Erledigt: **0/5** (Stand 2026-07-02).

### 🟠 P2

| ID | Finding | Status |
|---|---|---|
| [FAQ-P2-01](FINDING-FAQ-P2-01.md) | CLAUDE.md Tech-Stack-Drift: React 19 vanilla Scaffold statt behauptetem Tailwind/shadcn/SPASS/Supabase-Stack | ⬚ offen |
| [FAQ-P2-02](FINDING-FAQ-P2-02.md) | Dev-Port 5009 in vite.config.ts konfigurieren (Vite startet auf Default 5173) | ⬚ offen |
| [FAQ-P2-03](FINDING-FAQ-P2-03.md) | npm audit: 1 high (vite 8.0.x) + 3 moderate via `npm audit fix` beheben | ⬚ offen |

### 🟢 P3

| ID | Finding | Status |
|---|---|---|
| [FAQ-P3-01](FINDING-FAQ-P3-01.md) | README.md projektspezifisch machen (unveränderter Vite-Template-Text, kein FAQ-Zweck/Stages/BACKLOG-Verweis) | ⬚ offen |
| [FAQ-P3-02](FINDING-FAQ-P3-02.md) | Scaffold-Platzhalter ersetzen: lang=en, Vite-Counter, keine FAQ-UI/Supabase/Edge-Function | ⬚ offen |

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
