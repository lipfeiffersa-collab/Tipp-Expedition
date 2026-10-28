# Waldatelier 18 – Illustrationsfassung für Tipp-Expedition 4.7

Die verbindliche Stilvorlage ist `Stilreferenz-T-Abzweigung.png`: die vom Nutzer bestätigte handgezeichnete Waldillustration mit mittlerer Detaildichte und einer quer verlaufenden T-Abzweigung. `Stilreferenz.json` dokumentiert die dazu erzeugten Motive. Die früheren Versuche sind keine Gestaltungsreferenz für Folgeänderungen.

## Bauen und weitergeben

Im Repository: `python waldatelier/build.py`. Benötigt Python 3 und die eingebetteten WebP-Quelldateien. Ergebnis: `Tipp-Expedition-4.7-Waldatelier.html`.

`python waldatelier/export.py` erzeugt unter `/workspace/shared/downloads` die eigenständige `Wald-Spiel-v18.html` und `Wald-Spiel-v18.zip`. Die ZIP enthält absichtlich wieder `Wald-Spiel.html`, damit bestehende lokale Dateipfade beibehalten werden können. Alle siebenunddreißig verwendeten Bildbögen sind eingebettet. Standardmäßig enthält der Export die vollständigen aktuellen Motive. Optional kann `--previous` vier unveränderte komprimierte Motive übernehmen; für die Nahaufnahmen wird die vollständige Auflösung empfohlen.

Vor dem Ersetzen einer vorhandenen Datei eine Kopie behalten. Für vorhandene lokale Spielstände Dateiname, Speicherort und Browser beibehalten; Browserdaten nicht löschen. Tierfotos bleiben erhalten. Gefundene Hinweisfotos werden als zusammenhängende Bilder erneuert.

## Aufbau

- `Spiel-4.7-Ausgangsversion.html`: unveränderte hochgeladene Spielversion. SHA256 `80bf45a036059a7d283249e3e832323d9824948a3e2f8be113fc7e154d2638b9`.
- `wald.js`: Bildladen und tatsächliche Atlaszuschnitte, akzeptierte Tier-/Gegenstandsmotive, Inventar, Fotoausschnitte und Puzzleoberflächen.
- `dezent.js`: zusammenhängender Waldgrund, begehbare Wegformen, alle Objektregister einschließlich Wegrandgrafiken, Orte und ihre Zustände, berechnete Schildrichtungen, Fußspuren, Kartendarstellung und Hinweise.
- `nachtpfad.js`: Darstellung des Sprungabschnitts mit ursprünglicher Kollisionsgeometrie.
- `wald.css`: Spielrahmen, Inventar, Tagebuch und bebilderte Rätseloberflächen.
- `Wald-Bestand.json`: vollständiger Inhaltsbestand der ursprünglichen Waldwelt.
- `Wald-Analyse-und-Gestaltung.md`: Bestandsaufnahme und Versionsgeschichte; Revision 5 ersetzt die älteren Gestaltungsansätze.

Der gemeinsame Waldgrund enthält keine eingebauten Wege, Schilder, Tiere oder interaktiven Ortsmarker. Die tatsächlichen Ausgänge entstehen aus dem ursprünglichen Wegenetz und dem angehängten Ruinenpfad. Es gibt keinen zufälligen Wechsel zwischen Landschaftspanoramen. Standortmarker behalten ihre Weltposition und Ecke; die Wegrandgrafiken und Hindernisse haben eigene passende Motive. Tiere und Fundstücke bleiben eigene Spielelemente. Schildpfeile folgen weiterhin `dirTo` und der Blickrichtung; die sechs ursprünglichen Schildstandorte bleiben erhalten.

Ortsbögen: `orte5a` enthält Hütte außen, Hütte innen, Wasserfall und sauberen Friedhof. `orte5b` enthält geschlossene Ruine, eine Lichtung, Felsformation und hohlen Baum. `zustaende5` enthält bemoosten Friedhof, offene Ruine und die Feuerstelle mit kaltem beziehungsweise brennendem Holz. Truhen, Karte, fünf Schneckenhäuser, Seitenstücke und Inschrift werden nach dem tatsächlichen Spielstand ergänzt. Die Flamme wird zusätzlich über der ursprünglichen Nachtabdunklung dargestellt, damit sie sichtbar Licht ausstrahlt.

Die Karte zeichnet weiterhin erst nach ihrem Fund zurückgelegte Teilstrecken auf (`world.cartography`, Schema 3). Frühere Besuchsmarkierungen bleiben für Fußspuren erhalten. Die ursprünglichen Vogelhilfen ergänzen unabhängig davon bekannte Geheimorte und die Fundstücke des aktuellen Tages. Reine Zeichenaufrufe ändern den Spielstand nicht.

## Prüfen

Aus `/workspace`: `python -m http.server 8031 --bind 127.0.0.1`. Mit Python Playwright und Chromium:

- `python waldatelier/check-browser.py`: 442 Waldansichten, Kartenfund und tatsächliches Weitergehen, Persistenz, Fußspuren, alle zehn Hütten-Schlossteile bis zur geöffneten Tür, 13 Tiere und echte Fotoaufnahme.
- `python waldatelier/check-forest-details.py`: alle 38 Objekttypen, sieben Wegrandgrafiken, Blockaden/Hindernisse, drei Untersuchungsorte und alle 31 benannten Marker; Schilder in 24 relevanten Blickrichtungen anhand unabhängig berechneter kürzester Wege; Karten-/Truhenfund, Wasserfall entdecken und Wasser schöpfen, acht Moosbuchstaben und Seitenfund, fünf Schneckenhäuser und alle zehn Wappenteile samt offener Ruine, tatsächliches Entzünden des Feuers mit Materialverbrauch; Vogel-Kartenhilfen und reine Kartendarstellung.

Zusätzlich geprüft: Inventar, Tagebuch und Album, Hütten-Ausgang, Laternenpfad und Sprungabschnitt, Mobilansicht ohne externe Bildanforderungen, 84 Höhlen- und 120 Wüstenansichten. Die eigenständige Exportdatei wurde gesondert gestartet und für die Galerie mit 86 Einträgen verwendet; die Nachtflamme wurde auf sichtbare helle Flammenpixel geprüft. Die Galerie zeigt alle 31 Standortmarker, alle 13 Tierarten, Ortszustände, Rätsel und Gegenstandsmotive.

Die Prüfungen belegen diese Funktionen, keine vollständige manuelle Durchspielung sämtlicher Erzählzweige und Tierfreundschaften. Direkte file://-Navigation ist im verwalteten Prüfbrowser nicht erlaubt; die Browserprüfungen verwenden HTTP. Die visuelle Beurteilung erfolgt anhand der tatsächlichen Spielansichten und der bestätigten Stilvorlage.

## Revision 6: Tagebuch und Nachtpfad

Die Wald-, Höhlen- und Wüstenabschnitte beginnen jeweils auf einer eigenen Doppelseite. Der Wald wächst mit Sichtungen und Fotos auf die nötige Seitenzahl. Die ursprüngliche tierbezogene Speicherung der Fotos bleibt bestehen.

Die Laternenfolge zeigt die bekannte Lichtung mit kaltem Feuer und danach denselben Waldweg. Der seitliche Sprungabschnitt verwendet einen eigenen, zur Stilvorlage erzeugten Nachtwald und Materialbogen. Boden, Felskanten, Holzgerüst, Tore, niedrige Gänge, Hindernisse, Gegenstände und Figur richten sich nach der bestehenden Levelgeometrie. Licht und Laternenhöhe folgen den Plattformhöhen; die Laterne sinkt am Schacht ab. Steuerung, Levelaufbau und Höhlenübergang bleiben erhalten.

