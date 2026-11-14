/* UPKK SL — Native Admin 2027, shared login surface. CLOSED by default.
 * No duplicate login tab, no Legacy session writes, no plaintext password.
 */
(function(){
 'use strict';
 const cfg=window.UPKK_ADMIN_2027_CONFIG||{};
 const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
 if(!enabled)return;
 let ticket='',token='',email='',busy=false,items=[],filter='ALL',query='';
 let monthlyEntries=[],monthlyReady=false,legacyLoaded=false,legacyData=null,activeYear='2026';
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
   $('native-admin-dashboard').hidden=which!=='dashboard'||activeYear!=='2027';
   $('native-admin-switch').hidden=which!=='parent';
   $('native-admin-switch').style.display=which==='parent'?'':'none';
   $('native-admin-parent').hidden=which==='parent';
   $('native-admin-panel').hidden=which==='parent';
   $('native-admin-legacy').hidden=which!=='parent';
   const parentToggle=$('native-parent-toggle');
   if(parentToggle)parentToggle.style.display=which==='parent'?'':'none';
   const wrap=document.querySelector('#page-login .login-wrap');
   const head=document.querySelector('#page-login .login-head');
   const foot=document.querySelector('#page-login .login-foot');
   if(wrap)wrap.style.maxWidth='';
   if(head)head.style.display='';
   if(foot)foot.style.display='';
   if(which==='parent'){
     ticket='';token='';email='';items=[];legacyData=null;legacyLoaded=false;
     monthlyReady=false;monthlyEntries=[];activeYear='2026';
     $('native-admin-otp-code').value='';
     const adminPage=$('page-admin');
     if(adminPage)adminPage.classList.remove('native-otp-premium');
     const sel=$('native-admin-session-select');if(sel)sel.value='2026';
     const legacy=$('native-admin-legacy');
     if(legacy)legacy.hidden=false;
   }
 }
 function showSession(year){
   if(!token)return;
   activeYear=year==='2027'?'2027':'2026';
   const picker=$('native-admin-session-select');
   if(picker)picker.value=activeYear;
   const dashboard=$('native-admin-dashboard');
   if(dashboard)dashboard.hidden=activeYear!=='2027';
   const body=$('admin-tab-dashboard')?.querySelector('.adm-body');
   if(body){
     [...body.children].forEach(node=>{
       if(node.id==='native-admin-dashboard')return;
       node.hidden=activeYear==='2027';
       // Existing CSS may override hidden attribute; display is authoritative.
       node.style.display=(activeYear==='2027'||node.id==='adm-action-panel')?'none':'';
     });
   }
   const readonly=$('native-admin-legacy-readonly');
   if(readonly)readonly.hidden=activeYear!=='2026';
   if(typeof window.switchAdminTab==='function')window.switchAdminTab('dashboard');
   if(typeof window.showPage==='function')window.showPage('page-admin');
   if(activeYear==='2027')refresh();
   else if(legacyLoaded&&legacyData)renderLegacy2026(legacyData);
   else loadLegacy2026();
 }
 function renderLegacy2026(data){
   if(!token||activeYear!=='2026'||!data?.success)return;
   if(typeof _adminData!=='undefined')_adminData=data;
   if($('a-nama'))$('a-nama').textContent=String(S.user?.nama||'Admin');
   if(typeof renderAdminStats==='function')renderAdminStats(data);
   if(typeof renderAdminBulan==='function')renderAdminBulan(data.perBulan||[],data.jumlahMurid||0);
   if(typeof renderChart==='function')renderChart(data.perBulan||[],data.currentMonthNum);
   // Do not invoke Legacy getSenaraiByuran/getTiadaBayarDanKonsisten without an OTP-scoped backend.
   const list=$('adm-rekod-list');
   if(list){
     list.replaceChildren();
     for(const x of (Array.isArray(data.rekod)?data.rekod:[]).slice(0,250)){
       const p=el('p',String(x.namaMurid||'Murid')+' · '+String(x.bulanLabel||'')+' · '+String(x.status||''));
       p.style.cssText='font-size:12px;padding:8px;border-bottom:1px solid #d5e5d4';
       list.append(p);
     }
   }
 }
 async function loadLegacy2026(){
   if(!token)return;
   const t=token;status('Memuatkan data sesi 2026 melalui OTP...');
   const response=await rpc('getAdminLegacy2026ReadOnly',[t]);
   if(!token||token!==t)return;
   legacyLoaded=!!response.success;
   if(!response.success){showSession('2027');status('Data 2026 belum tersedia; memaparkan sesi 2027. '+String(response.message||''));return;}
   legacyData=response;showSession('2026');
   status('Dashboard Premium 2026 · sesi Admin OTP disahkan.');
 }
 window.UPKKAdminStartOtp=function(prefill){
   const field=$('native-admin-email');
   if(field&&prefill)field.value=String(prefill).trim().toLowerCase();
   switchView('otp');
   if(typeof window.showPage==='function')window.showPage('page-login');
 };
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

 // Existing OTP token is reused for monthly eBayar; no second Admin session.
 async function monthlyRpc(fn,args){
   const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),30000);
   try{
     const response=await fetch(cfg.endpoint,{method:'POST',mode:'cors',credentials:'omit',
       cache:'no-store',redirect:'follow',referrerPolicy:'no-referrer',
       headers:{'Content-Type':'text/plain;charset=UTF-8'},
       signal:controller.signal,body:JSON.stringify({action:'pagesNativeEbayar',rpc:fn,args})});
     if(!response.ok)throw new Error('Sambungan Native eBayar tidak tersedia.');
     return await response.json();
   }catch(_){return {success:false,message:'Sambungan Native eBayar tidak tersedia.'};}
   finally{clearTimeout(timeout);}
 }
 function renderMonthlyPayments(){
   const holder=$('native-admin-monthly-list');
   if(!holder)return;
   holder.replaceChildren();
   if(!monthlyReady){
     holder.append(el('p','Bayaran bulanan belum diaktifkan di backend. Pendaftaran tetap berfungsi seperti biasa.'));
     return;
   }
   const outstanding=monthlyEntries.filter(x=>String(x.status||'').toUpperCase()==='PENDING');
   $('native-admin-monthly-count').textContent=String(outstanding.length);
   if(!outstanding.length){holder.append(el('p','Tiada bukti bayaran bulanan menunggu pengesahan.'));return;}
   outstanding.forEach(item=>{
     const card=el('article',undefined,'clay');card.style.cssText='margin:10px 0;padding:14px;border:1px solid #d5e5d4;border-radius:12px';
     const month=String(item.month||'')+' '+String(item.year||'');
     const amount=Number(item.amount);
     card.append(el('strong',String(item.childName||'Murid')+' · '+month));
     card.append(el('p','Jumlah dimohon: '+(Number.isFinite(amount)?'RM'+amount.toFixed(2):'Tidak tersedia')+' · Dihantar: '+String(item.submittedAt||'—')));
     const controls=el('div');controls.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin:10px 0';
     const url=String(item.slipUrl||'');
     if(/^https:\/\/drive\.google\.com\//i.test(url)){
       const proof=el('a','Buka bukti bayaran');proof.href=url;proof.target='_blank';proof.rel='noopener noreferrer';
       proof.className='btn';controls.append(proof);
     }
     const approve=el('button','LULUS · RM'+(Number.isFinite(amount)?amount.toFixed(2):'—'),'btn btn-green');
     approve.type='button';approve.disabled=!Number.isFinite(amount)||amount<=0||!url.startsWith('https://drive.google.com/');
     approve.addEventListener('click',()=>decideMonthly(item,'APPROVE'));
     const reject=el('button','TOLAK','btn');reject.type='button';
     reject.addEventListener('click',()=>decideMonthly(item,'REJECT'));
     controls.append(approve,reject);card.append(controls);holder.append(card);
   });
 }
 async function refreshMonthly(){
   if(!token)return;
   const r=await monthlyRpc('adminList',[token]);
   monthlyReady=!!r.success;
   monthlyEntries=r.success&&Array.isArray(r.entries)?r.entries:[];
   renderMonthlyPayments();
   const node=$('native-admin-monthly-message');
   if(node)node.textContent=monthlyReady?'Senarai bayaran bulanan dikemas kini.':(r.message||'Native eBayar belum tersedia.');
 }
 async function decideMonthly(item,decision){
   if(busy||!token||!monthlyReady)return;
   const id=String(item.requestId||'').trim();
   if(!/^[0-9a-f-]{36}$/i.test(id)){status('ID transaksi bulanan tidak sah.');return;}
   const amount=Number(item.amount);
   if(decision==='APPROVE'&&(!Number.isFinite(amount)||amount<=0)){status('Amaun tidak sah.');return;}
   const reason=decision==='REJECT'?window.prompt('Sebab penolakan (5–250 aksara):',''):'';
   if(decision==='REJECT'&&(!reason||reason.trim().length<5||reason.trim().length>250))return;
   const phrase=decision==='APPROVE'?'Luluskan bayaran RM'+amount.toFixed(2):'Tolak bukti bayaran';
   if(!window.confirm(phrase+' bagi '+String(item.childName||'Murid')+' ('+item.month+' '+item.year+')?'))return;
   setBusy(true);status('Menyimpan keputusan bayaran bulanan...');
   const result=await monthlyRpc('adminDecide',[token,id,decision,decision==='APPROVE'?amount:0,reason]);
   setBusy(false);
   status(result.message||(result.success?'Keputusan bayaran bulanan direkodkan.':'Keputusan belum berjaya.'));
   if(result.success)await refreshMonthly();
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

   const monthly=el('section');monthly.id='native-admin-monthly';monthly.style.cssText='margin:24px 0;padding:18px;border:1px solid #d5e5d4;border-radius:14px';
   monthly.append(el('h3','Bayaran Bulanan · Native eBayar 2027'));
   const desc=el('p','Bukti yang menunggu pengesahan Admin. Kelulusan menetapkan SELESAI dan APPROVED_BY untuk proses resit AutoCrat.');
   desc.style.cssText='font-size:12px;line-height:1.5';monthly.append(desc);
   const count=el('p','—');count.id='native-admin-monthly-count';count.style.cssText='font-size:20px;font-weight:700;color:#07553e';
   monthly.append(count);
   monthly.append(makeButton('Muat Semula Bayaran Bulanan','native-admin-monthly-refresh',refreshMonthly));
   const message=el('p','');message.id='native-admin-monthly-message';message.setAttribute('role','status');
   message.style.cssText='font-size:12px;margin:10px 0';monthly.append(message);
   const list=el('div');list.id='native-admin-monthly-list';monthly.append(list);
   container.append(monthly);

 }
 async function refresh(){
   if(busy||!token)return;setBusy(true);status('Memuatkan permohonan...');
   const r=await rpc('listAdminV2',[token]);setBusy(false);
   if(!r.success){status(r.message||'Gagal memuatkan data.');return;}
   items=Array.isArray(r.items)?r.items:[];fillList();status('Senarai Native 2027 dikemas kini.');
   await refreshMonthly();
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
   if(!r.token){status('Token Admin tidak diterima.');return;}
   token=r.token;ticket='';$('native-admin-otp-code').value='';
   // OTP is the only Admin session. Never write Admin credentials/session to localStorage.
   try{localStorage.removeItem('upkk_session');}catch(_){}
   if(typeof S!=='undefined')S.user={success:true,role:'admin',nama:r.name||'Admin',email};
   $('page-admin')?.classList.add('native-otp-premium');
   switchView('dashboard');
   await loadLegacy2026();
 }
 async function logout(){
   const previous=token;
   switchView('parent');
   if(typeof window.doLogout==='function')window.doLogout();
   if(previous)await rpc('logoutAdminV2',[previous]);
 }
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
   // The 2027 records and monthly payments are inserted into the ORIGINAL premium dashboard body.
   const adminBody=$('admin-tab-dashboard')?.querySelector('.adm-body');
   if(!adminBody)throw new Error('Original Admin premium dashboard not found');
   adminBody.append(dashboard);
   const readonly=el('p','Sesi 2026: ringkasan melalui token OTP (read-only). Fungsi Legacy yang belum mempunyai kawalan token tidak dibuka.');
   readonly.id='native-admin-legacy-readonly';readonly.style.cssText='font-size:12px;margin:12px 0;color:#58705e';
   adminBody.prepend(readonly);
   const pickerBar=$('page-admin')?.querySelector('.adm-tab-bar');
   if(!pickerBar)throw new Error('Original Admin tabs not found');
   const picker=el('select');picker.id='native-admin-session-select';
   picker.className='adm-sel';picker.setAttribute('aria-label','Pilih sesi Admin');
   for(const year of ['2026','2027']){const option=el('option','Sesi '+year);option.value=year;picker.append(option);}
   picker.value='2026';picker.addEventListener('change',()=>showSession(picker.value));
   // Keep the selector outside the legacy tab flex column (which causes a giant white block).
   const sessionDock=el('div');sessionDock.id='native-admin-session-dock';
   sessionDock.style.cssText='display:flex;align-items:center;width:100%;max-width:210px;padding:0;box-sizing:border-box;';
   picker.style.cssText='display:block;flex:none!important;width:100%;height:44px;min-height:44px;max-height:44px;padding:8px 12px;box-sizing:border-box;background:#fffaf0;color:#174737;border:1px solid #dfbd77;border-radius:12px;font:600 12px Poppins,sans-serif;';
   sessionDock.append(picker);
   $('page-admin').append(sessionDock);
   // Native OTP backend does not authorise the old Legacy-specific tools.
   for(const name of ['murid','senarai','sync']){
     const tab=$('admin-tabBtn-'+name);
     if(tab){tab.hidden=true;tab.style.display='none';}
   }
   // Keep legacy action shortcuts locked: they still call unauthorised Legacy APIs.
   const actionPanel=$('adm-action-panel');
   if(actionPanel){actionPanel.hidden=true;actionPanel.style.display='none';}
   const oldRefresh=$('btn-adm-refresh');
   if(oldRefresh)oldRefresh.addEventListener('click',event=>{
     if(!token)return;
     event.preventDefault();event.stopImmediatePropagation();loadLegacy2026();
   },true);
   const oldLogout=$('page-admin')?.querySelector('.adm-hdr .btn-out');
   if(oldLogout)oldLogout.addEventListener('click',event=>{
     if(!token)return;
     event.preventDefault();event.stopImmediatePropagation();logout();
   },true);
   const chartButtons=$('adm-bulan-grid');
   if(chartButtons)chartButtons.addEventListener('click',event=>{
     if(!token)return;
     if(event.target.closest('button')){event.preventDefault();event.stopPropagation();}
   },true);
   const actions=$('adm-action-panel');
   if(actions){actions.hidden=true;actions.style.display='none';}
   const message=el('p');message.id='native-admin-message';message.setAttribute('role','status');message.style.margin='12px 0';
   panel.append(otp,message);pane.append(panel);switchView('parent');
 });
})();
