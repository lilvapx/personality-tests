/**
 * ui.ts — UI-Übersetzungen der Website (nicht der Test-Items!).
 * Die Test-Items kommen aus den i18n-Verzeichnissen der Instrumente, die UI-Texte hier.
 *
 * Sprache: localeStore.current (de/en/lt), Default de.
 */
import { localeStore } from '$lib/stores/locale.svelte';
import type { TranslationStatus } from '$lib/scoring/types';

export type UiLocale = 'de' | 'en' | 'lt';

const ui = {
	de: {
		// Layout
		'nav.logo': '🧠 personality-tests',
		'footer.note': 'Kein klinisches Instrument — nur zur Selbstreflexion.',
		'footer.impressum': 'Impressum',
		'footer.datenschutz': 'Datenschutz',
		'lang.name': 'Deutsch',

		// Landing
		'landing.title': 'Wissenschaftliche Persönlichkeitstests',
		'landing.subtitle': 'Freie, quelloffene Umsetzung etablierter Persönlichkeitsinventare. Keine Registrierung, keine Datenabgabe — alles läuft in deinem Browser.',
		'landing.eyebrow': 'Big Five · IPIP-NEO',
		'landing.badge1': '100% kostenlos',
		'landing.badge2': 'Keine Datenabgabe',
		'landing.badge3': 'Client-seitig',
		'landing.loading': 'Lade Instrumente…',
		'landing.minutes': 'Min.',
		'landing.start': 'Test starten →',
		'landing.about.title': 'Über diese Tests',
		'landing.about.text': 'Freie, quelloffene Umsetzung etablierter Persönlichkeitsinventare — derzeit die IPIP-NEO-Reihe (International Personality Item Pool).',
		'landing.about.p1': '✅ Keine Registrierung, keine Datenabgabe',
		'landing.about.p2': '✅ Alle Auswertungen laufen lokal in deinem Browser',
		'landing.about.p3': '✅ Ergebnisse werden nicht gespeichert — nur du siehst sie',
		'landing.about.p4': '✅ Quelloffen auf {github}',
		'landing.about.note': 'Die Tests basieren auf wissenschaftlichen Modellen (Big Five / Fünf-Faktoren-Modell) und dienen der Selbstreflexion. Sie sind {strong}kein klinisches Instrument{/strong} und ersetzen keine psychologische Diagnostik.',
		'landing.disclaimer': 'Hinweis: Übersetzungen mit dem Status „Entwurf“ sind ungeprüfte eigene/Community-Übersetzungen — die englischen Original-Items sind maßgeblich.',

		// Consent-Banner
		'consent.text': 'Diese Website verwendet {strong}keine Tracking-Cookies{/strong} für die Tests selbst. Für Werbeanzeigen (Google AdSense) werden mit deiner Zustimmung Cookies gesetzt. Du kannst jederzeit widerrufen.',
		'consent.acceptAll': 'Alle akzeptieren',
		'consent.necessaryOnly': 'Nur notwendige',
		'consent.settings': 'Einstellungen',
		'consent.settingsTitle': 'Cookie-Einstellungen',
		'consent.necessary': 'Notwendige Speicherungen',
		'consent.necessaryDesc': 'Immer aktiv: Sprache und Einwilligungs-Status. {strong}Keine personenbezogenen Daten{/strong}, rein funktional.',
		'consent.ads': 'Personalisierte Werbung (AdSense)',
		'consent.adsDesc': 'Google setzt Cookies, um dir relevante Anzeigen zu zeigen und die Nutzung zu analysieren. {strong}Nur mit deiner Zustimmung{/strong}.',
		'consent.save': 'Speichern',
		'consent.privacyLink': 'Datenschutzerklärung',

		// Instrument-Intro
		'instrument.notfound': 'Instrument nicht gefunden',
		'instrument.back': '← Zur Übersicht',
		'instrument.about': 'Über diesen Test',
		'instrument.items': 'Items',
		'instrument.domains': 'Domains',
		'instrument.scale': 'Antwortskala',
		'instrument.duration': 'Dauer: ca. {n} Minuten',
		'instrument.privacy': 'Deine Antworten werden {strong}nur lokal in deinem Browser{/strong} verarbeitet und nach der Sitzung verworfen.',
		'instrument.start': 'Test starten →',
		'instrument.loading': 'Lade…',

		// Run
		'run.title': 'Testlauf — personality-tests',
		'run.notfound': 'Instrument nicht gefunden',
		'run.back': '← Zur Übersicht',
		'run.noScoring': 'Für dieses Instrument ist noch keine Scoring-Konfiguration hinterlegt.',
		'run.finish': 'Auswertung anzeigen →',
		'run.open': 'Noch {n} Fragen offen.',
		'run.prev': 'Zurück',
		'run.next': 'Weiter',
		'run.selectHint': 'Bitte wähle eine Antwort, um fortzufahren.',

		// Result
		'result.title': 'Auswertung — personality-tests',
		'result.heading': 'Dein Ergebnis',
		'result.disclaimer': 'Interpretiere die Werte mit Vorsicht — dies ist kein klinisches Instrument.',
		'result.domains': 'Domains',
		'result.facets': 'Facetten',
		'result.overview': 'Zur Übersicht',
		'result.methodology': 'So wird ausgewertet',
		'result.exportJson': 'JSON exportieren',
		'result.exportCsv': 'CSV exportieren',
		'result.none': 'Kein Ergebnis',
		'result.noneText': 'Du hast noch keinen Test abgeschlossen.',

		// About / Methodology
		'about.title': 'Über — personality-tests',
		'about.heading': 'Warum dieses Projekt existiert',
		'about.p1': 'Die meisten Persönlichkeitstests im Netz sind entweder kostenpflichtig, intransparent oder sammeln deine Antworten. Dieses Projekt ist anders:',
		'about.l1': 'Open Source — kompletter Code + Testdaten auf GitHub',
		'about.l2': 'Keine Datensammlung — alles läuft client-seitig im Browser, nichts wird gespeichert oder versendet',
		'about.l3': 'Wissenschaftlich fundiert — basierend auf etablierten Inventaren (IPIP-NEO, HEXACO) mit Quellenangaben',
		'about.l4': 'Transparente Auswertung — die Scoring-Logik ist einsehbar und testbar',
		'about.sources': 'Quellen',
		'about.license': 'Lizenzen',
		'about.licenseCode': 'Code: MIT (siehe {code})',
		'about.licenseData': 'Testdaten: Public Domain (IPIP-Items) + CC BY-SA 4.0 (eigene Übersetzungen, siehe {code})',
		'methodology.title': 'Methodik — personality-tests',
		'methodology.heading': 'Wie die Auswertung funktioniert',
		'methodology.scoring': 'Scoring',
		'methodology.scoring.text': 'Jedes Item gehört zu einer {strong}Facette{/strong} (z.B. "Friendliness") und hat ein {strong}Keying{/strong}: "plus" bedeutet, Zustimmung erhöht den Facetten-Wert; "minus" (reversed) bedeutet, Zustimmung senkt ihn. Reversed-Items werden vor der Berechnung umgepolt (bei Skala 1–5: {code}).',
		'methodology.aggregation': 'Aggregation',
		'methodology.ag1': '{strong}Facet-Score{/strong} = Mittelwert der beantworteten Items der Facette (mind. 75% nötig)',
		'methodology.ag2': '{strong}Domain-Score{/strong} = Mittelwert der Facet-Scores der Domain (mind. 4 von 6 Facetten)',
		'methodology.ag3': 'Fehlende Werte werden nicht durch Schätzwerte ersetzt — wenn zu wenig beantwortet wurde, bleibt der Score {code} statt eine falsche Präzision vorzutäuschen.',
		'methodology.norms': 'Normierung',
		'methodology.norms.text': 'Falls Normdaten hinterlegt sind (siehe {code}), wird der Rohwert in einen {strong}Prozentrang{/strong} umgerechnet (Normalverteilungsannahme). Ohne Normdaten werden nur die Rohwerte auf der Skala angezeigt.',
		'methodology.limits': 'Grenzen',
		'methodology.lim1': 'Persönlichkeitstests messen {em}Tendenzen{/em}, keine festen Eigenschaften',
		'methodology.lim2': 'Soziale Erwünschtheit und Stimmung beeinflussen Antworten',
		'methodology.lim3': 'Kein klinisches Diagnoseinstrument — bei Belastung: Fachperson suchen',
		'methodology.back': '← Zur Übersicht',

		// Übersetzungsstatus (Badges)
		'status.official_ipip': 'Offiziell',
		'status.community_verified': 'Geprüft',
		'status.community_draft': 'Entwurf',
		'status.machine_draft': 'Maschinell',
		'status.official_ipip.long': 'Offizielle IPIP-Items',
		'status.community_verified.long': 'Community-geprüft',
		'status.community_draft.long': 'Community-Entwurf',
		'status.machine_draft.long': 'Maschineller Entwurf',
		'status.official_ipip.desc': 'Originaltexte aus der offiziellen IPIP-Quelle (Public Domain).',
		'status.community_verified.desc': 'Übersetzung von Muttersprachlern/Experten geprüft.',
		'status.community_draft.desc': 'Eigene/Community-Übersetzung — ungeprüft, kann Fehler enthalten.',
		'status.machine_draft.desc': 'Automatisch übersetzt — ungeprüft, kann Fehler enthalten.'
	},
	en: {
		'nav.logo': '🧠 personality-tests',
		'footer.note': 'Not a clinical instrument — for self-reflection only.',
		'footer.impressum': 'Imprint',
		'footer.datenschutz': 'Privacy',
		'lang.name': 'English',

		'landing.title': 'Scientific personality tests',
		'landing.subtitle': 'Free, open-source implementation of established personality inventories. No registration, no data collection — everything runs in your browser.',
		'landing.eyebrow': 'Big Five · IPIP-NEO',
		'landing.badge1': '100% free',
		'landing.badge2': 'No data collection',
		'landing.badge3': 'Client-side',
		'landing.loading': 'Loading instruments…',
		'landing.minutes': 'min',
		'landing.start': 'Start test →',
		'landing.about.title': 'About these tests',
		'landing.about.text': 'Free, open-source implementation of established personality inventories — currently the IPIP-NEO series (International Personality Item Pool).',
		'landing.about.p1': '✅ No registration, no data collection',
		'landing.about.p2': '✅ All scoring runs locally in your browser',
		'landing.about.p3': '✅ Results are not stored — only you see them',
		'landing.about.p4': '✅ Open source on {github}',
		'landing.about.note': 'These tests are based on scientific models (Big Five / five-factor model) and serve self-reflection. They are {strong}not a clinical instrument{/strong} and do not replace professional psychological diagnostics.',
		'landing.disclaimer': 'Note: Translations marked as "draft" are unverified community translations — the English original items are authoritative.',

		// Consent banner
		'consent.text': 'This website uses {strong}no tracking cookies{/strong} for the tests themselves. For advertising (Google AdSense), cookies are set with your consent. You can withdraw at any time.',
		'consent.acceptAll': 'Accept all',
		'consent.necessaryOnly': 'Necessary only',
		'consent.settings': 'Settings',
		'consent.settingsTitle': 'Cookie settings',
		'consent.necessary': 'Necessary storage',
		'consent.necessaryDesc': 'Always active: language and consent status. {strong}No personal data{/strong}, purely functional.',
		'consent.ads': 'Personalized advertising (AdSense)',
		'consent.adsDesc': 'Google sets cookies to show you relevant ads and analyze usage. {strong}Only with your consent{/strong}.',
		'consent.save': 'Save',
		'consent.privacyLink': 'Privacy policy',

		'instrument.notfound': 'Instrument not found',
		'instrument.back': '← Back to overview',
		'instrument.about': 'About this test',
		'instrument.items': 'items',
		'instrument.domains': 'domains',
		'instrument.scale': 'Response scale',
		'instrument.duration': 'Duration: approx. {n} minutes',
		'instrument.privacy': 'Your answers are processed {strong}only locally in your browser{/strong} and discarded after the session.',
		'instrument.start': 'Start test →',
		'instrument.loading': 'Loading…',

		'run.title': 'Test run — personality-tests',
		'run.notfound': 'Instrument not found',
		'run.back': '← Back to overview',
		'run.noScoring': 'No scoring configuration exists for this instrument yet.',
		'run.finish': 'Show results →',
		'run.open': '{n} questions left.',
		'run.prev': 'Back',
		'run.next': 'Next',
		'run.selectHint': 'Please select an answer to continue.',

		'result.title': 'Results — personality-tests',
		'result.heading': 'Your results',
		'result.disclaimer': 'Interpret the values with caution — this is not a clinical instrument.',
		'result.domains': 'Domains',
		'result.facets': 'Facets',
		'result.overview': 'Back to overview',
		'result.methodology': 'How scoring works',
		'result.exportJson': 'Export JSON',
		'result.exportCsv': 'Export CSV',
		'result.none': 'No results',
		'result.noneText': 'You have not completed a test yet.',

		'about.title': 'About — personality-tests',
		'about.heading': 'Why this project exists',
		'about.p1': 'Most personality tests on the web are either paid, opaque, or collect your answers. This project is different:',
		'about.l1': 'Open source — complete code + test data on GitHub',
		'about.l2': 'No data collection — everything runs client-side in the browser, nothing is stored or sent',
		'about.l3': 'Scientifically grounded — based on established inventories (IPIP-NEO, HEXACO) with citations',
		'about.l4': 'Transparent scoring — the scoring logic is inspectable and testable',
		'about.sources': 'Sources',
		'about.license': 'Licenses',
		'about.licenseCode': 'Code: MIT (see {code})',
		'about.licenseData': 'Test data: Public Domain (IPIP items) + CC BY-SA 4.0 (own translations, see {code})',
		'methodology.title': 'Methodology — personality-tests',
		'methodology.heading': 'How scoring works',
		'methodology.scoring': 'Scoring',
		'methodology.scoring.text': 'Each item belongs to a {strong}facet{/strong} (e.g. "Friendliness") and has a {strong}keying{/strong}: "plus" means agreement increases the facet score; "minus" (reversed) means agreement decreases it. Reversed items are inverted before calculation (on a 1–5 scale: {code}).',
		'methodology.aggregation': 'Aggregation',
		'methodology.ag1': '{strong}Facet score{/strong} = mean of answered items in the facet (min. 75% required)',
		'methodology.ag2': '{strong}Domain score{/strong} = mean of facet scores in the domain (min. 4 of 6 facets)',
		'methodology.ag3': 'Missing values are not replaced by estimates — if too few items are answered, the score stays {code} instead of faking precision.',
		'methodology.norms': 'Norms',
		'methodology.norms.text': 'If norm data is available (see {code}), the raw score is converted to a {strong}percentile{/strong} (normal distribution assumption). Without norms, only raw scores on the scale are shown.',
		'methodology.limits': 'Limitations',
		'methodology.lim1': 'Personality tests measure {em}tendencies{/em}, not fixed traits',
		'methodology.lim2': 'Social desirability and mood influence answers',
		'methodology.lim3': 'Not a clinical diagnostic instrument — if you are struggling, seek professional help',
		'methodology.back': '← Back to overview',

		'status.official_ipip': 'Official',
		'status.community_verified': 'Verified',
		'status.community_draft': 'Draft',
		'status.machine_draft': 'Machine',
		'status.official_ipip.long': 'Official IPIP items',
		'status.community_verified.long': 'Community-verified',
		'status.community_draft.long': 'Community draft',
		'status.machine_draft.long': 'Machine draft',
		'status.official_ipip.desc': 'Original texts from the official IPIP source (public domain).',
		'status.community_verified.desc': 'Translation reviewed by native speakers/experts.',
		'status.community_draft.desc': 'Own/community translation — unverified, may contain errors.',
		'status.machine_draft.desc': 'Automatically translated — unverified, may contain errors.'
	},
	lt: {
		'nav.logo': '🧠 personality-tests',
		'footer.note': 'Ne klinikinė priemonė — tik savirefleksijai.',
		'footer.impressum': 'Impresas',
		'footer.datenschutz': 'Privatumas',
		'lang.name': 'Lietuvių',

		'landing.title': 'Moksliniai asmenybės testai',
		'landing.subtitle': 'Nemokama, atviro kodo įdiegtis žinomų asmenybės klausimynų. Jokios registracijos, jokių duomenų — viskas veikia tavo naršyklėje.',
		'landing.eyebrow': 'Big Five · IPIP-NEO',
		'landing.badge1': '100% nemokama',
		'landing.badge2': 'Jokie duomenys nerenkami',
		'landing.badge3': 'Kliento pusėje',
		'landing.loading': 'Kraunama…',
		'landing.minutes': 'min.',
		'landing.start': 'Pradėti testą →',
		'landing.about.title': 'Apie šiuos testus',
		'landing.about.text': 'Nemokama, atviro kodo įdiegtis žinomų asmenybės klausimynų — šiuo metu IPIP-NEO serija (International Personality Item Pool).',
		'landing.about.p1': '✅ Jokios registracijos, jokių duomenų',
		'landing.about.p2': '✅ Visi skaičiavimai vyksta tavo naršyklėje',
		'landing.about.p3': '✅ Rezultatai niekur nesaugomi — juos matai tik tu',
		'landing.about.p4': '✅ Atviras kodas {github}',
		'landing.about.note': 'Šie testai paremti moksliniais modeliais (Big Five / penkių faktorių modelis) ir skirti savirefleksijai. Jie {strong}nėra klinikinė priemonė{/strong} ir nepakeičia profesionalios psichologinės diagnostikos.',
		'landing.disclaimer': 'Pastaba: vertimai, pažymėti kaip „juodraštis“, yra nepatikrinti bendruomenės vertimai — autentiški yra angliški originalūs teiginiai.',

		// Sutikimo juosta
		'consent.text': 'Ši svetainė testams {strong}nenaudoja stebėjimo slapukų{/strong}. Reklamai („Google AdSense“) slapukai nustatomi tik gavus tavo sutikimą. Gali bet kada atšaukti.',
		'consent.acceptAll': 'Priimti viską',
		'consent.necessaryOnly': 'Tik būtini',
		'consent.settings': 'Nustatymai',
		'consent.settingsTitle': 'Slapukų nustatymai',
		'consent.necessary': 'Būtinas saugojimas',
		'consent.necessaryDesc': 'Visada aktyvu: kalba ir sutikimo būsena. {strong}Jokių asmens duomenų{/strong}, tik funkciniai.',
		'consent.ads': 'Personalizuota reklama („AdSense“)',
		'consent.adsDesc': '„Google“ nustato slapukus, kad rodytų tau aktualius skelbimus ir analizuotų naudojimą. {strong}Tik su tavo sutikimu{/strong}.',
		'consent.save': 'Išsaugoti',
		'consent.privacyLink': 'Privatumo politika',

		'instrument.notfound': 'Instrumentas nerastas',
		'instrument.back': '← Atgal į sąrašą',
		'instrument.about': 'Apie šį testą',
		'instrument.items': 'teiginių',
		'instrument.domains': 'domenų',
		'instrument.scale': 'Atsakymų skalė',
		'instrument.duration': 'Trukmė: apie {n} min.',
		'instrument.privacy': 'Tavo atsakymai apdorojami {strong}tik tavo naršyklėje{/strong} ir po sesijos ištrinami.',
		'instrument.start': 'Pradėti testą →',
		'instrument.loading': 'Kraunama…',

		'run.title': 'Testas — personality-tests',
		'run.notfound': 'Instrumentas nerastas',
		'run.back': '← Atgal į sąrašą',
		'run.noScoring': 'Šiam instrumentui dar nėra vertinimo konfigūracijos.',
		'run.finish': 'Rodyti rezultatus →',
		'run.open': 'Liko {n} klausimų.',
		'run.prev': 'Atgal',
		'run.next': 'Toliau',
		'run.selectHint': 'Pasirink atsakymą, kad tęstum.',

		'result.title': 'Rezultatai — personality-tests',
		'result.heading': 'Tavo rezultatai',
		'result.disclaimer': 'Interpretuok vertes atsargiai — tai ne klinikinė priemonė.',
		'result.domains': 'Domenai',
		'result.facets': 'Faktoriai',
		'result.overview': 'Atgal į sąrašą',
		'result.methodology': 'Kaip skaičiuojama',
		'result.exportJson': 'Eksportuoti JSON',
		'result.exportCsv': 'Eksportuoti CSV',
		'result.none': 'Nėra rezultatų',
		'result.noneText': 'Dar nebaigei nė vieno testo.',

		'about.title': 'Apie — personality-tests',
		'about.heading': 'Kodėl egzistuoja šis projektas',
		'about.p1': 'Dauguma asmenybės testų internete yra mokami, nepermatomi arba renka tavo atsakymus. Šis projektas kitoks:',
		'about.l1': 'Atviras kodas — visas kodas + testo duomenys GitHub',
		'about.l2': 'Jokio duomenų rinkimo — viskas veikia naršyklėje, niekas nesaupdoma ir nesiunčiama',
		'about.l3': 'Moksliškai pagrįsta — paremta žinomais klausimynais (IPIP-NEO, HEXACO) su šaltiniais',
		'about.l4': 'Skaidrus vertinimas — vertinimo logika matoma ir testuojama',
		'about.sources': 'Šaltiniai',
		'about.license': 'Licencijos',
		'about.licenseCode': 'Kodas: MIT (žr. {code})',
		'about.licenseData': 'Testo duomenys: Public Domain (IPIP teiginiai) + CC BY-SA 4.0 (savi vertimai, žr. {code})',
		'methodology.title': 'Metodika — personality-tests',
		'methodology.heading': 'Kaip veikia vertinimas',
		'methodology.scoring': 'Vertinimas',
		'methodology.scoring.text': 'Kiekvienas teiginys priklauso {strong}faktoriui{/strong} (pvz., "Friendliness") ir turi {strong}raktą{/strong}: "plus" reiškia, kad pritarimas didina faktoriaus įvertį; "minus" (atvirkštinis) — kad mažina. Atvirkštiniai teiginiai prieš skaičiavimą invertuojami (skalėje 1–5: {code}).',
		'methodology.aggregation': 'Agregacija',
		'methodology.ag1': '{strong}Faktoriaus įvertis{/strong} = atsakytų teiginių vidurkis (reikia min. 75%)',
		'methodology.ag2': '{strong}Domeno įvertis{/strong} = faktorių įverčių vidurkis (reikia min. 4 iš 6 faktorių)',
		'methodology.ag3': 'Trūkstamos reikšmės nepakeičiamos spėjimais — jei atsakyta per mažai, įvertis lieka {code}, kad nebūtų apsimestinio tikslumo.',
		'methodology.norms': 'Normos',
		'methodology.norms.text': 'Jei yra normų duomenų (žr. {code}), žaliavas įvertis paverčiamas {strong}procentiliu{/strong} (normaliojo skirstinio prielaida). Be normų rodomi tik žaliavi įverčiai skalėje.',
		'methodology.limits': 'Apribojimai',
		'methodology.lim1': 'Asmenybės testai matuoja {em}tendencijas{/em}, ne pastovias savybes',
		'methodology.lim2': 'Socialinis pageidaujamumas ir nuotaika veikia atsakymus',
		'methodology.lim3': 'Ne klinikinė diagnostinė priemonė — esant sunkumų, kreipkitės į specialistą',
		'methodology.back': '← Atgal į sąrašą',

		'status.official_ipip': 'Oficialus',
		'status.community_verified': 'Patikrintas',
		'status.community_draft': 'Juodraštis',
		'status.machine_draft': 'Mašininis',
		'status.official_ipip.long': 'Oficialūs IPIP teiginiai',
		'status.community_verified.long': 'Bendruomenės patikrintas',
		'status.community_draft.long': 'Bendruomenės juodraštis',
		'status.machine_draft.long': 'Mašininis juodraštis',
		'status.official_ipip.desc': 'Originalūs tekstai iš oficialaus IPIP šaltinio (public domain).',
		'status.community_verified.desc': 'Vertimą peržiūrėjo gimtoji kalba kalbantys/ekspertai.',
		'status.community_draft.desc': 'Savo/bendruomenės vertimas — nepatikrintas, gali turėti klaidų.',
		'status.machine_draft.desc': 'Automatiškai išversta — nepatikrinta, gali turėti klaidų.'
	}
} as const;