`python waldatelier/check-night.py` öffnet die eigenständige v6-Downloaddatei und prüft Kapitelgrenzen bei unbekannten Tieren, Mausfoto und allen 13 Waldtierfotos, Nacht-Auslöser, fünf echte Schritt-Tasten bis zum Sprungabschnitt, 14 Hindernisaktionen, 33 Hindernisansichten, Schachtfall und Höhlen-Schaltfläche sowie schmale Tagebuchreiter. Die Hindernisaktionen werden gezielt an den jeweiligen Levelstellen geprüft; ein vollständiger manueller Durchlauf ist damit nicht behauptet.

`python waldatelier/check-journal-photo.py` prüft eine tatsächliche Waldmausaufnahme per K (mit erneutem Versuch bei der ursprünglichen Verwacklungswahrscheinlichkeit), die eindeutige Wald-Reiterzuordnung, Erhalt des Fotos nach Neuladen und Wiederaufnahme der Nachtfolge.

## Revision 7: Sammelmünzen und Schluchttiefe

Im Sprungabschnitt wird jede Sammelmünze als einzelne, schattierte Münze mit Rand und Prägung gezeichnet. Das Münzhaufenmotiv bleibt beim Inventar. Schluchten verwenden einen transparent beginnenden Tiefenverlauf, unregelmäßige texturierte Felskanten und einen zurückhaltenden Dunstschleier; Hintergrund, Abgrund und Ufer gehen so ineinander über. Kollisionsgeometrie, Münzpositionen und Spielwerte bleiben gleich. Geprüft sind einmalige Münzaufnahme, Hindernisaktionen einschließlich Hangeln, 33 Hindernisansichten und der Höhlenübergang.

## Revision 8: verankerte Hangelstelle und durchgehender Nachtwald

Beide Schluchten besitzen nun auf beiden Ufern je ein A-förmiges Gestell aus rohen Holzstangen mit verschnürten Querstreben und abgespannten Erdankern. Ein geflochtenes Handseil hängt leicht zwischen den Gestellen durch. Die Zeichnung der hangelnden Figur folgt der Seilhöhe; die ursprünglichen Tastenschritte, Schluchtbreiten und Physik bleiben bestehen. Die Felswand am Schacht verwendet eine einzelne deckende Felsfläche ohne wiederholte Moosbänder oder transparente Streifen.

Das neue breite Nachtwaldpanorama besitzt verschiedene Birken-, Buchen- und Nadelbaumgruppen ohne den auffälligen Gabelbaum. Es wird entlang der Levelstrecke einmal durchlaufen, ohne Spiegelung, Wiederholung oder Wechsel zwischen zufälligen Bildern. Tests prüfen beide Hangelstellen mit tatsächlichen H-Aktionen und auf dem Boden liegenden Gestellstandorten; außerdem die bisherigen Nacht-/Sprungprüfungen, Münzaufnahme und den Höhlenübergang.

`python waldatelier/check-handline.py` führt an beiden Schluchten jeweils drei H-Aktionen bis zur Mitte aus und prüft die Hangelpose und die Bodenhöhe beider Gestelle; Screenshots werden in einem temporären Verzeichnis abgelegt.

## Revision 9: Felshang auf fortgesetztem Waldboden

Nur die Felsdarstellung am Ende des Sprungabschnitts ist angepasst: Der Waldboden läuft hinter dem Schacht auf derselben Höhe weiter. Darauf erhebt sich ein steiler, unregelmäßig begrenzter Felshang mit losem Stein und niedrigem Bewuchs am Fuß. Die frühere, bis unten durchgezogene Fels-Schnittfläche entfällt an dieser Stelle. Leveldaten, Kollisionen, Münzen und Hangelstellen bleiben gleich. Geprüft: identische Leveldaten gegenüber v8, reine Darstellung ohne Änderung des Spielstands, tatsächlicher Schachtfall und Höhlenübergang.

## Revision 10: Schachttiefe und Höhlengestaltung

Der Schacht nutzt nun den Tiefenverlauf und die Felskanten der Schlucht; seine beiden Holzstützen und der obere Querbalken bleiben erhalten.

`hoehle.js` ergänzt die bestehende Höhlenansicht um passende illustrierte Fels-, Erd-, Holz- und Wassermaterialien und scharfe Tier-/Objektbilder. Der ursprüngliche Geometrieaufbau, die Blickrichtungen, Deckenhöhen und Verdeckung bleiben maßgeblich. Räume und Merkmale: Schacht/Sandhaufen, vierfarbige Kristallmarker, Tropfsteine, Fässer, Kisten, Schaufel, Spinnweben, Wurzeln; Spinnenraum mit Truhe, Geheimraum mit Skelett und Truhe, beide verschütteten Stollen, Lore und Prellbock, Kristallnische, Werkzeuge, beide Türen, Bach und Leiter-Ausgang. Tiere: Höhlenspinne, Großes Mausohr und Maulwurf. Neue Tierfotos und Erinnerungsfotos zeigen diese Ansicht, vorhandene Fotos bleiben bestehen. Werkzeuge und Höhlenfunde besitzen passende Inventar- und Tagebuchbilder.

Die Abzweige und engen Gänge werden nicht durch feste Hintergrundbilder ersetzt. Renderaufrufe verändern weder Weggeometrie noch Spielzustand. Der Wüstenabschnitt nutzt seine bisherige Darstellung.

Prüfung der eigenständigen v10: 117 Höhlenansichten einschließlich Stand/Ducken/Kriechen, echte G-Aufnahme der Laterne und Spitzhacke, beide Geröllfolgen mit je acht G/H-Eingaben, Kristallprobe, Schlüsseltruhe, Steintür und Geheimtruhe, zwei Torriegel, Wurzelvorhang, Bachsprung, Wasser und Öl. Drei echte Tieraufnahmen mit K, Höhlen-Reiter, Fotoerhalt nach Neuladen und Erinnerungsfotos ohne Änderung des Spielstands. Leiter-Ausgang und tatsächlicher Übergang zur Wüste. Zusätzlich bestehende Waldprüfung mit 442 Ansichten, Kartenpersistenz, Hüttenrätsel und Waldtierfoto sowie Nacht-/Sprungprüfung. Schmale Browseransicht und reduzierte Bewegung wurden geprüft; keine Prüfung auf physischer Mobilhardware.

## Revision 11: korrigierte Truhenbelohnungen

Nach ausdrücklicher Nutzerkorrektur vergibt die Geheimraumtruhe in der Mine 5 alte Münzen und 5 Goldmünzen; die Truhe hinter der Kakteen-Lehmmauer 3 alte Münzen und 7 Goldmünzen. Diamant, Nahrung und übrige Belohnungen bleiben erhalten. Die Sanddünenhöhle vergibt weiterhin 8 alte Münzen. Der ursprüngliche Upload bleibt unverändert; `build.py` wendet die beiden gezielten Inhaltskorrekturen an.

`belohnungen.js` kennzeichnet die korrigierten Auszahlungen pro Welt. Bei älteren Spielständen mit bereits geöffneten Truhen werden einmalig 5 bzw. 3 Goldmünzen in alte Münzen umgebucht. Bereits ausgegebenes Gold wird nicht negativ. Vor dieser nachträglichen Korrektur bleibt der bestehende lokale Spielstand einmal unter `tipp-expedition-rpg-v1-vor-muenzkorrektur-v11` erhalten. Nicht geöffnete Truhen und andere Belohnungen werden nicht verändert.

