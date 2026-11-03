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
// Private folder for unverified slips; owner must set the property before enabling submissions.
const NATIVE_EDAFTAR_SLIP_FOLDER_ = 'UPKK_NATIVE_EDAFTAR_SLIP_FOLDER_ID';
const NATIVE_EDAFTAR_MAX_SLIP_ = 3 * 1024 * 1024;
function nativeEdaftarSlip_(params) {
  const file = params || {};
  const type = String(file.mimeType || '').trim().toLowerCase();
  const allowed = {'image/jpeg':'.jpg','image/png':'.png','application/pdf':'.pdf'};
  if (!allowed[type]) throw new Error('Gunakan slip JPEG, PNG atau PDF sahaja.');
  const base64 = String(file.base64 || '');
  if (!base64 || base64.length > 4 * 1024 * 1024 + 2048 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) throw new Error('Fail slip tidak sah atau melebihi 3 MB.');
  let bytes;
  try {bytes = Utilities.base64Decode(base64);} catch(e){throw new Error('Fail slip tidak dapat dibaca.');}
  if (!bytes.length || bytes.length > NATIVE_EDAFTAR_MAX_SLIP_)
    throw new Error('Saiz slip maksimum ialah 3 MB.');
  const b = bytes.map(v => v & 255);
  const valid = type === 'image/jpeg'
    ? b.length >= 4 && b[0] === 255 && b[1] === 216 && b[b.length - 2] === 255 && b[b.length - 1] === 217
    : type === 'image/png'
      ? b.length >= 8 && [137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v)
      : b.length >= 5 && [37,80,68,70,45].every((v,i)=>b[i]===v);
  if (!valid) throw new Error('Kandungan slip tidak sepadan dengan format fail.');
  return Utilities.newBlob(bytes,type,'UPKK_SLIP_2027_'+Utilities.getUuid()+allowed[type]);
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
  // Prevent uploading a slip before OTP verification and duplicate checks.
  let slipBlob;
  try {slipBlob=nativeEdaftarSlip_(params.slip);} catch(e) {
    return {success:false,message:e.message};
  }
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(20000))return {success:false,message:'Sistem sibuk. Cuba semula.'};
  try {
    const cache=CacheService.getScriptCache(),otpKey=nativeEdaftarOtpKey_(email),raw=cache.get(otpKey);
    if(!raw||!JSON.parse(raw).verified)return {success:false,message:'Sahkan e-mel melalui OTP dahulu.'};
    const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB.DAFTAR);
    if(!sheet) return {success:false,message:'Tab pendaftaran tidak tersedia.'};
    // Fail closed if any official header moved/renamed: never write to fallback columns.
    const requiredHeaders=[
      'Timestamp','Email address','NAMA PENJAGA (SAMA SEPERTI MYKAD)',
      'NAMA MURID (SAMA SEPERTI MYKID)','NO. MYKID','UMUR','NO. TELEFON',
      'ALAMAT PENUH TEMPAT TINGGAL','MUAT NAIK RESIT BAYARAN',
      'BAYARAN','NO RESIT','STATUS'
    ];
    const map=getDaftarColMap(sheet);
    if(requiredHeaders.some(h=>!Object.prototype.hasOwnProperty.call(map,h)))
      return {success:false,message:'Struktur tab pendaftaran berubah. Hubungi urusetia.'};
    const col=buildColDaftar(sheet);
    const rows=sheet.getDataRange().getValues();
    for(let i=1;i<rows.length;i++){
      if (String(rows[i][col.NO_MYKID]||'').replace(/\D/g,'')===mykid)
        return {success:false,code:'EXISTING_STUDENT',message:'MyKid ini sudah mempunyai rekod. Hubungi urusetia untuk semakan atau sambungan kelas.'};
    }
    const folderId = PropertiesService.getScriptProperties().getProperty(NATIVE_EDAFTAR_SLIP_FOLDER_);
    if (!folderId) return {success:false,message:'Folder slip pendaftaran belum dikonfigurasi.'};
    let folder;
    try {folder=DriveApp.getFolderById(folderId);} catch(e) {
      return {success:false,message:'Folder slip tidak dapat diakses.'};
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
    // No receipt number or confirmed amount until payment verification.
    out[col.STATUS]='PENDING 2027';
    let slipFile;
    let writeAttempted=false;
    try {
      slipFile=folder.createFile(slipBlob);
      // Private Google Drive file. Do NOT set ANYONE_WITH_LINK.
      out[col.RESIT_UPLOAD]=slipFile.getUrl();
      writeAttempted=true;
      sheet.getRange(sheet.getLastRow()+1,1,1,headers.length).setValues([out]);
      SpreadsheetApp.flush();
      cache.remove(otpKey);
      return {success:true,message:'Permohonan dan slip RM50 diterima untuk semakan urusetia. Bayaran belum disahkan.'};
    } catch(writeErr) {
      Logger.log('Native eDaftar write error: '+writeErr.message);
      // If Sheets write was attempted, preserve the private slip for reconciliation.
      // Do not auto-retry because the row may have been written.
      if(slipFile && !writeAttempted) {try{slipFile.setTrashed(true);}catch(cleanErr){}}
      return {success:false,message:'Status simpanan tidak dapat disahkan. Hubungi urusetia, jangan hantar pendaftaran sekali lagi sehingga disemak.'};
    }
  } catch(err) {
    Logger.log('Native eDaftar error: '+err.message);
    return {success:false,message:'Pendaftaran belum dapat disahkan. Hubungi urusetia sebelum menghantar semula.'};
  } finally {lock.releaseLock();}
}
