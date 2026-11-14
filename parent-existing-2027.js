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
style.textContent=`
#page-dashboard.native-parent-2027-view .dash-body > :not(#native-parent-2027-inline){display:none!important}
#page-dashboard.native-parent-2027-view .parent-side-nav{display:none!important}
#page-dashboard.native-parent-2027-view #d-anak-selector{display:none!important}
#page-dashboard #native-parent-2027-inline{grid-column:1/-1;grid-row:1 / span 8;width:100%;min-width:0;max-width:100%;box-sizing:border-box;overflow-wrap:break-word}
#native-parent-2027-inline .native-note{font-size:13px;line-height:1.7;margin:10px 0 20px;color:#496d5b}
#native-parent-2027-inline .native-picker{margin:12px 0 18px;max-width:440px}
#native-parent-2027-inline .native-picker label{display:block;margin-bottom:8px;font-weight:700;font-size:13px}
#native-parent-2027-inline .native-picker select{width:100%;max-width:100%;min-width:0}
#native-parent-2027-inline .native-student{display:flex;align-items:center;gap:16px;padding:20px;border-radius:20px;background:linear-gradient(115deg,#07543d,#0a8058);color:white;margin:14px 0 20px}
#native-parent-2027-inline .native-student img{height:55px;width:55px;flex:none;object-fit:contain;border-radius:50%}
#native-parent-2027-inline .native-student h3{font-size:18px;line-height:1.4;color:#fff;margin:3px 0}
#native-parent-2027-inline .native-student p{font-size:12px;line-height:1.5;color:#eef9f2}
#native-parent-2027-inline .native-student small{font-size:10px;letter-spacing:.08em}
#native-parent-2027-inline .native-payment-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:15px}
#native-parent-2027-inline .native-stat{min-width:0;border-radius:16px;padding:18px 12px;background:#f0f8f0;border:1px solid #d5e8d8;text-align:center;display:flex;flex-direction:column;gap:7px}
#native-parent-2027-inline .native-stat strong{font-size:clamp(14px,2vw,22px);color:#07543d;overflow-wrap:anywhere}
#native-parent-2027-inline .native-stat span{font-size:11px;color:#456b55}
#native-parent-2027-inline .native-receipt{font-size:13px;margin:8px 0 24px;color:#3d6853}
#native-parent-2027-inline>.yg{display:grid!important;width:100%;grid-template-columns:repeat(6,minmax(0,1fr));gap:11px;padding:16px;background:#fff;border-radius:20px;margin-top:12px;margin-bottom:8px}
#native-parent-2027-inline .native-month-card{min-width:0;min-height:94px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:1px solid #e6ece5;border-radius:14px;background:#fbfdfa;text-align:center}
#native-parent-2027-inline .native-month-card .ym{font-weight:700;color:#628c77}
#native-parent-2027-inline .native-month-card .ybadge{font-size:9px;white-space:normal}
#native-parent-2027-inline .native-start-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0 22px}
#native-parent-2027-inline .native-start-card{min-width:0;border:1px solid #e2d3a5;border-radius:16px;padding:16px;background:#fff8e8;display:flex;flex-direction:column;gap:9px}
#native-parent-2027-inline .native-start-card h4{color:#07543d;font-size:15px}
#native-parent-2027-inline .native-start-card strong{font-size:13px;color:#134e39}
#native-parent-2027-inline .native-start-card p{font-size:12px;color:#52705e}
#native-parent-2027-inline .native-start-card .native-status-pending{color:#9a5716}
#native-parent-2027-inline .native-start-card .native-status-ok{color:#0b774a}
#native-parent-2027-inline .native-month-card small{font-size:10px;color:#466c58;overflow-wrap:anywhere}
#native-parent-2027-inline .native-pay-action,.native-pay-dialog .native-pay-action{cursor:pointer;border:0;background:#0b7853;color:#fff;border-radius:10px;padding:9px 12px;font-size:12px;font-weight:700;margin-top:5px}
#native-parent-2027-inline .native-pay-action:disabled,.native-pay-dialog .native-pay-action:disabled{opacity:.5;cursor:default}
.native-pay-cover{position:fixed;z-index:99999;inset:0;background:rgba(3,27,17,.72);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}
.native-pay-dialog{width:min(100%,480px);max-height:95vh;overflow:auto;border-radius:18px;background:#fff;padding:24px;display:flex;flex-direction:column;gap:12px;color:#134934}
.native-pay-dialog label{font-weight:700;font-size:13px}
.native-pay-dialog input,.native-pay-dialog select{width:100%;padding:11px;border:1px solid #b5c8bc;border-radius:9px;font:inherit}
.native-pay-dialog form{display:flex;flex-direction:column;gap:10px}
.native-pay-dialog form[hidden]{display:none}
.native-pay-dialog .native-pay-close{align-self:flex-end;cursor:pointer;border:1px solid #ccc;background:white;border-radius:9px;padding:6px 12px}
.native-pay-dialog [role=status]{font-size:13px;line-height:1.5}

@media(max-width:580px){#native-parent-2027-inline .native-start-grid{grid-template-columns:1fr}}

@media(max-width:900px){#native-parent-2027-inline>.yg{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:580px){#native-parent-2027-inline .native-payment-summary{grid-template-columns:1fr}#native-parent-2027-inline>.yg{grid-template-columns:repeat(2,minmax(0,1fr));padding:10px}#native-parent-2027-inline .native-student{padding:14px}}
`;
document.head.append(style);
function clear(){
 requestId++;children=[];nativeOnly=false;activeIndex=0;verified=false;
 $('native-parent-2027-inline')?.remove();
 const selector=$('d-session-selector');if(selector){selector.replaceChildren();selector.style.display='none';}
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
 box.style.display='flex';
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
  section.style.cssText='margin:18px 0;padding:clamp(14px,2.5vw,26px);border:1px solid #d3dcbf;border-left:4px solid #c3a05a;border-radius:18px;background:#fffef7;color:#174c38';
  body.append(section);
 }
 return section;
}

