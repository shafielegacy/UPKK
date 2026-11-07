const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');
function env(props={}){
 const cache=new Map(),sent=[],values={...props};
 let now=Date.parse('2026-11-07T06:00:00Z');
 class Clock extends Date{constructor(...a){super(...(a.length?a:[now]));}static now(){return now;}}
 const p={getProperty:k=>values[k]||null,setProperty:(k,v)=>{values[k]=v;},deleteProperty:k=>{delete values[k];}};
 const ctx={Date:Clock,TAB:{DAFTAR:'DAFTAR'},SPREADSHEET_ID:'WORKBOOK',PropertiesService:{getScriptProperties:()=>p},
 CacheService:{getScriptCache:()=>({get:k=>cache.get(k)||null,put:(k,v)=>cache.set(k,v),remove:k=>cache.delete(k)})},
 LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},
 Utilities:{getUuid:()=>crypto.randomUUID(),DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,s)=>Array.from(crypto.createHash('sha256').update(s).digest()),base64EncodeWebSafe:b=>Buffer.from(b).toString('base64url'),formatDate:()=>new Clock().toISOString().slice(0,10)},
 MailApp:{getRemainingDailyQuota:()=>100,sendEmail:m=>sent.push(m)},DriveApp:{Access:{PRIVATE:'PRIVATE'}},
 ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({text:s,setMimeType(){return this;}})},
 nativeEdaftarDigest_:s=>crypto.createHash('sha256').update(s).digest('base64url'),upkkAdminV2ReadPolicy_:()=>JSON.parse(values.UPKK_V2_POLICY_2027),
 getNativeEdaftarAvailability:()=>({success:true,enabled:true}),getNativeEdaftarSeats:y=>({success:true,year:y}),
 requestNativeEdaftarOtp:()=>({success:true}),verifyNativeEdaftarOtp:()=>({success:true}),submitNativeEdaftar:()=>({success:true})};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'PagesEdaftar.gs'),'utf8'),ctx);
 return {ctx,values,cache,sent,advance:ms=>now+=ms,loadNative(){vm.runInContext(fs.readFileSync(path.join(root,'release/gas/NativeEdaftar.gs'),'utf8'),ctx);},rpc:(rpc,args=[])=>JSON.parse(ctx.pagesNativeEdaftarPost_({rpc,args}).text)};
}
const prod={UPKK_PAGES_EDAFTAR_MODE:'PRODUCTION',UPKK_PAGES_EDAFTAR_PUBLIC_ENABLED:'true',UPKK_PAGES_EDAFTAR_SPREADSHEET_ID:'WORKBOOK',UPKK_NATIVE_EDAFTAR_ENABLED:'true',
 UPKK_V2_FEES_2027:JSON.stringify({session:'2027',daftar:50,bulanan:50}),
 UPKK_V2_POLICY_2027:JSON.stringify({session:'2027',registrationStart:'2026-11-01',registrationEnd:'2026-12-31',classStart:'2026-12-01',registrationOpen:true})};