## Revision 12: Begegnungen, Ruinenpfad und sichtbare Rückmeldungen

Im Wald stehen zwölf statt elf Tierbegegnungen gleichzeitig bereit. Der normale Ortswechsel erfolgt nach zwölf statt achtzehn Schritten; dabei kann ein entferntes Tier auf einen tatsächlich anschließenden freien Weg wechseln. Rehe erhalten ein höheres Auswahlgewicht und werden auch für bestehende Waldspielstände einmalig ergänzt, falls sie fehlen. Es gibt weiterhin keine doppelten Tiere desselben normalen Begegnungsschlüssels.

Nach fünf Schneckenhäusern und dem vollständig gelösten Wappen führt ein begehbarer Pfad durch die Ruine zu einer Futterkrippe. Die beiden neuen Knoten und Kanten sind am Ende der ursprünglichen Definitionen angehängt; sämtliche bisherigen UIDs bleiben stabil. Drei Rehe können dort jeweils einmal gefüttert oder gestreichelt werden. Eine Aktion verbraucht eine Begegnung, nicht alle drei; die Anzahl bleibt beim Neuladen erhalten. Diese ruhigen Rehe erlauben vorsichtiges Streicheln auch vor der normalen Vertrauensschwelle. Im übrigen Wald gilt die bisherige Vertrauensentwicklung. Feuersalamander werden ausschließlich beobachtet und fotografiert.

`erlebnisse.js` zeigt kurze, mit Leertaste überspringbare Sequenzen: Futteraufnahme und Weggehen beziehungsweise Vogelflug, eine scharfe Tierporträt-Nahaufnahme mit gezeichneter streichelnder Hand sowie Truhenfunde mit Motiven und tatsächlich erhaltenen Mengen. Bei vollen Rucksackplätzen zählt nur der wirkliche Zuwachs. Die Darstellung zahlt keine Belohnungen aus; Truhen bleiben gegen mehrfaches Öffnen geschützt. Unter reduzierter Bewegung erscheinen ruhige Standbilder. Sitzbäume von Waldkauz und Buntspecht bleiben nach dem Fortgehen erhalten.

Der Abendverlauf blendet über die gesamte Bildhöhe weich aus. Die frühen Hüttenschilder weisen konsistent über A–C–HUT; alle weiteren Schilder verwenden das tatsächliche Wegenetz. Bodenfoto und Album verwenden dieselbe motivbezogene Bilddatei. Neue Zusatzmotive: fressendes Reh, fliegender Waldkauz und Buntspecht, deckende Höhlentiere und passende Felsflächen. Spitzhacke: vollständiger Zuschnitt einschließlich Metallkopf und genug Platz im Inventarsymbol.

Der Kriechabschnitt liegt unter einem Felsüberhang. Ä-Biegungen zeigen dichte, dornenlose Zweige mit fortschreitendem Freilegen. Tore besitzen Holzrahmen und Metallriegel; der Rahmen und das seitlich geöffnete Tor bleiben sichtbar. Die Felsflächen neben den Leitern nutzen passende Steinzeichnungen. Levelgeometrie, Tastenschritte und Kollisionsdaten sind unverändert.

### Validierung der Revision 12

- `python waldatelier/check-v12.py`: tatsächliche Übernahme eines v11-Spielstands, alte Knoten-/Kanten-IDs und Position, frühe Schilder in vier Richtungen, vier motivgetreue Fotoaufnahmen, fünf Schneckenhäuser und zehn Wappenteile über Tastatur, tatsächlicher Zugang zur Krippe, drei einzelne Tieraktionen und Persistenz, Mengenbegrenzungen und einmalige Truhenbelohnung, Sitzbaum-Erhalt, Feuersalamander, unveränderte Sprunggeometrie und zwei Torriegel.
- `check-forest-details.py`: alle Grafikregister und 24 Schildansichten, Karten- und Vogelhilfen, Wasserfall/Truhe/Wasser, Grabstein, Ruine und Lagerfeuer über die tatsächlichen Tasten. Die Truhensequenz wird vor dem anschließenden Wasserschöpfen mit Leertaste beendet.
- `check-night.py`: Kapitelgrenzen, tatsächliche Laternen-Schrittfolge, Münzaufnahme, 14 Hindernisaktionen, 33 Hindernisansichten, Schachtfall und Höhlenübergang.
- `check-cave.py`: 117 Höhlenansichten und Posen, Werkzeugaufnahme, beide Geröllstellen, Türen und Truhen, drei Tierfotos, Fotoerhalt und Leiter-Ausgang zur Wüste.
- `check-animal-feedback.py`: Füttern, Porträt mit Hand und Fortgehen für alle zwölf ungefährlichen Waldarten, Foto der Rehgruppe ohne verbrauchte Begegnung sowie zustandsneutrale Spinnendarstellung.
- `check-rewards.py`: korrigierte Münzbelohnungen, Migration älterer geöffneter Truhen, Schutz vor Doppelauszahlung und negative Goldstände.

Die Browserprüfungen verwenden HTTP und Chromium; eine vollständige manuelle Durchspielung wird damit nicht behauptet.

## Revision 13: Wüste und Hafenstadt

