/**
 * UPKK V2 Part 8C — QA ONLY, read-only AutoCrat monthly preflight.
 * No PDF generation, no AutoCrat calls, no triggers, no email.
 * Uses existing 8B ledger, protected Admin token and BACKUP guard.
 */
function previewMonthlyAutoCratQa(token,requestId){
  try{
    mrQaGuard_(token);
    const id=String(requestId||'').trim();
    if(!/^[0-9a-f-]{36}$/i.test(id))throw new Error('REQUEST_ID tidak sah.');
    const q=mrQaSheet_();
    if(!q.ready)throw new Error('Metadata resit R:U belum disediakan.');
    const rows=q.sh.getDataRange().getValues();
    const p=mrQaPayment_(rows,id); // also rejects duplicate settled period
    mrQaCheckSerials_(rows); // detects duplicates and mismatched years globally
    const r=p.r;
    const serial=String(r[12]||'').trim();
    if(!MR_SERIAL_RE_.test(serial) || Number(serial.match(MR_SERIAL_RE_)[1])!==p.year)
      throw new Error('Nombor resit bulanan tidak sah.');
    const state=String(r[17]||'').trim();
    const pdfUrl=String(r[16]||'').trim();
    const attempt=Number(r[20]||0);
    if(!Number.isInteger(attempt)||attempt<0)throw new Error('Bilangan percubaan tidak sah.');
    if(state==='READY'){
      if(!/^https:\/\/drive\.google\.com\/file\/d\//.test(pdfUrl))
        throw new Error('READY tanpa pautan PDF yang sah.');
      return {success:true,eligible:false,status:'PDF_READY',serial,month:p.month,year:p.year};
    }
    if(state==='MERGING'||state==='UNCERTAIN')
      return {success:true,eligible:false,status:'RECONCILIATION_REQUIRED',serial,month:p.month,year:p.year};
    if(state!=='RESERVED'||pdfUrl||attempt)
      throw new Error('Keadaan resit tidak selamat untuk merge.');
    return {success:true,eligible:true,status:'READY_FOR_CONTROLLED_MANUAL_MERGE',
      serial,month:p.month,year:p.year,amount:Number(r[9]),
      requestId:id,receiptState:state,delivery:'DISABLED'};
  }catch(e){return {success:false,eligible:false,message:e.message};}
}

/**
 * Read-only BACKUP Admin readiness report for monthly receipt pipeline.
 * Aggregate counts only: never return pupil IDs, names, emails, private URLs,
 * request IDs, session data, PDFs, or side effects.
 * This does NOT prove AutoCrat integration or allow a merge.
 */
function auditMonthlyReceiptReadinessQa(token){
  try{
    mrQaGuard_(token);
    const q=mrQaSheet_();
    if(!q.ready)return {success:false,ready:false,
      message:'Header R:U belum disediakan. Tiada perubahan dibuat.'};
    const rows=q.sh.getDataRange().getValues();
    // Reject duplicate/malformed receipt serials before reporting readiness.
    mrQaCheckSerials_(rows);
    const states={PENDING:0,SELESAI:0,REJECTED:0};
    const receipts={NONE:0,RESERVED:0,MERGING:0,UNCERTAIN:0,READY:0,INCONSISTENT:0};
    let unsettledWithReceipt=0,settledWithoutSerial=0,otherStatuses=0;
    for(let i=1;i<rows.length;i++){
      const r=rows[i],payment=String(r[11]||'').trim().toUpperCase();
      if(!payment && r.every(v=>v===''||v===null))continue;
      if(Object.prototype.hasOwnProperty.call(states,payment))states[payment]++;
      else otherStatuses++;
      const state=String(r[17]||'').trim().toUpperCase()||'NONE';
      if(Object.prototype.hasOwnProperty.call(receipts,state))receipts[state]++;
      else receipts.INCONSISTENT++;
      const serial=String(r[12]||'').trim();
      const pdf=String(r[16]||'').trim();
      if(payment!=='SELESAI' && (serial||pdf||state!=='NONE'))unsettledWithReceipt++;
      if(payment==='SELESAI' && !serial)settledWithoutSerial++;
      if((state==='READY'&&!pdf) || (state==='NONE'&&(serial||pdf)) ||
         (state==='RESERVED'&&pdf) ||
         (state==='MERGING'&&pdf))receipts.INCONSISTENT++;
    }
    const issues=[];
    if(otherStatuses)issues.push('Status transaksi tidak dikenali.');
    if(unsettledWithReceipt)issues.push('Transaksi belum selesai mempunyai metadata resit.');
    if(receipts.INCONSISTENT)issues.push('Metadata resit tidak konsisten; semak sebelum merge.');
    if(receipts.MERGING||receipts.UNCERTAIN)
      issues.push('Merge tergantung atau tidak pasti; reconciliation diperlukan.');
    return {
      success:true,ready:issues.length===0 && settledWithoutSerial===0,headersReady:true,
      total:rows.length-1,transactions:states,receipts:receipts,
      settledWithoutSerial:settledWithoutSerial,issues:issues,
      monthlyAutoCrat:'NOT_CONFIGURED_IN_THIS_MODULE',
      note:'READ ONLY. Tiada PDF, e-mel, nombor resit atau transaksi dijana.'
    };
  }catch(e){return {success:false,ready:false,message:e.message};}
}


/**
 * Operator-driven bridge for AutoCrat's own V:Y columns.
 * Does not start AutoCrat, send mail, create PDFs, share Drive files,
 * or run any trigger. Only settles ledger Q/R after independent checks.
 */
function syncMonthlyAutoCratPdfQa(token,requestId){
  try{
    mrQaGuard_(token);
    const id=String(requestId||'').trim();
    if(!/^[0-9a-f-]{36}$/i.test(id))throw new Error('REQUEST_ID tidak sah.');
    const lock=LockService.getScriptLock();
    if(!lock.tryLock(20000))throw new Error('Sistem sibuk. Cuba lagi.');
    try{
      const q=mrQaSheet_();
      if(!q.ready)throw new Error('Header R:U belum lengkap.');
      const headers=q.sh.getRange(1,22,1,4).getDisplayValues()[0];
      const job='UPKK V2 - RESIT BULANAN QA';
      const expected=[
        'Merged Doc ID - '+job,
        'Merged Doc URL - '+job,
        'Link to merged Doc - '+job,
        'Document Merge Status - '+job
      ];
      if(expected.some((x,i)=>x!==headers[i]))
        throw new Error('Header output AutoCrat V:Y tidak sepadan dengan job QA.');
      const rows=q.sh.getDataRange().getValues();
      const p=mrQaPayment_(rows,id);
      mrQaCheckSerials_(rows);
      const r=p.r,serial=String(r[12]||'').trim();
      const existing=String(r[16]||'').trim();
      const state=String(r[17]||'').trim().toUpperCase();
      const fileId=String(r[21]||'').trim();
      const url=String(r[22]||'').trim();
      const display=String(r[23]||'').trim();
      const status=String(r[24]||'');
      if(!MR_SERIAL_RE_.test(serial)||Number(serial.match(MR_SERIAL_RE_)[1])!==p.year)
        throw new Error('Siri resit bulanan tidak sepadan dengan tahun.');
      if(!/^[A-Za-z0-9_-]{20,}$/.test(fileId))
        throw new Error('AutoCrat belum merekodkan ID fail PDF.');
      const matched=/^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)\/view(?:\?.*)?$/.exec(url);
      if(!matched||matched[1]!==fileId)
        throw new Error('ID dan URL PDF AutoCrat tidak sepadan.');
      if(display!=='RESIT_UPKK_V2_'+serial)
        throw new Error('Nama output AutoCrat tidak sepadan dengan nombor resit.');
      if(!/Document successfully merged/i.test(status)||!/PDF created/i.test(status))
        throw new Error('AutoCrat belum mengesahkan PDF berjaya dijana.');
      const file=DriveApp.getFileById(fileId);
      if(file.isTrashed()||file.getMimeType()!=='application/pdf')
        throw new Error('Fail AutoCrat bukan PDF sah atau sudah dipadam.');
      if(file.getSharingAccess()!==DriveApp.Access.PRIVATE)
        throw new Error('PDF mesti PRIVATE; periksa sharing dahulu.');
      const canonical='https://drive.google.com/file/d/'+fileId+'/view';
      if(existing&&existing!==canonical&&existing!==url)
        throw new Error('Q sudah memautkan PDF lain. Hentikan sync.');
      if(state==='READY'){
        if(!existing)throw new Error('READY tanpa PDF Q tidak konsisten.');
        return {success:true,unchanged:true,state:'READY',serial,
          message:'Resit sudah READY. Tiada perubahan; PDF tidak dijana semula.'};
      }
      if(!['RESERVED','MERGING','UNCERTAIN'].includes(state))
        throw new Error('Status resit tidak layak diselaraskan.');
      const attempt=Number(r[20]||0);
      if(!Number.isInteger(attempt)||attempt<0)
        throw new Error('Percubaan merge tidak sah.');
      q.sh.getRange(p.row,17,1,5).setValues([[
        canonical,'READY',new Date(),'Verified AutoCrat PDF V:Y (QA); no new merge',attempt
      ]]);
      SpreadsheetApp.flush();
      return {success:true,unchanged:false,state:'READY',serial,
        message:'PDF AutoCrat disahkan dan metadata Q:R dikemas kini. Tiada PDF atau e-mel baharu.'};
    }finally{lock.releaseLock();}
  }catch(e){return {success:false,message:e.message};}
}
