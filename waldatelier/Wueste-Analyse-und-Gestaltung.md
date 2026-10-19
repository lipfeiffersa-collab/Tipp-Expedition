# Wüste und Hafenstadt: Bestandsaufnahme vor der Gestaltung

Bestandsaufnahme ursprünglich anhand v10; Münzzuordnung nach ausdrücklicher Nutzerkorrektur in v11 aktualisiert. Grundlage ist Spielversion 4.7. Zielplattform: Computer und Tablets mit angeschlossener physischer Tastatur für Zehnfingerschreiben. Kein Umbau für Touchsteuerung. Die Bestandsaufnahme selbst änderte die Spieldatei nicht; anschließend wurden ausschließlich die angeordneten Truhenbelohnungen in v11 korrigiert.

## Umfang und tatsächliche Orte

Die Wüste enthält 30 Knoten, 35 Verbindungen, 22 benannte Wegmarker, acht besondere Orte, 35 gezeichnete Objektarten und neun Tierarten. `Wuesten-Bestand.json` enthält die vollständigen Register einschließlich Positionen, Materialien, Tierdefinitionen, Preisen und Zeitfenstern.

| Ort | Bestehende Bedeutung und nötige Bildzustände |
|---|---|
| Schachtausgang AH | Ankunft aus der Mine, Leiter und Schacht; kein direkter Rückweg |
| Wadi WADI | Trockenes Flussbett, dunkle feuchte Stelle und Flughühner; fünf Q-Eingaben graben eine Quelle; danach Trinken und Wasser schöpfen |
| Geheimhöhle GH | Zunächst Düne; nach Sandsturm freigelegter Eingang; Steinplatte mit sieben Sandrosen; offener Gang; Felsbild-Schiebepuzzle; geöffneter Raum mit Truhe, Wandbildern und Schlafplatz |
| Felsen im Kakteenfeld KTR | Verwehte Lehmmauer, untersucht, schrittweise abgebaut, Truhe geschlossen/offen; U, acht G/H-Eingaben und G |
| Kakteenfeld KF | Reife Kaktusfeigen beziehungsweise heute abgepflückt; abends Zeltplatz |
| Zelthütte ZH | Versteckter Weg, erst mit gekaufter Schatzkarte begehbar; aktuell reine Ortskulisse ohne eigene Aufgabe oder Belohnung |
| Stadt STADT | Tor zur Hafenstadt, Wechsel zur Seitenansicht |
| Oase OASE | Reales Wasser, Datteln reif/gepflückt, Trinken, Wasser schöpfen, Schatten und abendlicher Zeltplatz |

Die 22 tatsächlich gesetzten Wegmarker sind: Felsbogen, Oscher, Jerichorose, Felsbrocken, Koloquinten, Grasbüschel, lila Blüten, Kamelskelett, Felsplatte, verstreute Knochen, Totholz, Antilopenschädel, Dornbusch, Tamariske, Kaktus, trockener Brunnen, Flimmerstelle, Steinhaufen, Zwillingsfelsen, Schirmakazie, Felsnadel und einzelne Palme. Zusätzliche Zeichenobjekte umfassen kleine Steine, Knochen und Pflanzen sowie Sattel, Rad, Pfahl und Scherben. Nicht jeder definierte Gegenstand ist ein eigener Ortsmarker.

## Verbindlicher regionaler Rahmen: orientalische Wüste

Vom Nutzer ausdrücklich präzisiert: orientalische, keine amerikanische Wüste. Der ursprüngliche Code belegt einen nordafrikanisch geprägten Rahmen durch Oscher, Koloquinten, Tamarisken, Schirmakazien, Dattelpalmen, Wadi und Sahara-Felsbilder; Stadtfundtexte nennen Marokko, Safi und Berber-Kunst. Diese Auswahl ist die Grundlage der künftigen Illustration.

