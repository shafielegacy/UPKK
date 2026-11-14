/* UPKK SL V2 — add approved 2027 children to the original Parent dashboard.
 * Same email + 6-digit phone login. No OTP. POST only, no workbook writes.
 * Server verifies identity and only returns APPROVED Native children.
 */
(function(){
'use strict';
const cfg=window.UPKK_PARENT_EXISTING_CONFIG||{};
const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
const $=id=>document.getElementById(id);
const el=(tag,value)=>{const node=document.createElement(tag);if(value!==undefined)node.textContent=String(value);return node;};
let requestId=0,children=[],nativeOnly=false,activeIndex=0,verified=false;
const style=document.createElement('style');
style.textContent='#page-dashboard.native-parent-2027-view .dash-body > :not(#native-parent-2027-inline){display:none!important}#page-dashboard.native-parent-2027-view .parent-side-nav{display:none!important}#page-dashboard.native-parent-2027-view #d-anak-selector{display:none!important}';
document.head.append(style);
function clear(){
 requestId++;children=[];nativeOnly=false;activeIndex=0;verified=false;
 $('native-parent-2027-inline')?.remove();
 $('page-dashboard')?.classList.remove('native-parent-2027-view');
}
async function lookup(email,pin){
 if(!enabled)return {success:false};
 const ctrl=new AbortController(),tid=setTimeout(()=>ctrl.abort(),25000);
 try{
  const response=await fetch(cfg.endpoint,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',redirect:'follow',referrerPolicy:'no-referrer',signal:ctrl.signal,headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({action:'pagesParentExistingLogin',rpc:'readApproved2027',args:[email,pin]})});
  if(!response.ok)return {success:false};
  return await response.json();
 }catch(_){return {success:false};}
 finally{clearTimeout(tid);}
}
function renderSelector(){
 if(!verified||!children.length)return false;
 const box=$('d-session-selector');if(!box)return false;
 box.replaceChildren();
 for(const year of ['2026','2027']){
  if(year==='2026'&&nativeOnly)continue;
  const b=el('button','Sesi '+year);b.type='button';
  b.className='anak-pill'+((year==='2027'&&S.paymentSession==='2027')||(year==='2026'&&S.paymentSession==='2026')?' active':'');
  b.addEventListener('click',()=>year==='2027'?show2027():show2026());
  box.append(b);
 }
 return true;
}
function ensureSection(){
 const page=$('page-dashboard'),body=page?.querySelector('.dash-body');if(!body)return null;
 let section=$('native-parent-2027-inline');
 if(!section){
  section=el('section');section.id='native-parent-2027-inline';
  section.style.cssText='margin:18px 0;padding:20px;border:1px solid #d3dcbf;border-left:4px solid #c3a05a;border-radius:18px;background:#fffef7;color:#174c38';
  body.append(section);
 }
 return section;
}
function render2027(){
 const section=ensureSection();if(!section)return;
 section.hidden=typeof S==='undefined'||S.paymentSession!=='2027';
 section.replaceChildren();
 section.append(el('h3','Anak Sesi 2027'));
 const note=el('p','Rekod pendaftaran yang telah diluluskan. Bayaran bulanan 2027 yang lain belum disediakan.');
 note.style.cssText='font-size:13px;margin:8px 0 14px;color:#37624e';section.append(note);
 if(children.length>1){
  const picker=el('select');picker.className='form-inp';picker.setAttribute('aria-label','Pilih anak sesi 2027');
  children.forEach((c,i)=>{const opt=el('option',c.studentName||'Anak '+(i+1));opt.value=String(i);picker.append(opt);});
  picker.value=String(activeIndex);
  picker.addEventListener('change',()=>{activeIndex=Number(picker.value)||0;render2027();});
  section.append(picker);
 }
 const child=children[activeIndex]||children[0];if(!child)return;
 const card=el('article');card.style.cssText='padding:14px 0;margin-top:12px;border-top:1px solid #dce4d4';
 card.append(el('strong',child.studentName||'Murid'));
 const fields=[
  ['Tahun kelas',child.classYear||'—'],['Mod pembelajaran',child.mode||'—'],
  ['Yuran pendaftaran dibayar','RM'+(Number(child.registrationPaid)||0).toFixed(2)],
  ['Yuran bulan pertama dibayar','RM'+(Number(child.firstMonthPaid)||0).toFixed(2)],
  ['Status bulan pertama',child.firstMonthStatus||'—'],['No. resit',child.receiptNumber||'—']
 ];
 fields.forEach(([label,val])=>{const p=el('p',label+': '+val);p.style.cssText='font-size:13px;margin:7px 0';card.append(p);});
 section.append(card);
}
function show2027(){
 if(!verified||!children.length)return false;
 if(typeof S==='undefined'||!S.user||S.user.role!=='parent')return false;
 S.paymentSession='2027';S.dashboardRequest++;S.dashboard=null;
 render2027();$('page-dashboard')?.classList.add('native-parent-2027-view');
 renderSelector();
 if(typeof showPage==='function')showPage('page-dashboard');
 return true;
}
function show2026(){
 if(!verified||nativeOnly||!S.user||!S.user.anak?.length)return false;
 $('page-dashboard')?.classList.remove('native-parent-2027-view');
 const nativePanel=$('native-parent-2027-inline');if(nativePanel)nativePanel.hidden=true;
 S.paymentSession='2026';
 renderSelector();
 const child=S.user.anak[S.anakIdx]||S.user.anak[0];
 if(typeof loadDashboard==='function')loadDashboard(S.user.email,child.namaMurid||'',child.tarikhDaftar||'');
 return true;
}
async function afterLegacyLogin(email,pin){
 if(!enabled)return;
 const n=++requestId,r=await lookup(email,pin);
 if(n!==requestId||!r.success||!Array.isArray(r.children)||!r.children.length)return;
 if(typeof S==='undefined'||!S.user||S.user.role!=='parent'||String(S.user.email||'').trim().toLowerCase()!==String(email||'').trim().toLowerCase())return;
 children=r.children;verified=true;nativeOnly=false;activeIndex=0;
 render2027();renderSelector();
}
async function tryNativeOnly(email,pin){
 if(!enabled)return false;
 const n=++requestId,r=await lookup(email,pin);
 if(n!==requestId||!r.success||!Array.isArray(r.children)||!r.children.length)return false;
 if(typeof S==='undefined'||typeof showPage!=='function')return false;
 try{localStorage.removeItem('upkk_session');}catch(_){}
 children=r.children;verified=true;nativeOnly=true;activeIndex=0;
 S.user={success:true,role:'parent',email:r.email||email,namaIbuBapa:'Penjaga Sesi 2027',anak:r.children.map(c=>({namaMurid:c.studentName,tarikhDaftar:''})),nativeOnly:true};
 S.anakIdx=0;
 if($('d-penjaga'))$('d-penjaga').textContent='Penjaga Sesi 2027';
 show2027();return true;
}
window.UPKKParentExistingV2=Object.freeze({afterLegacyLogin,tryNativeOnly,renderSelector,show2027,show2026,clear});
})();
