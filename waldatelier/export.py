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
args.output.mkdir(parents=True,exist_ok=True);(args.output/'Wald-Spiel-v21.html').write_text(html)
with zipfile.ZipFile(args.output/'Wald-Spiel-v21.zip','w',zipfile.ZIP_DEFLATED,compresslevel=6) as arc:
 arc.writestr('Wald-Spiel.html',html)
 arc.writestr('Schiff-Test.html','<!doctype html><html lang="de"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=Wald-Spiel.html#schiff"><title>Schiffsstart</title><a href="Wald-Spiel.html#schiff">Schiff mit eigenem Testspielstand starten</a></html>')
 arc.writestr('Start.txt',"""Tipp-Expedition – Version 21: Sturmfahrt

ZIP vollständig entpacken. Wald-Spiel.html öffnet das vollständige Spiel. Alle Bilder sind eingebettet; keine Internetverbindung nötig.
Schiff-Test.html öffnet das Schiff direkt mit einem eigenen Testspielstand. Der normale Spielstand bleibt davon getrennt. Im Startmenü auf Spielen klicken.
Im regulären Spiel beginnt die Fahrt beim Seemann mit dem Schiffsticket zur Abfahrtszeit.

F/J: links/rechts. S: springen; zerbrechliche Fässer von oben treffen. D: ducken. K: kriechen bzw. am Wantennetz klettern. L: Leiter. T: Treppe. W: waten. Ü: am Mast festhalten/überleben. Z: Tau ziehen. I: untersuchen/identifizieren.
Aktionen werden an den passenden Stellen eingeblendet. Mehrfaches Drücken steigt Sprosse für Sprosse oder zieht das Tau weiter. Wellen warten auf das Festhalten; keine knappe Reaktionsfrist. Rücktaste setzt zum letzten Merkpunkt zurück, ohne gesammelte Münzen zu verdoppeln.
F2 Inventar, F3 Bildschirmtastatur, F4 Tagebuch, F5 Kamera, F6 Aufgaben. F7 schaltet das Schaukeln aus/ein. Esc pausiert, Enter setzt fort. Beim erneuten Öffnen wird die letzte sichere Position fortgesetzt.

Der längere Abschnitt an Deck führt über niedrigen Segelbaum, übergespülte Planken, Fässer, Leiter, Treppe und Wantennetz. Erst spät bricht das Deck ein. Im kürzeren Schiffsrumpf folgen Kriechstellen, Ladung und eindringendes Wasser. Der Untergang endet am Übergang zur noch auszuarbeitenden Traumsequenz.

Vorhandenen lokalen Spielstand weiterverwenden: dieselbe HTML-Datei unter demselben Namen am selben Speicherort ersetzen und denselben Browser verwenden. Vorher die alte Datei sichern. Browserdaten nicht löschen.
""")

with zipfile.ZipFile(args.output/'Wald-Spiel-v21.zip') as arc:assert arc.testzip() is None and arc.read('Wald-Spiel.html')==html.encode()
for name in ['Wald-Spiel-v21.html','Wald-Spiel-v21.zip']:(args.output/name).chmod(0o644)
print('Export:',len(html.encode()),'bytes HTML;', (args.output/'Wald-Spiel-v21.zip').stat().st_size,f'bytes ZIP; {len(data)} embedded sheets.')