const monthNames=['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember'];
const shortMonths=['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogos','Sep','Okt','Nov','Dis'];

/* Monthly eBayar: same Native POST endpoint, server alone decides eligibility.
 * Parents re-enter existing 6-digit phone PIN for each payment action; do not
 * persist credentials, slip bytes or payment authorisation in localStorage.
 */
function malaysiaMonthKey(){
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit'}).formatToParts(new Date());
 const value=k=>parts.find(x=>x.type===k)?.value||'';
 return value('year')+'-'+value('month');
}
function malaysiaDateKey(){
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const value=k=>parts.find(x=>x.type===k)?.value||'';
 return value('year')+'-'+value('month')+'-'+value('day');
}
function canOfferMonthly(child,key,status){
 return !!child?.applicationId && /^202(6|7)-(0[1-9]|1[0-2])$/.test(key) &&
  key>='2026-12' && key<=malaysiaMonthKey() &&
  (!child.firstMonthKey||key>=child.firstMonthKey) &&
  !['SELESAI','PENDING','TIDAK BERKENAAN'].includes(String(status||'').toUpperCase());
}
async function nativeEbayarRpc(rpc,args){
 if(!enabled)throw new Error('Sambungan Native tidak tersedia.');
 const response=await fetch(cfg.endpoint,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',redirect:'follow',
  referrerPolicy:'no-referrer',headers:{'Content-Type':'text/plain;charset=UTF-8'},
  body:JSON.stringify({action:'pagesNativeEbayar',rpc,args})});
 if(!response.ok)throw new Error('Sambungan bayaran tidak tersedia.');
 const result=await response.json();
 if(!result?.success)throw new Error(result?.message||'Native eBayar belum tersedia.');
 return result;
}
function proofAsBase64(file){
 return new Promise((resolve,reject)=>{
  if(!file||file.size<8||file.size>3*1024*1024||
   !['image/jpeg','image/png','application/pdf'].includes(file.type)){
   reject(new Error('Pilih bukti JPEG, PNG atau PDF sehingga 3 MB.'));return;
  }
  const reader=new FileReader();
  reader.onerror=()=>reject(new Error('Fail bukti tidak dapat dibaca.'));
  reader.onload=()=>resolve({mimeType:file.type,base64:String(reader.result||'').split(',')[1]||''});
  reader.readAsDataURL(file);
 });
}
function offerMonthlyButton(container,child,key,status){
 if(!canOfferMonthly(child,key,status))return;
 const btn=el('button','Semak / bayar yuran');
 btn.type='button';btn.className='native-pay-action';
 btn.addEventListener('click',()=>openMonthlyEbayar(child,key));
 container.append(btn);
}
function openMonthlyEbayar(child,key){
 if(!canOfferMonthly(child,key))return;
 // A modal within the authenticated dashboard, never a Legacy eBayar form.
 $('native-ebayar-dialog')?.remove();
 const cover=el('div');cover.id='native-ebayar-dialog';cover.className='native-pay-cover';
 const dialog=el('section');dialog.className='native-pay-dialog';
 dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
 dialog.setAttribute('aria-label','Native eBayar '+monthLabel(key));
 const title=el('h3','Native eBayar · '+monthLabel(key));
 const sub=el('p',String(child.studentName||'Murid')+' · Sesi Akademik 2027');
 const close=el('button','Tutup');close.type='button';close.className='native-pay-close';
 close.addEventListener('click',()=>cover.remove());
 const msg=el('p','Masukkan enam digit akhir telefon untuk semak kelayakan bayaran.');msg.setAttribute('role','status');
 const labelPin=el('label','Enam digit akhir telefon');
 const pin=el('input');pin.type='password';pin.inputMode='numeric';pin.autocomplete='off';pin.maxLength=6;pin.placeholder='••••••';
 const check=el('button','Semak bayaran');check.type='button';check.className='native-pay-action';
 const form=el('form');form.hidden=true;
 const dateLabel=el('label','Tarikh bayaran');
 const date=el('input');date.type='date';date.max=malaysiaDateKey();date.min='2026-12-01';date.value=malaysiaDateKey();date.required=true;
 const methodLabel=el('label','Kaedah bayaran');
 const method=el('select');for(const m of ['TRANSFER','CASH']){const opt=el('option',m==='TRANSFER'?'Pindahan bank':'Tunai');opt.value=m;method.append(opt);}
 const fileLabel=el('label','Bukti pembayaran (JPEG / PNG / PDF, maksimum 3 MB)');
 const file=el('input');file.type='file';file.accept='image/jpeg,image/png,application/pdf';file.required=true;
 const send=el('button','Hantar bukti bayaran');send.type='submit';send.className='native-pay-action';
 form.append(dateLabel,date,methodLabel,method,fileLabel,file,send);
 dialog.append(title,sub,close,labelPin,pin,check,msg,form);cover.append(dialog);
 // Prevent clicking outside from submitting or changing session.
 cover.addEventListener('click',e=>{if(e.target===cover)cover.remove();});
 document.body.append(cover);
 let quoted=null,working=false;
 check.addEventListener('click',async()=>{
  if(working)return;
  if(!/^\d{6}$/.test(pin.value)){msg.textContent='Masukkan enam digit telefon yang sah.';return;}
  working=true;check.disabled=true;form.hidden=true;msg.textContent='Menyemak status dan jumlah sebenar...';
  try{
   quoted=await nativeEbayarRpc('quote',[String(S.user.email||''),pin.value,child.applicationId,key]);
   msg.textContent='Status: '+quoted.status+' · '+(quoted.canSubmit?'Baki RM'+Number(quoted.amount).toFixed(2)+' untuk dihantar.':'Tiada bayaran boleh dihantar bagi bulan ini.');
   form.hidden=!quoted.canSubmit;
  }catch(e){quoted=null;msg.textContent=e.message||'Semakan belum tersedia.';}
  finally{working=false;check.disabled=false;}
 });
 form.addEventListener('submit',async(e)=>{
  e.preventDefault();
  if(working||!quoted?.canSubmit)return;
  working=true;send.disabled=true;msg.textContent='Menghantar bukti. Jangan tutup halaman sehingga keputusan dipaparkan.';
  try{
   // Server rechecks child ownership, month, credit and duplicate under lock.
   const proof=await proofAsBase64(file.files[0]);
   const result=await nativeEbayarRpc('submit',[String(S.user.email||''),pin.value,child.applicationId,key,date.value,method.value,proof]);
   msg.textContent=result.message||'Bukti bayaran diterima untuk semakan Admin.';
   form.hidden=true;check.disabled=true;pin.value='';
  }catch(err){msg.textContent=err.message||'Status penghantaran tidak dapat dipastikan. Hubungi urusetia sebelum cuba lagi.';}
  finally{working=false;send.disabled=false;}
 });
}

