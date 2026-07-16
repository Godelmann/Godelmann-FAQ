# .xoder/BACKLOG.md — Godelmann-FAQ (Projekt-Backlog, XODER-verwaltbar)

> XODER-Prinzip: Eintraege gehoeren ins Backlog der passenden Ebene (Landschaft/Meta →
> `~/Projects/.xoder/BACKLOG.md`, Org → `Godelmann/.xoder/`, Projekt → HIER).
> **Standalone-Autarkie:** Fehlen die Parent-Ebenen lokal, kommt ALLES hierher; Parent-Themen in die
> Sektion **„PARENT (zur Promotion)"** unten. **Fach-Backlog (SSoT, umfangreich):** [`../docs/BACKLOG.md`](../docs/BACKLOG.md)
> (Release-Historie, Audit-Findings, offene Inhalts-/Feature-Punkte). Diese Datei ist die
> **XODER-Betriebs-Sicht** — Verweise + offene Betriebs-/Hygiene-Punkte, keine Duplikate.

**Stand:** 2026-07-14 · Paket-Version **v0.0.1** (test+prod LIVE). Release-Sync: `> Stand:`-Kopf in
`docs/BACKLOG.md` MUSS die `package.json`-Version nennen (Memory `feedback_frontend_backlog_version_sync`).

## 1. Aktive Straenge / offene Punkte

- **EN-FAQs (wartet auf Approval).** Erst NACH Spezialisten-Approval der 688 deutschen Drafts:
  approbierte DE-Eintraege nach demselben Fabrik-Muster (Generierung + adversariale Verifikation)
  uebersetzen, `lang=en` in `faq_entries`, Widget schaltet per `lang`-Attribut um. Detail `docs/BACKLOG.md` §Offene Punkte.
- **Inhalte / Kuratierung (in GoCreate).** Sub-App 2: DB `faq_entries`, UI-Editor, Publish-Flow —
  liegt fachlich in GoCreate (`Godelmann/GoCreate/docs/BACKLOG.md` § Websites / Sub-App 2), nicht in diesem Repo.
  Dieses Widget spiegelt nur `status=approved AND published=true`.

## 2. Betriebs-/Hygiene-Punkte

- [ ] **Prod-Vanity-Hostname finalisieren.** Live ist `faq.godelmann.net`; `CLAUDE.md`/`README.md`/
  `docs/ANFORDERUNGEN.md` nennen teils das geplante `faq.godelmann.de`. Nach Godelmann-DNS-Entscheid
  Doku + Embed-Snippet (`docs/EINBINDUNG.md`) angleichen (nur Host aendert sich, Attribut-/Event-API bleibt).
- [ ] **Bundle-Budget-Wachpunkt.** `dist/faq-widget.v1.js` < 60 kB gzip halten (Ist 4,2 kB) — bei neuen
  Features gzip-Groesse vor Release pruefen (`.xoder/TESTING.md`).
- [ ] **Cache-TTL-Klarstellung.** Gelebte TTLs dokumentieren (Server-Cache ~5 min vs. Caddy-Widget-Cache 1h) —
  relevant fuers Publish-Roundtrip-Timing in GoCreate (`.xoder/MONITORING.md`).

## 3. Security / Audit

- **Security-Audit 2026-07-12: 0 Findings** (kleines TS-Widget). Belege `docs/FINDINGS-2026-07-12.md`,
  Ticket `docs/AUDIT-2026-07-12.md`, Org-Register `Godelmann/.xoder/FINDINGS.md`. 5 aeltere Repo-Audit-Findings
  (FAQ-P2-01..P3-02) mit v0.0.1 resolved. **Nichts offen.**

## PARENT (zur Promotion)

> Eintraege, die inhaltlich auf eine Parent-Ebene gehoeren (Org-`.xoder`-Repo `Godelmann/.xoder` /
> `~/Projects`-Meta), hier sammeln, wenn die Parent-Ebene lokal fehlt — beim naechsten Kontakt
> dorthin promoten.

- **[Org / Godelmann]** Standardausstattungs-Policy: jedes Godelmann-Projekt braucht `docs/LOVABLE.md` (sofern
  Lovable-Ursprung) + adaptierten `do-everything`-Skill (Memory `projekt-standardausstattung-policy`).
  Godelmann-FAQ ist **kein** Lovable-Projekt (Vanilla-TS/Vite lib-mode) → LOVABLE.md n/a; ob ein eigener
  `do-everything-godelmann-faq`-Skill gewuenscht ist, org-weit klaeren. Gehoert in `Godelmann/.xoder/`.
- **[Org / Godelmann]** Schwester-Modul **Godelmann-Chatbot** (FAQ/Chatbot sind Web-Module-Geschwister) hat
  **noch kein `.xoder/`** (Stand 2026-07-14). XODER-Grundausstattung dort analog nachziehen. Gehoert als
  Rollout-Vermerk in `Godelmann/.xoder/`.