Die vollständige Umsetzung und ihre Prüfung beschreibt [Wueste-Analyse-und-Gestaltung.md](Wueste-Analyse-und-Gestaltung.md#umsetzung-in-revision-13). `wueste.js` ergänzt eigenständige Wüstenflora, neun Tierarten, Fundstücke, 22 Standortmarker, acht feste Orte, Wasser-/Wetterzustände, Zeltsequenz, Felsbildrätsel und die fünf Stationen der Hafenstadt. Der bestätigte Austausch zur Dornschwanzagame erhält alte Fortschritte und archiviert das frühere Dornteufel-Foto ausdrücklich.

`python waldatelier/check-desert.py` prüft die neue Welt mit tatsächlichen Tasteneingaben und einem alten Artfortschritt. `check-v12.py` bleibt die Regression für Wald, Ruinenpfad, Begegnungen und Nachtpfad. Der Export enthält sämtliche Bilder inline und behält den inneren Dateinamen `Wald-Spiel.html`.

Die geprüften Atlaszuschnitte liegen in `atlas-bounds.json`, jeweils an den SHA-256 des Bildbogens gebunden. Dadurch wird die teure Komponentensuche beim Start übersprungen. Bei geänderten Bildern verwirft `build.py` automatisch den betreffenden Cacheeintrag; der Browser berechnet dann den Zuschnitt neu. Nach Bauen und Starten des lokalen Prüfservers kann `python waldatelier/cache-atlas-bounds.py` die überprüften Grenzen aktualisieren. Das Skript vergleicht zusätzlich die tatsächlich geladenen Bilder mit den Quelldateien.

## Revision 14: Dünen und Schatten

`duenen.webp` und die aktualisierte Wüstenzeichnung zeigen hohe Dünen, weich auslaufende Sandwege und den Höhleneingang unter einem großen Dünenhang. Nutzbare Schattenplätze erhalten größere Schattenflächen und einen an den echten Hitzeschutz gebundenen Rast-Hinweis. `check-dunes.py` prüft dazu Schatten, tatsächlichen Wasserverbrauch, Ü und die Höhlenzustände. Einzelheiten stehen in der [Wüstenanalyse](Wueste-Analyse-und-Gestaltung.md#revision-14-hohe-dünen-sandwege-und-nutzbare-schattenplätze).


## Revision 15: Wüstenkorrekturen

`revision15.js` ergänzt nach den bisherigen Modulen die präzisen Teilstrecken-Spuren (`world.trails15`), lesbare Kreuzungen und stärkere Schatten, vollständige Gehbilder, sechs Tier-Gangarten, eine zusammenhängende Stadttorkulisse sowie den sichtbaren Herbergsablauf. Die 34 eingebetteten Bildbögen benötigen keine Internetverbindung. `stadtgang` wird auf eine gemeinsame Bodenhöhe normalisiert; `wuestengang` verwendet artspezifische Zeilen- und Spaltengrenzen. Orts- und Kanten-IDs, Preise, Rätsel und ursprüngliche Belohnungen bleiben erhalten.

Bestimmungen stehen dauerhaft in `desertKnown15`. Essbare Früchte werden erst danach gesammelt und automatisch verbraucht; Oscher und Koloquinte bleiben als giftig vermerkt. Schon dokumentierte Tierarten werden beim Umstieg übernommen. Genaues Spurenzeichnen beginnt mit dieser Version: Die alte pauschale Kantenmarkierung kann keine tatsächlichen Teilstrecken belegen und wird dafür nicht übernommen. Entdeckte Kartenwege bleiben erhalten. Ein Sandsturm verweht die neuen Spuren.

Herbergszahlungen erfolgen weiterhin im bestehenden Menü. `innStayPending` sichert eine bezahlte, unterbrochene Nacht, damit Neuladen weder eine zweite Zahlung noch einen doppelten Tageswechsel verursacht. Die Sequenz lässt sich pausieren und mit Leertaste abschließen.

`check-v15.py` prüft tatsächliche I/P/G/F/J-Tasten, gefährliche Arten, Nahrung vor/nach Bestimmung, Spuren mit Rückweg und Neuladen, sieben Sandrosen, alle sechs Hinweisfotos, Herbergszahlung und unterbrochene Übernachtung sowie vollständige Bewegungsphasen. `check-desert.py` deckt zusätzlich bestehende Wüsten-, Sturm-, Zelt-, Truhen-, Stadt- und Migrationsabläufe ab. `check-export-v15.py` prüft die eigenständige ZIP und unveränderte Überlebensregeln.


## Revision 15.1: ausschließlich die Wüstenwege

Die deckende, helle Wegfüllung entfällt. `uSoil` erhält die Sandfarben und Windrippeln der vorhandenen Dünenkulisse und stellt verdichteten Sand durch eine moderate Abdunklung dar. Die Wegmaske erhält weich auslaufende, unregelmäßige Ränder. Die tatsächlichen Abzweigungen und die präzise Spurenlogik bleiben unverändert. Ein auf zwölf Ansichten begrenzter Cache verhindert eine erneute Pixelberechnung bei jedem Bild. `check-road-v15-1.py` prüft Sandstruktur und Farbkontrast, zwölf Kreuzungsansichten, Spurenrichtung, unveränderte Spielstände und wiederholte Darstellung. Mit `TIPP_TEST_URL` kann dieselbe Prüfung gegen den eigenständigen Export laufen.


## Revision 16: Wege, Himmelsblick und Lehmruine

`revision16.js` ergänzt eine fein gekörnte, perspektivisch abgetastete Trittfläche mit weniger Windrippeln als der benachbarte lockere Dünensand. Die drei ursprünglichen Ausgänge jeder Ansicht entstehen weiter aus dem tatsächlichen Wegenetz. Schattenflächen sind an sichtbare beziehungsweise am Bildrand liegende Landschaftselemente gebunden.

O öffnet einen animierten Aufwärtsschwenk. Ein eigener Himmel verlängert die Szene nach oben, beim Zurückblicken bleibt die ursprüngliche Position erhalten. Die Hinweise auf Sonne, Polarstern, Wasser suchende Flughühner und Sandsturm kommen weiterhin aus der bestehenden Spiellogik. Leertaste oder O senken den Blick; Pausieren stoppt die Bewegung.

`lehmruine.webp` enthält Mauer, Trümmer sowie dieselbe Truhe geschlossen und geöffnet. Die Truhe wird unter der Mauer gezeichnet. Eine unregelmäßige, mit jedem G/H-Schlag wachsende Bresche gibt die Sicht auf sie frei. Kurze fallende Lehmstücke ergänzen den Abtrag. Acht Schläge und die ursprüngliche einmalige Belohnung bleiben erhalten. Die Atlasgrenzen sind eigens vermessen. `wuestenhimmel.webp` ist eine durchgehende Himmelsmalerei. Alle 36 Bildbögen sind eingebettet.

`check-v16.py` prüft tatsächliche O/U/G/H/Leertasten, Kamerarückkehr und Pause, vier Wetter-/Tageszeit-Hinweise, acht Abtragsschritte, die korrigierte Truhenbelohnung und Neuladen. `check-desert.py` prüft zusätzlich die vorhandenen Wüsten- und Stadtfunktionen.

Große Wegmarker berücksichtigen in Revision 16 ihre gesamte projizierte Breite, nicht nur den Ankerpunkt. Ihr Abstand zum begehbaren Pfad wird gemeinsam mit der Schattenposition berechnet.


## Revision 16.1: Nachthimmel an den Landschaftskonturen

`nachthimmel.js` bestimmt aus der noch unbeleuchteten Spielansicht eine zusammenhängende Himmelsmaske. Farb- und Helligkeitskanten sowie lokale Struktur begrenzen sie an Dünen, Felsen und Vegetation. Der Nachthimmel wird durch diese Maske hinter der beleuchteten Vordergrundkulisse sichtbar. Alte, frei über die Szene verteilte Sterne entfallen. Die Laternen-Aufhellung nutzt den gesamten radialen Verlauf ohne rechteckigen Beschnitt.

Der Nachtblick richtet den Ausschnitt auf eine tatsächlich sichtbare Himmelsöffnung. Landschaft und Himmelsmaske bewegen sich gemeinsam; kein Rand eines aufgesetzten Szenenrechtecks tritt ins Bild. Die Tagansicht verwendet weiterhin den bisherigen Ablauf. `check-night-sky.py` prüft bestimmte Himmel-/Geländepunkte, die O-/Leertasten-Bedienung, vier Bewegungsphasen über Dünen, zwischen Felsen und unter Palmen sowie 40 Nachtansichten. Es prüft außerdem, dass der Tag unverändert bleibt und das Zeichnen den Spielstand nicht ändert.


## Revision 16.2: Kreuzungslesbarkeit und Wetter

`wege-und-wetter.js` verbreitert die quer verlaufenden Pfade um etwa die Hälfte und erhöht den Materialkontrast. Weiche, unregelmäßige Ränder und die vorhandene Sandstruktur bleiben erhalten. Tatsächliche Ausgänge, Standortmarker und gespeicherte Fußspuren sind weiter an das ursprüngliche Wegenetz gebunden.

Ein gemeinsamer Himmelsrenderer ersetzt die getrennten Tag-/Nacht-Zusammensetzungen. Alle Himmelsflächen sind vollständig gefüllt; ein Bildausschnitt mit offenem beziehungsweise blauem unteren Rand entsteht nicht. Aktives Wetter hat Vorrang vor den normalen Sonnen-, Vogel- und Sternhinweisen. Sandsturm und Vorwarnung haben eigene durchgehende Staubhimmel; Tag und Nacht werden berücksichtigt. E bleibt beim Blick in einen herannahenden Sturm als Eingraben-Taste verfügbar. Kamera und Wetteranimation pausieren zusammen.

`check-v16-2.py` prüft eine tatsächlich mit F/J betretene Kaktuskreuzung bei schmalem Spielfenster, Materialkontrast und Wegbreite sowie 20 Kamerastufen bei klarem Himmel, Sturmwarnung, Nacht, Tagsturm und Nachtsturm. Es prüft auch einen Sturm, der während des Himmelsblicks beginnt, E und das anschließende Ü-Überleben.


## Version 17: Desktopansicht und Bedienung

`desktop.css` gibt der Spielansicht den Platz des bisherigen Inventars. Karte und Versorgung bleiben in einer schmalen rechten Spalte. Die Bildschirmtastatur ist mit F3 einblendbar; nur diese Anzeigepräferenz wird separat in localStorage gespeichert. Die jeweils gültigen Aktionstasten mit Fingerhinweisen bleiben sichtbar. Bei Rätseln entfällt die rechte Spalte; das Wüstenschiebebild wird zusätzlich um 20 Prozent vergrößert. Die Kamera im eigentlichen Spiel bleibt unverändert.

`desktop.js` verschiebt das vorhandene Inventar in eine mit F2 erreichbare, pausierende Übersicht mit fünf Kategorien. Bilder, Mengen und ursprüngliche Versorgungsanzeigen bleiben erhalten. Pfeiltasten, Tab, Home/End und Bild auf/ab bedienen die Übersicht. Enter zeigt Name und Menge, Escape/F2 schließen sie. Der vorherige Pausenzustand und Fokus werden wiederhergestellt. Menübuchstaben bleiben gültig; Pfeiltasten/Enter ergänzen sie. Escape schließt Menüs und Rätsel, Enter bestätigt in den vorhandenen Unterbrechungsdialogen. Die Pause ist auch in der Stadt verfügbar.

Der Build ersetzt den bisherigen Fall ohne neuen Text beim normalen Weitergehen durch eine aktuelle Weg-/Gangbeschreibung. Fundhinweise bleiben dadurch nicht an einem inzwischen verlassenen Ort stehen. Gegenstände, Tierkontakte, Positionen, Schlüssel, Rätsel, Preise und Belohnungen werden durch diese Änderungen nicht ersetzt.

`kuestenweg.js` verwendet die vorhandene Stadttorkulisse auf der gesamten letzten Wegkante in Richtung Stadt. Ein geringer kontinuierlicher Zoom verbindet sie mit der Nahansicht. Auf dieser Kante werden keine Dünen und kein zusätzliches einzelnes Tor darübergezeichnet. Gegenstände, Tiere, Begleiter, Fußspuren und Tages-/Wetterbeleuchtung bleiben erhalten. Die bestehende Herbergsgrafik wird doppelt so breit dargestellt, damit ihre Tür zur Spielfigur passt; ihr Mondschild sitzt entsprechend weiter außen.

Prüfung: `python waldatelier/check-desktop-v17.py` testet tatsächliche Tastendrücke, Inventarsortierung und Fokus/Scrollen, erhaltene Pause, unveränderte Versorgung während des Inventars, Menüwahl, veraltete Fundhinweise nach einem F/J-Schritt, Küstenweg, Stadtpause und einen echten Schieberätselzug. Es erstellt Vergleichsbilder bei 900, 1280, 1600 und 1920 Pixeln Fensterbreite. `check-desert.py` prüft die bestehenden Welt-, Fund-, Sturm-, Tier-, Rätsel- und Stadtfunktionen. `check-export-v17.py` prüft den eigenständigen Offline-Export.


## Version 17.1: Zeltaufbau

`zelt.js` macht Z als Zeltaktion in der Wüste auffindbar. Fehlende Materialien und ungeeignete Plätze führen zu einer Übersicht. An Oase und Kakteenfeld ist der Aufbau aus 10 Palmwedeln, 6 Akazienzweigen und 4 Stück Stoff jetzt auch tagsüber und unabhängig von der Blickrichtung möglich. Drei sichtbare Schritte zeigen Gestell, Bespannung und fertiges Zelt. Leertaste schließt ab; Rücktaste bricht ohne Verbrauch ab. Erst der erfolgreiche Aufbau zieht die Materialien ab und legt das wiederverwendbare Zelt ins Inventar.

`world.tentCamp17` speichert den aktuellen Lagerplatz. Das Zelt bleibt dort nach Speichern und Neuladen sichtbar und wird beim Weitergehen automatisch eingepackt. Über Z lässt es sich am Lagerplatz auch manuell einpacken. Ein bereits fertiges Zelt benötigt beim erneuten Aufbau kein Material.

Schlafen bleibt ab 18 Uhr möglich. Die Sequenz blendet durch Nacht und Morgen; die ursprüngliche Übernachtungsfunktion setzt einmalig Tag und Uhrzeit weiter und füllt die Weltfunde nach. Durst und Nahrung folgen weiterhin den vorhandenen Regeln. Die ursprüngliche Z-Schlafaktion in der gelösten Dünenhöhle bleibt erhalten. Bei aktivem Sandsturm wird keine neue Zeltaktion angeboten.

`check-tent-v17-1.py` prüft echte Z-, Leertasten-, Rücktasten-, Escape-, Enter- und F2-Eingaben: fehlendes Material, ungeeignete Orte, alle Blickrichtungen, Tagaufbau, Abbruch, Pause, automatischer Abschluss, Inventar, Speichern/Neuladen, Einpacken und Wiederverwenden, genau eine Nacht, ersten Abendaufbau im Kakteenfeld sowie den ursprünglichen Höhlenschlaf. `TIPP_TEST_URL` erlaubt dieselben Prüfungen am eigenständigen Export. Der Schiffsteil wird in dieser Version nicht erweitert.


## Version 17.2: Aufbau am Lagerplatz und sichtbare Stadtannäherung

Die Aufbauschritte stehen direkt in der Landschaft, an derselben Position und in derselben Größe wie das fertige Zelt. `t17WorldTent` zeichnet Gestell, teilweise bespanntes Dach und fertiges Zelt in die Szenenebene vor der Tages-/Wetterbeleuchtung. Beim Phasenwechsel wird die Szene aktualisiert. Ein zusätzliches Detailfenster entfällt; die Hinweise erscheinen im normalen Textbereich. Abbruch, Pause, Materialverbrauch, Speichern und Übernachten bleiben unverändert.

`kuestenweg.js` vergrößert die Stadttorkulisse jetzt von der Fernansicht bis auf gut das Doppelte. Der Ausschnitt folgt dem Durchgang und dem Boden davor. Auf der letzten Wegkante interpoliert die Kamera während jedes tatsächlichen F/J-Schritts zwischen den beiden Standorten. Der bisherige starke Zwischenzoom mit anschließendem Zurückspringen entfällt auf dieser Kante. Die bestehende Schrittzahl und alle Bewegungs-/Material-/Kartenaktionen bleiben erhalten. Eine Pause hält auch die Kamerabewegung an.

`check-coast-v17-2.py` prüft ein tatsächliches Abbiegen, alle anschließenden F/J-Schritte, sichtbare Bildänderungen, zunehmende Kameranähe, Pause und zwei schnell aufeinanderfolgende Schritte. Es zeichnet eine kurze Aufnahme des tatsächlichen Stadtwegs auf. Beim Zelt prüft es alle drei Aufbauschritte ohne Aufruf des Fensterzeichners sowie identische Zeltposition vor und nach dem Abschluss. `check-tent-v17-1.py` prüft weiterhin die vollständigen Zeltfunktionen; `check-export-v17-2.py` prüft den eigenständigen Offline-Export.


## Version 18: Sofortbilder und freiwillige Entdeckeraufgaben

`polaroid.js`, `entdecker.js` und `expedition18.css` ergänzen die bestehenden Spielsysteme. Die ursprüngliche hochgeladene HTML-Datei bleibt unverändert; Szenengeometrie, Wege, Rätsel, Überlebensregeln und reguläre Truhenbelohnungen bleiben erhalten.

### Bedienung

| Taste | Funktion |
|---|---|
| F2 | Rucksack öffnen; Gegenstände nach Art sortiert |
| F3 | Bildschirmtastatur ein/aus; das Symbol zeigt den aktuellen Zustand |
| F4 | Feldtagebuch als pausierende Übersicht öffnen/schließen, ohne die Welt neu zu starten |
| F5 | Freien Kamerasucher öffnen |
| F6 | Freiwillige Entdeckeraufgaben im Tagebuch |
| K | Tier direkt fotografieren; ohne Tier den freien Sucher öffnen |
| F / J | Sucher nach links / rechts bewegen |
| E / D | Sucher nach oben / unten bewegen |
| Leertaste | Auslösen |
| R | Leeren Film durch einen Ersatzfilm ersetzen |
| Escape | Sucher ohne Aufnahme schließen / Tagebuch verlassen |

Der quadratische Sucher arbeitet auf einer eingefrorenen Kopie der tatsächlichen Szene. Das gespeicherte 384×384-Bild entsteht aus genau dem gewählten Ausschnitt. HUD, Mauszeiger und Sucherrahmen werden nicht mitfotografiert. Der Sucher pausiert Welt, Bedürfnisse und Tierbegegnung. Tierfotos verwenden weiter die vorhandene Arten-/Vertrauenslogik, nun mit quadratischen Aufnahmen.

### Film und Speicherstände

Ein Film enthält acht Abzüge. Der erste Rucksack enthält ein Filmpaket; die gefundene Kamera lädt den Startfilm. Ein Kamerafund ohne zuvor gefundenen Rucksack erhält ebenfalls einen eingelegten Startfilm. Auf den Wegen kann pro Welt/Tag ein weiterer Film gefunden werden, sofern dort kein vorhandener Film wartet. Ein fertiger Film kann nicht versehentlich durch R verworfen werden. Abbrechen kostet keinen Film, ein ausgelöstes verwackeltes Tierfoto schon. Gefundene alte Hinweisfotos benötigen keinen Film.

`S.expedition18` enthält eingelegte Abzüge, persönliches Album, bestätigte Erklärungen, Fortschrittszähler und einmalige Belohnungsmarken. Ersatzfilme stehen als `S.res.film` im vorhandenen Ressourceninventar. Vorhandene Tierfotos werden nicht zurückgesetzt oder nachträglich berechnet. Ältere Spielstände mit Kamera erhalten einen eingelegten Film; der alte Rucksack erhält einmalig einen Reservefilm.

Das persönliche Album hat 48 Plätze, um den lokalen Browserspeicher zu begrenzen. Eine volle Sammlung verhindert weitere Auslösungen ohne Filmverbrauch. Eigene Abzüge lassen sich im Tagebuch mit zweimaliger Bestätigung entfernen. Das gibt keinen Film zurück und löscht keine bereits dokumentierte Tierart.

### Hinweise und Entdeckeraufgaben

Die Hundeleine erhält nach dem Aufwachen eine eigene Erklärung mit großem Gegenstandsbild. Rucksack, Film, Kamera, Karte, Wasserbeutel, Laterne und Spitzhacke werden beim ersten Erwerb erklärt. Erreichte Vertrauens- und Freundschaftsstufen erklären S und T. Die Erklärung wartet, bis laufende Fund-/Tiersequenzen beendet sind, und pausiert das Spiel bis Enter/Leertaste.

| Freiwillige Aufgabe | Einmalige Belohnung |
|---|---|
| Erstes eigenes Foto | 1 Film |
| Erstes geeignetes Tier füttern | 2 Goldmünzen |
| Erstes Tier streicheln | 3 Goldmünzen |
| Tierhilfe nutzen | 1 Film |
| Material fürs Lagerfeuer vollständig sammeln | 1 Film |
| Rehe fünfmal füttern | 5 Tierfutter |

Keine dieser Aufgaben sperrt einen Weg oder ersetzt eine ursprüngliche Voraussetzung. Belohnungen sind gegen mehrfaches Auszahlen nach Neuladen geschützt. Ist das Inventar voll, bleibt die Belohnung offen und wird ausgegeben, sobald Platz vorhanden ist. Die regulären Vertrauens-/Freundschaftsschwellen bleiben unverändert.

### Zusammenhängende Fotos und Funde

Alte Hinweisbilder erhalten einen gemeinsamen Sofortbildrahmen. Das Hüttenmotiv wird aus der vollständigen ursprünglichen Hüttenkulisse gewonnen: keine verschobenen Dachteile oder zusammengeschnittenen Szenen. Falten betreffen ausschließlich das Papier. Bereits gespeicherte defekte Hinweisbilder werden anhand ihres unveränderten Motivschlüssels erneuert; Fundstatus, historische Datierung und Hinweise bleiben erhalten. Bodenbild und aufgegriffenes Bild verwenden denselben fertigen Bildpuffer. Eigene Abzüge erhalten im Tagebuch jeweils eine eigene Seite.

Funde außerhalb von Truhen zeigen nun ebenfalls Gegenstandsbild und tatsächliche Menge. Die Anzeige berücksichtigt Inventargrenzen und zählt Nahrung vor einem etwaigen automatischen Verbrauch mit. Sie zahlt die Gegenstände nicht erneut aus. Die Überschrift lautet außerhalb einer Truhe „Hier gefunden“.

`sofortbild.webp` ist ein neuer, mit image_gen erstellter transparenter Bildbogen mit Kamera und Film. Stilreferenz war der vorhandene Gegenstandsbogen. Seine zwei Alpha-Grenzen und SHA-256 stehen in `atlas-bounds.json`; die anderen Bildbögen werden nicht ersetzt.

Prüfungen: `check-expedition-v18.py` nutzt echte Tasten für Einführung, Kamera, Film, Tierfotos, Menüwechsel, Aufgaben, Tierhilfe, Funde, Bildintegrität und Speichermigration. `check-photo-limits-v18.py` prüft Hafenfotos, Albumgrenze, Löschen, Pause, volle Ressourcen und wartende Belohnungen. `check-desert.py` prüft die ursprünglichen Weltabläufe mit 37 Bildbögen. `check-export-v18.py` prüft ZIP/HTML-Gleichheit, Offlinebetrieb und unveränderte Überlebensregeln.

## Version 19: Orientierung und Seitenrätsel

`orientierung19.js` ergänzt ein Hinweisfeld nur an tatsächlich erreichten Abzweigungen und Kurven. Es verwendet die Richtungen aus `nodeMoves()` und erscheint nicht während Übergängen, Fotos, Rätseln oder Himmelansichten. Ein während des letzten Schritts gepufferter F/J/Leertasten-Druck wird an einer Abzweigung verworfen; dort muss die Richtung bewusst neu gedrückt werden. Gerade Wege behalten ihren Eingabepuffer.

Das Seitenrätsel verwendet unabhängig von den übrigen Schlössern A S D F G / H J K L Ö. Die Aufteilung wird beim ersten Öffnen als `layout19` gespeichert und danach unverändert wiederverwendet. Das behebt auch die nicht deterministische alte Sortierung trotz gleichen Zufallsstartwerts. Gespeicherte alte Buchstaben werden einmalig anhand ihrer Listenposition umgeschrieben; damit bleiben Teilfortschritte bestehen. Die Originaldatei bleibt unverändert. `tagebuch-skizze19.webp` enthält die neu illustrierte ganze Notizbuchseite mit Dromedar, Fennek und Skorpion. Puzzle, Abschlussfenster und Tagebuch nutzen dieselbe zusammenhängende Vorlage. Keine räumlich versetzten Motivteile, keine geometrischen Tierpiktogramme.

Die Bildschirmtastatur lässt sich mit F3 auch im Puzzlefokus anzeigen. Das Layout berücksichtigt dafür die Tastaturhöhe, statt die Tastatur unabhängig vom Schalter immer zu verstecken. Der überholte Kapitel-2-Hinweis am Lagerfeuer und auf dem Startbildschirm wird beim Build ersetzt.


Hinter der Ruine führt nach dem Schnecken- und Wappenschlossrätsel die **Leertaste** durch den offenen Durchgang. Die bereits vorhandenen, angehängten Knoten `RU_WEG` und `REHKRIPPE` behalten ihre IDs. Der Pfad wird beim tatsächlichen Gehen in die Karte eingetragen. Die alte Schutzregel für nur mit Reittieren erreichbare versteckte Bereiche wird für diesen durch das Rätsel geöffneten Pfad ausgenommen, damit Speichern/Laden die Figur nicht zurückversetzt. An der Krippe liegen einmalig drei Portionen Tierfutter; bei vollem Vorrat bleibt der Rest dort liegen. Drei Rehe können einzeln gefüttert oder gestreichelt werden. Jede erfolgreiche Aktion lässt eines weiterziehen. Fotografieren entfernt kein Reh; F5 zeigt einen größeren quadratischen Sucher für die ganze Gruppe. Futter- und Rehfortschritt bleiben gespeichert.

Der Leinenhinweis prüft nun **vor** dem Aufstehen `world.fresh`: Er erscheint nur beim ursprünglichen ersten Erwachen, auch bei älteren Spielständen ohne Tutorial-Merker nicht später beim Fortsetzen oder am nächsten Morgen.

Prüfungen: `check-orientation-v19.py` prüft reale Rätseltasten, alte/neue Teilfortschritte, Skizze, F3 in beiden Rätselarten und Richtungsfelder. `check-ruin-v19.py` spielt fünf Schnecken, das komplette Wappenschloss, den Eingang und Pfad, Futterfund, Szenenfoto und alle drei Rehaktionen durch und lädt anschließend den gespeicherten Spielstand wieder. Es prüft außerdem ersten Start, alten Spielstand ohne Leinenmarker und nächstes Erwachen.

`check-export-v19.py` prüft ZIP/HTML-Gleichheit, Offlinebetrieb sowie die unveränderten Wüstenregeln; die bestehende `check-expedition-v18.py` besteht weiterhin mit Kamera, Aufgaben, Fundanzeigen und Tagebuch. Die Bildschirmtastatur ist zusätzlich bei 1280×900, 1920×1080 und 900×800 geprüft.

## Version 20: aktuelle Aufgaben unter der Karte

`aufgaben20.js` ergänzt eine kompakte Anzeige direkt unter der Karte. Sie zeigt die drei zuletzt hinzugekommenen **offenen** Aufgaben. Ihr Start wird als fortlaufende Nummer in `S.expedition18.taskBoard20.started` gespeichert: Ein Fortschritt ändert die Reihenfolge nicht, und Laden erzeugt keine neuen Einträge. Sobald das Ziel erreicht ist, verschwindet die Zeile; ältere offene Aufgaben rücken nach. Das gilt auch, wenn eine volle Tasche die bereits bestehende Belohnung noch verzögert. Ohne offene Aufgaben bleibt die Anzeige verborgen. F6 führt weiterhin zur vollständigen Übersicht mit abgeschlossenen Erfolgen.

Die Aufgaben beginnen passend zum Spielverlauf: „Kamera finden“ nach dem Rucksackfund mit Film, das erste eigene Foto nach dem Kamerafund, Tieraktionen bei entsprechenden Begegnungen und Vertrauen, Feuermaterial nach dem Entdecken der Hütte bzw. dem Feuerhinweis. Beim Besuch der Ruine kommen fünf Schneckenhäuser hinzu. Gezählt werden aktuelle und bereits eingesetzte Häuser; der einmal erreichte Fortschritt fällt beim Einsetzen nicht zurück. Das bestehende freiwillige Rehziel bleibt bei fünf Fütterungen. Nach Erhalt der Schatzkarte erscheint „Schatzkartenweg erkunden“ und verschwindet am Ziel. Die drei neuen Hinweisziele vergeben keine zusätzlichen Ressourcen; die bisherigen sechs Erfolgsbelohnungen bleiben unverändert.

Beim ersten Öffnen eines älteren Spielstands werden passende Ziele aus Inventar, bisherigen Erfolgen und Ortsmerkern abgeleitet. Bereits vorhandene Kamera, eine geöffnete Ruine und eine besuchte Zelthütte werden dabei berücksichtigt. Aufgaben erfordern keinen neuen Spielstart.

Der Schatzkartenweg war bereits funktionsfähig und wurde deshalb nicht umgebaut: Beim Händler kostet die Karte acht alte Münzen. Beim Verlassen der Stadt wird das bestehende Wegenetz mit dem geöffneten Abzweig `JC1 → ZH` wiederhergestellt. Die neue Aufgabe erklärt im Tagebuch, dass dieser Pfad am Antilopenschädel beginnt. `check-treasure-v20.py` kauft die Karte per Menü-Taste, verlässt die Stadt, läuft den tatsächlichen Weg `STADT → JB3 → JC3 → JC2 → JC1 → ZH`, prüft die Kartenmarkierungen, bestimmt und umgeht unterwegs einen Skorpion, lädt am Ziel den Spielstand und läuft zurück. Der Test prüft auch das Ein- und Ausblenden der Schatzkartenaufgabe.

`check-tasks-v20.py` prüft echte Rucksack-/Kamerafunde und Fütterung, das Limit von drei Einträgen, Reihenfolge, Fortschrittszahlen, eingesetzte Schneckenhäuser, Abschluss mit voller Tasche, einmalige Belohnungen, Fortsetzen und Tagebuchseiten. Die Seitenleiste wird bei drei Aufgaben in mehreren Bildschirmgrößen mit und ohne Bildschirmtastatur geprüft. `check-export-v20.py` prüft das unveränderte Offlineformat; `check-photo-limits-v18.py` prüft weiterhin Fotoalbum, Tastaturbedienung und wartende Belohnungen.


## Version 21: Sturmfahrt

`schiff21.js` ergänzt die eigene Phase `ship` nach dem regulären Einsteigen beim Seemann (Ticket und Abfahrtszeit bleiben Voraussetzung). Der lange Deckabschnitt umfasst 3.670 logische Einheiten, der kürzere Rumpf 1.650. Nach ruhiger Abfahrt steigt der Sturm an; Schiff, Figur und Gegenstände schwanken gemeinsam vor unabhängigem Meereshorizont. F7 schaltet die Bewegung ab. Wellen werden angekündigt und warten auf Ü am Mast. Das späte Einbrechen ist eine inszenierte Fortsetzung, keine Strafe für einen korrekt ausgeführten Sprung. Der Untergang endet am Übergang zur noch auszuarbeitenden Traumsequenz.

F/J bewegen, S springt, D duckt, K kriecht bzw. klettert am Netz, L steigt Leitern und T Treppen, W watet, Z zieht das Tau, I untersucht, Ü hält am Mast fest. Kontextanzeigen zeigen die verfügbaren Aktionen. Eine Taste zum Klettern bewegt jeweils einen Schritt; dieselben Buchstaben werden bewusst in unterschiedlichen Situationen wiederverwendet. F2–F6 und Pause/Enter bleiben erreichbar. F5 fotografiert das echte Schiffsbild ohne eingeblendete Spielanzeigen.

`S.ship21` speichert sichere Position, Hindernisse, Kletterfortschritt, Münzen und Abschnitt. Eine getrennte Auszahlungsliste verhindert doppelte Münzen nach Rücksetzen oder Wiederholung. Rücktaste setzt zum Merkpunkt zurück. `#schiff` und der ZIP-Starter `Schiff-Test.html` verwenden einen eigenen LocalStorage-Schlüssel und verändern den regulären Spielstand nicht.

Fünf neue, mit image_gen illustrierte WebP-Bildbögen liefern Schiffsmaterial, Gegenstände, Figurenposen, Meer und Rumpf. Ihre Ausschnitte stehen in `schiff21-art.json`; sie werden separat als `S21_IMAGE_DATA` eingebettet. Die 37 bisherigen Bildbögen bleiben erhalten. Der Build wartet auf alle fünf neuen Bilder und die bisherigen Bilddaten. Die ursprüngliche 4.7-Datei bleibt unverändert.

`check-ship-v21.py` spielt die gesamte Strecke mit echten Tastendrücken einschließlich aller drei Aufstiege, Waten, Festhalten, Tauziehen, Deckbruch und Untergang. `check-ship-save-v21.py` prüft reguläres Einsteigen, Pause, Menüs, Kamera, Kletterfortschritt nach Laden, einmalige Auszahlung und getrennten Testspielstand.


## Version 21.1: optische Korrektur der Sturmfahrt

Die erste Umsetzung traf die freigegebenen Entwürfe in der Gesamtkomposition nicht ausreichend: schmale Laufkanten, kastenartig wiederholte Schiffswände, Meer hinter dem Kletternetz und glatte geometrische Brecher. Die überarbeitete Darstellung nutzt eine tiefere, durchgehende Deckfläche und seitliche Holzkonstruktion hinter den Aufgängen. Ein zusätzlicher transparenter, mit image_gen nach dem freigegebenen Sturmdeck erstellter Bildbogen liefert Schaumwelle, Deckwasser, strukturelle Holzwand und nassen Plankenbelag. Die Wasseranimation kombiniert gezeichnete Welle und später darüberlaufenden Schaum; Ein weiterer zusammenhängender Bildbogen stellt den Strudel beim Untergang dar und wird langsam bewegt, statt aus wiederholten Einzelwellen zusammengesetzt zu werden. Der Segelbaum verwendet seine tatsächlich illustrierte Form mit Beschlag und Tauen. Die Einsturzbalken im Rumpf reichen bis zur Decke und wirken nicht mehr wie frei schwebende Plattformen. Die dauerhafte Tastenliste im Bild entfällt zugunsten der bestehenden situationsbezogenen Hinweise unter dem Bild.

Die sieben Schiffsbögen werden separat von den 37 bisherigen Bildbögen geladen. Kollisionen, Steuerung, Streckenlänge, Speicherschlüssel und sichere Positionen bleiben gleich. Somit kann ein gespeicherter Schiffsstand fortgesetzt werden. Der komplette Tastaturdurchlauf wird mit `TIPP_SHIP_REVIEW=/workspace/review-ship21-1-full python waldatelier/check-ship-v21.py` aufgezeichnet; `check-export-v21-1.py` prüft Exportgleichheit, die sieben zusätzlichen Bilder, Offlinebetrieb und die bisherigen Wüstenregeln. Die Vorschau zeigt echte Szenen aus diesem Durchlauf, keine neu generierten Gesamtbilder.


## Version 22: Lesbarkeit, Fata Morgana und neuer Schiffsaufbau

`lesbarkeit22.js/css` teilen die Navigation in eine eigenständige größere Karte und daneben Aufgaben sowie Bestände. Die Karte verwendet keine flexible Resthöhe mehr, durch die sie unter langen Vorratslisten schrumpfte. Ein ResizeObserver misst Bedienelemente, Dialog und eingeblendete Tastatur; die Spielhöhe folgt dem tatsächlichen Platz statt der alten pauschalen Abzüge von 500 bzw. 620 Pixeln. F3 funktioniert in der Rätselansicht. Die Größenprüfung deckt 1280×900, 1600×1000 und 1920×1080 mit vollen Bestandsanzeigen und drei Aufgaben ab.

Die Fata Morgana wurde im Renderer bereits auf dem letzten Wegschritt ausgeblendet (`dist>=2`). Sie bleibt jetzt bis `dist>=1` sichtbar. Palmen und Wasser liegen deutlicher auf dem Sandhorizont. Das bestehende Zeitfenster 10–17 Uhr, der feste Standort FM und das Verschwinden beim Erreichen bleiben erhalten. Sandstürme verdecken das Trugbild. `check-layout-v22.py` prüft die F3-Taste, Karten-/Bestandsgrenzen, die Rätselgröße und das Trugbild vor, während und nach dem Zeitfenster sowie am tatsächlichen Standort.

Der Schiffsweg verwendet einen kompakten gemeinsamen Längsraum mit vier Ebenen: Oberdeck nach rechts, Rückweg in der ersten Innenebene nach links, Geschützdeck/Schlafräume nach rechts, Lager/Zellen nach links. Das zentrale erhöhte Deck trägt den mittleren Mast; Leiter und Abstieg über gesicherte Kisten folgen der Skizze. Netzklettern, beidseitig befestigter Hangelbalken, Waten und Kriechstelle liegen im ersten Rückweg. Luken haben eine kurze Abstiegsequenz und führen zum selben Längsabschnitt eine Ebene tiefer. H führt Griff für Griff übers Hindernis. Waten berücksichtigt beide Bewegungsrichtungen. Checkpoints verwenden die Laufrichtung der jeweiligen Ebene. Der Untergang endet weiterhin am Übergang zur noch auszuarbeitenden Traumsequenz.

Drei neue Bildbögen mit Strukturen, vier Innenraumplatten und Aktionsposen bringen die gedämpften Holzfarben, kräftige Reling und nachvollziehbaren Körperhaltungen der abgestimmten Funktionsentwürfe ins Spiel. Sie wurden mit image_gen aus den Funktionsentwürfen erstellt. Der Build lädt zehn Schiffsbildbögen neben den 37 bisherigen. Ein näherer Bildausschnitt vergrößert die Spielfigur, ohne Kollisionsgrößen mit der Darstellung zu vermischen. Die Hintergrundräume behalten ihre Positionen; der Übergang vom Geschützdeck zu den Schlafräumen ist räumlich festgelegt.

`geometry22` übernimmt bestehende Schiffsstände auf sichere Merkpunkte, ohne Geld, Inventar oder Auszahlungsmerker zurückzusetzen. Aktueller Kletter- und Hangelfortschritt wird gespeichert; das Laden während eines Abstiegs beginnt am sicheren Einstieg. Der getrennte Direktstart bleibt unter demselben Testspielstand-Schlüssel erhalten. `check-ship-v22.py` durchläuft mit echten Tasten die komplette Route ohne Rücksetzen; `check-ship-save-v22.py` prüft reguläres Einsteigen, Pause, Foto, Tastaturgrößen, Leiter-/Hangelfortschritt, Münzen, Migration und getrennten Teststart. Die bisherigen Aufgaben- und Belohnungstests bestehen weiter. `check-export-v22.py` prüft Exportgleichheit, alle Bilddaten, Offlinebetrieb und die bisherigen Überlebensregeln.
