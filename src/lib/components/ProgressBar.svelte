<script lang="ts">
	interface Props {
		current: number;
		total: number;
	}

	let { current, total }: Props = $props();
	const pct = Math.min(100, Math.round((current / total) * 100));
</script>

<div class="progress">
	<div class="bar" style="width: {pct}%"></div>
	<span class="pct">{pct}%</span>
</div>

<style>
	.progress {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.bar {
		height: 8px;
		background: #4a90d9;
		border-radius: 4px;
		transition: width 0.2s ease;
	}
	.pct {
		font-size: 0.8rem;
		color: #666;
		min-width: 3rem;
	}
</style>
