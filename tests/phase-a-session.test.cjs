const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function routing() {
  const file = path.join(root, 'session-routing.js');
  assert.ok(fs.existsSync(file), 'session-aware routing implementation must exist');
  return require(file);
}
function fn(name) {
  const match = html.match(new RegExp('function '+name+'\\([^]*?\\n}'));
  assert.ok(match, name+' must exist');
  return match[0];
}
const forms = Object.fromEntries(['JAN','FEB','MAC','APRIL','MEI','JUN','JUL','OGOS','SEPT','OKT','NOV','DIS'].map(m=>[m,'https://docs.google.com/forms/'+m]));
test('all twelve Legacy months retain Google Form routing', () => {
  for (const month of Object.keys(forms)) {
    const route = routing().paymentRoute('2026', 2026, month, forms);
    assert.equal(route.kind, 'LEGACY_FORM');
    assert.equal(route.url, forms[month]);
  }
});
test('same child has distinct December 2026 contexts; Native stays closed', () => {
  const api = routing();
  assert.equal(api.paymentRoute('2026',2026,'DIS',forms).kind,'LEGACY_FORM');
  const native = api.paymentRoute('2027',2026,'DIS',forms);
  assert.equal(native.kind,'NATIVE_CLOSED');
  assert.equal(native.url, undefined);
  assert.notEqual(api.contextKey('2026',2026,'DIS'),api.contextKey('2027',2026,'DIS'));
});
test('invalid sessions and Native November never fall back to Legacy', () => {
  for (const [session,year,month] of [['',2026,'DIS'],['2028',2026,'DIS'],['2026',2027,'JAN'],['2027',2026,'NOV'],['2027',2027,'BAD']])
    assert.equal(routing().paymentRoute(session,year,month,forms).kind,'CLOSED');
  assert.equal(routing().paymentRoute('2027',2027,'JAN',forms).kind,'NATIVE_CLOSED');
});
test('Legacy modal retains its working Google Form button', () => {
  const nodes = {'my-body':{innerHTML:''}};
  const ctx = {S:{paymentSession:'2026',dashboard:{DIS:{status:'BELUM'}}},
    GF_URLS:forms,UPKKSession:routing(),BULAN_ORDER:Object.keys(forms),BULAN_SHORT:Object.keys(forms),
    isNA:()=>false,$:id=>nodes[id],openModal(){},toast(){},portalPaymentRoute:()=>routing().paymentRoute('2026',2026,'DIS',forms)};
  vm.createContext(ctx);vm.runInContext(fn('onYuranClick'),ctx);ctx.onYuranClick('DIS');
  assert.ok(nodes['my-body'].innerHTML.includes(forms.DIS));
  assert.ok(nodes['my-body'].innerHTML.includes('Bayar Sekarang'));
});
test('Native payment and receipt entry points never open Legacy URLs or APIs', () => {
  const calls=[];
  const ctx={S:{paymentSession:'2027',user:{email:'synthetic@example.invalid'}},portalPaymentRoute:()=>({kind:'NATIVE_CLOSED'}),
    toast(){},window:{open:()=>calls.push('open')},GF_URLS:forms,
    $:()=>({value:'DIS'}),hideErr(){},gasCall:()=>calls.push('api'),openModal:()=>calls.push('modal')};
  vm.createContext(ctx);
  vm.runInContext(fn('openEBayarForm')+'\n'+fn('openResitModal')+'\n'+fn('doGetResit'),ctx);
  ctx.openEBayarForm();ctx.openResitModal();ctx.doGetResit();
  assert.deepEqual(calls,[]);
});
test('dual enrolment rows do not contaminate Legacy Form choices', () => {
  const code=fs.readFileSync(path.join(root,'Code.gs'),'utf8');
  const headers=['Timestamp','NAMA MURID','STATUS','STATUS_PERMOHONAN'];
  const rows=[headers,[new Date(2026,0,1),'SYNTHETIC SAME CHILD','SELESAI',''],
    [new Date(2026,10,1),'SYNTHETIC SAME CHILD','SELESAI','APPROVED 2027'],
    [new Date(2026,10,2),'SYNTHETIC NEW CHILD','SELESAI','PENDING 2027']];
  const ctx={Logger:{log(){}},Utilities:{formatDate(){return '';}}};
  vm.createContext(ctx);vm.runInContext(code,ctx);
  ctx.buildColDaftar=()=>({TIMESTAMP:0,NAMA_MURID:1,STATUS:2,BAYARAN:9});
  ctx.getDaftarColMap=()=>({STATUS_PERMOHONAN:3});
  const students=ctx.readMuridListFromDaftar_({getDataRange:()=>({getValues:()=>rows})});
  assert.equal(students.length,1);
  assert.equal(students[0].nama,'SYNTHETIC SAME CHILD');
  assert.equal(rows.length,4,'neither enrolment is removed');
});
test('Legacy login keeps original enrolment date when same child registers for Native',()=>{
  const rows=[['header'],
    ['synthetic@example.invalid','00123456','SYNTHETIC SAME CHILD','SYNTHETIC PARENT',new Date('2026-11-01'),'APPROVED 2027'],
    ['synthetic@example.invalid','00123456','SYNTHETIC SAME CHILD','SYNTHETIC PARENT',new Date('2026-01-01'),'']];
  const sheet={getDataRange:()=>({getValues:()=>rows})};
  const ctx={console,Logger:{log(){}},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet})}};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'Code.gs'),'utf8'),ctx);
  ctx.buildColDaftar=()=>({EMAIL:0,NO_TELEFON:1,NAMA_MURID:2,NAMA_PENJAGA:3,TIMESTAMP:4});
  ctx.getDaftarColMap=()=>({STATUS_PERMOHONAN:5});
  const result=ctx.login('synthetic@example.invalid','123456');
  assert.equal(result.success,true);assert.equal(result.anak.length,1);
  assert.equal(result.anak[0].tarikhDaftar,'2026-01-01T00:00:00.000Z');
});
test('Legacy backend rejects a Native dashboard context before reading Sheets',()=>{
  const reads=[];
  const ctx={Logger:{log(){}},SpreadsheetApp:{openById:()=>{reads.push('read');throw Error('unexpected Legacy read');}}};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'Code.gs'),'utf8'),ctx);
  assert.equal(ctx.getDashboard('synthetic@example.invalid','SYNTHETIC CHILD','','2027').success,false);
  assert.deepEqual(reads,[]);
});
test('late Legacy receipt response cannot open after context changes',()=>{
  let complete;const opened=[];
  const ctx={S:{paymentSession:'2026',dashboardRequest:1,user:{email:'synthetic@example.invalid'}},
    $:()=>({value:'DIS'}),hideErr(){},showErr(){},toast(){},closeModal(){},
    gasCall:(name,args,ok)=>{complete=ok;},window:{open:url=>opened.push(url)}};
  vm.createContext(ctx);vm.runInContext(fn('doGetResit'),ctx);
  ctx.doGetResit();ctx.S.paymentSession='2027';ctx.S.dashboardRequest++;
  complete({success:true,link:'https://example.invalid/synthetic-receipt'});
  assert.deepEqual(opened,[]);
});
test('late Legacy dashboard response cannot populate Native session',()=>{
  let complete;const shown=[];
  const ctx={S:{paymentSession:'2026',dashboardRequest:0},console:{log(){}},
    loading(){},setTimeout:()=>1,clearTimeout(){},
    gasCall:(name,args,ok)=>{complete=ok;},_showDashboard:data=>shown.push(data)};
  vm.createContext(ctx);vm.runInContext(fn('loadDashboard'),ctx);
  ctx.loadDashboard('synthetic@example.invalid','SYNTHETIC CHILD','');
  ctx.S.paymentSession='2027';ctx.S.dashboardRequest++;
  complete({success:true,statusYuran:{DIS:{status:'SELESAI'}}});
  assert.deepEqual(shown,[]);
});
test('missing routing asset preserves Legacy but rejects a different payment year',()=>{
  const ctx={S:{paymentSession:'2026'},GF_URLS:forms};
  vm.createContext(ctx);vm.runInContext(fn('portalPaymentRoute'),ctx);
  assert.equal(ctx.portalPaymentRoute('DIS').kind,'LEGACY_FORM');
  assert.equal(ctx.portalPaymentRoute('DIS',2026).kind,'LEGACY_FORM');
  assert.equal(ctx.portalPaymentRoute('DIS',2027).kind,'CLOSED');
  ctx.S.paymentSession='2027';
  assert.equal(ctx.portalPaymentRoute('DIS',2026).kind,'CLOSED');
});
test('selecting Native session does not call a Legacy dashboard API',()=>{
  const calls=[],shown=[];
  const ctx={S:{paymentSession:'2027',dashboardRequest:0},loading(){},
    gasCall:()=>calls.push('api'),_showDashboard:(data,message)=>shown.push({data,message})};
  vm.createContext(ctx);vm.runInContext(fn('loadDashboard'),ctx);
  ctx.loadDashboard('synthetic@example.invalid','SYNTHETIC CHILD','');
  assert.deepEqual(calls,[]);assert.equal(shown.length,1);
  assert.equal(Object.keys(shown[0].data).length,0);
});
test('Legacy receipt still opens when its request context has not changed',()=>{
  let complete;const opened=[];
  const ctx={S:{paymentSession:'2026',dashboardRequest:1,user:{email:'synthetic@example.invalid'}},
    $:()=>({value:'DIS'}),hideErr(){},showErr(){},toast(){},closeModal(){},
    gasCall:(name,args,ok)=>{complete=ok;},window:{open:url=>opened.push(url)}};
  vm.createContext(ctx);vm.runInContext(fn('doGetResit'),ctx);
  ctx.doGetResit();complete({success:true,link:'https://example.invalid/synthetic-receipt'});
  assert.deepEqual(opened,['https://example.invalid/synthetic-receipt']);
});
test('Legacy Admin views exclude Native enrolments and preserve original row numbers',()=>{
  const rows=[['header'],
    ['SYNTHETIC NATIVE','SELESAI',new Date('2026-11-01'),100,'APPROVED 2027'],
    ['SYNTHETIC LEGACY','SELESAI',new Date('2026-01-01'),40,'']];
  const sheet={getDataRange:()=>({getValues:()=>rows}),getName:()=>'DAFTAR UPKK',getLastRow:()=>rows.length};
  const ctx={console,Logger:{log(){}},Utilities:{formatDate:()=> '01/01/2026'},
    SpreadsheetApp:{openById:()=>({getSheetByName:name=>name==='DAFTAR UPKK'?sheet:null})}};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'Code.gs'),'utf8'),ctx);
  ctx.buildColDaftar=()=>({NAMA_MURID:0,STATUS:1,TIMESTAMP:2,BAYARAN:3});
  ctx.getDaftarColMap=()=>({STATUS_PERMOHONAN:4});ctx.getCurrentMonthNum=()=>11;
  const dashboard=ctx.getAdminDashboard();
  assert.equal(dashboard.success,true);assert.equal(dashboard.jumlahMurid,1);
  assert.equal(dashboard.totalDaftarKutipan,40);
  const students=ctx.getSenaraiMuridDaftar('','');
  assert.equal(students.success,true);assert.equal(students.total,1);
  assert.equal(students.data[0].row,3,'physical Sheet row must not be renumbered');
  const payments=ctx.getSenaraiByuran('NOV','SEMUA','');
  assert.equal(payments.success,true);assert.equal(payments.total,1);
  assert.equal(payments.data[0].namaMurid,'SYNTHETIC LEGACY');
  const debts=ctx.getTiadaBayarDanKonsisten();
  assert.equal(debts.success,true);assert.equal(debts.tiadaBayar.length,1);
  assert.equal(debts.tiadaBayar[0].nama,'SYNTHETIC LEGACY');
});
