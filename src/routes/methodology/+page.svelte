<script lang="ts">
	import { t } from '$lib/i18n/ui';
</script>

<svelte:head>
	<title>{t('methodology.title')}</title>
</svelte:head>

<h1>{t('methodology.heading')}</h1>

<h2>{t('methodology.scoring')}</h2>
<p>
	{@html t('methodology.scoring.text', { strong: '<strong>', '/strong': '</strong>', code: '<code>reversed = 6 − roh</code>' })}
</p>

<h2>{t('methodology.aggregation')}</h2>
<ol>
	<li>{@html t('methodology.ag1', { strong: '<strong>', '/strong': '</strong>' })}</li>
	<li>{@html t('methodology.ag2', { strong: '<strong>', '/strong': '</strong>' })}</li>
</ol>
<p>
	{@html t('methodology.ag3', { code: '<code>null</code>' })}
</p>

<h2>{t('methodology.norms')}</h2>
<p>
	{@html t('methodology.norms.text', { strong: '<strong>', '/strong': '</strong>', code: '<code>data/instruments/&lt;id&gt;/norms/</code>' })}
</p>

<h2>{t('methodology.limits')}</h2>
<ul>
	<li>{@html t('methodology.lim1', { em: '<em>', '/em': '</em>' })}</li>
	<li>{t('methodology.lim2')}</li>
	<li>{t('methodology.lim3')}</li>
</ul>

<p><a href="/">{t('methodology.back')}</a></p>