| Pflanze | Tatsächlich im Original definiert |
|---|---|
| Oscher (`oscher`, `oscherK`) | Kommentar nennt **Calotropis procera**; große graugrüne Blätter und grüne kugelige Früchte; eigener Marker bei SC |
| Koloquinten (`koloquinten`, `koloqK`) | Bodennahe Ranken und gelbe Kugelfrüchte; eigener Marker bei SA |
| Jericho-Pflanze (`jericho`) | Kleine trockene Pflanzenkugeln; eigener Marker bei WJ; botanischer Artname nicht festgelegt |
| Tamariske (`tamariske`) | Knorriger Stamm auf einem Sandhügel und fedrige graugrüne Krone; Marker bei JC3 und tatsächlich nutzbarer Schatten |
| Schirmakazie (`akazie`, `akazieK`) | Flache Schirmkrone, Akazien im Wadi und eigener Schattenmarker bei T1; Akazienzweige als Zeltmaterial |
| Dattelpalmen (`palme`) | Oase, Datteln zum Pflücken, eigener Marker bei T3 und Palmwedel als Zeltmaterial |
| Feigenkakteen (`kaktus`, `kakt`, `opuntia`) | Ausdrücklich Opuntien mit flachen eiförmigen Gliedern und roten Früchten; eigener Fund-/Pflückort und Marker; keine amerikanischen Säulenkakteen |
| Dornbüsche, harte Grasbüschel, kleine lila Blüten | Zusätzliche Vegetation und feste Marker, ohne genaue botanische Artzuweisung |

Die Tiere besitzen teilweise lateinische Artnamen und konkrete Zeichnungshinweise, etwa breite tief sitzende Ohren bei der Sandkatze, gedrehte Hörner bei der Mendesantilope und die Schwanzzeichnung beim Fennek. Diese Merkmale sollen bei einer Überarbeitung erhalten bleiben. Als Abweichung vom regionalen Rahmen bleibt der australische Dornteufel ausdrücklich zur inhaltlichen Klärung vermerkt. Keine Flora oder Fauna wurde in dieser Präzisierung geändert.

## Tiere und ihre Rolle

Fennek, Dromedar, Sandkatze, Wüstenspringmaus, Mendesantilope, Flughuhn, Dornteufel, Dickschwanzskorpion und Hornviper. Fotos, Füttern und Tierfreundschaften sind mit dem vorhandenen System verbunden. Die drei Hindernistiere werden zuerst mit I bestimmt. Bei giftigen Tieren kann man warten oder mit vier abwechselnden Schritten ausweichen. Der Dornteufel wird danach als harmlos passierbar. Ein befreundetes Dromedar trägt bis zur nächsten Kreuzung; Flughühner helfen bei der Wassersuche. Der Fennek kann Fundstücke ausgraben.

Für einen naturkundlich glaubwürdigen nordafrikanischen Schauplatz fällt der Dornteufel auf: Er stammt aus Australien. Das sollte vor einer endgültigen Tierillustration geklärt werden; ein Austausch wäre eine inhaltliche Änderung und ist hier nicht vorgenommen worden. Feigenkakteen sind in Nordafrika eingeführt und in Kulturlandschaften plausibel; sie sollten nicht jede Wüstenregion prägen.

## Ereignisse und Überleben

| System | Vorhandene Regel | Gestalterische Konsequenz |
|---|---|---|
| Tageslauf | Ankunft 7 Uhr, Aufwachen im Zelt 6 Uhr, Herberge 7 Uhr; Morgen-, Tages-, Abend- und Nachtlicht | Gleiche Landschaft und Standorte unter verändertem Licht, keine zufälligen Panoramawechsel |
| Mittagshitze | 12 bis 15 Uhr; Wasserverbrauch außerhalb von Schatten ×2, mit Kopfschutz ×1,5, im Schatten ×1 | Erkennbarer Schatten unter den tatsächlich nutzbaren Akazien/Felsen und an Wasserstellen |
| Schattenrast | Ü überspringt zur Zeit 15 Uhr und beendet die Hitze des Tages | Zustand und Zeitwechsel deutlich zeigen, ohne neue Wasserquelle zu erfinden |
| Durst und Hunger | Wasser- und Nahrungsreserven laufen über reale Spielzeit ab; ein Tropfen bzw. eine Nahrungsportion reicht regulär fünf Minuten | Klare Vorratsanzeige und erkennbare Wasser-/Nahrungsobjekte |
| Erschöpfung | Bereits Durst ODER Hunger reicht; zwei Schritte, dann Ü zum Weiterkämpfen | Kein eigener wählbarer Überlebensmodus und kein implementierter Tod durch Verdursten; Zustand muss verständlich bleiben |
| Sandsturm | Zwei geplante Termine pro Tag außerhalb der Mittagshitze; zwölf Sekunden Warnung, E zum Eingraben, danach fünf Ü-Treffer | Vorwarnung, Schutzlage, Trefferfenster und Ende brauchen zusammengehörige lesbare Zustände |
| Sturmfolgen | Unterschlupf überstanden: gleicher Ort; Warnung verpasst: Versetzung zu einer vorhandenen Kreuzung; Spuren verwehen, neue Funde erscheinen, Geheimhöhle wird freigelegt | Karte, Bodenzeichen, neuer Höhleneingang und Fundstücke müssen auf dasselbe Ereignis reagieren |
| Fata Morgana | 10 bis 17 Uhr, gezielt an FM und den Zugängen; verschwindet beim Näherkommen und ist kein Trinkwasser | Nur an diesem Ort und bei passenden Bedingungen; keine echten Wasserflächen in beliebigen Hintergründen |
| Himmel lesen | O zeigt je nach Tageszeit Polarstern, Sturmwolken, Flughühner oder Sonne; Hinweise auf Himmels- bzw. Wasserrichtung | Hinweise müssen zur Blickrichtung passen |
| Zelt | 10 Palmwedel, 6 Akazienzweige, 4 Stoffstücke; ab 18 Uhr an Oase/Kakteenfeld; wiederverwendbar | Materialsuche und fertiges Lager gehören zusammen; aktuell kein sichtbarer Aufbauablauf oder bleibender Nachtlagerzustand |

