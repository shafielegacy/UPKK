/**
 * UPKK Native eBayar — QA-only monthly payment backend.
 * Bound to the existing BACKUP workbook; one dedicated NATIVE_EBAYAR tab
 * keeps legacy 2026 AutoCrat and historic records entirely untouched.
 * No doGet/JSONP route. Requires google.script.run and a verified parent token.
 */
const NE_QA_SPREADSHEET_='1aY5rHWYL3-K8IMGcVQNWS9uyahEwwLHdaVMag8YwYoo';
const NE_FLAG_='UPKK_NATIVE_EBAYAR_QA_ENABLED';
const NE_FOLDER_PROPERTY_='UPKK_NATIVE_EBAYAR_SLIP_FOLDER_ID';
const NE_TAB_='NATIVE_EBAYAR';
const NE_HEADERS_=[
  'REQUEST_ID','SUBMITTED_AT','GUARDIAN_EMAIL','CHILD_MYKID','CHILD_NAME',
  'BULAN','TAHUN','TARIKH_BAYAR','KAEDAH','JUMLAH_RM','SLIP_URL',
  'STATUS','NO_RESIT','APPROVED_BY','APPROVED_AT','REJECT_REASON','MERGED_PDF_URL'
];
const NE_MONTHS_=['JAN','FEB','MAC','APRIL','MEI','JUN','JUL','OGOS','SEPT','OKT','NOV','DIS'];
function neGuard_(){
  if(SPREADSHEET_ID!==NE_QA_SPREADSHEET_ ||
      PropertiesService.getScriptProperties().getProperty(NE_FLAG_)!=='true')
    throw new Error('Native eBayar hanya dibenarkan pada GAS + spreadsheet BACKUP QA.');
}
function neHash_(value){
  return Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(value))
  ).replace(/=+$/,'').slice(0,47);
}
function neSessionKey_(token){return 'ne:parent:'+neHash_(token);}
function neNewSession_(email,ownedChildIds){
  // Called ONLY by Code.gs login after matching parent email + phone digits.
  neGuard_();
  const key=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');
  const record={email:String(email).trim().toLowerCase(),children:ownedChildIds};
  CacheService.getScriptCache().put(neSessionKey_(key),JSON.stringify(record),7200);
  return key;
}
/** Exchange the existing parent credentials for a short-lived, GAS-only token.
 * Token is never returned through doGet/JSONP or written to localStorage.
 */
