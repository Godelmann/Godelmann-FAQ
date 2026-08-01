# TIME.md — Zeit, Zeitzonen & NTP (Godelmann-FAQ)

> **XODER-Pflichtdokument.** SSoT für *jede* zeitbezogene Einstellung dieses Repos:
> Zeitzonen von Betriebssystem und Komponenten, Zeitabgleich (NTP) und **wann zuletzt
> validiert**.
>
> **Letzte Voll-Validierung: 2026-08-01** (live von `platform-test` und `godelmann-prod`
> erhoben: `timedatectl`, Zeitgeber-Bestand). Nächste Pflicht-Validierung: **bei jedem
> Server-Wechsel/Provisioning**, sonst **quartalsweise**.

## 1. Grundsatz

Dieses Repo besteht aus zwei Teilen mit unterschiedlichem Zeitbezug:

| Teil | Zeitzone | Warum |
|---|---|---|
| **Widget** (`dist/faq-widget.v1.js`, Browser-Modul) | **Ortszeit des Besuchers** | Keine eigene Uhr; das Widget rendert FAQ-Inhalte ohne Kalenderbezug. |
| **`godelmann-faq-server`** (SPASS, Rust, :3008) | **UTC** | Rust rechnet intern in UTC (`chrono`); Betriebssystem ist UTC. Kein JVM-Standardzeitzonen-Problem. |

Die flottenweite Regel „App-JVM auf `Europe/Berlin` festnageln" ist **nicht anwendbar** —
keine JVM, reiner UTC-Fall.

## 2. Zeitgeber

**Keine.** Für die FAQ existiert auf keiner Stufe ein systemd-Timer (geprüft am 01.08.2026
auf `platform-test` und `godelmann-prod`). Damit gibt es hier auch keine Zeitzonen-Fallgrube
bei geplanten Läufen.

> Falls später ein Zeitgeber dazukommt: Ein Zeitplan **ohne** ausdrückliche Zeitzone läuft auf
> diesen Hosts in **UTC**. Alles mit Kundenbezug braucht ein explizites `Europe/Berlin`.
> Belegtes Muster dafür: `Gravelli-Salone/.xoder/TIME.md` §2.

## 3. Zeitabgleich (NTP)

| Host | Zeitzone | NTP-Dienst | Uhr abgeglichen |
|---|---|---|---|
| `platform-test` (162.55.51.254) | `Etc/UTC` | aktiv (`systemd-timesyncd`) | ja |
| `godelmann-prod` (49.12.77.51) | `Etc/UTC` | aktiv (`systemd-timesyncd`) | ja |

Nachprüfen:

```sh
ssh godelmann-prod 'timedatectl'
```

## 4. Offene Punkte

- Keine.

## Verwandt

- Landkarte der Maschinen und Stufen: `Godelmann/.xoder/docs/STAGES.md`
- Netzlage der Org: `Godelmann/.xoder/NETWORK.md`
- Gleicher Aufbau beim Schwester-Widget: `Godelmann-Chatbot/.xoder/TIME.md`
