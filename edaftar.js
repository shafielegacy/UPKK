// HTTPS POST only. No JSONP, URL payloads, persistent tokens or automatic retries.
const $=id=>document.getElementById(id);
var nativeEdaftarState={available:false,verifiedEmail:'',otpTicket:'',busy:false,quotedTotal:null,seatsYear:null,seatsPending:false,seatsRequest:0,submitted:false};
async function pagesEdaftarRpc(fn,args){
 const cfg=window.UPKK_EDAFTAR_CONFIG||{};
 if(cfg.enabled!==true||!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||''))
   return {success:false,message:'Pendaftaran belum dibuka. Tiada data dihantar.'};
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),45000);
 try{
   const response=await fetch(cfg.endpoint,{method:'POST',mode:'cors',credentials:'omit',
     redirect:'follow',referrerPolicy:'no-referrer',cache:'no-store',
     headers:{'Content-Type':'text/plain;charset=UTF-8'},
     body:JSON.stringify({action:'pagesNativeEdaftar',rpc:fn,args:args}),signal:ctrl.signal});
   if(!response.ok)throw new Error('transport');
   const result=await response.json();
   if(!result||typeof result.success!=='boolean')throw new Error('response');
   return result;
 }catch(e){
   return {success:false,uncertain:fn==='submitNativeEdaftar',
     message:fn==='submitNativeEdaftar'
       ?'Status simpanan belum dapat disahkan. Hubungi urusetia; jangan hantar semula.'
       :'Sambungan pendaftaran belum tersedia. Sila cuba lagi kemudian.'};
 }finally{clearTimeout(timer);}
}

