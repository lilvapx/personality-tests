#!/usr/bin/env node
/**
 * import-ipip-de.mjs — Übersetzt die echten IPIP-NEO-120 Items ins Deutsche.
 * Eigene Übersetzung (Status: draft), da die validierte IPIP-D-120 nicht
 * frei lizenziert ist. Basis: en.json (Public Domain, ORI).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const i18nDir = join(__dirname, '..', 'data', 'instruments', 'ipip-neo-120', 'i18n');

const en = JSON.parse(readFileSync(join(i18nDir, 'en.json'), 'utf8'));

// item_id → deutsche Übersetzung (Reihenfolge = items.json Reihenfolge)
const DE = {
	'ipip-neo-120-001': 'Ich mache mir Sorgen über Dinge.',
	'ipip-neo-120-002': 'Ich befürchte das Schlimmste.',
	'ipip-neo-120-003': 'Ich habe vor vielen Dingen Angst.',
	'ipip-neo-120-004': 'Ich gerate schnell unter Stress.',
	'ipip-neo-120-005': 'Ich werde schnell wütend.',
	'ipip-neo-120-006': 'Ich bin schnell gereizt.',
	'ipip-neo-120-007': 'Ich verliere leicht die Beherrschung.',
	'ipip-neo-120-008': 'Ich bin nicht leicht zu verärgern.',
	'ipip-neo-120-009': 'Ich fühle mich oft niedergeschlagen.',
	'ipip-neo-120-010': 'Ich mag mich selbst nicht.',
	'ipip-neo-120-011': 'Ich bin oft am Boden zerstört.',
	'ipip-neo-120-012': 'Ich fühle mich wohl mit mir selbst.',
	'ipip-neo-120-013': 'Es fällt mir schwer, auf andere zuzugehen.',
	'ipip-neo-120-014': 'Ich habe Angst, Aufmerksamkeit auf mich zu ziehen.',
	'ipip-neo-120-015': 'Ich fühle mich nur bei Freunden wohl.',
	'ipip-neo-120-016': 'Mich bringen schwierige soziale Situationen nicht aus der Ruhe.',
	'ipip-neo-120-017': 'Ich neige zu Ausschweifungen.',
	'ipip-neo-120-018': 'Ich übertreibe selten.',
	'ipip-neo-120-019': 'Ich kann Versuchungen leicht widerstehen.',
	'ipip-neo-120-020': 'Ich kann meine Gelüste kontrollieren.',
	'ipip-neo-120-021': 'Ich gerate schnell in Panik.',
	'ipip-neo-120-022': 'Ich werde von Ereignissen überwältigt.',
	'ipip-neo-120-023': 'Ich habe das Gefühl, mit Dingen nicht klarzukommen.',
	'ipip-neo-120-024': 'Ich bleibe unter Druck ruhig.',
	'ipip-neo-120-025': 'Ich schließe leicht Freundschaften.',
	'ipip-neo-120-026': 'Ich fühle mich in Gesellschaft wohl.',
	'ipip-neo-120-027': 'Ich vermeide Kontakt mit anderen.',
	'ipip-neo-120-028': 'Ich halte andere auf Abstand.',
	'ipip-neo-120-029': 'Ich liebe große Partys.',
	'ipip-neo-120-030': 'Ich spreche auf Partys mit vielen verschiedenen Leuten.',
	'ipip-neo-120-031': 'Ich bin lieber für mich allein.',
	'ipip-neo-120-032': 'Ich meide Menschenmengen.',
	'ipip-neo-120-033': 'Ich übernehme die Führung.',
	'ipip-neo-120-034': 'Ich versuche, andere anzuführen.',
	'ipip-neo-120-035': 'Ich übernehme die Kontrolle über Dinge.',
	'ipip-neo-120-036': 'Ich warte, bis andere den Weg weisen.',
	'ipip-neo-120-037': 'Ich bin immer beschäftigt.',
	'ipip-neo-120-038': 'Ich bin immer in Bewegung.',
	'ipip-neo-120-039': 'Ich tue viel in meiner Freizeit.',
	'ipip-neo-120-040': 'Ich mache es gerne ruhig angehen.',
	'ipip-neo-120-041': 'Ich liebe Aufregung.',
	'ipip-neo-120-042': 'Ich suche Abenteuer.',
	'ipip-neo-120-043': 'Ich genieße es, leichtsinnig zu sein.',
	'ipip-neo-120-044': 'Ich verhalte mich wild und verrückt.',
	'ipip-neo-120-045': 'Ich verbreite Freude.',
	'ipip-neo-120-046': 'Ich habe viel Spaß.',
	'ipip-neo-120-047': 'Ich liebe das Leben.',
	'ipip-neo-120-048': 'Ich sehe das Gute im Leben.',
	'ipip-neo-120-049': 'Ich habe eine lebhafte Vorstellungskraft.',
	'ipip-neo-120-050': 'Ich genieße wilde Fantasien.',
	'ipip-neo-120-051': 'Ich liebe es zu träumen.',
	'ipip-neo-120-052': 'Ich versinke gerne in Gedanken.',
	'ipip-neo-120-053': 'Ich glaube an die Bedeutung der Kunst.',
	'ipip-neo-120-054': 'Ich sehe Schönheit in Dingen, die anderen nicht auffällt.',
	'ipip-neo-120-055': 'Ich mag keine Gedichte.',
	'ipip-neo-120-056': 'Ich gehe nicht gerne in Kunstmuseen.',
	'ipip-neo-120-057': 'Ich erlebe meine Gefühle intensiv.',
	'ipip-neo-120-058': 'Ich fühle die Emotionen anderer mit.',
	'ipip-neo-120-059': 'Ich bemerke meine emotionalen Reaktionen selten.',
	'ipip-neo-120-060': 'Ich verstehe nicht, warum manche Menschen so emotional werden.',
	'ipip-neo-120-061': 'Ich ziehe Abwechslung der Routine vor.',
	'ipip-neo-120-062': 'Ich bleibe lieber bei dem, was ich kenne.',
	'ipip-neo-120-063': 'Ich mag keine Veränderungen.',
	'ipip-neo-120-064': 'Ich hänge an herkömmlichen Wegen.',
	'ipip-neo-120-065': 'Ich lese gerne anspruchsvolle Literatur.',
	'ipip-neo-120-066': 'Ich meide philosophische Diskussionen.',
	'ipip-neo-120-067': 'Es fällt mir schwer, abstrakte Ideen zu verstehen.',
	'ipip-neo-120-068': 'Ich interessiere mich nicht für theoretische Diskussionen.',
	'ipip-neo-120-069': 'Ich neige dazu, liberale politische Kandidaten zu wählen.',
	'ipip-neo-120-070': 'Ich glaube, dass es kein absolutes Richtig und Falsch gibt.',
	'ipip-neo-120-071': 'Ich neige dazu, konservative politische Kandidaten zu wählen.',
	'ipip-neo-120-072': 'Ich glaube, dass man mit Kriminalität hart ins Gericht gehen sollte.',
	'ipip-neo-120-073': 'Ich vertraue anderen.',
	'ipip-neo-120-074': 'Ich glaube, dass andere gute Absichten haben.',
	'ipip-neo-120-075': 'Ich vertraue dem, was Menschen sagen.',
	'ipip-neo-120-076': 'Ich misstraue Menschen.',
	'ipip-neo-120-077': 'Ich benutze andere für meine eigenen Zwecke.',
	'ipip-neo-120-078': 'Ich betrüge, um voranzukommen.',
	'ipip-neo-120-079': 'Ich nutze andere aus.',
	'ipip-neo-120-080': 'Ich stelle anderen Steine in den Weg.',
	'ipip-neo-120-081': 'Ich bin besorgt um andere.',
	'ipip-neo-120-082': 'Ich helfe anderen liebend gerne.',
	'ipip-neo-120-083': 'Die Gefühle anderer sind mir gleichgültig.',
	'ipip-neo-120-084': 'Ich nehme mir keine Zeit für andere.',
	'ipip-neo-120-085': 'Ich liebe eine ordentliche Auseinandersetzung.',
	'ipip-neo-120-086': 'Ich schreie andere an.',
	'ipip-neo-120-087': 'Ich beleidige andere.',
	'ipip-neo-120-088': 'Ich zahle es anderen heim.',
	'ipip-neo-120-089': 'Ich glaube, dass ich besser bin als andere.',
	'ipip-neo-120-090': 'Ich halte viel von mir selbst.',
	'ipip-neo-120-091': 'Ich habe eine hohe Meinung von mir.',
	'ipip-neo-120-092': 'Ich prahle mit meinen Tugenden.',
	'ipip-neo-120-093': 'Ich habe Mitgefühl mit Obdachlosen.',
	'ipip-neo-120-094': 'Ich habe Mitgefühl mit denen, denen es schlechter geht als mir.',
	'ipip-neo-120-095': 'Die Probleme anderer interessieren mich nicht.',
	'ipip-neo-120-096': 'Ich versuche, nicht an Bedürftige zu denken.',
	'ipip-neo-120-097': 'Ich schließe Aufgaben erfolgreich ab.',
	'ipip-neo-120-098': 'Ich bin in dem, was ich tue, gut.',
	'ipip-neo-120-099': 'Ich erledige Aufgaben reibungslos.',
	'ipip-neo-120-100': 'Ich weiß, wie man Dinge erledigt.',
	'ipip-neo-120-101': 'Ich räume gerne auf.',
	'ipip-neo-120-102': 'Ich vergesse oft, Dinge an ihren Platz zurückzulegen.',
	'ipip-neo-120-103': 'Ich hinterlasse ein Chaos in meinem Zimmer.',
	'ipip-neo-120-104': 'Ich lasse meine Sachen herumliegen.',
	'ipip-neo-120-105': 'Ich halte meine Versprechen.',
	'ipip-neo-120-106': 'Ich sage die Wahrheit.',
	'ipip-neo-120-107': 'Ich breche Regeln.',
	'ipip-neo-120-108': 'Ich breche meine Versprechen.',
	'ipip-neo-120-109': 'Ich tue mehr, als von mir erwartet wird.',
	'ipip-neo-120-110': 'Ich arbeite hart.',
	'ipip-neo-120-111': 'Ich investiere wenig Zeit und Mühe in meine Arbeit.',
	'ipip-neo-120-112': 'Ich tue gerade genug, um durchzukommen.',
	'ipip-neo-120-113': 'Ich bin immer vorbereitet.',
	'ipip-neo-120-114': 'Ich setze meine Pläne um.',
	'ipip-neo-120-115': 'Ich verschwende meine Zeit.',
	'ipip-neo-120-116': 'Es fällt mir schwer, Aufgaben zu beginnen.',
	'ipip-neo-120-117': 'Ich springe in Dinge, ohne nachzudenken.',
	'ipip-neo-120-118': 'Ich treffe überstürzte Entscheidungen.',
	'ipip-neo-120-119': 'Ich stürze mich in Dinge.',
	'ipip-neo-120-120': 'Ich handle ohne nachzudenken.'
};

if (Object.keys(DE).length !== 120) throw new Error(`Erwartet 120 deutsche Items, bekommen ${Object.keys(DE).length}`);

// Konsistenzprüfung gegen en.json
const enIds = Object.keys(en.items);
for (const id of enIds) {
	if (!DE[id]) throw new Error(`Fehlende deutsche Übersetzung für ${id}`);
}

const de = {
	locale: 'de',
	items: Object.fromEntries(enIds.map(id => [id, { text: DE[id] }])),
	response_scale: {
		labels: {
			"1": "Trifft gar nicht zu",
			"2": "Trifft eher nicht zu",
			"3": "Weder noch",
			"4": "Trifft eher zu",
			"5": "Trifft voll zu"
		}
	},
	translation_status: "draft"
};

writeFileSync(join(i18nDir, 'de.json'), JSON.stringify(de, null, '\t') + '\n');
console.log(`de.json: ${Object.keys(DE).length} deutsche Übersetzungen geschrieben (Status: draft)`);
