'use strict';
// node tests/native-monthly-receipt-access-qa.test.js
// Fake GAS only. No Drive/Sheets API, secrets, files or emails.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const childA='000000000001',childB='000000000002',emailA='guardian-a@example.test';
const payment=(id,child,opts={})=>[id,null,opts.email||emailA,child,'Synthetic','JAN',2027,'2027-01-01','TRANSFER',50,'https://drive.google.com/mock',opts.status||'SELESAI',opts.serial||'UPKK-M-2027-0001','','','',opts.url===undefined?'https://drive.google.com/file/d/mockfile/view':opts.url,opts.state||'READY','','',0];
const rows=[Array.from({length:21},()=>''),payment('id-a',childA)];
const sh={getDataRange:()=>({getValues:()=>rows.map(r=>r.slice())}),getRange:()=>({getDisplayValues:()=>[Array(17).fill('')]})};
let fileAccess='PRIVATE',fileMime='application/pdf',trashed=false;
const env={
  neGetSession_:token=>{if(token==='valid')return {email:emailA,children:[childA]};throw Error('Sesi tidak sah');},
  neChild_:(s,id)=>{if(!s.children.includes(id))throw Error('Bukan anak penjaga');return {mykid:id};},
  neNormalMyKid_:v=>String(v||'').replace(/\D/g,''),
  neSheet_:()=>sh,
  NE_MONTHS_:['JAN','FEB','MAC','APRIL','MEI','JUN','JUL','OGOS','SEPT','OKT','NOV','DIS'],
  mrQaCheckSerials_:records=>{const seen=new Set();for(const r of records.slice(1)){if(r[12]){if(seen.has(r[12]))throw Error('Duplicate serial');seen.add(r[12]);}}return {};},
  DriveApp:{Access:{PRIVATE:'PRIVATE'},getFileById:()=>({isTrashed:()=>trashed,getMimeType:()=>fileMime,getSharingAccess:()=>fileAccess})}
};
vm.createContext(env);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','NativeMonthlyReceiptV2.gs'),'utf8'),env);
const fetch=(token='valid',child=childA,month='JAN',year=2027)=>env.getNativeMonthlyReceipt(token,child,month,year);
let pass=0;function check(label,condition){assert.ok(condition,label);pass++;}
check('owner ready PDF',fetch().success===true);
check('no email or MyKid in response',!JSON.stringify(fetch()).includes(emailA)&&!JSON.stringify(fetch()).includes(childA));
check('invalid token denied',!fetch('bad').success);
check('cross-child denied',!fetch('valid',childB).success);
check('unknown period denied',fetch('valid',childA,'FEB').state==='NOT_FOUND');
check('invalid year denied',!fetch('valid',childA,'JAN',2028).success);
check('invalid month denied',!fetch('valid',childA,'BAD').success);
rows[1][11]='PENDING';check('pending denied',fetch().state==='PENDING');
rows[1][11]='SELESAI';rows[1][17]='RESERVED';check('reserved unavailable',fetch().state==='WAITING');
rows[1][17]='MERGING';check('merging unavailable',fetch().state==='WAITING');
rows[1][17]='UNCERTAIN';check('uncertain reconciliation',fetch().state==='RECONCILIATION');
rows[1][17]='READY';rows[1][16]='';check('ready without URL unavailable',fetch().state==='WAITING');
rows[1][16]='https://evil.example.invalid/a';check('non-Google URL rejected',!fetch().success);
rows[1][16]='https://drive.google.com/file/d/mockfile/view';
fileAccess='ANYONE';check('public PDF rejected',!fetch().success);
fileAccess='PRIVATE';fileMime='text/plain';check('non-PDF rejected',!fetch().success);
fileMime='application/pdf';trashed=true;check('trashed rejected',!fetch().success);
trashed=false;rows.push(payment('id-b',childB,{serial:'UPKK-M-2027-0001'}));check('duplicate serial rejected',!fetch().success);
rows.pop();rows.push(payment('id-b',childA,{serial:'UPKK-M-2027-0002'}));check('duplicate settled child-period rejected',!fetch().success);
rows.pop();check('restored clean owner ready',fetch().success===true);
console.log(pass+' PASS / 0 FAIL — isolated GAS mock only');
