/**
 * <godelmann-faq> — öffentliches FAQ-Webmodul für godelmann.de
 *
 * Web Component nach WHATWG-Standard (Custom Elements + Shadow DOM + <template>).
 * Keine Framework- oder Runtime-Dependency; wird als ES-Modul
 * `faq-widget.v1.js` ausgeliefert (siehe docs/EINBINDUNG.md).
 *
 * Attribute (reaktiv):
 *   lang      — Sprache der Einträge (default "de")
 *   category  — optionaler Kategorie-Filter; wenn gesetzt, wird serverseitig
 *               gefiltert und die Kategorien-Leiste ausgeblendet
 *   api-base  — Basis-URL der FAQ-API (default: Origin der Widget-Script-URL)
 *
 * Events (CustomEvent, bubbles + composed):
 *   gdm-faq:loaded  detail {count}    — Einträge erfolgreich geladen
 *   gdm-faq:opened  detail {slug}     — Accordion-Eintrag geöffnet
 *   gdm-faq:error   detail {message}  — Laden fehlgeschlagen
 *
 * Theming ausschließlich über CSS-Custom-Properties:
 *   --gdm-faq-accent (#E52D12), --gdm-faq-font (inherit),
 *   --gdm-faq-radius (10px), --gdm-faq-max-width (52rem)
 */

interface FaqEntry {
  slug: string;
  question: string;
  answer_md: string;
  category: string;
  sort_order: number;
  source_urls: string[];
}

interface FaqResponse {
  generated_at: string;
  count: number;
  categories: string[];
  entries: FaqEntry[];
}

const TEXT = {
  searchLabel: 'Häufige Fragen durchsuchen',
  searchPlaceholder: 'Suchbegriff eingeben …',
  categoriesLabel: 'Kategorien',
  allCategories: 'Alle',
  loading: 'Häufige Fragen werden geladen …',
  loadError:
    'Die häufigen Fragen konnten gerade nicht geladen werden. Bitte versuchen Sie es später erneut.',
  noResults: 'Keine Einträge gefunden.',
  sources: 'Mehr dazu:',
} as const;

/** Origin der Script-URL (Default für api-base), Fallback: Seiten-Origin. */
function scriptOrigin(): string {
  try {
    const origin = new URL(import.meta.url).origin;
    if (origin && origin !== 'null') return origin;
  } catch {
    /* import.meta.url nicht auswertbar (z. B. Inline-Kontext) */
  }
  return window.location.origin;
}

