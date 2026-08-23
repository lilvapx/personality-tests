#!/usr/bin/env node
// Generiert i18n-Texte für ipip-neo-120 auf Basis der Facet-Definitionen.
// Pro Facet 4 Items: 2 plus (zustimmen = hoher Facet-Wert), 2 minus (reversed).
// Texte sind Platzhalter-Skizzen im Stil der IPIP-Items — finale Fassung
// wird aus der offiziellen IPIP-Item-Liste übernommen.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'data', 'instruments', 'ipip-neo-120', 'i18n');

// Facet → [plus-Texte ×2, minus-Texte ×2]
const FACET_TEXTS = {
	E1: ["Am comfortable around people", "Am a very sociable person", "Keep others at a distance", "Am hard to get to know"],
	E2: ["Love large parties", "Enjoy being part of a crowd", "Prefer to be alone", "Avoid crowds"],
	E3: ["Take charge of situations", "Try to lead others", "Wait for others to lead", "Hold back in group settings"],
	E4: ["Am always busy", "Have a lot of energy", "Like to take it easy", "Do things at a slow pace"],
	E5: ["Seek adventure", "Enjoy being reckless", "Prefer quiet hobbies", "Dislike loud environments"],
	E6: ["Radiate joy", "Have a cheerful outlook", "Am often down in the dumps", "Rarely get excited"],
	A1: ["Trust what people say", "Believe that others have good intentions", "Distrust people", "Suspect hidden motives"],
	A2: ["Would never cheat on my taxes", "Stick to the rules", "Use flattery to get ahead", "Know how to get around the rules"],
	A3: ["Make people feel welcome", "Take time out for others", "Am indifferent to the feelings of others", "Am hard to please"],
	A4: ["Am easy to satisfy", "Can't stand confrontations", "Love a good fight", "Insult people"],
	A5: ["Dislike being the center of attention", "Rarely toot my own horn", "Think highly of myself", "Have a high opinion of myself"],
	A6: ["Feel others' emotions", "Am concerned about others", "Am not interested in other people's problems", "Am unmoved by others' suffering"],
	C1: ["Complete tasks successfully", "Excel in what I do", "Have little to contribute", "Do not work well under pressure"],
	C2: ["Like to tidy up", "Follow a schedule", "Leave things lying around", "Neglect my duties"],
	C3: ["Follow through on my promises", "Do more than what's expected", "Find ways around the rules", "Break my promises"],
	C4: ["Work hard", "Set high standards for myself", "Do just enough to get by", "Put little time and effort into my work"],
	C5: ["Get chores done right away", "Am always prepared", "Waste my time", "Have difficulty starting tasks"],
	C6: ["Avoid mistakes", "Choose my words with care", "Act without thinking", "Often make careless mistakes"],
	N1: ["Worry about things", "Get stressed out easily", "Am relaxed most of the time", "Am not easily bothered by things"],
	N2: ["Get angry easily", "Get irritated easily", "Rarely get irritated", "Am a calm person"],
	N3: ["Often feel blue", "Dislike myself", "Feel comfortable with myself", "Am very pleased with myself"],
	N4: ["Am easily intimidated", "Am afraid to draw attention to myself", "Am not embarrassed easily", "Am comfortable in unfamiliar situations"],
	N5: ["Go on binges", "Do crazy things", "Rarely overindulge", "Easily resist temptations"],
	N6: ["Panic easily", "Become overwhelmed by events", "Feel that I'm able to deal with new things", "Readily overcome setbacks"],
	O1: ["Have a vivid imagination", "Enjoy wild flights of fantasy", "Do not have a good imagination", "Rarely look for a deeper meaning"],
	O2: ["Believe in the importance of art", "See beauty in things that others might not notice", "Do not like poetry", "Do not enjoy going to art museums"],
	O3: ["Experience my emotions intensely", "Am passionate about causes", "Seldom get emotional", "Am not easily affected by my emotions"],
	O4: ["Enjoy hearing new ideas", "Am interested in many things", "Prefer to stick with things that I know", "Dislike changes"],
	O5: ["Love to read challenging material", "Like to solve complex problems", "Avoid difficult reading material", "Will not probe deeply into a subject"],
	O6: ["Tend to vote for liberal political candidates", "Believe in one true religion", "Believe that too much tax money goes to support artists", "Tend to vote for conservative political candidates"]
};

// Reihenfolge: Domains E, A, C, N, O (wie items.json-Generator)
const DOMAIN_ORDER = ['E', 'A', 'C', 'N', 'O'];

const items = [];
let n = 0;
for (const d of DOMAIN_ORDER) {
	for (let f = 1; f <= 6; f++) {
		const facet = `${d}${f}`;
		const texts = FACET_TEXTS[facet];
		if (!texts) throw new Error(`Keine Texte für Facet ${facet}`);
		// items.json: n%2===1 → plus, n%2===0 → minus
		for (let i = 1; i <= 4; i++) {
			n++;
			const isPlus = (n % 2 === 1);
			// plus: texts[0..1], minus: texts[2..3]
			const idx = isPlus ? Math.floor((i - 1) / 2) : 2 + Math.floor((i - 1) / 2);
			items.push({ id: `ipip-neo-120-${String(n).padStart(3, '0')}`, text: texts[idx] });
		}
	}
}

const translations = {
	locale: 'en',
	items: Object.fromEntries(items.map(i => [i.id, { text: i.text }])),
	response_scale: {
		labels: {
			"1": "Very inaccurate",
			"2": "Moderately inaccurate",
			"3": "Neither accurate nor inaccurate",
			"4": "Moderately accurate",
			"5": "Very accurate"
		}
	},
	translation_status: "draft"
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'en.json'), JSON.stringify(translations, null, '\t') + '\n');
console.log(`en.json: ${items.length} Item-Texte geschrieben`);
