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