/* ------------------------------------------------------------------ *
 * Mini-Markdown-Renderer (sanitized by construction):
 * Eingabe wird ZUERST vollständig HTML-escaped, danach werden nur die
 * hier erzeugten Tags eingesetzt. Links nur mit http/https-Ziel.
 * Unterstützt: **fett**, *kursiv*, "- "-Listen, nummerierte Listen,
 * [Text](https://…)-Links, Absätze.
 * ------------------------------------------------------------------ */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(escaped: string): string {
  return escaped
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s()<>]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function renderMarkdown(md: string): string {
  const lines = escapeHtml(md.replace(/\r\n?/g, '\n')).split('\n');
  const out: string[] = [];
  let list: 'ul' | 'ol' | null = null;
  let paragraph: string[] = [];

  const closeList = (): void => {
    if (list) {
      out.push(`</${list}>`);
      list = null;
    }
  };
  const flushParagraph = (): void => {
    if (paragraph.length) {
      out.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    const bullet = /^-\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);

    if (bullet || numbered) {
      flushParagraph();
      const kind: 'ul' | 'ol' = bullet ? 'ul' : 'ol';
      if (list !== kind) {
        closeList();
        out.push(`<${kind}>`);
        list = kind;
      }
      out.push(`<li>${renderInline((bullet ?? numbered)![1] ?? '')}</li>`);
    } else if (line === '') {
      flushParagraph();
      closeList();
    } else {
      closeList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  closeList();
  return out.join('');
}

/* ------------------------------------------------------------------ *
 * Template + Styles (nur im Shadow DOM wirksam)
 * ------------------------------------------------------------------ */

const template = document.createElement('template');
template.innerHTML = /* html */ `
<style>
  :host {
    display: block;
    box-sizing: border-box;
    max-width: var(--gdm-faq-max-width, 52rem);
    font-family: var(--gdm-faq-font, inherit);
    color: #1d1d1f;
    line-height: 1.55;
  }
  *, *::before, *::after { box-sizing: inherit; }
  .toolbar { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
  .search input {
    width: 100%;
    padding: 0.6rem 0.9rem;
    font: inherit;
    color: inherit;
    background: #fff;
    border: 1px solid #d5d5d8;
    border-radius: var(--gdm-faq-radius, 10px);
  }
  .search input:focus-visible,
  .tabs button:focus-visible,
  .item > h3 > button:focus-visible,
  .answer a:focus-visible {
    outline: 2px solid var(--gdm-faq-accent, #E52D12);
    outline-offset: 2px;
  }
  .tabs { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .tabs[hidden] { display: none; }
  .tabs button {
    padding: 0.35rem 0.85rem;
    font: inherit;
    font-size: 0.9em;
    color: inherit;
    background: #f2f2f4;
    border: 1px solid transparent;
    border-radius: calc(var(--gdm-faq-radius, 10px) * 2);
    cursor: pointer;
  }
  .tabs button:hover { background: #e8e8ea; }
  .tabs button[aria-pressed="true"] {
    color: #fff;
    background: var(--gdm-faq-accent, #E52D12);
  }
  .status { padding: 0.25rem 0; font-size: 0.95em; color: #5f5f63; }
  .status[hidden] { display: none; }
  .status.error {
    padding: 0.6rem 0.9rem;
    color: #7a2d21;
    background: #fdf3f1;
    border: 1px solid #f3ddd8;
    border-radius: var(--gdm-faq-radius, 10px);
  }
  .list { margin: 0; padding: 0; list-style: none; }
  .item {
    background: #fff;
    border: 1px solid #e3e3e6;
    border-radius: var(--gdm-faq-radius, 10px);
  }
  .item + .item { margin-top: 0.5rem; }
  .item > h3 { margin: 0; font-size: 1em; }
  .item > h3 > button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
    padding: 0.85rem 1rem;
    font: inherit;
    font-weight: 600;
    text-align: left;
    color: inherit;
    background: none;
    border: 0;
    border-radius: inherit;
    cursor: pointer;
  }
  .item > h3 > button:hover { color: var(--gdm-faq-accent, #E52D12); }
  .chevron {
    flex: none;
    width: 0.55em;
    height: 0.55em;
    border-right: 2px solid var(--gdm-faq-accent, #E52D12);
    border-bottom: 2px solid var(--gdm-faq-accent, #E52D12);
    transform: rotate(45deg);
    transition: transform 0.15s ease;
  }
  .item > h3 > button[aria-expanded="true"] .chevron { transform: rotate(225deg); }
  .answer { padding: 0 1rem 1rem; }
  .answer[hidden] { display: none; }
  .answer p { margin: 0 0 0.6em; }
  .answer p:last-child { margin-bottom: 0; }
  .answer ul, .answer ol { margin: 0 0 0.6em; padding-left: 1.4em; }
  .answer a { color: var(--gdm-faq-accent, #E52D12); }
  .sources {
    margin-top: 0.75em;
    padding-top: 0.6em;
    font-size: 0.9em;
    border-top: 1px dashed #e3e3e6;
  }
  .sources a { margin-right: 0.75em; overflow-wrap: anywhere; }
  .visually-hidden {
    position: absolute;
    width: 1px; height: 1px;
    margin: -1px; padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .chevron { transition: none; }
  }
</style>
<div class="toolbar">
  <label class="search">
    <span class="visually-hidden">${TEXT.searchLabel}</span>
    <input type="search" placeholder="${TEXT.searchPlaceholder}" autocomplete="off">
  </label>
  <div class="tabs" role="group" aria-label="${TEXT.categoriesLabel}" hidden></div>
</div>
<p class="status" role="status" aria-live="polite">${TEXT.loading}</p>
<ul class="list"></ul>
`;

/* ------------------------------------------------------------------ *
 * Custom Element
 * ------------------------------------------------------------------ */

export class GodelmannFaq extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['lang', 'category', 'api-base'];
  }

  #entries: FaqEntry[] = [];
  #categories: string[] = [];
  #activeCategory = '';
  #query = '';
  #openSlugs = new Set<string>();
  #abort: AbortController | null = null;
  #reloadScheduled = false;

  #searchInput: HTMLInputElement;
  #tabsEl: HTMLElement;
  #statusEl: HTMLElement;
  #listEl: HTMLElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(template.content.cloneNode(true));
    this.#searchInput = root.querySelector('input')!;
    this.#tabsEl = root.querySelector('.tabs')!;
    this.#statusEl = root.querySelector('.status')!;
    this.#listEl = root.querySelector('.list')!;

    this.#searchInput.addEventListener('input', () => {
      this.#query = this.#searchInput.value.trim().toLowerCase();
      this.#renderList();
    });
    this.#tabsEl.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button');
      if (!btn) return;
      this.#activeCategory = btn.dataset['category'] ?? '';
      this.#renderTabs();
      this.#renderList();
    });
    this.#tabsEl.addEventListener('keydown', (e) => this.#onRovingKeydown(e, '.tabs button'));
    this.#listEl.addEventListener('keydown', (e) => this.#onRovingKeydown(e, '.item > h3 > button'));
    this.#listEl.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[aria-controls]');
      if (btn) this.#toggle(btn);
    });
  }

  connectedCallback(): void {
    void this.#load();
  }

  disconnectedCallback(): void {
    this.#abort?.abort();
    this.#abort = null;
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue || !this.isConnected) return;
    if (this.#reloadScheduled) return;
    this.#reloadScheduled = true;
    queueMicrotask(() => {
      this.#reloadScheduled = false;
      void this.#load();
    });
  }

  get apiBase(): string {
    return (this.getAttribute('api-base') ?? scriptOrigin()).replace(/\/+$/, '');
  }

  get faqLang(): string {
    return this.getAttribute('lang') ?? 'de';
  }

  /* ---------------- Daten laden ---------------- */

  async #load(): Promise<void> {
    this.#abort?.abort();
    const abort = new AbortController();
    this.#abort = abort;

    this.#setStatus(TEXT.loading, false);
    this.#listEl.replaceChildren();
    this.#tabsEl.hidden = true;

    const pinned = this.getAttribute('category');
    const url = new URL(`${this.apiBase}/api/faq`);
    url.searchParams.set('lang', this.faqLang);
    if (pinned) url.searchParams.set('category', pinned);

    try {
      const res = await fetch(url.toString(), { signal: abort.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as FaqResponse;
      if (abort.signal.aborted) return;

      this.#entries = Array.isArray(data.entries)
        ? [...data.entries].sort((a, b) => a.sort_order - b.sort_order || a.question.localeCompare(b.question, 'de'))
        : [];
      this.#categories = Array.isArray(data.categories) ? data.categories : [];
      this.#activeCategory = '';
      this.#openSlugs.clear();

      this.#renderTabs();
      this.#renderList();
      this.#emit('gdm-faq:loaded', { count: data.count ?? this.#entries.length });
    } catch (err) {
      if (abort.signal.aborted) return;
      const message = err instanceof Error ? err.message : String(err);
      this.#setStatus(TEXT.loadError, true);
      this.#emit('gdm-faq:error', { message });
    }
  }

  /* ---------------- Rendering ---------------- */

  #setStatus(text: string, isError: boolean): void {
    this.#statusEl.textContent = text;
    this.#statusEl.classList.toggle('error', isError);
    this.#statusEl.hidden = text === '';
  }

  #renderTabs(): void {
    // Bei per Attribut fixierter Kategorie ist die Leiste ausgeblendet.
    if (this.getAttribute('category') || this.#categories.length === 0) {
      this.#tabsEl.hidden = true;
      this.#tabsEl.replaceChildren();
      return;
    }
    const mkButton = (label: string, category: string): HTMLButtonElement => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.dataset['category'] = category;
      const active = this.#activeCategory === category;
      btn.setAttribute('aria-pressed', String(active));
      btn.tabIndex = active ? 0 : -1;
      return btn;
    };
    const buttons = [mkButton(TEXT.allCategories, '')];
    for (const c of this.#categories) buttons.push(mkButton(c, c));
    this.#tabsEl.replaceChildren(...buttons);
    this.#tabsEl.hidden = false;
  }

  #visibleEntries(): FaqEntry[] {
    return this.#entries.filter((entry) => {
      if (this.#activeCategory && entry.category !== this.#activeCategory) return false;
      if (this.#query) {
        const haystack = `${entry.question}\n${entry.answer_md}`.toLowerCase();
        if (!haystack.includes(this.#query)) return false;
      }
      return true;
    });
  }

  #renderList(): void {
    const entries = this.#visibleEntries();
    if (entries.length === 0) {
      this.#listEl.replaceChildren();
      this.#setStatus(TEXT.noResults, false);
      return;
    }
    this.#setStatus('', false);
    this.#listEl.replaceChildren(...entries.map((entry, i) => this.#renderItem(entry, i)));
  }

  #renderItem(entry: FaqEntry, index: number): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'item';
    const open = this.#openSlugs.has(entry.slug);
    const qId = `gdm-faq-q-${entry.slug}`;
    const aId = `gdm-faq-a-${entry.slug}`;

    const h3 = document.createElement('h3');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = qId;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-controls', aId);
    btn.dataset['slug'] = entry.slug;
    btn.tabIndex = index === 0 ? 0 : -1;

    const qText = document.createElement('span');
    qText.textContent = entry.question;
    const chevron = document.createElement('span');
    chevron.className = 'chevron';
    chevron.setAttribute('aria-hidden', 'true');
    btn.append(qText, chevron);
    h3.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'answer';
    panel.id = aId;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', qId);
    panel.hidden = !open;
    panel.innerHTML = renderMarkdown(entry.answer_md);

    const sourceUrls = (entry.source_urls ?? []).filter((u) => /^https?:\/\//.test(u));
    if (sourceUrls.length > 0) {
      const sources = document.createElement('p');
      sources.className = 'sources';
      sources.append(`${TEXT.sources} `);
      for (const u of sourceUrls) {
        const a = document.createElement('a');
        a.href = u;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        try {
          const parsed = new URL(u);
          a.textContent = parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
        } catch {
          a.textContent = u;
        }
        sources.appendChild(a);
      }
      panel.appendChild(sources);
    }

    li.append(h3, panel);
    return li;
  }

  /* ---------------- Interaktion ---------------- */

  #toggle(btn: HTMLButtonElement): void {
    const slug = btn.dataset['slug'] ?? '';
    const panel = this.shadowRoot!.getElementById(btn.getAttribute('aria-controls')!);
    const willOpen = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(willOpen));
    if (panel) panel.hidden = !willOpen;
    if (willOpen) {
      this.#openSlugs.add(slug);
      this.#emit('gdm-faq:opened', { slug });
    } else {
      this.#openSlugs.delete(slug);
    }
  }

  /** Pfeiltasten/Home/End-Navigation (roving tabindex) für Tabs und Accordion-Header. */
  #onRovingKeydown(e: KeyboardEvent, selector: string): void {
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const target = e.target as HTMLElement;
    if (!target.matches(selector)) return;
    const buttons = Array.from(this.shadowRoot!.querySelectorAll<HTMLButtonElement>(selector));
    const current = buttons.indexOf(target as HTMLButtonElement);
    if (current === -1) return;

    let next: number;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = (current + 1) % buttons.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = (current - 1 + buttons.length) % buttons.length;
        break;
      case 'Home':
        next = 0;
        break;
      default:
        next = buttons.length - 1;
    }
    e.preventDefault();
    for (const [i, b] of buttons.entries()) b.tabIndex = i === next ? 0 : -1;
    buttons[next]!.focus();
  }

  #emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}

if (!customElements.get('godelmann-faq')) {
  customElements.define('godelmann-faq', GodelmannFaq);
}
