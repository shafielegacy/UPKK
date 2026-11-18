/* UPKK SL — Native Admin 2027, shared login surface. CLOSED by default.
 * No duplicate login tab, no Legacy session writes, no plaintext password.
 */
(function(){
 'use strict';
 const cfg=window.UPKK_ADMIN_2027_CONFIG||{};
 const enabled=cfg.enabled===true&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(cfg.endpoint||'');
 if(!enabled)return;
 const googleEnabled=cfg.googleEnabled===true;
 const googleOnly=googleEnabled&&cfg.googleOnly===true;
 const googleRequestKey='upkk:admin:google:v23';
 let ticket='',token='',email='',busy=false,items=[],filter='ALL',query='';
 let monthlyEntries=[],monthlyReady=false,legacyLoaded=false,legacyData=null,activeYear='2026',activeMenu='dashboard';
 let adminPanes=null, dashboardRequest=null;
 const dashboardMenus=['dashboard','status','kutipan'];
 let googlePending=null,googleAttempt=null,preparingGoogle=false;
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
 function setBusy(value){busy=value;['native-admin-request','native-admin-verify','native-admin-refresh','native-admin-google'].forEach(id=>{const n=$(id);if(n)n.disabled=busy||(id==='native-admin-google'&&preparingGoogle);});}
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
   if(which==='otp'&&googleEnabled)void prepareAdminGoogle();
   if(which==='parent'){
     googlePending=null;
     ticket='';token='';email='';items=[];legacyData=null;legacyLoaded=false;
     monthlyReady=false;monthlyEntries=[];activeYear='2026';activeMenu='dashboard';
     dashboardRequest=null;
     for(const view of dashboardMounts2027())view.replaceChildren();
     $('native-admin-otp-code').value='';
     const adminPage=$('page-admin');
     if(adminPage)adminPage.classList.remove('native-otp-premium');
     const sel=$('native-admin-session-select');if(sel)sel.value='2026';
     const legacy=$('native-admin-legacy');
     if(legacy)legacy.hidden=false;
   }
 }

 const navItems=[
  ['dashboard','Dashboard Utama'],
  ['status','Status Bulanan'],
  ['kutipan','Kutipan per Bulan'],
  ['murid','Pengurusan Murid'],
  ['bayaran','Senarai Bayaran'],
  ['duplikat','Scan Duplikat MyKid']
 ];
 function createNavigation(){
   const body=$('admin-tab-dashboard')?.querySelector('.adm-body');
   const bar=$('page-admin')?.querySelector('.adm-tab-bar');
   if(!body||!bar||adminPanes)return;
   adminPanes={};
   const oldStats=body.querySelector('.adm-stats');
   const statusBlock=$('adm-bulan-grid')?.closest('.adm-sec');
   const chartBlock=$('adm-chart-sec');
   const oldScan=$('btn-scan-duplikat')?.closest('.adm-sec');
   const native=$('native-admin-dashboard');
   const monthly=$('native-admin-monthly');
   const listing=$('native-admin-list');
   const results=$('native-admin-results');
   const navRefresh=$('native-admin-refresh');
   const nodes=[...native?.children||[]];
   const nativeSearch=nodes.find(n=>n.querySelector?.('input[type="search"]'));
   // Route existing elements to exactly one visual panel each; IDs and handlers preserved.
   const panel=(year,menu,title)=>{
     const p=el('section');p.className='upkk-admin-view';p.id='upkk-admin-'+year+'-'+menu;
     p.setAttribute('aria-label',title);p.hidden=true;p.style.display='none';
     const heading=el('h2',title);heading.className='upkk-admin-view-title';p.append(heading);
     body.append(p);adminPanes[year+'-'+menu]=p;return p;
   };
   for(const year of ['2026','2027'])for(const [name,label] of navItems)panel(year,name,label+' · '+year);
   const put=(year,menu,node)=>{if(node)adminPanes[year+'-'+menu].append(node);};
   put('2026','dashboard',oldStats);
   put('2026','status',statusBlock);
   put('2026','kutipan',chartBlock);
   for(const menu of dashboardMenus){
     const content=el('div');
     content.id='upkk-admin-2027-'+menu+'-data';
     put('2027',menu,content);
   }
   // Existing 2027 registration workflow remains live inside Pengurusan Murid.
   if(nativeSearch)put('2027','murid',nativeSearch);
   if(navRefresh)put('2027','murid',navRefresh);
   if(results)put('2027','murid',results);
   if(listing)put('2027','murid',listing);
   // Monthly eBayar listing and approval buttons stay unchanged.
   put('2027','bayaran',monthly);
   // The 2026 OTP bridge is read-only; never expose old unauthenticated Legacy actions.
   const readonlyMessage=el('p','Senarai murid lengkap memerlukan sambungan Admin OTP berautoriti. Fungsi Legacy lama tidak dibuka dari portal ini.');
   readonlyMessage.className='upkk-admin-note';put('2026','murid',readonlyMessage);
   const monthly2026=el('div');monthly2026.id='upkk-admin-2026-rekod';
   put('2026','bayaran',monthly2026);
   for(const year of ['2026','2027']){
     const msg=el('p',year==='2026'?'Imbasan MyKid asal masih terkunci sehingga tersedia kaedah pengesahan Admin OTP di server.':'Imbasan MyKid 2027 belum disediakan dalam backend Native.');
     msg.className='upkk-admin-note';put(year,'duplikat',msg);
   }
   // Do not expose the old MyKid scan API button.
   if(oldScan){oldScan.hidden=true;oldScan.style.display='none';}
   const nativeLogout=$('native-admin-logout');if(nativeLogout)nativeLogout.remove();
   const menu=$('native-admin-menu');
   if(!menu){
     const nav=el('nav');nav.id='native-admin-menu';nav.setAttribute('aria-label','Menu dashboard Admin');
     for(const [key,label] of navItems){
       const btn=el('button',label);btn.type='button';btn.className='upkk-admin-menu-btn';
       btn.dataset.adminMenu=key;btn.addEventListener('click',()=>selectMenu(key));
       nav.append(btn);
     }
     bar.prepend(nav);
   }
 }
 function render2026Payments(){
   const holder=$('upkk-admin-2026-rekod');if(!holder)return;
   holder.replaceChildren();
   const rows=Array.isArray(legacyData?.rekod)?legacyData.rekod:[];
   if(!rows.length){holder.append(el('p','Tiada rekod bayaran untuk dipaparkan.'));return;}
   const subtitle=el('p','Rekod sejarah 2026 — bacaan sahaja, melalui pengesahan Admin OTP.');
   subtitle.className='upkk-admin-note';holder.append(subtitle);
   const search=el('input');search.type='search';search.className='form-inp';
   search.placeholder='Cari murid / bulan / status';search.setAttribute('aria-label','Cari rekod bayaran 2026');
   const results=el('div');holder.append(search,results);
   const draw=()=>{
     const q=search.value.trim().toLocaleLowerCase('ms-MY');
     results.replaceChildren();
     const found=rows.filter(x=>[x.namaMurid,x.bulanLabel,x.status,x.noResit].some(v=>String(v||'').toLocaleLowerCase('ms-MY').includes(q)));
     const count=el('p',found.length+' rekod ditemui');count.className='upkk-admin-note';results.append(count);
     for(const x of found.slice(0,100)){
       const card=el('article');card.className='upkk-admin-payment-row';
       card.append(el('strong',String(x.namaMurid||'Murid')));
       card.append(el('p',String(x.bulanLabel||'')+' · '+String(x.status||'')+' · RM'+(Number(x.jumlah)||0).toFixed(2)));
       results.append(card);
     }
     if(found.length>100)results.append(el('p','100 rekod pertama dipaparkan. Tapis carian untuk melihat rekod lain.'));
   };
   search.addEventListener('input',draw);draw();
 }
 function selectMenu(name){
   if(!token||!adminPanes)return;
   activeMenu=navItems.some(([key])=>key===name)?name:'dashboard';
   for(const [key,panel] of Object.entries(adminPanes)){
     const visible=key===activeYear+'-'+activeMenu;
     panel.hidden=!visible;panel.style.display=visible?'block':'none';
   }
   for(const button of $('native-admin-menu')?.querySelectorAll('button')||[]){
     const selected=button.dataset.adminMenu===activeMenu;
     button.classList.toggle('active',selected);
     if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
   }
   if(activeYear==='2026'&&activeMenu==='kutipan'&&legacyLoaded&&legacyData&&typeof renderChart==='function'){
     renderChart(legacyData.perBulan||[],legacyData.currentMonthNum);
   }
   if(activeYear==='2027'&&dashboardMenus.includes(activeMenu))void refreshDashboard2027();
   if(typeof window.switchAdminTab==='function')window.switchAdminTab('dashboard');
 }

 function showSession(year){
   if(!token)return;
   activeYear=year==='2027'?'2027':'2026';
   const picker=$('native-admin-session-select');if(picker)picker.value=activeYear;
   const native=$('native-admin-dashboard');if(native)native.hidden=true;
   const original=$('admin-tab-dashboard')?.querySelector('.adm-body');
   if(original)for(const node of [...original.children]){
     if(node.classList.contains('upkk-admin-view'))continue;
     node.hidden=true;node.style.display='none';
   }
   if(typeof window.showPage==='function')window.showPage('page-admin');
   selectMenu(activeMenu);
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
   if(activeMenu==='kutipan'&&typeof renderChart==='function')renderChart(data.perBulan||[],data.currentMonthNum);
   render2026Payments();
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
   const t=token;status('Memuatkan dashboard pentadbir...');
   const response=await rpc('getAdminLegacy2026ReadOnly',[t]);
   if(!token||token!==t)return;
   legacyLoaded=!!response.success;
   if(!response.success){showSession('2027');status('Data 2026 belum tersedia; memaparkan sesi 2027. '+String(response.message||''));return;}
   legacyData=response;showSession('2026');
   status('Dashboard Premium 2026 · sesi Admin disahkan.');
 }
 window.UPKKAdminStartOtp=function(prefill){
   const field=$('native-admin-email');
   if(field&&prefill)field.value=String(prefill).trim().toLowerCase();
   switchView('otp');
   if(typeof window.showPage==='function')window.showPage('page-login');
 };
 function fillList(){
   const holder=$('native-admin-list');holder.replaceChildren();
   const rejected=items.filter(x=>x.status==='REJECTED 2027');
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
       // Registration payment proof comes from Admin Native list field "slip".
       // Only allow a Google Drive file link; never insert arbitrary HTML or unsafe URLs.
       const rawProof=String(item.slip||'').trim();
       let proofUrl='';
       try{
         const parsed=new URL(rawProof);
         if(parsed.protocol==='https:' && (parsed.hostname==='drive.google.com'||parsed.hostname==='docs.google.com')
             && (parsed.pathname.startsWith('/file/')||parsed.pathname.startsWith('/open')||parsed.pathname.startsWith('/uc/')))proofUrl=parsed.href;
       }catch(_){}
       if(proofUrl){
         const proof=el('a','Lihat Bukti Transaksi','btn');
         proof.href=proofUrl;proof.target='_blank';proof.rel='noopener noreferrer';
         proof.style.cssText='display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border:1px solid #c6aa69;border-radius:12px;background:#fff9e8;color:#124d39;font-weight:700;text-decoration:none';
         group.prepend(proof);
       }else{
         const missing=el('p','Bukti transaksi belum tersedia — semak sebelum pengesahan.');
         missing.style.cssText='font-size:12px;color:#8c4c11;width:100%;margin:4px 0';
         group.prepend(missing);
       }
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

 const dashboardCurrency=new Intl.NumberFormat('ms-MY',{style:'currency',currency:'MYR'});
 const dashboardMonth=new Intl.DateTimeFormat('ms-MY',{year:'numeric',month:'short',timeZone:'Asia/Kuala_Lumpur'});
 const amount2027=cents=>dashboardCurrency.format(cents/100);
 const month2027=key=>dashboardMonth.format(new Date(key+'-01T00:00:00Z'));
 function dashboardMounts2027(){
   return dashboardMenus.map(menu=>$('upkk-admin-2027-'+menu+'-data')).filter(Boolean);
 }
 function dashboardNote2027(text){
   const note=el('p',text,'upkk-admin-note');
   note.setAttribute('role','status');
   return note;
 }
 function dashboardTiles2027(entries){
   const grid=el('div',undefined,'upkk-admin-2027-tiles');
   for(const [label,value] of entries){
     const tile=el('div',undefined,'clay upkk-admin-2027-tile');
     tile.append(el('strong',String(value)),el('span',label));
     grid.append(tile);
   }
   return grid;
 }
 function renderDashboard2027(data){
   const [main,statusPane,collectionPane]=dashboardMounts2027();
   const {counts,firstMonth,academicMonths,collections}=data;
   const years=[3,4,5].map(year=>['Tahun '+year,counts.years[year]]);
   const modes=[['Fizikal',counts.modes.FIZIKAL],['Online',counts.modes.ONLINE]];
   if(counts.years.other)years.push(['Tahun lain',counts.years.other]);
   if(counts.modes.other)modes.push(['Mod lain',counts.modes.other]);
   main.replaceChildren(dashboardTiles2027([
     ['Jumlah permohonan',counts.total],['Diluluskan',counts.approved],
     ['Menunggu semakan',counts.pending],['Ditolak',counts.rejected],
     ['Kutipan disahkan',amount2027(collections.totalCents)]
   ]),el('h3','Murid diluluskan mengikut tahun'),dashboardTiles2027(years),
      el('h3','Murid diluluskan mengikut mod'),dashboardTiles2027(modes));

   // UI-only parity with Legacy 2026: cards and progress, Native values unchanged.
   // No Legacy list calls, no fabricated RM amounts or fake clickable actions.
   const monthGrid=el('div',undefined,'adm-bulan-grid upkk-admin-2027-month-grid');
   monthGrid.setAttribute('role','list');
   monthGrid.setAttribute('aria-label','Kad status bulanan sesi 2027');
   for(const month of academicMonths){
     const settled=Number(month.settled)||0,pending=Number(month.pending)||0;
     const unpaid=Number(month.unpaid)||0,notStarted=Number(month.notStarted)||0;
     const notApplicable=Number(month.notApplicable)||0;
     const total=settled+pending+unpaid+notStarted+notApplicable;
     const pct=total?Math.round(100*settled/total):0;
     const card=el('article',undefined,'adm-bc upkk-admin-2027-month-card');
     card.setAttribute('role','listitem');
     card.setAttribute('aria-label',month2027(month.key)+': '+pct+' peratus selesai');
     const head=el('div',undefined,'adm-bc-top');
     head.append(el('strong',month2027(month.key),'adm-bc-m'),el('span','Progress '+pct+'%','adm-bc-pct'));
     const counts=el('div',undefined,'adm-bc-counts');
     for(const [label,value] of [['Selesai',settled],['Belum bayar',unpaid]]){
       const cell=el('div',undefined,'adm-bc-count');
       cell.append(el('div',label,'adm-bc-lbl'),el('div',String(value),'adm-bc-val'));
       counts.append(cell);
     }
     const progress=el('div',undefined,'adm-progress');
     progress.setAttribute('role','progressbar');
     progress.setAttribute('aria-label','Peratus selesai '+month2027(month.key));
     progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax','100');
     progress.setAttribute('aria-valuenow',String(pct));
     const bar=el('div',undefined,'adm-progress-bar');bar.style.width=pct+'%';progress.append(bar);
     const extras=el('div',undefined,'upkk-admin-2027-month-extra');
     for(const [label,value] of [['Dalam semakan',pending],['Belum bermula',notStarted],['Tak berkenaan',notApplicable]]){
       const line=el('div',undefined,'upkk-admin-2027-month-extra-row');
       line.append(el('span',label),el('strong',String(value)));extras.append(line);
     }
     card.append(head,counts,progress,extras);monthGrid.append(card);
   }
   const note=el('p','Yuran bulan pertama · '+firstMonth.settled+' selesai · '+firstMonth.unpaid+' belum selesai','upkk-admin-note');
   const helper=el('p','Progress berdasarkan status yang dipulangkan Native 2027, bukan jumlah tunggakan atau kutipan RM. Rujuk Kutipan per Bulan untuk amaun.','upkk-admin-note');
   statusPane.replaceChildren(note,helper,monthGrid);

   const chart=el('ul',undefined,'upkk-admin-2027-chart');
   chart.setAttribute('aria-label','Graf kutipan disahkan mengikut bulan kelulusan');
   const peak=Math.max(1,...collections.months.map(month=>month.registrationCents+month.monthlyCents));
   for(const month of collections.months){
     const point=el('li',undefined,'clay upkk-admin-2027-point');
     const bar=el('div',undefined,'upkk-admin-2027-bar');bar.setAttribute('aria-hidden','true');
     for(const [name,cents] of [['registration',month.registrationCents],['monthly',month.monthlyCents]]){
       const segment=el('span',undefined,'upkk-admin-2027-'+name);
       segment.style.width=(100*cents/peak)+'%';bar.append(segment);
     }
     point.append(el('strong',month2027(month.key)),bar,
       el('span','Pendaftaran '+amount2027(month.registrationCents)+' · Yuran bulanan '+amount2027(month.monthlyCents)));
     chart.append(point);
   }
   collectionPane.replaceChildren(
     dashboardTiles2027([['Pendaftaran',amount2027(collections.registrationCents)],['Yuran bulanan',amount2027(collections.monthlyCents)]]),
     el('p','Mengikut bulan kelulusan · waktu Malaysia','upkk-admin-note'),
     chart.childElementCount?chart:dashboardNote2027('Tiada kutipan bertarikh kelulusan untuk dipaparkan.')
   );
   const issues=[];
   if(collections.undatedCents)issues.push(amount2027(collections.undatedCents)+' tanpa tarikh kelulusan');
   if(collections.unallocatedCents)issues.push(amount2027(collections.unallocatedCents)+' tanpa pecahan yuran yang sepadan');
   if(collections.missingAmount)issues.push(collections.missingAmount+' rekod tanpa amaun sah');
   if(collections.duplicates)issues.push(collections.duplicates+' rekod pendua atau bayaran pertama bertindih');
   if(collections.unmatchedLedger)issues.push(collections.unmatchedLedger+' rekod ledger tanpa padanan murid atau bulan');
   if(issues.length)collectionPane.append(dashboardNote2027('Semakan rekod diperlukan · '+issues.join(' · ')));
 }
 async function refreshDashboard2027(){
   const mounts=dashboardMounts2027();
   if(!token||dashboardRequest||mounts.length!==3)return;
   const session=token,request={};
   dashboardRequest=request;
   for(const pane of mounts){
     pane.setAttribute('aria-busy','true');
     if(!pane.childElementCount)pane.append(dashboardNote2027('Memuatkan ringkasan sesi 2027...'));
   }
   try{
     const response=await rpc('getAdminV2Dashboard2027',[session]);
     if(token!==session||dashboardRequest!==request)return;
     if(!response?.success||!response.data)throw new Error('Ringkasan tidak tersedia');
     renderDashboard2027(response.data);
   }catch(_){
     if(token!==session||dashboardRequest!==request)return;
     for(const pane of mounts)pane.replaceChildren(dashboardNote2027('Ringkasan sesi 2027 tidak dapat dimuatkan. Tekan Muat Semula atau log masuk semula jika sesi tamat.'));
   }finally{
     if(dashboardRequest===request){
       dashboardRequest=null;
       for(const pane of mounts)pane.removeAttribute('aria-busy');
     }
   }
 }
 function buildNativeDashboard(container){
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
   void refreshDashboard2027();
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
 async function enterAdminSession(result,verifiedEmail){
   if(!result||!result.success||typeof result.token!=='string'||!/^[0-9a-f-]{72}$/i.test(result.token)||!verifiedEmail){
     status('Sesi Admin tidak dapat disahkan.');return;
   }
   token=result.token;email=verifiedEmail;ticket='';$('native-admin-otp-code').value='';
   try{localStorage.removeItem('upkk_session');}catch(_){}
   if(typeof S!=='undefined')S.user={success:true,role:'admin',nama:result.name||'Admin',email};
   $('page-admin')?.classList.add('native-otp-premium');
   switchView('dashboard');
   await loadLegacy2026();
 }
 function googleFallback(message){
   status(message||'Log masuk Google belum tersedia. Cuba sekali lagi atau gunakan OTP e-mel.');
   const fields=$('native-admin-otp-fields');
   if(fields)fields.hidden=false;
 }
 function loadAdminGis(){
   if(window.google?.accounts?.oauth2?.initCodeClient)return Promise.resolve();
   return new Promise((resolve,reject)=>{
     const script=document.createElement('script');
     const fail=()=>{
       clearTimeout(timeout);
       script.remove();
       reject(new Error('Google Identity Services tidak tersedia.'));
     };
     const timeout=setTimeout(fail,15000);
     script.src='https://accounts.google.com/gsi/client';
     script.async=true;
     script.onerror=fail;
     script.onload=()=>{
       if(!window.google?.accounts?.oauth2?.initCodeClient){fail();return;}
       clearTimeout(timeout);
       resolve();
     };
     document.head.append(script);
   });
 }
 async function prepareAdminGoogle(retry=false){
   const button=$('native-admin-google');
   if(!googleEnabled||!button||$('native-admin-otp').hidden||busy||token||preparingGoogle)return;
   preparingGoogle=true;
   googlePending=null;
   button.disabled=true;
   if(retry)status('Menyiapkan sesi pengesahan Google...');
   try{
     await loadAdminGis();
     const verifier=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
     const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier)));
     const challenge=btoa(String.fromCharCode(...digest)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
     const requestedAt=Date.now();
     const reply=await rpc('beginAdminGooglePopupV24',[challenge]);
     if($('native-admin-otp').hidden||token)return;
     if(!reply?.success||!/^upkk-admin-v23-[a-f0-9]{64}$/.test(reply.state||'')||
        !/^\d+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(reply.clientId||'')||
        !Number.isInteger(reply.expiresIn)||reply.expiresIn<30||reply.expiresIn>300){
       googleFallback(reply?.message);return;
     }
     googlePending={state:reply.state,clientId:reply.clientId,verifier,expiresAt:requestedAt+reply.expiresIn*1000-15000};
     if(retry)status('Sesi Google tersedia. Tekan Teruskan dengan Google.');
   }catch(_){
     if(!$('native-admin-otp').hidden&&!token)googleFallback();
   }finally{
     preparingGoogle=false;
     button.disabled=busy;
   }
 }
 function cancelAdminGoogle(attempt,message){
   if(googleAttempt!==attempt)return;
   googleAttempt=null;
   setBusy(false);
   googleFallback(message);
   void prepareAdminGoogle();
 }
 async function exchangeAdminGooglePopup(attempt,response){
   if(googleAttempt!==attempt)return;
   if(response?.error||typeof response?.code!=='string'){
     cancelAdminGoogle(attempt,'Pengesahan Google dibatalkan. Sila cuba lagi.');return;
   }
   if(Date.now()>=attempt.expiresAt){
     cancelAdminGoogle(attempt,'Sesi pengesahan Google tamat. Sila cuba lagi.');return;
   }
   googleAttempt=null;
   status('Mengesahkan akaun Admin...');
   const reply=await rpc('exchangeAdminGooglePopupV24',[attempt.state,attempt.verifier,response.code]);
   setBusy(false);
   if(!reply?.success||typeof reply.email!=='string'||!reply.email){
     googleFallback(reply?.message);
     void prepareAdminGoogle();
     return;
   }
   await enterAdminSession(reply,reply.email);
 }
 function beginAdminGoogle(){
   if(busy||token||!googleEnabled||preparingGoogle)return;
   if(!googlePending||Date.now()>=googlePending.expiresAt){
     void prepareAdminGoogle(true);return;
   }
   const attempt=googlePending;
   googlePending=null;
   googleAttempt=attempt;
   setBusy(true);
   status('Membuka pengesahan Google...');
   try{
     const client=window.google.accounts.oauth2.initCodeClient({
       client_id:attempt.clientId,scope:'openid email',include_granted_scopes:false,ux_mode:'popup',
       callback:response=>{void exchangeAdminGooglePopup(attempt,response);},
       error_callback:error=>cancelAdminGoogle(attempt,error?.type==='popup_failed_to_open'
         ?'Pelayar menyekat tetingkap Google. Benarkan pop-up dan cuba semula.'
         :'Pengesahan Google dibatalkan. Sila cuba lagi.')
     });
     client.requestCode();
   }catch(_){cancelAdminGoogle(attempt);}
 }
 // Complete V23.1 redirect attempts that were already open during the release.
 async function finishAdminGoogle(){
   let pending=null;
   try{
     const raw=sessionStorage.getItem(googleRequestKey);
     sessionStorage.removeItem(googleRequestKey);
     pending=JSON.parse(raw);
   }catch(_){}
   if(!pending||!Number.isFinite(pending.expiresAt)||Date.now()>=pending.expiresAt){
     googleFallback('Sesi pengesahan Google tamat. Sila log masuk semula.');return;
   }
   setBusy(true);
   status('Mengesahkan akaun Admin...');
   const reply=await rpc('finishAdminGoogleV23',[pending.state,pending.verifier]);
   setBusy(false);
   if(!reply||!reply.success||typeof reply.email!=='string'||!reply.email){
     googleFallback(reply?.message);return;
   }
   await enterAdminSession(reply,reply.email);
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
   await enterAdminSession(r,email);
 }
 async function logout(){
   if(busy)return;
   if(token){
     setBusy(true);
     const result=await rpc('logoutAdminV2',[token]);
     setBusy(false);
     if(!result||!result.success){
       const message='Log keluar belum dapat disahkan. Cuba lagi.';
       if(typeof window.toast==='function')window.toast(message);else window.alert(message);
       return;
     }
   }
   try{sessionStorage.removeItem(googleRequestKey);}catch(_){}
   switchView('parent');
   if(typeof window.doLogout==='function')window.doLogout();
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
   if(googleEnabled)otp.append(makeButton('Teruskan dengan Google','native-admin-google',beginAdminGoogle));
   const otpFields=el('div');otpFields.id='native-admin-otp-fields';otpFields.hidden=googleOnly;
   otpFields.append(makeField('E-mel Admin','email','native-admin-email'));
   otpFields.append(makeButton('Hantar OTP','native-admin-request',requestOtp));
   otpFields.append(makeField('Kod OTP 6 Digit','text','native-admin-otp-code'));
   otpFields.append(makeButton('Sahkan OTP','native-admin-verify',verifyOtp));
   otp.append(otpFields);
   otp.append(makeButton('Kembali ke Log Masuk Ibu Bapa','native-admin-parent',logout));
   const dashboard=el('div');dashboard.id='native-admin-dashboard';dashboard.hidden=true;
   buildNativeDashboard(dashboard);
   // The 2027 records and monthly payments are inserted into the ORIGINAL premium dashboard body.
   const adminBody=$('admin-tab-dashboard')?.querySelector('.adm-body');
   if(!adminBody)throw new Error('Original Admin premium dashboard not found');
   adminBody.append(dashboard);
   const readonly=el('p','Sesi 2026: ringkasan melalui sesi Admin (read-only). Fungsi Legacy yang belum mempunyai kawalan token tidak dibuka.');
   readonly.id='native-admin-legacy-readonly';readonly.style.cssText='font-size:12px;margin:12px 0;color:#58705e';
   adminBody.prepend(readonly);
   createNavigation();
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
     event.preventDefault();event.stopImmediatePropagation();
     if(activeYear==='2027')void refreshDashboard2027();
     else loadLegacy2026();
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
   const url=new URL(location.href);
   if(url.searchParams.get('admin')==='1'){
     if(typeof window.showPage==='function')window.showPage('page-login');
     switchView('otp');
     if(googleEnabled&&url.searchParams.get('google_admin_return')==='1'){
       url.searchParams.delete('google_admin_return');
       history.replaceState(history.state,'',url.href);
       void finishAdminGoogle();
     }
   }
 });
})();
