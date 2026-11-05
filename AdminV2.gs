/**
 * UPKK Admin V2 — QA ONLY, GAS HTML Service only.
 * No exposure via doGet JSONP. No spreadsheets or trigger created.
 * Important: never enable on a LIVE script.
 */
const UPKK_ADMIN_V2_QA_ID_='1aY5rHWYL3-K8IMGcVQNWS9uyahEwwLHdaVMag8YwYoo';
const UPKK_ADMIN_V2_FLAG_='UPKK_ADMIN_V2_QA_ENABLED';
const UPKK_ADMIN_V2_FEES_='UPKK_V2_FEES_2027';
const UPKK_ADMIN_V2_COLS_=['V2_FEE_DAFTAR','V2_FEE_BULAN_PERTAMA','V2_TOTAL_DIPERLUKAN','V2_APPROVED_BY','V2_APPROVED_AT','V2_REJECT_REASON'];
function upkkAdminV2Guard_(){
  if(SPREADSHEET_ID!==UPKK_ADMIN_V2_QA_ID_ ||
     PropertiesService.getScriptProperties().getProperty(UPKK_ADMIN_V2_FLAG_)!=='true')
    throw new Error('Fungsi Admin V2 hanya dibenarkan dalam GAS dan spreadsheet BACKUP QA.');
}
function upkkAdminV2Digest_(s){
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(s))).replace(/=+$/,'');
}
function upkkAdminV2Identity_(email,password){
  const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh=ss.getSheetByName(TAB_ADMIN);
  if(!sh)throw new Error('Tab Admin tidak tersedia.');
  const rows=sh.getDataRange().getValues();
  const target=String(email||'').trim().toLowerCase();
  for(let i=1;i<rows.length;i++){
    if(String(rows[i][COL_ADMIN.EMAIL]||'').trim().toLowerCase()===target &&
       String(rows[i][COL_ADMIN.PASSWORD]||'').trim()===String(password||'').trim())
      return {email:target,name:String(rows[i][COL_ADMIN.NAMA]||'Admin UPKK')};
  }
  throw new Error('Akses Admin tidak sah.');
}
function loginAdminV2(email,password){
  try{
    upkkAdminV2Guard_();
    const admin=upkkAdminV2Identity_(email,password);
    const token=Utilities.getUuid()+Utilities.getUuid();
    CacheService.getScriptCache().put('upkk:v2:adm:'+upkkAdminV2Digest_(token).slice(0,48),admin.email,21600);
    return {success:true,token:token,name:admin.name};
  }catch(e){return {success:false,message:e.message};}
}
function upkkAdminV2Auth_(token){
  upkkAdminV2Guard_();
  if(!/^[0-9a-f-]{72}$/i.test(String(token||'')))throw new Error('Sesi Admin tidak sah. Log masuk semula.');
  const email=CacheService.getScriptCache().get('upkk:v2:adm:'+upkkAdminV2Digest_(token).slice(0,48));
  if(!email)throw new Error('Sesi Admin tamat. Log masuk semula.');
  const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB_ADMIN);
  if(!sheet)throw new Error('Akaun Admin tidak tersedia.');
  const list=sheet.getDataRange().getValues();
  if(!list.slice(1).some(r=>String(r[COL_ADMIN.EMAIL]||'').trim().toLowerCase()===email))
    throw new Error('Akaun Admin tidak aktif.');
  return email;
}
function upkkAdminV2Money_(value){
  const s=String(value===null||value===undefined?'':value).trim();
  if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw new Error('Amaun mesti nombor Ringgit yang sah.');
  const n=Number(s);
  if(n<0||n>10000)throw new Error('Amaun yuran di luar julat dibenarkan.');
  return n;
}
function getAdminV2Fees(token){
  try{
    upkkAdminV2Auth_(token);
    const raw=PropertiesService.getScriptProperties().getProperty(UPKK_ADMIN_V2_FEES_);
    return {success:true,configured:!!raw,data:raw?JSON.parse(raw):null};
  }catch(e){return {success:false,message:e.message};}
}
function saveAdminV2Fees(token,daftar,bulanan){
  try{
    const email=upkkAdminV2Auth_(token);
    const d=upkkAdminV2Money_(daftar),b=upkkAdminV2Money_(bulanan);
    if(d+b<=0)throw new Error('Jumlah yuran tidak boleh kosong.');
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(10000))throw new Error('Sistem sedang sibuk.');
    try{
      const current=PropertiesService.getScriptProperties().getProperty(UPKK_ADMIN_V2_FEES_);
      const record={session:'2027',daftar:d,bulanan:b,total:d+b,updatedAt:new Date().toISOString(),updatedBy:email};
      PropertiesService.getScriptProperties().setProperty(UPKK_ADMIN_V2_FEES_,JSON.stringify(record));
      // Do not rewrite fees on already submitted applications.
      return {success:true,data:record,previousConfigured:!!current};
    }finally{lock.releaseLock();}
  }catch(e){return {success:false,message:e.message};}
}
// Minimal QA-only operating policy. No extra tab, job or PDF generator.
const UPKK_ADMIN_V2_POLICY_='UPKK_V2_POLICY_2027';
function upkkAdminV2DefaultPolicy_(){
  // Maintain the currently agreed intake end until Admin explicitly extends it.
  return {registrationStart:'2026-11-01',classStart:'2026-12-01',
    registrationEnd:'',registrationOpen:false};
}
function upkkAdminV2PolicyDate_(v,label){
  const s=String(v||'').trim();
  if(!/^20\d{2}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/.test(s))
    throw new Error(label+' mesti tarikh YYYY-MM-DD yang sah.');
  const d=new Date(s+'T12:00:00+08:00');
  if(isNaN(d.getTime())||Utilities.formatDate(d,'Asia/Kuala_Lumpur','yyyy-MM-dd')!==s)
    throw new Error(label+' tidak sah.');
  return s;
}
function upkkAdminV2ReadPolicy_(){
  const raw=PropertiesService.getScriptProperties().getProperty(UPKK_ADMIN_V2_POLICY_);
  const saved=raw?JSON.parse(raw):{};
  return Object.assign(upkkAdminV2DefaultPolicy_(),saved);
}
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
function getAdminV2Policy(token){
  try{
    upkkAdminV2Auth_(token);
    const raw=PropertiesService.getScriptProperties().getProperty(UPKK_ADMIN_V2_POLICY_);
    return {success:true,configured:!!raw,data:upkkAdminV2ReadPolicy_()};
  }catch(e){return {success:false,message:e.message};}
}
function saveAdminV2Policy(token,registrationStart,classStart,registrationEnd,registrationOpen){
  try{
    const email=upkkAdminV2Auth_(token);
    const start=upkkAdminV2PolicyDate_(registrationStart,'Tarikh mula pendaftaran');
    const first=upkkAdminV2PolicyDate_(classStart,'Tarikh mula kelas');
    const end=registrationEnd?upkkAdminV2PolicyDate_(registrationEnd,'Tarikh akhir pendaftaran'):'';
    if(end&&start>end)throw new Error('Tarikh akhir pendaftaran mesti selepas tarikh mula.');
    if(start>first)throw new Error('Tarikh mula kelas mesti selepas atau sama dengan tarikh mula pendaftaran.');
    if(typeof registrationOpen!=='boolean')throw new Error('Status buka/tutup mesti benar atau palsu.');
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(10000))throw new Error('Sistem sedang sibuk.');
    try{
      const previous=PropertiesService.getScriptProperties().getProperty(UPKK_ADMIN_V2_POLICY_);
      const record={session:'2027',registrationStart:start,classStart:first,
        registrationEnd:end,registrationOpen:registrationOpen,
        updatedAt:new Date().toISOString(),updatedBy:email};
      PropertiesService.getScriptProperties().setProperty(UPKK_ADMIN_V2_POLICY_,JSON.stringify(record));
      Logger.log('[UPKK V2 QA Policy] updated by '+email+' at '+record.updatedAt);
      return {success:true,data:record,previousConfigured:!!previous};
    }finally{lock.releaseLock();}
  }catch(e){return {success:false,message:e.message};}
}