function loginNativeEbayar(email,phone){
  try{
    neGuard_();
    const normalized=String(email||'').trim().toLowerCase();
    const digits=String(phone||'').replace(/\D/g,'');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)||!/^\d{6}$/.test(digits))
      throw new Error('Maklumat log masuk tidak sah.');
    const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
    const admins=ss.getSheetByName(TAB_ADMIN);
    if(admins && admins.getLastRow()>1 &&
      admins.getRange(2,COL_ADMIN.EMAIL+1,admins.getLastRow()-1,1).getDisplayValues()
        .some(r=>String(r[0]||'').trim().toLowerCase()===normalized))
      throw new Error('Akaun Admin digunakan untuk pentadbiran sahaja.');
    const sh=ss.getSheetByName(TAB.DAFTAR);
    if(!sh)throw new Error('Daftar murid tidak tersedia.');
    const col=buildColDaftar(sh),map=getDaftarColMap(sh),rows=sh.getDataRange().getValues();
    if(!Object.prototype.hasOwnProperty.call(map,'STATUS_PERMOHONAN'))
      throw new Error('Penanda kelulusan belum tersedia.');
    const approved=rows.slice(1).filter(row=>
      String(row[col.EMAIL]||'').trim().toLowerCase()===normalized &&
      String(row[col.NO_TELEFON]||'').replace(/\D/g,'').slice(-6)===digits &&
      String(row[map.STATUS_PERMOHONAN]||'').trim()==='APPROVED 2027')
      .map(row=>({
        mykid:neNormalMyKid_(row[col.NO_MYKID]),
        name:String(row[col.NAMA_MURID]||'').trim(),
        registered:new Date(row[col.TIMESTAMP]).toISOString()
      })).filter(row=>/^\d{12}$/.test(row.mykid));
    if(!approved.length)throw new Error('Tiada pendaftaran anak yang disahkan untuk Native eBayar.');
    const token=neNewSession_(normalized,approved.map(a=>a.mykid));
    // Client holds child IDs only in memory for the current login.
    return {success:true,token,children:approved};
  }catch(e){return {success:false,message:e.message};}
}
function neGetSession_(token){
  neGuard_();
  if(!/^[a-f0-9]{64}$/i.test(String(token||'')))throw new Error('Sila log masuk semula sebagai penjaga.');
  const raw=CacheService.getScriptCache().get(neSessionKey_(token));
  if(!raw)throw new Error('Sesi penjaga tamat. Log masuk semula.');
  const session=JSON.parse(raw);
  if(!session.email||!Array.isArray(session.children))throw new Error('Sesi tidak sah.');
  return session;
}
function neNormalMyKid_(value){return String(value||'').replace(/\D/g,'');}
function neChild_(session,mykid){
  const id=neNormalMyKid_(mykid);
  if(!/^\d{12}$/.test(id)||!session.children.includes(id))
    throw new Error('Rekod murid tidak dibenarkan.');
  // Validate ownership and approval AGAIN against live BACKUP record.
  const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB.DAFTAR);
  if(!sheet)throw new Error('Daftar murid tidak tersedia.');
  const col=buildColDaftar(sheet),map=getDaftarColMap(sheet);
  if(!Object.prototype.hasOwnProperty.call(map,'STATUS_PERMOHONAN'))
    throw new Error('Penanda kelulusan tidak tersedia.');
  const rows=sheet.getDataRange().getValues();
  const found=rows.slice(1).find(row=>
    String(row[col.EMAIL]||'').trim().toLowerCase()===session.email &&
    neNormalMyKid_(row[col.NO_MYKID])===id &&
    String(row[map.STATUS_PERMOHONAN]||'').trim()==='APPROVED 2027');
  if(!found)throw new Error('Pendaftaran anak belum disahkan.');
  const when=new Date(found[col.TIMESTAMP]);
  const paidMonth=Number(found[23])>0 && Number(found[24])>0 && !isNaN(when.getTime())
    ?Utilities.formatDate(when,'Asia/Kuala_Lumpur','yyyy-MM'):'';
  return {mykid:id,name:String(found[col.NAMA_MURID]||'').trim(),
    date:found[col.TIMESTAMP],registrationPaidMonth:paidMonth,registrationMonthlyAmount:Number(found[23])||0};
}
/**
 * QA-only registration receipt link. Requires an authenticated parent session,
 * an owned approved V2 child, and a completed AutoCrat PDF merge.
 * Never expose this through public doGet/JSONP.
 */
