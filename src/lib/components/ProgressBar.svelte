<script lang="ts">
	interface Props {
		current: number;
		total: number;
	}

	let { current, total }: Props = $props();
	const pct = $derived(Math.min(100, Math.round((current / total) * 100)));
</script>

<div class="progress">
	<div class="track">
		<div class="bar" style="width: {pct}%"></div>
	</div>
	<span class="pct">{pct}%</span>
</div>

<style>
	.progress {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.track {
		flex: 1;
		height: 10px;
		background: #eee;
		border-radius: 5px;
		overflow: hidden;
	}
	.bar {
		height: 100%;
		background: #4a90d9;
		border-radius: 5px;
		transition: width 0.25s ease;
	}
	.pct {
		font-size: 0.95rem;
		font-weight: 700;
		color: #4a90d9;
		min-width: 3.2rem;
		text-align: right;
	}
</style>