test('production gate needs explicit mode, public flag and matching workbook',()=>{for(const patch of [{UPKK_PAGES_EDAFTAR_PUBLIC_ENABLED:'false'},{UPKK_PAGES_EDAFTAR_SPREADSHEET_ID:'OTHER'},{UPKK_PAGES_EDAFTAR_MODE:'typo'}])assert.equal(env({...prod,...patch}).rpc('getNativeEdaftarAvailability').success,false);assert.equal(env(prod).rpc('getNativeEdaftarAvailability').success,true);});
test('production mode replaces tester restriction without falling back to QA',()=>{assert.equal(env({...prod,UPKK_NATIVE_EDAFTAR_TEST_EMAIL:'tester@example.invalid'}).rpc('requestNativeEdaftarOtp',['parent@example.invalid']).success,true);assert.equal(env({...prod,UPKK_PAGES_EDAFTAR_PUBLIC_ENABLED:'false',UPKK_PAGES_EDAFTAR_QA_ENABLED:'true',UPKK_NATIVE_EDAFTAR_TEST_EMAIL:'tester@example.invalid'}).rpc('requestNativeEdaftarOtp',['tester@example.invalid']).success,false);});
test('public Admin RPC stays denied',()=>{assert.equal(env(prod).rpc('getAdminV2Applications',['token']).success,false);});
test('private Admin production guard requires separate flag and exact workbook',()=>{const x=env({...prod,UPKK_PAGES_EDAFTAR_PUBLIC_ENABLED:'false'});assert.equal(x.ctx.pagesNativeEdaftarAdminReady_(),false);x.values.UPKK_PAGES_EDAFTAR_ADMIN_ENABLED='true';assert.equal(x.ctx.pagesNativeEdaftarAdminReady_(),true);x.values.UPKK_PAGES_EDAFTAR_SPREADSHEET_ID='OTHER';assert.equal(x.ctx.pagesNativeEdaftarAdminReady_(),false);});
test('mail budget limits total and per-email even across different identities',()=>{const x=env(prod);for(let i=0;i<5;i++)x.ctx.pagesNativeEdaftarOtpBudget_('a@example.invalid');assert.throws(()=>x.ctx.pagesNativeEdaftarOtpBudget_('a@example.invalid'));const y=env({...prod,UPKK_PAGES_EDAFTAR_OTP_DAILY_LIMIT:'2'});y.ctx.pagesNativeEdaftarOtpBudget_('a@example.invalid');y.ctx.pagesNativeEdaftarOtpBudget_('b@example.invalid');assert.throws(()=>y.ctx.pagesNativeEdaftarOtpBudget_('c@example.invalid'));});
test('mail budget preserves remaining operational allowance',()=>{const x=env(prod);x.ctx.MailApp.getRemainingDailyQuota=()=>20;assert.throws(()=>x.ctx.pagesNativeEdaftarOtpBudget_('a@example.invalid'));});
test('Drive broad sharing fails closed and no sharing permissions are changed',()=>{const x=env(prod);assert.throws(()=>x.ctx.pagesNativeEdaftarPrivate_({getSharingAccess:()=> 'ANYONE_WITH_LINK'}));assert.doesNotThrow(()=>x.ctx.pagesNativeEdaftarPrivate_({getSharingAccess:()=> 'PRIVATE'}));});
test('production fee and class-start drift fail closed',()=>{const x=env(prod);assert.doesNotThrow(()=>x.ctx.pagesNativeEdaftarAssertProductionPolicy_());x.values.UPKK_V2_FEES_2027=JSON.stringify({session:'2027',daftar:40,bulanan:50});assert.throws(()=>x.ctx.pagesNativeEdaftarAssertProductionPolicy_());});
test('OTP bad guesses cannot extend original ten-minute expiry',()=>{const x=env(prod);x.loadNative();x.ctx.requestNativeEdaftarOtp('a@example.invalid');assert.equal(x.sent.length,1);const actual=x.sent[0].body.match(/\b\d{6}\b/)[0];x.advance(9*60000);assert.equal(x.ctx.verifyNativeEdaftarOtp('a@example.invalid',actual==='000000'?'000001':'000000').success,false);x.advance(61000);assert.equal(x.ctx.verifyNativeEdaftarOtp('a@example.invalid',actual).success,false);});
test('native service shares release gate rather than letting script.run bypass it',()=>{const x=env({...prod,UPKK_PAGES_EDAFTAR_PUBLIC_ENABLED:'false'});x.loadNative();assert.equal(x.ctx.requestNativeEdaftarOtp('a@example.invalid').success,false);assert.equal(x.sent.length,0);});

