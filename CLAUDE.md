# Godelmann-FAQ

Öffentliches FAQ-Webmodul für godelmann.de — Web Component `<godelmann-faq>` (WHATWG Custom
Elements + Shadow DOM), Vanilla TypeScript **ohne Framework-Dependency**. Verbindliche
Spezifikation: `docs/ANFORDERUNGEN.md`; Agentur-Doku: `docs/EINBINDUNG.md`.

## Common Commands
```bash
npm run dev          # Standalone-Preview auf http://localhost:5009 (strictPort, /api/faq-Mock)
npm run build        # tsc --noEmit + Vite lib-build -> dist/faq-widget.v1.js (< 60 kB gzip)
npm run lint         # ESLint
```

## Tech Stack
- Vanilla TypeScript + Vite (lib-mode) — KEIN React/Tailwind/shadcn, keine Runtime-Dependencies
- Entry `src/faq-widget.ts` -> ein ES-Modul `dist/faq-widget.v1.js` (versionierte URL, Breaking -> v2)
- Daten: `GET {api-base}/api/faq?lang=…[&category=…]` vom godelmann-faq-server (platform-test :3008)
- Domain: Test `faq-test.godelmann.net` (geplant), Prod nach DNS-Freigabe
- GitHub: Godelmann/Godelmann-FAQ
## Doku-Pflege (PFLICHT)

`docs/BACKLOG.md` ist der Release-/Feature-Log dieses Frontends. **Regel:** Der `> Stand:`-Kopf MUSS die aktuelle `package.json`-Version nennen, und jedes gelieferte Release wird dort nachgetragen — nicht nur CR-Status. Der `/do-everything`-Lauf erzwingt das via **Frontend-Release-Sync-Check** (Audit `package.json` ↔ BACKLOG-Kopf; warnt auch, wenn ein Frontend gar kein BACKLOG hat). Memory: `feedback_frontend_backlog_version_sync`.

## Security-Audit (2026-07-12)

Teil des BLUEITS/REDITS Fleet-Audits. **0 Findings** (0). Belege: `docs/FINDINGS-2026-07-12.md` · Tracker: `docs/AUDIT-2026-07-12.md` · Register: `BLUEITS-GmbH/.xoder/FINDINGS.md`.
Vor Änderungen an Sicherheits-Code die Findings prüfen; Erledigtes als „resolved" markieren.

## Git-Konventionen (XODER-Standard)

Verbindlich fuer Commits/PRs in diesem Repo: siehe org-weites `.xoder/GITHUB.md`.
Kurz: **KEIN AI-/Co-Authored-By-Footer** (flottenweite Pflicht), Conventional Commits
(`type(scope): subject`, Imperativ), ASCII. Protected Branches nur ueber PR.
