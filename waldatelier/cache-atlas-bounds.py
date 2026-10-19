"""Cache verified sprite bounds after a browser load; build.py ignores entries for changed images."""
from pathlib import Path
import argparse,hashlib,json,time
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html');args=parser.parse_args()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page();page.set_default_timeout(120000);start=time.monotonic();page.goto(args.url,wait_until='domcontentloaded',timeout=120000);page.wait_for_function('fReady')
 bounds=page.evaluate('Object.fromEntries(Object.entries(F_ATLAS).map(([key,a])=>[key,a.bounds]))')
 hashes=page.evaluate('''async()=>Object.fromEntries(await Promise.all(Object.entries(F_IMAGE_DATA).map(async([key,src])=>{const bytes=await(await fetch(src)).arrayBuffer(),hash=await crypto.subtle.digest('SHA-256',bytes);return [key,Array.from(new Uint8Array(hash)).map(v=>v.toString(16).padStart(2,'0')).join('')];})))''')
 output={}
 for key,value in bounds.items():
  digest=hashlib.sha256((root/'assets'/f'{key}.webp').read_bytes()).hexdigest()
  assert digest==hashes[key],f'Rebuild before caching: {key} differs from the source asset.'
  output[key]={'sha256':digest,'bounds':value}
 (root/'atlas-bounds.json').write_text(json.dumps(output,separators=(',',':'))+'\n');print(f'Cached {len(output)} verified sheets; browser startup {time.monotonic()-start:.2f}s.');browser.close()