function submissionHarness(options={}){
 const x=env({...prod,UPKK_NATIVE_EDAFTAR_SLIP_FOLDER_ID:'PRIVATE_FOLDER'});
 x.loadNative();
 const header=['Timestamp','Email address','NAMA PENJAGA (SAMA SEPERTI MYKAD)','NAMA MURID (SAMA SEPERTI MYKID)','NO. MYKID','UMUR','NO. TELEFON','ALAMAT PENUH TEMPAT TINGGAL','MUAT NAIK RESIT BAYARAN','BAYARAN','NO RESIT','STATUS',...Array(9).fill('unused'),'STATUS_PERMOHONAN',
 'V2_FEE_DAFTAR','V2_FEE_BULAN_PERTAMA','V2_TOTAL_DIPERLUKAN','V2_APPROVED_BY','V2_APPROVED_AT','V2_REJECT_REASON','unused','unused','V2_TAHUN_KELAS','V2_MOD_KELAS','V2_JENIS_DAFTAR'];
 const rows=[header,...(options.rows||[])];let creates=0,writes=0;
 const range=(r,c,n=1,m=1)=>({
  getDisplayValues:()=>Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>String(rows[r+i-1]?.[c+j-1]||''))),
  getFormula:()=>r===2&&c===6?'=ARRAYFORMULA(A:A)':'=ARRAYFORMULA(IF(V:V="PENDING 2027","PENDING 2027","SELESAI"))',
  getFormulas:()=>Array.from({length:n},()=>Array(m).fill('')),
  setValue:v=>{writes++;rows[r-1]||=(Array(33).fill(''));rows[r-1][c-1]=v;},
  setValues:vals=>{writes++;if(options.fail&&c===1)throw Error('injected partial write');rows[r-1]||=Array(33).fill('');vals[0].forEach((v,j)=>rows[r-1][c+j-1]=v);}
 });
 const sheet={getMaxColumns:()=>33,getLastColumn:()=>33,getLastRow:()=>rows.length,getDataRange:()=>({getValues:()=>rows}),getRange:range};
 x.ctx.SpreadsheetApp={openById:()=>({getSheetByName:()=>sheet}),flush(){}};
 x.ctx.getDaftarColMap=()=>Object.fromEntries(header.map((h,i)=>[h,i]));
 x.ctx.buildColDaftar=()=>({TIMESTAMP:0,EMAIL:1,NAMA_PENJAGA:2,NAMA_MURID:3,NO_MYKID:4,UMUR:5,NO_TELEFON:6,ALAMAT:7,RESIT_UPLOAD:8,STATUS:11,...options.cols});
 x.ctx.upkkAdminV2FeeQuote_=()=>({daftar:50,bulanan:0,total:50});
 x.ctx.nativeEdaftarSlip_=()=>({});
 x.ctx.DriveApp.getFolderById=()=>({getSharingAccess:()=>options.folderAccess||'PRIVATE',createFile:()=>{creates++;return {getSharingAccess:()=> 'PRIVATE',getUrl:()=> 'PRIVATE_FILE',setTrashed(){}};}});
 x.ctx.Logger={log(message){/* no production log output in tests */}};
 const ticket='a'.repeat(64),email='parent@example.invalid';
 const params={email,namaPenjaga:'Dummy Parent',namaMurid:'Dummy Child',mykid:'180101100001',telefon:'0100000000',alamat:'Dummy address',modKelas:options.mode||'FIZIKAL',quotedTotal:50,otpTicket:ticket,slip:{}};
 x.cache.set(x.ctx.nativeEdaftarTicketKey_(ticket),email);
 return {...x,params,rows,stats:()=>({creates,writes})};
}
test('partial Sheet write consumes ticket and leaves durable hold across a fresh OTP',()=>{const x=submissionHarness({fail:true});assert.equal(x.ctx.submitNativeEdaftar(x.params).success,false);assert.equal(JSON.parse(x.values.UPKK_PAGES_EDAFTAR_WRITE_HOLD).row,2);assert.equal(x.cache.get(x.ctx.nativeEdaftarTicketKey_(x.params.otpTicket)),undefined);x.cache.set(x.ctx.nativeEdaftarTicketKey_(x.params.otpTicket),x.params.email);assert.equal(x.ctx.submitNativeEdaftar(x.params).success,false);assert.equal(x.stats().creates,1);});
test('successful pending write clears hold and replay cannot create another file',()=>{const x=submissionHarness();var saved=x.ctx.submitNativeEdaftar(x.params);assert.equal(saved.success,true,JSON.stringify(saved));assert.equal(x.rows[1][21],'PENDING 2027');assert.equal(x.values.UPKK_PAGES_EDAFTAR_WRITE_HOLD,undefined);assert.equal(x.ctx.submitNativeEdaftar(x.params).success,false);assert.equal(x.stats().creates,1);assert.equal(x.rows[1][5],'');assert.equal(x.rows[1][10],'');assert.equal(x.rows[1][11],'');});
test('header drift is rejected before upload or Sheet writes',()=>{const x=submissionHarness({cols:{EMAIL:2,NAMA_PENJAGA:1}});assert.equal(x.ctx.submitNativeEdaftar(x.params).success,false);assert.deepEqual(x.stats(),{creates:0,writes:0});});
test('shared slip folder is rejected before createFile',()=>{const x=submissionHarness({folderAccess:'ANYONE_WITH_LINK'});assert.equal(x.ctx.submitNativeEdaftar(x.params).success,false);assert.equal(x.stats().creates,0);});
test('real submit enforces physical30 and online20 per year before writes',()=>{for(const [mode,max] of [['FIZIKAL',30],['ONLINE',20]]){const rows=Array.from({length:max},()=>{const r=Array(33).fill('');r[21]='PENDING 2027';r[30]=3;r[31]=mode;return r;});const x=submissionHarness({rows,mode});assert.equal(x.ctx.submitNativeEdaftar(x.params).code,'CLASS_FULL');assert.deepEqual(x.stats(),{creates:0,writes:0});}});
test('integration hooks never dispatch legacy data or Admin APIs',()=>{const x=env(prod);vm.runInContext(fs.readFileSync(path.join(root,'release/gas/Code.routes.gs.txt'),'utf8'),x.ctx);for(const action of ['testResit','getAdminDashboard','submitBayaran'])assert.equal(JSON.parse(x.ctx.doPost({postData:{contents:JSON.stringify({action})}}).text).success,false);assert.equal(JSON.parse(x.ctx._handleApi('testResit',{callback:'evil'}).text).success,false);assert.equal(JSON.parse(x.ctx.doPost({postData:{contents:'not JSON private payload'}}).text).message.includes('private'),false);});

