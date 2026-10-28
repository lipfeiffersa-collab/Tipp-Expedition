"""Export a standalone, offline HTML game and a ZIP with the stable inner filename."""
from pathlib import Path
import json,zipfile,argparse
root=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,default=Path('/workspace/shared/downloads'));parser.add_argument('--previous',type=Path,default=None);args=parser.parse_args()
def images(s):
 a=s.index('const F_IMAGE_DATA=')+len('const F_IMAGE_DATA=');data,end=json.JSONDecoder().raw_decode(s[a:]);return a,a+end,data
source=(root.parent/'Tipp-Expedition-4.7-Waldatelier.html').read_text();a,z,data=images(source)
# Reuse only the already-compressed, unchanged specimen/inventory/night sheets.
# Never replace the newly illustrated plants, props, locations or ground with old sheets.
if args.previous and args.previous.exists():
 previous=images(args.previous.read_text())[2]
 for key in ['waldtiere','gegenstaende','baeume','nachtpfad']:
  if key in previous:data[key]=previous[key]

assert len(data)==37 and {'grundwald','orte5a','orte5b','zustaende5','wegmaterial','sofortbild'}<=data.keys()
html=source[:a]+json.dumps(data,separators=(',',':'))+source[z:]
args.output.mkdir(parents=True,exist_ok=True);(args.output/'Wald-Spiel-v23.html').write_text(html)
with zipfile.ZipFile(args.output/'Wald-Spiel-v23.zip','w',zipfile.ZIP_DEFLATED,compresslevel=6) as arc:
 arc.writestr('Wald-Spiel.html',html)
 arc.writestr('Schiff-Test.html','<!doctype html><html lang="de"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=Wald-Spiel.html#schiff"><title>Schiffsstart</title><a href="Wald-Spiel.html#schiff">Schiff mit eigenem Testspielstand starten</a></html>')
 arc.writestr('Start.txt',"""Tipp-Expedition – Version 23

ZIP vollständig entpacken. Wald-Spiel.html öffnet das ganze Spiel. Schiff-Test.html startet direkt auf dem Schiff mit getrenntem Testspielstand. Alle Bilder sind eingebettet; keine Internetverbindung nötig.

Neu in Version 23: An erreichten Kreuzungen und Kurven liegen kleine schwarze Kreise mit F, J und dem Leertastensymbol auf den jeweiligen Wegen. An besonderen Orten wie der Oase und während des Gehens erscheinen diese Kreise nicht. Das große Abbiegefenster entfällt.

Am Wüsteneingang (Schacht mit alter Leiter) führt L zurück in die gespeicherte Mine. Eine vergessene Spitzhacke liegt weiter im alten Stollen. Am Minenausgang führt L wieder in dieselbe Wüste zurück. Karten, Funde, Rätsel, Münzen, Inventar sowie Wüstentag und Uhrzeit bleiben erhalten.

Karte und Tastatur: Die Karte hat neben Aufgaben und Beständen einen eigenen Bereich. F3 schaltet die Bildschirmtastatur auch in Rätseln ein/aus. Die Spielansicht richtet sich nach dem tatsächlichen Platzbedarf der Bedienelemente. Die Fata Morgana ist auf dem vorgesehenen Weg zwischen 10 und 17 Uhr bis zum letzten Annäherungsschritt sichtbar und verschwindet am Standort. Während eines Sandsturms ist sie nicht sichtbar.

Schiff: F/J nach links/rechts, S springen und morsche Fässer zerbrechen, D ducken, K kriechen oder am Netz klettern, L Leiter hinauf oder durch eine Luke hinunter, T Treppe, H hangeln, W waten, Ü am Mast festhalten, I untersuchen, Z am Tau ziehen. Die jeweilige Aktion wird eingeblendet. Pro Tastendruck folgt ein Schritt, Griff oder Zug. Rücktaste setzt zum letzten Merkpunkt zurück, ohne Münzen doppelt auszuzahlen.

Der Hauptweg führt über das niedrige Segel und Fässer auf die Leiter zum erhöhten Deck am mittleren Mast. Nach der Welle und den beschädigten Planken geht es über Kisten wieder hinunter. Erst später bricht das Deck ein. Unter Deck führt der Weg nach links, mit Netz, Hangeln, Wasser und Kriechstelle; L führt eine Ebene hinunter zum Geschützdeck und den Schlafräumen, wo es nach rechts weitergeht. Eine weitere Leiter führt ins Lager mit Zellen, Flaschenzug und einströmendem Wasser. Dort geht es wieder nach links bis zum Untergang. Die Traumsequenz wird anschließend ausgearbeitet.

F2 Inventar, F3 Tastatur, F4 Tagebuch, F5 Kamera, F6 Aufgaben. F7 schaltet das Schaukeln ein/aus. Esc Pause, Enter weiter. Gesicherte Positionen, Leiter- und Hangelfortschritt bleiben beim Laden erhalten. Ältere Schiffsstände werden auf einen passenden sicheren Merkpunkt des neuen Aufbaus übernommen; Inventar und Münzen bleiben erhalten.

Vorhandenen lokalen Spielstand weiterverwenden: dieselbe HTML-Datei unter demselben Namen am selben Speicherort ersetzen und denselben Browser verwenden. Vorher die bisherige Datei sichern. Browserdaten nicht löschen.
""")

with zipfile.ZipFile(args.output/'Wald-Spiel-v23.zip') as arc:assert arc.testzip() is None and arc.read('Wald-Spiel.html')==html.encode()
for name in ['Wald-Spiel-v23.html','Wald-Spiel-v23.zip']:(args.output/name).chmod(0o644)
print('Export:',len(html.encode()),'bytes HTML;', (args.output/'Wald-Spiel-v23.zip').stat().st_size,f'bytes ZIP; {len(data)} embedded sheets.')