function upkkAdminV2Sheet_(){
  const sh=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB.DAFTAR);
  if(!sh)throw new Error('Tab pendaftaran tidak tersedia.');
  const map=getDaftarColMap(sh);
  if(map['STATUS_PERMOHONAN']!==21)throw new Error('Kolum V STATUS_PERMOHONAN tiada.');
  return {sheet:sh,map:map,col:buildColDaftar(sh)};
}
function upkkAdminV2List(token){
  try{
    upkkAdminV2Auth_(token);
    const {sheet,col,map}=upkkAdminV2Sheet_();
    const values=sheet.getDataRange().getValues(),items=[];
    for(let i=1;i<values.length;i++){
      const r=values[i],marker=String(r[map.STATUS_PERMOHONAN]||'').trim();
      if(!/^(PENDING|APPROVED|REJECTED) 2027$/.test(marker))continue;
      items.push({row:i+1,murid:String(r[col.NAMA_MURID]||''),penjaga:String(r[col.NAMA_PENJAGA]||''),
        email:String(r[col.EMAIL]||''),status:marker,slip:String(r[col.RESIT_UPLOAD]||''),
        bayaran:String(r[col.BAYARAN]||'')});
    }
    return {success:true,items:items.reverse()};
  }catch(e){return {success:false,message:e.message};}
}
/** Preflight requires amended array formula before allowing ANY approval/rejection. */
function upkkAdminV2CheckFormula_(sheet,col){
  const l=sheet.getRange(1,col.STATUS+1).getFormula();
  const k=sheet.getRange(1,col.NO_RESIT+1).getFormula();
  if(!/REJECTED 2027/i.test(l)||!/PENDING 2027/i.test(l)||
     !/REJECTED 2027/i.test(k)||!/APPROVED 2027/i.test(k)||!/AD:AD/i.test(k))
    throw new Error('Formula K1/L1 belum dikonfigurasi untuk keputusan Admin V2. Jangan ubah status manual.');
}
// AD is V2_NO_RESIT; AC=TAHUN stays owned by the year formula.
function upkkAdminV2EnsureReceiptColumn_(sheet){
  const col=30; // AD
  if(sheet.getMaxColumns()<col)sheet.insertColumnsAfter(sheet.getMaxColumns(),col-sheet.getMaxColumns());
  const header=String(sheet.getRange(1,col).getDisplayValue()||'').trim();
  if(header&&header!=='V2_NO_RESIT')
    throw new Error('Kolum AD sudah digunakan. Tiada perubahan dibuat.');
  if(!header)sheet.getRange(1,col).setValue('V2_NO_RESIT');
}
function upkkAdminV2ReceiptYear_(sheet,row){
  // The user selected calendar year of registration, not academic session.
  const y=Number(sheet.getRange(row,29).getDisplayValue()); // AC / TAHUN
  if(!Number.isInteger(y)||y<2025||y>2100)
    throw new Error('Kolum AC (TAHUN) tidak sah pada row '+row+'.');
  return y;
}
function upkkAdminV2AllocateReceipt_(sheet,row){
  upkkAdminV2EnsureReceiptColumn_(sheet);
  const cell=sheet.getRange(row,30);
  const existing=String(cell.getDisplayValue()||'').trim();
  const year=upkkAdminV2ReceiptYear_(sheet,row);
  const prefix='UPKK-'+year+'-';
  // Read all issued V2 numbers, including any on rows later moved/updated.
  const last=sheet.getLastRow();
  const records=last>=2?sheet.getRange(2,30,last-1,1).getDisplayValues().map(r=>String(r[0]||'').trim()):[];
  const issued=new Set();
  let max=0;
  records.forEach(function(v){
    if(!v)return;
    if(issued.has(v))throw new Error('Nombor resit V2 berganda dikesan: '+v);
    issued.add(v);
    const m=/^UPKK-(\d{4})-(\d{4,})$/.exec(v);
    if(!m)throw new Error('Format nombor resit V2 tidak sah: '+v);
    if(m[1]===String(year))max=Math.max(max,Number(m[2]));
  });
  if(existing){
    if(!/^UPKK-\d{4}-\d{4,}$/.test(existing)||!existing.startsWith(prefix))
      throw new Error('Nombor resit sedia ada tidak sepadan dengan tahun pendaftaran.');
    return existing; // immutable / idempotent
  }
  const number=prefix+String(max+1).padStart(4,'0');
  cell.setNumberFormat('@');
  cell.setValue(number);
  return number;
}
function upkkAdminV2EnsureAuditCols_(sheet){
  const header=sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0];
  const start=22; // W:AB, within the SAME QA workbook
  for(let i=0;i<UPKK_ADMIN_V2_COLS_.length;i++){
    const existing=header[start+i]||'';
    if(existing && existing!==UPKK_ADMIN_V2_COLS_[i])
      throw new Error('Kolum audit W:AB telah digunakan. Hubungi pembangun.');
  }
  const required=start+UPKK_ADMIN_V2_COLS_.length;
  if(sheet.getMaxColumns()<required)sheet.insertColumnsAfter(sheet.getMaxColumns(),required-sheet.getMaxColumns());
  sheet.getRange(1,start+1,1,UPKK_ADMIN_V2_COLS_.length).setValues([UPKK_ADMIN_V2_COLS_]);
}
/**
 * Repeat-safe QA setup. Preserves V1 legacy receipts, configures V2 display
 * and backfills receipt numbers for previously approved QA applications.
 */
