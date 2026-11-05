'use strict';
// node tests/part8e-legacy-api-qa.test.js
// Tests the branch's BACKUP-only public API fail-closed guard without Google.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync(path.join(__dirname,'..','Code.gs'),'utf8');
const start=code.indexOf('function _handleApi(action, params) {');
const next=code.indexOf('\nfunction ',start+10);
assert.ok(start>=0&&next>start,'legacy API extracted');
const section=code.slice(start,next);
const calls=[];
const sandbox={
  NE_QA_SPREADSHEET_:'QA_BACKUP',
  SPREADSHEET_ID:'QA_BACKUP',
  apiOutput_:r=>r,
  login:()=>{calls.push('login');return {success:true};},
  getDashboard:()=>{calls.push('getDashboard');return {success:true};},
  getAdminDashboard:()=>{calls.push('getAdminDashboard');return {success:true};},
  getSenaraiMuridDaftar:()=>{calls.push('getSenaraiMuridDaftar');return {success:true};},
  getResit:()=>{calls.push('getResit');return {success:true};},
  submitBayaran:()=>{calls.push('submitBayaran');return {success:true};},
  syncMuridToForms:()=>{calls.push('syncMuridToForms');return {success:true};},
  SpreadsheetApp:{openById:()=>{calls.push('sheet');throw Error('MUST NOT ACCESS');}}
};
vm.createContext(sandbox);
vm.runInContext(section,sandbox);
const actions=['login','getDashboard','getAdminDashboard','getSenaraiMuridDaftar','getResit','testResit','syncMuridToForms','submitBayaran','unknown'];
let pass=0;
for(const action of actions){
  const result=sandbox._handleApi(action,{row:'1'});
  assert.equal(result.success,false,action+' should be denied');
  assert.match(result.message,/QA/);
  pass++;
}
assert.deepEqual(calls,[],'zero sensitive function calls on QA public route');
console.log(pass+' PASS / 0 FAIL; zero unauthenticated API side effects — mock');
