# NETWORK.md — Godelmann-FAQ (FAQ-Webmodul)

> **SSoT der Netz-/Topologie-Sicht** dieses Repos. Godelmann-FAQ liefert **nur das Frontend-Artefakt**
> (ein Web-Component-Bundle `dist/faq-widget.v1.js`); ausgeliefert und mit Daten versorgt wird es vom
> separaten **`godelmann-faq-server`** (SPASS-Server, spass-Repo `examples/`). Das Widget spricht
> ausschliesslich **einen** oeffentlichen Endpunkt an: `GET /api/faq`.
>
> **Stand:** 2026-07-14. **Verifikationsbasis:** Repo-Doku (`CLAUDE.md`, `README.md`,
> `docs/ANFORDERUNGEN.md`, `docs/EINBINDUNG.md`, `docs/BACKLOG.md`, `vite.config.ts`), `git log`,
> Org-`Godelmann/CLAUDE.md`. Keine Live-Erhebung in dieser Session; Punkte ohne Repo-Beleg sind mit
> **[PRUEFEN]** markiert.

---

## 1. Nodes

| Node | Stage | Host / Port | Was laeuft dort |
|---|---|---|---|
| **`<godelmann-faq>`-Widget** | beide | Browser (Client) | Vanilla-TS Custom Element (Shadow DOM open), aus `faq-widget.v1.js`; clientseitige Suche/Filter; **keine** Runtime-Dependency |
| **godelmann.de** | Prod | Kunden-CMS (extern) | Host-Seite, bindet das Widget per `<script type="module">` ein (Agentur-Integration, `docs/EINBINDUNG.md`) |
| **godelmann-faq-server** (test) | **test** | `platform-test` `10.0.0.4` (privat, nbg1), Port **3008** | SPASS-Server (systemd `godelmann-faq.service`), liefert `faq-widget.v1.js` (DIST_DIR) + `GET /api/faq` |
| **godelmann-faq-server** (prod) | **prod** | `godelmann-prod` `49.12.77.51` (fsn1), Port **3008** | wie test; eigene/prod-Supabase-Anbindung |
| **GoCreate-Supabase** (`gocreate-db`) | je Stage | auf demselben App-Server (test 10.0.0.4 / prod 49.12.77.51) | Postgres mit `faq_entries` — der FAQ-Server liest **server-side mit Service-Key** (kein User-Login) |
| **control** (Sprungbrett) | ops | `control.cockpit.plus` → `178.104.35.116` | 2-Hop-Jump-Host zu beiden App-Servern (Server-Keys liegen dort) |

