<script lang="ts">
	import type { DomainResult } from '$lib/scoring/types';

	interface Props {
		domains: DomainResult[];
		max?: number;
	}

	let { domains, max = 5 }: Props = $props();
</script>

<div class="facet-breakdown">
	{#each domains as domain}
		{#if domain.facets.length > 0}
			<div class="domain">
				<h4>{domain.label}</h4>
				{#each domain.facets as facet}
					<div class="facet">
						<span class="name">{facet.label}</span>
						<div class="track">
							{#if facet.score !== null}
								<div class="fill" style="width: {(facet.score / max) * 100}%"></div>
								<span class="value">{facet.score.toFixed(1)}</span>
							{:else}
								<span class="value muted">–</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/each}
</div>

<style>
	.facet-breakdown { display: flex; flex-direction: column; gap: 1.5rem; }
	.domain h4 { margin: 0 0 0.5rem 0; }
	.facet { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; }
	.name { width: 140px; font-size: 0.8rem; color: #555; }
	.track {
		flex: 1; height: 14px; background: #f0f0f0; border-radius: 3px;
		position: relative; display: flex; align-items: center;
	}
	.fill { height: 100%; background: #4a90d9; border-radius: 3px; }
	.value { position: absolute; right: 6px; font-size: 0.7rem; font-weight: 600; }
	.value.muted { color: #aaa; }

	/* Mobile: Labels über der Leiste statt daneben */
	@media (max-width: 640px) {
		.facet { flex-direction: column; align-items: stretch; gap: 0.2rem; margin-bottom: 0.6rem; }
		.name { width: auto; font-size: 0.78rem; }
	}
</style>
