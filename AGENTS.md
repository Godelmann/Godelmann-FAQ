# AGENTS.md — Godelmann-FAQ

Agent-agnostischer Einstieg (Codex, Cursor, Grok, OpenCode, Copilot, ...). Claude Code liest
zusaetzlich `CLAUDE.md`. **Nichts hier duplizieren — dies ist ein duenner Zeiger.**

## Zuerst lesen

1. **[`.xoder/XODER.md`](.xoder/XODER.md)** — Meta-Einstieg + XODER-Prinzip (Hierarchie, Regeln,
   Standalone-Autarkie) + Datei-Inventar + Rolle/Befunde. **PFLICHT-Erststation.**
2. **[`CLAUDE.md`](CLAUDE.md)** — Arbeitswissen: Tech-Stack (Vanilla TypeScript + Vite lib-mode, Web
   Component `<godelmann-faq>`, KEIN Framework), Commands/Gates, Stages.
3. **[`docs/ANFORDERUNGEN.md`](docs/ANFORDERUNGEN.md)** — verbindliche Spezifikation (API-Vertrag v1,
   Web-Components-Pflicht, Abnahme). **[`docs/EINBINDUNG.md`](docs/EINBINDUNG.md)** = Agentur-Integration.

## Betrieb (SSoT in `.xoder/`)

- **[`.xoder/NETWORK.md`](.xoder/NETWORK.md)** — Topologie: `<godelmann-faq>`-Widget, Embed auf godelmann.de,
  `godelmann-faq-server` (SPASS, :3008, test 10.0.0.4 / prod 49.12.77.51), `GET /api/faq`, GoCreate-Supabase-Quelle.
- **[`.xoder/BACKLOG.md`](.xoder/BACKLOG.md)** — Projekt-Backlog (Betriebs-Sicht) + `PARENT`-Sektion;
  Fach-Backlog = [`docs/BACKLOG.md`](docs/BACKLOG.md).
- **[`.xoder/HEALTHCHECK.md`](.xoder/HEALTHCHECK.md)** · **[`.xoder/MONITORING.md`](.xoder/MONITORING.md)**
  · **[`.xoder/TESTING.md`](.xoder/TESTING.md)**.

## Kern-Konventionen

- **Gates vor Commit:** `npm run build` (= `tsc --noEmit` + Vite lib-build, 0 Fehler) + `npm run lint`.
  Kein Unit-Test-Runner im Repo — Abnahme ist E2E (`.xoder/TESTING.md`). Bundle < 60 kB gzip, self-contained.
- **Commits/PRs:** Conventional Commits, ASCII, **KEIN AI-/Co-Authored-By-Footer** (flottenweite
  XODER-Pflicht). Details: org-weites `.xoder/GITHUB.md` (falls ausgecheckt).
- **API-Stabilitaet:** `faq-widget.v1.js` ist stabil (in-place-Fixes); Breaking Changes ⇒ `faq-widget.v2.js`.
- **CI:** Akzent-Default `--gdm-faq-accent = #E52D12` (einziger Godelmann-Rotton) — s. `CLAUDE.md`.
