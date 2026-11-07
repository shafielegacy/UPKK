// Unmodified helper excerpts from V2 fd0a3c38e5d3d11c31b93633913adc3224bdfe92.
// This snapshot validates reuse; it does not verify the currently deployed GAS source.
function upkkAdminV2FeeQuote_(date){
  const today=date||Utilities.formatDate(new Date(),'Asia/Kuala_Lumpur','yyyy-MM-dd');
  const policy=upkkAdminV2ReadPolicy_();
  const raw=PropertiesService.getScriptProperties().getProperty(UPKK_ADMIN_V2_FEES_);
  if(!raw)throw new Error('Kadar yuran belum ditetapkan.');
  const fees=JSON.parse(raw);
  if(fees.session!=='2027'||![fees.daftar,fees.bulanan].every(n=>Number.isFinite(Number(n))&&Number(n)>=0))
    throw new Error('Konfigurasi yuran sesi 2027 tidak sah.');
  const firstMonth=today.slice(0,7)<policy.classStart.slice(0,7)?'':today.slice(0,7);
  // Before class starts, the registration fee alone reserves the place.
  const monthly=firstMonth?Number(fees.bulanan):0;
  return {daftar:Number(fees.daftar),bulanan:monthly,total:Number(fees.daftar)+monthly,
    firstMonth:firstMonth,policy:policy};
}
function nativeEdaftarBirth_(value) {
  const digits=String(value||'').replace(/\D/g,'');
  if(!/^\d{12}$/.test(digits))return null;
  const yy=Number(digits.slice(0,2));
  const year=2000+yy;
  const month=Number(digits.slice(2,4)),day=Number(digits.slice(4,6));
  const date=new Date(Date.UTC(year,month-1,day));
  if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)return null;
  const ageInSession=Number(NATIVE_EDAFTAR_SESSION_)-year;
  return {digits:digits,year:year,ageInSession:ageInSession};
}
function nativeEdaftarIntakeUsed_(rows,year,mode,col,map){
  return rows.slice(1).filter(r=>
    Number(r[30])===year && String(r[31]||'').trim()===mode &&
    ['PENDING 2027','APPROVED 2027'].includes(String(r[map.STATUS_PERMOHONAN]||'').trim())
  ).length;
}