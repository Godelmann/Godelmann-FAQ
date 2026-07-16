# MONITORING.md — Godelmann-FAQ

Was laufend beobachtet werden muss. Health: [`HEALTHCHECK.md`](HEALTHCHECK.md). Topologie: [`NETWORK.md`](NETWORK.md).

> Kleines, statisches Web-Component-Bundle ohne eigene Runtime-Persistenz — die meisten Wachpunkte liegen
> auf der **Auslieferung** (`godelmann-faq-server`) und der **Inhalts-Frische** (GoCreate → `faq_entries`).

## Auslieferung / Erreichbarkeit
- `faq-test.godelmann.net` + `faq.godelmann.net` erreichbar (Widget-Script 200 + `/api/faq` 200).
- **TLS-Cert (LE):** Ablauf/Renewal im Blick behalten (Caddy-vhost auf platform-test/godelmann-prod;
  Test-Cert LIVE seit 2026-07-12). Bei Zertifikatswarnung → Caddy auf dem App-Server pruefen.
- **[PRUEFEN]** Ob ein Uptime-/HTTP-Monitor auf die beiden Hosts zeigt (im Repo nicht belegt) — empfehlenswert.

## Inhalts-Frische (Publish-Roundtrip)
- `/api/faq` spiegelt **nur** `status=approved AND published=true` aus der GoCreate-Supabase. Nach einem
  Publish-Toggle in GoCreate greift die Aenderung erst nach der **Cache-TTL** (Server ~5 min; Widget-Cache
  Caddy 1h) — beim Debuggen „warum sehe ich die Aenderung nicht" zuerst TTL bedenken.
- `count`/`categories` im `/api/faq`-JSON sind das Live-Signal fuer die Anzahl ausgespielter Eintraege.

## Rate-Limit / Missbrauch
- Server-`RateLimiter` (per IP, Key `X-Forwarded-For`) liefert 429. Gehaeufte 429 im Server-Log
  (`journalctl -u godelmann-faq`) → moegliche Scraper/Missbrauch; Schwellen ggf. anpassen.

## CORS-Drift
- Nur `https://www.godelmann.de` + `https://godelmann.de` sind erlaubt. Aendert die Agentur die
  Einbindungs-Domain (z. B. Subdomain), muss die **Server**-CORS-Whitelist mitgezogen werden — sonst
  bricht das Widget produktiv (Console-CORS-Fehler beim Nutzer). Kein Widget-seitiger Fix moeglich.

## Bundle-Groesse (Release-Wachpunkt)
- Vor jedem Release gzip-Groesse von `dist/faq-widget.v1.js` gegen das **60-kB-Budget** pruefen
  (Ist v0.0.1: 4,2 kB). Ueberschreitung ist ein harter Stopp (Anforderung, self-contained).

## Versions-/Deploy-Drift
- **Stabile v1-URL:** abwaertskompatible Fixes gehen **in-place** unter `faq-widget.v1.js` — nach Deploy
  pruefen, dass die ausgelieferte Datei dem gebauten `dist/` entspricht (kein stale DIST_DIR).
- **Breaking Changes** ⇒ neue Datei `faq-widget.v2.js` (v1 bleibt bis Abschaltung) — nie die v1-API brechen.
- Release-Sync: `> Stand:`-Kopf in `docs/BACKLOG.md` == `package.json`-Version
  (Memory `feedback_frontend_backlog_version_sync`).

## Datenschutz (Dauer-Invariante)
- Das Widget darf **nie** Cookies/Storage/Third-Party-Requests/Tracking einfuehren (`docs/EINBINDUNG.md` §6).
  Bei Feature-Arbeit diese Zusicherung aktiv erhalten — sie ist Teil der Agentur-/CSP-Doku.
