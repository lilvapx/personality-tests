# personality-tests

Wissenschaftliche Persönlichkeitstests — quelloffen, datensparsam, client-seitig.

## Projekt-Statement

Freie, quelloffene Umsetzung etablierter Persönlichkeitsinventare (IPIP-NEO-120, HEXACO-60).
Keine Registrierung, keine Datenabgabe — alle Antworten und die Auswertung laufen lokal im Browser.

## Item-Reihenfolge

Items werden pro Sitzung in **zufälliger Reihenfolge** präsentiert (Standard, reduziert
Reihenfolge-Effekte). Der Seed wird pro Session erzeugt, die Reihenfolge bleibt innerhalb
der Sitzung stabil. Pro Instrument abschaltbar über `meta.json` → `randomize_order: false`.

## Quellen

- **IPIP-NEO-120:** Johnson, J. A. (2014). Measuring thirty facets of the Five Factor Model with a
  120-item public domain inventory: Development of the IPIP-NEO-120. *Journal of Research in Personality, 51*, 78–89.
- **Items:** Public Domain via International Personality Item Pool — https://ipip.ori.org
- **Deutsche Übersetzung:** Eigene Übersetzung (Status: draft), siehe `data/instruments/ipip-neo-120/i18n/de.json`

## Lizenz-Überblick

| Bestandteil | Lizenz |
|---|---|
| Code | MIT (`LICENSE`) |
| IPIP-Items (en) | Public Domain |
| Eigene Übersetzungen (de, lt) | CC BY-SA 4.0 |
| Normdaten | Siehe `data/instruments/*/norms/SOURCE.md` |

Details: `data/LICENSE.md`

## Entwicklung

```sh
npm install
npm run dev          # Dev-Server
npm run validate:data  # Datenvalidierung
npm run gen:data     # Frontend-Bundles generieren
npm test             # Vitest
npm run build        # Produktions-Build (Cloudflare Pages)
```

## Deploy (Cloudflare Pages)

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
2. Repo `lilvapx/personality-tests` wählen
3. Build command: `npm run build`
4. Output directory: `.svelte-kit/cloudflare`

Live: https://personality-tests.pages.dev
