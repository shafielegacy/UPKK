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
// During the first real-Google smoke test, only one nominated parent e-mail can submit.
// Keep UPKK_NATIVE_EDAFTAR_TEST_EMAIL set until the owner explicitly opens enrolment.
function nativeEdaftarAllowedEmail_(email) {
  const guard = nativeEdaftarEmail_(PropertiesService.getScriptProperties().getProperty('UPKK_NATIVE_EDAFTAR_TEST_EMAIL'));
  return !guard || email === guard;
}
// Owner-confirmed intake 2026: Year 3/4/5; physical 30 and online 20 per year.
const NE_INTAKE_COLS_=['V2_TAHUN_KELAS','V2_MOD_KELAS','V2_JENIS_DAFTAR'];
const NE_INTAKE_MAX_={FIZIKAL:30,ONLINE:20};
function nativeEdaftarIntakeOpen_(){
  const date=Utilities.formatDate(new Date(),'Asia/Kuala_Lumpur','yyyy-MM-dd');
  const policy=upkkAdminV2ReadPolicy_();
  return policy.registrationOpen===true && date>=policy.registrationStart &&
    (!policy.registrationEnd || date<=policy.registrationEnd);
}
function nativeEdaftarIntakeHeaders_(sheet){
  // AE/AF/AG only. AC=TAHUN and AD=V2_NO_RESIT are already occupied.
  if(sheet.getMaxColumns()<33)throw new Error('Admin perlu sediakan kolum AE:AG sebelum pendaftaran.');
  const headers=sheet.getRange(1,31,1,3).getDisplayValues()[0];
  if(NE_INTAKE_COLS_.some((x,i)=>headers[i]!==x))
    throw new Error('Kolum kelas/mod/jenis belum disediakan oleh Admin.');
}
function nativeEdaftarIntakeUsed_(rows,year,mode,col,map){
  return rows.slice(1).filter(r=>
    Number(r[30])===year && String(r[31]||'').trim()===mode &&
    ['PENDING 2027','APPROVED 2027'].includes(String(r[map.STATUS_PERMOHONAN]||'').trim())
  ).length;
}
/**
 * Public, privacy-safe seat counts for the class derived from MyKid.
 * Informational only: submitNativeEdaftar enforces capacity under LockService.
 * Return no child records or identifying data.
 */
