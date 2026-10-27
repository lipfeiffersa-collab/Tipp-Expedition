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

assert len(data)==36 and {'grundwald','orte5a','orte5b','zustaende5','wegmaterial'}<=data.keys()
html=source[:a]+json.dumps(data,separators=(',',':'))+source[z:]
args.output.mkdir(parents=True,exist_ok=True);(args.output/'Wald-Spiel-v17-1.html').write_text(html)
with zipfile.ZipFile(args.output/'Wald-Spiel-v17-1.zip','w',zipfile.ZIP_DEFLATED,compresslevel=6) as arc:
 arc.writestr('Wald-Spiel.html',html)
 arc.writestr('Start.txt','Tipp-Expedition 4.7 – Waldatelier 17.1\n\nZIP vollständig entpacken, dann Wald-Spiel.html im Browser öffnen. Alle Bilder sind eingebettet; es werden keine Bilder aus dem Internet geladen.\n\nVersion 17.1: Z öffnet die Zeltaktion in der Wüste. An der Oase oder im Kakteenfeld kann das Zelt jetzt auch tagsüber aus 10 Palmwedeln, 6 Akazienzweigen und 4 Stück Stoff aufgebaut werden. Fehlt Material oder ein geeigneter Platz, zeigt Z die Voraussetzungen. Ab 18 Uhr ist eine Übernachtung mit Nacht-/Morgenübergang möglich. Der Aufbau lässt sich mit Leertaste abschließen oder mit Rücktaste abbrechen. Material wird nur beim ersten fertigen Zelt verbraucht. Beim Weitergehen wird es eingepackt und kann erneut aufgebaut werden. Die Desktopaufteilung, F2-Inventar und F3-Bildschirmtastatur aus Version 17 bleiben erhalten.\n\nDie Karte zeichnet Wege ab ihrem Fund auf. Die Kartenhilfen befreundeter Vögel zeigen weiterhin versteckte Orte und heutige Fundstücke.\n\nZum Weiterverwenden eines vorhandenen lokalen Spielstands dieselbe HTML-Datei unter demselben Namen am selben Speicherort ersetzen und denselben Browser verwenden. Vorher eine Kopie der alten Datei behalten. Browserdaten nicht löschen. Tierfotos bleiben erhalten; gefundene alte Hinweisfotos werden als unzerschnittene Bilder erneuert. Ältere pauschale Wüsten-Spurmarkierungen werden nicht als belegte Gehstrecke übernommen; ab jetzt entstehen genaue Spuren.\n')
with zipfile.ZipFile(args.output/'Wald-Spiel-v17-1.zip') as arc:assert arc.testzip() is None and arc.read('Wald-Spiel.html')==html.encode()
for name in ['Wald-Spiel-v17-1.html','Wald-Spiel-v17-1.zip']:(args.output/name).chmod(0o644)
print('Export:',len(html.encode()),'bytes HTML;', (args.output/'Wald-Spiel-v17-1.zip').stat().st_size,f'bytes ZIP; {len(data)} embedded sheets.')