function dateInfo(raw){
 const value=String(raw||'').trim();
 let d,m,y;
 let match=value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
 if(match){d=+match[1];m=+match[2];y=+match[3];}
 else{
  match=value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
  if(!match)return null;
  y=+match[1];m=+match[2];d=+match[3];
 }
 const check=new Date(Date.UTC(y,m-1,d));
 if(check.getUTCFullYear()!==y||check.getUTCMonth()!==m-1||check.getUTCDate()!==d)return null;
 return {key:y+'-'+String(m).padStart(2,'0'),day:String(d).padStart(2,'0')+'/'+String(m).padStart(2,'0')+'/'+y};
}
function monthInfo(raw){
 const v=String(raw||'').trim(),m=v.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
 return m?{key:v,year:+m[1],month:+m[2],label:monthNames[+m[2]-1]+' '+m[1]}:null;
}
function monthLabel(key){
 const m=monthInfo(key);
 return m?m.label:'Bulan belum tersedia';
}
function paidStatus(child){
 const raw=String(child.firstMonthStatus||'').trim().toUpperCase();
 return raw==='SELESAI'?'SELESAI':raw==='BELUM BAYAR'?'BELUM BAYAR':'BELUM TERSEDIA';
}
function eventCard(key,registration,first,child,created){
 const card=el('article');card.className='native-start-card';
 card.append(el('h4',monthLabel(key)));
 if(registration){
  card.append(el('strong','DAFTAR PADA '+(created?created.day:'TARIKH BELUM TERSEDIA')));
  card.append(el('p','Yuran pendaftaran: RM'+(Number(child.registrationPaid)||0).toFixed(2)+' diterima'));
 }
 if(first){
  const status=paidStatus(child);
  const statusNode=el('strong','Yuran bulan pertama: '+status);
  statusNode.className=status==='SELESAI'?'native-status-ok':status==='BELUM BAYAR'?'native-status-pending':'';
  card.append(statusNode);
  card.append(el('p','Dibayar RM'+(Number(child.firstMonthPaid)||0).toFixed(2)));
 }
 if(first)offerMonthlyButton(card,child,key,paidStatus(child));
 return card;
}