function getNativeEdaftarSeats(year) {
  try {
    year=Number(year);
    if(![3,4,5].includes(year))return {success:false,message:'Tahun kelas tidak sah.'};
    if(!nativeEdaftarEnabled_()||!nativeEdaftarIntakeOpen_())
      return {success:false,message:'Pendaftaran belum dibuka.'};
    const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB.DAFTAR);
    if(!sheet)throw new Error('Tab pendaftaran tiada.');
    nativeEdaftarIntakeHeaders_(sheet);
    const rows=sheet.getDataRange().getValues();
    const map=getDaftarColMap(sheet);
    if(map.STATUS_PERMOHONAN!==21)throw new Error('Kolum status permohonan tidak sepadan.');
    const remaining={};
    Object.keys(NE_INTAKE_MAX_).forEach(mode=>{
      const used=nativeEdaftarIntakeUsed_(rows,year,mode,null,map);
      remaining[mode]=Math.max(0,NE_INTAKE_MAX_[mode]-used);
    });
    return {success:true,year:year,remaining:remaining};
  } catch(e) {
    return {success:false,message:'Baki tempat belum dapat disemak. Sila cuba lagi.'};
  }
}
function prepareNativeEdaftarIntakeQa(token){
  try{
    upkkAdminV2Auth_(token);upkkAdminV2Guard_();
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(15000))throw new Error('Sistem sibuk.');
    try{
      const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB.DAFTAR);
      if(!sheet)throw new Error('Tab pendaftaran tiada.');
      if(sheet.getMaxColumns()<33)
        sheet.insertColumnsAfter(sheet.getMaxColumns(),33-sheet.getMaxColumns());
      const existing=sheet.getRange(1,31,1,3).getDisplayValues()[0];
      if(existing.some((v,i)=>v&&v!==NE_INTAKE_COLS_[i]))
        throw new Error('Kolum AE:AG sudah digunakan. Tiada perubahan dibuat.');
      sheet.getRange(1,31,1,3).setValues([NE_INTAKE_COLS_]);
      return {success:true,message:'Kolum AE:AG untuk Tahun, Mod dan Jenis Pendaftaran telah disediakan pada BACKUP.'};
    }finally{lock.releaseLock();}
  }catch(e){return {success:false,message:e.message};}
}
function getNativeEdaftarAvailability() {
  const raw=PropertiesService.getScriptProperties().getProperty('UPKK_V2_FEES_2027');
  const fees=raw?JSON.parse(raw):null;
  let quote=null;
  try {quote=upkkAdminV2FeeQuote_();} catch(e){}
  return {success:true,enabled:nativeEdaftarEnabled_()&&nativeEdaftarIntakeOpen_(),
    session:NATIVE_EDAFTAR_SESSION_,intakeOpen:nativeEdaftarIntakeOpen_(),
    feeReady:!!quote,configuredFees:quote?{
      daftar:quote.daftar,bulanan:quote.bulanan,total:quote.total,firstMonth:quote.firstMonth
    }:null};
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
function nativeEdaftarTicketKey_(ticket) {
  return 'upkk:ne:ticket:' + nativeEdaftarDigest_(ticket).slice(0,38);
}
function requestNativeEdaftarOtp(email) {
  if (!nativeEdaftarEnabled_()) return {success:false,message:'Pendaftaran belum dibuka.'};
  email = nativeEdaftarEmail_(email);
  if (!email) return {success:false,message:'Alamat e-mel tidak sah.'};
  if (!nativeEdaftarAllowedEmail_(email)) return {success:false,message:'Pendaftaran belum dibuka kepada umum.'};
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
  if (!nativeEdaftarAllowedEmail_(email)) return {success:false,message:'Pendaftaran belum dibuka kepada umum.'};
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return {success:false,message:'Sistem sibuk. Cuba semula.'};
  try {
    const cache = CacheService.getScriptCache(),key=nativeEdaftarOtpKey_(email),raw=cache.get(key);
    if (!raw) return {success:false,message:'Kod tamat tempoh. Minta kod baharu.'};
    const state=JSON.parse(raw);
    // A previously-used OTP cannot issue another submission ticket.
    if (state.verified) return {success:false,message:'OTP sudah digunakan. Minta kod baharu.'};
    if (state.attempts>=5) return {success:false,message:'Terlalu banyak percubaan. Minta kod baharu.'};
    state.attempts++;
    if (nativeEdaftarDigest_(state.salt+':'+otp)!==state.digest) {
      cache.put(key,JSON.stringify(state),NATIVE_EDAFTAR_TTL_);
      return {success:false,message:'Kod tidak tepat.'};
    }
    const ticket=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');
    // OTP is one-use; ticket is scoped to this verified e-mail and expires.
    cache.remove(key);
    cache.put(nativeEdaftarTicketKey_(ticket),email,NATIVE_EDAFTAR_TTL_);
    return {success:true,ticket:ticket,message:'E-mel berjaya disahkan. Hantar pendaftaran dalam 10 minit.'};
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

// School intake uses age attained during session year, not today's age.
// A MyKid must contain a real Gregorian birth date and a 12-digit identifier.
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
function nativeEdaftarDisplayMykid_(digits) {
  return digits.slice(0,6)+'-'+digits.slice(6,8)+'-'+digits.slice(8);
}
function submitNativeEdaftar(params) {
  if (!nativeEdaftarEnabled_()) return {success:false,message:'Pendaftaran belum dibuka.'};
  params=params||{};
  const email=nativeEdaftarEmail_(params.email);
  if (!nativeEdaftarAllowedEmail_(email)) return {success:false,message:'Pendaftaran belum dibuka kepada umum.'};
  const name=s=>String(s||'').trim().replace(/\s+/g,' ').slice(0,150);
  const penjaga=name(params.namaPenjaga),murid=name(params.namaMurid);
  const mykid=String(params.mykid||'').replace(/\D/g,'');
  const tel=String(params.telefon||'').replace(/[\s\-]/g,'').trim();
  const birth=nativeEdaftarBirth_(mykid);
  const alamat=String(params.alamat||'').trim().slice(0,500);
  if (!email||!penjaga||!murid||!birth||!/^(\+?6?0?\d{9,12})$/.test(tel)||!alamat)
    return {success:false,message:'Maklumat pendaftaran tidak lengkap atau No. MyKid tidak sah.'};
  if(!nativeEdaftarIntakeOpen_())
    return {success:false,message:'Pendaftaran ditutup mengikut tetapan Admin. Hubungi urusetia untuk pertimbangan kekosongan.'};
  // Intake is Year 3 (age 9), Year 4 (age 10), Year 5 (age 11) in 2027.
  if (![9,10,11].includes(birth.ageInSession))
    return {success:false,message:'Pengambilan pakej baharu adalah untuk Tahun 3, 4 dan 5 sahaja.'};
  const classYear=birth.ageInSession-6,mode=String(params.modKelas||'').trim().toUpperCase();
  if(!['FIZIKAL','ONLINE'].includes(mode))
    return {success:false,message:'Sila pilih kelas Fizikal atau Online.'};
  if ([penjaga,murid,alamat].some(s=>/^[=+\-@]/.test(s))) return {success:false,message:'Maklumat teks tidak sah.'};
  // Prevent uploading a slip before OTP verification and duplicate checks.
  let slipBlob;
  try {slipBlob=nativeEdaftarSlip_(params.slip);} catch(e) {
    return {success:false,message:e.message};
  }
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(20000))return {success:false,message:'Sistem sibuk. Cuba semula.'};
  try {
    const cache=CacheService.getScriptCache();
    const ticket=String(params.otpTicket||'').trim();
    if(!/^[0-9a-f]{64}$/i.test(ticket) || cache.get(nativeEdaftarTicketKey_(ticket))!==email)
      return {success:false,message:'Sahkan e-mel melalui OTP dahulu atau minta kod baharu.'};
    const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB.DAFTAR);
    if(!sheet) return {success:false,message:'Tab pendaftaran tidak tersedia.'};
    // Fail closed if any official header moved/renamed: never write to fallback columns.
    const requiredHeaders=[
      'Timestamp','Email address','NAMA PENJAGA (SAMA SEPERTI MYKAD)',
      'NAMA MURID (SAMA SEPERTI MYKID)','NO. MYKID','UMUR','NO. TELEFON',
      'ALAMAT PENUH TEMPAT TINGGAL','MUAT NAIK RESIT BAYARAN',
      'BAYARAN','NO RESIT','STATUS','STATUS_PERMOHONAN'
    ];
    const map=getDaftarColMap(sheet);
    if(requiredHeaders.some(h=>!Object.prototype.hasOwnProperty.call(map,h)))
      return {success:false,message:'Struktur tab pendaftaran berubah. Hubungi urusetia.'};
    const col=buildColDaftar(sheet);
    // Each new registration snapshots the rate shown to the parent.
    const rawFees=PropertiesService.getScriptProperties().getProperty('UPKK_V2_FEES_2027');
    if(!rawFees)return {success:false,message:'Jumlah yuran pendaftaran belum ditetapkan oleh urusetia.'};
    const fees=upkkAdminV2FeeQuote_();
    if(!nativeEdaftarIntakeOpen_())
      return {success:false,message:'Pendaftaran telah ditutup. Sila hubungi urusetia.'};
    // Refuse a stale fee quote when Admin changes the rate mid-form.
    if(!Number.isFinite(Number(params.quotedTotal)) ||
       Math.round(Number(params.quotedTotal)*100)!==Math.round(fees.total*100))
      return {success:false,message:'Jumlah yuran telah berubah. Muat semula borang sebelum menghantar.'};
    if(sheet.getLastColumn()<28 ||
       sheet.getRange(1,23,1,6).getDisplayValues()[0].join('|')!==
       ['V2_FEE_DAFTAR','V2_FEE_BULAN_PERTAMA','V2_TOTAL_DIPERLUKAN',
        'V2_APPROVED_BY','V2_APPROVED_AT','V2_REJECT_REASON'].join('|'))
      return {success:false,message:'Kolum audit yuran QA belum disediakan. Minta Admin jalankan persediaan BACKUP.'};
    // UMUR (F) is an ARRAYFORMULA spill owned by F2. Preserve it.
    if (col.UMUR !== 5 || col.NO_MYKID !== 4 || col.NO_TELEFON !== 6 || col.RESIT_UPLOAD !== 8 ||
        !/^\s*=\s*ARRAYFORMULA\s*\(/i.test(sheet.getRange(2,col.UMUR+1).getFormula()))
      return {success:false,message:'Formula UMUR atau susunan kolum pendaftaran tidak sepadan. Hubungi urusetia.'};
    // Refuse to submit against an unpatched/broken STATUS array formula.
    const statusFormula=sheet.getRange(1,col.STATUS+1).getFormula();
    // Formula uses column reference V:V, not the header text STATUS_PERMOHONAN.
    // Check both the marker header and the expected pending-status branch.
    if (map['STATUS_PERMOHONAN'] !== 21 ||
        !/V\s*:\s*V\s*=\s*"PENDING 2027"/i.test(statusFormula))
      return {success:false,message:'Formula STATUS atau kolum V belum dikonfigurasi untuk pendaftaran 2027.'};
    nativeEdaftarIntakeHeaders_(sheet);
    const rows=sheet.getDataRange().getValues();
    let previousLegacy=false;
    for(let i=1;i<rows.length;i++){
      if (String(rows[i][col.NO_MYKID]||'').replace(/\D/g,'')!==mykid)continue;
      const marker=String(rows[i][map.STATUS_PERMOHONAN]||'').trim();
      if(marker==='PENDING 2027'||marker==='APPROVED 2027')
        return {success:false,code:'DUPLICATE_NEW_INTAKE',message:'MyKid ini sudah mempunyai permohonan pakej baharu. Hubungi urusetia.'};
      if(marker==='REJECTED 2027')
        return {success:false,code:'PREVIOUS_REJECTION',message:'Permohonan pakej baharu sebelum ini telah ditolak. Hubungi urusetia sebelum memohon lagi.'};
      if(!marker)previousLegacy=true; // historical V1 row; re-enrolment allowed
    }
    if(nativeEdaftarIntakeUsed_(rows,classYear,mode,col,map)>=NE_INTAKE_MAX_[mode])
      return {success:false,code:'CLASS_FULL',message:'Kuota Tahun '+classYear+' ('+mode+') sudah penuh. Hubungi urusetia.'};
    // Start from current year's pending/approved count; pending reserves a seat.
    // Class capacity checked under script lock.
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
    out[col.NO_MYKID]="'"+nativeEdaftarDisplayMykid_(mykid); // Same YYMMDD-XX-XXXX format as legacy; preserve text.
    out[col.NO_TELEFON]="'"+tel; // F/UMUR belongs exclusively to F2 ARRAYFORMULA.
    out[col.ALAMAT]=alamat;
    // No receipt number or confirmed amount until payment verification.
    // Column L STATUS is ARRAYFORMULA-owned. Never write there. The
    // separate V marker drives the revised V1-compatible L1 formula.
    let slipFile;
    let writeAttempted=false;
    try {
      slipFile=folder.createFile(slipBlob);
      // Private Google Drive file. Do NOT set ANYONE_WITH_LINK.
      out[col.RESIT_UPLOAD]=slipFile.getUrl();
      writeAttempted=true;
      // Fill a genuinely empty existing row before growing the sheet. Google Form/
      // AutoCrat formatting can leave blank rows ahead of lastRow; never overwrite
      // any content (including data or formulas) in a candidate row.
      const lastRow=sheet.getLastRow();
      let targetRow=lastRow+1;
      if(lastRow>=2) {
        const formulaGrid=sheet.getRange(2,1,lastRow-1,headers.length).getFormulas();
        for(let i=1;i<rows.length;i++) {
          if(rows[i].every(v=>v===''||v===null) &&
              (formulaGrid[i-1]||[]).every(v=>!v)) {
            targetRow=i+1;
            break;
          }
        }
      }
      // Status marker must be set before filling H so the array formula
      // never temporarily treats a pending applicant as SELESAI.
      const markerCol=map['STATUS_PERMOHONAN']+1;
      sheet.getRange(targetRow,markerCol).setValue('PENDING 2027');
      // Only write A:E and G:I. F=UMUR is an ARRAYFORMULA spill from F2;
      // K=NO RESIT and L=STATUS are ARRAYFORMULA spills from row 1.
      // A contiguous A:I write would overwrite F and break age calculations.
      sheet.getRange(targetRow,1,1,5).setValues([out.slice(0,5)]);
      sheet.getRange(targetRow,7,1,3).setValues([out.slice(6,9)]);
      // Freeze quoted fees at submission time; future Admin rate changes
      // must not alter what this guardian was asked to pay.
      sheet.getRange(targetRow,23,1,3).setValues([[fees.daftar,fees.bulanan,fees.total]]);
      sheet.getRange(targetRow,31,1,3).setValues([[classYear,mode,previousLegacy?'DAFTAR SEMULA':'BAHARU']]);
      SpreadsheetApp.flush();
      cache.remove(nativeEdaftarTicketKey_(ticket));
      return {success:true,message:'Permohonan dan slip diterima untuk semakan urusetia. Jumlah ditetapkan RM'+fees.total.toFixed(2)+'. Bayaran belum disahkan.'};
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
