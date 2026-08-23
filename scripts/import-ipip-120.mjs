#!/usr/bin/env node
/**
 * import-ipip-120.mjs — EINMALIGER Import der echten IPIP-NEO-120 Daten
 * Quelle: https://ipip.ori.org/30FacetNEO-PI-RItems.htm (Johnson, 2014)
 * Items sind Public Domain. Reihenfolge wie bei ORI: N, E, O, A, C.
 * Nach dem Lauf wird dieses Skript gelöscht (kein Überschreiben von Handarbeit).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'data', 'instruments', 'ipip-neo-120');
const i18nDir = join(outDir, 'i18n');

// Format: [facet, keying, text] — exakte ORI-Reihenfolge
const RAW = [
	// N: Neuroticism
	['N1', 'plus', 'Worry about things.'],
	['N1', 'plus', 'Fear for the worst.'],
	['N1', 'plus', 'Am afraid of many things.'],
	['N1', 'plus', 'Get stressed out easily.'],
	['N2', 'plus', 'Get angry easily.'],
	['N2', 'plus', 'Get irritated easily.'],
	['N2', 'plus', 'Lose my temper.'],
	['N2', 'minus', 'Am not easily annoyed.'],
	['N3', 'plus', 'Often feel blue.'],
	['N3', 'plus', 'Dislike myself.'],
	['N3', 'plus', 'Am often down in the dumps.'],
	['N3', 'minus', 'Feel comfortable with myself.'],
	['N4', 'plus', 'Find it difficult to approach others.'],
	['N4', 'plus', 'Am afraid to draw attention to myself.'],
	['N4', 'plus', 'Only feel comfortable with friends.'],
	['N4', 'minus', 'Am not bothered by difficult social situations.'],
	['N5', 'plus', 'Go on binges.'],
	['N5', 'minus', 'Rarely overindulge.'],
	['N5', 'minus', 'Easily resist temptations.'],
	['N5', 'minus', 'Am able to control my cravings.'],
	['N6', 'plus', 'Panic easily.'],
	['N6', 'plus', 'Become overwhelmed by events.'],
	['N6', 'plus', "Feel that I'm unable to deal with things."],
	['N6', 'minus', 'Remain calm under pressure.'],
	// E: Extraversion
	['E1', 'plus', 'Make friends easily.'],
	['E1', 'plus', 'Feel comfortable around people.'],
	['E1', 'minus', 'Avoid contacts with others.'],
	['E1', 'minus', 'Keep others at a distance.'],
	['E2', 'plus', 'Love large parties.'],
	['E2', 'plus', 'Talk to a lot of different people at parties.'],
	['E2', 'minus', 'Prefer to be alone.'],
	['E2', 'minus', 'Avoid crowds.'],
	['E3', 'plus', 'Take charge.'],
	['E3', 'plus', 'Try to lead others.'],
	['E3', 'plus', 'Take control of things.'],
	['E3', 'minus', 'Wait for others to lead the way.'],
	['E4', 'plus', 'Am always busy.'],
	['E4', 'plus', 'Am always on the go.'],
	['E4', 'plus', 'Do a lot in my spare time.'],
	['E4', 'minus', 'Like to take it easy.'],
	['E5', 'plus', 'Love excitement.'],
	['E5', 'plus', 'Seek adventure.'],
	['E5', 'plus', 'Enjoy being reckless.'],
	['E5', 'plus', 'Act wild and crazy.'],
	['E6', 'plus', 'Radiate joy.'],
	['E6', 'plus', 'Have a lot of fun.'],
	['E6', 'plus', 'Love life.'],
	['E6', 'plus', 'Look at the bright side of life.'],
	// O: Openness
	['O1', 'plus', 'Have a vivid imagination.'],
	['O1', 'plus', 'Enjoy wild flights of fantasy.'],
	['O1', 'plus', 'Love to daydream.'],
	['O1', 'plus', 'Like to get lost in thought.'],
	['O2', 'plus', 'Believe in the importance of art.'],
	['O2', 'plus', 'See beauty in things that others might not notice.'],
	['O2', 'minus', 'Do not like poetry.'],
	['O2', 'minus', 'Do not enjoy going to art museums.'],
	['O3', 'plus', 'Experience my emotions intensely.'],
	['O3', 'plus', "Feel others' emotions."],
	['O3', 'minus', 'Rarely notice my emotional reactions.'],
	['O3', 'minus', "Don't understand people who get emotional."],
	['O4', 'plus', 'Prefer variety to routine.'],
	['O4', 'minus', 'Prefer to stick with things that I know.'],
	['O4', 'minus', 'Dislike changes.'],
	['O4', 'minus', 'Am attached to conventional ways.'],
	['O5', 'plus', 'Love to read challenging material.'],
	['O5', 'minus', 'Avoid philosophical discussions.'],
	['O5', 'minus', 'Have difficulty understanding abstract ideas.'],
	['O5', 'minus', 'Am not interested in theoretical discussions.'],
	['O6', 'plus', 'Tend to vote for liberal political candidates.'],
	['O6', 'plus', 'Believe that there is no absolute right and wrong.'],
	['O6', 'minus', 'Tend to vote for conservative political candidates.'],
	['O6', 'minus', 'Believe that we should be tough on crime.'],
	// A: Agreeableness
	['A1', 'plus', 'Trust others.'],
	['A1', 'plus', 'Believe that others have good intentions.'],
	['A1', 'plus', 'Trust what people say.'],
	['A1', 'minus', 'Distrust people.'],
	['A2', 'minus', 'Use others for my own ends.'],
	['A2', 'minus', 'Cheat to get ahead.'],
	['A2', 'minus', 'Take advantage of others.'],
	['A2', 'minus', "Obstruct others' plans."],
	['A3', 'plus', 'Am concerned about others.'],
	['A3', 'plus', 'Love to help others.'],
	['A3', 'minus', 'Am indifferent to the feelings of others.'],
	['A3', 'minus', 'Take no time for others.'],
	['A4', 'minus', 'Love a good fight.'],
	['A4', 'minus', 'Yell at people.'],
	['A4', 'minus', 'Insult people.'],
	['A4', 'minus', 'Get back at others.'],
	['A5', 'minus', 'Believe that I am better than others.'],
	['A5', 'minus', 'Think highly of myself.'],
	['A5', 'minus', 'Have a high opinion of myself.'],
	['A5', 'minus', 'Boast about my virtues.'],
	['A6', 'plus', 'Sympathize with the homeless.'],
	['A6', 'plus', 'Feel sympathy for those who are worse off than myself.'],
	['A6', 'minus', "Am not interested in other people's problems."],
	['A6', 'minus', 'Try not to think about the needy.'],
	// C: Conscientiousness
	['C1', 'plus', 'Complete tasks successfully.'],
	['C1', 'plus', 'Excel in what I do.'],
	['C1', 'plus', 'Handle tasks smoothly.'],
	['C1', 'plus', 'Know how to get things done.'],
	['C2', 'plus', 'Like to tidy up.'],
	['C2', 'minus', 'Often forget to put things back in their proper place.'],
	['C2', 'minus', 'Leave a mess in my room.'],
	['C2', 'minus', 'Leave my belongings around.'],
	['C3', 'plus', 'Keep my promises.'],
	['C3', 'plus', 'Tell the truth.'],
	['C3', 'minus', 'Break rules.'],
	['C3', 'minus', 'Break my promises.'],
	['C4', 'plus', "Do more than what's expected of me."],
	['C4', 'plus', 'Work hard.'],
	['C4', 'minus', 'Put little time and effort into my work.'],
	['C4', 'minus', 'Do just enough work to get by.'],
	['C5', 'plus', 'Am always prepared.'],
	['C5', 'plus', 'Carry out my plans.'],
	['C5', 'minus', 'Waste my time.'],
	['C5', 'minus', 'Have difficulty starting tasks.'],
	['C6', 'minus', 'Jump into things without thinking.'],
	['C6', 'minus', 'Make rash decisions.'],
	['C6', 'minus', 'Rush into things.'],
	['C6', 'minus', 'Act without thinking.']
];

if (RAW.length !== 120) throw new Error(`Erwartet 120 Items, bekommen ${RAW.length}`);

const DOMAIN_OF = { N: 'N', E: 'E', O: 'O', A: 'A', C: 'C' };

const items = RAW.map(([facet, keying, text], i) => {
	const id = `ipip-neo-120-${String(i + 1).padStart(3, '0')}`;
	return { item_id: id, domain: DOMAIN_OF[facet[0]], facet, keying, text };
});

// items.json (sprachneutral, ohne text)
const itemsJson = items.map(({ item_id, domain, facet, keying }) => ({ item_id, domain, facet, keying }));

// en.json
const enItems = {};
for (const it of items) enItems[it.item_id] = { text: it.text };
const en = {
	locale: 'en',
	items: enItems,
	response_scale: {
		labels: {
			"1": "Very inaccurate",
			"2": "Moderately inaccurate",
			"3": "Neither accurate nor inaccurate",
			"4": "Moderately accurate",
			"5": "Very accurate"
		}
	},
	translation_status: "official"
};

// scoring.json — Facet → Items (aus den echten Daten)
const facetMap = {};
for (const it of items) {
	if (!facetMap[it.facet]) facetMap[it.facet] = { domain: it.domain, items: [] };
	facetMap[it.facet].items.push(it.item_id);
}

const scoring = {
	instrument_id: 'ipip-neo-120',
	version: '1.0.0',
	response_range: { min: 1, max: 5 },
	keying: 'in-items-json',
	notes: 'Echte Keying-Tabelle aus Johnson (2014), Quelle: https://ipip.ori.org/30FacetNEO-PI-RItems.htm',
	aggregation: {
		facet_score: 'mean of items in facet',
		domain_score: 'mean of facet scores in domain',
		missing_handling: 'mindestens 3 von 4 Items pro Facet nötig, sonst Facet = null; Domain braucht mindestens 4 von 6 Facetten'
	},
	facets: facetMap
};

mkdirSync(i18nDir, { recursive: true });
writeFileSync(join(outDir, 'items.json'), JSON.stringify(itemsJson, null, '\t') + '\n');
writeFileSync(join(i18nDir, 'en.json'), JSON.stringify(en, null, '\t') + '\n');
writeFileSync(join(outDir, 'scoring.json'), JSON.stringify(scoring, null, '\t') + '\n');
console.log(`Import OK: ${items.length} echte Items (${Object.keys(facetMap).length} Facetten)`);