Der Sandsturm ist eine Lernaufgabe mit Zeitdruck: Das Trefferfenster ist 22 Einheiten breit, der Marker bewegt sich mit 150 Einheiten pro Sekunde. Daraus ergeben sich etwa 0,15 Sekunden je Durchgang durch das Trefferfenster. Vor der grafischen Verfeinerung sollte die Fairness für Lernende geprüft werden; schönere Effekte dürfen den Marker nicht verdecken.

## Rätsel- und Ereigniskette

Sandsturm → Düne verschwunden → sieben Sandrosen einsetzen → Steinplatte öffnet → Felsbild mit 4 Zeilen und 6 Spalten → 23 verschiebbare Steine plus eine Lücke → Geheimraum → acht alte Münzen und geschützter Schlafplatz.

Das Puzzle ist durch legale Züge gemischt und verwendet Buchstaben der benachbarten Steine. Bild, Buchstaben, leere Stelle, Eingaben und gespeicherte Zugfolge müssen gemeinsam erhalten bleiben. Die Wandbilder zeigen Giraffe, Elefant, Krokodil und Rind als Hinweis auf die früher grüne Sahara. Ein neues hübsches Felsbild allein würde diese Interaktion nicht ersetzen.

## Hafenstadt

Fünf feste Anlaufstellen auf derselben Seitenansicht: Stadttor, Händler, Schiffsstand/Verkäuferin, Seemann am Steg und Herberge. Die Figur bewegt sich mit F/J; Leertaste öffnet die jeweilige Interaktion, Auswahlmenüs verwenden zugeordnete Buchstabentasten.

- Händler: Schatzkarte, Kopfschutz, Wasser, Öl, größerer Wasserbeutel, Tausch alter Münzen und Verkauf von Fundstücken. Für Rätsel benötigte Sandrosen werden beim Verkauf zurückgehalten. Es gibt eine Warnung, wenn ein Kauf das Gold unter den Ticketpreis drückt.
- Verkäuferin: Schiffsticket und fünf Sammelobjekte für das Tagebuch: Flaschenschiff, Teekanne, Tonschale, Teppich und Messinglaterne.
- Seemann: erster Erinnerungsdialog, Fahrplan, Warten, Ticketkontrolle und Einschiffen.
- Herberge: zehn Gold pro Nacht, nächster Morgen 7 Uhr.
- Abfahrten: 8, 12 und 18 Uhr; Einsteigen jeweils in der halben Stunde davor. Ticketpreis: 20 Gold.
- Die Schiffsfahrt selbst ist ausdrücklich noch ein Platzhalter. Nach dem Kapitelabschluss kann man mit zurückgegebenem Ticket in die Stadt zurückkehren.

Die Stadt besitzt bereits Parallaxe, Tages-/Nachtlicht und beleuchtete Fenster. Diese räumliche Anordnung sollte erhalten bleiben. Häuser, Marktstände, Figuren, Auslagen, Hafen, Schiff, Innenraum/Übernachtung, Menüs und kleine Fundbilder brauchen denselben Illustrationsstil.

