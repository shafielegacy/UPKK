/* UPKK SL Parent OTP Unified CLOSED integration candidate.
 * One existing login form + email OTP, original Parent dashboard container.
 * No token in localStorage/sessionStorage/URL. No GET/JSONP, receipt or payment writes.
 * DO NOT enable until Native gates/identity mapping approved and live pilot verified.
 */
(()=>{'use strict';
  const cfg=window.UPKK_PARENT_OTP_UNIFIED_CONFIG||{};
  const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
  const $=id=>document.getElementById(id);
  let token='',email='',pin='',children=[],verified=false,allowLegacy=false,busy=false,epoch=0,hasLegacy=false,expiresAt=0;
  const text=(tag,value)=>{const n=document.createElement(tag);n.textContent=value;return n;};
  const message=v=>{const n=$('upkk-parent-otp-msg');if(n)n.textContent=v||'';};
  async function rpc(rpc,args){
    const ctrl=new AbortController(),tid=setTimeout(()=>ctrl.abort(),30000);
    try{
      const r=await fetch(cfg.endpoint,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',redirect:'follow',referrerPolicy:'no-referrer',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({action:'pagesParentV2',rpc,args}),signal:ctrl.signal});
      if(!r.ok)throw Error('HTTP');return await r.json();
    }finally{clearTimeout(tid);}
  }
  function reset(){
    epoch++;const old=token;token='';email='';pin='';children=[];verified=false;allowLegacy=false;busy=false;hasLegacy=false;expiresAt=0;
    if(old)rpc('logoutParentV2',[old]).catch(()=>{});
    const panel=$('upkk-parent-otp-panel');if(panel)panel.hidden=true;
    const code=$('upkk-parent-otp-code');if(code)code.value='';
    document.getElementById('page-dashboard')?.classList.remove('upkk-otp-unified-view');
  }
  function hasVerifiedSession(){return verified&&Date.now()<expiresAt&&/^[0-9a-f]{64}$/i.test(token);}
  function consumeLegacyLoginApproval(){if(!enabled)return true;if(allowLegacy&&hasVerifiedSession()){allowLegacy=false;return true;}return false;}
  function panel(){
    let p=$('upkk-parent-otp-panel');if(p)return p;
    const login=$('lcp-login');if(!login)return null;
    p=document.createElement('section');p.id='upkk-parent-otp-panel';p.hidden=true;
    p.style.cssText='margin-top:14px;padding:16px;border:1px solid #d2be86;border-radius:14px;background:#f7fbf5';
    const title=text('strong','Pengesahan OTP Ibu Bapa');
    const label=text('label','Kod OTP 6 digit (e-mel berdaftar)');label.htmlFor='upkk-parent-otp-code';label.className='form-lbl';
    const code=document.createElement('input');code.id='upkk-parent-otp-code';code.className='form-inp';code.type='text';code.inputMode='numeric';code.maxLength=6;code.autocomplete='one-time-code';
    const verify=document.createElement('button');verify.type='button';verify.className='btn btn-green';verify.textContent='Sahkan OTP';verify.addEventListener('click',confirm);
    const msg=text('p','');msg.id='upkk-parent-otp-msg';msg.setAttribute('role','status');msg.style.marginTop='10px';
    p.append(title,label,code,verify,msg);login.append(p);return p;
  }
  async function begin(rawEmail,rawPin){
    if(!enabled)return;
    if(busy)return;
    const e=String(rawEmail||'').trim().toLowerCase(),p=String(rawPin||'').trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)||!/^\d{6}$/.test(p)){
      if(typeof showErr==='function')showErr('err-login','Masukkan e-mel dan enam digit terakhir telefon yang sah.');return;
    }
    reset();email=e;pin=p;const n=++epoch;busy=true;panel().hidden=false;message('Memohon kod OTP...');
    try{
      const r=await rpc('requestParentV2Otp',[e,p]);if(n!==epoch)return;
      message(r&&r.message?r.message:'Sila semak e-mel berdaftar.');
    }catch(_){if(n===epoch)message('Perkhidmatan OTP tidak tersedia. Cuba kemudian.');}
    finally{if(n===epoch)busy=false;}
  }
  async function confirm(){
    if(busy||!email||!pin)return;
    const otp=String($('upkk-parent-otp-code')?.value||'').trim();
    if(!/^\d{6}$/.test(otp)){message('Masukkan kod OTP enam digit.');return;}
    const n=epoch;busy=true;message('Mengesahkan OTP...');
    try{
      const r=await rpc('verifyParentV2Otp',[email,pin,otp]);if(n!==epoch)return;
      if(!r||r.success!==true||!/^[0-9a-f]{64}$/i.test(r.sessionToken||'')){message(r?.message||'Pengesahan OTP gagal.');return;}
      token=r.sessionToken;verified=true;expiresAt=Date.now()+Math.min(1800,Number(r.expiresIn)||1800)*1000;const reply=await rpc('getUnifiedParentV2',[token]);if(n!==epoch)return;
      if(!reply||reply.success!==true||!Array.isArray(reply.children))throw Error('No authorised records');
      children=reply.children;message('OTP disahkan.');
      const legacy=children.filter(x=>x.session==='2026'&&x.source==='LEGACY');
      if(legacy.length){
        // Only after verified OTP; Legacy remains the authority for monthly fees/receipts.
        hasLegacy=true;allowLegacy=true;doLogin();
      }else{
        hasLegacy=false;createReadonlyParent();showSession('2027');
      }
    }catch(_){if(n===epoch)message('Rekod tidak dapat disahkan. Tiada akses diberikan.');}
    finally{if(n===epoch)busy=false;}
  }
  function createReadonlyParent(){
    // Data is received from server-authorised token, not localStorage.
    if(!hasVerifiedSession())return;
    S.user={role:'parent',email,namaIbuBapa:'Penjaga berdaftar',anak:[{namaMurid:'Rekod sesi 2027',tarikhDaftar:''}]};
    S.anakIdx=0;S.dashboard={};S.paymentSession='2027';S.dashboardRequest++;
  }
  function onLegacySuccess(res){
    hasLegacy=hasVerifiedSession()&&res.role==='parent';
    const p=$('upkk-parent-otp-panel');if(p)p.hidden=true;
    if(hasLegacy)renderVerifiedSessions('2026');
  }
  let nativeChildIndex=0;
  function renderVerifiedSessions(session){
    const sel=$('d-session-selector');if(!sel)return;
    sel.replaceChildren();sel.style.display='flex';
    for(const year of ['2026','2027']){
      const button=text('button','Sesi '+year);
      button.type='button';button.className='anak-pill'+(year===session?' active':'');
      button.addEventListener('click',()=>showSession(year));sel.append(button);
    }
  }
  function readonlyView(session){
    if(!hasVerifiedSession())return;
    S.paymentSession=session;S.dashboardRequest++;S.dashboard={};
    const approved=children.filter(x=>x.session===session&&(session==='2026'?x.source==='LEGACY':x.source==='NATIVE'));
    const child=approved[nativeChildIndex]||approved[0]||null;
    $('d-penjaga').textContent=(S.user&&S.user.namaIbuBapa)||'Penjaga berdaftar';
    $('d-murid').textContent=child?String(child.studentName||'Murid'):'Tiada rekod '+session;
    $('d-sub').textContent='Paparan berdasarkan identiti disahkan melalui OTP';
    $('d-daftar').textContent='Paparan baca sahaja';
    const picker=$('d-anak-selector');
    if(picker){
      picker.replaceChildren();picker.style.display=approved.length>1?'flex':'none';
      if(approved.length>1){
        const label=text('label','Pilih anak: ');
        const select=document.createElement('select');select.className='form-inp';
        approved.forEach((item,index)=>{
          const opt=document.createElement('option');opt.value=String(index);
          opt.textContent=String(item.studentName||'Murid '+(index+1));
          select.append(opt);
        });
        select.value=String(child?approved.indexOf(child):0);
        select.addEventListener('change',()=>{nativeChildIndex=Number(select.value)||0;readonlyView(session);});
        label.append(select);picker.append(label);
      }
    }
    renderVerifiedSessions(session);
    const summary=$('d-summary');summary.replaceChildren();
    const detail=child && session==='2027'
      ? 'Pendaftaran 2027: DILULUSKAN | Yuran pendaftaran direkod: RM'+(Number(child.registrationPaid)||0).toFixed(2)
        +' | Yuran bulan pertama direkod: RM'+(Number(child.firstMonthPaid)||0).toFixed(2)
        +' | Status bulan pertama: '+String(child.firstMonthStatus||'Belum tersedia')
      : 'Tiada rekod sesi '+session+' yang disahkan.';
    summary.append(text('p',detail));
    const grid=$('yg');grid.replaceChildren();
    const months=['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogos','Sep','Okt','Nov','Dis'];
    for(const month of months){
      const card=document.createElement('div');card.className='yc na';
      const heading=text('div',month);heading.className='ym';
      const state=text('span','BELUM TERSEDIA');state.className='ybadge b-na';
      card.append(heading,state);grid.append(card);
    }
    const note=text('p',child
      ? 'Status bayaran bulanan 2027 belum disediakan oleh backend. Kad di atas bukan tuntutan tunggakan atau pengesahan bayaran.'
      : 'Tiada rekod '+session+' yang diluluskan bagi identiti ini. Tiada bayaran boleh dibuat melalui paparan ini.');
    note.style.cssText='grid-column:1/-1;font-size:13px;padding:8px 0';grid.append(note);
    document.getElementById('page-dashboard')?.classList.add('upkk-otp-unified-view');
    const title=grid.previousElementSibling;
    if(title&&title.classList.contains('sec-ttl'))title.textContent='Status Yuran Jan–Dis '+session;
    if(typeof showPage==='function')showPage('page-dashboard');
  }
  function showSession(session){
    if(!enabled||!['2026','2027'].includes(session)||!hasVerifiedSession())return;
    if(session==='2026'&&hasLegacy&&S.user&&S.user.anak&&S.user.anak.length){
      const dash=$('page-dashboard');if(dash)dash.classList.remove('upkk-otp-unified-view');
      const title=$('yg')?.previousElementSibling;if(title&&title.classList.contains('sec-ttl'))title.textContent='Status Yuran Jan–Dis 2026';
      S.paymentSession='2026';const child=S.user.anak[S.anakIdx]||S.user.anak[0];
      loadDashboard(S.user.email,child.namaMurid||'',child.tarikhDaftar||'');return;
    }
    readonlyView(session);
  }
  function onLegacyFailure(){
    if(!hasVerifiedSession())return false;
    // If Native OTP is valid but Legacy login cannot retrieve rows, preserve
    // a safe read-only view rather than allowing unauthorised Legacy payment actions.
    createReadonlyParent();showSession(children.some(x=>x.session==='2027')?'2027':'2026');return true;
  }
  if(enabled){
    const style=document.createElement('style');style.textContent='#page-dashboard.upkk-otp-unified-view .act-row,#page-dashboard.upkk-otp-unified-view .parent-side-nav,#page-dashboard.upkk-otp-unified-view .info-band,#page-dashboard.upkk-otp-unified-view .legend{display:none!important}';document.head.append(style);
  }
  window.UPKK_PARENT_OTP_UNIFIED=Object.freeze({enabled,begin,reset,consumeLegacyLoginApproval,hasVerifiedSession,onLegacySuccess,onLegacyFailure,showSession});
})();
