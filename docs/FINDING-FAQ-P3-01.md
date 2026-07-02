# FAQ-P3-01: README.md projektspezifisch machen

| | |
|---|---|
| **Projekt** | FAQ |
| **Schweregrad** | P3 |
| **Bereich** | Doku |
| **Entdeckt** | 2026-07-02 (Multi-Agent-Audit) |
| **Status** | OPEN |

## Symptom
Die `README.md` im Repo-Root von `godelmann-faq` ist der unveränderte Vite-Starter-Text („React + TypeScript + Vite"). Sie beschreibt weder den Zweck der Godelmann-FAQ-App noch die Stages (Test/Prod, Ports) und verweist nicht auf `docs/BACKLOG.md`. Wer das Repo öffnet, erhält keine projektspezifische Orientierung.

## Root Cause
Beim Anlegen des Frontends wurde das generische Vite-React-Template übernommen und die `README.md` nie an das Projekt angepasst. Es fehlt der übliche projektspezifische Kopf (Zweck, Tech-Stack, Stages, Doku-Verweise), wie ihn die anderen Plattform-Frontends besitzen.

## Beleg
`README.md`, Zeile 1 ff. — reiner Template-Inhalt:

```
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
```

Kein Vorkommen von „Godelmann", „FAQ", „Stage", „Port" oder „BACKLOG" in der Datei. `docs/BACKLOG.md` existiert im Repo, wird aber nicht referenziert.

## Auswirkung
Reines Doku-/Onboarding-Problem, keine Funktions- oder Sicherheitsfolge. Neue Entwickler oder Agenten finden ohne README-Kontext den Projektzweck, die Test-/Prod-Stages und den Backlog nicht auf Anhieb. Betrifft ausschließlich Repo-Dokumentation, keine laufende Stage.

## Reproduktion
1. `cat /projects/platform-control/frontends/godelmann-faq/README.md`
2. Beobachtung: generischer Vite-Template-Text, kein Projektbezug.

## Fix-Vorschlag
`README.md` durch einen projektspezifischen Kopf ersetzen, analog zu den übrigen Plattform-Frontends. Mindestinhalt:

- **Zweck**: Godelmann-FAQ-Frontend (React 18 + Vite + TypeScript, Tailwind, shadcn/ui).
- **Stages**: Test-Stage (Server/Port) und ggf. Prod, gemäß `docs/PORTS.md` / `GODELMANN-STAGES.md`.
- **Doku-Verweise**: Link auf [`docs/BACKLOG.md`](docs/BACKLOG.md) und die repo-eigene `CLAUDE.md`.
- **Dev-Start**: kurzer Hinweis auf `npm run dev` + SPASS-Dev-Binary (Dev-First-Workflow).

Kein Deploy und keine Migration nötig — reine Dokumentationsänderung im Repo.

## Referenzen
- [docs/BACKLOG.md](BACKLOG.md)
- `godelmann-faq/CLAUDE.md` (Repo-Kontext, sofern vorhanden)
- `/projects/CLAUDE.md` — Muster für projektspezifische README-/Stage-Angaben der übrigen Frontends
