const test=require('node:test'), assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
function runtime(props={}){
 const calls=[];const ctx={PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]||null})},
 ContentService:{MimeType:{JSON:'application/json'},createTextOutput:s=>({text:s,setMimeType(){return this;}})},
 nativeEdaftarEmail_:s=>String(s||'').trim().toLowerCase(),
 getNativeEdaftarAvailability:()=>({success:true,enabled:true,feeReady:true,configuredFees:{daftar:50,bulanan:0,total:50}}),
 getNativeEdaftarSeats:y=>({success:true,year:y,remaining:{FIZIKAL:30,ONLINE:20}}),
 requestNativeEdaftarOtp:e=>(calls.push(e),{success:true,message:'sent'}),
 verifyNativeEdaftarOtp:(e,o)=>(calls.push([e,o]),{success:true,ticket:'secret'}),
 submitNativeEdaftar:p=>(calls.push(p),{success:true,message:'PENDING'})};
 const file=path.join(root,'PagesEdaftar.gs');
 vm.createContext(ctx);if(fs.existsSync(file))vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
 return {calls,run:body=>{assert.equal(typeof ctx.pagesNativeEdaftarPost_,'function','POST adapter must exist');return JSON.parse(ctx.pagesNativeEdaftarPost_(body).text);}};
}
const enabled={UPKK_PAGES_EDAFTAR_QA_ENABLED:'true',UPKK_NATIVE_EDAFTAR_TEST_EMAIL:'tester@example.invalid'};
test('default OFF performs no OTP side effect',()=>{const r=runtime();assert.equal(r.run({rpc:'requestNativeEdaftarOtp',args:['tester@example.invalid']}).success,false);assert.equal(r.calls.length,0);});
test('missing test allowlist remains closed',()=>{const r=runtime({UPKK_PAGES_EDAFTAR_QA_ENABLED:'true'});assert.equal(r.run({rpc:'requestNativeEdaftarOtp',args:['tester@example.invalid']}).success,false);});
test('rejects other email before sending',()=>{const r=runtime(enabled);assert.equal(r.run({rpc:'requestNativeEdaftarOtp',args:['other@example.invalid']}).success,false);assert.equal(r.calls.length,0);});
test('dispatches OTP only to nominated tester',()=>{const r=runtime(enabled);assert.equal(r.run({rpc:'requestNativeEdaftarOtp',args:['tester@example.invalid']}).success,true);assert.equal(r.calls.length,1);});
test('rejects arbitrary RPC, callback, wrong argument count',()=>{for(const body of [{rpc:'getAdminDashboard',args:[]},{rpc:'requestNativeEdaftarOtp',args:['tester@example.invalid'],callback:'evil'},{rpc:'verifyNativeEdaftarOtp',args:['tester@example.invalid']}]){const r=runtime(enabled);assert.equal(r.run(body).success,false);assert.equal(r.calls.length,0);}});
test('returns availability without personal records',()=>{const r=runtime(enabled);const out=r.run({rpc:'getNativeEdaftarAvailability',args:[]});assert.equal(out.success,true);assert.equal(out.configuredFees.total,50);assert.equal(r.calls.length,0);});
test('submit requires correct email and passes ticket to existing validator',()=>{const r=runtime(enabled);assert.equal(r.run({rpc:'submitNativeEdaftar',args:[{email:'other@example.invalid'}]}).success,false);assert.equal(r.calls.length,0);assert.equal(r.run({rpc:'submitNativeEdaftar',args:[{email:'tester@example.invalid',otpTicket:'ticket'}]}).success,true);assert.equal(r.calls[0].otpTicket,'ticket');});

