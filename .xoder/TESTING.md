# TESTING.md — Godelmann-FAQ

Gates + Abnahme. Konventionen/Details: `CLAUDE.md`, `docs/ANFORDERUNGEN.md`, `docs/EINBINDUNG.md`.

## Pflicht-Gates vor Commit
```bash
npm run build   # = tsc --noEmit + Vite lib-build -> dist/faq-widget.v1.js  (MUSS 0 Fehler zeigen)
npm run lint    # ESLint (typescript-eslint), 0 Errors
```
- **Kein Unit-Test-Runner im Repo** (kleines Web-Component-Widget, keine Vitest/Jest-Suite) — die
  Verifikation ist die **E2E-Abnahme** unten. `npm run build` ist das harte Gate: `tsc --noEmit`
  faengt Typfehler, die der Vite-Build allein ignoriert.
- **Bundle-Budget:** gebautes `dist/faq-widget.v1.js` muss **< 60 kB gzip** bleiben (Ist v0.0.1: 4,2 kB),
  self-contained (keine externen CDNs).
- `npm audit` sollte 0 vulnerabilities zeigen (v0.0.1: sauber, vite 8.1.4).

## Standalone-Preview (Dev)
```bash
npm run dev     # http://localhost:5009 (strictPort); Vite-Dev-Mock liefert /api/faq (vite.config.ts)
```
- `index.html` = Referenz-Einbindung (dient zugleich der godelmann.de-Agentur als Muster).
- Der Dev-Mock (`faqDevMock` in `vite.config.ts`) ist **nur Dev** (`apply: 'serve'`) und **nicht** im Build.

## E2E-Abnahme (gegen laufende Stage — `docs/ANFORDERUNGEN.md` §Abnahme)
```bash
# 1) API liefert Eintraege:
curl -s "https://faq-test.godelmann.net/api/faq?lang=de" | head -c 400
# 2) Kategorie-Filter serverseitig:
curl -s "https://faq-test.godelmann.net/api/faq?lang=de&category=produkte"
# 3) CORS-Negativtest (fremder Origin -> KEIN Allow-Origin):
curl -s -D- -o /dev/null -H "Origin: https://example.com" "https://faq-test.godelmann.net/api/faq?lang=de" | grep -i access-control
# 4) Rate-Limit-Negativtest: wiederholte Abrufe -> 429 (per IP)
```
- **Embed-Rendering:** Test-HTML mit dem `docs/EINBINDUNG.md`-Snippet rendert das Accordion; ein
  Publish-Toggle in GoCreate aendert die Ausspielung (Cache-TTL ≤ 5 min beachten).
- **Barrierefreiheit:** Accordion per Tastatur bedienbar (Tab, Enter/Leertaste, Pfeiltasten, Pos1/Ende),
  sichtbare Fokus-Ringe, `aria-expanded`/`aria-controls`, Panels `role="region"` (`docs/EINBINDUNG.md` §8).

## Gefahrlose Stage-Pruefungen
- `curl` auf `/api/faq` + Widget-Script sind read-only (kein Login) — jederzeit sicher gegen test **und** prod.
- CI/Storytelling-Konformitaet: Akzentfarbe Default `--gdm-faq-accent = #E52D12` (einziger Godelmann-Rotton).

> **[PRUEFEN]** Ob ein automatisierter E2E-/Smoke-Lauf (Playwright o. ae.) gewuenscht ist — derzeit
> ist die Abnahme manuell/`curl`-basiert (kein Test-Framework im Repo).
