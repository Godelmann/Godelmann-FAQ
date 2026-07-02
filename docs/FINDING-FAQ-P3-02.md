# FAQ-P3-02: Scaffold-Platzhalter ersetzen

| | |
|---|---|
| **Projekt** | FAQ |
| **Schweregrad** | P3 |
| **Bereich** | Scaffold/UI |
| **Entdeckt** | 2026-07-02 (Multi-Agent-Audit) |
| **Status** | OPEN |

## Symptom
Das Repo `godelmann-faq` ist unveränderter Vite-React-Scaffold. `index.html` deklariert `lang="en"` und trägt den Platzhalter-Titel `godelmann-faq`. `src/App.tsx` ist die Vite-Demo-Counter-Seite (State-Counter, Vite/React-Logos, „Explore Vite"-Links) statt einer FAQ-Oberfläche. Es existiert keine Backend-Anbindung.

## Root Cause
Nach dem `npm create vite`-Scaffold wurde kein anwendungsspezifischer Code hinzugefügt. Der generierte Boilerplate (HTML-Head, Demo-App) ist noch in-place; die für die erste Sub-App vorgesehenen Bausteine (FAQ-UI, Supabase/SPASS-Anbindung, Edge-Function `faq-public`, Embed-Widget) sind noch nicht angelegt.

## Beleg
Live-Check im Repo `/projects/platform-control/frontends/godelmann-faq` (2026-07-02, read-only):

- `index.html:2` → `<html lang="en">`
- `index.html:7` → `<title>godelmann-faq</title>`
- `src/App.tsx:1` → `import { useState } from 'react'`
- `src/App.tsx:8` → `const [count, setCount] = useState(0)`
- `src/App.tsx:26` → `onClick={() => setCount((count) => count + 1)}` / `src/App.tsx:28` → `Count is {count}`
- `ls src/` → nur `App.css App.tsx assets index.css main.tsx` (keine FAQ-Komponenten/Pages)
- `ls -d supabase` → nicht vorhanden (keine Migrationen, keine Edge-Function `faq-public`)

## Auswirkung
Kein Funktions-/Sicherheitsrisiko in Prod, da die App noch nicht als Sub-App ausgeliefert ist. Betrieblich: Das Projekt liefert keinen Nutzen; ein versehentliches Deployment würde die Vite-Demo-Seite mit falschem `lang`-Attribut (SEO/Accessibility) und Platzhalter-Titel zeigen. Blockiert den Start von Sub-App 2 aus dem GoCreate-Websites-Backlog.

## Reproduktion
1. `cd /projects/platform-control/frontends/godelmann-faq`
2. `grep -n -E 'lang=|<title>' index.html` → `lang="en"`, `<title>godelmann-faq</title>`
3. `grep -n count src/App.tsx` → Vite-Counter-Logik
4. `ls -d supabase` → nicht vorhanden

## Fix-Vorschlag
Scaffold durch die erste nutzbare FAQ-Version ersetzen:

1. **`index.html`**: `lang="en"` → `lang="de"`, `<title>godelmann-faq</title>` → echter Titel (z. B. „FAQ | GODELMANN"), Meta-Description ergänzen.
2. **`src/App.tsx`**: Vite-Demo-Counter durch FAQ-UI ersetzen (Routing + FAQ-Liste/Kategorien).
3. **Supabase/SPASS-Anbindung**: `supabase/`-Verzeichnis anlegen, Migration für FAQ-Tabellen + RLS, SPASS-WebSocket-Client analog anderer Frontends verdrahten.
4. **Edge-Function `faq-public`**: unter `supabase/functions/faq-public/` anlegen (öffentlicher Read-Only-Endpunkt für veröffentlichte FAQ-Einträge).
5. **Embed-Widget**: einbettbare Variante gemäß Sprint-Plan Sub-App 2 (GoCreate-Websites-Backlog) bereitstellen.

Kein Deploy vor Umsetzung; Reihenfolge und Umfang gemäß Sprint-Plan Sub-App 2.

## Referenzen
- [docs/BACKLOG.md](BACKLOG.md)
- Sprint-Plan Sub-App 2 (GoCreate-Websites-Backlog)
- `index.html`, `src/App.tsx` (godelmann-faq)
