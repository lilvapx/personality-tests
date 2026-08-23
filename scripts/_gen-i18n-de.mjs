#!/usr/bin/env node
// Generiert de.json für ipip-neo-120 — deutsche Übersetzung der en.json-Texte.
// Items 1:1 in derselben Reihenfolge; Texte sind eigene Übersetzungen (draft).
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'data', 'instruments', 'ipip-neo-120', 'i18n');

// Facet → [plus ×2, minus ×2] — deutsche Fassung
const FACET_TEXTS = {
	E1: ["Fühle mich in Gesellschaft wohl", "Bin ein sehr geselliger Mensch", "Halte andere auf Abstand", "Bin schwer kennenzulernen"],
	E2: ["Liebe große Partys", "Genieße es, Teil einer Menschenmenge zu sein", "Bin lieber für mich allein", "Meide Menschenmengen"],
	E3: ["Übernehme in Situationen die Führung", "Versuche, andere anzuführen", "Warte, bis andere führen", "Halte mich in Gruppen zurück"],
	E4: ["Bin immer beschäftigt", "Habe viel Energie", "Mache es gerne ruhig angehen", "Bin eher langsam unterwegs"],
	E5: ["Suche Abenteuer", "Genieße es, leichtsinnig zu sein", "Bevorzuge ruhige Hobbys", "Mag keine lauten Umgebungen"],
	E6: ["Verbreite Freude", "Habe eine fröhliche Einstellung", "Bin oft niedergeschlagen", "Gerät selten in Begeisterung"],
	A1: ["Vertraue dem, was Leute sagen", "Glaube, dass andere gute Absichten haben", "Misstraue Menschen", "Vermute hinter allem verborgene Motive"],
	A2: ["Würde niemals meine Steuern hinterziehen", "Halte mich an die Regeln", "Nutze Schmeichelei, um voranzukommen", "Weiß, wie man Regeln umgeht"],
	A3: ["Lasse Menschen sich willkommen fühlen", "Nehme mir Zeit für andere", "Bin gleichgültig gegenüber den Gefühlen anderer", "Bin schwer zufriedenzustellen"],
	A4: ["Bin leicht zufriedenzustellen", "Kann Konfrontationen nicht ausstehen", "Lebe Streit regelrecht aus", "Beleidige Menschen"],
	A5: ["Mag es nicht, im Mittelpunkt zu stehen", "Tue selten so, als wäre ich großartig", "Halte viel von mir selbst", "Habe eine hohe Meinung von mir"],
	A6: ["Fühle die Emotionen anderer mit", "Bin besorgt um andere", "Interessiere mich nicht für die Probleme anderer", "Bleibe vom Leid anderer unberührt"],
	C1: ["Schließe Aufgaben erfolgreich ab", "Bin in dem, was ich tue, gut", "Habe wenig beizutragen", "Arbeite unter Druck nicht gut"],
	C2: ["Räume gerne auf", "Halte mich an einen Zeitplan", "Lasse Dinge herumliegen", "Vernachlässige meine Pflichten"],
	C3: ["Halte meine Versprechen", "Mache mehr, als erwartet wird", "Finde Wege, Regeln zu umgehen", "Breche meine Versprechen"],
	C4: ["Arbeite hart", "Setze hohe Maßstäbe für mich", "Mache gerade genug, um durchzukommen", "Investiere wenig Zeit und Mühe in meine Arbeit"],
	C5: ["Erledige Aufgaben sofort", "Bin immer vorbereitet", "Verschwende meine Zeit", "Fällt mir schwer, Aufgaben zu beginnen"],
	C6: ["Vermeide Fehler", "Wähle meine Worte mit Bedacht", "Handle ohne nachzudenken", "Mache oft fahrlässige Fehler"],
	N1: ["Mache mir Sorgen über Dinge", "Gerate schnell unter Stress", "Bin die meiste Zeit entspannt", "Lasse mich von Dingen nicht leicht aus der Ruhe bringen"],
	N2: ["Werde schnell wütend", "Bin schnell gereizt", "Bin selten gereizt", "Bin ein ruhiger Mensch"],
	N3: ["Fühle mich oft niedergeschlagen", "Mag mich selbst nicht", "Fühle mich wohl mit mir", "Bin sehr zufrieden mit mir"],
	N4: ["Bin leicht einzuschüchtern", "Fürchte, Aufmerksamkeit auf mich zu ziehen", "Bin nicht leicht verlegen", "Fühle mich in ungewohnten Situationen wohl"],
	N5: ["Neige zu Ausschweifungen", "Mache verrückte Dinge", "Übertreibe selten", "Widerstehe Versuchungen leicht"],
	N6: ["Gerate schnell in Panik", "Werde von Ereignissen überwältigt", "Habe das Gefühl, mit Neuem klarzukommen", "Überwinde Rückschläge mühelos"],
	O1: ["Habe eine lebhafte Fantasie", "Genieße wilde Gedankenflüge", "Habe keine gute Vorstellungskraft", "Suche selten nach einer tieferen Bedeutung"],
	O2: ["Glaube an die Bedeutung der Kunst", "Sehe Schönheit in Dingen, die anderen nicht auffällt", "Mag keine Gedichte", "Gehe nicht gerne ins Kunstmuseum"],
	O3: ["Erlebe meine Gefühle intensiv", "Bin leidenschaftlich bei Herzensangelegenheiten", "Werde selten emotional", "Lasse mich von Gefühlen nicht leicht mitreißen"],
	O4: ["Genieße es, neue Ideen zu hören", "Interessiere mich für viele Dinge", "Bleibe lieber bei dem, was ich kenne", "Mag keine Veränderungen"],
	O5: ["Lese gerne anspruchsvolle Literatur", "Löse gerne komplexe Probleme", "Meide anspruchsvolle Lektüre", "Gehe Themen nicht auf den Grund"],
	O6: ["Neige zu liberalen politischen Ansichten", "Glaube an eine einzige wahre Religion", "Finde, dass zu viel Steuergeld an Künstler geht", "Neige zu konservativen politischen Ansichten"]
};

const DOMAIN_ORDER = ['E', 'A', 'C', 'N', 'O'];

const items = [];
let n = 0;
for (const d of DOMAIN_ORDER) {
	for (let f = 1; f <= 6; f++) {
		const facet = `${d}${f}`;
		const texts = FACET_TEXTS[facet];
		if (!texts) throw new Error(`Keine Texte für Facet ${facet}`);
		for (let i = 1; i <= 4; i++) {
			n++;
			const isPlus = (n % 2 === 1);
			const idx = isPlus ? Math.floor((i - 1) / 2) : 2 + Math.floor((i - 1) / 2);
			items.push({ id: `ipip-neo-120-${String(n).padStart(3, '0')}`, text: texts[idx] });
		}
	}
}

const translations = {
	locale: 'de',
	items: Object.fromEntries(items.map(i => [i.id, { text: i.text }])),
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

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'de.json'), JSON.stringify(translations, null, '\t') + '\n');
console.log(`de.json: ${items.length} Item-Texte geschrieben`);