function frontend(config={},fetchImpl=()=>{throw Error('unexpected network');}){
 const ctx={window:{UPKK_EDAFTAR_CONFIG:config},document:{addEventListener(){}},fetch:fetchImpl,AbortController,setTimeout,clearTimeout,FileReader:function(){},Number,Date};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'edaftar.js'),'utf8'),ctx);
 return ctx;
}
test('disabled browser configuration never contacts GAS',async()=>{const c=frontend();assert.equal((await c.pagesEdaftarRpc('requestNativeEdaftarOtp',['test@example.invalid'])).success,false);});
test('rejects non-HTTPS, URL query and untrusted endpoint',async()=>{for(const endpoint of ['http://script.google.com/macros/s/x/exec','https://evil.invalid/exec','https://script.google.com/macros/s/x/exec?token=secret']){const c=frontend({enabled:true,endpoint});assert.equal((await c.pagesEdaftarRpc('requestNativeEdaftarOtp',['test@example.invalid'])).success,false);}});
test('POST carries sensitive values in body only and omits cookies',async()=>{
 let request;const endpoint='https://script.google.com/macros/s/QA_ONLY/exec';
 const c=frontend({enabled:true,endpoint},async(url,opts)=>(request={url,opts},{ok:true,json:async()=>({success:true,ticket:'one-use'})}));
 const out=await c.pagesEdaftarRpc('verifyNativeEdaftarOtp',['test@example.invalid','123456']);
 assert.equal(out.success,true);assert.equal(request.url,endpoint);assert.equal(request.opts.method,'POST');assert.equal(request.opts.credentials,'omit');assert.equal(request.opts.mode,'cors');
 assert.match(request.opts.headers['Content-Type'],/^text\/plain/);assert.deepEqual(JSON.parse(request.opts.body).args,['test@example.invalid','123456']);
});
test('uncertain submission never retries or reports success',async()=>{let calls=0;const c=frontend({enabled:true,endpoint:'https://script.google.com/macros/s/QA_ONLY/exec'},async()=>{calls++;throw Error('lost');});const out=await c.pagesEdaftarRpc('submitNativeEdaftar',[{}]);assert.equal(out.success,false);assert.equal(out.uncertain,true);assert.equal(calls,1);});
test('HTML error response is not treated as saved registration',async()=>{const c=frontend({enabled:true,endpoint:'https://script.google.com/macros/s/QA_ONLY/exec'},async()=>({ok:true,json:async()=>{throw Error('HTML login page');}}));assert.equal((await c.pagesEdaftarRpc('submitNativeEdaftar',[{}])).success,false);});
test('browser validates actual dates and Year 3-5 cohorts',()=>{const c=frontend();assert.equal(c.nativeMykidSessionAgeUI('180101100001'),9);assert.equal(c.nativeMykidSessionAgeUI('170101100001'),10);assert.equal(c.nativeMykidSessionAgeUI('160101100001'),11);assert.equal(c.nativeMykidSessionAgeUI('180230100001'),null);});
test('V2 fee quote is RM50 in Nov and RM100 from Dec',()=>{
 const ctx={UPKK_ADMIN_V2_FEES_:'fees',NATIVE_EDAFTAR_SESSION_:'2027',
 PropertiesService:{getScriptProperties:()=>({getProperty:()=>JSON.stringify({session:'2027',daftar:50,bulanan:50})})},
 upkkAdminV2ReadPolicy_:()=>({classStart:'2026-12-01'})};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'fixtures/v2-registration-helpers.js'),'utf8'),ctx);
 assert.equal(ctx.upkkAdminV2FeeQuote_('2026-11-30').total,50);assert.equal(ctx.upkkAdminV2FeeQuote_('2026-11-30').firstMonth,'');
 assert.equal(ctx.upkkAdminV2FeeQuote_('2026-12-01').total,100);assert.equal(ctx.upkkAdminV2FeeQuote_('2026-12-01').firstMonth,'2026-12');
 assert.equal(ctx.upkkAdminV2FeeQuote_('2027-01-01').total,100);
 assert.equal(ctx.nativeEdaftarBirth_('180230100001'),null);
 for(const [year,age] of [[18,9],[17,10],[16,11]])assert.equal(ctx.nativeEdaftarBirth_(year+'0101100001').ageInSession,age);
 function row(year,mode,status){const r=Array(33).fill('');r[30]=year;r[31]=mode;r[21]=status;return r;}
 const rows=[[],row(3,'FIZIKAL','PENDING 2027'),row(3,'FIZIKAL','APPROVED 2027'),row(3,'FIZIKAL','REJECTED 2027'),row(4,'FIZIKAL','PENDING 2027'),row(3,'ONLINE','APPROVED 2027')];
 assert.equal(ctx.nativeEdaftarIntakeUsed_(rows,3,'FIZIKAL',null,{STATUS_PERMOHONAN:21}),2);
 assert.equal(ctx.nativeEdaftarIntakeUsed_(rows,3,'ONLINE',null,{STATUS_PERMOHONAN:21}),1);
});
