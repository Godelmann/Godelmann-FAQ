# Godelmann-FAQ

Öffentliches FAQ-Webmodul für **godelmann.de** — Web Component
`<godelmann-faq>` nach WHATWG-Standard (Custom Elements + Shadow DOM),
**Vanilla TypeScript ohne Framework-Dependency**. Vite baut das Widget als
einzelnes ES-Modul `dist/faq-widget.v1.js` (< 60 kB gzip), das vom
`godelmann-faq-server` ausgeliefert und per Script-Tag auf godelmann.de
eingebunden wird.

Die Inhalte (kuratierte Fachfragen + Antworten) entstehen in **GoCreate**
und werden über `GET /api/faq?lang=de[&category=…]` ausgespielt.

## Kommandos

```bash
npm run dev      # Standalone-Preview auf http://localhost:5009 (mit /api/faq-Mock)
npm run build    # tsc --noEmit + Vite lib-build -> dist/faq-widget.v1.js
npm run lint     # ESLint
```

Die Preview (`index.html`) dient zugleich als Referenz-Einbindung für die
godelmann.de-Agentur; der Vite-Dev-Server liefert unter `/api/faq` Mock-Daten
(nur Dev, siehe `vite.config.ts`).

## Doku

- [`docs/ANFORDERUNGEN.md`](docs/ANFORDERUNGEN.md) — verbindliche Spezifikation (Architektur, API-Vertrag, Abnahme)
- [`docs/EINBINDUNG.md`](docs/EINBINDUNG.md) — Integrations-Doku für die Agentur (Snippet, Attribute, CSS-Props, Events, CSP)
- [`docs/BACKLOG.md`](docs/BACKLOG.md) — Release-/Feature-Log
- `CLAUDE.md` — Repo-Kontext für Claude Code

## Stages

- **Test:** `https://faq-test.godelmann.net` (Caddy-vhost auf platform-test, Server-Port 3008) — geplant
- **Prod:** Hostname nach Godelmann-DNS-Freigabe (z. B. `faq.godelmann.de`)
