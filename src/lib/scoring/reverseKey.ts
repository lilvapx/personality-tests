/**
 * Reverse-Keying: Rohwert auf der Skala umdrehen.
 *
 * Bei einem "minus"-Item (reversed) bedeutet hohe Zustimmung einen
 * NIEDRIGEN Wert in der Facette. Skala 1..max:
 *   reversed = max + min - raw
 *
 * Beispiel (Likert 1-5): raw=1 → reversed=5, raw=5 → reversed=1.
 */
export function reverseKey(raw: number, min: number, max: number): number {
	if (raw < min || raw > max) {
		throw new Error(`reverseKey: raw ${raw} außerhalb der Skala [${min}, ${max}]`);
	}
	return max + min - raw;
}

/** Prüft, ob ein Rohwert auf der Skala liegt */
export function inScale(raw: number, min: number, max: number): boolean {
	return Number.isFinite(raw) && raw >= min && raw <= max;
}
