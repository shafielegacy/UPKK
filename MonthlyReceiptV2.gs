/**
 * UPKK V2 — Part 8B monthly receipt ledger, QA BACKUP ONLY.
 * Never creates a PDF, emails parents, or starts an AutoCrat trigger.
 * Append metadata R:U to existing NATIVE_EBAYAR; A:Q remain unchanged.
 * Invoke only via authenticated Admin GAS HTML Service, never JSONP.
 */
const MR_QA_COLUMNS_=['RECEIPT_STATE','RECEIPT_UPDATED_AT','RECEIPT_NOTE','RECEIPT_ATTEMPT'];
const MR_SERIAL_RE_=/^UPKK-M-(20\d{2})-(\d{4,})$/;
function mrQaGuard_(token){
  upkkAdminV2Auth_(token);
  neGuard_();
}
function mrQaSheet_(){
  const sh=neSheet_(false);
  const heads=sh.getRange(1,18,1,MR_QA_COLUMNS_.length).getDisplayValues()[0];
  const occupied=heads.some(Boolean);
  if(occupied && MR_QA_COLUMNS_.some((h,i)=>heads[i]!==h))
    throw new Error('Struktur metadata resit R:U tidak konsisten. Berhenti.');
  return {sh,ready:MR_QA_COLUMNS_.every((h,i)=>heads[i]===h)};
}
function prepareMonthlyReceiptQaColumns(token){
  try{
    mrQaGuard_(token);
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(15000))throw new Error('Sistem sibuk.');
    try{
      const q=mrQaSheet_();
      if(!q.ready)q.sh.getRange(1,18,1,4).setValues([MR_QA_COLUMNS_]);
      SpreadsheetApp.flush();
      return {success:true,message:'Metadata resit QA R:U disediakan; data A:Q tidak diubah.'};
    }finally{lock.releaseLock();}
  }catch(e){return {success:false,message:e.message};}
}
function mrQaPayment_(rows,id){
  const found=[];
  for(let i=1;i<rows.length;i++)if(String(rows[i][0]||'').trim()===id)found.push(i);
  if(found.length!==1)throw new Error('REQUEST_ID tiada atau berganda.');
  const index=found[0],r=rows[index];
  if(String(r[11]||'').trim()!=='SELESAI')
    throw new Error('Resit hanya boleh disediakan untuk transaksi SELESAI.');
  const mykid=neNormalMyKid_(r[3]),year=Number(r[6]),month=String(r[5]||'').trim();
  if(!/^\d{12}$/.test(mykid)||!Number.isInteger(year)||year<2026||year>2027||
     NE_MONTHS_.indexOf(month)<0||!Number.isFinite(Number(r[9]))||Number(r[9])<=0)
    throw new Error('Transaksi tidak lengkap.');
  if(rows.some((other,i)=>i!==index &&
      neNormalMyKid_(other[3])===mykid && Number(other[6])===year &&
      String(other[5])===month && String(other[11])==='SELESAI'))
    throw new Error('Dua transaksi SELESAI untuk murid/bulan/tahun sama.');
  return {index,row:index+1,r,year,month,mykid};
}
function mrQaCheckSerials_(rows){
  const used=new Set(),byYear={};
  rows.slice(1).forEach(r=>{
    const serial=String(r[12]||'').trim();
    if(!serial)return;
    const match=serial.match(MR_SERIAL_RE_);
    if(!match)throw new Error('Nombor resit bulanan tidak sah. Hentikan alokasi.');
    if(used.has(serial))throw new Error('Nombor resit bulanan berganda. Hentikan alokasi.');
    if(Number(match[1])!==Number(r[6]))throw new Error('Tahun nombor resit tidak sepadan.');
    used.add(serial);
    const y=Number(match[1]);byYear[y]=Math.max(byYear[y]||0,Number(match[2]));
  });
  return byYear;
}
function mrQaLockAction_(token,id,action,pdfUrl,note){
  try{
    mrQaGuard_(token);
    if(!/^[0-9a-f-]{36}$/i.test(String(id||'')))throw new Error('REQUEST_ID tidak sah.');
    if(!['RESERVE','MARK_MERGING','RECONCILE_READY','MARK_UNCERTAIN'].includes(action))
      throw new Error('Tindakan resit tidak sah.');
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(20000))throw new Error('Sistem sibuk.');
    try{
      const q=mrQaSheet_();
      if(!q.ready)throw new Error('Metadata resit QA belum disediakan.');
      const rows=q.sh.getDataRange().getValues(),p=mrQaPayment_(rows,id);
      const existing=String(p.r[12]||'').trim();
      let state=String(p.r[17]||'').trim(),attempt=Number(p.r[20]||0),serial=existing;
      if(!Number.isInteger(attempt)||attempt<0)throw new Error('Bilangan percubaan tidak sah.');
      if(action==='RESERVE'){
        const maximum=mrQaCheckSerials_(rows);
        if(serial){
          if(state!=='RESERVED'&&state!=='MERGING'&&state!=='UNCERTAIN'&&state!=='READY')
            throw new Error('Resit sedia ada mempunyai status tidak konsisten.');
          return {success:true,serial,state,unchanged:true};
        }
        if(state||String(p.r[16]||'').trim()||attempt)
          throw new Error('Metadata resit sudah wujud tanpa nombor siri; semak manual.');
        const next=(maximum[p.year]||0)+1;
        if(next>9999)throw new Error('Siri tahun ini sudah penuh; format perlu disemak.');
        serial='UPKK-M-'+p.year+'-'+String(next).padStart(4,'0');
        q.sh.getRange(p.row,13).setValue(serial);
        state='RESERVED';
      }else{
        mrQaCheckSerials_(rows);
        if(!serial||!MR_SERIAL_RE_.test(serial))throw new Error('Simpan nombor resit dahulu.');
        if(action==='MARK_MERGING'){
          if(state!=='RESERVED')throw new Error('Hanya RESERVED boleh dimulakan sekali. Reconcile kegagalan dahulu.');
          if(String(p.r[16]||'').trim())throw new Error('PDF sudah direkod.');
          state='MERGING';attempt++;
        }else if(action==='MARK_UNCERTAIN'){
          if(state!=='MERGING')throw new Error('Hanya MERGING boleh bertukar UNCERTAIN.');
          state='UNCERTAIN';
        }else{
          if(state!=='MERGING'&&state!=='UNCERTAIN')throw new Error('READY memerlukan proses merge atau reconciliation.');
          if(!/^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\//.test(String(pdfUrl||'')))
            throw new Error('URL mesti PDF Google Drive.');
          const fileId=String(pdfUrl).match(/\/file\/d\/([a-zA-Z0-9_-]+)\//)[1];
          const file=DriveApp.getFileById(fileId);
          if(file.isTrashed()||file.getMimeType()!=='application/pdf')
            throw new Error('PDF tidak sah atau sudah dipadam.');
          const oldUrl=String(p.r[16]||'').trim();
          if(oldUrl && oldUrl!==pdfUrl)throw new Error('PDF sudah dipautkan kepada fail lain.');
          // Operator must verify the private file and AutoCrat dedup out of band.
          q.sh.getRange(p.row,17).setValue(pdfUrl);
          state='READY';
        }
      }
      q.sh.getRange(p.row,18,1,4).setValues([[state,new Date(),String(note||'').slice(0,200),attempt]]);
      SpreadsheetApp.flush();
      return {success:true,requestId:id,serial,state,attempt};
    }finally{lock.releaseLock();}
  }catch(e){return {success:false,message:e.message};}
}
function reserveMonthlyReceiptQa(token,requestId){
  return mrQaLockAction_(token,requestId,'RESERVE','','');
}
function markMonthlyReceiptMergingQa(token,requestId){
  return mrQaLockAction_(token,requestId,'MARK_MERGING','','Operator starts controlled monthly merge');
}
function markMonthlyReceiptUncertainQa(token,requestId,note){
  return mrQaLockAction_(token,requestId,'MARK_UNCERTAIN','',note||'Reconcile before any retry');
}
function reconcileMonthlyReceiptPdfQa(token,requestId,pdfUrl,note){
  return mrQaLockAction_(token,requestId,'RECONCILE_READY',pdfUrl,note||'Verified private PDF');
}
