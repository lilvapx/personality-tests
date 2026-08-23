#!/usr/bin/env node
/**
 * add-labels.mjs
 * Fügt die übersetzten Domain-/Facet-Labels in alle i18n-Dateien ein.
 *
 * de: Übersetzte Namen (community_draft, von Hand gepflegt)
 * en: Original-IPIP-Namen (official)
 * lt: Übersetzte Namen (machine_draft)
 *
 * Achtung: Nur einmal ausführen bzw. Labels anschließend manuell pflegen.
 * Überschreibt KEINE bestehenden 'labels'-Blöcke.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'instruments');

// Übersetzungen (Domains + Facetten)
const LABELS = {
	de: {
		domains: {
			E: 'Extraversion',
			A: 'Verträglichkeit',
			C: 'Gewissenhaftigkeit',
			N: 'Neurotizismus',
			O: 'Offenheit für Erfahrungen'
		},
		facets: {
			E1: 'Freundlichkeit', E2: 'Geselligkeit', E3: 'Durchsetzungsfähigkeit',
			E4: 'Aktivität', E5: 'Erlebnishunger', E6: 'Frohsinn',
			A1: 'Vertrauen', A2: 'Moral', A3: 'Altruismus', A4: 'Kooperation',
			A5: 'Bescheidenheit', A6: 'Mitgefühl',
			C1: 'Selbstwirksamkeit', C2: 'Ordnungsliebe', C3: 'Pflichtbewusstsein',
			C4: 'Ehrgeiz', C5: 'Selbstdisziplin', C6: 'Bedachtsamkeit',
			N1: 'Ängstlichkeit', N2: 'Reizbarkeit', N3: 'Niedergeschlagenheit',
			N4: 'Befangenheit', N5: 'Maßlosigkeit', N6: 'Verletzlichkeit',
			O1: 'Vorstellungskraft', O2: 'Künstlerisches Interesse', O3: 'Emotionalität',
			O4: 'Abenteuerlust', O5: 'Intellekt', O6: 'Liberalismus'
		}
	},
	en: {
		domains: {
			E: 'Extraversion', A: 'Agreeableness', C: 'Conscientiousness',
			N: 'Neuroticism', O: 'Openness to Experience'
		},
		facets: {
			E1: 'Friendliness', E2: 'Gregariousness', E3: 'Assertiveness',
			E4: 'Activity Level', E5: 'Excitement-Seeking', E6: 'Cheerfulness',
			A1: 'Trust', A2: 'Morality', A3: 'Altruism', A4: 'Cooperation',
			A5: 'Modesty', A6: 'Sympathy',
			C1: 'Self-Efficacy', C2: 'Orderliness', C3: 'Dutifulness',
			C4: 'Achievement-Striving', C5: 'Self-Discipline', C6: 'Cautiousness',
			N1: 'Anxiety', N2: 'Anger', N3: 'Depression', N4: 'Self-Consciousness',
			N5: 'Immoderation', N6: 'Vulnerability',
			O1: 'Imagination', O2: 'Artistic Interests', O3: 'Emotionality',
			O4: 'Adventurousness', O5: 'Intellect', O6: 'Liberalism'
		}
	},
	lt: {
		domains: {
			E: 'Ekstraversija', A: 'Sutariamumas', C: 'Sąžiningumas',
			N: 'Neurotiškumas', O: 'Atvirumas patyrimui'
		},
		facets: {
			E1: 'Draugiškumas', E2: 'Bendravimas', E3: 'Ryžtingumas',
			E4: 'Aktyvumas', E5: 'Nuotykių siekimas', E6: 'Linksmumas',
			A1: 'Pasitikėjimas', A2: 'Moralumas', A3: 'Altruizmas', A4: 'Kooperacija',
			A5: 'Kuklumas', A6: 'Užuojauta',
			C1: 'Saviveiksmingumas', C2: 'Tvarkingumas', C3: 'Sąžiningumas',
			C4: 'Siekimas', C5: 'Savidisciplina', C6: 'Atsargumas',
			N1: 'Nerimas', N2: 'Pyktis', N3: 'Prislėgtumas', N4: 'Savimonė',
			N5: 'Nesaikingumas', N6: 'Pažeidžiamumas',
			O1: 'Vaizduotė', O2: 'Meninis interesas', O3: 'Emocijos',
			O4: 'Nuotykių troškimas', O5: 'Intelektas', O6: 'Liberalumas'
		}
	}
};

for (const inst of ['ipip-neo-120', 'ipip-neo-300']) {
	for (const locale of Object.keys(LABELS)) {
		const file = join(DATA_DIR, inst, 'i18n', `${locale}.json`);
		if (!existsSync(file)) {
			console.log(`⚠️  ${file} fehlt — übersprungen`);
			continue;
		}
		const data = JSON.parse(readFileSync(file, 'utf8'));
		if (data.labels) {
			console.log(`⏭️  ${file}: labels existieren bereits — übersprungen`);
			continue;
		}
		data.labels = LABELS[locale];
		writeFileSync(file, JSON.stringify(data, null, '\t') + '\n');
		console.log(`✅ ${file}: labels eingefügt`);
	}
}
