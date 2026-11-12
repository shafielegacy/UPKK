'use strict';
(function(){
  const $=id=>document.getElementById(id);
  const cfg=window.UPKK_PARENT_V2_CONFIG||{};
  const state={token:null,loginEmail:null,loginPhone:null,busy:false};
  const msg=text=>{ $('parent-message').textContent=String(text||''); };
  const canUse=()=>cfg.enabled===true && /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
  const setBusy=value=>{state.busy=value; $('request-otp').disabled=value||!canUse();$('verify-otp').disabled=value;};
  async function rpc(fn,args){
    if(!canUse())return {success:false,message:'Akses ibu bapa V2 belum dibuka.'};
    const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),30000);
    try{
      const resp=await fetch(cfg.endpoint,{method:'POST',mode:'cors',redirect:'follow',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({action:'pagesParentV2',rpc:fn,args}),signal:ctrl.signal});
      if(!resp.ok)throw Error('HTTP');const data=await resp.json();
      if(!data||typeof data.success!=='boolean')throw Error('Invalid response');return data;
    }catch(_){return {success:false,message:'Sambungan belum tersedia. Hubungi urusetia jika masalah berterusan.'};}
    finally{clearTimeout(timer);}
  }
  function item(dl,label,value){const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=String(value==null?'—':value);dl.append(dt,dd);}
  function render(data){
    const holder=$('parent-children');holder.replaceChildren();
    for(const child of data.children||[]){
      const section=document.createElement('article');section.className='child';
      const h=document.createElement('h3');h.textContent=String(child.studentName||'Murid');
      const p=document.createElement('span');p.className='pill';p.textContent='SESI '+String(child.session||'');
      const dl=document.createElement('dl');
      if(child.session==='2027'){
        item(dl,'Tahun kelas',child.classYear);item(dl,'Mod',child.mode);
        item(dl,'Yuran pendaftaran diterima','RM'+Number(child.registrationPaid||0).toFixed(2));
        item(dl,'Yuran bulan pertama diterima','RM'+Number(child.firstMonthPaid||0).toFixed(2));
        item(dl,'Status bulan pertama',child.firstMonthStatus);item(dl,'No. resit',child.receiptNumber);
      } else {item(dl,'Sesi','2026 · Legacy');item(dl,'No. resit pendaftaran',child.receiptNumber);}
      section.append(h,p,dl);holder.append(section);
    }
    if(!holder.childElementCount){const p=document.createElement('p');p.textContent='Tiada rekod yang boleh dipaparkan.';holder.append(p);}
    $('parent-dashboard').hidden=false;$('parent-login').hidden=true;$('parent-verify').hidden=true;
    msg('Rekod ibu bapa berjaya disahkan.');
  }
  $('parent-login').addEventListener('submit',async event=>{
    event.preventDefault();if(state.busy||!canUse())return;
    const email=$('parent-email').value.trim().toLowerCase();const phone=$('parent-phone').value.trim();
    if(!$('parent-login').reportValidity()||!/^[0-9]{6}$/.test(phone))return;
    state.loginEmail=email;state.loginPhone=phone;setBusy(true);msg('Memproses permintaan OTP...');
    const r=await rpc('requestParentV2Otp',[email,phone]);setBusy(false);msg(r.message||'Permintaan diproses.');
    if(r.success){$('parent-verify').hidden=false;$('parent-otp').focus();}
  });
  $('parent-verify').addEventListener('submit',async event=>{
    event.preventDefault();if(state.busy||!canUse()||!$('parent-verify').reportValidity())return;
    const otp=$('parent-otp').value.trim();if(!/^[0-9]{6}$/.test(otp))return;
    setBusy(true);msg('Mengesahkan kod...');
    const verified=await rpc('verifyParentV2Otp',[state.loginEmail,state.loginPhone,otp]);
    if(!verified.success||!/^[0-9a-f]{64}$/.test(String(verified.sessionToken||''))){setBusy(false);msg(verified.message||'Pengesahan gagal.');return;}
    state.token=verified.sessionToken;$('parent-otp').value='';
    const data=await rpc('getUnifiedParentV2',[state.token]);setBusy(false);
    if(data.success&&Array.isArray(data.children)){render(data);} else {state.token=null;msg(data.message||'Rekod tidak tersedia.');}
  });
  $('parent-logout').addEventListener('click',()=>{
    const token=state.token;state.token=null;state.loginEmail=null;state.loginPhone=null;
    $('parent-dashboard').hidden=true;$('parent-verify').hidden=true;$('parent-login').hidden=false;
    $('parent-login').reset();$('parent-verify').reset();$('parent-children').replaceChildren();
    msg('Sesi ditutup.');if(token)void rpc('logoutParentV2',[token]);
  });
  window.addEventListener('pagehide',()=>{state.token=null;});
  $('request-otp').disabled=!canUse();
  if(canUse())msg('Masukkan maklumat penjaga untuk menerima kod OTP.');
})();
