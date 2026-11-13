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
const pExisting=read('parent-existing-2027.js');
const pExistingConfig=read('parent-existing-2027-config.js');
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
 ['Only final Admin OTP and original Parent bridge loaded',()=>{for(const f of ['native-admin-shell-2027.css','admin-2027.js','parent-existing-2027.js'])assert.ok(html.includes('./'+f),f);assert.ok(!html.includes('src="./parent-2027.js'));assert.ok(!html.includes('src="./parent-2027-config.js'))}],
 ['Native Admin uses authenticated backend route',()=>assert.ok(admin.includes("action:'pagesAdminNativeV2Production'"))],
 ['Parent uses existing credential verification POST route',()=>assert.ok(pExisting.includes("action:'pagesParentExistingLogin'"))],
 ['Admin mount is within existing page',()=>assert.ok(admin.includes("$('page-admin').append(shell)"))],
 ['Parent records appended to existing dashboard',()=>assert.ok(pExisting.includes('body.append(section)'))],
 ['Admin checks server token; Parent uses guarded original credentials',()=>{assert.ok(admin.includes('if(!r.token)'));assert.ok(pExisting.includes('if(!enabled)return {success:false}'))}],
 ['Admin OTP clears Legacy state; Parent logout clears native display',()=>{assert.ok(admin.includes("window.doLogout();"));assert.ok(html.includes('window.UPKKParentExistingV2.clear()'))}],
 ['Admin refresh and Parent responses reject stale state',()=>{assert.ok(admin.includes('requestedToken!==token'));assert.ok(pExisting.includes('request!==nonce'))}],
 ['Admin session selector gated; Parent remains one original dashboard',()=>{assert.ok(admin.includes('native-admin-session-select-2026'));assert.ok(admin.includes('if(!token||!page||!native)return'));assert.ok(pExisting.includes('native-parent-2027-inline'))}],
 ['Admin CSS scoped and separate Parent OTP CSS not loaded',()=>{assert.ok(adminCss.includes('#page-admin.native-admin-2027-view'));assert.ok(!html.includes('native-parent-shell-2027.css'))}],
 ['Parent frontend gate remains OFF',()=>assert.match(pConfig,/enabled\s*:\s*false/)],
 ['Public eDaftar frontend gate remains OFF',()=>assert.match(eConfig,/enabled\s*:\s*false/)],
 ['Parent existing-login bridge remains CLOSED',()=>assert.match(pExistingConfig,/enabled\s*:\s*false/)],
 ['Parent retains original form while 2027 uses server-verified read',()=>{assert.ok(html.includes('UPKKParentExistingV2.afterLegacyLogin(email,tel)'));assert.ok(html.includes('UPKKParentExistingV2.tryNativeOnly(email,tel)'));assert.ok(pExisting.includes("action:'pagesParentExistingLogin'"));assert.ok(pExisting.includes('render(r.children,true)'))}],
 ['Legacy Admin password/restore cannot bypass Native OTP',()=>{assert.ok(html.includes("window.UPKKAdminStartOtp(res.email || email)"));assert.ok(html.includes("A cached Legacy Admin identity must never bypass the new OTP gate."));assert.ok(admin.includes('window.UPKKAdminStartOtp=function(prefillEmail)'))}],
 ['Admin one OTP opens original Legacy dashboard',()=>{assert.ok(admin.includes('getAdminLegacy2026ReadOnly'));assert.ok(admin.includes("window.doLogout();"));assert.ok(admin.includes("S.user={success:true,role:'admin'"));assert.ok(admin.includes('renderAdminStats(result)'));assert.ok(admin.includes('native-admin-session-select-2026'));assert.ok(admin.includes('native-admin-2027-view'))}],
 ['Admin Native data stays inline in original dashboard',()=>{assert.ok(admin.includes('originalBody.append(dashboard)'));assert.ok(adminCss.includes('#page-admin.native-admin-2027-view'))}],
 ['Admin frontend still wired to Native endpoint',()=>assert.match(aConfig,/pages|script\.google\.com/)],
 ['PWA cache renamed for this QA candidate',()=>assert.match(sw,/upkk-v2-unified-qa-20261113/)]
];
let fail=0;
for(const [label,fn] of tests){try{fn();console.log('PASS '+label)}catch(err){fail++;console.error('FAIL '+label+': '+err.message)}}
console.log(tests.length-fail+' PASS, '+fail+' FAIL');
if(fail)process.exitCode=1;
