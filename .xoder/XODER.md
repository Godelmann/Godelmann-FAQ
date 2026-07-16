# .xoder/XODER.md — Godelmann-FAQ (Repo-Meta-Einstieg, XODER-Prinzip)

> **Autark nutzbar:** Alles, was du fuer dieses Repo brauchst, liegt HIER im Repo (`.xoder/` + `docs/`).
> Die uebergeordneten XODER-Ebenen (Org, Meta) sind OPTIONAL — fehlt dein lokaler Checkout davon,
> gilt dieses Verzeichnis allein und vollstaendig. Arbeitswissen steht in `CLAUDE.md` (nicht duplizieren, verlinken).

## 1. Das XODER-Prinzip (Kurzfassung, vollstaendig)

Jede Verzeichnisebene der Projektlandschaft ist self-describing ueber ein **`.xoder/`-Verzeichnis
mit mindestens einer `XODER.md`** (Meta-Einstieg) und optional einer **`BACKLOG.md`** (offene Aufgaben):

1. **Repo-Ebene (DIESES Repo):** `Godelmann/Godelmann-FAQ/.xoder/` — SSoT fuer Betrieb/Topologie/Backlog des
   FAQ-Webmoduls. Agent-Einstiege: `CLAUDE.md` (Claude Code) und `AGENTS.md` (alle AGENTS.md-lesenden Agents:
   Codex, Cursor, Grok, OpenCode, Copilot, ...) — beide verweisen hierher.
2. **Org-Ebene (optional):** `Godelmann/.xoder` = org-weite Konventionen (`GITHUB.md` = Commit-/PR-Regeln,
   `FINDINGS.md` = Security-Register). Lokal erwartbar unter `~/Projects/Godelmann/.xoder/`.
   (Ordner-`Godelmann/CLAUDE.md` traegt zusaetzlich die Infrastruktur-/SSH-Notizen fuer alle Godelmann-Repos.)
3. **Meta-Ebene (optional):** `~/Projects/` mit Meta-Overlay (`XODER.md` = Prinzip + Agent-Matrix,
   `.xoder/XODER.md` = Landschafts-SSoT ueber alle Tenants, `.xoder/BACKLOG.md` = Meta-Backlog).

**Regeln:** SSoT liegt in `.xoder/` (Agent-Dateien sind duenne Zeiger, nichts duplizieren) ·
spezifischere Ebene gewinnt · Backlog-Eintraege gehoeren in die hierarchisch passende `BACKLOG.md` ·
KEINE Secrets in XODER-Dateien (nur Verweise auf Secret-Orte, z. B. `/projects/.env`) ·
Checkout-Konvention `~/Projects/<org>/<repo>`.

**Standalone-Autarkie + Promotion (Kerngarantie):** Die Parent-Ebenen (2+3 oben) sind **Anreicherung,
keine Abhaengigkeit**. Fehlen sie lokal (nur dieses Repo geklont), nutzt und verbessert man das
XODER-Prinzip **vollstaendig hier im Repo**: alle Eintraege ins Repo-`.xoder/BACKLOG.md`; was
inhaltlich auf eine Parent-Ebene gehoert (Org-Konvention, Landschafts-Thema, Schwester-App-Rollout),
dort unter der Sektion **„PARENT (zur Promotion)"** sammeln — es wird beim naechsten Kontakt mit der
Parent-Ebene dorthin promoted (hochgezogen). Nichts geht verloren, nichts blockiert.

## 2. Datei-Inventar dieses Repos (`.xoder/` + zentrale `docs/`)

| Datei | Inhalt |
|---|---|
| `.xoder/XODER.md` | DIESE Datei — Prinzip + Wegweiser + Rolle/Befunde (unten) |
| `.xoder/NETWORK.md` | Topologie-SSoT: Web-Component-Widget, Embed auf godelmann.de, `godelmann-faq-server` (SPASS, :3008), `/api/faq`, GoCreate-Supabase als Inhaltsquelle |
| `.xoder/BACKLOG.md` | Projekt-Backlog (Betriebs-Sicht) inkl. Pflicht-Sektion `PARENT`; Fach-Backlog = `docs/BACKLOG.md` |
| `.xoder/HEALTHCHECK.md` | Ende-zu-Ende-Sweep (Widget-Auslieferung, `/api/faq`, CORS, Embed-Rendering) |
| `.xoder/MONITORING.md` | Laufende Wachpunkte (Publish-Roundtrip, Cache-TTL, Cert, Bundle-Groesse, Inhalts-Frische) |
| `.xoder/TESTING.md` | Gates (tsc/lint/build) + E2E-Abnahme (curl `/api/faq`, Embed-Snippet, Rate-Limit/CORS) |
| `docs/ANFORDERUNGEN.md` | **Verbindliche Spezifikation** (Architektur, API-Vertrag v1, Web-Components-Pflicht, Abnahme) |
| `docs/EINBINDUNG.md` | Integrations-Doku fuer die godelmann.de-Agentur (Snippet, Attribute, CSS-Props, Events, CSP, Datenschutz) |
| `docs/BACKLOG.md` | **Fach-Backlog** — Release-Historie, Audit-Findings, offene Punkte (EN-FAQs, Kuratierung) |
| `docs/AUDIT-2026-07-12.md` · `docs/FINDINGS-2026-07-12.md` | Security-Audit-Ticket + Belege (0 Findings) |
| `CLAUDE.md` | Arbeitswissen (Tech-Stack Vanilla-TS/Vite lib-mode, Commands, Stages, Konventionen) |