function getNativeRegistrationReceipt(token,mykid){
  try {
    const session=neGetSession_(token);
    const child=neChild_(session,mykid);
    const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB.DAFTAR);
    if(!sheet)throw new Error('Rekod pendaftaran tidak tersedia.');
    const map=getDaftarColMap(sheet),col=buildColDaftar(sheet);
    const required=['STATUS_PERMOHONAN','V2_NO_RESIT','Merged Doc URL - DAFTAR UPKK 2026',
      'Document Merge Status - DAFTAR UPKK 2026'];
    if(required.some(h=>!Object.prototype.hasOwnProperty.call(map,h)))
      throw new Error('Kolum resit AutoCrat belum lengkap.');
    const rows=sheet.getDataRange().getValues();
    const matches=rows.slice(1).filter(r=>
      String(r[col.EMAIL]||'').trim().toLowerCase()===session.email &&
      neNormalMyKid_(r[col.NO_MYKID])===child.mykid &&
      String(r[map.STATUS_PERMOHONAN]||'').trim()==='APPROVED 2027');
    if(matches.length!==1)throw new Error('Rekod pendaftaran tidak dapat dipastikan. Hubungi urusetia.');
    const r=matches[0];
    const receipt=String(r[map.V2_NO_RESIT]||'').trim();
    if(!/^UPKK-\d{4}-\d{4,}$/.test(receipt))
      return {success:false,message:'Nombor resit pendaftaran belum tersedia.'};
    const url=String(r[map['Merged Doc URL - DAFTAR UPKK 2026']]||'').trim();
    const merge=String(r[map['Document Merge Status - DAFTAR UPKK 2026']]||'');
    if(!url||!merge.includes('PDF created'))
      return {success:false,message:'Bayaran telah disahkan. PDF resit sedang menunggu AutoCrat. Sila semak semula kemudian.'};
    if(!/^https:\/\/(?:drive|docs)\.google\.com\//i.test(url))
      throw new Error('Pautan resit tidak sah. Hubungi urusetia.');
    return {success:true,link:url,noResit:receipt};
  }catch(e){return {success:false,message:e.message};}
}
function neSheet_(create){
  const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh=ss.getSheetByName(NE_TAB_);
  if(!sh){
    if(!create)throw new Error('Tab NATIVE_EBAYAR QA belum disediakan oleh Admin.');
    sh=ss.insertSheet(NE_TAB_);
    sh.getRange(1,1,1,NE_HEADERS_.length).setValues([NE_HEADERS_]);
    sh.setFrozenRows(1);
    return sh;
  }
  const heads=sh.getRange(1,1,1,NE_HEADERS_.length).getDisplayValues()[0];
  if(NE_HEADERS_.some((h,i)=>heads[i]!==h))
    throw new Error('Struktur tab NATIVE_EBAYAR berubah. Tiada data ditulis.');
  return sh;
}
function prepareNativeEbayarQaSheet(token){
  try{
    upkkAdminV2Auth_(token);neGuard_();
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(10000))throw new Error('Sistem sibuk.');
    try{
      neSheet_(true);
      return {success:true,message:'Tab NATIVE_EBAYAR QA sedia. Rekod 2026 lama tidak diubah.'};
    }finally{lock.releaseLock();}
  }catch(e){return {success:false,message:e.message};}
}
function nePaymentYear_(year,month){
  const y=Number(year),m=NE_MONTHS_.indexOf(String(month||'').toUpperCase());
  if(!Number.isInteger(y)||y<2026||y>2027||m<0)throw new Error('Bulan atau tahun tidak sah.');
  // Live policy begins Dec 2026; November is NOT opened for native submission.
  if(y===2026&&m<11)throw new Error('Native eBayar bermula Disember 2026. Bulan ini belum dibuka.');
  // Malaysia calendar controls payment opening, not the browser clock or
  // the uploaded proof's date. Future months cannot be paid in advance.
  const today=Utilities.formatDate(new Date(),'Asia/Kuala_Lumpur','yyyy-MM');
  const requested=String(y).padStart(4,'0')+'-'+String(m+1).padStart(2,'0');
  if(requested>today)throw new Error('Bulan yuran belum tiba. Bayaran hanya dibuka mulai bulan tersebut.');
  return {year:y,month:NE_MONTHS_[m],monthIndex:m+1};
}
function neFee_(year){
  const raw=PropertiesService.getScriptProperties().getProperty('UPKK_V2_FEES_2027');
  if(!raw)throw new Error('Kadar yuran belum dikonfigurasi oleh Admin.');
  const cfg=JSON.parse(raw);
  const amount=Number(cfg.bulanan);
  if(!Number.isFinite(amount)||amount<=0||amount>10000)
    throw new Error('Kadar yuran tidak sah.');
  return {amount,provisional:false};
}
function neRegistrationAlreadyPaid_(child,period){
  const key=String(period.year)+'-'+String(period.monthIndex).padStart(2,'0');
  return !!child.registrationPaidMonth && child.registrationPaidMonth===key;
}
function getNativeEbayarQuote(token,mykid,month,year){
  try{
    const session=neGetSession_(token),child=neChild_(session,mykid);
    const period=nePaymentYear_(year,month),fee=neFee_(period.year);
    if(neRegistrationAlreadyPaid_(child,period))
      return {success:true,childName:child.name,month:period.month,year:period.year,
        amount:child.registrationMonthlyAmount,provisional:false,status:'SELESAI'};
    const sh=neSheet_(false),rows=sh.getDataRange().getValues();
    const existing=rows.slice(1).find(r=>
      neNormalMyKid_(r[3])===child.mykid&&
      String(r[5])===period.month&&Number(r[6])===period.year&&
      ['PENDING','SELESAI'].includes(String(r[11]).toUpperCase()));
    return {success:true,childName:child.name,month:period.month,year:period.year,
      amount:fee.amount,provisional:fee.provisional,status:existing?String(existing[11]):'BELUM'};
  }catch(e){return {success:false,message:e.message};}
}
function neSlip_(file,folderId){
  if(!file||!['image/jpeg','image/png','application/pdf'].includes(String(file.mimeType||'')))
    throw new Error('Bukti bayaran mesti JPEG, PNG atau PDF.');
  const data=String(file.base64||'');
  if(!data||data.length>4*1024*1024+2048||!/^[A-Za-z0-9+/]*={0,2}$/.test(data))
    throw new Error('Bukti bayaran tidak sah atau melebihi 3 MB.');
  const raw=Utilities.base64Decode(data);
  if(!raw.length||raw.length>3*1024*1024)throw new Error('Bukti bayaran melebihi 3 MB.');
  const type=String(file.mimeType);
  if(type==='application/pdf' && !(raw[0]===37&&raw[1]===80&&raw[2]===68&&raw[3]===70))
    throw new Error('Fail PDF tidak sah.');
  if(type==='image/png' && !(raw[0]===137&&raw[1]===80&&raw[2]===78&&raw[3]===71))
    throw new Error('Fail PNG tidak sah.');
  if(type==='image/jpeg' && !(raw[0]===255&&raw[1]===216))
    throw new Error('Fail JPEG tidak sah.');
  return DriveApp.getFolderById(folderId).createFile(Utilities.newBlob(raw,type,'UPKK_EBAYAR_QA_'+Utilities.getUuid()));
}
function submitNativeEbayar(token,payload){
  let slip=null,writeStarted=false;
  try{
    const session=neGetSession_(token),p=payload||{},child=neChild_(session,p.mykid);
    const period=nePaymentYear_(p.year,p.month),fee=neFee_(period.year);
    if(neRegistrationAlreadyPaid_(child,period))
      throw new Error('Yuran bulan ini telah dibayar bersama pendaftaran. Tidak perlu membayar sekali lagi.');
    const paidDate=String(p.paymentDate||''),method=String(p.method||'');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(paidDate) ||
       !['TRANSFER','CASH'].includes(method))throw new Error('Tarikh atau kaedah bayaran tidak sah.');
    const dt=new Date(paidDate+'T12:00:00+08:00');
    if(isNaN(dt.getTime())||dt.toISOString().slice(0,10)!==paidDate)
      throw new Error('Tarikh bayaran tidak sah.');
    if(dt.getTime()>Date.now()+86400000)throw new Error('Tarikh bayaran tidak boleh pada masa depan.');
    // Payment date may precede the billed month, but cannot precede 2026.
    if(dt.getTime()<Date.parse('2026-01-01T00:00:00+08:00'))throw new Error('Tarikh bayaran terlalu awal.');
    if(!Number.isFinite(Number(p.quotedAmount))||
       Math.round(Number(p.quotedAmount)*100)!==Math.round(fee.amount*100))
      throw new Error('Kadar yuran telah berubah. Buka borang semula.');
    // The confirmed monthly rate applies from Dec 2026. No November monthly billing.
    if(period.year===2026 && period.monthIndex!==12)
      throw new Error('Native eBayar bermula Disember 2026.');
    const folderId=PropertiesService.getScriptProperties().getProperty(NE_FOLDER_PROPERTY_);
    if(!folderId)throw new Error('Folder slip bayaran QA belum dikonfigurasi.');
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(20000))throw new Error('Sistem sibuk. Cuba sebentar lagi.');
    try{
      const sh=neSheet_(false),rows=sh.getDataRange().getValues();
      const key=child.mykid+'|'+period.month+'|'+period.year;
      if(rows.slice(1).some(r=>
        neNormalMyKid_(r[3])+'|'+String(r[5])+'|'+Number(r[6])===key &&
        String(r[11]).toUpperCase()!=='REJECTED'))
        return {success:false,message:'Bayaran bulan ini sudah dihantar. Sila semak status dengan urusetia.'};
      const requestId=Utilities.getUuid();
      slip=neSlip_(p.file,folderId);
      writeStarted=true;
      sh.appendRow([requestId,new Date(),session.email,child.mykid,child.name,
        period.month,period.year,paidDate,method,fee.amount,slip.getUrl(),
        'PENDING','','','','','']);
      SpreadsheetApp.flush();
      return {success:true,status:'PENDING',requestId,
        message:'Bukti bayaran diterima untuk semakan urusetia. Resit belum dikeluarkan.'};
    }finally{lock.releaseLock();}
  }catch(e){
    if(slip&&!writeStarted)try{slip.setTrashed(true);}catch(ignore){}
    return {success:false,message:writeStarted?
      'Status simpanan belum dapat dipastikan. Hubungi urusetia; jangan hantar semula.':e.message};
  }
}

