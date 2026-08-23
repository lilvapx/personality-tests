<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Impressum — personality-tests</title>
	<meta name="robots" content="index, follow" />
</svelte:head>

<h1>Impressum</h1>

<p class="muted">Angaben gemäß § 5 DDG</p>

<h2>Diensteanbieter</h2>
<p>
	<strong>Zygimantas Grebeniuk</strong><br />
	Loensweg 31<br />
	37085 Göttingen<br />
	Deutschland
</p>

<h2>Kontakt</h2>
<p>
	E-Mail: <a href="mailto:kontakt@example.de">kontakt@example.de</a>
	<!-- TODO: Echte E-Mail-Adresse eintragen (nach § 5 DDG Pflicht) -->
</p>

<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
<p>
	Zygimantas Grebeniuk<br />
	Loensweg 31<br />
	37085 Göttingen
</p>

<h2>Hinweis auf Verantwortlichkeit</h2>
<p>
	Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
</p>

<p class="muted small">
	Angaben gemäß § 5 DDG. Die E-Mail-Adresse ist noch ein Platzhalter — bitte die echte Adresse eintragen.
</p>

<style>
	h1 { margin-bottom: 0.25rem; }
	h2 { margin-top: 2rem; font-size: 1.1rem; }
	.muted { color: #777; }
	.small { font-size: 0.8rem; margin-top: 2.5rem; }
	a { color: #4a90d9; }
</style>
