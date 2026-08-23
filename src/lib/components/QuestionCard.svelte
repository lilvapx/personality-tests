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
				aria-pressed={selected === value}
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
		line-height: 1.4;
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

	/* Mobile: vertikale Antwortliste — große Touch-Targets, keine gequetschten Labels */
	@media (max-width: 640px) {
		.question-card { padding: 1.25rem 1rem; gap: 0.85rem; }
		.text { font-size: 1.05rem; }
		.scale {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
		button {
			flex-direction: row;
			justify-content: flex-start;
			gap: 0.85rem;
			padding: 0.8rem 1rem;
			min-height: 52px; /* großes Touch-Target */
			text-align: left;
		}
		.value {
			width: 2rem;
			height: 2rem;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #fff;
			border: 2px solid #d5d5d5;
			border-radius: 50%;
			font-size: 0.95rem;
		}
		button.selected .value {
			background: #4a90d9;
			border-color: #4a90d9;
			color: #fff;
		}
		.label { font-size: 0.85rem; color: #444; flex: 1; }
	}
</style>
