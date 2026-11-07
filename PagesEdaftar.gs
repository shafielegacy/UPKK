/**
 * POST-only pilot adapter for existing NativeEdaftar V2.
 * Install alongside NativeEdaftar.gs + AdminV2.gs in a NON-LIVE test project.
 * Never expose this helper in doGet/_handleApi. Trailing _ blocks script.run.
 * This candidate deliberately requires a nominated tester; no public mode.
 */
function pagesNativeEdaftarPost_(body) {
  const reply = result => ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
  const closed = () => reply({success:false,message:'Pendaftaran belum dibuka kepada umum.'});
  try {
    const props=PropertiesService.getScriptProperties();
    const tester=String(props.getProperty('UPKK_NATIVE_EDAFTAR_TEST_EMAIL')||'').trim().toLowerCase();
    if(props.getProperty('UPKK_PAGES_EDAFTAR_QA_ENABLED')!=='true' || !tester) return closed();
    if(!body || typeof body!=='object' || body.callback || body.prefix ||
       !Array.isArray(body.args)) return closed();
    const rpc=body.rpc,args=body.args;
    const counts={getNativeEdaftarAvailability:0,getNativeEdaftarSeats:1,
      requestNativeEdaftarOtp:1,verifyNativeEdaftarOtp:2,submitNativeEdaftar:1};
    if(!Object.prototype.hasOwnProperty.call(counts,rpc)||args.length!==counts[rpc]) return closed();
    const email=rpc==='submitNativeEdaftar' ? args[0]&&args[0].email : args[0];
    if(['requestNativeEdaftarOtp','verifyNativeEdaftarOtp','submitNativeEdaftar'].includes(rpc) &&
       (typeof email!=='string'||email.trim().toLowerCase()!==tester)) return closed();
    // Explicit calls only: no dynamic global dispatch, no legacy/Admin methods.
    let result;
    switch(rpc) {
      case 'getNativeEdaftarAvailability': result=getNativeEdaftarAvailability();break;
      case 'getNativeEdaftarSeats':
        if(![3,4,5].includes(args[0]))return closed();
        result=getNativeEdaftarSeats(args[0]);break;
      case 'requestNativeEdaftarOtp': result=requestNativeEdaftarOtp(email);break;
      case 'verifyNativeEdaftarOtp':
        if(!/^\d{6}$/.test(String(args[1]||'')))return closed();
        result=verifyNativeEdaftarOtp(email,String(args[1]));break;
      case 'submitNativeEdaftar':
        // Existing service validates OTP ticket, fee, duplicate, file and quota under lock.
        result=submitNativeEdaftar(args[0]);break;
    }
    return reply(result);
  } catch(e) {
    // Do not echo payload, identifiers, deployment internals or underlying exceptions.
    return reply({success:false,message:'Perkhidmatan pendaftaran belum tersedia. Hubungi urusetia.'});
  }
}
