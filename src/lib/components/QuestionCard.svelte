<script lang="ts">
	interface Props {
		text: string;
		index: number;
		total: number;
		selected: number | undefined;
		labels: Record<string, string>;
		onSelect: (value: number) => void;
	}

	let { text, index, total, selected, labels, onSelect }: Props = $props();
	const values = Object.keys(labels).map(Number).sort((a, b) => a - b);
</script>

<div class="question-card">
	<p class="counter">{index + 1} / {total}</p>
	<p class="text">{text}</p>
	<div class="scale">
		{#each values as value}
			<button
				class:selected={selected === value}
				onclick={() => onSelect(value)}
				aria-label={labels[String(value)]}
			>
				<span class="value">{value}</span>
				<span class="label">{labels[String(value)]}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.question-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--card-bg, #fff);
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.08);
	}
	.counter {
		font-size: 0.85rem;
		color: #888;
		margin: 0;
	}
	.text {
		font-size: 1.15rem;
		font-weight: 500;
		margin: 0;
	}
	.scale {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
		gap: 0.5rem;
	}
	button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.75rem 0.5rem;
		border: 2px solid #e2e2e2;
		border-radius: 8px;
		background: #fafafa;
		cursor: pointer;
		transition: all 0.15s;
	}
	button:hover { border-color: #4a90d9; background: #f0f6ff; }
	button.selected { border-color: #4a90d9; background: #dce9fb; }
	.value { font-weight: 700; }
	.label { font-size: 0.7rem; color: #666; text-align: center; }

	/* Mobile: größere Touch-Targets, kompaktere Labels */
	@media (max-width: 640px) {
		.question-card { padding: 1rem; gap: 0.75rem; }
		.text { font-size: 1.05rem; }
		.scale { grid-template-columns: repeat(5, 1fr); gap: 0.35rem; }
		button { padding: 0.65rem 0.25rem; }
		.label {
			font-size: 0.58rem;
			line-height: 1.15;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}
</style>
