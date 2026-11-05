'use strict';
// Run: node tests/monthly-receipt-ledger-qa.test.js
// Uses a fake GAS runtime. No credentials, Sheets, Drive or mail.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
let rows=[
  Array.from({length:21},(_,i)=>i<17?'BASE_'+i:''),
  ['11111111-1111-4111-8111-111111111111',null,'synthetic@example.test','000000000001','Synthetic 1','JAN',2027,'2027-01-01','TRANSFER',50,'https://drive.google.com/mock','SELESAI','','','','','','','','',''],
  ['22222222-2222-4222-8222-222222222222',null,'synthetic@example.test','000000000002','Synthetic 2','JAN',2027,'2027-01-01','TRANSFER',50,'https://drive.google.com/mock','SELESAI','','','','','','','','','']
];
const sheet={
  getRange(row,col,count=1,width=1){
    return {
      getDisplayValues:()=>[rows[row-1].slice(col-1,col-1+width).map(v=>String(v??''))],
      setValue:v=>{rows[row-1][col-1]=v;},
      setValues:vals=>vals.forEach((line,i)=>line.forEach((v,j)=>{rows[row+i-1][col+j-1]=v;}))
    };
  },
  getDataRange:()=>({getValues:()=>rows.map(r=>r.slice())})
};
const sandbox={
  upkkAdminV2Auth_:token=>{if(token!=='admin')throw Error('Invalid Admin');},
  neGuard_:()=>{},
  neSheet_:()=>sheet,
  neNormalMyKid_:v=>String(v||'').replace(/\D/g,''),
  NE_MONTHS_:['JAN','FEB','MAC','APRIL','MEI','JUN','JUL','OGOS','SEPT','OKT','NOV','DIS'],
  LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>{}})},
  SpreadsheetApp:{flush:()=>{}},
  DriveApp:{getFileById:id=>({isTrashed:()=>false,getMimeType:()=>id==='mockfile'?'application/pdf':'text/plain'})},
  Date
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','MonthlyReceiptV2.gs'),'utf8'),sandbox);
const a=rows[1][0],b=rows[2][0];let passed=0;
function test(name,fn){assert.ok(fn(),name);passed++;}
test('setup blocks guest',()=>!sandbox.prepareMonthlyReceiptQaColumns('guest').success);
test('cannot reserve before metadata',()=>!sandbox.reserveMonthlyReceiptQa('admin',a).success);
test('setup succeeds',()=>sandbox.prepareMonthlyReceiptQaColumns('admin').success);
test('setup idempotent',()=>sandbox.prepareMonthlyReceiptQaColumns('admin').success);
test('reserve serial 0001',()=>sandbox.reserveMonthlyReceiptQa('admin',a).serial==='UPKK-M-2027-0001');
test('repeat reservation stable',()=>sandbox.reserveMonthlyReceiptQa('admin',a).unchanged===true);
test('reserve serial 0002',()=>sandbox.reserveMonthlyReceiptQa('admin',b).serial==='UPKK-M-2027-0002');
test('no unauthorized reserve',()=>!sandbox.reserveMonthlyReceiptQa('guest',a).success);
test('no unknown ID',()=>!sandbox.reserveMonthlyReceiptQa('admin','33333333-3333-4333-8333-333333333333').success);
test('merge starts once',()=>sandbox.markMonthlyReceiptMergingQa('admin',a).attempt===1);
test('merge repeat rejected',()=>!sandbox.markMonthlyReceiptMergingQa('admin',a).success);
test('wrong MIME rejected',()=>!sandbox.reconcileMonthlyReceiptPdfQa('admin',a,'https://drive.google.com/file/d/notpdf/view').success);
test('external URL rejected',()=>!sandbox.reconcileMonthlyReceiptPdfQa('admin',a,'https://evil.example.invalid/test').success);
test('ready PDF recognised',()=>sandbox.reconcileMonthlyReceiptPdfQa('admin',a,'https://drive.google.com/file/d/mockfile/view').state==='READY');
test('ready repeat rejected',()=>!sandbox.reconcileMonthlyReceiptPdfQa('admin',a,'https://drive.google.com/file/d/mockfile/view').success);
test('cannot restart ready merge',()=>!sandbox.markMonthlyReceiptMergingQa('admin',a).success);
test('cannot mark ready as uncertain',()=>!sandbox.markMonthlyReceiptUncertainQa('admin',a,'test').success);
test('second merging',()=>sandbox.markMonthlyReceiptMergingQa('admin',b).success);
test('second uncertain',()=>sandbox.markMonthlyReceiptUncertainQa('admin',b,'ambiguous').state==='UNCERTAIN');
test('uncertain blocks remerge',()=>!sandbox.markMonthlyReceiptMergingQa('admin',b).success);
test('uncertain reconciled to ready',()=>sandbox.reconcileMonthlyReceiptPdfQa('admin',b,'https://drive.google.com/file/d/mockfile/view').state==='READY');
rows.push([...rows[2]]);rows[3][0]='33333333-3333-4333-8333-333333333333';rows[3][12]='';rows[3][17]='';
test('duplicate settled period denied',()=>!sandbox.reserveMonthlyReceiptQa('admin',rows[3][0]).success);
rows.pop();
rows[2][12]=rows[1][12];
test('duplicate serial stops new reservations',()=>!sandbox.reserveMonthlyReceiptQa('admin',b).success);
console.log(passed+' PASS / 0 FAIL — MOCK ONLY, NO AUTOCRAT');
