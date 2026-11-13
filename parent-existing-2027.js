/* UPKK SL V2 — Parent 2027 data on original Parent login/dashboard; CLOSED by config. */
(function(){
 'use strict';
 const cfg=window.UPKK_PARENT_EXISTING_CONFIG||{};
 const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
 let nonce=0;
 const $=id=>document.getElementById(id);
 const el=(tag,value)=>{const n=document.createElement(tag);if(value!==undefined)n.textContent=value;return n;};
 function clear(){
   nonce++;
   const node=$('native-parent-2027-inline');if(node)node.remove();
   const page=$('page-dashboard');if(page)page.classList.remove('native-parent-2027-only');
 }
 async function lookup(email,last6){
   if(!enabled)return {success:false};
   const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),25000);
   try{
     const response=await fetch(cfg.endpoint,{
       method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},
       mode:'cors',credentials:'omit',cache:'no-store',redirect:'follow',
       referrerPolicy:'no-referrer',signal:controller.signal,
       body:JSON.stringify({action:'pagesParentExistingLogin',rpc:'readApproved2027',args:[email,last6]})
     });
     if(!response.ok)return {success:false};
     return await response.json();
   }catch(_){return {success:false};}
   finally{clearTimeout(timeout);}
 }
 function render(children,only){
   const page=$('page-dashboard');if(!page)return;
   const body=page.querySelector('.dash-body')||page;
   const old=$('native-parent-2027-inline');if(old)old.remove();
   const section=el('section');section.id='native-parent-2027-inline';
   section.className='clay';
   section.style.cssText='margin:20px 0;padding:20px;border:1px solid #d3dcbf;border-left:4px solid #c3a05a;border-radius:18px;background:#fffef7';
   section.append(el('h3','Anak Sesi 2027'));
   const note=el('p',only?'Rekod anak sesi 2027 yang telah diluluskan.':'Rekod sesi 2027 dipaparkan bersama dashboard asal sesi 2026.');
   note.style.cssText='font-size:13px;margin:8px 0 14px;color:#37624e';section.append(note);
   for(const child of children){
     const card=el('article');card.style.cssText='padding:12px 0;border-top:1px solid #dce4d4';
     const name=el('strong',String(child.studentName||'Murid'));card.append(name);
     const meta=el('p','Tahun '+String(child.classYear||'—')+' · '+String(child.mode||'—')+' · Bayaran bulan pertama: '+String(child.firstMonthStatus||'—'));
     meta.style.cssText='font-size:12px;margin-top:6px';card.append(meta);
     if(child.receiptNumber)card.append(el('p','No. resit: '+String(child.receiptNumber)));
     section.append(card);
   }
   body.append(section);
   page.classList.toggle('native-parent-2027-only',!!only);
 }
 async function afterLegacyLogin(email,last6){
   if(!enabled)return;
   const request=++nonce;
   const r=await lookup(email,last6);
   if(request!==nonce||!r.success||!Array.isArray(r.children))return;
   if(typeof S==='undefined'||!S.user||S.user.role!=='parent'||String(S.user.email||'').toLowerCase()!==String(email||'').toLowerCase())return;
   render(r.children,false);
 }
 async function tryNativeOnly(email,last6){
   if(!enabled)return false;
   const request=++nonce;
   const r=await lookup(email,last6);
   if(request!==nonce||!r.success||!Array.isArray(r.children)||!r.children.length)return false;
   // Same existing login credentials; the server verified them against APPROVED 2027 rows.
   // Never persist Native-only identity or a credential in localStorage.
   if(typeof S==='undefined'||typeof window.showPage!=='function')return false;
   try{localStorage.removeItem('upkk_session');}catch(_){}
   S.user={success:true,role:'parent',email:r.email||email,namaIbuBapa:'Penjaga Sesi 2027',
     anak:r.children.map(x=>({namaMurid:x.studentName,tarikhDaftar:''})),nativeOnly:true};
   S.anakIdx=0;
   if($('d-penjaga'))$('d-penjaga').textContent='Penjaga Sesi 2027';
   if($('d-sub'))$('d-sub').textContent='Rekod Sesi 2027';
   render(r.children,true);
   window.showPage('page-dashboard');
   return true;
 }
 window.UPKKParentExistingV2=Object.freeze({afterLegacyLogin,tryNativeOnly,clear});
})();