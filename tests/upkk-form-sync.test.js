const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadCodeGs() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
  const context = {
    console,
    Logger: { log() {} },
    Utilities: { formatDate() { return ''; }, sleep() {} },
    ContentService: {
      createTextOutput() { return { setMimeType() { return this; } }; },
      MimeType: { JSON: 'application/json' }
    },
    HtmlService: {
      createHtmlOutputFromFile() { return { setTitle() { return this; }, setXFrameOptionsMode() { return this; }, addMetaTag() { return this; } }; },
      XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' }
    }
  };

  vm.createContext(context);
  vm.runInContext(`${code}
this.__upkkTest = {
  normalizeNamaMurid_,
  splitMuridNames,
  getDaftarBulanFromMs_,
  getTabYuranName_,
  parseBayaranAmount_,
  isYuranPertamaCoveredByDaftar_,
  buildEbayarChoices_
};`, context);
  return context.__upkkTest;
}

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

const helpers = loadCodeGs();

test('normalizes case and repeated spaces before comparing names', () => {
  assert.strictEqual(
    helpers.normalizeNamaMurid_('Adam  Qayyum Bin Mohd Shalam '),
    helpers.normalizeNamaMurid_('ADAM QAYYUM BIN MOHD SHALAM')
  );
});

test('uses the live spreadsheet tab name for Julai', () => {
  assert.strictEqual(helpers.getTabYuranName_('JUL'), 'UPKK JULAI 2026');
});

test('parses registration payment amounts from DAFTAR UPKK', () => {
  assert.strictEqual(helpers.parseBayaranAmount_('RM80'), 80);
  assert.strictEqual(helpers.parseBayaranAmount_('RM 1,200'), 1200);
  assert.strictEqual(helpers.parseBayaranAmount_(40), 40);
  assert.strictEqual(helpers.isYuranPertamaCoveredByDaftar_(80), true);
  assert.strictEqual(helpers.isYuranPertamaCoveredByDaftar_(40), false);
});

test('splits one payment submission into multiple student names', () => {
  assert.deepStrictEqual(
    Array.from(helpers.splitMuridNames('MURID A, MURID B')),
    ['MURID A', 'MURID B']
  );
});

test('detects registration month for auto-paid first month', () => {
  assert.strictEqual(
    helpers.getDaftarBulanFromMs_(new Date(2026, 5, 27).getTime()),
    6
  );
  assert.strictEqual(
    helpers.getDaftarBulanFromMs_(new Date(2025, 11, 10).getTime()),
    0
  );
});

test('excludes names already paid even when payment cell contains multiple names', () => {
  const cutoff = new Date(2026, 5, 30, 23, 59, 59).getTime();
  const muridList = [
    { nama: 'ADAM QAYYUM BIN MOHD SHALAM', ts: new Date(2025, 11, 10).getTime(), status: 'SELESAI' },
    { nama: 'MUHAMMAD IMAN ADHA BIN NOOR SHAM', ts: new Date(2025, 11, 3).getTime(), status: 'SELESAI' },
    { nama: 'AISYAH BINTI MOHAMED MUSTANIR', ts: new Date(2026, 5, 27).getTime(), status: 'SELESAI' }
  ];
  const paidNameCells = [
    'Adam  Qayyum Bin Mohd Shalam, MUHAMMAD IMAN ADHA BIN NOOR SHAM'
  ];

  assert.deepStrictEqual(
    helpers.buildEbayarChoices_(muridList, paidNameCells, cutoff),
    ['AISYAH BINTI MOHAMED MUSTANIR']
  );
});

test('keeps registration month names unless registration payment covers the first month', () => {
  const cutoff = new Date(2026, 5, 30, 23, 59, 59).getTime();
  const muridList = [
    { nama: 'MURID DAFTAR MEI', ts: new Date(2026, 4, 10).getTime(), status: 'SELESAI', daftarBulan: 5, bayaranDaftar: 80 },
    { nama: 'MURID DAFTAR JUN RM40', ts: new Date(2026, 5, 10).getTime(), status: 'SELESAI', daftarBulan: 6, bayaranDaftar: 40 },
    { nama: 'MURID DAFTAR JUN RM80', ts: new Date(2026, 5, 11).getTime(), status: 'SELESAI', daftarBulan: 6, bayaranDaftar: 80 }
  ];

  assert.deepStrictEqual(
    helpers.buildEbayarChoices_(muridList, [], cutoff, 6),
    ['MURID DAFTAR JUN RM40', 'MURID DAFTAR MEI']
  );
});

test('excludes students registered after the month cutoff', () => {
  const cutoff = new Date(2026, 0, 31, 23, 59, 59).getTime();
  const muridList = [
    { nama: 'MURID JANUARI', ts: new Date(2026, 0, 10).getTime(), status: 'SELESAI' },
    { nama: 'MURID JUN', ts: new Date(2026, 5, 10).getTime(), status: 'SELESAI' }
  ];

  assert.deepStrictEqual(
    helpers.buildEbayarChoices_(muridList, [], cutoff),
    ['MURID JANUARI']
  );
});
