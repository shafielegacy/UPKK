/* UPKK SL Parent Existing Login 2027 — CLOSED integration scaffold.
 * No second login, Parent OTP, writes, payment or receipt endpoints.
 * IMPORTANT: email + phone last6 alone is not a cryptographically bound Legacy session.
 * DO NOT enable until server enforces an authenticated parent identity context.
 */
(()=>{'use strict';
  const cfg=window.UPKK_PARENT_EXISTING_2027_CONFIG||{};
  const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
  let identity=null, sessionToken='', generation=0, pending=null;
  const $=id=>document.getElementById(id);
  const make=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
  function reset(){
    generation++;identity=null;pending=null;
    const previous=sessionToken;sessionToken='';
    if(previous) rpc('logoutParentExistingSession',[previous]).catch(()=>{});
  }
  function onLegacyLogin(email,phone){
    reset();
    if(!enabled)return;
    const pin=String(phone||'').replace(/\D/g,'').slice(-6);
    const e=String(email||'').trim().toLowerCase();
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)&&/^\d{6}$/.test(pin)) identity={email:e,pin};
  }
  async function rpc(name,args,signal){
    const response=await fetch(cfg.endpoint,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',redirect:'follow',referrerPolicy:'no-referrer',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({action:'pagesParentExistingLogin',rpc:name,args}),signal});
    if(!response.ok)throw new Error('HTTP');
    return await response.json();
  }
  function display(text,children){
    // The existing Parent dashboard is preserved: only the 2027 *read-only* region changes.
    if(typeof S==='undefined'||S.paymentSession!=='2027'||!S.user||S.user.role!=='parent')return;
    const current=$('d-summary'),grid=$('yg');
    if(current){current.replaceChildren();const info=make('p',text);current.append(info);}
    if(grid){grid.replaceChildren();if(children&&children.length){
      children.forEach(child=>{
        const card=make('section');card.className='yc';card.style.cssText='grid-column:1/-1;padding:15px;overflow-wrap:anywhere';
        const name=make('strong',String(child.studentName||'Murid'));const state=make('p','Pendaftaran sesi 2027: DILULUSKAN');
        const year=make('p','Tahun/Kelas: '+String(child.classYear||'—'));
        const fees=make('p','Pendaftaran dibayar: RM'+String(Number(child.registrationPaid)||0)+' · Bulan pertama: RM'+String(Number(child.firstMonthPaid)||0));
        const note=make('p','Status bulan pertama: '+String(child.firstMonthStatus||'Belum tersedia'));
        card.append(name,state,year,fees,note);grid.append(card);
      });
    }else{grid.append(make('p',text));}}
    const childPicker=$('d-anak-selector');if(childPicker)childPicker.style.display='none';
    const name=$('d-murid');if(name)name.textContent='Rekod sesi 2027';
    const date=$('d-daftar');if(date)date.textContent='Hanya pendaftaran yang diluluskan';
    const sub=$('d-sub');if(sub)sub.textContent='Sesi 2027 — paparan baca sahaja';
    const yearTitle=$('yg')&&$('yg').previousElementSibling;
    if(yearTitle&&yearTitle.classList.contains('sec-ttl'))yearTitle.textContent='Pendaftaran Diluluskan · 2027';
    const dash=$('page-dashboard');if(dash)dash.classList.add('parent-native-2027-view');
    if(typeof renderPaymentSessionSelector==='function')renderPaymentSessionSelector();
    if(typeof showPage==='function')showPage('page-dashboard');
  }
  async function show2027(request){
    const own=++generation;
    const isCurrent=()=>own===generation&&S.dashboardRequest===request&&S.paymentSession==='2027'&&S.user&&S.user.role==='parent';
    // Server flag must also remain OFF until access binding is approved.
    if(!enabled){display('Sesi 2027 belum dibuka.',[]);return;}
    if(!identity){display('Sila log masuk semula menggunakan borang Parent asal untuk menyemak sesi 2027.',[]);return;}
    const proof={...identity};
    display('Menyemak rekod pendaftaran 2027 yang diluluskan...',[]);
    const abort=new AbortController();const timeout=setTimeout(()=>abort.abort(),30000);
    try{
      if(!sessionToken){
        const opened=await rpc('openParentExistingSession',[proof.email,proof.pin],abort.signal);
        if(!isCurrent())return;
        if(!opened||opened.success!==true||!/^[0-9a-f]{64}$/i.test(opened.sessionToken||''))throw new Error('Session rejected');
        sessionToken=opened.sessionToken;
      }
      const data=await rpc('readApproved2027',[sessionToken],abort.signal);
      if(!isCurrent())return;
      if(!data||data.success!==true||data.role!=='parent'||data.session!=='2027'||!Array.isArray(data.children))throw new Error('Unauthorised response');
      pending=data.children;
      display(pending.length?'Rekod pendaftaran 2027 yang diluluskan:':'Tiada rekod 2027 yang diluluskan untuk identiti ini.',pending);
    }catch(_){if(isCurrent())display('Rekod 2027 tidak tersedia atau belum diluluskan.',[]);}
    finally{clearTimeout(timeout);}
  }
  function onLegacyView(){
    generation++; // Ignore any in-flight 2027 response after returning to 2026.
    const dash=$('page-dashboard');if(dash)dash.classList.remove('parent-native-2027-view');
    const yearTitle=$('yg')&&$('yg').previousElementSibling;
    if(yearTitle&&yearTitle.classList.contains('sec-ttl'))yearTitle.textContent='Status Yuran Jan–Dis 2026';
  }
  // No reliance on localStorage user/session to grant access to 2027.
  window.UPKK_PARENT_EXISTING_2027=Object.freeze({enabled,onLegacyLogin,show2027,onLegacyView,reset});
})();
