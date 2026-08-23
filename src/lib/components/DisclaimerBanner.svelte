<script lang="ts">
	interface Props {
		message?: string;
	}

	let { message = 'Hinweis' }: Props = $props();
</script>

<div class="disclaimer">
	⚠️ {message}
</div>

<style>
	.disclaimer {
		padding: 0.75rem 1rem;
		background: #fff8e1;
		border-left: 4px solid #f0ad4e;
		border-radius: 4px;
		font-size: 0.85rem;
		color: #6d5a00;
	}
</style>
