'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const cfg=window.UPKK_ADMIN_NATIVE_V2_CONFIG||{};
 const state={token:null,busy:false};
 const canUse=()=>cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
 const message=s=>{$('v2-admin-message').textContent=String(s||'');};
 const action=s=>{$('v2-admin-action-status').textContent=String(s||'');};
 function busy(on){state.busy=on;$('v2-admin-signin').disabled=on||!canUse();$('v2-admin-refresh').disabled=on;}
 async function rpc(fn,args){
  if(!canUse())return {success:false,message:'Pentadbir V2 belum tersedia.'};
  const controller=new AbortController(),tid=setTimeout(()=>controller.abort(),30000);
  try{
   const res=await fetch(cfg.endpoint,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',redirect:'follow',referrerPolicy:'no-referrer',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({action:'pagesAdminNativeV2',rpc:fn,args}),signal:controller.signal});
   if(!res.ok)throw Error('HTTP error');
   const obj=await res.json();
   if(!obj||typeof obj.success!=='boolean')throw Error('Invalid response');
   return obj;
  }catch(_){return {success:false,message:'Sambungan Admin V2 belum tersedia.'};}
  finally{clearTimeout(tid);}
 }
 const el=(name,text,cls)=>{const n=document.createElement(name);if(text!=null)n.textContent=String(text);if(cls)n.className=cls;return n;};
 const info=(dl,key,value)=>{dl.append(el('dt',key),el('dd',value==null?'—':value));};
 function draw(items){
  const holder=$('v2-admin-list');holder.replaceChildren();
  const data=Array.isArray(items)?items:[];
  $('v2-admin-count').textContent=data.length+' rekod QA Native 2027';
  if(!data.length){holder.append(el('p','Tiada rekod QA Native 2027.'));return;}
  for(const item of data){
   const card=el('article',null,'v2-application');card.append(el('h3',item.studentName||'Murid QA'));
   card.append(el('span',item.status||'—','v2-status'));
   const dl=el('dl');
   info(dl,'ID',item.id);info(dl,'Penjaga',item.guardianName);info(dl,'Kelas',(item.classYear||'—')+' · '+(item.mode||'—'));
   info(dl,'Pilihan',item.paymentChoice==='FULL'?'RM100 bersama':'RM50 dahulu');
   info(dl,'Diterima (rekod)', 'RM'+Number(item.actualVerified||0).toFixed(2));
   info(dl,'Bulan pertama', item.firstMonthStatus||'—');info(dl,'No. resit',item.receiptNumber||'Belum dijana');
   card.append(dl);
   if(item.slipUrl){const link=el('a','Buka slip pembayaran (semak dahulu)');link.href=item.slipUrl;link.target='_blank';link.rel='noopener noreferrer';card.append(link);}
   if(item.status==='PENDING 2027'){
    const controls=el('div',null,'v2-controls');
    const amount=el('select');amount.setAttribute('aria-label','Amaun disahkan');
    const expected=item.paymentChoice==='FULL'?100:50;
    [50,100].forEach(n=>{const opt=el('option','RM'+n);opt.value=String(n);opt.selected=n===expected;amount.append(opt);});
    const approve=el('button','Sahkan Bayaran QA','v2-action');approve.type='button';
    approve.addEventListener('click',()=>decide(item,'APPROVE',Number(amount.value),''));
    const reject=el('button','Tolak','v2-action v2-reject');reject.type='button';
    reject.addEventListener('click',()=>{
      const reason=window.prompt('Sebab penolakan QA (min 4 aksara):');
      if(reason!==null && reason.trim().length>=4)void decide(item,'REJECT',0,reason.trim());
    });
    controls.append(amount,approve,reject);card.append(controls);
    card.append(el('p','Semakan Admin diperlukan. Akaun pilot hanya boleh mengubah rekod QA-.','v2-muted'));
   }
   holder.append(card);
  }
 }
 async function refresh(){
  if(state.busy||!state.token)return;busy(true);action('Memuatkan rekod QA Native...');
  const r=await rpc('listNativeAdminV2',[state.token]);busy(false);
  if(!r.success){action(r.message||'Tidak dapat memuatkan senarai.');return;}
  draw(r.applications);action('Senarai QA dikemas kini.');
 }
 async function decide(item,decision,amount,reason){
  if(state.busy||!state.token)return;
  if(!/^QA-/.test(item.id||''))return action('Hanya rekod QA dibenarkan.');
  if(decision==='APPROVE' && !window.confirm('Sahkan BAYARAN SIMULASI RM'+amount+' bagi '+item.studentName+'? Rekod QA rasmi akan dikemas kini dan mungkin diproses AutoCrat.'))return;
  busy(true);action('Menyimpan keputusan...');
  const r=await rpc('decideNativeAdminV2',[state.token,item.id,decision,amount,reason,item.recordVersion]);
  busy(false);action(r.message||'Keputusan belum disimpan.');
  if(r.success)void refresh();
 }
 $('v2-admin-login').addEventListener('submit',async e=>{
  e.preventDefault();if(state.busy||!canUse())return;
  const email=$('v2-admin-email').value.trim().toLowerCase();
  const pass=$('v2-admin-password').value;
  if(!$('v2-admin-login').reportValidity())return;
  busy(true);message('Mengesahkan pentadbir...');
  const r=await rpc('loginNativeAdminV2',[email,pass]);
  $('v2-admin-password').value='';busy(false);
  if(!r.success || !/^[0-9a-f]{64}$/.test(String(r.sessionToken||''))){message(r.message||'Tidak dibenarkan.');return;}
  state.token=r.sessionToken;$('v2-admin-login-card').hidden=true;$('v2-admin-dashboard').hidden=false;
  message('Selamat datang, '+(r.name||'Admin'));void refresh();
 });
 $('v2-admin-refresh').addEventListener('click',refresh);
 $('v2-admin-logout').addEventListener('click',()=>{
  const t=state.token;state.token=null;
  $('v2-admin-login').reset();$('v2-admin-list').replaceChildren();
  $('v2-admin-login-card').hidden=false;$('v2-admin-dashboard').hidden=true;
  message('Sesi Admin ditutup.');if(t)void rpc('logoutNativeAdminV2',[t]);
 });
 window.addEventListener('pagehide',()=>{state.token=null;});
 $('v2-admin-signin').disabled=!canUse();
})();