/**
 * Part 8A — Admin monthly review (QA BACKUP only).
 * No receipt allocation/AutoCrat here: those are a separate owner-controlled phase.
 * All decisions must originate from an authenticated GAS Admin session.
 */
function listNativeEbayarAdmin(token) {
  try {
    upkkAdminV2Auth_(token);neGuard_();
    const sh=neSheet_(false),data=sh.getDataRange().getValues(),items=[];
    for(let i=1;i<data.length;i++){
      const r=data[i],status=String(r[11]||'').trim().toUpperCase();
      if(!['PENDING','SELESAI','REJECTED'].includes(status))continue;
      items.push({
        requestId:String(r[0]||''),child:String(r[4]||''),
        month:String(r[5]||''),year:Number(r[6]),
        paymentDate:String(r[7]||''),method:String(r[8]||''),
        amount:Number(r[9]),slipUrl:String(r[10]||''),
        status:status,receipt:String(r[12]||''),
        decidedBy:String(r[13]||''),decidedAt:r[14]?Utilities.formatDate(new Date(r[14]),'Asia/Kuala_Lumpur','dd/MM/yyyy HH:mm'):'',
        rejectReason:String(r[15]||'')
      });
    }
    return {success:true,items:items.reverse().slice(0,200)};
  }catch(e){return {success:false,message:e.message};}
}
function decideNativeEbayarAdmin(token,requestId,decision,amount,reason) {
  try {
    const admin=upkkAdminV2Auth_(token);neGuard_();
    const id=String(requestId||'').trim(),action=String(decision||'').trim();
    if(!/^[a-f0-9-]{36}$/i.test(id))throw new Error('Rujukan transaksi tidak sah.');
    if(!['APPROVE','REJECT'].includes(action))throw new Error('Keputusan tidak sah.');
    const note=String(reason||'').trim();
    if(action==='REJECT'&&(note.length<5||note.length>250))
      throw new Error('Sebab penolakan mesti 5–250 aksara.');
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(20000))throw new Error('Sistem sibuk. Cuba lagi.');
    try {
      const sh=neSheet_(false),data=sh.getDataRange().getValues();
      const matching=[];
      for(let i=1;i<data.length;i++)if(String(data[i][0]||'').trim()===id)matching.push(i);
      if(matching.length!==1)throw new Error('Transaksi tidak ditemui atau rujukan berganda.');
      const index=matching[0],r=data[index],row=index+1;
      if(String(r[11]||'').trim()!=='PENDING')
        throw new Error('Transaksi sudah diproses. Muat semula senarai.');
      const billed=Number(r[9]);
      if(!Number.isFinite(billed)||billed<=0||billed>10000)
        throw new Error('Amaun rekod asal tidak sah.');
      const approved=action==='APPROVE';
      if(approved){
        const checked=upkkAdminV2Money_(amount);
        if(Math.round(checked*100)!==Math.round(billed*100))
          throw new Error('Amaun disahkan tidak sama dengan rekod bayaran.');
      }
      if(!/^https:\/\/drive\.google\.com\//i.test(String(r[10]||'')))
        throw new Error('Slip bayaran tidak tersedia untuk semakan.');
      // Defensive: only a single active payment per child and month.
      // data.slice(1) uses zero-based data indexes; index is 1-based within data.
      if(approved&&data.slice(1).some((other,i)=>
        i!==index-1 && neNormalMyKid_(other[3])===neNormalMyKid_(r[3]) &&
        String(other[5])===String(r[5]) && Number(other[6])===Number(r[6]) &&
        String(other[11]||'').toUpperCase()==='SELESAI'))
        throw new Error('Bayaran bulan ini sudah disahkan pada transaksi lain.');
      if(approved){
        // One locked decision writes settlement + immutable serial + RESERVED together.
        // No external AutoCrat, email or trigger side effects here.
        const receiptLedger=mrQaSheet_();
        if(!receiptLedger.ready)throw new Error('Kolum resit R:U belum disediakan.');
        const maximum=mrQaCheckSerials_(data);
        const receiptYear=Number(r[6]),mykid=neNormalMyKid_(r[3]);
        if(!Number.isInteger(receiptYear)||receiptYear<2026||receiptYear>2027||
           !NE_MONTHS_.includes(String(r[5]))||!/^\\d{12}$/.test(mykid))
          throw new Error('Maklumat murid atau tempoh resit tidak sah.');
        if(String(r[12]||'').trim()||String(r[16]||'').trim()||
           String(r[17]||'').trim()||Number(r[20]||0)!==0||
           [21,22,23,24].some(i=>String(r[i]||'').trim()))
          throw new Error('Metadata resit sudah wujud. Semak manual sebelum SAHKAN.');
        if(data.some((other,i)=>i!==index &&
           neNormalMyKid_(other[3])===mykid &&
           String(other[5])===String(r[5]) &&
           Number(other[6])===receiptYear &&
           String(other[11]||'').toUpperCase()==='SELESAI'))
          throw new Error('Bayaran bulan ini sudah disahkan pada transaksi lain.');
        const next=(maximum[receiptYear]||0)+1;
        if(next>9999)throw new Error('Nombor resit tahunan sudah penuh.');
        const serial='UPKK-M-'+receiptYear+'-'+String(next).padStart(4,'0');
        const now=new Date();
        // L:U = STATUS, NO_RESIT, APPROVED_BY, APPROVED_AT, REJECT_REASON,
        // PDF_URL, RECEIPT_STATE, UPDATED_AT, NOTE, ATTEMPT.
        sh.getRange(row,12,1,10).setValues([[
          'SELESAI',serial,admin,now,'','','RESERVED',now,
          'Menunggu AutoCrat bulanan',0
        ]]);
        SpreadsheetApp.flush();
        return {success:true,status:'SELESAI',requestId:id,receipt:serial,
          message:'Bayaran disahkan. Resit '+serial+' menunggu AutoCrat.'};
      }
      sh.getRange(row,12,1,5).setValues([[
        'REJECTED',String(r[12]||''),admin,new Date(),note
      ]]);
      SpreadsheetApp.flush();
      return {success:true,status:'REJECTED',requestId:id,
        message:'Bayaran ditolak. Sebab penolakan telah direkodkan.'};
    }finally{lock.releaseLock();}
  }catch(e){return {success:false,message:e.message};}
}