function render2027(){
 const section=ensureSection();if(!section)return;
 section.hidden=typeof S==='undefined'||S.paymentSession!=='2027';
 section.replaceChildren();
 section.append(el('h2','Dashboard Parent · Sesi 2027'));
 const note=el('p','Pendaftaran dan bayaran bulan pertama mengikut rekod yang disahkan. Status yuran bulan lain hanya dipaparkan apabila tersedia.');
 note.className='native-note';section.append(note);
 if(children.length>1){
  const pickerWrap=el('div');pickerWrap.className='native-picker';
  const label=el('label','Pilih anak sesi 2027');label.htmlFor='native-child-picker';pickerWrap.append(label);
  const picker=el('select');picker.id='native-child-picker';picker.className='form-inp';
  children.forEach((c,i)=>{const opt=el('option',c.studentName||'Anak '+(i+1));opt.value=String(i);picker.append(opt);});
  picker.value=String(activeIndex);
  picker.addEventListener('change',()=>{activeIndex=Number(picker.value)||0;render2027();});
  pickerWrap.append(picker);section.append(pickerWrap);
 }
 const child=children[activeIndex]||children[0];if(!child)return;
 const pupil=el('div');pupil.className='native-student';
 const img=el('img');img.src='./assets/branding/portal-logo.png';img.alt='Logo Kafa & UPKK Syafie Legacy';
 const names=el('div');names.append(el('small','NAMA MURID'),el('h3',child.studentName||'Murid'));
 names.append(el('p','Tahun kelas: '+String(child.classYear||'—')+' · Mod pembelajaran: '+String(child.mode||'—')));
 pupil.append(img,names);section.append(pupil);

 const created=dateInfo(child.createdAt||child.registrationDate);
 const first=monthInfo(child.firstMonthKey);
 const summary=el('div');summary.className='native-payment-summary';
 const metrics=[
  ['Yuran Pendaftaran', 'RM'+(Number(child.registrationPaid)||0).toFixed(2)],
  ['Yuran Bulan Pertama', 'RM'+(Number(child.firstMonthPaid)||0).toFixed(2)],
  [first?first.label:'Bulan Pertama',paidStatus(child)]
 ];
 metrics.forEach(([name,value])=>{const tile=el('div');tile.className='native-stat';tile.append(el('strong',value),el('span',name));summary.append(tile);});
 section.append(summary);
 const receipt=el('p','No. resit pendaftaran: '+String(child.receiptNumber||'—'));
 receipt.className='native-receipt';section.append(receipt);

 section.append(el('h3','Permulaan Sesi'));
 const starts=el('div');starts.className='native-start-grid';
 // Pre-2027 events are displayed separately; events within 2027 belong to the 12-month grid below.
 const extraKeys=[...new Set([created?.key,first?.key].filter(key=>key&&key.slice(0,4)!=='2027'))].sort();
 extraKeys.forEach(key=>starts.append(eventCard(key,created?.key===key,first?.key===key,child,created)));
 if(!created||!first){
  const reminder=el('p','Tarikh pendaftaran atau bulan pertama belum dibekalkan oleh backend. Paparan tidak akan meneka bulan daripada amaun bayaran.');
  reminder.className='native-note';starts.append(reminder);
 }
 if(extraKeys.length) section.append(starts);
 else if(created||first){const hint=el('p','Peristiwa dalam tahun 2027 ditandakan terus pada kad bulan yang berkaitan di bawah.');hint.className='native-note';section.append(hint);}
 else section.append(starts);

 section.append(el('h3','Status Yuran Jan–Dis 2027'));
 const grid=el('div');grid.className='yg native-month-grid';
 shortMonths.forEach((month,i)=>{
  const key='2027-'+String(i+1).padStart(2,'0');
  const isReg=created?.key===key,isFirst=first?.key===key;
  const tile=el('div');tile.className='yc na native-month-card';
  const name=el('div',month);name.className='ym';tile.append(name);
  const status=isFirst?paidStatus(child):'BELUM TERSEDIA';
  const badge=el('span',status);badge.className='ybadge '+(status==='SELESAI'?'b-ok':status==='BELUM BAYAR'?'b-blm':'b-na');
  tile.append(badge);
  if(isReg)tile.append(el('small','Daftar '+created.day));
  if(isFirst)tile.append(el('small','Yuran pertama: RM'+(Number(child.firstMonthPaid)||0).toFixed(2)+' dibayar'));
  offerMonthlyButton(tile,child,key,status);
  grid.append(tile);
 });
 section.append(grid);
 const explanation=el('p','Nota: BELUM TERSEDIA bukan tunggakan. Kad bulanan lain memerlukan pengesahan rekod bayaran sebelum status ditentukan.');
 explanation.className='native-note';section.append(explanation);
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
