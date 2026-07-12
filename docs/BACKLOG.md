# Godelmann-FAQ — BACKLOG

> Stand: 2026-07-12 (Paket-Version **v0.0.1**)
> Maintainer: Dietmar Scharf
>
> FAQ-Webmodul für godelmann.de — Web Component `<godelmann-faq>` (Vanilla TS, Vite lib-mode,
> `dist/faq-widget.v1.js`). Inhalte aus GoCreate via `GET /api/faq`, Embed via Script-Tag.
> Kontext + Sprint-Plan: GoCreate-Websites-Backlog, Sub-App 2
> ([`../../godelmann-gocreate/docs/BACKLOG.md`](../../godelmann-gocreate/docs/BACKLOG.md) → „Websites").
>
> Infrastruktur-BACKLOG: [`../../../docs/BACKLOG.md`](../../../docs/BACKLOG.md)


## Audit 2026-07-02 (Multi-Agent, verifiziert)

> Multi-Agent-Audit (Repo + Live Test/Prod). **Detail je Finding: eigene `docs/FINDING-<ID>.md`** (verlinkt).
> Ergebnis: **5 Findings** — P1: 0 · P2: 3 · P3: 2. Erledigt: **5/5** (Stand 2026-07-12, v0.0.1).

### 🟠 P2

| ID | Finding | Status |
|---|---|---|
| [FAQ-P2-01](FINDING-FAQ-P2-01.md) | CLAUDE.md Tech-Stack-Drift: React 19 vanilla Scaffold statt behauptetem Tailwind/shadcn/SPASS/Supabase-Stack | ✅ erledigt (v0.0.1) |
| [FAQ-P2-02](FINDING-FAQ-P2-02.md) | Dev-Port 5009 in vite.config.ts konfigurieren (Vite startet auf Default 5173) | ✅ erledigt (v0.0.1) |
| [FAQ-P2-03](FINDING-FAQ-P2-03.md) | npm audit: 1 high (vite 8.0.x) + 3 moderate via `npm audit fix` beheben | ✅ erledigt (v0.0.1) |

### 🟢 P3

| ID | Finding | Status |
|---|---|---|
| [FAQ-P3-01](FINDING-FAQ-P3-01.md) | README.md projektspezifisch machen (unveränderter Vite-Template-Text, kein FAQ-Zweck/Stages/BACKLOG-Verweis) | ✅ erledigt (v0.0.1) |
| [FAQ-P3-02](FINDING-FAQ-P3-02.md) | Scaffold-Platzhalter ersetzen: lang=en, Vite-Counter, keine FAQ-UI/Supabase/Edge-Function | ✅ erledigt (v0.0.1) |

---

---

## Release-Historie

### v0.0.1 — 2026-07-12 · FAQ-Widget als Web Component

- **`<godelmann-faq>`** (`src/faq-widget.ts`): Custom Element nach WHATWG-Standard (Shadow DOM open,
  Template), reaktive Attribute `lang`/`category`/`api-base` (Default = Script-Origin via
  `import.meta.url`), lädt `GET /api/faq?lang=…[&category=…]` (API-Vertrag v1).
- UI (deutsch): Suchfeld (clientseitige Filterung Frage+Antwort), Kategorien-Filter („Alle" zuerst;
  bei `category`-Attribut serverseitig fixiert, Leiste ausgeblendet), barrierefreies Accordion
  (aria-expanded/aria-controls, region-Rolle, Pfeiltasten/Home/End), Quell-Links („Mehr dazu:",
  `noopener noreferrer`), sanitizter Mini-Markdown-Renderer ohne externe Lib (escape-first;
  fett/kursiv/Listen/nummerierte Listen/nur-http(s)-Links/Absätze), Graceful Degradation bei API-Fehlern.
- Theming via CSS-Custom-Properties (`--gdm-faq-accent` #E52D12, `--gdm-faq-font`, `--gdm-faq-radius`,
  `--gdm-faq-max-width`); Events `gdm-faq:loaded`/`gdm-faq:opened`/`gdm-faq:error` (bubbles+composed).
- **Build:** Vite lib-mode → ein ES-Modul `dist/faq-widget.v1.js` (minified, 11,3 kB / **4,2 kB gzip**,
  Gate < 60 kB), `build` = `tsc --noEmit` + `vite build`; Dev-Server Port **5009** (strictPort) mit
  `/api/faq`-Mock für die Standalone-Preview (`index.html` = Referenz-Einbindung).
- **React komplett entfernt** (App.tsx/main.tsx/Assets, react/react-dom/@vitejs/plugin-react aus
  package.json, ESLint ohne React-Plugins, tsconfig konsolidiert); `npm audit` **0 vulnerabilities**
  (vite 8.1.4). **`docs/EINBINDUNG.md`** (deutsch, für die godelmann.de-Agentur) neu.
- Audit 2026-07-02: alle 5 Findings (FAQ-P2-01…P3-02) behoben.

---

## Offen

| Status | Aufgabe | Details |
|---|---|---|
| ✅ | Server + Ausspielung (2026-07-12) | LIVE: `godelmann-faq-server` (SPASS, platform-test :3008, systemd), Caddy-vhost `https://faq-test.godelmann.net` (LE-Cert, CORS nur godelmann.de, Widget-Cache 1h), DIST_DIR liefert `faq-widget.v1.js` + Preview. E2E bestanden: /api/faq liefert approved+published (Publish-Toggle-Roundtrip), CORS-Positiv/Negativ, 688 Draft-Eintraege importiert. **Prod ebenfalls LIVE** (`https://faq.godelmann.net`, godelmann-prod :3008, prod-Supabase mit Migration + 688 Drafts). |
| ⬚ | Inhalte/Kuratierung | GoCreate Sub-App 2: DB `faq_entries`, UI-Editor, Publish-Flow (siehe GoCreate-Websites-Backlog). |

---

## Doku-Pflege (Pflicht)

Der `> Stand:`-Kopf MUSS die aktuelle `package.json`-Version nennen; jedes gelieferte Release wird hier
nachgetragen (vom `/do-everything`-Frontend-Release-Sync-Check erzwungen — Memory `feedback_frontend_backlog_version_sync`).


## Security-Audit (2026-07-12) — FINDINGS hinterlegt, Remediation offen

**Status:** KEINE FINDINGS. Teil des Fleet-Audits (AUDIT-FLEET-2026-07-12). **0 Findings** (0).

- Belege: `docs/FINDINGS-2026-07-12.md` · Ticket/Tracker: `docs/AUDIT-2026-07-12.md` · Org-Register: `BLUEITS-GmbH/.xoder/FINDINGS.md`

**Naechster Schritt:** User-Review → Priorisierung → Fix; Jira erst nach Review. Erledigtes als „resolved" markieren.

## Offene Punkte (Backlog)

| # | Punkt | Detail |
|---|---|---|
| 1 | **EN-FAQs** | Erst NACH Spezialisten-Approval der 688 deutschen Drafts (Plan-Entscheid 2026-07-12: "EN spaeter aus approbierten DE"): approbierte DE-Eintraege nach demselben Fabrik-Muster (Generierung + adversariale Verifikation) uebersetzen, `lang=en` in `faq_entries`, Widget kann per `lang`-Attribut umschalten. |
