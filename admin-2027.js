/* UPKK SL — Native Admin 2027, shared login surface. CLOSED by default.
 * No duplicate login tab, no Legacy session writes, no plaintext password.
 */
(function(){
 'use strict';
 const cfg=window.UPKK_ADMIN_2027_CONFIG||{};
 const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
 if(!enabled)return;
 let ticket='',token='',email='',busy=false,items=[],filter='ALL',query='';
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
   $('native-admin-switch').style.display=which==='parent'?'':'none';
   $('native-admin-parent').hidden=which==='parent';
   $('native-admin-panel').hidden=which==='parent';
   $('native-admin-legacy').hidden=which!=='parent';
   // Keep Parent 2027 choice hidden while Admin OTP/dashboard is active.
   const parentToggle=$('native-parent-toggle');
   if(parentToggle)parentToggle.style.display=which==='parent'?'':'none';
   const wrap=document.querySelector('#page-login .login-wrap');
   const head=document.querySelector('#page-login .login-head');
   const foot=document.querySelector('#page-login .login-foot');
   if(wrap)wrap.style.maxWidth=which==='dashboard'?'1050px':'';
   if(head)head.style.display=which==='dashboard'?'none':'';
   if(foot)foot.style.display=which==='dashboard'?'none':'';
   if(which==='parent'){$('native-admin-otp-code').value='';ticket='';token='';email='';}
 }
 function fillList(){
   const holder=$('native-admin-list');holder.replaceChildren();
   const pending=items.filter(x=>x.status==='PENDING 2027');
   const approved=items.filter(x=>x.status==='APPROVED 2027');
   const rejected=items.filter(x=>x.status==='REJECTED 2027');
   const money=approved.reduce((sum,x)=>sum+(Number(x.bayaran)||0),0);
   $('native-admin-total').textContent=String(items.length);
   $('native-admin-pending').textContent=String(pending.length);
   $('native-admin-approved').textContent=String(approved.length);
   $('native-admin-paid').textContent='RM'+money.toFixed(2);
   const matches=items.filter(item=>(filter==='ALL'||item.status===filter)&&
     (!query||[item.murid,item.penjaga,item.applicationId].some(v=>String(v||'').toLocaleLowerCase('ms-MY').includes(query))));
   $('native-admin-results').textContent=matches.length+' rekod dipaparkan · '+rejected.length+' ditolak';
   if(!matches.length){holder.append(el('p','Tiada permohonan untuk carian/penapis ini.'));return;}
   matches.forEach(item=>{
     const card=el('section',undefined,'clay');
     card.style.cssText='margin:12px 0;padding:16px;border:1px solid #d5e5d4';
     const title=el('strong',(item.murid||'Murid')+' — '+(item.status||''));
     const pendingAmount=item.pilihanBayaran==='FULL'?100:item.pilihanBayaran==='REGISTRATION_ONLY'?50:null;
     const shownAmount=item.status==='PENDING 2027'?pendingAmount:Number(item.bayaran);
     const amountText=Number.isFinite(shownAmount)?'RM'+shownAmount.toFixed(2):'Amaun tidak tersedia';
     const paymentLabel=item.pilihanBayaran==='FULL'?'Bayaran penuh':item.pilihanBayaran==='REGISTRATION_ONLY'?'Pendaftaran sahaja':(item.pilihanBayaran||'Pilihan tidak diketahui');
     const meta=el('p',(item.penjaga||'')+' · '+paymentLabel+' · '+(item.status==='PENDING 2027'?'Untuk disahkan: ':'Disahkan: ')+amountText);
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
 function buildNativeDashboard(container){
   container.append(el('h3','Dashboard Pentadbir · Native 2027'));
   const summary=el('div');summary.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:16px 0';
   [['Jumlah Permohonan','native-admin-total'],['Menunggu Semakan','native-admin-pending'],
    ['Diluluskan','native-admin-approved'],['Bayaran Disahkan','native-admin-paid']].forEach(pair=>{
      const box=el('div',undefined,'clay');box.style.cssText='padding:14px;border:1px solid #d5e5d4';
      const value=el('div','—');value.id=pair[1];value.style.cssText='font-size:25px;font-weight:750;color:#07553e';
      const label=el('div',pair[0]);label.style.cssText='font-size:12px;margin-top:3px';
      box.append(value,label);summary.append(box);
    });
   container.append(summary);
   const controls=el('div');controls.style.cssText='display:grid;gap:10px;margin:14px 0';
   const search=el('input',undefined,'form-inp');search.type='search';search.placeholder='Cari murid / penjaga / ID permohonan';
   search.setAttribute('aria-label','Cari permohonan Native 2027');
   search.addEventListener('input',()=>{query=search.value.trim().toLocaleLowerCase('ms-MY');fillList();});
   const select=el('select',undefined,'form-inp');select.setAttribute('aria-label','Tapis status permohonan');
   [['ALL','Semua status'],['PENDING 2027','Menunggu Semakan'],
     ['APPROVED 2027','Diluluskan'],['REJECTED 2027','Ditolak']].forEach(([value,label])=>{
       const option=el('option',label);option.value=value;select.append(option);
     });
   select.addEventListener('change',()=>{filter=select.value;fillList();});
   controls.append(search,select);container.append(controls);
   container.append(makeButton('Muat Semula Permohonan','native-admin-refresh',refresh));
   container.append(makeButton('Log Keluar Admin','native-admin-logout',logout));
   const result=el('p');result.id='native-admin-results';result.style.cssText='margin:14px 0 8px;font-size:12px';container.append(result);
   const listing=el('div');listing.id='native-admin-list';container.append(listing);
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
   otp.append(el('h3','Log Masuk Admin'));
   otp.append(makeField('E-mel Admin','email','native-admin-email'));
   otp.append(makeButton('Hantar OTP','native-admin-request',requestOtp));
   otp.append(makeField('Kod OTP 6 Digit','text','native-admin-otp-code'));
   otp.append(makeButton('Sahkan OTP','native-admin-verify',verifyOtp));
   otp.append(makeButton('Kembali ke Log Masuk Ibu Bapa','native-admin-parent',logout));
   const dashboard=el('div');dashboard.id='native-admin-dashboard';dashboard.hidden=true;
   buildNativeDashboard(dashboard);
   const message=el('p');message.id='native-admin-message';message.setAttribute('role','status');message.style.margin='12px 0';
   panel.append(otp,dashboard,message);pane.append(panel);switchView('parent');
 });
})();
