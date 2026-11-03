/**
 * UPKK Native eDaftar — QA candidate (NOT deployed).
 * Runs only inside GAS HTML Service via google.script.run.
 * Disabled by default: set Script Property UPKK_NATIVE_EDAFTAR_ENABLED=true
 * only after owner approves deployment and flow.
 * Never expose these actions through doGet/JSONP.
 */
const NATIVE_EDAFTAR_FLAG_ = 'UPKK_NATIVE_EDAFTAR_ENABLED';
const NATIVE_EDAFTAR_TTL_ = 600;
const NATIVE_EDAFTAR_SESSION_ = '2027';
function nativeEdaftarEnabled_() {
  return PropertiesService.getScriptProperties().getProperty(NATIVE_EDAFTAR_FLAG_) === 'true';
}
function getNativeEdaftarAvailability() {
  return { success:true, enabled:nativeEdaftarEnabled_(), session:NATIVE_EDAFTAR_SESSION_ };
}
function nativeEdaftarEmail_(s) {
  const value = String(s || '').trim().toLowerCase();
  return /^[^\s@]{1,64}@[^\s@]{1,189}\.[^\s@]{2,}$/.test(value) ? value : '';
}
function nativeEdaftarDigest_(s) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s)).replace(/=+$/,'');
}
function nativeEdaftarOtpKey_(email) {return 'upkk:ne:otp:' + nativeEdaftarDigest_(email).slice(0,38);}
function nativeEdaftarRateKey_(email) {return 'upkk:ne:rate:' + nativeEdaftarDigest_(email).slice(0,38);}
function requestNativeEdaftarOtp(email) {
  if (!nativeEdaftarEnabled_()) return {success:false,message:'Pendaftaran belum dibuka.'};
  email = nativeEdaftarEmail_(email);
  if (!email) return {success:false,message:'Alamat e-mel tidak sah.'};
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return {success:false,message:'Sistem sibuk. Cuba semula.'};
  try {
    const cache = CacheService.getScriptCache();
    if (cache.get(nativeEdaftarRateKey_(email))) return {success:false,message:'Tunggu sekurang-kurangnya 60 saat sebelum meminta kod baharu.'};
    // Generate unpredictable 6-digit code, keep only SHA-256 digest in server cache.
    const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,Utilities.getUuid()+Utilities.getUuid()+String(Date.now()));
    const n = ((((bytes[0]&255)*65536)+((bytes[1]&255)*256)+(bytes[2]&255))%1000000);
    const otp = String(n).padStart(6,'0');
    const salt = Utilities.getUuid();
    const record = {digest:nativeEdaftarDigest_(salt+':'+otp),salt:salt,attempts:0,verified:false};
    cache.put(nativeEdaftarOtpKey_(email),JSON.stringify(record),NATIVE_EDAFTAR_TTL_);
    cache.put(nativeEdaftarRateKey_(email),'1',60);
    try {
      MailApp.sendEmail({
        to:email,subject:'Kod OTP eDaftar UPKK SRA Paya Rumput',
        body:'Kod pengesahan e-mel anda: '+otp+'\nKod tamat tempoh dalam 10 minit.\nJika anda tidak meminta kod ini, abaikan e-mel.'
      });
    } catch(err) {
      cache.remove(nativeEdaftarOtpKey_(email));
      return {success:false,message:'Kod tidak dapat dihantar. Cuba lagi kemudian.'};
    }
    return {success:true,message:'Kod OTP dihantar ke e-mel. Sah selama 10 minit.'};
  } finally {lock.releaseLock();}
}
function verifyNativeEdaftarOtp(email,otp) {
  if (!nativeEdaftarEnabled_()) return {success:false,message:'Pendaftaran belum dibuka.'};
  email = nativeEdaftarEmail_(email);
  if (!email || !/^\d{6}$/.test(String(otp||''))) return {success:false,message:'Kod pengesahan tidak sah.'};
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return {success:false,message:'Sistem sibuk. Cuba semula.'};
  try {
    const cache = CacheService.getScriptCache(),key=nativeEdaftarOtpKey_(email),raw=cache.get(key);
    if (!raw) return {success:false,message:'Kod tamat tempoh. Minta kod baharu.'};
    const state=JSON.parse(raw);
    if (state.verified) return {success:true,message:'E-mel telah disahkan.'};
    if (state.attempts>=5) return {success:false,message:'Terlalu banyak percubaan. Minta kod baharu.'};
    state.attempts++;
    if (nativeEdaftarDigest_(state.salt+':'+otp)!==state.digest) {
      cache.put(key,JSON.stringify(state),NATIVE_EDAFTAR_TTL_);
      return {success:false,message:'Kod tidak tepat.'};
    }
    state.verified=true;
    cache.put(key,JSON.stringify(state),NATIVE_EDAFTAR_TTL_);
    return {success:true,message:'E-mel berjaya disahkan.'};
  } finally {lock.releaseLock();}
}
function submitNativeEdaftar(params) {
  if (!nativeEdaftarEnabled_()) return {success:false,message:'Pendaftaran belum dibuka.'};
  params=params||{};
  const email=nativeEdaftarEmail_(params.email);
  const name=s=>String(s||'').trim().replace(/\s+/g,' ').slice(0,150);
  const penjaga=name(params.namaPenjaga),murid=name(params.namaMurid);
  const mykid=String(params.mykid||'').replace(/\D/g,'');
  const tel=String(params.telefon||'').replace(/[\s\-]/g,'').trim();
  const umur=Number(params.umur);
  const alamat=String(params.alamat||'').trim().slice(0,500);
  if (!email||!penjaga||!murid||!/^(\d{12})$/.test(mykid)||!/^(\+?6?0?\d{9,12})$/.test(tel)||![9,10,11,12].includes(umur)||!alamat)
    return {success:false,message:'Maklumat pendaftaran tidak lengkap atau tidak sah.'};
  if ([penjaga,murid,alamat].some(s=>/^[=+\-@]/.test(s))) return {success:false,message:'Maklumat teks tidak sah.'};
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(20000))return {success:false,message:'Sistem sibuk. Cuba semula.'};
  try {
    const cache=CacheService.getScriptCache(),otpKey=nativeEdaftarOtpKey_(email),raw=cache.get(otpKey);
    if(!raw||!JSON.parse(raw).verified)return {success:false,message:'Sahkan e-mel melalui OTP dahulu.'};
    const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB.DAFTAR);
    if(!sheet) return {success:false,message:'Tab pendaftaran tidak tersedia.'};
    const col=buildColDaftar(sheet);
    const rows=sheet.getDataRange().getValues();
    for(let i=1;i<rows.length;i++){
      if (String(rows[i][col.NO_MYKID]||'').replace(/\D/g,'')===mykid)
        return {success:false,code:'EXISTING_STUDENT',message:'MyKid ini sudah mempunyai rekod. Hubungi urusetia untuk semakan atau sambungan kelas.'};
    }
    const headers=rows[0];
    const out=new Array(headers.length).fill('');
    out[col.TIMESTAMP]=new Date();
    out[col.EMAIL]=email;
    out[col.NAMA_PENJAGA]=penjaga;
    out[col.NAMA_MURID]=murid;
    out[col.NO_MYKID]="'"+mykid; // Preserve all leading digits as spreadsheet text.
    out[col.UMUR]=umur;out[col.NO_TELEFON]="'"+tel;
    out[col.ALAMAT]=alamat;
    // Do not claim RM50 paid, create receipt or mark SELESAI without a real payment.
    out[col.STATUS]='PENDING 2027';
    sheet.getRange(sheet.getLastRow()+1,1,1,headers.length).setValues([out]);
    SpreadsheetApp.flush();
    cache.remove(otpKey); // single use on success
    return {success:true,message:'Pendaftaran diterima untuk semakan urusetia. Bayaran belum direkodkan.'};
  } catch(err) {
    Logger.log('Native eDaftar error: '+err.message);
    return {success:false,message:'Pendaftaran belum dapat disahkan. Hubungi urusetia sebelum menghantar semula.'};
  } finally {lock.releaseLock();}
}