function nativeEdaftarStatus(message) {
  var el=$('ed-status'); if(el) el.textContent=message;
}
function nativeEdaftarGAS(fn,payload,done) {
 nativeEdaftarState.busy=true;
 pagesEdaftarRpc(fn,[payload]).then(function(result){nativeEdaftarState.busy=false;done(result);});
}
function initNativeEdaftarQA() {
 pagesEdaftarRpc('getNativeEdaftarAvailability',[]).then(function(r){
  var fees=r&&r.configuredFees;
  var feeContract=!!(fees&&fees.daftar===50&&[0,50].includes(fees.bulanan)&&fees.total===fees.daftar+fees.bulanan);
  nativeEdaftarState.available=!!(r&&r.success&&r.enabled&&r.feeReady&&r.session==='2027'&&feeContract);
  nativeEdaftarState.quotedTotal=fees?Number(fees.total):null;
  if(feeContract){
   $('ed-slip-label').textContent='Bukti bayaran RM'+Number(fees.total).toFixed(2);
   $('ed-fee-quote').textContent='RM'+Number(fees.daftar).toFixed(2)+' pendaftaran'+
     (Number(fees.bulanan)>0?' + RM'+Number(fees.bulanan).toFixed(2)+' bulan pertama':' untuk tempahan tempat');
  }
  $('ed-request-otp').disabled=!nativeEdaftarState.available;
  nativeEdaftarStatus(nativeEdaftarState.available?'Masukkan maklumat dan sahkan e-mel sebelum menghantar.':(r.message||'Pendaftaran belum dibuka. Tiada data dihantar.'));
  refreshNativeEdaftarSeatsUI(true);
 });
}
// Read-only live availability; no MyKid is transmitted to the seat-count endpoint.
function refreshNativeEdaftarSeatsUI(force) {
  var yearInput=$('ed-tahun-kelas'), mode=$('ed-mod-kelas'),label=$('ed-seats-status');
  if(!yearInput||!mode||!label)return;
  var match=/^Tahun ([345])$/.exec(yearInput.value||'');
  var year=match?Number(match[1]):null;
  if(!year||!nativeEdaftarState.available) {
    nativeEdaftarState.seatsPending=false;
    nativeEdaftarState.seatsRequest++;
    nativeEdaftarState.seatsYear=null;
    mode.options[1].textContent='Fizikal (maksimum 30 murid setiap tahun)';
    mode.options[2].textContent='Online (maksimum 20 murid setiap tahun)';
    mode.options[1].disabled=mode.options[2].disabled=true;
    if(!year)mode.value='';
    label.textContent=year?'Baki tempat belum dapat disemak.':'Masukkan MyKid untuk melihat baki kekosongan Tahun 3–5.';
    return;
  }
  if(!force&&nativeEdaftarState.seatsYear===year)return;
  nativeEdaftarState.seatsYear=year;
  nativeEdaftarState.seatsPending=true;
  var request=++nativeEdaftarState.seatsRequest;
  label.textContent='Menyemak baki kekosongan Tahun '+year+'…';
  mode.options[1].disabled=mode.options[2].disabled=true;
  function finish(r) {
    if(request!==nativeEdaftarState.seatsRequest)return;
    nativeEdaftarState.seatsPending=false;
    if(!r||!r.success||r.year!==year) {
      nativeEdaftarState.seatsYear=null;
      label.textContent='Baki tempat tidak dapat disemak. Klik pilihan mod untuk cuba lagi.';
      return;
    }
    [['FIZIKAL',1,30,'Fizikal'],['ONLINE',2,20,'Online']].forEach(function(entry){
      var value=r.remaining&&r.remaining[entry[0]],n=Number.isInteger(value)?Math.max(0,Math.min(entry[2],value)):0,opt=mode.options[entry[1]];
      opt.textContent=entry[3]+' — '+(n?' '+n+' tempat lagi':'PENUH');
      opt.disabled=n===0;
      if(!n&&mode.value===entry[0])mode.value='';
    });
    label.textContent='Baki tempat Tahun '+year+' dikemas kini. Kuota disemak semula semasa menghantar.';
  }
  pagesEdaftarRpc('getNativeEdaftarSeats',[year]).then(finish);
}
// MyKid displayed as YYMMDD-XX-XXXX. Server validates independently.
function nativeMykidSessionAgeUI(value) {
  var digits=String(value||'').replace(/\D/g,'');
  if(!/^\d{12}$/.test(digits))return null;
  var year=2000+Number(digits.slice(0,2));
  var month=Number(digits.slice(2,4)),day=Number(digits.slice(4,6));
  var date=new Date(Date.UTC(year,month-1,day));
  if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)return null;
  return 2027-year;
}
function updateNativeMykidUI() {
  var input=$('ed-mykid'),help=$('ed-mykid-help');
  if(!input||!help)return;
  var digits=input.value.replace(/\D/g,'').slice(0,12);
  input.value=digits.slice(0,6)+(digits.length>6?'-'+digits.slice(6,8):'')+(digits.length>8?'-'+digits.slice(8):'');
  var age=nativeMykidSessionAgeUI(input.value);
  if(digits.length===0) {
    help.textContent='Umur sesi 2027 dikira daripada MyKid. Pengambilan Tahun 3, Tahun 4 dan Tahun 5.';
    input.setCustomValidity('');
  } else if(digits.length<12) {
    help.textContent='Lengkapkan 12 digit No. MyKid.';
    input.setCustomValidity('No. MyKid perlu mempunyai 12 digit.');
  } else if(age===null) {
    help.textContent='Tarikh lahir dalam No. MyKid tidak sah.';
    input.setCustomValidity('Tarikh lahir MyKid tidak sah.');
  } else if(![9,10,11].includes(age)) {
    help.textContent='Umur sesi 2027: '+age+' tahun. Pengambilan hanya Tahun 3, 4 atau 5.';
    input.setCustomValidity('Pengambilan pakej baharu hanya Tahun 3, 4 atau 5.');
  } else {
    help.textContent='Umur sesi 2027: '+age+' tahun · Tahun '+(age-6)+'.';
    input.setCustomValidity('');
  }
  var yearField=$('ed-tahun-kelas');
  if(yearField) {
    if(digits.length===0)yearField.value='';
    else if(digits.length<12||age===null)yearField.value='MyKid belum lengkap atau tidak sah';
    else if([9,10,11].includes(age))yearField.value='Tahun '+(age-6);
    else yearField.value='Tidak layak — umur '+age+' tahun (anggaran Tahun '+(age-6)+')';
  }
  refreshNativeEdaftarSeatsUI(false);
}
function requestNativeEdaftarOtpUI() {
  if(!nativeEdaftarState.available||nativeEdaftarState.busy)return;
  var email=$('ed-email').value.trim().toLowerCase();
  if(!$('ed-email').checkValidity()){nativeEdaftarStatus('Masukkan alamat e-mel yang sah.');return;}
  nativeEdaftarState.verifiedEmail='';
  nativeEdaftarState.otpTicket='';
  $('ed-submit').disabled=true;$('ed-verify-otp').disabled=true;
  nativeEdaftarStatus('Menghantar OTP...');
  nativeEdaftarGAS('requestNativeEdaftarOtp',email,function(r) {
    $('ed-verify-otp').disabled=!r.success;
    nativeEdaftarStatus(r.message||'Sila cuba semula.');
  });
}
function verifyNativeEdaftarOtpUI() {
 if(!nativeEdaftarState.available||nativeEdaftarState.busy)return;
 var email=$('ed-email').value.trim().toLowerCase(),code=$('ed-otp').value.trim();
 if(!/^\d{6}$/.test(code)){nativeEdaftarStatus('Masukkan kod OTP 6 digit.');return;}
 nativeEdaftarState.busy=true;
 pagesEdaftarRpc('verifyNativeEdaftarOtp',[email,code]).then(function(r){
  nativeEdaftarState.busy=false;
  if($('ed-email').value.trim().toLowerCase()!==email)return;
  nativeEdaftarState.verifiedEmail=r.success?email:'';
  nativeEdaftarState.otpTicket=r.success&&r.ticket?String(r.ticket):'';
  $('ed-submit').disabled=!nativeEdaftarState.otpTicket;
  nativeEdaftarStatus(r.message||'OTP belum disahkan.');
 });
}
function closeNativeEdaftarConfirmUI() {
  var dialog=$('ed-confirm-dialog');
  if(dialog && dialog.open)dialog.close();
}
function submitNativeEdaftarUI(confirmed) {
  var form=$('native-edaftar-form');
  if(!form||!form.reportValidity()||!nativeEdaftarState.available||nativeEdaftarState.busy||nativeEdaftarState.submitted)return;
  var email=$('ed-email').value.trim().toLowerCase();
  if(!nativeEdaftarState.otpTicket||nativeEdaftarState.verifiedEmail!==email){nativeEdaftarStatus('Sahkan semula e-mel melalui OTP.');return;}
  var file=$('ed-slip').files && $('ed-slip').files[0];
  if(!file || !['image/jpeg','image/png','application/pdf'].includes(file.type) || file.size>3*1024*1024 || !file.size) {
    nativeEdaftarStatus('Pilih slip JPEG, PNG atau PDF dengan saiz maksimum 3 MB.');return;
  }
  var data={
    namaPenjaga:$('ed-nama-penjaga').value,email:email,telefon:$('ed-telefon').value,
    namaMurid:$('ed-nama-murid').value,mykid:$('ed-mykid').value,
    alamat:$('ed-alamat').value,
    modKelas:$('ed-mod-kelas').value,
    quotedTotal:nativeEdaftarState.quotedTotal,
    otpTicket:nativeEdaftarState.otpTicket
  };
  if(confirmed!==true){
    var dialog=$('ed-confirm-dialog');
    $('ed-confirm-name').textContent=data.namaMurid;
    $('ed-confirm-fee').textContent='RM'+Number(nativeEdaftarState.quotedTotal).toFixed(2);
    if(dialog && typeof dialog.showModal==='function')dialog.showModal();
    else nativeEdaftarStatus('Paparan pengesahan tidak tersedia. Sila cuba pelayar lain.');
    return;
  }
  closeNativeEdaftarConfirmUI();
  nativeEdaftarState.busy=true;
  $('ed-submit').disabled=true;
  nativeEdaftarStatus('Menyediakan slip...');
  var reader=new FileReader();
  reader.onerror=function(){
    nativeEdaftarState.busy=false;
    nativeEdaftarStatus('Slip gagal dibaca. Cuba pilih fail semula.');
    $('ed-submit').disabled=false;
  };
  reader.onload=function(){
    var encoded=String(reader.result||'').split(',')[1]||'';
    if(!encoded){
      nativeEdaftarState.busy=false;
      nativeEdaftarStatus('Format slip tidak sah.');
      $('ed-submit').disabled=false;return;
    }
    data.slip={base64:encoded,mimeType:file.type};
    nativeEdaftarState.submitted=true;
    nativeEdaftarStatus('Menghantar permohonan dan slip untuk semakan...');
    nativeEdaftarGAS('submitNativeEdaftar',data,function(r){
      nativeEdaftarStatus(r.message||'Permohonan tidak dapat diproses.');
      nativeEdaftarState.available=false;
      nativeEdaftarState.verifiedEmail='';
      nativeEdaftarState.otpTicket='';
      $('ed-request-otp').disabled=true;
      $('ed-verify-otp').disabled=true;
      $('ed-submit').disabled=true;
      $('ed-otp').value='';
      if(r.success){form.reset();updateNativeMykidUI();}
      else nativeEdaftarStatus((r.message||'Status belum disahkan.')+' Hubungi urusetia sebelum mencuba lagi.');

    });
  };
  reader.readAsDataURL(file);
}
document.addEventListener('DOMContentLoaded',function(){
  var form=$('native-edaftar-form');
  if(form)form.addEventListener('submit',function(event){event.preventDefault();submitNativeEdaftarUI();});
  var mykid=$('ed-mykid');
  if(mykid){mykid.addEventListener('input',updateNativeMykidUI);updateNativeMykidUI();}
  var mode=$('ed-mod-kelas');
  if(mode)mode.addEventListener('focus',function(){refreshNativeEdaftarSeatsUI(true);});
  var email=$('ed-email');
  if(email)email.addEventListener('input',function(){
    nativeEdaftarState.verifiedEmail='';
    nativeEdaftarState.otpTicket='';
    var submit=$('ed-submit');if(submit)submit.disabled=true;
  });
  initNativeEdaftarQA();
});


document.addEventListener('DOMContentLoaded',function(){[['ed-request-otp',requestNativeEdaftarOtpUI],['ed-verify-otp',verifyNativeEdaftarOtpUI],['ed-confirm-cancel',closeNativeEdaftarConfirmUI],['ed-confirm-yes',function(){submitNativeEdaftarUI(true);}]].forEach(function(pair){$(pair[0]).addEventListener('click',pair[1]);});});
