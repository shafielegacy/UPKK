// Reproducible narrow patch against the supplied, unchanged V2 reference.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.join(__dirname,'..'),reference='review-reference/Code.gs';
const output='release/gas/Code.phase-a-preview.tmp';
const source=fs.readFileSync(path.join(root,reference),'utf8');
let candidate=source;
const edits=[
 ['const result = syncMuridToForms();','const result = legacy2026SyncPreview_();'],
 ['const result = kemasFormEbayar(bulanKey);','const result = legacy2026SyncPreview_(bulanKey);'],
 ['const colDaftar = buildColDaftar(daftarSheet);\n  const data = daftarSheet.getDataRange().getValues();\n  const muridList = [];',
  'const colDaftar = buildColDaftar(daftarSheet);\n  const sessionColumns = getDaftarColMap(daftarSheet);\n  const data = daftarSheet.getDataRange().getValues();\n  const muridList = [];'],
 ['const row = data[i];\n    const nama = normalizeNamaMurid_(row[colDaftar.NAMA_MURID]);',
  "const row = data[i];\n    if (Object.prototype.hasOwnProperty.call(sessionColumns, 'STATUS_PERMOHONAN') &&\n        String(row[sessionColumns.STATUS_PERMOHONAN] || '').trim()) continue;\n    const nama = normalizeNamaMurid_(row[colDaftar.NAMA_MURID]);"]
];
for(const [before,after] of edits){
 if(!candidate.includes(before))throw Error('Pinned V2 reference drift; stop patch generation');
 candidate=candidate.replace(before,after);
}
try{
 fs.writeFileSync(path.join(root,output),candidate);
 const diff=spawnSync('git',['diff','--no-index','--no-ext-diff','--',reference,output],{cwd:root,encoding:'utf8',windowsHide:true});
 if(diff.status!==1)throw Error(diff.stderr||'Expected a nonempty delta');
 const patch=diff.stdout.split('a/'+reference).join('a/Code.gs').split('b/'+output).join('b/Code.gs');
 fs.writeFileSync(path.join(root,'release/gas/Legacy2026PhaseA.patch'),patch);
 console.log('Prepared Legacy2026PhaseA.patch; reference untouched.');
}finally{if(fs.existsSync(path.join(root,output)))fs.unlinkSync(path.join(root,output));}
