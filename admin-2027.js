/* UPKK SL — Native Admin 2027, shared login surface. CLOSED by default.
 * No duplicate login tab, no Legacy session writes, no plaintext password.
 */
(function(){
 'use strict';
 const cfg=window.UPKK_ADMIN_2027_CONFIG||{};
 const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
 if(!enabled)return;
 let ticket='',token='',email='',busy=false,items=[];
 const $=id=>document.getElementById(id);
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const status=s=>{const n=$('native-admin-message');if(n)n.textContent=s||'';};
 async function rpc(fn,args){
   const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),30000);
   try{
     const response=await fetch(cfg.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({action:'pagesAdminNativeV2Production',rpc:fn,args}),mode:'cors',credentials:'omit',cache:'no-store',redirect:'follow',referrerPolicy:'no-referrer',signal:controller.signal});
     if(!response.ok)throw new Error('Respons pelayan tidak tersedia');
     return await response.json();
   }catch(_){return {success:false,message:'Sambungan pentadbir tidak tersedia.'};}
   finally{clearTimeout(timeout);}
 }
 function setBusy(value){busy=value;['native-admin-request','native-admin-verify','native-admin-refresh'].forEach(id=>{const n=$(id);if(n)n.disabled=busy;});}
 function makeButton(label,id,handler){const b=el('button',label,'btn btn-green');b.type='button';b.id=id;b.onclick=handler;return b;}
 function makeField(label,type,id){const wrap=el('div',undefined,'fg'),caption=el('label',label,'form-lbl'),input=el('input',undefined,'form-inp');caption.htmlFor=id;input.id=id;input.type=type;wrap.append(caption,input);return wrap;}
 function switchView(which){
   $('native-admin-otp').hidden=which!=='otp';
   $('native-admin-dashboard').hidden=which!=='dashboard';
   $('native-admin-switch').hidden=which!=='parent';
   $('native-admin-parent').hidden=which==='parent';
   $('native-admin-panel').hidden=which==='parent';
   $('native-admin-legacy').hidden=which!=='parent';
   if(which==='parent'){$('native-admin-otp-code').value='';ticket='';token='';email='';}
 }
 function fillList(){
   const holder=$('native-admin-list');holder.replaceChildren();
   if(!items.length){holder.append(el('p','Tiada permohonan Native 2027.'));return;}
   items.forEach(item=>{
     const card=el('section',undefined,'clay');
     card.style.cssText='margin:12px 0;padding:16px;border:1px solid #d5e5d4';
     const title=el('strong',(item.murid||'Murid')+' — '+(item.status||''));
     const meta=el('p',(item.penjaga||'')+' · '+(item.pilihanBayaran||'')+' · '+(item.bayaran||''));
     meta.style.cssText='font-size:12px;overflow-wrap:anywhere;margin-top:8px';
     card.append(title,meta);
     if(item.status==='PENDING 2027'){
       const group=el('div');group.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:12px';
       const yes=el('button','Sahkan Bayaran','btn btn-green');yes.type='button';
       const no=el('button','Tolak','btn');no.type='button';
       yes.onclick=()=>decide(item,'APPROVE');no.onclick=()=>decide(item,'REJECT');
       group.append(yes,no);card.append(group);
     }
     holder.append(card);
   });
 }
 async function refresh(){
   if(busy||!token)return;setBusy(true);status('Memuatkan permohonan...');
   const r=await rpc('listAdminV2',[token]);setBusy(false);
   if(!r.success){status(r.message||'Gagal memuatkan data.');return;}
   items=Array.isArray(r.items)?r.items:[];fillList();status('Senarai Native 2027 dikemas kini.');
 }
 async function decide(item,decision){
   if(busy||!token)return;
   if(!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(item.applicationId||'')){status('Application ID tidak sah.');return;}
   const amount=decision==='APPROVE'?(item.pilihanBayaran==='FULL'?100:50):0;
   const reason=decision==='REJECT'?window.prompt('Masukkan sebab penolakan (5–250 aksara):',''):'';
   if(decision==='REJECT'&&(!reason||reason.trim().length<5))return;
   if(!window.confirm(decision==='APPROVE'?'Sahkan bukti bayaran RM'+amount+' bagi murid '+(item.murid||'')+'?':'Tolak permohonan murid '+(item.murid||'')+'?'))return;
   setBusy(true);status('Menyimpan keputusan...');
   const r=await rpc('decideAdminV2Application',[token,item.applicationId,decision,amount,reason,item.version]);
   setBusy(false);status(r.message||'Keputusan belum disahkan.');if(r.success)refresh();
 }
 async function requestOtp(){
   if(busy)return;const value=$('native-admin-email').value.trim().toLowerCase();
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){status('Masukkan alamat e-mel Admin yang sah.');return;}
   setBusy(true);const r=await rpc('requestAdminV2Otp',[value]);setBusy(false);
   if(!r.success){status(r.message);return;}
   email=value;ticket=r.ticket||'';status(r.message||'Semak e-mel Admin.');$('native-admin-verify').disabled=false;
 }
 async function verifyOtp(){
   if(busy||!ticket)return;const code=$('native-admin-otp-code').value.trim();
   if(!/^\d{6}$/.test(code)){status('Masukkan 6 digit OTP.');return;}
   setBusy(true);const r=await rpc('verifyAdminV2Otp',[email,ticket,code]);setBusy(false);
   if(!r.success){status(r.message||'OTP tidak sah.');return;}
   token=r.token||'';ticket='';$('native-admin-otp-code').value='';switchView('dashboard');status('Selamat datang, '+(r.name||'Admin')+'.');refresh();
 }
 async function logout(){const previous=token;switchView('parent');if(previous)await rpc('logoutAdminV2',[previous]);}
 document.addEventListener('DOMContentLoaded',()=>{
   const pane=$('lcp-login');if(!pane)return;
   const legacy=el('div');legacy.id='native-admin-legacy';
   while(pane.firstChild)legacy.append(pane.firstChild);
   pane.append(legacy);
   const toggler=makeButton('Log Masuk Admin','native-admin-switch',()=>switchView('otp'));
   toggler.style.cssText='margin-top:12px;background:#f4ecd2;color:#07553e;width:100%';
   pane.append(toggler);
   const panel=el('div');panel.id='native-admin-panel';panel.hidden=true;
   const otp=el('div');otp.id='native-admin-otp';
   otp.append(el('h3','Log Masuk Pentadbir 2027'));
   otp.append(makeField('E-mel Admin','email','native-admin-email'));
   otp.append(makeButton('Hantar OTP','native-admin-request',requestOtp));
   otp.append(makeField('Kod OTP 6 Digit','text','native-admin-otp-code'));
   otp.append(makeButton('Sahkan OTP','native-admin-verify',verifyOtp));
   otp.append(makeButton('Kembali ke Log Masuk Ibu Bapa','native-admin-parent',logout));
   const dashboard=el('div');dashboard.id='native-admin-dashboard';dashboard.hidden=true;
   dashboard.append(el('h3','Pentadbir Native 2027'));
   dashboard.append(makeButton('Muat Semula Permohonan','native-admin-refresh',refresh));
   dashboard.append(makeButton('Log Keluar Admin 2027','native-admin-logout',logout));
   const listing=el('div');listing.id='native-admin-list';dashboard.append(listing);
   const message=el('p');message.id='native-admin-message';message.setAttribute('role','status');message.style.margin='12px 0';
   panel.append(otp,dashboard,message);pane.append(panel);switchView('parent');
 });
})();
