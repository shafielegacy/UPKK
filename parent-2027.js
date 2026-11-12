/* Native 2027 Parent OTP — add-on to the existing Log Masuk tab.
   Feature CLOSED unless explicitly enabled after GAS Parent V3 pilot review.
   No Legacy credentials or browser storage are modified. */
(()=>{'use strict';
 const cfg=window.UPKK_PARENT_2027_CONFIG||{};
 const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
 if(!enabled)return;
 const $=id=>document.getElementById(id);
 let email='',last6='',sessionToken='',busy=false,children=[];
 const el=(tag,value)=>{const node=document.createElement(tag);if(value!==undefined)node.textContent=value;return node;};
 const message=value=>{const node=$('native-parent-message');if(node)node.textContent=value||'';};
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
   if(which==='legacy'){sessionToken='';children=[];$('native-parent-code').value='';}
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
   setBusy(true);message('Memuatkan rekod anak...');
   const r=await rpc('getUnifiedParentV2',[sessionToken]);setBusy(false);
   if(!r.success){message(r.message||'Rekod tidak tersedia.');return;}
   children=Array.isArray(r.children)?r.children:[];draw();message('Rekod anak dikemas kini.');
 }
 async function logout(){
   const previous=sessionToken;switchView('legacy');
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
   const dash=el('div');dash.id='native-parent-dashboard';dash.hidden=true;
   dash.append(el('h3','Dashboard Ibu Bapa · Sesi 2027'));
   dash.append(button('Muat Semula','native-parent-refresh',refresh));
   dash.append(button('Log Keluar','native-parent-logout',logout));
   const list=el('div');list.id='native-parent-list';dash.append(list);
   const info=el('p');info.id='native-parent-message';info.setAttribute('role','status');info.style.cssText='font-size:12px;margin-top:12px';
   panel.append(form,dash,info);pane.append(panel);
 });
})();
