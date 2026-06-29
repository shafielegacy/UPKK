const assert = require('assert');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (err) {
    console.error(`not ok - ${name}`);
    console.error(err.stack || err.message);
    process.exitCode = 1;
  }
}

test('admin dashboard has an action panel for immediate follow-up context', () => {
  assert.match(html, /id="adm-action-panel"/);
  assert.match(html, /id="adm-current-month"/);
  assert.match(html, /id="adm-action-belum"/);
  assert.match(html, /id="adm-action-tiada"/);
  assert.match(html, /id="adm-action-sebahagian"/);
  assert.match(html, /Tumpuan Susulan/);
  assert.match(html, /Belum = murid aktif bulan ini tolak eBayar dan bulan daftar/);
});

test('admin monthly cards can drill into filtered payment lists', () => {
  assert.match(html, /function openAdminMonth/);
  assert.match(html, /data-month=/);
  assert.match(html, /onclick="openAdminMonth/);
});

test('admin dashboard explains the meaning of monthly figures', () => {
  assert.match(html, /Dikira selesai/);
  assert.match(html, /eBayar/);
  assert.match(html, /\+ \$\{daftar\} daftar/);
  assert.match(html, /Belum/);
  assert.match(html, /Progress/);
});

test('admin sync copy says synced names are students who still need payment', () => {
  assert.match(html, /nama murid yang masih perlu bayar/i);
  assert.match(html, /Nama perlu bayar/);
});

test('admin sync uses a longer timeout than normal dashboard calls', () => {
  assert.match(html, /function gasCall\(fn, args, onOk, onFail, options\)/);
  assert.match(html, /gasApiFetch\(fn, args, options && options\.timeoutMs\)/);
  assert.match(html, /gasCall\('syncMuridToForms', \[\],/);
  assert.match(html, /timeoutMs:\s*90000/);
});

test('admin sync popup shows names updated in each eBayar form', () => {
  const code = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
  assert.match(code, /names:\s*namaList/);
  assert.match(code, /key:\s*key/);
  assert.match(html, /id="mod-sync-result"/);
  assert.match(html, /id="sync-modal-body"/);
  assert.match(html, /function openSyncResultModal/);
  assert.match(html, /function renderSyncMonthDetails/);
  assert.match(html, /data-sync-month/);
  assert.match(html, /sync-name-list/);
  assert.match(html, /Nama dikemaskini/);
});

test('admin dashboard animates numeric values when refreshed', () => {
  assert.match(html, /function animateNumber\(/);
  assert.match(html, /function setAnimatedNumber\(/);
  assert.match(html, /prefers-reduced-motion:\s*reduce/);
  assert.match(html, /const DEFAULT_ROLL_DURATION = 1600/);
  assert.match(html, /data-count-to="\$\{selesai\}"/);
  assert.match(html, /data-count-prefix="RM"/);
  assert.match(html, /animateAdminBulanNumbers\(\)/);
});

test('admin dashboard separates eBayar and DAFTAR cash collection', () => {
  const code = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
  assert.match(code, /BAYARAN\s*:\s*findCol\('BAYARAN'/);
  assert.match(code, /totalEbayarKutipan/);
  assert.match(code, /totalDaftarKutipan/);
  assert.match(code, /jumlahEbayar/);
  assert.match(code, /jumlahDaftar/);
  assert.match(code, /const totalKutipan = totalEbayarKutipan \+ totalDaftarKutipan/);
  assert.match(html, /Jumlah Kutipan \(RM\)/);
  assert.match(html, /eBayar RM\$\{jumlahEbayar\.toFixed\(0\)\} \+ daftar RM\$\{jumlahDaftar\.toFixed\(0\)\}/);
});

test('parent dashboard uses DAFTAR payment amount for registration month', () => {
  const code = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
  assert.match(code, /jumlah\s*:\s*daftarRow \? parseBayaranAmount_\(daftarRow\[colDaftar\.BAYARAN\]\) : 0/);
  assert.match(code, /bayaranDaftar: parseBayaranAmount_\(row\[colDaftar\.BAYARAN\]\)/);
  assert.match(code, /function isYuranPertamaCoveredByDaftar_/);
  assert.match(code, /jumlah\s*:\s*daftarCoversFirstMonth \? m\.bayaranDaftar : \(y \? y\.jumlah : 0\)/);
});

test('parent dashboard also animates summary and payment amounts', () => {
  assert.match(html, /class="sum-val" data-count-to="\$\{total\.ok\}"/);
  assert.match(html, /class="sum-val" data-count-to="\$\{total\.blm\}"/);
  assert.match(html, /class="sum-val" data-count-to="\$\{total\.na\}"/);
  assert.match(html, /class="yamnt" data-count-to="\$\{d\.jumlah\}" data-count-prefix="RM"/);
});

test('admin backend treats registration count separately from payment status', () => {
  const code = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
  assert.match(code, /jumlahMurid\+\+/);
  assert.match(code, /bayar: bayarCount/);
  assert.match(code, /daftar: daftarCount/);
  assert.doesNotMatch(code, /if \(_status !== 'SELESAI'\) continue;/);
  assert.doesNotMatch(code, /safe\(row\[colDaftar\.STATUS\]\)\.toUpperCase\(\) !== 'SELESAI'/);
});