## Münzen und besondere Fundstücke: Zuordnung in der aktuellen Datei

Die Datei verwendet zwei getrennte Bestände: normale Goldmünzen (`S.coins`) und alte Münzen (`S.old`). Die ursprüngliche v10 ordnete beide nachfolgend korrigierten Truhen ausschließlich normalem Gold zu. Nach Nutzerkorrektur gilt ab v11 diese Tabelle:

| Quelle | Belohnung im geprüften Code |
|---|---|
| Verschütteter Minenstollen mit Lore, nach Geröllabbau | 10 normale Münzen und ein Opal |
| Geheimer Raum in der Mine, Truhe hinter der Steintür | 5 alte Münzen, 5 Goldmünzen, ein Diamant, Nahrung und Tierfutter |
| Spinnenraum in der Mine | Schlüssel und Tierfutter |
| Zweiter verschütteter Minenraum mit Balken | Tierfutter und Honig |
| Kakteenfeld, Truhe hinter der Lehmmauer | 3 alte Münzen und 7 Goldmünzen |
| Höhle unter der Sanddüne, hinter dem Felsbildrätsel | 8 alte Münzen |

Die Nutzerkorrektur wurde in v11 umgesetzt. Die Münzen nach dem Geröllabbau bei der Lore sind weiterhin 10 normale Goldmünzen; geändert wurde ausschließlich die Geheimraumtruhe hinter der Schlüsseltür.

### Seltene Steine und Fossilien

| Fundstück | Fundweg |
|---|---|
| Amethyst-Druse | Kristallnische in der Mine, mit Spitzhacke ein Stück herausbrechen |
| Opal | Nach dem Geröllabbau im Minenstollen mit Lore |
| Diamant | Geheimraumtruhe in der Mine |
| Sandrose | Auf Wüstenwegen; sieben werden für die Steinplatte der Geheimhöhle benötigt |
| Fossiler Haifischzahn, Ammonit, Trilobit | U-Suche an bestimmten felsigen Wüstenkreuzungen; einmal pro Ort und Tag, mit Zufallsfund |
| Fulgurit, Wüstenglas, Meteorit | Nach einem Sandsturm auf Wegen freigelegt |
| Verschiedene Fossilien und besondere Steine | Zusätzlich durch den befreundeten Fennek auffindbar |

Alle diese Fundarten besitzen Wissenstexte im Feldtagebuch. Sie benötigen unterscheidbare Formen auf dem Boden, im Inventar und im Tagebuch. Amethyst, Opal und Diamant sind aktuell Sammelstücke und stehen nicht in der Verkaufsliste des Händlers. Die genannten Wüstenfossilien/-steine können dort für normale Goldmünzen verkauft werden; ein Exemplar jeder Sorte und nötige Sandrosen werden zurückgehalten. Ein Rücktausch von normalem Gold in alte Münzen ist derzeit nicht implementiert.

## Bestätigte offene Punkte vor dem Gestaltungsumbau

1. **Größerer Wasserbeutel:** Die frühere Feststellung einer nicht finanzierbaren Verbesserung war eine Folge der falschen Truhenbelohnungen in 4.7/v10. Mit der Nutzerkorrektur ab v11 gibt es 5 alte Münzen in der Mine, 3 in der Kakteen-Truhe und 8 unter der Sanddüne, insgesamt 16. Der größere Beutel kostet 12, die Schatzkarte 8 alte Münzen. Beide zusammen kosten somit 20; dies ist eine verbleibende Frage zur Spielökonomie, keine weitere ungefragt vorgenommene Änderung.
2. **Schatzkarten-Ziel:** Der freigeschaltete Weg führt aktuell zu einer verlassenen Zelthütte ohne eigene Aufgabe oder Belohnung. Die Funktion der Karte ist technisch vorhanden, die dort erwartbare Aufgabe noch offen.
3. **Zeltbau:** Materialverbrauch und Tageswechsel funktionieren, Aufbau und geschütztes Nachtlager werden derzeit nur im Text übersprungen. Eine ruhige kurze Darstellungssequenz wäre möglich, ohne ein zusätzliches Pflicht-Minispiel einzuführen.
4. **Sturm-Timing:** Das enge Ü-Fenster ist eine eigene Schwierigkeitsfrage, keine reine Grafikfrage.
5. **Fauna:** Der Dornteufel passt geografisch nicht zum nordafrikanischen Rahmen.
6. **Kapitelende:** Schiff und Hafen können fertig gestaltet werden, die anschließende Fahrt ist noch nicht spielbar.

