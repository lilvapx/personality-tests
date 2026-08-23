<script lang="ts">
	import { t } from '$lib/i18n/ui';
</script>

<svelte:head>
	<title>{t('about.title')}</title>
</svelte:head>

<h1>{t('about.heading')}</h1>

<p>
	{t('about.p1')}
</p>

<ul>
	<li><strong>{t('about.l1')}</strong></li>
	<li><strong>{t('about.l2')}</strong></li>
	<li><strong>{t('about.l3')}</strong></li>
	<li><strong>{t('about.l4')}</strong></li>
</ul>

<h2>{t('about.sources')}</h2>
<ul>
	<li>IPIP-NEO-120: Johnson, J. A. (2014). <em>Measuring thirty aspects of the Big Five personality via the International Personality Item Pool.</em></li>
	<li>IPIP: <a href="https://ipip.ori.org">https://ipip.ori.org</a> — Public Domain</li>
</ul>

<h2>{t('about.license')}</h2>
<ul>
	<li>{@html t('about.licenseCode', { code: '<code>LICENSE</code>' })}</li>
	<li>{@html t('about.licenseData', { code: '<code>data/LICENSE.md</code>' })}</li>
</ul>
