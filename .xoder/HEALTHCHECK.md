# HEALTHCHECK.md — Godelmann-FAQ

Verifizieren, dass das FAQ-Webmodul end-to-end gesund ist. Topologie: [`NETWORK.md`](NETWORK.md).

## Widget-Auslieferung (Caddy → godelmann-faq-server DIST_DIR)
```bash
curl -s -o /dev/null -w "test  widget %{http_code}\n" https://faq-test.godelmann.net/faq-widget.v1.js
curl -s -o /dev/null -w "prod  widget %{http_code}\n" https://faq.godelmann.net/faq-widget.v1.js
```
- 200 + `Content-Type: text/javascript` (ES-Modul) erwartet. Datei ist die **stabile** v1-URL.

## API-Vertrag (`GET /api/faq`)
```bash
curl -s "https://faq-test.godelmann.net/api/faq?lang=de" | head -c 400   # JSON {generated_at,count,categories,entries[]}
curl -s "https://faq.godelmann.net/api/faq?lang=de&category=produkte"    # nur Kategorie produkte
```
- Liefert nur `status=approved AND published=true`. `count` > 0 erwartet (prod: 688 Drafts importiert —
  sichtbar wird nur, was in GoCreate approved+published ist). Zielantwortzeit < 100 ms (Cache).

## CORS (server-seitig, nur godelmann.de)
```bash
# Positiv (erlaubter Origin) -> Access-Control-Allow-Origin gesetzt:
curl -s -D- -o /dev/null -H "Origin: https://www.godelmann.de" "https://faq.godelmann.net/api/faq?lang=de" | grep -i access-control
# Negativ (fremder Origin)   -> KEIN Allow-Origin-Header:
curl -s -D- -o /dev/null -H "Origin: https://example.com"      "https://faq.godelmann.net/api/faq?lang=de" | grep -i access-control
```

## Embed-Rendering (Browser)
- `docs/EINBINDUNG.md`-Snippet in eine Testseite (oder die Standalone-Preview `index.html`) einbinden →
  `<godelmann-faq>` rendert Accordion + Kategorien-Filter + Suchfeld; Eintraege oeffnen/schliessen barrierefrei.
- Events feuern: `document.addEventListener('gdm-faq:loaded', e => console.log(e.detail.count))` zeigt Anzahl.

## Publish-Roundtrip (Inhalts-Frische)
- Publish-Toggle eines Eintrags in GoCreate (FAQ-Sektion) → nach Cache-TTL (≤ 5 min) im `/api/faq` sichtbar/verschwunden.

## Server / Service (2-Hop ueber control)
```bash
# test:  ssh control.cockpit.plus 'ssh platform-test   "systemctl status godelmann-faq"'
# prod:  ssh control.cockpit.plus 'ssh godelmann-prod  "systemctl status godelmann-faq"'
# Live-Logs: journalctl -u godelmann-faq -f
```

## Fehlerbilder
- **`/api/faq` leer trotz Daten:** kein Eintrag ist `approved AND published` — in GoCreate pruefen (kein Widget-Bug).
- **CORS-Fehler im Browser trotz godelmann.de:** Origin nicht in der Server-Whitelist / falscher Host — Server-Config pruefen.
- **429:** Rate-Limit (per IP, `X-Forwarded-For`) getroffen — erwartetes Verhalten unter Last, kein Defekt.
- **Widget zeigt dezente Fehlermeldung:** API down/unerreichbar → Graceful Degradation (kein Layout-Bruch); Server-Health pruefen.

> **[PRUEFEN]** Health-/Version-Endpunkt des `godelmann-faq-server` (analog GoCreate `/version.json`) —
> im FAQ-Repo nicht belegt; ggf. serverseitig vorhanden.
