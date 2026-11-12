'use strict';
(()=>{
 const tabs=[...document.querySelectorAll('[data-v2-tab]')];
 function pick(name){
  for(const t of tabs){const active=t.dataset.v2Tab===name;t.classList.toggle('is-active',active);t.setAttribute('aria-selected',String(active));}
  document.getElementById('v2-parent-area').hidden=name!=='parent';
  document.getElementById('v2-admin-area').hidden=name!=='admin';
 }
 tabs.forEach(t=>t.addEventListener('click',()=>pick(t.dataset.v2Tab)));
 pick('parent');
})();
