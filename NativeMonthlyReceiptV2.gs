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
    const r=matches[0];
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
