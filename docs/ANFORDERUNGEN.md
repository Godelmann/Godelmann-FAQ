# Anforderungen — Godelmann-FAQ (godelmann.de-Webmodul, Sub-App 2)

> Stand 2026-07-12 · Maintainer Dietmar Scharf · Quelle: GoCreate-Websites-Plan
> (GoCreate `docs/BACKLOG.md` §„Websites" 1065-1149) + RAG-Endausbau-Plan.
> Dieses Repo liefert das **öffentliche FAQ-Webmodul**; die Inhalte entstehen
> und werden kuratiert in **GoCreate** (FAQ-Sektion mit Spezialisten-Annotationen).

## Ziel

Kuratierte Godelmann-Fachfragen+Antworten (~600 DE zum Start, RAG-generiert und
von Godelmann-Spezialisten in GoCreate freigegeben) als einbettbares Webmodul
für godelmann.de — **eigener Hostname**, Integration per Script-Tag.

## Architektur (entschieden 2026-07-12)

```
godelmann.de  ──<script src="https://faq-test.godelmann.net/faq-widget.v1.js">──▶
  Custom Element <godelmann-faq>  ──GET /api/faq?lang=de[&category=…]──▶
    godelmann-faq-server (eigener SPASS-Server, platform-test, PORT 9009)
      └─ liest published+approved faq_entries aus GoCreate-Supabase
         (Service-Key server-side, 5-min-Cache) — KEIN User-Login
```

- **Eigener SPASS-Server** `godelmann-faq-server` (spass-Repo `examples/`,
  Plattform-Muster wie gocreate/canari/frahcs), systemd `godelmann-faq.service`.
- **Hostname:** Test `faq-test.godelmann.net` (Caddy-vhost auf platform-test,
  CORS dort NUR `https://www.godelmann.de` + `https://godelmann.de`);
  Prod-Hostname (z. B. `faq.godelmann.de`) nach Godelmann-DNS-Freigabe.
- **Widget:** dieses Repo, Vite-Build als Embed-Script `faq-widget.v1.js`
  (versioniert, Custom Element, Shadow-DOM für CSS-Isolation) + Standalone-
  Preview-Seite (`index.html`) für Entwicklung/Abnahme. DIST_DIR wird vom
  eigenen Server ausgeliefert.

## API-Vertrag (v1)

`GET /api/faq?lang=de[&category=<slug>]` →
```json
{ "generated_at": "…", "count": 123, "categories": ["produkte", …],
  "entries": [{ "slug": "…", "question": "…", "answer_md": "…",
                 "category": "produkte", "sort_order": 10,
                 "source_urls": ["https://www.godelmann.de/…"] }] }
```
- Nur `status=approved AND published=true`. Antwortzeit < 100 ms (Cache).
- Rate-Limit per IP (Framework-`RateLimiter`, Key aus `X-Forwarded-For`),
  kein ALTCHA (read-only). Fehler als JSON `{error}` + korrekte Status-Codes.

## Widget-Anforderungen — Web-Components-Standard (PFLICHT)

**Das Modul MUSS dem Web-Components-Standard entsprechen** (Custom Elements +
Shadow DOM + `<template>`; WHATWG HTML/DOM Living Standards, vormals W3C) —
damit die godelmann.de-Agentur es framework-agnostisch einbinden kann:

```html
<script type="module" src="https://faq-test.godelmann.net/faq-widget.v1.js"></script>
<godelmann-faq lang="de" category="produkte"></godelmann-faq>
```

1. **Custom Element `<godelmann-faq>`** (`customElements.define`), Konfiguration
   ausschließlich über HTML-Attribute: `lang` (default `de`), `category`
   (optional), `api-base` (default = Script-Origin). Attribute reaktiv
   (`observedAttributes`).
2. **Shadow DOM (open)** für CSS-Isolation; Theming NUR über dokumentierte
   CSS-Custom-Properties (`--gdm-faq-accent`, `--gdm-faq-font`, …).
3. **Events** nach außen als `CustomEvent` (z. B. `gdm-faq:opened` mit
   `{slug}` im detail) — keine globalen Callbacks.
4. Kategorien-Tabs + Suchfeld (client-seitig), Accordion je Frage,
   Markdown-Rendering sanitized, Quell-Links aus `source_urls`.
5. Bundle < 60 kB gzip, self-contained (keine externen CDNs), ES-Module +
   versionierte URL (`faq-widget.v1.js`) — Breaking Changes ⇒ `v2`.
6. Barrierefrei (Tastatur-Navigation, ARIA für Accordion), DE-Texte.
7. Graceful Degradation: API down → dezente Fehlermeldung, kein Layout-Bruch.

## Pflicht-Deliverable: `docs/EINBINDUNG.md` (deutsch)

Deutsche Integrations-Doku für die godelmann.de-Agentur in DIESEM Repo:
Snippet (wie oben), alle Attribute mit Defaults, alle CSS-Custom-Properties,
alle Events, CSP-Hinweise (script-src + connect-src auf den FAQ-Host),
Versionierungs-/Update-Politik, Ansprechpartner. Die Standalone-Preview
(`index.html`) dient der Agentur als Referenz-Einbindung.

## Abnahme (E2E)

- `curl https://faq-test.godelmann.net/api/faq?lang=de` liefert Einträge.
- Test-HTML mit Embed-Snippet rendert Accordion; Publish-Toggle in GoCreate
  ändert die Ausspielung (Cache-TTL ≤ 5 min beachten).
- Rate-Limit-Negativtest (429), CORS-Negativtest von fremdem Origin.

## Bezüge

- Inhalte/Kuratierung: GoCreate FAQ-Sektion (`faq_entries`/`faq_annotations`,
  Permission `faq.manage`) — siehe GoCreate `docs/BACKLOG.md` Sub-App 2.
- Fernziel: approbierte+annotierte Einträge → Feintuning-Datensatz
  (dgx-llm-stack `docs/FEINTUNING.md`).
