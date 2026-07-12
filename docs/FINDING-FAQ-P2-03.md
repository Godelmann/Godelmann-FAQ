# FAQ-P2-03: npm audit: 1 high (vite 8.0.1) + 3 moderate fixen

| | |
|---|---|
| **Projekt** | FAQ |
| **Schweregrad** | P2 |
| **Bereich** | Security/Dependencies |
| **Entdeckt** | 2026-07-02 (Multi-Agent-Audit) |
| **Status** | RESOLVED (2026-07-12, v0.0.1) — `npm audit fix` (vite 8.1.4 u. a.), `npm audit` = 0 vulnerabilities |

## Symptom
`npm audit` im FAQ-Frontend meldet offene Advisories: 1 high (vite) und mehrere moderate. Der Live-Check bestätigt aktuell insgesamt 5 Findings (1 high, 3 moderate, 1 low). Der `vite`-Eintrag im lockfile ist verwundbar.

## Root Cause
`package.json` pinnt `vite: ^8.0.1`; installiert ist `vite@8.0.3` — innerhalb des betroffenen Bereichs `8.0.0 – 8.0.15`. Für diesen Bereich existieren mehrere Advisories:
- GHSA-4w7w-66w2-5vf9 — Path Traversal in Optimized Deps `.map`-Handling (high)
- GHSA-v2wj-q39q-566r — `server.fs.deny` via Queries umgehbar
- GHSA-p9ff-h696-f583 — Arbitrary File Read über den Dev-Server-WebSocket

Zusätzlich transitive moderate-Advisories (u. a. postcss, brace-expansion, js-yaml).

## Beleg
`package.json:28` → `"vite": "^8.0.1"`; installiert `node_modules/vite@8.0.3`.

`npm audit` (Repo `/projects/platform-control/frontends/godelmann-faq`, 2026-07-02):
```
vite  8.0.0 - 8.0.15   Severity: high
  GHSA-4w7w-66w2-5vf9  Path Traversal in Optimized Deps `.map` Handling
  GHSA-v2wj-q39q-566r  server.fs.deny bypassed with queries
  GHSA-p9ff-h696-f583  Arbitrary File Read via Vite Dev Server WebSocket
postcss <8.5.10        Severity: moderate  GHSA-qx2v-qp2m-jg93 (XSS in Stringify)
fix available via `npm audit fix`

5 vulnerabilities (1 low, 3 moderate, 1 high)
```

## Auswirkung
Alle vite-Advisories sind ausschließlich Dev-Server-relevant und betreffen kein Prod-Artefakt (statisches `dist/`). Relevanz besteht dennoch, weil der Dev-First-Workflow die Vite-Ports per VSCode Remote-SSH auf den Entwickler-Laptop forwardet — Path-Traversal / Arbitrary File Read über den Dev-Server-WebSocket sind so im lokalen Netz erreichbar. Kein Test/Prod-Stage-Impact, da dort keine Vite-Dev-Server laufen.

## Reproduktion
```
cd /projects/platform-control/frontends/godelmann-faq
npm audit
```
Ausgabe: `5 vulnerabilities (1 low, 3 moderate, 1 high)`, vite-high-Advisory gelistet.

## Fix-Vorschlag
```
cd /projects/platform-control/frontends/godelmann-faq
npm audit fix
npm audit   # 0 vulnerabilities verifizieren
```
`npm audit fix` hebt vite auf ≥ 8.0.16 (bzw. den gepatchten Stand) sowie die moderate/low-Transitiven (postcss, brace-expansion, js-yaml) an — alles innerhalb der bestehenden semver-Range, kein Breaking-Bump nötig. Anschließend `package-lock.json` (und ggf. `package.json`) committen. Kein Deploy erforderlich (reine Dev-Dependencies); ein normaler Frontend-Build-/Deploy-Zyklus zieht die Änderung ohnehin mit.

## Referenzen
- [docs/BACKLOG.md](BACKLOG.md)
- `package.json:28` (vite-Pin)
- Memory: `reference_dev_stage.md` (Dev-First-Flow, Port-Forwarding via VSCode Remote-SSH)
