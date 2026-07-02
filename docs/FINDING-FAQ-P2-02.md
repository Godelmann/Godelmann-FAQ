# FAQ-P2-02: Dev-Port 5009 in vite.config.ts konfigurieren

| | |
|---|---|
| **Projekt** | FAQ |
| **Schweregrad** | P2 |
| **Bereich** | Dev-Workflow |
| **Entdeckt** | 2026-07-02 (Multi-Agent-Audit) |
| **Status** | OPEN |

## Symptom
`npm run dev` startet den Vite-Dev-Server auf dem Default-Port **5173** statt auf dem projektzugewiesenen Port **5009**. Die Port-Paarung 5xxx/9xxx des Dev-First-Workflows (Vite 5009 + SPASS-Dev-Binary 9xxx) ist damit nicht hergestellt; die in CLAUDE.md und PORTS.md dokumentierte URL `http://localhost:5009` trifft nicht zu.

## Root Cause
In `vite.config.ts` fehlt der `server: { port: 5009 }`-Block. Ohne explizite Konfiguration verwendet Vite seinen eingebauten Default-Port 5173.

## Beleg
`vite.config.ts` (vollständig, kein `server`-Block):
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```
Zugewiesener Port dagegen dokumentiert:
- `CLAUDE.md:7` — `npm run dev          # Dev-Server auf http://localhost:5009`
- `platform-control/docs/PORTS.md:17` — `| 5009 | Godelmann-FAQ | platform-control/frontends/godelmann-faq |`

## Auswirkung
Rein entwicklungsseitig (Dev-Stage), keine Test-/Prod-Betroffenheit. Der lokale HMR-Workflow läuft auf dem falschen Port: VSCode-Remote-SSH-Port-Forwarding und die dokumentierte Browser-URL greifen nicht, und ein paralleler Start mehrerer Frontends kann in Port-5173-Kollisionen laufen. Doku und tatsächliches Verhalten divergieren.

## Reproduktion
1. In `/projects/platform-control/frontends/godelmann-faq` `npm run dev` ausführen.
2. Vite meldet `Local: http://localhost:5173/` statt `:5009`.

## Fix-Vorschlag
`server.port` in `vite.config.ts` ergänzen:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5009,
    strictPort: true,
  },
})
```
`strictPort: true` verhindert stilles Ausweichen auf einen Ersatz-Port, falls 5009 belegt ist. Kein Deploy nötig (reine Dev-Konfiguration).

## Referenzen
- [docs/BACKLOG.md](BACKLOG.md)
- `vite.config.ts` (godelmann-faq)
- `CLAUDE.md:7` (godelmann-faq)
- `platform-control/docs/PORTS.md:17`
- Memory: `reference_dev_ports.md`, `reference_dev_stage.md` (Dev-First-Flow Vite 5xxx + SPASS 9xxx)
