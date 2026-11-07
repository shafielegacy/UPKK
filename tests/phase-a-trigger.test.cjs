const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
function env(props={}){
 const file=path.join(root,'release/gas/Legacy2026Sync.gs');
 assert.ok(fs.existsSync(file),'controlled QA trigger preview must exist');
 const writes=[],values={...props};
 const ctx={SPREADSHEET_ID:'SYNTHETIC_BACKUP',TAB:{DAFTAR:'DAFTAR'},
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>values[k]||null})},
  SpreadsheetApp:{openById:()=>({getSheetByName:()=>({})})},
  FormApp:{openById:()=>{writes.push('form');throw Error('unexpected Form access');}},
  MailApp:{sendEmail:()=>writes.push('email')},
  readMuridListFromDaftar_:()=>[{nama:'SYNTHETIC LEGACY'}],
  getPaidNameCellsForBulan_:()=>[],CUTOFF_MS:{NOV:1,DIS:2},BULAN_NUM:{NOV:11,DIS:12},
  buildEbayarChoices_:(students)=>students.map(s=>s.nama)};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
 return {ctx,writes};
}
test('trigger preview fails closed with absent flags or wrong workbook',()=>{
 for(const props of [{},{UPKK_LEGACY_SYNC_MODE:'PRODUCTION'},
  {UPKK_LEGACY_SYNC_MODE:'QA_PREVIEW',UPKK_LEGACY_SYNC_QA_SPREADSHEET_ID:'OTHER'}]){
   const e=env(props),r=e.ctx.legacy2026SyncPreview_('DIS');
   assert.equal(r.success,false);assert.equal(r.preview,false);assert.deepEqual(e.writes,[]);
 }
});
test('bound QA preview calculates Legacy November and December without Form/email writes',()=>{
 const e=env({UPKK_LEGACY_SYNC_MODE:'QA_PREVIEW',UPKK_LEGACY_SYNC_QA_SPREADSHEET_ID:'SYNTHETIC_BACKUP'});
 for(const month of ['NOV','DIS']){
  const r=e.ctx.legacy2026SyncPreview_(month);
  assert.equal(r.preview,true);assert.equal(r.success,false,'preview is never a successful live sync');
  assert.deepEqual(Array.from(r.plans[0].names),['SYNTHETIC LEGACY']);
 }
 assert.deepEqual(e.writes,[]);
});
test('malformed month cannot broaden preview to all forms',()=>{
 const e=env({UPKK_LEGACY_SYNC_MODE:'QA_PREVIEW',UPKK_LEGACY_SYNC_QA_SPREADSHEET_ID:'SYNTHETIC_BACKUP'});
 assert.equal(e.ctx.legacy2026SyncPreview_('INVALID').preview,false);
});
test('V2 patch changes only sync locks; direct legacy payment writer stays locked',()=>{
 const patchFile=path.join(root,'release/gas/Legacy2026PhaseA.patch');
 assert.ok(fs.existsSync(patchFile),'V2 sync patch must exist');
 const patch=fs.readFileSync(patchFile,'utf8');
 assert.ok(patch.includes('legacy2026SyncPreview_'));
 assert.ok(!patch.includes('function submitBayaran'));
 const source=fs.readFileSync(path.join(root,'review-reference/Code.gs'),'utf8');
 assert.match(source,/function submitBayaran\(data\)\s*\{[^]*?return \{success:false/);
});
test('V2 narrow patch applies cleanly and trigger uses private preview while public helpers stay closed',()=>{
 const {spawnSync}=require('node:child_process');
 const checked=spawnSync('git',['apply','--check','--directory=review-reference','release/gas/Legacy2026PhaseA.patch'],{cwd:root,encoding:'utf8',windowsHide:true});
 assert.equal(checked.status,0,checked.stderr);
 // Reconstruct the four reviewed replacements without mutating the reference.
 let source=fs.readFileSync(path.join(root,'review-reference/Code.gs'),'utf8');
 source=source.replace('const result = syncMuridToForms();','const result = legacy2026SyncPreview_();')
  .replace('const result = kemasFormEbayar(bulanKey);','const result = legacy2026SyncPreview_(bulanKey);');
 const events=[],logs=[];
 const ctx={Logger:{log:m=>logs.push(m)},Utilities:{sleep(){}},
  legacy2026SyncPreview_:month=>{events.push(month);return {success:false,preview:true};}};
 vm.createContext(ctx);vm.runInContext(source,ctx);
 assert.equal(ctx.syncMuridToForms().success,false);
 assert.equal(ctx.kemasFormEbayar('DIS').success,false);
 assert.equal(ctx.submitBayaran({}).success,false);
 assert.deepEqual(events,[],'public helpers must not disclose the private preview');
 ctx.onEbayarUPKKSubmit({range:{getSheet:()=>({getName:()=>'UPKK DIS 2026'})}});
 assert.deepEqual(events,['DIS']);
 assert.ok(logs.some(m=>m.includes('"preview":true')));
});