function prepareAdminV2QaSheet(token){
  try{
    upkkAdminV2Auth_(token);
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(15000))throw new Error('Sistem sibuk.');
    try{
      const {sheet,col}=upkkAdminV2Sheet_();
      const k=sheet.getRange(1,col.NO_RESIT+1),l=sheet.getRange(1,col.STATUS+1);
      const beforeK=k.getFormula(),beforeL=l.getFormula();
      if(!beforeK.startsWith('=ARRAYFORMULA(')||!beforeL.startsWith('=ARRAYFORMULA(')||
         !/V:V/.test(beforeK)||!/V:V/.test(beforeL))
        throw new Error('Formula K1/L1 bukan versi QA yang dijangka. Tiada perubahan dibuat.');
      upkkAdminV2EnsureAuditCols_(sheet);
      upkkAdminV2EnsureReceiptColumn_(sheet);
      k.setFormula('=ARRAYFORMULA(IF(ROW(A:A)=1,"NO RESIT",IF(LEN(A:A),IF(V:V="APPROVED 2027",IF(AD:AD="","",AD:AD),IF((V:V="PENDING 2027")+(V:V="REJECTED 2027"),"",TEXT(ROW(A:A)-1,"000"))),"")))');
      l.setFormula('=ARRAYFORMULA(IF(ROW(H:H)=1,"STATUS",IF(LEN(H:H),IF(V:V="PENDING 2027","PENDING 2027",IF(V:V="REJECTED 2027","DITOLAK 2027","SELESAI")),"")))');
      SpreadsheetApp.flush();
      upkkAdminV2CheckFormula_(sheet,col);
      // Backfill only previously approved QA records; no changes to V1 rows.
      const map=getDaftarColMap(sheet);
      const last=sheet.getLastRow(),markers=last>=2?sheet.getRange(2,map.STATUS_PERMOHONAN+1,last-1,1).getDisplayValues():[];
      let created=0;
      for(let i=0;i<markers.length;i++){
        if(String(markers[i][0]).trim()!=='APPROVED 2027')continue;
        const cell=sheet.getRange(i+2,30);
        if(!String(cell.getDisplayValue()||'').trim()){
          upkkAdminV2AllocateReceipt_(sheet,i+2);created++;
        }
      }
      SpreadsheetApp.flush();
      return {success:true,message:'Formula K1 dikemas kini; '+created+' nombor resit QA baharu dijana di AD dan dipaparkan di K.'};
    }finally{lock.releaseLock();}
  }catch(e){return {success:false,message:e.message};}
}
function decideAdminV2Application(token,row,decision,amount,reason){
  try{
    const email=upkkAdminV2Auth_(token);
    const n=Number(row);
    if(!Number.isInteger(n)||n<2)throw new Error('ID permohonan tidak sah.');
    if(decision!=='APPROVE'&&decision!=='REJECT')throw new Error('Keputusan tidak sah.');
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(20000))throw new Error('Sistem sedang sibuk. Cuba lagi.');
    try{
      const {sheet,col,map}=upkkAdminV2Sheet_();
      if(n>sheet.getLastRow())throw new Error('Permohonan tidak ditemui.');
      upkkAdminV2CheckFormula_(sheet,col);
      const values=sheet.getRange(n,1,1,sheet.getLastColumn()).getValues()[0];
      if(String(values[map.STATUS_PERMOHONAN]||'')!=='PENDING 2027')
        throw new Error('Permohonan telah diproses atau status telah berubah.');
      const note=String(reason||'').trim();
      if(decision==='REJECT'&&(note.length<5||note.length>250))
        throw new Error('Masukkan sebab penolakan (5–250 aksara).');
      if(!String(values[col.RESIT_UPLOAD]||'').startsWith('https://drive.google.com/'))
        throw new Error('Slip bayaran tidak tersedia untuk semakan.');
      const property=PropertiesService.getScriptProperties().getProperty(UPKK_ADMIN_V2_FEES_);
      if(!property)throw new Error('Tetapkan yuran dahulu.');
      const currentFees=JSON.parse(property);
      const snapDaftar=values[22],snapBulanan=values[23],snapTotal=values[24];
      // Existing QA registrations predate fee settings. Explicitly use today's
      // configured rate for those only; all NEW applicants have a frozen quote.
      const fees=(snapTotal!==''&&snapTotal!==null&&Number.isFinite(Number(snapTotal)))
        ?{daftar:Number(snapDaftar),bulanan:Number(snapBulanan),total:Number(snapTotal)}
        :currentFees;
      const approved=decision==='APPROVE',paid=approved?upkkAdminV2Money_(amount):0;
      if(approved && paid<fees.total)
        throw new Error('Jumlah disahkan tidak mencukupi. Sila semak slip.');
      if(approved && paid>fees.total)
        throw new Error('Jumlah disahkan berbeza daripada kadar. Semak dengan urusetia.');
      upkkAdminV2EnsureAuditCols_(sheet);
      // Snapshot amount + operator and decision; legacy L/K remain ARRAYFORMULA owned.
      sheet.getRange(n,23,1,6).setValues([[fees.daftar,fees.bulanan,fees.total,email,new Date(),approved?'':note]]);
      if(approved)sheet.getRange(n,col.BAYARAN+1).setValue('RM'+paid.toFixed(2));
      // Allocate under the same script lock as approval. Existing V1 rows stay untouched.
      const receipt=approved?upkkAdminV2AllocateReceipt_(sheet,n):'';
      sheet.getRange(n,map.STATUS_PERMOHONAN+1).setValue(approved?'APPROVED 2027':'REJECTED 2027');
      SpreadsheetApp.flush();
      return {success:true,message:approved?'Pendaftaran disahkan. No. Resit: '+receipt:'Permohonan ditolak.'};
    }finally{lock.releaseLock();}
  }catch(e){return {success:false,message:e.message};}
}