## 3. Kern-Konventionen (gelten auch ohne Org-Checkout)

- **Gates vor Commit:** `npm run build` (= `tsc --noEmit` + Vite lib-build, muss 0 Fehler zeigen) + `npm run lint`.
  Kein Test-Runner im Repo (kleines Widget) — Abnahme ist E2E (`.xoder/TESTING.md`).
- Commits/PRs: **Conventional Commits, ASCII, KEIN AI-/Co-Authored-By-Footer** (flottenweit; org `.xoder/GITHUB.md`).
- **Bundle-Budget:** `dist/faq-widget.v1.js` < **60 kB gzip** (Ist v0.0.1: 4,2 kB gzip), self-contained, keine externen CDNs.
- **API-Stabilitaet:** `faq-widget.v1.js` ist eine **stabile URL** — Breaking Changes (Attribut-/Event-/Theming-API)
  ⇒ neue Datei `faq-widget.v2.js`, v1 bleibt bis zur abgestimmten Abschaltung.
- **Theming NUR** ueber dokumentierte CSS-Custom-Properties (`--gdm-faq-accent` = Godelmann-Rot `#E52D12`, ...).

---

## Rolle
- **Godelmann-FAQ** = oeffentliches **FAQ-Webmodul** fuer godelmann.de — Web Component `<godelmann-faq>`
  (WHATWG Custom Elements + Shadow DOM), **Vanilla TypeScript ohne Framework-Dependency**, Vite lib-mode.
- **Build-Artefakt:** ein ES-Modul `dist/faq-widget.v1.js` (versionierte URL), per `<script type="module">`
  framework-agnostisch auf godelmann.de eingebunden (TYPO3/WordPress/React/Vue egal).
- **Kette:** godelmann.de `<godelmann-faq>` → `GET {api-base}/api/faq?lang=de[&category=…]` → `godelmann-faq-server`
  (eigener SPASS-Server, Plattform-Muster wie gocreate/canari, systemd `godelmann-faq.service`, Port **3008**)
  → liest `status=approved AND published=true` `faq_entries` aus der **GoCreate-Supabase** (Service-Key server-side,
  Cache; **KEIN** User-Login). Inhalte entstehen/kuratiert in **GoCreate** (Sub-App 2, RAG-generierte Drafts +
  Spezialisten-Freigabe).
- **Stages:** Test `https://faq-test.godelmann.net` (LIVE seit 2026-07-12, LE-Cert, platform-test :3008) ·
  Prod `https://faq.godelmann.net` (LIVE, godelmann-prod :3008). CORS server-seitig nur `godelmann.de`/`www.godelmann.de`.
- **GitHub:** Godelmann/Godelmann-FAQ (Default-Branch `main`).

## Befunde / Stand (datiert)
- **2026-07-12 — v0.0.1: `<godelmann-faq>`-Widget als Web Component + Server/Ausspielung LIVE (test+prod).**
  Custom Element (Shadow DOM open, reaktive Attribute `lang`/`category`/`api-base`), barrierefreies Accordion,
  clientseitige Suche/Kategorien-Filter, sanitizter Mini-Markdown-Renderer (keine externe Lib), Events
  `gdm-faq:loaded|opened|error`. React komplett entfernt, `npm audit` 0 vulnerabilities (vite 8.1.4).
  Server LIVE: `godelmann-faq-server` (SPASS, platform-test :3008, systemd), Caddy-vhost `faq-test.godelmann.net`
  (LE-Cert, CORS nur godelmann.de, Widget-Cache 1h). **Prod ebenfalls LIVE** (`faq.godelmann.net`, godelmann-prod
  :3008, prod-Supabase-Migration + 688 Draft-Eintraege importiert). E2E bestanden. `docs/BACKLOG.md` Release-Historie.
- **2026-07-12 — Security-Audit (Fleet-Audit): 0 Findings** (kleines TS-Widget). Belege `docs/FINDINGS-2026-07-12.md`,
  Ticket `docs/AUDIT-2026-07-12.md`, Register `Godelmann/.xoder/FINDINGS.md`. 5 aeltere Repo-Audit-Findings
  (FAQ-P2-01..P3-02) mit v0.0.1 resolved.

## Offen (Zusammenfassung — Details `docs/BACKLOG.md` + `.xoder/BACKLOG.md`)
- **EN-FAQs** erst NACH Spezialisten-Approval der 688 deutschen Drafts (Uebersetzung nach demselben
  Fabrik-Muster, `lang=en` in `faq_entries`, Widget schaltet per `lang`-Attribut um).
- **Inhalte/Kuratierung** laufen in GoCreate (Sub-App 2: DB `faq_entries`, UI-Editor, Publish-Flow).
