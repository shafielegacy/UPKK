/**
 * Registration-only HTTPS POST adapter. QA remains backward-compatible.
 * PRODUCTION requires separate, explicit flags AND exact workbook binding.
 * No Admin method is exposed; doGet/JSONP must not dispatch this adapter.
 */
function pagesNativeEdaftarMode_() {
  return PropertiesService.getScriptProperties().getProperty('UPKK_PAGES_EDAFTAR_MODE') || 'QA';
}
function pagesNativeEdaftarBound_() {
  const expected=PropertiesService.getScriptProperties().getProperty('UPKK_PAGES_EDAFTAR_SPREADSHEET_ID');
  return !!expected && typeof SPREADSHEET_ID!=='undefined' && expected===SPREADSHEET_ID;
}
function pagesNativeEdaftarGate_() {
  const p=PropertiesService.getScriptProperties(),mode=pagesNativeEdaftarMode_();
  if(mode==='PRODUCTION')return pagesNativeEdaftarBound_() &&
    p.getProperty('UPKK_PAGES_EDAFTAR_PUBLIC_ENABLED')==='true';
  if(mode!=='QA')return false;
  const tester=String(p.getProperty('UPKK_NATIVE_EDAFTAR_TEST_EMAIL')||'').trim();
  const bound=p.getProperty('UPKK_PAGES_EDAFTAR_SPREADSHEET_ID');
  return p.getProperty('UPKK_PAGES_EDAFTAR_QA_ENABLED')==='true' && !!tester &&
    (!bound || pagesNativeEdaftarBound_());
}
function pagesNativeEdaftarAdminReady_() {
  return pagesNativeEdaftarMode_()==='PRODUCTION' && pagesNativeEdaftarBound_() &&
    PropertiesService.getScriptProperties().getProperty('UPKK_PAGES_EDAFTAR_ADMIN_ENABLED')==='true';
}
function pagesNativeEdaftarEmailAllowed_(email) {
  if(!pagesNativeEdaftarGate_())return false;
  if(typeof email!=='string'||!/^[^\s@]{1,64}@[^\s@]{1,189}\.[^\s@]{2,}$/.test(email.trim()))return false;
  return pagesNativeEdaftarMode_()==='PRODUCTION' ||
    email.trim().toLowerCase()===String(PropertiesService.getScriptProperties()
      .getProperty('UPKK_NATIVE_EDAFTAR_TEST_EMAIL')||'').trim().toLowerCase();
}
function pagesNativeEdaftarValidDate_(s) {
  if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
  const d=new Date(s+'T00:00:00Z');
  return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s;
}
function pagesNativeEdaftarAssertProductionPolicy_() {
  if(pagesNativeEdaftarMode_()!=='PRODUCTION')return;
  const p=PropertiesService.getScriptProperties();
  const fees=JSON.parse(p.getProperty('UPKK_V2_FEES_2027')||'null');
  const policy=JSON.parse(p.getProperty('UPKK_V2_POLICY_2027')||'null');
  if(!fees || fees.session!=='2027' || Number(fees.daftar)!==50 || Number(fees.bulanan)!==50 ||
     !policy || policy.session!=='2027' || policy.classStart!=='2026-12-01' ||
     typeof policy.registrationEnd!=='string' ||
     !/^\d{4}-\d{2}-\d{2}$/.test(policy.registrationStart||'') ||
     !/^\d{4}-\d{2}-\d{2}$/.test(policy.classStart||'') ||
     (policy.registrationEnd!=='' && !/^\d{4}-\d{2}-\d{2}$/.test(policy.registrationEnd)) ||
     !pagesNativeEdaftarValidDate_(policy.registrationStart) ||
     !pagesNativeEdaftarValidDate_(policy.classStart) ||
     (policy.registrationEnd!=='' && !pagesNativeEdaftarValidDate_(policy.registrationEnd)) ||
     policy.registrationStart>policy.classStart ||
     (policy.registrationEnd!=='' && policy.registrationStart>policy.registrationEnd) ||
     typeof policy.registrationOpen!=='boolean')
    throw new Error('Tetapan pengambilan/yuran 2027 belum disahkan.');
}
function pagesNativeEdaftarPrivate_(item) {
  // PRIVATE excludes broad domain/link access, not individually shared ACL entries.
  // Owner must also audit named viewers/editors and inherited permissions.
  if(item.getSharingAccess()!==DriveApp.Access.PRIVATE)
    throw new Error('Folder/fail slip mesti restricted tanpa akses domain atau pautan awam.');
}
function pagesNativeEdaftarOtpBudget_(email) {
  // Called ONLY while native request holds its existing script lock.
  const p=PropertiesService.getScriptProperties(),cache=CacheService.getScriptCache();
  const capRaw=p.getProperty('UPKK_PAGES_EDAFTAR_OTP_DAILY_LIMIT');
  const cap=capRaw===null?50:Number(capRaw);
  if(!Number.isInteger(cap)||cap<1||cap>500)throw new Error('Had OTP tidak sah.');
  if(MailApp.getRemainingDailyQuota()<=20)throw new Error('Perkhidmatan OTP sibuk. Cuba lagi kemudian.');
  const day=Utilities.formatDate(new Date(),'Asia/Kuala_Lumpur','yyyy-MM-dd');
  const raw=p.getProperty('UPKK_PAGES_EDAFTAR_OTP_DAY');
  const state=raw?JSON.parse(raw):{day:day,count:0};
  const count=state.day===day?Number(state.count):0;
  if(!Number.isInteger(count)||count<0||count>=cap)throw new Error('Had OTP harian dicapai. Cuba lagi kemudian.');
  const key='upkk:ne:hour:'+nativeEdaftarDigest_(email).slice(0,38);
  const hourlyRaw=cache.get(key),hourly=hourlyRaw?JSON.parse(hourlyRaw):null;
  const hour=hourly&&hourly.until>Date.now()?hourly:{count:0,until:Date.now()+3600000};
  if(!Number.isInteger(hour.count)||hour.count<0||hour.count>=5)throw new Error('Terlalu banyak permintaan OTP. Cuba lagi kemudian.');
  // Reserve before MailApp; failed sends deliberately also consume the budget.
  p.setProperty('UPKK_PAGES_EDAFTAR_OTP_DAY',JSON.stringify({day:day,count:count+1}));
  cache.put(key,JSON.stringify({count:hour.count+1,until:hour.until}),Math.max(1,Math.ceil((hour.until-Date.now())/1000)));
}
function pagesNativeEdaftarPost_(body) {
  const reply=result=>ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  const closed=()=>reply({success:false,message:'Pendaftaran belum dibuka kepada umum.'});
  try {
    if(!pagesNativeEdaftarGate_())return closed();
    if(!body || typeof body!=='object' || body.callback || body.prefix || !Array.isArray(body.args))return closed();
    const rpc=body.rpc,args=body.args;
    const counts={getNativeEdaftarAvailability:0,getNativeEdaftarSeats:1,requestNativeEdaftarOtp:1,verifyNativeEdaftarOtp:2,submitNativeEdaftar:1};
    if(!Object.prototype.hasOwnProperty.call(counts,rpc)||args.length!==counts[rpc])return closed();
    const email=rpc==='submitNativeEdaftar'?args[0]&&args[0].email:args[0];
    if(['requestNativeEdaftarOtp','verifyNativeEdaftarOtp','submitNativeEdaftar'].includes(rpc)&&!pagesNativeEdaftarEmailAllowed_(email))return closed();
    let result;
    switch(rpc) {
      case 'getNativeEdaftarAvailability':result=getNativeEdaftarAvailability();break;
      case 'getNativeEdaftarSeats':
        if(![3,4,5].includes(args[0]))return closed();
        result=getNativeEdaftarSeats(args[0]);break;
      case 'requestNativeEdaftarOtp':result=requestNativeEdaftarOtp(email);break;
      case 'verifyNativeEdaftarOtp':
        if(!/^\d{6}$/.test(String(args[1]||'')))return closed();
        result=verifyNativeEdaftarOtp(email,String(args[1]));break;
      case 'submitNativeEdaftar':result=submitNativeEdaftar(args[0]);break;
    }
    return reply(result);
  }catch(e){return reply({success:false,message:'Perkhidmatan pendaftaran belum tersedia. Hubungi urusetia.'});}
}