Preise und Tierarten bleiben erhalten. Die beiden Truhenbelohnungen wurden anschließend nach ausdrücklicher Nutzeranweisung in v11 korrigiert.

## Gestaltungsgrundlage und nächster sinnvoller Umfang

Den bestätigten ruhigen 2D-Illustrationsstil fortsetzen: zusammenhängende Farbpalette aus Sand/Ocker, mattem Grün und zurückhaltendem Blau; mittlere Detaildichte, natürliche Tieranatomie, begehbare Wege klar heller oder ruhiger als ihr Rand. Wüste darf je nach tatsächlicher Region anders aussehen: Dünen, Kies-/Felswüste, Wadi, Oasenrand und Stadtzugang. Diese Zonen folgen benachbarten Knoten des vorhandenen Netzes; ein Schritt darf nicht zufällig Meer, Gebirge oder andere Vegetation austauschen.

Zuerst eine normale Abzweigung mit Ortsmarker und eine zweite Ansicht desselben Ortes bei Hitze bzw. aufziehendem Sturm als Stil-/Lesbarkeitsprobe. Danach Ortszustände und Rätsel, anschließend Tiere/Funde/Inventar/Tagebuch und die Stadt. Damit bleiben Stil, regionale Kontinuität und Spielzustände gemeinsam überprüfbar. Ein größerer Umbau oder neue Bildassets sind in dieser Bestandsaufnahme noch nicht umgesetzt.

## Durchgeführte Funktionsprüfungen

Isolierter Browser-Spielstand, aktuelle eigenständige v10: Wasserquelle mit fünf Q-Eingaben, W/G am Wadi; Kakteenmauer mit U und acht G/H-Eingaben, Truhe; Hitzeverbrauch ohne/mit Kopfschutz und im Schatten, Rast bis 15 Uhr; Sturm-Erfolg und Versetzung nach verpasster Warnung, Spurenlöschung und Höhlenfreilegung; sieben Sandrosen und legaler Schiebepuzzlezug mit Rückkehr; Zelt bauen und erneut verwenden mit Z; Erschöpfung bereits bei Durst; zeit- und ortsgebundene Fata Morgana; Schatzkartenkauf und danach tatsächlich offener Weg zur Zelthütte; Ticketkauf, Einschiffen und Rückkehr in die Stadt mit zurückgegebenem Ticket. Keine JavaScript-Fehler in diesen Prüfungen. Einige Ereigniszustände wurden gezielt vorbereitet bzw. ihre Handler aufgerufen; dies ist kein vollständiger manueller Durchlauf aller Wüstenwege oder eine vollständige Balanceprüfung.

## Umsetzung in Revision 13

Der Nutzer hat den Austausch des australischen Dornteufels durch die nordafrikanische Dornschwanzagame ausdrücklich bestätigt. Der interne Schlüssel `dornteufel` bleibt wegen bestehender Tierpositionen und Spielstände erhalten; sichtbarer Name, lateinischer Name, Beschreibung, Illustration und Tagebuch wurden auf **Dornschwanzagame / Uromastyx acanthinura** umgestellt. Frühere Dornteufel-Fotos werden als solche im Tagebuch archiviert. Übernommener Fotofortschritt erhält ein ausdrücklich gekennzeichnetes Bestandsbild der Agame, bis eine neue Aufnahme entsteht. Das alte Foto wird niemals als Aufnahme der neuen Art ausgegeben.

`wueste.js` zeichnet die offenen Wege aus den tatsächlichen Ausgängen, Blickrichtungen und Entfernungen. Ein gemeinsamer Himmel, niedrige Dünenzüge und Sand-/Kiesflächen verbinden die Strecken. Es gibt keinen zufälligen Wechsel zwischen fertigen Panoramen. Ausschließlich feste besondere Orte besitzen eigene Ansichten: Schachtausgang, Oase, Wadi, verdeckte Düne, freigelegter Eingang, geheimer Raum, Kakteenfelsen und Zelthütte. Stadt und Kakteenfeld setzen sich aus eigenständigen Motiven zusammen. Marker behalten ihre ursprünglichen Ecken und Spielpositionen. Die 35 Objektbezeichner sind vollständig zugeordnet; der Pfahl mit Stoff wird als eigener Umriss gezeichnet.

