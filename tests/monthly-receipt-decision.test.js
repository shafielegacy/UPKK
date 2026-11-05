'use strict';
const assert = require('node:assert/strict');
const {receiptDecision} = require('../qa/monthly-receipt-decision');
const good = {requestId:'request-0001',childId:'TEST-CHILD-1',year:2027,month:1,amount:50,status:'SELESAI'};
const key = 'TEST-CHILD-1|2027|01';
const base = {key,requestId:good.requestId,serial:'UPKK-M-2027-0001',phase:'RESERVED',pdfUrl:''};
const cases = [
  ['settled without ledger requires reservation',good,null,[],'RESERVE_WITH_LOCK'],
  ['PENDING blocked',{...good,status:'PENDING'},null,[],'BLOCK'],
  ['REJECTED blocked',{...good,status:'REJECTED'},null,[],'BLOCK'],
  ['wrong month blocked',{...good,month:13},null,[],'BLOCK'],
  ['missing request blocked',{...good,requestId:''},null,[],'BLOCK'],
  ['zero amount blocked',{...good,amount:0},null,[],'BLOCK'],
  ['wrong year blocked',{...good,year:2025},null,[],'BLOCK'],
  ['different ledger key blocked',good,{...base,key:'other'},[],'BLOCK'],
  ['different request blocked',good,{...base,requestId:'request-xxxx'},[],'BLOCK'],
  ['missing serial blocked',good,{...base,serial:''},[],'BLOCK'],
  ['reserved proposes manual merge',good,base,[],'MERGE_MANUAL_ONLY'],
  ['merging is held',good,{...base,phase:'MERGING'},[],'HOLD_RECONCILE'],
  ['uncertain is held',good,{...base,phase:'UNCERTAIN'},[],'HOLD_RECONCILE'],
  ['failed is held',good,{...base,phase:'FAILED'},[],'HOLD_RECONCILE'],
  ['ready with PDF noop',good,{...base,phase:'READY',pdfUrl:'https://drive.google.com/mock'},[],'NOOP_READY'],
  ['ready without PDF is held',good,{...base,phase:'READY'},[],'HOLD_RECONCILE'],
  ['PDF while reserved is held',good,{...base,pdfUrl:'https://drive.google.com/mock'},[],'HOLD_RECONCILE'],
  ['invalid phase blocked',good,{...base,phase:'OTHER'},[],'BLOCK'],
  ['duplicate settled period blocked',good,base,[{...good,requestId:'another-request'}],'BLOCK'],
  ['different child does not block',good,base,[{...good,requestId:'another-request',childId:'TEST-CHILD-2'}],'MERGE_MANUAL_ONLY'],
  ['different month does not block',good,base,[{...good,requestId:'another-request',month:2}],'MERGE_MANUAL_ONLY'],
  ['different year does not block',good,base,[{...good,requestId:'another-request',year:2026}],'MERGE_MANUAL_ONLY'],
  ['unsettled other period does not block',good,base,[{...good,requestId:'another-request',status:'PENDING'}],'MERGE_MANUAL_ONLY'],
];
for (const [name,p,l,others,expected] of cases) {
  assert.equal(receiptDecision(p,l,others).action,expected,name);
}
console.log(cases.length+' PASS, 0 FAIL (pure decision model only)');
