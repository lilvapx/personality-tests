<svelte:head>
	<title>Methodik — personality-tests</title>
</svelte:head>

<h1>Wie die Auswertung funktioniert</h1>

<h2>Scoring</h2>
<p>
	Jedes Item gehört zu einer <strong>Facette</strong> (z.B. "Friendliness") und hat ein
	<strong>Keying</strong>: "plus" bedeutet, Zustimmung erhöht den Facetten-Wert;
	"minus" (reversed) bedeutet, Zustimmung senkt ihn. Reversed-Items werden vor der
	Berechnung umgepolt (bei Skala 1–5: <code>reversed = 6 − roh</code>).
</p>

<h2>Aggregation</h2>
<ol>
	<li><strong>Facet-Score</strong> = Mittelwert der beantworteten Items der Facette (mind. 75% nötig)</li>
	<li><strong>Domain-Score</strong> = Mittelwert der Facet-Scores der Domain (mind. 4 von 6 Facetten)</li>
</ol>
<p>
	Fehlende Werte werden nicht durch Schätzwerte ersetzt — wenn zu wenig beantwortet
	wurde, bleibt der Score <code>null</code> statt eine falsche Präzision vorzutäuschen.
</p>

<h2>Normierung</h2>
<p>
	Falls Normdaten hinterlegt sind (siehe <code>data/instruments/&lt;id&gt;/norms/</code>),
	wird der Rohwert in einen <strong>Prozentrang</strong> umgerechnet (Normalverteilungsannahme).
	Ohne Normdaten werden nur die Rohwerte auf der Skala angezeigt.
</p>

<h2>Grenzen</h2>
<ul>
	<li>Persönlichkeitstests messen <em>Tendenzen</em>, keine festen Eigenschaften</li>
	<li>Soziale Erwünschtheit und Stimmung beeinflussen Antworten</li>
	<li>Kein klinisches Diagnoseinstrument — bei Belastung: Fachperson suchen</li>
</ul>

<p><a href="/">← Zur Übersicht</a></p>
