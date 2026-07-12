import { defineConfig, type Plugin } from 'vite'

/**
 * Dev-only Mock fuer GET /api/faq — damit die Standalone-Preview (index.html)
 * ohne laufenden godelmann-faq-server funktioniert. Im Build nicht enthalten;
 * Antwortformat identisch zum API-Vertrag v1 (docs/ANFORDERUNGEN.md).
 */
function faqDevMock(): Plugin {
  const entries = [
    {
      slug: 'pflastersteine-reinigen',
      question: 'Wie reinige ich Godelmann-Pflastersteine richtig?',
      answer_md:
        'Fuer die regelmaessige Pflege genuegt **Wasser** und ein Besen. Bei hartnaeckigen Verschmutzungen:\n\n- Flaechen vornaessen\n- pH-neutralen Steinreiniger verwenden\n- Gruendlich mit klarem Wasser nachspuelen\n\nVermeiden Sie *saeurehaltige* Reiniger und Hochdruck direkt auf der Oberflaeche.',
      category: 'pflege',
      sort_order: 10,
      source_urls: ['https://www.godelmann.de/service/pflegehinweise'],
    },
    {
      slug: 'fugenmaterial-wahl',
      question: 'Welches Fugenmaterial ist das richtige?',
      answer_md:
        'Die Wahl haengt von der Nutzung ab:\n\n1. Gebundene Fugen fuer stark beanspruchte Flaechen\n2. Ungebundene Fugen (Brechsand/Splitt) fuer Standardflaechen\n3. Drainfugen fuer versickerungsfaehige Belaege\n\nDetails stehen in den [Verlegehinweisen](https://www.godelmann.de/service/verlegung).',
      category: 'verlegung',
      sort_order: 20,
      source_urls: ['https://www.godelmann.de/service/verlegung'],
    },
    {
      slug: 'betonstein-ausbluehungen',
      question: 'Was sind Ausbluehungen und verschwinden sie wieder?',
      answer_md:
        'Ausbluehungen sind **kalkhaltige Ablagerungen** an der Oberflaeche junger Betonsteine. Sie sind *technisch unbedenklich*, mindern die Qualitaet nicht und verschwinden durch Witterung und Nutzung in der Regel von selbst.',
      category: 'produkte',
      sort_order: 30,
      source_urls: [
        'https://www.godelmann.de/service/faq',
        'https://www.godelmann.de/produkte/pflaster',
      ],
    },
    {
      slug: 'versickerungsfaehige-belaege',
      question: 'Welche Belaege sind versickerungsfaehig?',
      answer_md:
        'GODELMANN bietet mehrere **oekologische Systeme** mit versickerungsfaehigen Fugen oder haufwerksporigem Beton an. Diese Belaege entlasten die Kanalisation und koennen die Niederschlagswassergebuehr senken.',
      category: 'produkte',
      sort_order: 40,
      source_urls: ['https://www.godelmann.de/produkte/oekologische-systeme'],
    },
  ]
  return {
    name: 'gdm-faq-dev-mock',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/faq', (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const category = url.searchParams.get('category')
        const filtered = category ? entries.filter((e) => e.category === category) : entries
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(
          JSON.stringify({
            generated_at: new Date().toISOString(),
            count: filtered.length,
            categories: ['produkte', 'verlegung', 'pflege'],
            entries: filtered,
          }),
        )
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [faqDevMock()],
  server: {
    port: 5009,
    strictPort: true,
  },
  build: {
    lib: {
      entry: 'src/faq-widget.ts',
      formats: ['es'],
      fileName: () => 'faq-widget.v1.js',
    },
    minify: true,
    copyPublicDir: false,
  },
})
