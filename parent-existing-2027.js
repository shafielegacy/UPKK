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
function render2027(){
 const section=ensureSection();if(!section)return;
 section.hidden=typeof S==='undefined'||S.paymentSession!=='2027';
 section.replaceChildren();
 section.append(el('h2','Dashboard Parent · Sesi 2027'));
 const note=el('p','Paparan sesi 2027 menggunakan susun atur dashboard asal. Status yuran bulan lain hanya akan dipaparkan apabila disahkan oleh sistem.');
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
 const summary=el('div');summary.className='native-payment-summary';
 const status=String(child.firstMonthStatus||'').toUpperCase();
 const metrics=[
  ['Yuran Pendaftaran', 'RM'+(Number(child.registrationPaid)||0).toFixed(2)],
  ['Yuran Bulan Pertama', 'RM'+(Number(child.firstMonthPaid)||0).toFixed(2)],
  ['Disember 2026', status==='SELESAI'?'SELESAI':status==='BELUM BAYAR'?'BELUM BAYAR':'BELUM TERSEDIA']
 ];
 metrics.forEach(([name,value])=>{const tile=el('div');tile.className='native-stat';tile.append(el('strong',value),el('span',name));summary.append(tile);});
 section.append(summary);
 const receipt=el('p','No. resit pendaftaran: '+String(child.receiptNumber||'—'));
 receipt.className='native-receipt';section.append(receipt);
 section.append(el('h3','Status Yuran Jan–Dis 2027'));
 const grid=el('div');grid.className='yg native-month-grid';
 const months=['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogos','Sep','Okt','Nov','Dis'];
 months.forEach(month=>{
  const tile=el('div');tile.className='yc na native-month-card';
  const name=el('div',month);name.className='ym';
  const badge=el('span','BELUM TERSEDIA');badge.className='ybadge b-na';
  tile.append(name,badge);grid.append(tile);
 });
 section.append(grid);
 const explanation=el('p','Nota: 12 kad sesi 2027 belum mempunyai rekod yuran bulanan yang disahkan oleh backend. Bayaran bulan pertama Disember 2026 ditunjukkan berasingan di atas. BELUM TERSEDIA bukan tunggakan.');
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
