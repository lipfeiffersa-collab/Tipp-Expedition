# Waldatelier 12 – Illustrationsfassung für Tipp-Expedition 4.7

Die verbindliche Stilvorlage ist `Stilreferenz-T-Abzweigung.png`: die vom Nutzer bestätigte handgezeichnete Waldillustration mit mittlerer Detaildichte und einer quer verlaufenden T-Abzweigung. `Stilreferenz.json` dokumentiert die dazu erzeugten Motive. Die früheren Versuche sind keine Gestaltungsreferenz für Folgeänderungen.

## Bauen und weitergeben

Im Repository: `python waldatelier/build.py`. Benötigt Python 3 und die eingebetteten WebP-Quelldateien. Ergebnis: `Tipp-Expedition-4.7-Waldatelier.html`.

`python waldatelier/export.py` erzeugt unter `/workspace/shared/downloads` die eigenständige `Wald-Spiel-v12.html` und `Wald-Spiel-v12.zip`. Die ZIP enthält absichtlich wieder `Wald-Spiel.html`, damit bestehende lokale Dateipfade beibehalten werden können. Alle einundzwanzig verwendeten Bildbögen sind eingebettet. Standardmäßig enthält der Export die vollständigen aktuellen Motive. Optional kann `--previous` vier unveränderte komprimierte Motive übernehmen; für die Nahaufnahmen wird die vollständige Auflösung empfohlen.

Vor dem Ersetzen einer vorhandenen Datei eine Kopie behalten. Für vorhandene lokale Spielstände Dateiname, Speicherort und Browser beibehalten; Browserdaten nicht löschen. Gespeicherte Fotos bleiben erhalten, neue Fotos verwenden die aktuelle Waldzeichnung.

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
