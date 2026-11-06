/**
 * UPKK V2 Part 8D — Monthly receipt retrieval, QA BACKUP ONLY.
 * Called ONLY through authenticated GAS google.script.run, never JSONP.
 * No Drive sharing mutations and no receipt generation.
 */
function getNativeMonthlyReceipt(token,mykid,month,year){
  try{
    const session=neGetSession_(token);
    const child=neChild_(session,mykid); // independent server ownership + approved enrolment check
    const key=String(month||'').trim().toUpperCase();
    const y=Number(year);
    if(!Number.isInteger(y)||y<2026||y>2027||!NE_MONTHS_.includes(key))
      throw new Error('Bulan atau tahun tidak sah.');
    // Do NOT call nePaymentYear_: retrieval must work for historical months.
    const sh=neSheet_(false),rows=sh.getDataRange().getValues();
    // Fail closed on duplicate receipt serials, including unrelated transaction rows.
    mrQaCheckSerials_(rows);
    const matches=rows.slice(1).filter(r=>
      neNormalMyKid_(r[3])===child.mykid &&
      String(r[2]||'').trim().toLowerCase()===session.email &&
      String(r[5]||'').trim().toUpperCase()===key&&
      Number(r[6])===y&&
      ['PENDING','SELESAI'].includes(String(r[11]||'').trim().toUpperCase()));
    if(matches.length>1)
      throw new Error('Rekod transaksi berganda. Hubungi urusetia.');
    if(!matches.length)
      return {success:false,state:'NOT_FOUND',message:'Tiada bayaran bulanan disahkan untuk pilihan ini.'};
    let r=matches[0];
    // Lazy sync: parent reading their own READY PDF is enough to reconcile
    // an already-generated AutoCrat output, without another GAS trigger.
    if(String(r[11]||'').trim()==='SELESAI' &&
       String(r[17]||'').trim()==='RESERVED' && !String(r[16]||'').trim() &&
       String(r[21]||'').trim()){
      neSyncOwnMonthlyPdfQa_(sh,String(r[0]||''),child.mykid,session.email,key,y);
      const refreshed=sh.getDataRange().getValues();
      mrQaCheckSerials_(refreshed);
      const current=refreshed.slice(1).filter(row=>
        String(row[0]||'')===String(r[0]||'') &&
        neNormalMyKid_(row[3])===child.mykid &&
        String(row[2]||'').trim().toLowerCase()===session.email &&
        String(row[5]||'').trim().toUpperCase()===key &&
        Number(row[6])===y);
      if(current.length!==1)throw new Error('Rekod bayaran berubah. Cuba semula.');
      r=current[0];
    }
    if(String(r[11]||'').trim()!=='SELESAI')
      return {success:false,state:'PENDING',message:'Bayaran sedang disemak urusetia. Resit belum tersedia.'};
    const serial=String(r[12]||'').trim(),state=String(r[17]||'').trim();
    const url=String(r[16]||'').trim();
    if(!/^UPKK-M-20\d{2}-\d{4,}$/.test(serial)||Number(serial.slice(7,11))!==y)
      return {success:false,state:'WAITING',message:'Bayaran disahkan. Nombor resit bulanan belum tersedia.'};
    if(state!=='READY'||!url)
      return {success:false,state:state==='UNCERTAIN'?'RECONCILIATION':'WAITING',
        message:'Bayaran telah disahkan. PDF resit sedang diproses.'};
    const match=/^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/(?:view(?:\?.*)?)?$/.exec(url);
    if(!match)throw new Error('Pautan PDF resit tidak sah.');
    const file=DriveApp.getFileById(match[1]);
    if(file.isTrashed()||file.getMimeType()!=='application/pdf')
      throw new Error('PDF resit tidak tersedia.');
    // Reject any public or domain-wide permission; per-guardian Drive permission
    // must still be independently verified before production.
    if(typeof file.getSharingAccess!=='function')
      throw new Error('Semakan kebenaran fail tidak tersedia.');
    const access=file.getSharingAccess();
    if(access!==DriveApp.Access.PRIVATE)
      throw new Error('PDF tidak mempunyai tetapan perkongsian peribadi.');
    return {success:true,state:'READY',noResit:serial,month:key,year:y,link:url};
  }catch(e){return {success:false,state:'ERROR',message:e.message};}
}

/**
 * QA only. Reconcile a single already-created private AutoCrat PDF while the
 * authenticated parent requests their own receipt. No email, PDF merge or
 * sharing mutation occurs. The script never runs the AutoCrat job.
 */
function neSyncOwnMonthlyPdfQa_(sh,requestId,mykid,guardianEmail,month,year){
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(20000))throw new Error('Resit sedang dikemas kini. Cuba semula.');
  try{
    neGuard_();
    const headers=sh.getRange(1,22,1,4).getDisplayValues()[0];
    const job='UPKK V2 - RESIT BULANAN QA';
    const expected=[
      'Merged Doc ID - '+job,
      'Merged Doc URL - '+job,
      'Link to merged Doc - '+job,
      'Document Merge Status - '+job
    ];
    if(expected.some((h,i)=>h!==headers[i]))
      throw new Error('Header AutoCrat QA tidak sepadan.');
    const rows=sh.getDataRange().getValues();
    mrQaCheckSerials_(rows);
    const selected=[];
    for(let i=1;i<rows.length;i++)
      if(String(rows[i][0]||'')===requestId)selected.push({row:i+1,data:rows[i]});
    if(selected.length!==1)throw new Error('Rujukan resit tidak unik.');
    const item=selected[0],r=item.data;
    if(neNormalMyKid_(r[3])!==mykid ||
       String(r[2]||'').trim().toLowerCase()!==guardianEmail ||
       String(r[5]||'').trim().toUpperCase()!==month ||
       Number(r[6])!==year || String(r[11]||'')!=='SELESAI')
      throw new Error('Akses resit tidak dibenarkan.');
    if(String(r[17]||'').trim()==='READY')return;
    if(String(r[17]||'').trim()!=='RESERVED'||String(r[16]||'').trim()||
       Number(r[20]||0)!==0)
      throw new Error('Resit memerlukan semakan urusetia.');
    const serial=String(r[12]||'').trim();
    if(!MR_SERIAL_RE_.test(serial)||Number(serial.match(MR_SERIAL_RE_)[1])!==year)
      throw new Error('Nombor resit tidak sah.');
    const fileId=String(r[21]||'').trim(),outputUrl=String(r[22]||'').trim();
    const display=String(r[23]||'').trim(),status=String(r[24]||'');
    const urlMatch=/^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)\/view(?:\?.*)?$/.exec(outputUrl);
    if(!/^[A-Za-z0-9_-]{20,}$/.test(fileId)||!urlMatch||urlMatch[1]!==fileId||
       display!=='RESIT_UPKK_V2_'+serial||
       !/Document successfully merged/i.test(status)||!/PDF created/i.test(status))
      throw new Error('Output AutoCrat belum lengkap atau tidak sepadan.');
    const file=DriveApp.getFileById(fileId);
    if(file.isTrashed()||file.getMimeType()!=='application/pdf'||
       file.getSharingAccess()!==DriveApp.Access.PRIVATE)
      throw new Error('Fail PDF tidak sah atau tidak PRIVATE.');
    sh.getRange(item.row,17,1,5).setValues([[
      'https://drive.google.com/file/d/'+fileId+'/view','READY',new Date(),
      'Auto-sync on authenticated guardian receipt lookup (QA)',0
    ]]);
    SpreadsheetApp.flush();
  }finally{lock.releaseLock();}
}
