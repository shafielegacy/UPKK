const normalise=s=>s.replace(/\r\n/g,'\n');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),baseline=path.join(root,'..','native-edaftar');
test('Legacy endpoint, twelve Form URLs and backend month mapping remain unchanged',()=>{
 const original=fs.readFileSync(path.join(baseline,'index.html'),'utf8');
 const candidate=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const rx of [/const GAS_URL = [^;]+;/,/const GF_URLS = \{[^]*?\n};/])
  assert.equal(normalise(candidate.match(rx)[0]),normalise(original.match(rx)[0]));
 const oldCode=fs.readFileSync(path.join(baseline,'Code.gs'),'utf8');
 const code=fs.readFileSync(path.join(root,'Code.gs'),'utf8');
 for(const symbol of ['TAB','FORM_EDIT_IDS','CUTOFF_MS']){
  const rx=new RegExp('const '+symbol+'\\s*=\\s*\\{[^]*?\\n};');
  assert.equal(normalise(code.match(rx)[0]),normalise(oldCode.match(rx)[0]));
 }
});
test('Native registration switches, services, receipt assets and PWA worker stay byte-identical',()=>{
 for(const file of ['edaftar-config.js','edaftar.js','edaftar.html','edaftar.css','PagesEdaftar.gs',
  'release/gas/NativeEdaftar.gs','release/gas/AdminV2.gs','sw.js','manifest.json','version.json',
  'review-reference/Code.gs'])
  assert.equal(normalise(fs.readFileSync(path.join(root,file),'utf8')),normalise(fs.readFileSync(path.join(baseline,file),'utf8')),file);
});
test('all candidate inline frontend scripts and changed GAS files parse',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const script of html.matchAll(/<script\b[^>]*>([^]*?)<\/script>/g)) new vm.Script(script[1]);
 for(const file of ['Code.gs','release/gas/Legacy2026Sync.gs','session-routing.js'])
  new vm.Script(fs.readFileSync(path.join(root,file),'utf8'));
});