export type UiKey = keyof typeof ui['de'];

/** Übersetzungsfunktion: t('landing.title') oder t('landing.duration', { n: 12 }) */
export function t(key: UiKey, vars?: Record<string, string | number>): string {
	const locale = (localeStore.current in ui ? localeStore.current : 'de') as UiLocale;
	let str: string = ui[locale][key] ?? ui.de[key] ?? key;
	if (vars) {
		for (const [k, v] of Object.entries(vars)) {
			str = str.replaceAll(`{${k}}`, String(v));
		}
	}
	return str;
}

/** Kurzname der UI-Sprache für den Switcher */
export function uiLocaleName(locale: string): string {
	return (locale in ui ? ui[locale as UiLocale]['lang.name'] : locale.toUpperCase());
}

// Status-Labels für Badges (ersetzt status-labels.ts)
export const TRANSLATION_STATUS_SHORT: Record<TranslationStatus, UiKey> = {
	official_ipip: 'status.official_ipip',
	community_verified: 'status.community_verified',
	community_draft: 'status.community_draft',
	machine_draft: 'status.machine_draft'
};

export const TRANSLATION_STATUS_LABELS: Record<TranslationStatus, { labelKey: UiKey; descKey: UiKey; tone: 'green' | 'blue' | 'amber' | 'gray' }> = {
	official_ipip: { labelKey: 'status.official_ipip.long', descKey: 'status.official_ipip.desc', tone: 'green' },
	community_verified: { labelKey: 'status.community_verified.long', descKey: 'status.community_verified.desc', tone: 'blue' },
	community_draft: { labelKey: 'status.community_draft.long', descKey: 'status.community_draft.desc', tone: 'amber' },
	machine_draft: { labelKey: 'status.machine_draft.long', descKey: 'status.machine_draft.desc', tone: 'gray' }
};
