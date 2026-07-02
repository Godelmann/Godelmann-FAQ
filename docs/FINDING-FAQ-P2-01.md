# FAQ-P2-01: CLAUDE.md Tech-Stack-Drift beheben

| | |
|---|---|
| **Projekt** | FAQ |
| **Schweregrad** | P2 |
| **Bereich** | Doku |
| **Entdeckt** | 2026-07-02 (Multi-Agent-Audit) |
| **Status** | OPEN |

## Symptom
`CLAUDE.md` beschreibt einen Tech-Stack, den das Repo nicht besitzt. Behauptet werden „React 18 + Vite + TypeScript + Tailwind + shadcn/ui + SPASS" sowie „Shared Supabase mit GoCreate (Port 8010)". Tatsächlich ist `godelmann-faq` ein vanilla Vite-Scaffold mit React 19.2.4 und ausschließlich `react` + `react-dom` als Runtime-Dependencies — ohne Tailwind, shadcn/ui, SPASS-Client oder Supabase-Anbindung.

## Root Cause
Die `CLAUDE.md` wurde offenbar aus dem Template eines etablierten Plattform-Frontends (GoCreate/Gravelli) kopiert, ohne den Ziel-/Ist-Stack für das noch leere FAQ-Scaffold anzupassen. Der Kontext-Text nennt einen aspirativen Stack als sei er implementiert; das Scaffold selbst wurde per `npm create vite@latest` (react-ts, React 19) erzeugt und seither nicht ausgebaut.

## Beleg
`CLAUDE.md` (Abschnitt „Tech Stack"):
```
- React 18 + Vite + TypeScript + Tailwind + shadcn/ui + SPASS
- Shared Supabase mit GoCreate (Port 8010)
```
Ist-Zustand aus `package.json`:
```json
"dependencies": {
  "react": "^19.2.4",
  "react-dom": "^19.2.4"
}
```
Keine der behaupteten Abhängigkeiten (`tailwindcss`, `@supabase/*`, shadcn/ui-Pakete wie `@radix-ui/*`, SPASS-Client) ist in `dependencies` oder `devDependencies` vorhanden. React-Major ist **19**, nicht **18**.

## Auswirkung
Reine Doku-Drift, keine Laufzeit- oder Sicherheitsfolge. Aber: Falscher Kontext führt Claude Code und Entwickler in die Irre — Annahmen über verfügbare Utilities (Tailwind-Klassen, shadcn-Komponenten, SPASS-WS-Client, Supabase-Schema auf Port 8010) sind falsch und würden zu fehlerhaften Änderungen führen. Kein Stage-Bezug (Test/Prod), da FAQ noch keine Domain/Deployment besitzt.

## Reproduktion
1. `cat /projects/platform-control/frontends/godelmann-faq/CLAUDE.md` → Tech-Stack-Zeilen lesen.
2. `cat /projects/platform-control/frontends/godelmann-faq/package.json` → nur `react` + `react-dom`, React `^19.2.4`.
3. Abgleich: keine Übereinstimmung mit dem in CLAUDE.md behaupteten Stack.

## Fix-Vorschlag
`CLAUDE.md` an die Realität angleichen. Zwei saubere Varianten:

**A) Ist-Stand dokumentieren** (empfohlen, solange das Scaffold leer ist):
```markdown
## Tech Stack
- React 19 + Vite + TypeScript (vanilla Vite-Scaffold, Stand: leer)
- Noch KEIN Tailwind, shadcn/ui, SPASS-Client oder Supabase angebunden
- Domain: (noch nicht zugewiesen)
- GitHub: Godelmann/Godelmann-FAQ
```

**B) Ziel-Stack explizit als solchen kennzeichnen**, falls der Plattform-Stack bewusst angestrebt wird:
```markdown
## Tech Stack (Ziel — noch NICHT implementiert)
- geplant: React 19 + Vite + TypeScript + Tailwind + shadcn/ui + SPASS
- geplant: Supabase-Anbindung (Port noch offen — 8010 ist von GoCreate belegt)
Ist-Stand: vanilla Vite-Scaffold, nur react + react-dom.
```
Zusätzlich die React-Version auf **19** korrigieren. Kein Migration-/Deploy-Hinweis nötig (Doku-only, kein Build betroffen).

## Referenzen
- [docs/BACKLOG.md](BACKLOG.md)
- `CLAUDE.md` (Abschnitt „Tech Stack")
- `package.json` (dependencies)
- Memory `feedback_frontend_backlog_version_sync` (Frontend-BACKLOG/Version-Sync-Regel)
