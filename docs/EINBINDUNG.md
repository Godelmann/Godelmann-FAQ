# Einbindung des GODELMANN-FAQ-Widgets auf godelmann.de

> Stand: 2026-07-12 · Widget-Version: v1 (`faq-widget.v1.js`) · Für die godelmann.de-Agentur
>
> Das FAQ-Modul ist eine **Web Component nach WHATWG-Standard** (Custom Element
> `<godelmann-faq>` mit Shadow DOM). Es ist framework-agnostisch: Die Einbindung
> funktioniert in statischem HTML genauso wie in TYPO3-, WordPress-, React- oder
> Vue-Seiten. Es gibt **keine** JavaScript-API, die aufgerufen werden muss —
> Script laden, Element platzieren, fertig.

## 1. Einbindungs-Snippet

```html
<script type="module" src="https://faq-test.godelmann.net/faq-widget.v1.js"></script>

<godelmann-faq lang="de"></godelmann-faq>
```

Optional auf eine Kategorie beschränkt (z. B. auf einer Produkt-Unterseite):

```html
<godelmann-faq lang="de" category="produkte"></godelmann-faq>
```

Hinweise:

- Das `<script>`-Tag gehört idealerweise einmalig in den `<head>` oder an das
  Ende des `<body>`; das Element kann danach beliebig oft auf der Seite stehen.
- `type="module"` ist Pflicht (ES-Modul). Module werden automatisch deferred —
  die Einbindung blockiert das Seiten-Rendering nicht.
- Der Prod-Hostname (z. B. `faq.godelmann.de`) ersetzt nach DNS-Freigabe nur
  den Host im Snippet; Attribut- und Event-API bleiben identisch.

## 2. Attribute

Alle Attribute sind optional und **reaktiv** — eine Änderung per JavaScript
(`el.setAttribute(...)`) lädt die Einträge automatisch neu.

| Attribut | Default | Bedeutung |
|---|---|---|
| `lang` | `de` | Sprache der FAQ-Einträge (an die API durchgereicht). |
| `category` | *(leer)* | Fixiert das Widget auf eine Kategorie (Server-Filter). Die Kategorien-Leiste wird dann ausgeblendet. Ohne Attribut zeigt das Widget alle Kategorien als anklickbare Filter („Alle" zuerst). |
| `api-base` | Origin der Widget-Script-URL | Basis-URL der FAQ-API. Muss normalerweise **nicht** gesetzt werden — das Widget leitet sie automatisch aus seiner eigenen Script-URL ab (Script von `https://faq-test.godelmann.net/…` ⇒ API-Aufrufe an denselben Host). Nur für Sonderfälle/Tests. |

## 3. Theming (CSS-Custom-Properties)

Das Widget rendert in einem **Shadow DOM** — Seiten-CSS kann das Innere nicht
versehentlich beeinflussen und umgekehrt. Anpassungen erfolgen ausschließlich
über folgende CSS-Custom-Properties (auf dem Element oder einem Eltern-Selektor):

| Property | Default | Wirkung |
|---|---|---|
| `--gdm-faq-accent` | `#E52D12` (Godelmann-Rot) | Akzentfarbe: aktive Kategorie, Accordion-Pfeil, Links, Fokus-Ringe. |
| `--gdm-faq-font` | `inherit` (Seiten-Schrift) | Schriftfamilie des Widgets. |
| `--gdm-faq-radius` | `10px` | Eckenradius von Suchfeld, Einträgen und Meldungen. |
| `--gdm-faq-max-width` | `52rem` | Maximale Breite des Widgets. |

Beispiel:

```html
<style>
  godelmann-faq {
    --gdm-faq-accent: #1a6b4a;
    --gdm-faq-radius: 2px;
    --gdm-faq-max-width: 40rem;
  }
</style>
```

## 4. Events

Das Widget feuert `CustomEvent`s (mit `bubbles: true` und `composed: true` —
also auch auf `document` abonnierbar), z. B. für Web-Analytics:

| Event | `event.detail` | Wann |
|---|---|---|
| `gdm-faq:loaded` | `{ count: number }` | Einträge erfolgreich von der API geladen. |
| `gdm-faq:opened` | `{ slug: string }` | Ein Accordion-Eintrag wurde geöffnet. |
| `gdm-faq:error` | `{ message: string }` | Laden fehlgeschlagen (das Widget zeigt selbst eine dezente deutsche Fehlermeldung — kein Layout-Bruch). |

Beispiel:

```html
<script>
  document.addEventListener('gdm-faq:opened', (e) => {
    console.log('FAQ geöffnet:', e.detail.slug);
  });
</script>
```

## 5. Content-Security-Policy (CSP)

Falls godelmann.de eine CSP setzt, müssen zwei Direktiven den FAQ-Host erlauben:

```
script-src  ... https://faq-test.godelmann.net;
connect-src ... https://faq-test.godelmann.net;
```

- `script-src` — für das Laden von `faq-widget.v1.js`.
- `connect-src` — für den `fetch`-Abruf von `/api/faq`.

Das Widget lädt **keine** weiteren Ressourcen (keine Fonts, Bilder, CDNs,
kein `eval`/Inline-Script). Nach dem Prod-Umzug den Hostnamen entsprechend
ersetzen. Die Quell-Links in den Antworten zeigen auf `www.godelmann.de`
(normale `<a>`-Navigation, CSP-seitig keine Freigabe nötig).

## 6. Datenschutz

- Das Widget setzt **keine Cookies** und nutzt **kein** Local-/Session-Storage.
- Es werden **keine personenbezogenen Daten** erhoben oder übertragen — es
  erfolgen ausschließlich lesende **GET-Abrufe** der redaktionellen
  FAQ-Inhalte (`/api/faq`).
- Kein Tracking, keine Third-Party-Requests; Suche und Filter laufen rein
  clientseitig im Browser.

## 7. Versionierung / Updates

- Die URL `faq-widget.v1.js` ist **stabil**: Fehlerbehebungen und abwärts-
  kompatible Verbesserungen werden **in-place** unter derselben URL
  veröffentlicht — die Agentur muss nichts ändern.
- **Breaking Changes** (Attribut-/Event-/Theming-API) erscheinen als neue URL
  `faq-widget.v2.js`; die v1-URL bleibt bis zur abgestimmten Abschaltung
  funktionsfähig. Umstellung nur nach Ankündigung.

## 8. Barrierefreiheit (integriert)

Accordion nach ARIA-Muster (`button` mit `aria-expanded`/`aria-controls`,
Antwort-Panels als `role="region"`), vollständige Tastatur-Bedienung
(Tab, Enter/Leertaste, Pfeiltasten, Pos1/Ende), sichtbare Fokus-Ringe,
`aria-live`-Statusmeldungen. Alle UI-Texte in Deutsch.

## 9. Ansprechpartner

**Dietmar Scharf** (BLUE ITS / Ramteid) — Entwicklung & Betrieb des
FAQ-Moduls und der FAQ-API.