**Port 3008** ist die zentrale Port-Registry-Zuweisung fuer den FAQ-Server (`git 7a9d267`); test **und** prod
nutzen 3008 auf ihrem jeweiligen Server. **[PRUEFEN]** exakte Prod-Port-/Container-Belegung (im Repo nur
„godelmann-prod :3008" belegt).

## 2. Netz-Segmente & Trust-Boundaries

- **Oeffentlich (Ingress):** `faq-test.godelmann.net` (Test, LIVE seit 2026-07-12, LE-Cert) /
  `faq.godelmann.net` (Prod, LIVE) — TLS via **Caddy-vhost** auf dem jeweiligen App-Server. **Kein User-Login**:
  das Widget macht ausschliesslich lesende `GET`-Abrufe redaktioneller Inhalte.
  > **Hinweis (Doku-Drift):** `CLAUDE.md`/`README.md`/`ANFORDERUNGEN.md` nennen teils den **geplanten** Prod-Namen
  > `faq.godelmann.de`; **live** ist `faq.godelmann.net` (`git 62064b1`, `docs/BACKLOG.md`). Snippet-Host in
  > `docs/EINBINDUNG.md` = `faq-test.godelmann.net`. [PRUEFEN] finaler Prod-Vanity-Name nach Godelmann-DNS-Freigabe.
- **CORS-Grenze (server-seitig):** Der FAQ-Server erlaubt `/api/faq` NUR fuer Origins `https://www.godelmann.de`
  und `https://godelmann.de` (`docs/ANFORDERUNGEN.md`). Fremd-Origins → CORS-Negativ (Abnahme-Testfall).
- **Rate-Limit:** per IP (Framework-`RateLimiter`, Key aus `X-Forwarded-For`), 429 bei Ueberschreitung;
  **kein ALTCHA** (read-only). Serverseitig, nicht im Widget.
- **Datenschutz-Grenze (Widget):** setzt **keine Cookies**, nutzt **kein** Local-/Session-Storage, sammelt
  **keine** personenbezogenen Daten, laedt **keine** Third-Party-Ressourcen (Fonts/Bilder/CDN/`eval`) —
  nur der `fetch` auf `/api/faq` (`docs/EINBINDUNG.md` §6).

## 3. Ingress

| Stage | Oeffentliche URL | Widget-Script | API | Ziel |
|---|---|---|---|---|
| **prod** | `https://faq.godelmann.net` | `…/faq-widget.v1.js` | `GET …/api/faq?lang=de[&category=…]` | godelmann-prod `godelmann-faq.service` :3008 |
| **test** | `https://faq-test.godelmann.net` | `…/faq-widget.v1.js` | `GET …/api/faq?lang=de[&category=…]` | platform-test `godelmann-faq.service` :3008 |

**api-base-Ableitung:** Das Widget leitet die API-Basis automatisch aus seiner eigenen Script-URL ab
(`import.meta.url`) — Script von `https://faq-test.godelmann.net/…` ⇒ API-Aufrufe an denselben Host.
Das `api-base`-Attribut ist nur fuer Sonderfaelle/Tests.

## 4. API-Vertrag (v1) — die einzige App-Schnittstelle

`GET /api/faq?lang=de[&category=<slug>]` → JSON:
```json
{ "generated_at": "…", "count": 123, "categories": ["produkte", …],
  "entries": [{ "slug": "…", "question": "…", "answer_md": "…",
                "category": "produkte", "sort_order": 10,
                "source_urls": ["https://www.godelmann.de/…"] }] }
```
- Nur `status=approved AND published=true`. Zielantwortzeit < 100 ms (Server-Cache). Fehler als JSON `{error}`
  mit korrektem Status-Code. Widget-seitig Graceful Degradation (dezente DE-Fehlermeldung, kein Layout-Bruch).
- **Cache-TTL:** Server-Cache ~5 min (`ANFORDERUNGEN.md`) bzw. Widget-Auslieferungs-Cache 1h (Caddy, `docs/BACKLOG.md`) —
  **[PRUEFEN]** exakte gelebte TTL-Werte je Schicht.

## 5. Egress (externe Abhaengigkeiten)

| Ziel | Zweck | Anbindung |
|---|---|---|
| **GoCreate-Supabase** (`faq_entries`) | Inhaltsquelle (approved+published FAQ-Eintraege) | `godelmann-faq-server` liest server-side mit **Service-Key** (nicht das Widget); Cache |
| **godelmann.de** (Quell-Links) | „Mehr dazu:"-Links in Antworten (`source_urls`) | normale `<a>`-Navigation im Browser, `rel="noopener noreferrer"` |

Das **Widget selbst** hat sonst **keinen** Egress (keine Fonts/CDN/Analytics). Inhalte werden in **GoCreate**
kuratiert (Sub-App 2, RAG-Drafts + Spezialisten-Freigabe) und via `faq_entries` ausgespielt.

## 6. Request-/Daten-Fluss

```
godelmann.de (Host-Seite)
  │  <script type="module" src="https://faq.godelmann.net/faq-widget.v1.js">
  ▼
<godelmann-faq> (Shadow DOM)
  │  GET https://faq.godelmann.net/api/faq?lang=de[&category=…]   (einziger Backend-Call)
  ▼
Caddy (App-Server, TLS)  → localhost:3008
  ▼
godelmann-faq-server (:3008, SPASS)
  │  CORS-Check (nur godelmann.de) · RateLimit (X-Forwarded-For) · 5-min-Cache
  └─►  GoCreate-Supabase faq_entries  (Service-Key, WHERE status=approved AND published=true)
```

## 7. Zugang / SSH-Topologie (2-Hop ueber control)

- **Vom Mac zum Jump-Host:** `ssh -i ~/.ssh/cockpit_plus_ed25519 root@control.cockpit.plus`
  (Host-Alias `platform-control`).
- **2. Hop (Server-Keys liegen auf control):**
  - **test:** `ssh control.cockpit.plus 'ssh platform-test'` (`-i /root/.ssh/platform root@10.0.0.4`)
  - **prod:** `ssh control.cockpit.plus 'ssh godelmann-prod'` (`-i /root/.ssh/godelmann-prod root@49.12.77.51`)
- **Service-Diagnose:** `journalctl -u godelmann-faq -f` bzw. `systemctl status godelmann-faq` auf dem jeweiligen Server.
- **Deploy:** Der FAQ-Server lebt im **spass-Repo** (`examples/`, Plattform-Muster). Auslieferung des Widget-Bundles
  (`dist/faq-widget.v1.js` → DIST_DIR des Servers) + Server-Deploy laufen ueber die SPASS-Deploy-Skripte auf control.
  **[PRUEFEN]** exakter Skript-/Flag-Name fuer den FAQ-Server (Muster analog GoCreate `deploy-spass.sh gocreate [--prod]`;
  im FAQ-Repo nicht als Skript hinterlegt).

## 8. Offene Netz-Punkte (explizit offen — nicht erfunden)

- **[PRUEFEN]** Finaler Prod-Vanity-Hostname (`faq.godelmann.net` live vs. geplantes `faq.godelmann.de`) nach DNS-Freigabe.
- **[PRUEFEN]** Cloudflare-Fronting der `*.godelmann.net`-Domains (Repo belegt nur Caddy-TLS auf dem App-Server).
- **[PRUEFEN]** Exakte gelebte Cache-TTLs (Server 5 min vs. Caddy-Widget-Cache 1h) und Prod-Port-/Container-Details.
- **[PRUEFEN]** Exakter Deploy-Weg/Skriptname des `godelmann-faq-server` (liegt im spass-Repo, nicht in diesem Repo).

---
Siehe `.xoder/HEALTHCHECK.md` (Ende-zu-Ende-Sweep) · `.xoder/MONITORING.md` (laufende Wachpunkte) ·
`.xoder/TESTING.md` (Gates/Abnahme) · `docs/ANFORDERUNGEN.md` (Spezifikation) · `docs/EINBINDUNG.md`
(Agentur-Integration) · `CLAUDE.md` (App-Spezifika). Org-Konvention: `Godelmann/.xoder/` (falls ausgecheckt).
