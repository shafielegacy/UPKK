/* UPKK SL — Native Admin 2027, shared login surface. CLOSED by default.
 * No duplicate login tab, no Legacy session writes, no plaintext password.
 */
(function(){
 'use strict';
 const cfg=window.UPKK_ADMIN_2027_CONFIG||{};
 const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
 if(!enabled)return;
 let ticket='',token='',email='',busy=false,items=[],filter='ALL',query='',stepup=false,legacyLoaded=false;
 const $=id=>document.getElementById(id);
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const status=s=>{['native-admin-message','native-admin-shell-message'].forEach(id=>{const n=$(id);if(n)n.textContent=s||'';});};
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
 function restoreOtpPanel(){
   const panel=$('native-admin-panel'),pane=$('lcp-login'),page=$('page-admin');
   if(panel&&pane&&panel.parentNode!==pane)pane.append(panel);
   if(page)page.classList.remove('native-admin-stepup-open');
   stepup=false;
 }
 function cancelStepup(){
   if(!stepup)return logout();
   restoreOtpPanel();
   switchView('parent');
   if(typeof window.showPage==='function')window.showPage('page-admin');
 }
 function switchView(which){
   $('native-admin-otp').hidden=which!=='otp';
   $('native-admin-dashboard').hidden=which!=='dashboard';
   const adminPage=$('page-admin');
   // The original Admin 2026 shell is always the only dashboard frame.
   if(adminPage)adminPage.classList.remove('native-2027-active');
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
   if(which==='parent'){$('native-admin-otp-code').value='';ticket='';token='';email='';items=[];
     const list=$('native-admin-list');if(list)list.replaceChildren();}
   if(which==='dashboard'&&typeof window.showPage==='function')window.showPage('page-admin');
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
     const meta=el('p',(item.penjaga||'')+' · '+(item.pilihanBayaran||'')+' · RM'+(Number(item.bayaran)||0).toFixed(2));
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
   if(busy||!token)return;const requestedToken=token;setBusy(true);status('Memuatkan permohonan...');
   const r=await rpc('listAdminV2',[requestedToken]);setBusy(false);
   if(!token||requestedToken!==token)return;
   if(!r.success){const previous=token;switchView('parent');if(typeof window.showPage==='function')window.showPage('page-login');status(r.message||'Sesi Admin tamat. Sila log masuk semula.');if(previous)rpc('logoutAdminV2',[previous]);return;}
   items=Array.isArray(r.items)?r.items:[];fillList();status('Senarai Native 2027 dikemas kini.');
 }
 async function decide(item,decision){
   if(busy||!token)return;
   if(!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(item.applicationId||'')){status('Application ID tidak sah.');return;}
   const amount=decision==='APPROVE'?(item.pilihanBayaran==='FULL'?100:50):0;
   const reason=decision==='REJECT'?window.prompt('Masukkan sebab penolakan (5–250 aksara):',''):'';
   if(decision==='REJECT'&&(!reason||reason.trim().length<5))return;
   if(!window.confirm(decision==='APPROVE'?'Sahkan bukti bayaran RM'+amount+' bagi murid '+(item.murid||'')+'?':'Tolak permohonan murid '+(item.murid||'')+'?'))return;
   const requestedToken=token;
   setBusy(true);status('Menyimpan keputusan...');
   const r=await rpc('decideAdminV2Application',[requestedToken,item.applicationId,decision,amount,reason,item.version]);
   setBusy(false);
   if(!token||requestedToken!==token)return;
   status(r.message||'Keputusan belum disahkan.');if(r.success)refresh();
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
   if(!r.token){status('Token pentadbir tidak diterima.');return;}
   // OTP is the ONLY Admin credential; Legacy credentials are never requested.
   restoreOtpPanel();
   if(typeof window.doLogout==='function')window.doLogout();
   token=r.token;ticket='';$('native-admin-otp-code').value='';
   if(typeof S!=='undefined')S.user={success:true,role:'admin',nama:r.name||'Admin',email:email};
   legacyLoaded=false;
   switchView('dashboard');
   status('Pengesahan Admin berjaya.');
   await loadLegacyFromNativeOtp();
   if(token)refresh();
 }
 async function logout(){
   const previous=token;
   if($('page-admin'))$('page-admin').classList.remove('native-admin-2027-view');
   restoreOtpPanel();switchView('parent');
   if(typeof window.doLogout==='function')window.doLogout();
   if(previous)await rpc('logoutAdminV2',[previous]);
 }
 function showSession(view){
   const page=$('page-admin'),native=$('native-admin-dashboard');
   if(!token||!page||!native)return;
   const is27=view==='2027';
   page.classList.toggle('native-admin-2027-view',is27);
   native.hidden=!is27;
   const picker=$('native-admin-session-select-2026');
   if(picker)picker.value=is27?'2027':'2026';
   if(typeof window.switchAdminTab==='function')window.switchAdminTab('dashboard');
 }
 async function loadLegacyFromNativeOtp(){
   const requestedToken=token;
   status('Memuatkan data Admin 2026...');
   const result=await rpc('getAdminLegacy2026ReadOnly',[requestedToken]);
   if(!token||token!==requestedToken)return;
   if(!result.success){
     legacyLoaded=false;
     status(result.message||'Data 2026 belum tersedia. Native V4 bridge belum dideploy.');
     showSession('2027');return;
   }
   legacyLoaded=true;
   if(typeof _adminData!=='undefined')_adminData=result;
   if($('a-nama'))$('a-nama').textContent=typeof S!=='undefined'&&S.user?S.user.nama:'Admin';
   if(typeof renderAdminStats==='function')renderAdminStats(result);
   if(typeof renderAdminBulan==='function')renderAdminBulan(result.perBulan||[],result.jumlahMurid||0);
   if(typeof renderAdminActionPanel==='function')renderAdminActionPanel(result,typeof _adminIssueData!=='undefined'?_adminIssueData:{tiadaBayar:[],sebahagian:[]});
   if(typeof filterRekod==='function')filterRekod();
   if(typeof renderChart==='function')renderChart(result.perBulan||[],result.currentMonthNum);
   showSession('2026');status('Dashboard 2026 disahkan oleh token OTP Admin.');
 }
 // 2026 Legacy Admin -> 2027 Native: explicit step-up, never token reuse.
 function enterFromLegacyAdmin(){
   // S is the existing Legacy login state; Native permission still requires OTP.
   if(typeof S==='undefined'||!S.user||S.user.role!=='admin')return;
   const legacyEmail=String(S.user.email||'').trim().toLowerCase();
   const emailField=$('native-admin-email');
   if(emailField&&legacyEmail)emailField.value=legacyEmail;
   switchView('otp');
   const panel=$('native-admin-panel'),page=$('page-admin');
   if(panel&&page){
     page.append(panel);
     page.classList.add('native-admin-stepup-open');
     stepup=true;
   }
   // Keep the authenticated 2026 dashboard in place behind an OTP dialog.
   status('Sesi 2027 memerlukan pengesahan OTP Admin.');
   const field=$('native-admin-email');if(field)field.focus();
 }
 document.addEventListener('DOMContentLoaded',()=>{
   const pane=$('lcp-login');if(!pane)return;
   const legacy=el('div');legacy.id='native-admin-legacy';
   while(pane.firstChild)legacy.append(pane.firstChild);
   pane.append(legacy);
   const toggler=makeButton('Log Masuk Admin (OTP)','native-admin-switch',()=>switchView('otp'));
   toggler.style.cssText='margin-top:12px;background:#f4ecd2;color:#07553e;width:100%';
   pane.append(toggler);
   // Parent retains its original form; this is the single Admin OTP entry.
   toggler.hidden=false;toggler.style.display='';
   const legacyAdminTabs=$('page-admin')&&$('page-admin').querySelector('.adm-tab-bar');
   if(legacyAdminTabs){
     const sessionSelect=el('select');
     sessionSelect.id='native-admin-session-select-2026';
     sessionSelect.className='adm-sel native-session-picker';
     sessionSelect.setAttribute('aria-label','Pilih sesi Admin');
     [['2026','Sesi 2026'],['2027','Sesi 2027']].forEach(([value,label])=>{
       const option=el('option',label);option.value=value;sessionSelect.append(option);
     });
     sessionSelect.value='2026';
     sessionSelect.addEventListener('change',()=>{
       if(token)showSession(sessionSelect.value);
       else {sessionSelect.value='2026';status('Sila login Admin menggunakan OTP dahulu.');}
     });
     legacyAdminTabs.append(sessionSelect);
   }
   const panel=el('div');panel.id='native-admin-panel';panel.hidden=true;
   const otp=el('div');otp.id='native-admin-otp';
   otp.append(el('h3','Log Masuk Admin'));
   otp.append(makeField('E-mel Admin','email','native-admin-email'));
   otp.append(makeButton('Hantar OTP','native-admin-request',requestOtp));
   otp.append(makeField('Kod OTP 6 Digit','text','native-admin-otp-code'));
   otp.append(makeButton('Sahkan OTP','native-admin-verify',verifyOtp));
   otp.append(makeButton('Kembali ke Log Masuk Ibu Bapa','native-admin-parent',logout));
   const dashboard=el('div');dashboard.id='native-admin-dashboard';dashboard.hidden=true;
   const shell=el('section');shell.id='native-admin-shell';shell.className='native-admin-shell';
   const sidebar=el('aside');sidebar.className='native-admin-sidebar';
   const brand=el('div');brand.className='native-admin-brand';
   const logo=el('img');logo.src='./assets/branding/portal-logo.png';logo.alt='Logo Kafa & UPKK Syafie Legacy';
   brand.append(logo,el('strong','Kafa & UPKK Syafie Legacy'));
   const role=el('p','PANEL ADMIN · SESI 2027');role.className='native-admin-role';
   const nav=el('nav');nav.setAttribute('aria-label','Navigasi Admin Native 2027');
   const navDashboard=makeButton('Dashboard 2027','native-admin-nav-dashboard',()=>dashboard.scrollIntoView({behavior:'smooth'}));
   const navRequests=makeButton('Permohonan','native-admin-nav-requests',()=>$('native-admin-list').scrollIntoView({behavior:'smooth'}));
   nav.append(navDashboard,navRequests);
   const sidebarLogout=makeButton('Log Keluar Admin','native-admin-sidebar-logout',logout);
   sidebar.append(brand,role,nav,sidebarLogout);
   const main=el('div');main.className='native-admin-main';
   const top=el('header');top.className='native-admin-top';
   top.append(el('div','Dashboard Pentadbir · 2027'));
   const session=el('div');session.className='native-admin-session';
   const selector=el('select');selector.id='native-admin-session-select-2027';
   selector.setAttribute('aria-label','Pilih sesi Admin');
   [['2027','Sesi 2027'],['2026','Sesi 2026']].forEach(([value,label])=>{
     const option=el('option',label);option.value=value;selector.append(option);
   });
   selector.value='2027';
   selector.addEventListener('change',()=>{
     if(selector.value==='2026'){
       // Native token is not a Legacy login: redirect to existing login surface for verification.
       logout();
       status('Untuk sesi 2026, sila sahkan login Legacy pada halaman yang sama.');
     }
     selector.value='2027';
   });
   session.append(selector);top.append(session);
   const notice=el('p','Data ujian QA dipaparkan bersama rekod Native. Jumlah bayaran belum semestinya kutipan sebenar.');notice.className='native-admin-qa-note';
   const message2=el('p');message2.id='native-admin-shell-message';message2.setAttribute('role','status');
   buildNativeDashboard(dashboard);
   main.append(top,notice,message2,dashboard);
   shell.append(sidebar,main);
   $('page-admin').append(shell);
   // Native 2027 records live inside the EXISTING Legacy Admin dashboard body.
   const originalBody=$('admin-tab-dashboard')&&$('admin-tab-dashboard').querySelector('.adm-body');
   if(originalBody)originalBody.append(dashboard);
   dashboard.hidden=true;
   // Original Legacy logout must also invalidate the Native Admin OTP token.
   const originalExit=$('page-admin').querySelector('.adm-hdr .btn-out');
   if(originalExit)originalExit.addEventListener('click',event=>{
     if(!token)return;
     event.preventDefault();event.stopImmediatePropagation();logout();
   },true);
   const message=el('p');message.id='native-admin-message';message.setAttribute('role','status');message.style.margin='12px 0';
   panel.append(otp,message);pane.append(panel);switchView('parent');
 });
})();
