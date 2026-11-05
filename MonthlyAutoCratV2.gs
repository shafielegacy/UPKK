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
