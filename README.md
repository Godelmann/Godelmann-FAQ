# Godelmann-FAQ

Oeffentliches **FAQ-Webmodul** fuer **godelmann.de** — Web Component `<godelmann-faq>`
(WHATWG Custom Elements + Shadow DOM, Vanilla TypeScript **ohne Framework-Dependency**).
Vite baut das Widget als einzelnes ES-Modul `dist/faq-widget.v1.js` (< 60 kB gzip), das der
`godelmann-faq-server` ausliefert. Die kuratierten Inhalte entstehen in **GoCreate** und werden
per `GET /api/faq?lang=de[&category=…]` ausgespielt.

> Dieses Repo folgt dem **XODER-Prinzip**: die Single Source of Truth liegt in
> [`.xoder/`](.xoder/), Meta-Einstieg ist **[`.xoder/XODER.md`](.xoder/XODER.md)**. Dieses README ist
> die menschliche GitHub-Landing und **verlinkt** dorthin (dupliziert nichts).
> Agenten-Einstiege: [`CLAUDE.md`](CLAUDE.md) (Claude Code) · [`AGENTS.md`](AGENTS.md).

## Kommandos

```bash
npm run dev      # Standalone-Preview auf http://localhost:5009 (mit /api/faq-Mock)
npm run build    # tsc --noEmit + Vite lib-build -> dist/faq-widget.v1.js
npm run lint     # ESLint
```

Die Preview (`index.html`) dient zugleich als Referenz-Einbindung fuer die godelmann.de-Agentur;
der Vite-Dev-Server liefert unter `/api/faq` Mock-Daten (nur Dev, s. `vite.config.ts`).

## Dokumentation

| Datei | Inhalt |
|---|---|
| [`.xoder/XODER.md`](.xoder/XODER.md) | Prinzip, Datei-Inventar, Rolle/Befunde, Kern-Konventionen (Meta-Einstieg) |
| [`.xoder/NETWORK.md`](.xoder/NETWORK.md) | Topologie-SSoT: Web-Component-Widget, Embed, `godelmann-faq-server` (:3008), `/api/faq`, GoCreate-Supabase als Inhaltsquelle |
| [`.xoder/HEALTHCHECK.md`](.xoder/HEALTHCHECK.md) · [`MONITORING.md`](.xoder/MONITORING.md) · [`TESTING.md`](.xoder/TESTING.md) | Health-Sweep · Wachpunkte · Gates (tsc/lint/build) |
| [`.xoder/BACKLOG.md`](.xoder/BACKLOG.md) | Betriebs-Backlog (inkl. Sektion `PARENT`) |
| [`docs/ANFORDERUNGEN.md`](docs/ANFORDERUNGEN.md) | Verbindliche Spezifikation (Architektur, API-Vertrag v1, Web-Components-Pflicht, Abnahme) |
| [`docs/EINBINDUNG.md`](docs/EINBINDUNG.md) | Integrations-Doku fuer die Agentur (Snippet, Attribute, CSS-Props, Events, CSP) |
| [`docs/BACKLOG.md`](docs/BACKLOG.md) | Fach-/Release-Log — Release-Historie, offene Punkte (EN-FAQs, Kuratierung) |
| [`docs/AUDIT-2026-07-12.md`](docs/AUDIT-2026-07-12.md) · [`docs/FINDINGS-2026-07-12.md`](docs/FINDINGS-2026-07-12.md) | Security-Audit-Tracker + Belege (0 Findings; `docs/FINDING-FAQ-*.md`) |

## Konventionen

- **Commits/PRs:** Conventional Commits, ASCII, **kein AI-/Co-Authored-By-Footer** (flottenweite Pflicht, s. `../.xoder/GITHUB.md`). Default-Branch `main` (Protected nur ueber PR).
- **Gates vor Commit:** `npm run build` (= `tsc --noEmit` + Vite lib-Build, 0 Fehler) + `npm run lint`. Kein Test-Runner (kleines Widget) — Abnahme ist E2E.
- **Bundle-Budget:** `dist/faq-widget.v1.js` < 60 kB gzip, self-contained. Breaking Changes nur als neue `faq-widget.v2.js`.
