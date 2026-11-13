/* Native 2027 Parent OTP — add-on to the existing Log Masuk tab.
   Feature CLOSED unless explicitly enabled after GAS Parent V4 pilot review.
   No Legacy credentials or browser storage are modified. */
(()=>{'use strict';
 const cfg=window.UPKK_PARENT_2027_CONFIG||{};
 const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
 if(!enabled)return;
 const $=id=>document.getElementById(id);
 let email='',last6='',sessionToken='',busy=false,children=[];
 const el=(tag,value)=>{const node=document.createElement(tag);if(value!==undefined)node.textContent=value;return node;};
 const message=value=>{['native-parent-message','native-parent-shell-message'].forEach(id=>{const node=$(id);if(node)node.textContent=value||'';});};
 async function rpc(fn,args){
   const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),30000);
   try{
     const response=await fetch(cfg.endpoint,{
       method:'POST',mode:'cors',credentials:'omit',cache:'no-store',redirect:'follow',
       referrerPolicy:'no-referrer',headers:{'Content-Type':'text/plain;charset=UTF-8'},
       body:JSON.stringify({action:'pagesParentV2',rpc:fn,args}),signal:controller.signal
     });
     if(!response.ok)throw new Error('Unable to connect');
     return await response.json();
   }catch(_){return {success:false,message:'Sambungan Ibu Bapa 2027 tidak tersedia.'};}
   finally{clearTimeout(timeout);}
 }
 const button=(label,id,handler)=>{const b=el('button',label);b.className='btn btn-green';b.type='button';b.id=id;b.addEventListener('click',handler);return b;};
 const field=(label,id,type)=>{
   const wrap=el('div');wrap.className='fg';
   const cap=el('label',label);cap.className='form-lbl';cap.htmlFor=id;
   const inp=el('input');inp.className='form-inp';inp.id=id;inp.type=type;
   wrap.append(cap,inp);return wrap;
 };
 function switchView(which){
   $('native-parent-toggle').style.display=which==='legacy'?'':'none';
   $('native-parent-panel').hidden=which==='legacy';
   $('native-parent-form').hidden=which!=='otp';
   $('native-parent-dashboard').hidden=which!=='dashboard';
   const page=$('page-dashboard');
   if(page)page.classList.toggle('native-2027-active',which==='dashboard');
   const legacy=$('native-admin-legacy');
   if(legacy)legacy.hidden=which!=='legacy';
   // Do not interfere with Admin OTP, which is a separate explicit login choice.
   const admin=$('native-admin-switch');
   if(admin)admin.style.display=which==='legacy'?'':'none';
   const wrap=document.querySelector('#page-login .login-wrap');
   const head=document.querySelector('#page-login .login-head');
   const foot=document.querySelector('#page-login .login-foot');
   if(wrap)wrap.style.maxWidth=which==='dashboard'?'1000px':'';
   if(head)head.style.display=which==='dashboard'?'none':'';
   if(foot)foot.style.display=which==='dashboard'?'none':'';
   if(which==='legacy'){sessionToken='';children=[];email='';last6='';$('native-parent-code').value='';
     const list=$('native-parent-list');if(list)list.replaceChildren();}
   if(which==='dashboard'&&typeof window.showPage==='function')window.showPage('page-dashboard');
 }
 function setBusy(v){busy=v;['native-parent-request','native-parent-verify','native-parent-refresh'].forEach(id=>{const b=$(id);if(b)b.disabled=v;});}
 async function request(){
   if(busy)return;
   const e=$('native-parent-email').value.trim().toLowerCase();
   const p=$('native-parent-last6').value.trim();
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)||!/^[0-9]{6}$/.test(p)){
     message('Masukkan e-mel berdaftar dan 6 digit terakhir nombor telefon.');return;
   }
   email=e;last6=p;setBusy(true);
   const r=await rpc('requestParentV2Otp',[e,p]);setBusy(false);
   message(r.message||'Semak e-mel berdaftar untuk OTP.');
 }
 async function verify(){
   if(busy)return;const code=$('native-parent-code').value.trim();
   if(!/^[0-9]{6}$/.test(code)){message('Masukkan OTP enam digit.');return;}
   setBusy(true);
   const r=await rpc('verifyParentV2Otp',[email,last6,code]);setBusy(false);
   if(!r.success||!r.sessionToken){message(r.message||'OTP tidak sah.');return;}
   // Avoid simultaneous Legacy localStorage restoration with Native 2027 OTP.
   if(typeof window.doLogout==='function')window.doLogout();
   sessionToken=r.sessionToken;$('native-parent-code').value='';
   switchView('dashboard');message('Pengesahan berjaya.');refresh();
 }
 function draw(){
   const holder=$('native-parent-list');holder.replaceChildren();
   if(!children.length){holder.append(el('p','Tiada rekod anak yang diluluskan untuk akaun ini.'));return;}
   for(const child of children){
     const card=el('article');card.className='clay';
     card.style.cssText='margin:12px 0;padding:18px;border:1px solid #d5e5d4';
     const name=el('h3',child.studentName||'Murid');
     const tag=el('p','Sesi '+String(child.session||'')+' · '+(child.source==='NATIVE'?'Native 2027':'Legacy 2026'));
     tag.style.cssText='font-size:12px;margin-top:8px';
     card.append(name,tag);
     if(child.session==='2027'){
       const details=el('p','Tahun '+(child.classYear||'—')+' · '+(child.mode||'—')+' · Bulan pertama: '+(child.firstMonthStatus||'—'));
       details.style.cssText='font-size:13px;margin-top:8px';
       card.append(details);
       if(child.receiptNumber){
         const receipt=el('p','No. resit: '+child.receiptNumber);receipt.style.marginTop='8px';card.append(receipt);
       }
     } else {
       const note=el('p','Untuk status yuran dan resit sesi 2026, gunakan dashboard Legacy 2026.');
       note.style.cssText='font-size:12px;margin-top:8px';card.append(note);
     }
     holder.append(card);
   }
 }
 async function refresh(){
   if(busy||!sessionToken)return;
   const requestedToken=sessionToken;
   setBusy(true);message('Memuatkan rekod anak...');
   const r=await rpc('getUnifiedParentV2',[requestedToken]);setBusy(false);
   if(!sessionToken||requestedToken!==sessionToken)return;
   if(!r.success){const expired=sessionToken;message(r.message||'Sesi tamat. Sila log masuk semula.');switchView('legacy');if(typeof window.showPage==='function')window.showPage('page-login');if(expired)rpc('logoutParentV2',[expired]);return;}
   children=Array.isArray(r.children)?r.children:[];draw();message('Rekod anak dikemas kini.');
 }
 async function logout(){
   const previous=sessionToken;switchView('legacy');
   if(typeof window.showPage==='function')window.showPage('page-login');
   if(previous)await rpc('logoutParentV2',[previous]);
 }
 document.addEventListener('DOMContentLoaded',()=>{
   const pane=$('lcp-login');if(!pane)return;
   // The Admin add-on was loaded first; its legacy wrapper owns original Parent 2026 login.
   const legacy=$('native-admin-legacy');if(!legacy)return;
   const toggle=button('Log Masuk Ibu Bapa 2027','native-parent-toggle',()=>switchView('otp'));
   toggle.style.cssText='background:#e3efe4;color:#07553e;width:100%;margin-top:12px';
   pane.insertBefore(toggle,$('native-admin-switch'));
   const panel=el('section');panel.id='native-parent-panel';panel.hidden=true;
   const form=el('div');form.id='native-parent-form';
   form.append(el('h3','Log Masuk Ibu Bapa 2027'));
   form.append(field('E-mel berdaftar','native-parent-email','email'));
   form.append(field('6 digit akhir nombor telefon','native-parent-last6','text'));
   form.append(button('Hantar OTP','native-parent-request',request));
   form.append(field('Kod OTP enam digit','native-parent-code','text'));
   form.append(button('Sahkan OTP','native-parent-verify',verify));
   form.append(button('Kembali ke Log Masuk','native-parent-back',logout));
   const dash=el('section');dash.id='native-parent-dashboard';dash.hidden=true;
   dash.append(el('h3','Rekod Anak · Sesi 2027'));
   dash.append(button('Muat Semula','native-parent-refresh',refresh));
   dash.append(button('Log Keluar','native-parent-logout',logout));
   const list=el('div');list.id='native-parent-list';dash.append(list);
   const shell=el('section');shell.id='native-parent-shell';shell.className='native-parent-shell';
   const side=el('aside');side.className='native-parent-sidebar';
   const brand=el('div');brand.className='native-parent-brand';
   const logo=el('img');logo.src='./assets/branding/portal-logo.png';logo.alt='Logo Kafa & UPKK Syafie Legacy';
   brand.append(logo,el('strong','Kafa & UPKK Syafie Legacy'));
   const note=el('p','PANEL IBU BAPA · SESI 2027');note.className='native-parent-role';
   const nav=el('nav');nav.setAttribute('aria-label','Navigasi ibu bapa Native 2027');
   nav.append(button('Dashboard 2027','native-parent-nav-dashboard',()=>dash.scrollIntoView({behavior:'smooth'})));
   side.append(brand,note,nav,button('Log Keluar','native-parent-side-logout',logout));
   const main=el('div');main.className='native-parent-main';
   const heading=el('header');heading.className='native-parent-top';
   heading.append(el('div','Dashboard Ibu Bapa'));
   const badge=el('span');badge.className='native-parent-session';
   const selector=el('select');selector.id='native-parent-session-select-2027';
   selector.setAttribute('aria-label','Pilih sesi Ibu Bapa');
   [['2027','Sesi 2027'],['2026','Sesi 2026']].forEach(([value,label])=>{
     const option=el('option',label);option.value=value;selector.append(option);
   });
   selector.value='2027';
   selector.addEventListener('change',()=>{
     if(selector.value==='2026'){
       // Native OTP does not authenticate Legacy receipts; same login page, new verification.
       logout();
       message('Untuk sesi 2026, sila sahkan login Legacy pada halaman yang sama.');
     }
     selector.value='2027';
   });
   badge.append(selector);heading.append(badge);
   const explanation=el('p','Rekod 2026 hanya ditunjukkan sebagai rujukan. Untuk status yuran dan resit 2026, sila log masuk ke dashboard Legacy 2026.');explanation.className='native-parent-note';
   const shellMessage=el('p');shellMessage.id='native-parent-shell-message';shellMessage.setAttribute('role','status');
   main.append(heading,explanation,shellMessage,dash);
   shell.append(side,main);
   $('page-dashboard').append(shell);
   const info=el('p');info.id='native-parent-message';info.setAttribute('role','status');info.style.cssText='font-size:12px;margin-top:12px';
   panel.append(form,info);pane.append(panel);
 });
})();
