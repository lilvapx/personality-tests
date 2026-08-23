/**
 * shuffle.ts
 * Fisher-Yates-Shuffle für die Item-Reihenfolge im Testlauf.
 *
 * Wichtig: Die Antworten sind per item_id mit den Items verknüpft,
 * die Reihenfolge der Präsentation ist also frei mischbar, ohne das
 * Scoring zu beeinflussen. Der Shuffle wird einmal pro Sitzung
 * erzeugt und bleibt stabil (kein Springen bei Re-Render).
 */
export function shuffle<T>(input: readonly T[], rng: () => number = Math.random): T[] {
	const arr = [...input];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

/**
 * Erzeugt einen seedbaren Zufallsgenerator (mulberry32).
 * Damit kann die Reihenfolge pro Sitzung reproduzierbar sein
 * (z.B. für Tests oder Teilen einer Sitzung).
 */
export function mulberry32(seed: number): () => number {
	let a = seed >>> 0;
	return function () {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Zufälliger Seed für eine neue Sitzung */
export function randomSeed(): number {
	return Math.floor(Math.random() * 2 ** 32);
}
