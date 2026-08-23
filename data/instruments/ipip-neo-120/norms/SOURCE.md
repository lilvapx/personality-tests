# Normdaten-Quellen (IPIP-NEO-120)

Diese Datei dokumentiert, woher Normdaten für den IPIP-NEO-120 stammen bzw.
stammen können. Die eigentlichen Werte liegen in `eugene-springfield.json`.

## Status

**Aktuell:** Platzhalter — keine echten Normwerte hinterlegt.

## Verfügbare Quellen

### 1. Eugene-Springfield Community Sample (Johnson, 2014)

- **Referenz:** Johnson, J. A. (2014). Measuring thirty facets of the Five Factor
  Model with a 120-item public domain inventory: Development of the IPIP-NEO-120.
  *Journal of Research in Personality, 51*, 78–89.
- **Stichprobe:** N ≈ 619.150 (Internet-Stichprobe, Alphas in der ORI-Itemliste)
- **Zugang:** Die Item-Seite (https://ipip.ori.org/30FacetNEO-PI-RItems.htm) listet
  Cronbach-Alphas pro Facette. Vollständige Normtabellen (Mittelwerte, SD) sind
  nicht direkt auf ORI hinterlegt — sie müssen aus der Publikation bzw. vom Autor
  bezogen werden.
- **Lizenz-Check (Normdaten):** **NOCH NICHT GEPRÜFT** — vor Befüllung von
  `eugene-springfield.json` muss geklärt werden, ob die in der Publikation
  abgedruckten Mittelwerte/Standardabweichungen (Tabellen) für die
  Wiederverwendung in einem Open-Source-Tool erlaubt sind. Items sind Public
  Domain, aber Normtabellen können urheberrechtlich geschützt sein (Verlag:
  Elsevier). Kontakt zu Autor (Johnson) oder Verlag prüfen.

### 2. IPIP-D-120 (deutsche Validierung, deinetests.de)

- **Referenz:** Bachelorarbeit, online unter
  https://www.deinetests.de/downloads/Bachelorarbeit_online.pdf
- **Stichprobe:** n = 1.084 (Reliabilität), n = 49 (konvergente Validität NEO-PI-R)
- **Lizenz:** Nur für Forschung/Studium kostenfrei, **kommerziell verboten** —
  Normwerte daraus NICHT ohne Genehmigung übernehmen.

### 3. Chinese IPIP-120 Norms (Zhang et al.)

- **Zugang:** https://ipip.ori.org/ChineseIPIP-120norms.htm
- Für chinesische Stichprobe — nur als Referenz, nicht für DE/EU-Normierung.

## Konvention für `eugene-springfield.json`

```json
{
  "domains": { "E": { "mean": 3.5, "sd": 0.7, "n": 619150 } },
  "facets": { "E1": { "mean": 3.4, "sd": 0.9, "n": 619150 } }
}
```

Werte eintragen, sobald verfügbar (aus Publikation/Author). Skala: 1–5.

## Lizenz-Status für Normdaten (Checkliste vor Live-Gang)

- [ ] Items: Public Domain ✅ (bestätigt via ORI)
- [ ] Normtabellen (Mittelwerte, SD) aus Johnson (2014): **Prüfung ausstehend**
  - Elsevier Copyright Policy prüfen (Tabellen in Publikationen)
  - Alternativ: Autor (John A. Johnson) direkt anfragen
  - Falls nicht erlaubt: Eigene Normierung aus Open-Data-Samples oder Verzicht
- [ ] IPIP-D-120 Normen: **Nicht nutzbar** (kommerziell verboten)
- [ ] Dokumentation hier in SOURCE.md aktualisieren, sobald geklärt
