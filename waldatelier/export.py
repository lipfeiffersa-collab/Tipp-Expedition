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
args.output.mkdir(parents=True,exist_ok=True);(args.output/'Wald-Spiel-v18.html').write_text(html)
with zipfile.ZipFile(args.output/'Wald-Spiel-v18.zip','w',zipfile.ZIP_DEFLATED,compresslevel=6) as arc:
 arc.writestr('Wald-Spiel.html',html)
 arc.writestr('Start.txt','Tipp-Expedition 4.7 – Waldatelier 18\n\nZIP vollständig entpacken, dann Wald-Spiel.html im Browser öffnen. Alle Bilder sind eingebettet; es werden keine Bilder aus dem Internet geladen.\n\nVersion 18: Symbolleiste für Inventar (F2), Bildschirmtastatur (F3), Feldtagebuch (F4), Kamera (F5) und freiwillige Entdeckeraufgaben (F6). Die Polaroidkamera nutzt Filme mit je 8 Aufnahmen. Im Sucher bewegen F/J und E/D den quadratischen Ausschnitt; Leertaste fotografiert, R wechselt einen leeren Film und Escape schließt ohne Aufnahme. K fotografiert ein Tier direkt oder öffnet den Sucher. Fotos, Ersatzfilme, Tierfutter und Münzen stehen in der Statusspalte. Neue Gegenstände und die Hundeleine erhalten kurze Erklärfenster. Eigene Sofortbilder und freiwillige Aufgaben haben eigene Tagebuchreiter. Alte Hinweisfotos bleiben zusammenhängende Motive; gespeicherte fehlerhafte Motive werden erneuert. Auch Funde außerhalb von Truhen zeigen Gegenstand und tatsächliche Menge. Belohnungen werden nur einmal vergeben und sperren keinen Weg.\n\nDie Karte zeichnet Wege ab ihrem Fund auf. Die Kartenhilfen befreundeter Vögel zeigen weiterhin versteckte Orte und heutige Fundstücke.\n\nZum Weiterverwenden eines vorhandenen lokalen Spielstands dieselbe HTML-Datei unter demselben Namen am selben Speicherort ersetzen und denselben Browser verwenden. Vorher eine Kopie der alten Datei behalten. Browserdaten nicht löschen. Tierfotos bleiben erhalten; gefundene alte Hinweisfotos werden als unzerschnittene Bilder erneuert. Ältere pauschale Wüsten-Spurmarkierungen werden nicht als belegte Gehstrecke übernommen; ab jetzt entstehen genaue Spuren.\n')
with zipfile.ZipFile(args.output/'Wald-Spiel-v18.zip') as arc:assert arc.testzip() is None and arc.read('Wald-Spiel.html')==html.encode()
for name in ['Wald-Spiel-v18.html','Wald-Spiel-v18.zip']:(args.output/name).chmod(0o644)
print('Export:',len(html.encode()),'bytes HTML;', (args.output/'Wald-Spiel-v18.zip').stat().st_size,f'bytes ZIP; {len(data)} embedded sheets.')
