# DEPLOYMENT.md — Godelmann-FAQ

> **XODER-Dokument für den Deploy-/Release-Flow dieses Repos.** Alles läuft über Skripte auf
> `control.cockpit.plus` (`/projects/platform-control`) — nie von Hand kopieren.
>
> **Stand: 2026-08-01.** Landkarte der Maschinen: `Godelmann/.xoder/docs/STAGES.md`.

## 1. Frontend und Backend — zwei Teile, zwei Skripte

| Teil | Was | Skript | Name im Skript |
|---|---|---|---|
| **Frontend** — das Widget (dieses Repo) | `dist/faq-widget.v1.js` + `version.json` | `deploy-godelmann.sh` | **`faq`** |
| **Backend** — der Dienst (liegt im Repo `spass`) | `godelmann-faq-server` (Rust, :3008) | `deploy-spass.sh` | **`godelmann-faq`** |

> Die Namen sind **nicht** identisch: `faq` fuers Frontend, `godelmann-faq` fuers Backend.
>
> Reihenfolge bei kombinierten Aenderungen: erst Backend, dann Frontend.
>
> ```sh
> ./scripts/deploy-spass.sh godelmann-faq [--prod]     # 1. Backend
> ./scripts/deploy-godelmann.sh faq [--prod]           # 2. Frontend
> ```

## 2. Frontend ausliefern

```sh
# auf control, /projects/platform-control
./scripts/deploy-godelmann.sh faq                  # test
./scripts/deploy-godelmann.sh faq --prod           # Produktion (nur mit Freigabe)
./scripts/deploy-godelmann.sh faq --prod --dry-run
```

Ziel: `/opt/godelmann-faq/dist/` auf `platform-test` bzw. `godelmann-prod`, danach Neustart
von `godelmann-faq.service`.

Das Skript fängt drei Fehler ab, die am 01.08.2026 tatsächlich passiert sind:

1. **Veralteter Checkout** → Abbruch statt Auslieferung einer älteren Fassung.
2. **Kein blindes `--delete`** für Widgets → die serverseitige `index.html` bleibt liegen
   (ihr Löschen hatte beim Schwester-Widget einen 404 verursacht).
3. **Abnahme** nach jedem Lauf: HTTP-Status **und ausgelieferte Fassung**.

## 3. Stabile v1-URL — Besonderheit dieses Frontends

Die Einbindung zeigt dauerhaft auf `faq-widget.v1.js`. Abwärtskompatible Korrekturen gehen
deshalb **an Ort und Stelle** unter demselben Dateinamen — Kunden binden keine neue URL ein.

Folge: Nach jedem Deploy muss die Zwischenspeicherung berücksichtigt werden. Prüfen mit
Cache-Umgehung:

```sh
curl -s "https://faq.godelmann.net/version.json?_=$(date +%s)"
```

Eine **nicht** abwärtskompatible Änderung braucht eine neue Datei (`.v2.js`) und eine
abgestimmte Umstellung der Einbindung — nicht still unter v1 austauschen.

## 4. Fassung prüfen

```sh
curl -s https://faq-test.godelmann.net/version.json
curl -s https://faq.godelmann.net/version.json
```

## 5. Freigaben

- **test:** stehendes Go.
- **Produktion:** nur mit ausdrücklicher Freigabe — das Webmodul ist auf godelmann.de
  öffentlich eingebunden.

## Verwandt

- Maschinen, Ports, Domains, Fassungen: `Godelmann/.xoder/docs/STAGES.md`
- Deploy-SSoT der Flotte: `Ramteid-GmbH/platform-control/.xoder/DEPLOYMENT.md`
- Gleicher Aufbau beim Schwester-Widget: `Godelmann-Chatbot/.xoder/DEPLOYMENT.md`