Neun neue Bildbögen: `wuestenmaterial` (Sand, Pfad, Kies, Kalkstein), `wuestenflora` (12 Pflanzenmotive), `wuestenmarker` (12 Ortsrequisiten), `wuestenfunde` (25 Motive einschließlich Aufbauzuständen), `wuestentiere` (9 Arten), `wuestenorte` (8 feste Ortsansichten), `hafenbauten` (8 Gebäude/Figuren/Boote), `hafenpanorama` und `saharafelsbild`. Die Pflanzen-, Objekt- und Tierbögen erhalten individuelle Zuschnittgrenzen. Pflanzen/Gebäude werden beim Laden zusätzlich von kleinen getrennten Fragmenten benachbarter Atlaszellen isoliert. Tierkörper und mehrteilige Fundstücke werden nicht auf die größte Komponente reduziert.

Wasser erscheint nur an Oase und ausgegrabener Wadi-Quelle. Die drei Wadi-Vögel markieren die dunkle Grabstelle. Die Fata Morgana verwendet weiterhin ausschließlich den vorgesehenen FM-Ort und das ursprüngliche Zeitfenster. Fußspuren folgen `edge.trail`; Sturmfolgen, Kartenerkundung und versteckte Wege bleiben Aufgaben des ursprünglichen Spielcodes.

Die Lehmmauer zeigt fortschreitenden Abbau; sieben Sandrosen erscheinen in den sieben Mulden. Das Felsbild verwendet weiterhin die ursprünglichen 24 Plätze, 23 Buchstaben und legalen Schiebebewegungen, mit einem neuen hochaufgelösten Sahara-Tierbild. Der geheime Raum enthält Felsbild, Schlafmatten und zustandsabhängige Truhe. Zeltbau zeigt Gestell und bespanntes Lager, bevor einmalig die bestehende Schlaf-/Materialfunktion läuft. Leertaste schließt die Sequenz ab; Rücktaste bricht den Aufbau ohne Material- oder Nachtverbrauch ab. Die Spieluhr hält während des Aufbaus an, damit kein Sturm mitten in die Schlafumschaltung fällt. Reduzierte Bewegung wird respektiert. Futter- und Streichelsequenzen verwenden die neuen Tierbilder. Gefährliche Tiere bleiben Beobachtungs-/Ausweichaufgaben.

Der Sandsturm nutzt dieselbe Warnzeit, Trefferzone, Bewegungsgeschwindigkeit und fünf Ü-Treffer. Nur seine Darstellung ist erneuert; die Zeitschritte werden genau einmal pro Bild verarbeitet. Die neue Anzeige trennt Warnung, Eingraben und Zielmarkierung. Mittagshitze und Nachtlicht verlaufen weich über die gesamte Bildhöhe.

Die Hafenstadt behält ihre Seitenansicht, Kamera, fünf Stationskoordinaten, Gehschritte und Menüs. Ein durchgehendes Panorama trägt Tor, zwei Marktstände, Seemann, Steg, Schiff und Herberge an den tatsächlichen Interaktionsorten. Der Charakter verwendet die bereits illustrierte Spielfigur aus dem Nachtpfad. Preise und Abfahrten bleiben unverändert; die anschließende Schiffsreise bleibt wie bisher in Arbeit.

### Prüfung

`check-desert.py` prüft alle 30 Knoten in vier Blickrichtungen und alle 35 Kanten in beiden Richtungen, echte G-Fundaufnahme, fünf Q-Grabaktionen und Wasserschöpfen, U und acht G/H-Aktionen an der Lehmmauer, einmalige 3/7-Münzauszahlung, fünf echte Ü-Sturmtreffer, erhaltene Kartenerkundung bei verwehten Spuren, sieben Sandrosen, Buchstabeneingabe und Puzzleabschluss, acht alte Münzen in der Geheimhöhle, Zeltaufbau mit einmaligem Materialverbrauch, neun Tieransichten/Fotobereiche, Füttern/Streicheln, übereinstimmende Boden-/Albumfotos, fünf Hafenstationen, Händlermenü und Gehen sowie Migration mit unveränderten Welt-IDs, Positionen und Währungen. Browser: Chromium über HTTP, zusätzlich separate Offline-Exportprüfung. Kein Anspruch auf vollständiges manuelles Durchspielen jeder Kombination von Tageszeit und Tierfreundschaft.
