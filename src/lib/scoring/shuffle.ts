/**
 * shuffle.ts
 * Seeded shuffle für die Item-Reihenfolge im Testlauf.
 *
 * STANDARD: Items werden pro Sitzung in zufälliger Reihenfolge präsentiert.
 * Die Antworten sind per item_id mit den Items verknüpft, die Reihenfolge
 * ist also frei mischbar, ohne das Scoring zu beeinflussen.
 * Der Seed wird einmal pro Sitzung erzeugt (sessionStore.seed) und bleibt
 * stabil — kein Springen bei Re-Render.
 */

/**
 * Seeded Fisher-Yates-Shuffle mit mulberry32 PRNG für Reproduzierbarkeit.
 * @param items Array das gemischt werden soll (wird nicht mutiert)
 * @param seed Seed-String für deterministische Reihenfolge
 * @returns Neues Array mit gemischter Reihenfolge
 */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
	// mulberry32 PRNG initialisieren
	let h = 1779033703 ^ seed.length;
	for (let i = 0; i < seed.length; i++) {
		h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
		h = (h << 13) | (h >>> 19);
	}
	const rand = () => {
		h = Math.imul(h ^ (h >>> 16), 2246822507);
		h = Math.imul(h ^ (h >>> 13), 3266489909);
		return ((h ^= h >>> 16) >>> 0) / 4294967296;
	};

	const arr = [...items];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

/**
 * Erzeugt einen zufälligen Seed für eine neue Sitzung.
 * Kann verwendet werden, um die Reihenfolge pro Sitzung reproduzierbar zu machen
 * (z.B. für Tests oder Teilen einer Sitzung).
 */
export function randomSeed(): string {
	return Math.floor(Math.random() * 2 ** 32).toString(16).padStart(8, '0');
}
