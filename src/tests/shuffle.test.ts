import { describe, it, expect } from 'vitest';
import { shuffle, mulberry32, randomSeed } from '$lib/scoring/shuffle';

describe('shuffle', () => {
	it('behält alle Elemente (Permutation)', () => {
		const input = [1, 2, 3, 4, 5, 6, 7, 8];
		const out = shuffle(input);
		expect(out).toHaveLength(input.length);
		expect([...out].sort()).toEqual([...input].sort());
	});

	it('mutiert das Original nicht', () => {
		const input = [1, 2, 3, 4, 5];
		const out = shuffle(input);
		expect(input).toEqual([1, 2, 3, 4, 5]);
		expect(out).not.toBe(input);
	});

	it('ist seedbar reproduzierbar', () => {
		const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const a = shuffle(input, mulberry32(42));
		const b = shuffle(input, mulberry32(42));
		expect(a).toEqual(b);
		const c = shuffle(input, mulberry32(43));
		expect(a).not.toEqual(c);
	});

	it('randomSeed erzeugt gültige Seeds', () => {
		for (let i = 0; i < 100; i++) {
			const s = randomSeed();
			expect(s).toBeGreaterThanOrEqual(0);
			expect(s).toBeLessThan(2 ** 32);
		}
	});
});
