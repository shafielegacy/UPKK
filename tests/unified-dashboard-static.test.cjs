/* UPKK V2 unified QA — read-only static release preflight.
 * Usage from repository root: node tests/unified-dashboard-static.test.cjs
 * No network, GAS calls, registration or payment writes.
 */
'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const read=file=>fs.readFileSync(file,'utf8');
const html=read('index.html');
const admin=read('admin-2027.js');
const parent=read('parent-2027.js');
const sw=read('sw.js');
const aConfig=read('admin-2027-config.js');
const pConfig=read('parent-2027-config.js');
const eConfig=read('edaftar-config.js');
const adminCss=read('native-admin-shell-2027.css');
const parentCss=read('native-parent-shell-2027.css');
const tests=[
 ['legacy login remains intact',()=>assert.match(html,/function doLogin\(\)/)],
 ['legacy logout remains intact',()=>assert.match(html,/function doLogout\(\)/)],
 ['one portal; no old v2 redirect',()=>assert.doesNotMatch(html,/location\.replace\('\.\/v2-portal\.html'\)/)],
 ['primary Log Masuk and eDaftar remain',()=>{assert.match(html,/id="lct-login"/);assert.match(html,/id="lct-edaftar"/)}],
 ['Native CSS and JavaScript imported',()=>{for(const f of ['native-admin-shell-2027.css','native-parent-shell-2027.css','admin-2027.js','parent-2027.js'])assert.ok(html.includes('./'+f),f)}],
 ['Native Admin uses authenticated backend route',()=>assert.ok(admin.includes("action:'pagesAdminNativeV2Production'"))],
 ['Native Parent uses authenticated backend route',()=>assert.ok(parent.includes("action:'pagesParentV2'"))],
 ['Admin mount is within existing page',()=>assert.ok(admin.includes("$('page-admin').append(shell)"))],
 ['Parent mount is within existing page',()=>assert.ok(parent.includes("$('page-dashboard').append(shell)"))],
 ['both modules check server tokens before dashboard',()=>{assert.ok(admin.includes('if(!r.token)'));assert.ok(parent.includes('if(!r.success||!r.sessionToken)'))}],
 ['Native login clears Legacy browser state',()=>{assert.ok(admin.includes("window.doLogout();"));assert.ok(parent.includes("window.doLogout();"))}],
 ['both Native refreshes reject stale responses',()=>{assert.ok(admin.includes('requestedToken!==token'));assert.ok(parent.includes('requestedToken!==sessionToken'))}],
 ['both Native dashboards use gated session selectors',()=>{assert.ok(admin.includes('native-admin-session-select-2027'));assert.ok(parent.includes('native-parent-session-select-2027'));assert.ok(admin.includes("logout();"));assert.ok(parent.includes("logout();"))}],
 ['Native UI CSS scoped to active mode',()=>{assert.ok(adminCss.includes('#page-admin:not(.native-2027-active)'));assert.ok(parentCss.includes('#page-dashboard:not(.native-2027-active)'))}],
 ['Parent frontend gate remains OFF',()=>assert.match(pConfig,/enabled\s*:\s*false/)],
 ['Public eDaftar frontend gate remains OFF',()=>assert.match(eConfig,/enabled\s*:\s*false/)],
 ['Admin 2027 step-up only from authenticated Legacy Admin',()=>{assert.ok(admin.includes("S.user.role!=='admin'"));assert.ok(admin.includes('native-admin-session-select-2026'));assert.ok(admin.includes("switchView('otp')"))}],
 ['Admin frontend still wired to Native endpoint',()=>assert.match(aConfig,/pages|script\.google\.com/)],
 ['PWA cache renamed for this QA candidate',()=>assert.match(sw,/upkk-v2-unified-qa-20261113/)]
];
let fail=0;
for(const [label,fn] of tests){try{fn();console.log('PASS '+label)}catch(err){fail++;console.error('FAIL '+label+': '+err.message)}}
console.log(tests.length-fail+' PASS, '+fail+' FAIL');
if(fail)process.exitCode=1;
