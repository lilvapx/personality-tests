<script lang="ts">
	interface Props {
		labels: Record<string, string>;
		value: number | undefined;
		onChange: (value: number) => void;
		disabled?: boolean;
	}

	let { labels, value, onChange, disabled = false }: Props = $props();
	const values = Object.keys(labels).map(Number).sort((a, b) => a - b);
</script>

<div class="likert-scale" class:disabled>
	{#each values as v}
		<button
			type="button"
			class:selected={value === v}
			disabled={disabled}
			onclick={() => onChange(v)}
		>
			{v}
		</button>
	{/each}
</div>
<div class="labels">
	<span>{labels[String(Math.min(...values))]}</span>
	<span>{labels[String(Math.max(...values))]}</span>
</div>

<style>
	.likert-scale {
		display: flex;
		gap: 0.4rem;
	}
	.likert-scale.disabled { opacity: 0.5; pointer-events: none; }
	button {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		border: 2px solid #ccc;
		background: #fff;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.12s;
	}
	button:hover { border-color: #4a90d9; }
	button.selected { background: #4a90d9; border-color: #4a90d9; color: #fff; }
	.labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #888;
		margin-top: 0.35rem;
	}
</style>
