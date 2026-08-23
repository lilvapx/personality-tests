<script lang="ts">
	import type { DomainResult } from '$lib/scoring/types';

	interface Props {
		domains: DomainResult[];
		max?: number; // Skalenmaximum für die Balkenbreite
	}

	let { domains, max = 5 }: Props = $props();

	// Farben pro Domain (Big-Five Standard)
	const colors: Record<string, string> = {
		E: '#e07b39', // Extraversion orange
		A: '#4caf50', // Agreeableness grün
		C: '#2196f3', // Conscientiousness blau
		N: '#f44336', // Neuroticism rot
		O: '#9c27b0'  // Openness lila
	};
</script>

<div class="result-chart">
	{#each domains as domain}
		<div class="row">
			<span class="label">{domain.label}</span>
			<div class="track">
				{#if domain.score !== null}
					<div
						class="fill"
						style="width: {(domain.score / max) * 100}%; background: {colors[domain.domain_id] ?? '#4a90d9'}"
					></div>
					<span class="value">{domain.score.toFixed(1)}</span>
				{:else}
					<span class="value muted">–</span>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.result-chart { display: flex; flex-direction: column; gap: 0.75rem; }
	.row { display: flex; align-items: center; gap: 0.75rem; }
	.label { width: 120px; font-size: 0.9rem; font-weight: 500; }
	.track {
		flex: 1;
		height: 22px;
		background: #f0f0f0;
		border-radius: 4px;
		position: relative;
		display: flex;
		align-items: center;
	}
	.fill { height: 100%; border-radius: 4px; transition: width 0.4s ease; }
	.value { position: absolute; right: 8px; font-size: 0.8rem; font-weight: 600; }
	.value.muted { color: #aaa; }
</style>
