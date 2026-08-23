import { describe, it, expect } from 'vitest';
import { seededShuffle, randomSeed } from '$lib/scoring/shuffle';

describe('seededShuffle', () => {
	it('behält alle Elemente (Permutation)', () => {
		const input = [1, 2, 3, 4, 5, 6, 7, 8];
		const out = seededShuffle(input, 'test-seed');
		expect(out).toHaveLength(input.length);
		expect([...out].sort()).toEqual([...input].sort());
	});

	it('mutiert das Original nicht', () => {
		const input = [1, 2, 3, 4, 5];
		const out = seededShuffle(input, 'test-seed');
		expect(input).toEqual([1, 2, 3, 4, 5]);
		expect(out).not.toBe(input);
	});

	it('ist seedbar reproduzierbar', () => {
		const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const a = seededShuffle(input, 'same-seed');
		const b = seededShuffle(input, 'same-seed');
		expect(a).toEqual(b);
		const c = seededShuffle(input, 'other-seed');
		expect(a).not.toEqual(c);
	});

	it('randomSeed erzeugt gültige hex Seeds', () => {
		for (let i = 0; i < 100; i++) {
			const s = randomSeed();
			expect(s).toMatch(/^[0-9a-f]{8}$/);
		}
	});
});