async function availabilityUI(fees){
 const elements=Object.fromEntries(['ed-slip-label','ed-fee-quote','ed-request-otp','ed-status'].map(k=>[k,{textContent:'',disabled:true}]));
 const c={window:{},document:{addEventListener(){},getElementById:id=>elements[id]||null},AbortController,setTimeout,clearTimeout};
 vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'edaftar.js'),'utf8'),c);
 c.pagesEdaftarRpc=async()=>({success:true,enabled:true,feeReady:true,session:'2027',configuredFees:fees});
 c.initNativeEdaftarQA();await new Promise(setImmediate);return c;
}
test('frontend refuses malformed or inconsistent fee quote',async()=>{for(const fees of [{},{daftar:50,bulanan:0,total:100},{daftar:40,bulanan:0,total:40}])assert.equal((await availabilityUI(fees)).nativeEdaftarState.available,false);});
test('frontend accepts both confirmed registration fee contracts',async()=>{for(const bulanan of [0,50])assert.equal((await availabilityUI({daftar:50,bulanan,total:50+bulanan})).nativeEdaftarState.available,true);});
test('patched Admin auth still refuses forged tokens when production Admin is enabled',()=>{const x=env({...prod,UPKK_PAGES_EDAFTAR_ADMIN_ENABLED:'true'});vm.runInContext(fs.readFileSync(path.join(root,'release/gas/AdminV2.gs'),'utf8'),x.ctx);assert.throws(()=>x.ctx.upkkAdminV2Auth_('forged'));assert.doesNotThrow(()=>x.ctx.upkkAdminV2Guard_());});

test('Admin cannot fall back to old QA flag in production mode',()=>{const x=env({...prod,UPKK_ADMIN_V2_QA_ENABLED:'true',UPKK_PAGES_EDAFTAR_SPREADSHEET_ID:'OTHER'});vm.runInContext(fs.readFileSync(path.join(root,'release/gas/AdminV2.gs'),'utf8'),x.ctx);x.ctx.SPREADSHEET_ID=vm.runInContext('UPKK_ADMIN_V2_QA_ID_',x.ctx);assert.throws(()=>x.ctx.upkkAdminV2Guard_());});
test('QA setup functions are unavailable in production even to authenticated Admin',()=>{const x=env({...prod,UPKK_PAGES_EDAFTAR_ADMIN_ENABLED:'true'});x.loadNative();vm.runInContext(fs.readFileSync(path.join(root,'release/gas/AdminV2.gs'),'utf8'),x.ctx);x.ctx.upkkAdminV2Auth_=()=> 'admin@example.invalid';let reads=0;x.ctx.upkkAdminV2Sheet_=()=>{reads++;throw Error('unexpected Sheet access');};const out=x.ctx.prepareAdminV2QaSheet('token');assert.equal(out.success,false);assert.equal(reads,0);assert.match(out.message,/QA.*production|production.*QA/i);const intake=x.ctx.prepareNativeEdaftarIntakeQa('token');assert.match(intake.message,/QA.*production|production.*QA/i);});

test('registrationOpen false prevents mail, upload and writes despite public flag true',()=>{const x=submissionHarness();const policy=JSON.parse(x.values.UPKK_V2_POLICY_2027);policy.registrationOpen=false;x.values.UPKK_V2_POLICY_2027=JSON.stringify(policy);assert.equal(x.ctx.requestNativeEdaftarOtp(x.params.email).success,false);assert.equal(x.ctx.submitNativeEdaftar(x.params).success,false);assert.equal(x.sent.length,0);assert.deepEqual(x.stats(),{creates:0,writes:0});});
test('OTP verification is one use and five bad guesses block even a correct code',()=>{const x=env(prod);x.loadNative();x.ctx.requestNativeEdaftarOtp('a@example.invalid');const code=x.sent[0].body.match(/\b\d{6}\b/)[0];assert.equal(x.ctx.verifyNativeEdaftarOtp('a@example.invalid',code).success,true);assert.equal(x.ctx.verifyNativeEdaftarOtp('a@example.invalid',code).success,false);const y=env(prod);y.loadNative();y.ctx.requestNativeEdaftarOtp('b@example.invalid');const correct=y.sent[0].body.match(/\b\d{6}\b/)[0],wrong=correct==='000000'?'000001':'000000';for(let i=0;i<5;i++)assert.equal(y.ctx.verifyNativeEdaftarOtp('b@example.invalid',wrong).success,false);assert.equal(y.ctx.verifyNativeEdaftarOtp('b@example.invalid',correct).success,false);});
