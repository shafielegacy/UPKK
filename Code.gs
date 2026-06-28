// =============================================
// SISTEM UPKK — SKA PAYA RUMPUT 2026
// =============================================

const SPREADSHEET_ID  = '1pHzToTNZBBvER7zk9XyQUwdl2f_XXDdpX-fEFml_UJg';
const FORM_ID         = '1lmJM6GAFmXIHb2GD4XzEPymq47PEvIkPmwzAvVqzWeM'; // DAFTAR KELAS UPKK BAHASA ARAB 2026 (eDaftar)
const TEMPLATE_RESIT  = '1lF6PjR-dxNT6xhVGcmha2wtXcRUx9xkJPOHGbgIOXMY';
const TEMPLATE_DAFTAR = '1zPnyAQx7MEESNMgNqMWdZS-SNw43tdMGX-DLYAF3CoI';

const TAB = {
  DAFTAR : 'DAFTAR UPKK',
  JAN    : 'UPKK JAN 2026',
  FEB    : 'UPKK FEB 2026',
  MAC    : 'UPKK MAC 2026',
  APRIL  : 'UPKK APRIL 2026',
  MEI    : 'UPKK MEI 2026',
  JUN    : 'UPKK JUN 2026',
  JUL    : 'UPKK JULAI 2026',
  OGOS   : 'UPKK OGOS 2026',
  SEPT   : 'UPKK SEPT 2026',
  OKT    : 'UPKK OKT 2026',
  NOV    : 'UPKK NOV 2026',
  DIS    : 'UPKK DIS 2026'
};

const COL_DAFTAR = {
  TIMESTAMP    : 0,
  EMAIL        : 1,
  NAMA_PENJAGA : 2,
  NAMA_MURID   : 3,
  NO_MYKID     : 4,
  UMUR         : 5,
  NO_TELEFON   : 6,
  ALAMAT       : 7,
  RESIT_UPLOAD : 8,
  NO_RESIT     : 9,
  STATUS       : 10
};

const COL_YURAN = {
  TIMESTAMP    : 0,
  EMAIL        : 1,
  NAMA_MURID   : 2,
  BULAN        : 3,
  TAHUN        : 4,
  TARIKH_BAYAR : 5,
  JUMLAH       : 6,
  RESIT_UPLOAD : 7,
  NO_RESIT     : 8,
  STATUS       : 9,
  MERGED_ID    : 10,
  MERGED_URL   : 11,
  MERGED_LINK  : 12,
  MERGE_STATUS : 13
};

const TAB_SYNC_LOG = 'SYNC_LOG';

const TAB_ADMIN = 'ADMIN UPKK';
const COL_ADMIN = {
  EMAIL    : 0,  // Column A
  PASSWORD : 1,  // Column B — exact match, bukan 6-digit
  NAMA     : 2   // Column C
};

const FORM_EDIT_IDS = {
  JAN:   '1g3pHRPg_X1s6Vjd5S5LvaqO0Wobc44IQ-VGu_W6mNqA',
  FEB:   '1OGzT_PlDW3NqALk8bJTRZ7zwr-0kazNW5VEjhoOCME4',
  MAC:   '15m5ZGzyegkiNHO_ic19hDSCckntuDzMtydyOkdUaMnA',
  APRIL: '1bfKOg0WVle99zyC6KiibLWcd9s4Sg-5pJPmvRqr9TRE',
  MEI:   '10aL6wUnh-0GzEIq28t_mpIFr2-VrADRpRF3V8UXv9oo',
  JUN:   '1K-CY3tkA2e-qb127F7I1IXEFR7iPkaqZXjIDKTdkslM', // YURAN UPKK JUN 2026 - confirmed correct
  JUL:   '18VXX05uULhbepvVSewDRrPg4m7_MSoeyFKODZH9uGVQ',
  OGOS:  '1aBwfo0IGoSxPRp5CKnEahRxeApax0MZKN4IEiaPb9LE',
  SEPT:  '1yR7XMG8HBgjktVGGoGKrPKKZGuTk_7LWaEMC3GUQx3M',
  OKT:   '1EDFlLcobfE368EbJD-NCsuCFDvHynR7coedOcEuyW6E',
  NOV:   '1pBza3EwF3fr5rsclSeVXro8A08Fo7QsfV_WAZ6kjPaQ',
  DIS:   '1Ih6uk-Xn7CQT5R6LlNZXCugyhzjdbZYQryacSh9PkTg'
};

const CUTOFF_MS = {
  JAN:   new Date(2026, 0, 31, 23, 59, 59).getTime(),
  FEB:   new Date(2026, 1, 28, 23, 59, 59).getTime(),
  MAC:   new Date(2026, 2, 31, 23, 59, 59).getTime(),
  APRIL: new Date(2026, 3, 30, 23, 59, 59).getTime(),
  MEI:   new Date(2026, 4, 31, 23, 59, 59).getTime(),
  JUN:   new Date(2026, 5, 30, 23, 59, 59).getTime(),
  JUL:   new Date(2026, 6, 31, 23, 59, 59).getTime(),
  OGOS:  new Date(2026, 7, 31, 23, 59, 59).getTime(),
  SEPT:  new Date(2026, 8, 30, 23, 59, 59).getTime(),
  OKT:   new Date(2026, 9, 31, 23, 59, 59).getTime(),
  NOV:   new Date(2026, 10, 30, 23, 59, 59).getTime(),
  DIS:   new Date(2026, 11, 31, 23, 59, 59).getTime()
};

const BULAN_NUM = {
  JAN: 1, FEB: 2, MAC: 3, APRIL: 4, MEI: 5, JUN: 6,
  JUL: 7, OGOS: 8, SEPT: 9, OKT: 10, NOV: 11, DIS: 12
};

// ─────────────────────────────────────────────
// formatTarikh(val) — format Date object → DD/MM/YYYY
// ─────────────────────────────────────────────
function formatTarikh(val) {
  if (!val) return '';
  const d = (val instanceof Date) ? val : new Date(val);
  if (isNaN(d.getTime())) return String(val).trim();
  return Utilities.formatDate(d, 'Asia/Kuala_Lumpur', 'dd/MM/yyyy');
}

// ─────────────────────────────────────────────
// getCurrentMonthNum() — bulan semasa (1-12), skop tahun 2026
// ─────────────────────────────────────────────
function getCurrentMonthNum() {
  return new Date().getMonth() + 1;
}

// ─────────────────────────────────────────────
// splitMuridNames(cellValue) — split nama gabungan (koma) kepada array
// Guna bila satu submission eBayar mengandungi lebih satu nama murid
// ─────────────────────────────────────────────
function splitMuridNames(cellValue) {
  return (cellValue || '').toString().split(',')
    .map(n => n.trim())
    .filter(n => n.length > 0);
}

function normalizeNamaMurid_(val) {
  return (val === null || val === undefined) ? '' : String(val).trim().replace(/\s+/g, ' ').toUpperCase();
}

function getDaftarBulanFromMs_(ms) {
  if (!ms || ms <= 0) return 0;
  const d = new Date(ms);
  if (isNaN(d.getTime()) || d.getFullYear() < 2026) return 0;
  return d.getMonth() + 1;
}

function getTabYuranName_(bulanKey) {
  const key = (bulanKey || '').toString().trim().toUpperCase();
  return TAB[key] || '';
}

function parseDateMs_(val) {
  if (!val) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (val instanceof Date) return isNaN(val.getTime()) ? 0 : val.getTime();

  const s = String(val).trim();
  const mDMY = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (mDMY) {
    const d = new Date(parseInt(mDMY[3], 10), parseInt(mDMY[2], 10) - 1, parseInt(mDMY[1], 10));
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }

  const d = new Date(s);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function readMuridListFromDaftar_(daftarSheet) {
  const colDaftar = buildColDaftar(daftarSheet);
  const data = daftarSheet.getDataRange().getValues();
  const muridList = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const nama = normalizeNamaMurid_(row[colDaftar.NAMA_MURID]);
    if (!nama) continue;
    muridList.push({
      nama,
      ts: parseDateMs_(row[colDaftar.TIMESTAMP]),
      status: normalizeNamaMurid_(row[colDaftar.STATUS]),
      daftarBulan: getDaftarBulanFromMs_(parseDateMs_(row[colDaftar.TIMESTAMP]))
    });
  }

  return muridList;
}

function getPaidNameCellsForBulan_(ss, bulanKey) {
  const tabNama = getTabYuranName_(bulanKey);
  if (!tabNama) return [];

  const paidNameCells = [];
  try {
    const yuranSheet = ss.getSheetByName(tabNama);
    if (!yuranSheet || yuranSheet.getLastRow() <= 1) return paidNameCells;

    const data = yuranSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const namaCell = data[i][COL_YURAN.NAMA_MURID];
      const status = normalizeNamaMurid_(data[i][COL_YURAN.STATUS]);
      if (namaCell && status === 'SELESAI') paidNameCells.push(String(namaCell));
    }
  } catch (err) {
    Logger.log('[getPaidNameCellsForBulan_] Error baca tab yuran ' + bulanKey + ': ' + err.message);
  }

  return paidNameCells;
}

function buildEbayarChoices_(muridList, paidNameCells, cutoffMs, bulanNum) {
  const dahBayarSet = {};
  (paidNameCells || []).forEach(function(cell) {
    splitMuridNames(cell).forEach(function(n) {
      const norm = normalizeNamaMurid_(n);
      if (norm) dahBayarSet[norm] = true;
    });
  });

  return (muridList || [])
    .filter(function(m) {
      const nama = normalizeNamaMurid_(m && m.nama);
      const status = normalizeNamaMurid_(m && m.status);
      const ts = parseDateMs_(m && m.ts);
      const daftarBulan = parseInt((m && m.daftarBulan) || 0, 10);
      if (!nama || status !== 'SELESAI') return false;
      if (!ts || (cutoffMs && ts > cutoffMs)) return false;
      if (bulanNum && daftarBulan === bulanNum) return false;
      return !dahBayarSet[nama];
    })
    .map(function(m) { return normalizeNamaMurid_(m.nama); })
    .sort();
}

function setNamaMuridChoices_(checkboxItem, namaList) {
  const choices = namaList && namaList.length
    ? namaList
    : ['TIADA MURID BELUM BAYAR'];
  checkboxItem.setChoiceValues(choices);
}

// ─────────────────────────────────────────────
// getDaftarColMap / buildColDaftar — lookup kolum DAFTAR UPKK secara dinamik
// supaya soalan baru dalam Form eDaftar tidak rosakkan sistem
// ─────────────────────────────────────────────
function getDaftarColMap(sheet) {
  const lastCol   = sheet.getLastColumn();
  const headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const map = {};
  headerRow.forEach((h, i) => {
    const key = String(h || '').trim();
    if (key) map[key] = i;
  });
  return map;
}

function buildColDaftar(sheet) {
  const map = getDaftarColMap(sheet);
  function findCol(headerName, fallbackIdx) {
    if (map.hasOwnProperty(headerName)) return map[headerName];
    Logger.log('[buildColDaftar] Header "' + headerName + '" tidak dijumpai '
      + 'dalam baris 1 DAFTAR UPKK — guna fallback index ' + fallbackIdx
      + '. Sila semak struktur sheet jika ada perubahan pada Form eDaftar.');
    return fallbackIdx;
  }
  return {
    TIMESTAMP    : findCol('Timestamp',                          COL_DAFTAR.TIMESTAMP),
    EMAIL        : findCol('Email address',                      COL_DAFTAR.EMAIL),
    NAMA_PENJAGA : findCol('NAMA PENJAGA (SAMA SEPERTI MYKAD)', COL_DAFTAR.NAMA_PENJAGA),
    NAMA_MURID   : findCol('NAMA MURID (SAMA SEPERTI MYKID)',   COL_DAFTAR.NAMA_MURID),
    NO_MYKID     : findCol('NO. MYKID',                         COL_DAFTAR.NO_MYKID),
    UMUR         : findCol('UMUR',                              COL_DAFTAR.UMUR),
    NO_TELEFON   : findCol('NO. TELEFON',                       COL_DAFTAR.NO_TELEFON),
    ALAMAT       : findCol('ALAMAT PENUH TEMPAT TINGGAL',       COL_DAFTAR.ALAMAT),
    RESIT_UPLOAD : findCol('MUAT NAIK RESIT BAYARAN',           COL_DAFTAR.RESIT_UPLOAD),
    NO_RESIT     : findCol('NO RESIT',                          COL_DAFTAR.NO_RESIT),
    STATUS       : findCol('STATUS',                            COL_DAFTAR.STATUS),
    MERGED_URL   : findCol('Merged Doc URL - DAFTAR UPKK 2026', 13)
  };
}

// ─────────────────────────────────────────────
// Web App entry point
// ─────────────────────────────────────────────
function doGet(e) {
  // Jika ada parameter ?action=..., handle sebagai JSONP API (dari GitHub Pages)
  const action = e && e.parameter && e.parameter.action;
  if (action) return _handleApi(action, e.parameter);

  // Biasa: serve index.html
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('eSemak UPKK — SKA Paya Rumput 2026')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    return _handleApi(body.action, body);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'doPost ralat: ' + err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function _handleApi(action, params) {
  try {
    let result;
    switch (action) {
      case 'login':
        result = login(params.email, params.telefon);
        break;
      case 'getDashboard':
        result = getDashboard(params.email, params.namaMurid, params.tarikhDaftar);
        break;
      case 'submitBayaran':
        result = submitBayaran(JSON.parse(params.data || '{}'));
        break;
      case 'getResit':
        result = getResit(params.email, params.bulan);
        break;
      case 'getAdminDashboard':
        result = getAdminDashboard();
        break;
      case 'syncMuridToForms':
        result = syncMuridToForms();
        break;
      case 'getSenaraiByuran':
        result = getSenaraiByuran(params.bulan, params.status, params.carian);
        break;
      case 'getSenaraiMuridDaftar':
        result = getSenaraiMuridDaftar(params.carian, params.status);
        break;
      case 'testResit': {
        const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
        const tab   = params.tab || 'UPKK JAN 2026';
        const sheet = ss.getSheetByName(tab);
        if (!sheet) { result = { error: 'Tab tidak dijumpai: ' + tab }; break; }
        const data  = sheet.getDataRange().getValues();
        const rowIdx = parseInt(params.row || '1');
        result = { tab, rowIdx, totalRows: data.length, row: data[rowIdx] };
        break;
      }
      case 'getTiadaBayarDanKonsisten':
        result = getTiadaBayarDanKonsisten();
        break;
      case 'kemasFormEbayar':
        result = kemasFormEbayar(params.bulan);
        break;
      default:
        result = { success: false, message: 'Tindakan tidak dikenali: ' + action };
    }
    return apiOutput_(result, params);
  } catch (err) {
    return apiOutput_({ success: false, message: 'Ralat API: ' + err.message }, params);
  }
}

function apiOutput_(result, params) {
  const callback = params && params.callback ? String(params.callback).trim() : '';
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────
// login(email, telefon)
// Langkah 1: Semak DAFTAR UPKK (parent) — email + 6 digit terakhir telefon
// Langkah 2: Semak ADMIN UPKK (admin)   — email + password exact match
// ─────────────────────────────────────────────
function login(email, telefon) {
  // Helper: selamat convert ke string, return '' kalau null/undefined
  function safe(val) { return (val === null || val === undefined) ? '' : String(val).trim(); }

  try {
    if (!email || !telefon) return { success: false, message: 'E-mel dan kata laluan diperlukan.' };

    const ss          = SpreadsheetApp.openById(SPREADSHEET_ID);
    const emailNorm   = safe(email).toLowerCase();
    const inputDigits = safe(telefon).replace(/\D/g, '');

    // ── Langkah 1: DAFTAR UPKK — ibu bapa / penjaga ──
    try {
      const daftarSheet = ss.getSheetByName(TAB.DAFTAR);
      if (daftarSheet) {
        const colDaftar = buildColDaftar(daftarSheet);
        const data    = daftarSheet.getDataRange().getValues();
        const matches = [];
        for (let i = 1; i < data.length; i++) {
          try {
            const row = data[i];
            if (!row[colDaftar.EMAIL]) continue;
            const rowEmail    = safe(row[colDaftar.EMAIL]).toLowerCase();
            const rowTel      = safe(row[colDaftar.NO_TELEFON]).replace(/\D/g, '');
            const rowTelLast6 = rowTel.slice(-6);
            if (rowEmail !== emailNorm || rowTelLast6 !== inputDigits) continue;
            const ts = row[colDaftar.TIMESTAMP];
            matches.push({
              namaMurid   : safe(row[colDaftar.NAMA_MURID]),
              namaIbuBapa : safe(row[colDaftar.NAMA_PENJAGA]),
              tarikhDaftar: ts ? new Date(ts).toISOString() : ''
            });
          } catch (rowErr) { continue; }
        }
        if (matches.length > 0) {
          const namaIbuBapa = matches[0].namaIbuBapa;
          matches.forEach((m, i) => Logger.log('[LOGIN] anak[' + i + '] namaMurid:"' + m.namaMurid + '" tarikhDaftar:"' + m.tarikhDaftar + '"'));
          Logger.log('[LOGIN] return namaIbuBapa:"' + namaIbuBapa + '" anak:' + matches.length);
          return {
            success     : true,
            role        : 'parent',
            namaIbuBapa,
            email       : emailNorm,
            anak        : matches.map(m => ({ namaMurid: m.namaMurid, tarikhDaftar: m.tarikhDaftar }))
          };
        }
      }
    } catch (daftarErr) {
      console.log('[login] Error DAFTAR UPKK: ' + daftarErr.message);
    }

    // ── Langkah 2: ADMIN UPKK — exact match email + password ──
    try {
      const adminSheet = ss.getSheetByName(TAB_ADMIN);
      if (adminSheet) {
        const data = adminSheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          try {
            const row = data[i];
            if (!row[COL_ADMIN.EMAIL]) continue;
            const rowEmail = safe(row[COL_ADMIN.EMAIL]).toLowerCase();
            const rowPass  = safe(row[COL_ADMIN.PASSWORD]);
            if (rowEmail !== emailNorm || rowPass !== safe(telefon)) continue;
            return {
              success : true,
              role    : 'admin',
              nama    : safe(row[COL_ADMIN.NAMA]) || 'Admin UPKK',
              email   : safe(row[COL_ADMIN.EMAIL])
            };
          } catch (rowErr) { continue; }
        }
      }
    } catch (adminErr) {
      console.log('[login] Error ADMIN UPKK: ' + adminErr.message);
    }

    return { success: false, message: 'E-mel atau kata laluan tidak sepadan. Kata laluan ialah 6 digit terakhir no. telefon.' };
  } catch (err) {
    return { success: false, message: 'Ralat sistem: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// getDashboard(email)
// Return status yuran Jan-Dis 2026 untuk murid berkenaan
// ─────────────────────────────────────────────
function getDashboard(email, namaMurid, tarikhDaftar) {
  try {
    const ss            = SpreadsheetApp.openById(SPREADSHEET_ID);
    const emailNorm     = email.toString().trim().toLowerCase();
    const namaMuridNorm = namaMurid ? namaMurid.toString().trim().toLowerCase() : '';

    const BULAN_NUM = {
      JAN:1, FEB:2, MAC:3, APRIL:4, MEI:5, JUN:6,
      JUL:7, OGOS:8, SEPT:9, OKT:10, NOV:11, DIS:12
    };
    let daftarBulan = null; // 1–12

    Logger.log('[getDashboard] tarikhDaftar param: "' + tarikhDaftar + '"');

    if (tarikhDaftar) {
      try {
        const s = tarikhDaftar.toString().trim();
        let d = null;

        // Cuba DD/MM/YYYY atau DD/MM/YYYY HH:MM:SS (format Sheets Malaysia)
        const mDMY = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (mDMY) {
          d = new Date(parseInt(mDMY[3]), parseInt(mDMY[2]) - 1, parseInt(mDMY[1]));
        } else {
          // ISO string dari toISOString() — parse terus, tambah 8j untuk MYT
          d = new Date(s);
          if (!isNaN(d.getTime())) {
            d = new Date(d.getTime() + 8 * 3600 * 1000); // shift ke MYT
          }
        }

        if (d && !isNaN(d.getTime())) {
          if (d.getUTCFullYear() < 2026) {
            // Daftar sebelum 2026 — semua 12 bulan 2026 wajib, tiada N/A
            Logger.log('[getDashboard] tarikhDaftar sebelum 2026 — semua bulan aktif');
          } else {
            daftarBulan = d.getUTCMonth() + 1; // 1-based, guna UTC selepas shift
            Logger.log('[getDashboard] daftarBulan: ' + daftarBulan);
          }
        } else {
          Logger.log('[getDashboard] tarikhDaftar parse gagal: "' + s + '"');
        }
      } catch (e) {
        Logger.log('[getDashboard] tarikhDaftar exception: ' + e.message);
      }
    } else {
      Logger.log('[getDashboard] tarikhDaftar kosong — skip auto-SELESAI');
    }

    // Cari baris murid dalam DAFTAR UPKK — untuk isi data modal bulan daftar
    let daftarRow = null;
    let colDaftar = COL_DAFTAR; // fallback ke index tetap; dikemaskini bila sheet dijumpai
    if (daftarBulan) {
      try {
        const daftarSheet = ss.getSheetByName(TAB.DAFTAR);
        if (daftarSheet) {
          colDaftar = buildColDaftar(daftarSheet);
          const dd = daftarSheet.getDataRange().getValues();
          for (let i = 1; i < dd.length; i++) {
            const row = dd[i];
            if (!row[colDaftar.EMAIL]) continue;
            const rowEmail = String(row[colDaftar.EMAIL]).trim().toLowerCase();
            const rowNama  = String(row[colDaftar.NAMA_MURID] || '').trim().toLowerCase();
            if (rowEmail === emailNorm && (!namaMuridNorm || rowNama === namaMuridNorm)) {
              daftarRow = row;
              break;
            }
          }
        }
      } catch (e) {
        Logger.log('[getDashboard] Error cari daftarRow: ' + e.message);
      }
    }

    const bulanList = [
      { key: 'JAN',   label: 'Januari',   tab: TAB.JAN   },
      { key: 'FEB',   label: 'Februari',  tab: TAB.FEB   },
      { key: 'MAC',   label: 'Mac',       tab: TAB.MAC   },
      { key: 'APRIL', label: 'April',     tab: TAB.APRIL },
      { key: 'MEI',   label: 'Mei',       tab: TAB.MEI   },
      { key: 'JUN',   label: 'Jun',       tab: TAB.JUN   },
      { key: 'JUL',   label: 'Julai',     tab: TAB.JUL   },
      { key: 'OGOS',  label: 'Ogos',      tab: TAB.OGOS  },
      { key: 'SEPT',  label: 'September', tab: TAB.SEPT  },
      { key: 'OKT',   label: 'Oktober',   tab: TAB.OKT   },
      { key: 'NOV',   label: 'November',  tab: TAB.NOV   },
      { key: 'DIS',   label: 'Disember',  tab: TAB.DIS   }
    ];

    const statusYuran = {};

    for (const bulan of bulanList) {
      statusYuran[bulan.key] = {
        label: bulan.label, status: 'BELUM', jumlah: 0,
        tarikhBayar: '', noResit: '', mergedLink: ''
      };

      if (daftarBulan) {
        const bulanNum = BULAN_NUM[bulan.key];
        if (bulanNum < daftarBulan) {
          // Murid belum daftar pada bulan ini → N/A
          statusYuran[bulan.key] = {
            label: bulan.label, status: 'NA', jumlah: 0,
            tarikhBayar: '', noResit: '', mergedLink: ''
          };
          Logger.log('[getDashboard] ' + bulan.key + ' = NA (sebelum daftar)');
          continue;
        }
        if (bulanNum === daftarBulan) {
          // Bulan murid mendaftar → SELESAI automatik, isi data dari DAFTAR UPKK
          statusYuran[bulan.key] = {
            label        : bulan.label,
            status       : 'SELESAI',
            jumlah       : 0,
            tarikhBayar  : daftarRow ? formatTarikh(daftarRow[colDaftar.TIMESTAMP]) : '',
            noResit      : daftarRow ? (String(daftarRow[colDaftar.NO_RESIT] || '').trim() || 'Yuran Daftar') : 'Yuran Daftar',
            mergedLink   : daftarRow ? (String(daftarRow[colDaftar.MERGED_URL] || '').trim()) : '',
            isDaftarBulan: true
          };
          Logger.log('[getDashboard] ' + bulan.key + ' = SELESAI (bulan daftar)');
          continue;
        }
        // bulanNum > daftarBulan → check tab yuran seperti biasa
      }

      try {
        const sheet = ss.getSheetByName(bulan.tab);
        if (!sheet) { console.log('[getDashboard] Tab tidak dijumpai: ' + bulan.tab); continue; }

        const range    = sheet.getDataRange();
        const data     = range.getValues();
        const richData = range.getRichTextValues();
        for (let i = 1; i < data.length; i++) {
          const row     = data[i];
          const richRow = richData[i];
          // Primary key: NAMA MURID (fallback EMAIL kalau nama tiada)
          const rowNamaList = splitMuridNames(row[COL_YURAN.NAMA_MURID]).map(n => n.toUpperCase());
          const rowEmail     = (row[COL_YURAN.EMAIL] || '').toString().trim().toLowerCase();
          const targetNama   = namaMuridNorm ? namaMuridNorm.toUpperCase() : '';
          const isMatch      = targetNama ? rowNamaList.includes(targetNama) : rowEmail === emailNorm;
          if (!isMatch) continue;

          const status = (row[COL_YURAN.STATUS] || '').toString().trim();

          // Index 11 (MERGED_URL) mengandungi URL Google Drive sebenar
          let mergedLink = (row[COL_YURAN.MERGED_URL] || '').toString().trim();
          try {
            const rt  = richRow && richRow[COL_YURAN.MERGED_URL];
            const url = rt && rt.getLinkUrl ? rt.getLinkUrl() : null;
            if (url) mergedLink = url;
          } catch (e) {}

          console.log('[getDashboard] ' + bulan.key
            + ' | status=' + status
            + ' | rowNama=' + rowNamaList.join(', ')
            + ' | mergedLink=' + mergedLink);

          statusYuran[bulan.key] = {
            label      : bulan.label,
            status     : status || 'SELESAI',
            jumlah     : parseFloat(row[COL_YURAN.JUMLAH]) || 0,
            tarikhBayar: formatTarikh(row[COL_YURAN.TARIKH_BAYAR]),
            noResit    : (row[COL_YURAN.NO_RESIT] || '').toString().trim(),
            mergedLink : mergedLink
          };
          break;
        }
      } catch (tabErr) {
        console.log('[getDashboard] ERROR tab ' + bulan.tab + ': ' + tabErr.message);
      }
    }

    return { success: true, statusYuran };
  } catch (err) {
    return { success: false, message: 'Ralat sistem: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// submitBayaran(data)
// Terima data eBayar, append ke tab yuran bulan berkenaan
// data: { email, namaMurid, bulan, tarikhBayar, jumlah, resitUrl }
// ─────────────────────────────────────────────
function submitBayaran(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    const bulanToTab = {
      'JAN'  : TAB.JAN,   'FEB'  : TAB.FEB,  'MAC'  : TAB.MAC,
      'APRIL': TAB.APRIL, 'MEI'  : TAB.MEI,  'JUN'  : TAB.JUN,
      'JUL'  : TAB.JUL,  'OGOS' : TAB.OGOS, 'SEPT' : TAB.SEPT,
      'OKT'  : TAB.OKT,  'NOV'  : TAB.NOV,  'DIS'  : TAB.DIS
    };

    const bulanKey = data.bulan.toString().toUpperCase();
    const tabName  = bulanToTab[bulanKey];
    if (!tabName) return { success: false, message: 'Bulan tidak sah: ' + data.bulan };

    const sheet = ss.getSheetByName(tabName);
    if (!sheet) return { success: false, message: 'Tab ' + tabName + ' tidak dijumpai.' };

    // Elak pendua — semak jika email sudah ada dalam tab ini
    const existing   = sheet.getDataRange().getValues();
    const emailNorm  = data.email.toString().trim().toLowerCase();
    for (let i = 1; i < existing.length; i++) {
      const rowEmail = existing[i][COL_YURAN.EMAIL].toString().trim().toLowerCase();
      if (rowEmail === emailNorm) {
        return {
          success: false,
          message: 'Bayaran bagi bulan ' + data.bulan + ' telah pun dihantar sebelum ini. Sila hubungi admin jika ada masalah.'
        };
      }
    }

    const newRow = [
      new Date(),                        // Timestamp
      data.email,                        // Email address
      data.namaMurid,                    // NAMA PENUH MURID
      data.bulan,                        // BAYARAN YURAN BAGI BULAN
      '2026',                            // TAHUN
      data.tarikhBayar,                  // TARIKH BAYARAN DIBUAT
      parseFloat(data.jumlah) || 40,     // JUMLAH BAYARAN (RM)
      data.resitUrl || '',               // MUAT NAIK RESIT BAYARAN
      '',                                // NO RESIT (isi oleh admin)
      'SELESAI',                         // STATUS
      '', '', '', ''                     // Merged Doc fields (jana oleh admin)
    ];

    sheet.appendRow(newRow);

    return {
      success: true,
      message: 'Bayaran berjaya dihantar! Sila tunggu pengesahan daripada admin dalam masa 1–3 hari bekerja. Terima kasih.'
    };
  } catch (err) {
    return { success: false, message: 'Ralat sistem: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// getResit(email, bulan)
// Return link resit (Merged Doc Link) untuk bulan berkenaan
// ─────────────────────────────────────────────
function getResit(email, bulan) {
  try {
    const ss        = SpreadsheetApp.openById(SPREADSHEET_ID);
    const emailNorm = email.toString().trim().toLowerCase();

    const bulanToTab = {
      'JAN'  : TAB.JAN,   'FEB'  : TAB.FEB,  'MAC'  : TAB.MAC,
      'APRIL': TAB.APRIL, 'MEI'  : TAB.MEI,  'JUN'  : TAB.JUN,
      'JUL'  : TAB.JUL,  'OGOS' : TAB.OGOS, 'SEPT' : TAB.SEPT,
      'OKT'  : TAB.OKT,  'NOV'  : TAB.NOV,  'DIS'  : TAB.DIS
    };

    const tabName = bulanToTab[bulan.toString().toUpperCase()];
    if (!tabName) return { success: false, message: 'Bulan tidak sah.' };

    const sheet = ss.getSheetByName(tabName);
    if (!sheet) return { success: false, message: 'Tab ' + tabName + ' tidak dijumpai.' };

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[COL_YURAN.EMAIL]) continue;
      const rowEmail = row[COL_YURAN.EMAIL].toString().trim().toLowerCase();
      if (rowEmail === emailNorm) {
        const link = (row[COL_YURAN.MERGED_URL] || '').toString().trim();
        if (!link) {
          return {
            success: false,
            message: 'Resit untuk bulan ' + bulan + ' belum dijana oleh admin. Sila tunggu pengesahan.'
          };
        }
        return {
          success: true,
          link   : link,
          noResit: row[COL_YURAN.NO_RESIT].toString().trim()
        };
      }
    }

    return { success: false, message: 'Tiada rekod bayaran dijumpai untuk bulan ' + bulan + '.' };
  } catch (err) {
    return { success: false, message: 'Ralat sistem: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// getAdminDashboard()
// Return ringkasan semua bayaran 12 bulan untuk admin
// ─────────────────────────────────────────────
function getAdminDashboard() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    const bulanList = [
      { key: 'JAN',   num: 1,  label: 'Januari',   tab: TAB.JAN   },
      { key: 'FEB',   num: 2,  label: 'Februari',  tab: TAB.FEB   },
      { key: 'MAC',   num: 3,  label: 'Mac',       tab: TAB.MAC   },
      { key: 'APRIL', num: 4,  label: 'April',     tab: TAB.APRIL },
      { key: 'MEI',   num: 5,  label: 'Mei',       tab: TAB.MEI   },
      { key: 'JUN',   num: 6,  label: 'Jun',       tab: TAB.JUN   },
      { key: 'JUL',   num: 7,  label: 'Julai',     tab: TAB.JUL   },
      { key: 'OGOS',  num: 8,  label: 'Ogos',      tab: TAB.OGOS  },
      { key: 'SEPT',  num: 9,  label: 'September', tab: TAB.SEPT  },
      { key: 'OKT',   num: 10, label: 'Oktober',   tab: TAB.OKT   },
      { key: 'NOV',   num: 11, label: 'November',  tab: TAB.NOV   },
      { key: 'DIS',   num: 12, label: 'Disember',  tab: TAB.DIS   }
    ];

    const daftarSheet = ss.getSheetByName(TAB.DAFTAR);
    let jumlahMurid = 0;

    // Baca semua murid sekali — untuk kira BELUM cross-reference ikut murid unik
    const allMurid = [];
    if (daftarSheet) {
      const colDaftar = buildColDaftar(daftarSheet);
      const dd = daftarSheet.getDataRange().getValues();
      let _rowsWithNama = 0, _rowsBayaranSelesai = 0;
      Logger.log('[jumlahMurid] Sheet: "%s" | getLastRow=%s | dataRange rows=%s',
        daftarSheet.getName(), daftarSheet.getLastRow(), dd.length);
      for (let i = 1; i < dd.length; i++) {
        const row = dd[i];
        if (!row[colDaftar.NAMA_MURID]) continue;
        _rowsWithNama++;
        const _status = String(row[colDaftar.STATUS] || '').trim().toUpperCase();
        Logger.log('[jumlahMurid] row %s | NAMA="%s" | STATUS="%s"',
          i + 1, row[colDaftar.NAMA_MURID], _status);
        jumlahMurid++;
        if (_status === 'SELESAI') _rowsBayaranSelesai++;
        const ts = row[colDaftar.TIMESTAMP];
        const ms = (ts instanceof Date) ? ts.getTime() : (ts ? new Date(ts).getTime() : 0);
        const namaNorm = normalizeNamaMurid_(row[colDaftar.NAMA_MURID]);
        if (ms > 0 && namaNorm) {
          allMurid.push({
            nama: String(row[colDaftar.NAMA_MURID]).trim(),
            norm: namaNorm,
            tsMs: ms,
            daftarBulan: getDaftarBulanFromMs_(ms)
          });
        }
      }
      Logger.log('[jumlahMurid] DONE — rowsWithNama=%s | rowsBayaranSelesai=%s | jumlahMurid=%s',
        _rowsWithNama, _rowsBayaranSelesai, jumlahMurid);
    }

    let totalSelesai = 0, totalBelum = 0, totalKutipan = 0;
    const perBulan = [];
    const rekod    = [];

    for (const bulan of bulanList) {
      let selesai = 0, belum = 0, jumlahRM = 0;
      const paidNames = {};

      try {
        const sheet = ss.getSheetByName(bulan.tab);
        if (!sheet) { perBulan.push({ bulan: bulan.key, label: bulan.label, selesai: 0, belum: 0, jumlahRM: 0 }); continue; }

        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row[COL_YURAN.EMAIL]) continue;

          const status = (row[COL_YURAN.STATUS] || '').toString().trim().toUpperCase();
          const jumlah = parseFloat(row[COL_YURAN.JUMLAH]) || 0;

          if (status === 'SELESAI') {
            splitMuridNames(row[COL_YURAN.NAMA_MURID]).forEach(function(n) {
              const norm = normalizeNamaMurid_(n);
              if (norm) paidNames[norm] = true;
            });
            jumlahRM += jumlah;
            totalKutipan += jumlah;
          }

          rekod.push({
            bulan      : bulan.key,
            bulanLabel : bulan.label,
            email      : row[COL_YURAN.EMAIL].toString().trim(),
            namaMurid  : (row[COL_YURAN.NAMA_MURID] || '').toString().trim(),
            tarikhBayar: formatTarikh(row[COL_YURAN.TARIKH_BAYAR]),
            jumlah,
            noResit    : (row[COL_YURAN.NO_RESIT] || '').toString().trim(),
            status     : status || 'BELUM'
          });
        }
      } catch (tabErr) {
        console.log('[getAdminDashboard] ERROR tab ' + bulan.tab + ': ' + tabErr.message);
      }

      // Kira ikut murid unik: bayar dalam tab yuran atau bulan daftar dikira SELESAI.
      const wajibMurid = allMurid.filter(m => m.tsMs <= CUTOFF_MS[bulan.key]);
      const bayarCount = wajibMurid.filter(m => paidNames[m.norm]).length;
      const daftarCount = wajibMurid.filter(m => !paidNames[m.norm] && m.daftarBulan === bulan.num).length;
      selesai = bayarCount + daftarCount;
      belum = Math.max(0, wajibMurid.length - selesai);
      totalSelesai += selesai;
      totalBelum += belum;

      perBulan.push({
        bulan: bulan.key,
        label: bulan.label,
        selesai,
        belum,
        jumlahRM,
        bayar: bayarCount,
        daftar: daftarCount
      });
    }

    return { success: true, jumlahMurid, totalSelesai, totalBelum, totalKutipan, perBulan, rekod, currentMonthNum: getCurrentMonthNum() };
  } catch (err) {
    return { success: false, message: 'Ralat sistem: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// syncMuridToForms()
// Sync senarai nama murid dari DAFTAR UPKK ke 12 Google Form eBayar
// ─────────────────────────────────────────────
function syncMuridToForms() {
  const LABEL_MAP = {
    JAN:'Januari', FEB:'Februari', MAC:'Mac', APRIL:'April',
    MEI:'Mei', JUN:'Jun', JUL:'Julai', OGOS:'Ogos',
    SEPT:'September', OKT:'Oktober', NOV:'November', DIS:'Disember'
  };

  try {
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(TAB.DAFTAR);
    if (!sheet) return { success: false, message: 'Tab DAFTAR UPKK tidak dijumpai.' };
    const muridList = readMuridListFromDaftar_(sheet);

    // ── Snapshot lama dari SYNC_LOG ──
    let syncLogSheet = ss.getSheetByName(TAB_SYNC_LOG);
    if (!syncLogSheet) {
      syncLogSheet = ss.insertSheet(TAB_SYNC_LOG);
      syncLogSheet.getRange(1, 1).setValue('NAMA MURID');
    }
    const logData = syncLogSheet.getDataRange().getValues();
    const namaLamaSet = new Set();
    for (let i = 1; i < logData.length; i++) {
      const n = (logData[i][0] || '').toString().trim().toUpperCase();
      if (n) namaLamaSet.add(n);
    }
    const muridBaru = muridList
      .map(m => normalizeNamaMurid_(m.nama))
      .filter(n => !namaLamaSet.has(n.toUpperCase()));

    const bulanKeys = Object.keys(FORM_EDIT_IDS);
    let updatedForms = 0;
    const breakdown  = [];
    const errors     = [];

    for (const key of bulanKeys) {
      const formId   = FORM_EDIT_IDS[key];
      const cutoff   = CUTOFF_MS[key];
      const paidNameCells = getPaidNameCellsForBulan_(ss, key);
      const namaList = buildEbayarChoices_(muridList, paidNameCells, cutoff, BULAN_NUM[key] || 0);

      breakdown.push({ bulan: LABEL_MAP[key] || key, count: namaList.length });

      try {
        const form     = FormApp.openById(formId);
        const items    = form.getItems(FormApp.ItemType.CHECKBOX);
        Logger.log('[SYNC] ' + key + ' — form: ' + formId + ', checkbox items: ' + items.length + ', murid: ' + namaList.length);

        let updated = false;
        for (const item of items) {
          const title = item.getTitle().toUpperCase();
          if (!title.includes('NAMA') && !title.includes('MURID')) continue;
          setNamaMuridChoices_(item.asCheckboxItem(), namaList);
          updated = true;
          Logger.log('[SYNC] ' + key + ' — OK, ' + namaList.length + ' choices set');
          break;
        }

        if (updated) {
          updatedForms++;
        } else {
          Logger.log('[SYNC] ' + key + ' — tiada checkbox NAMA/MURID dijumpai');
          errors.push(key + ': tiada soalan NAMA MURID (checkbox) dalam form');
        }
      } catch (formErr) {
        Logger.log('[SYNC] ' + key + ' — form error: ' + formErr.message);
        errors.push(key + ': ' + formErr.message);
      }
    }

    // ── Kemaskini SYNC_LOG dengan nama semasa ──
    const lastLogRow = syncLogSheet.getLastRow();
    if (lastLogRow > 1) syncLogSheet.getRange(2, 1, lastLogRow - 1, 1).clearContent();
    if (muridList.length) {
      syncLogSheet.getRange(2, 1, muridList.length, 1)
        .setValues(muridList.map(m => [normalizeNamaMurid_(m.nama)]));
    }

    return {
      success   : true,
      updated   : updatedForms,
      breakdown,
      muridBaru,
      errors    : errors.length ? errors : undefined
    };
  } catch (err) {
    return { success: false, message: 'Ralat sistem: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// kemasFormEbayar(bulanKey)
// Singkir nama murid yang dah SELESAI bayar dari checkbox Google Form
// eBayar bulan berkenaan. Dipanggil oleh onEbayarUPKKSubmit() secara
// automatik, atau boleh dipanggil manual oleh admin via endpoint
// 'kemasFormEbayar'.
// ─────────────────────────────────────────────
function kemasFormEbayar(bulanKey) {
  try {
    const bulan = (bulanKey || '').toString().trim().toUpperCase();
    const tabNama = getTabYuranName_(bulan);
    const formId  = FORM_EDIT_IDS[bulan];
    const cutoff  = CUTOFF_MS[bulan];
    const bulanNum = BULAN_NUM[bulan] || 0;

    if (!tabNama) {
      Logger.log('[kemasFormEbayar] Bulan tidak dikenali: ' + bulan);
      return { success: false, message: 'Bulan tidak dikenali: ' + bulan };
    }
    if (!formId) {
      Logger.log('[kemasFormEbayar] FORM_EDIT_IDS tiada untuk: ' + bulan);
      return { success: false, message: 'Form ID tiada untuk: ' + bulan };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Langkah 1 — Kumpul nama yang SUDAH bayar (STATUS=SELESAI)
    const dahBayarSet = {};
    const paidNameCells = getPaidNameCellsForBulan_(ss, bulan);
    paidNameCells.forEach(function(cell) {
      splitMuridNames(cell).forEach(function(n) {
        const norm = normalizeNamaMurid_(n);
        if (norm) dahBayarSet[norm] = true;
      });
    });

    // Langkah 2 — Kumpul murid aktif yang layak bayar bulan ini
    const daftarSheet = ss.getSheetByName(TAB.DAFTAR);
    if (!daftarSheet) return { success: false, message: 'Tab DAFTAR UPKK tidak dijumpai.' };
    const allMurid = readMuridListFromDaftar_(daftarSheet);

    // Langkah 3 — Tolak nama yang dah bayar → senarai untuk form
    const namaUntukForm = buildEbayarChoices_(allMurid, paidNameCells, cutoff, bulanNum);

    // Langkah 4 — Update checkbox dalam Google Form
    const form  = FormApp.openById(formId);
    const items = form.getItems(FormApp.ItemType.CHECKBOX);
    let updated = false;

    for (let j = 0; j < items.length; j++) {
      const title = items[j].getTitle().toUpperCase();
      if (!title.includes('NAMA') && !title.includes('MURID')) continue;
      setNamaMuridChoices_(items[j].asCheckboxItem(), namaUntukForm);
      updated = true;
      break;
    }

    if (!updated) {
      return { success: false, message: 'Soalan NAMA MURID tidak dijumpai dalam form ' + bulan };
    }

    Logger.log('[kemasFormEbayar] ' + bulan
      + ' | totalMurid=' + allMurid.length
      + ' | dahBayar=' + Object.keys(dahBayarSet).length
      + ' | namaInForm=' + namaUntukForm.length);

    return {
      success    : true,
      bulan      : bulan,
      totalMurid : allMurid.length,
      dahBayar   : Object.keys(dahBayarSet).length,
      namaInForm : namaUntukForm.length
    };

  } catch (err) {
    Logger.log('[kemasFormEbayar] Error: ' + err.message);
    return { success: false, message: 'Ralat sistem: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// onEbayarUPKKSubmit(e)
// Trigger handler — dipanggil automatik bila mana-mana Google Form
// eBayar (Jan-Dis) submit response baru ke spreadsheet UPKK utama.
// Kesan bulan dari NAMA TAB sheet (lebih reliable dari field form).
// JANGAN panggil manual — untuk trigger automatik sahaja.
// ─────────────────────────────────────────────
function onEbayarUPKKSubmit(e) {
  try {
    let tabNama = '';
    if (e && e.range) {
      tabNama = e.range.getSheet().getName();
    }
    // Fallback: detect tab via form field bila e.range.getSheet().getName() kosong
    if (!tabNama && e && e.namedValues) {
      const BULAN_TO_TAB = {
        'JANUARI':   'UPKK JAN 2026',
        'FEBRUARI':  'UPKK FEB 2026',
        'MAC':       'UPKK MAC 2026',
        'APRIL':     'UPKK APRIL 2026',
        'MEI':       'UPKK MEI 2026',
        'JUN':       'UPKK JUN 2026',
        'JULAI':     'UPKK JULAI 2026',
        'OGOS':      'UPKK OGOS 2026',
        'SEPTEMBER': 'UPKK SEPT 2026',
        'OKTOBER':   'UPKK OKT 2026',
        'NOVEMBER':  'UPKK NOV 2026',
        'DISEMBER':  'UPKK DIS 2026'
      };
      const bulanField = e.namedValues['BAYARAN YURAN BAGI BULAN'];
      const bulanVal = bulanField ? String(bulanField[0]).trim().toUpperCase() : '';
      tabNama = BULAN_TO_TAB[bulanVal] || '';
    }
    Logger.log('[onEbayarUPKKSubmit] Tab: ' + tabNama);

    const TAB_TO_BULAN = {
      'UPKK JAN 2026':   'JAN',
      'UPKK FEB 2026':   'FEB',
      'UPKK MAC 2026':   'MAC',
      'UPKK APRIL 2026': 'APRIL',
      'UPKK MEI 2026':   'MEI',
      'UPKK JUN 2026':   'JUN',
      'UPKK JULAI 2026': 'JUL',
      'UPKK OGOS 2026':  'OGOS',
      'UPKK SEPT 2026':  'SEPT',
      'UPKK OKT 2026':   'OKT',
      'UPKK NOV 2026':   'NOV',
      'UPKK DIS 2026':   'DIS'
    };

    const bulanKey = TAB_TO_BULAN[tabNama];
    if (!bulanKey) {
      Logger.log('[onEbayarUPKKSubmit] Tab bukan eBayar, skip: ' + tabNama);
      return;
    }

    // Beri masa 3 saat untuk Google Sheets flush data sebelum baca balik
    Utilities.sleep(3000);

    Logger.log('[onEbayarUPKKSubmit] Mula kemas form: ' + bulanKey);
    const result = kemasFormEbayar(bulanKey);
    Logger.log('[onEbayarUPKKSubmit] Result: ' + JSON.stringify(result));

  } catch (err) {
    Logger.log('[onEbayarUPKKSubmit] Error: ' + err.message);
  }
}

// ─────────────────────────────────────────────
// setupEbayarTrigger()
// RUN SEKALI SAHAJA dalam GAS Editor untuk pasang installable trigger
// onFormSubmit pada spreadsheet UPKK utama. Trigger ini akan fire
// bila mana-mana Google Form eBayar (12 bulan) submit response baru.
// BERBEZA dari setupAutoSyncTrigger() yang terikat pada Form eDaftar —
// ini terikat pada SPREADSHEET (bukan form), sebab 12 form eBayar
// semua tulis ke spreadsheet yang sama.
// ─────────────────────────────────────────────
function setupEbayarTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'onEbayarUPKKSubmit') {
      ScriptApp.deleteTrigger(t);
      removed++;
    }
  });
  Logger.log('[setupEbayarTrigger] Trigger lama dibuang: ' + removed);

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ScriptApp.newTrigger('onEbayarUPKKSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();

  Logger.log('[setupEbayarTrigger] Trigger berjaya dipasang pada spreadsheet: ' + SPREADSHEET_ID);
}

// listEbayarTriggers() — semak trigger aktif (untuk debug/verify selepas setup)
function listEbayarTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    Logger.log('[trigger] handler=' + t.getHandlerFunction()
      + ' | eventType=' + t.getEventType()
      + ' | source=' + t.getTriggerSource());
  });
}

// ─────────────────────────────────────────────
// getSenaraiByuran(bulan, status, carian)
// Cross-reference DAFTAR UPKK dengan tab yuran bulan berkenaan.
// Langkah 1: semua murid daftar ≤ cutoff bulan → senarai wajib bayar
// Langkah 2: baca tab yuran → bina lookup nama → rekod bayaran
// Langkah 3: gabungkan → SELESAI / BELUM
// Params: bulan = short key (JAN/FEB/...), status = '', 'SELESAI', 'BELUM'
// ─────────────────────────────────────────────
function getSenaraiByuran(bulan, status, carian) {
  function safe(val) { return (val === null || val === undefined) ? '' : String(val).trim(); }

  function parseTs(val) {
    if (!val) return null;
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
    const s = safe(val);
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]));
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  try {
    const LABEL_MAP = {
      'JAN':'Januari','FEB':'Februari','MAC':'Mac','APRIL':'April',
      'MEI':'Mei','JUN':'Jun','JUL':'Julai','OGOS':'Ogos',
      'SEPT':'September','OKT':'Oktober','NOV':'November','DIS':'Disember'
    };
    const BULAN_NUM = {
      'JAN':1,'FEB':2,'MAC':3,'APRIL':4,'MEI':5,'JUN':6,
      'JUL':7,'OGOS':8,'SEPT':9,'OKT':10,'NOV':11,'DIS':12
    };
    const CUTOFF_LOCAL = {
      'JAN'  : new Date(2026, 0, 31, 23, 59, 59),
      'FEB'  : new Date(2026, 1, 28, 23, 59, 59),
      'MAC'  : new Date(2026, 2, 31, 23, 59, 59),
      'APRIL': new Date(2026, 3, 30, 23, 59, 59),
      'MEI'  : new Date(2026, 4, 31, 23, 59, 59),
      'JUN'  : new Date(2026, 5, 30, 23, 59, 59),
      'JUL'  : new Date(2026, 6, 31, 23, 59, 59),
      'OGOS' : new Date(2026, 7, 31, 23, 59, 59),
      'SEPT' : new Date(2026, 8, 30, 23, 59, 59),
      'OKT'  : new Date(2026, 9, 31, 23, 59, 59),
      'NOV'  : new Date(2026, 10, 30, 23, 59, 59),
      'DIS'  : new Date(2026, 11, 31, 23, 59, 59)
    };

    const bulanKey = safe(bulan).toUpperCase();
    const tabName  = getTabYuranName_(bulanKey);
    const cutoff   = CUTOFF_LOCAL[bulanKey];
    const label    = LABEL_MAP[bulanKey] || bulanKey;
    const bulanNum = BULAN_NUM[bulanKey] || 0;

    if (!tabName || !cutoff) {
      return { success: false, message: 'Bulan tidak sah: ' + bulanKey };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Langkah 1 — Murid yang wajib bayar bulan ini (daftar ≤ cutoff)
    const daftarSheet = ss.getSheetByName(TAB.DAFTAR);
    if (!daftarSheet) return { success: false, message: 'Tab DAFTAR UPKK tidak dijumpai.' };
    const colDaftar = buildColDaftar(daftarSheet);

    const daftarData = daftarSheet.getDataRange().getValues();
    const muridList  = [];
    for (let i = 1; i < daftarData.length; i++) {
      try {
        const row  = daftarData[i];
        const nama = safe(row[colDaftar.NAMA_MURID]);
        if (!nama) continue;
        const ts = parseTs(row[colDaftar.TIMESTAMP]);
        if (!ts || ts > cutoff) continue;
        muridList.push({
          namaMurid: nama,
          email: safe(row[colDaftar.EMAIL]),
          tarikhDaftar: formatTarikh(ts),
          daftarBulan: getDaftarBulanFromMs_(ts.getTime()),
          noResitDaftar: safe(row[colDaftar.NO_RESIT]),
          mergedLinkDaftar: safe(row[colDaftar.MERGED_URL])
        });
      } catch (e) { continue; }
    }

    // Langkah 2 — Lookup rekod bayaran dari tab yuran (nama → {status, tarikhBayar, jumlah, noResit})
    const yuranMap = {};
    try {
      const yuranSheet = ss.getSheetByName(tabName);
      if (yuranSheet) {
        const yuranData = yuranSheet.getDataRange().getValues();
        for (let i = 1; i < yuranData.length; i++) {
          try {
            const row      = yuranData[i];
            const namaCell = safe(row[COL_YURAN.NAMA_MURID]);
            if (!namaCell) continue;
            const st = safe(row[COL_YURAN.STATUS]).toUpperCase();
            const entry = {
              status     : st || 'SELESAI',
              tarikhBayar: formatTarikh(row[COL_YURAN.TARIKH_BAYAR]),
              jumlah     : parseFloat(row[COL_YURAN.JUMLAH]) || 0,
              noResit    : safe(row[COL_YURAN.NO_RESIT])
            };
            splitMuridNames(namaCell).forEach(n => {
              const norm = normalizeNamaMurid_(n);
              if (norm) yuranMap[norm] = entry;
            });
          } catch (e) { continue; }
        }
      }
    } catch (e) {
      console.log('[getSenaraiByuran] tab yuran error: ' + e.message);
    }

    // Langkah 3 — Gabungkan
    let result = muridList.map(m => {
      const y  = yuranMap[normalizeNamaMurid_(m.namaMurid)];
      const isDaftarBulan = m.daftarBulan > 0 && m.daftarBulan === bulanNum;
      const st = isDaftarBulan ? 'SELESAI' : (y ? (y.status || 'SELESAI') : 'BELUM');
      return {
        bulan      : bulanKey,
        bulanLabel : label,
        namaMurid  : m.namaMurid,
        email      : m.email,
        tarikhBayar: isDaftarBulan ? m.tarikhDaftar : (y ? y.tarikhBayar : ''),
        jumlah     : y ? y.jumlah : 0,
        noResit    : isDaftarBulan ? (m.noResitDaftar || 'Yuran Daftar') : (y ? y.noResit : ''),
        status     : st,
        isDaftarBulan
      };
    });

    // Tapis status
    const statusFilter = safe(status).toUpperCase();
    if (statusFilter && statusFilter !== 'SEMUA') {
      result = result.filter(r => r.status === statusFilter);
    }

    // Tapis carian nama
    const carianNorm = safe(carian).toLowerCase();
    if (carianNorm) {
      result = result.filter(r => r.namaMurid.toLowerCase().includes(carianNorm));
    }

    return { success: true, data: result, total: result.length };
  } catch (err) {
    return { success: false, message: 'Ralat sistem: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// getSenaraiMuridDaftar(carian, status)
// Senarai semua murid berdaftar untuk tab Admin > Murid
// ─────────────────────────────────────────────
function getSenaraiMuridDaftar(carian, status) {
  function safe(val) { return (val === null || val === undefined) ? '' : String(val).trim(); }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const daftarSheet = ss.getSheetByName(TAB.DAFTAR);
    if (!daftarSheet) return { success: false, message: 'Tab DAFTAR UPKK tidak dijumpai.' };

    const colDaftar = buildColDaftar(daftarSheet);
    const data = daftarSheet.getDataRange().getValues();
    const q = safe(carian).toLowerCase();
    const stFilter = safe(status).toUpperCase();
    const list = [];

    for (let i = 1; i < data.length; i++) {
      try {
        const row = data[i];
        const nama = safe(row[colDaftar.NAMA_MURID]);
        if (!nama) continue;

        const st = safe(row[colDaftar.STATUS]).toUpperCase() || '—';
        const penjaga = safe(row[colDaftar.NAMA_PENJAGA]);
        const email = safe(row[colDaftar.EMAIL]).toLowerCase();
        const tarikhDaftar = formatTarikh(row[colDaftar.TIMESTAMP]);

        if (stFilter && st !== stFilter) continue;
        if (q) {
          const haystack = [nama, penjaga, email, tarikhDaftar, st].join(' ').toLowerCase();
          if (!haystack.includes(q)) continue;
        }

        list.push({
          namaMurid: nama,
          namaPenjaga: penjaga,
          email: email,
          tarikhDaftar: tarikhDaftar,
          status: st,
          umur: safe(row[colDaftar.UMUR]),
          row: i + 1
        });
      } catch (rowErr) {
        continue;
      }
    }

    list.sort(function(a, b) {
      const da = parseDateMs_(a.tarikhDaftar);
      const db = parseDateMs_(b.tarikhDaftar);
      if (db !== da) return db - da;
      return a.namaMurid.localeCompare(b.namaMurid);
    });

    return { success: true, total: list.length, data: list };
  } catch (err) {
    return { success: false, message: 'Ralat senarai murid: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// getTiadaBayarDanKonsisten()
// Klasifikasi murid (JAN–JUN): tiada sebarang bayaran vs bayar penuh
// ─────────────────────────────────────────────
function getTiadaBayarDanKonsisten() {
  function safe(v) { return (v === null || v === undefined) ? '' : String(v).trim(); }

  const ALL_BULAN = [
    { key: 'JAN',   num: 1,  tab: TAB.JAN   },
    { key: 'FEB',   num: 2,  tab: TAB.FEB   },
    { key: 'MAC',   num: 3,  tab: TAB.MAC   },
    { key: 'APRIL', num: 4,  tab: TAB.APRIL },
    { key: 'MEI',   num: 5,  tab: TAB.MEI   },
    { key: 'JUN',   num: 6,  tab: TAB.JUN   },
    { key: 'JUL',   num: 7,  tab: TAB.JUL   },
    { key: 'OGOS',  num: 8,  tab: TAB.OGOS  },
    { key: 'SEPT',  num: 9,  tab: TAB.SEPT  },
    { key: 'OKT',   num: 10, tab: TAB.OKT   },
    { key: 'NOV',   num: 11, tab: TAB.NOV   },
    { key: 'DIS',   num: 12, tab: TAB.DIS   }
  ];
  const ACTIVE_BULAN = ALL_BULAN.filter(b => b.num <= getCurrentMonthNum());

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const daftarSheet = ss.getSheetByName(TAB.DAFTAR);
    if (!daftarSheet) return { success: false, message: 'Tab DAFTAR UPKK tidak dijumpai.' };
    const colDaftar = buildColDaftar(daftarSheet);

    // Baca semua murid SELESAI dari DAFTAR UPKK
    const daftarData = daftarSheet.getDataRange().getValues();
    const muridList  = [];
    for (let i = 1; i < daftarData.length; i++) {
      const row  = daftarData[i];
      const nama = safe(row[colDaftar.NAMA_MURID]);
      if (!nama) continue;
      const status = safe(row[colDaftar.STATUS]).toUpperCase();
      if (status !== 'SELESAI') continue;
      const ts = row[colDaftar.TIMESTAMP];
      const ms = (ts instanceof Date) ? ts.getTime() : (ts ? new Date(ts).getTime() : 0);
      let daftarBulan = 0; // 0 = daftar sebelum 2026, semua bulan aktif
      if (ms > 0) {
        const d = new Date(ms);
        if (d.getFullYear() >= 2026) daftarBulan = d.getMonth() + 1;
      }
      muridList.push({
        nama,
        tarikhDaftar: ms > 0 ? formatTarikh(new Date(ms)) : '',
        tsMs: ms,
        daftarBulan
      });
    }

    // Bina lookup nama_lower → status untuk setiap tab yuran JAN–JUN
    const yuranLookup = {};
    for (const b of ACTIVE_BULAN) {
      yuranLookup[b.key] = {};
      try {
        const sheet = ss.getSheetByName(b.tab);
        if (!sheet) continue;
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          const row      = data[i];
          const namaCell = safe(row[COL_YURAN.NAMA_MURID]);
          if (!namaCell) continue;
          const st = safe(row[COL_YURAN.STATUS]).toUpperCase();
          splitMuridNames(namaCell).forEach(n => {
            yuranLookup[b.key][n.toUpperCase()] = st || 'SELESAI';
          });
        }
      } catch (e) {
        Logger.log('[getTiadaBayarDanKonsisten] tab ' + b.tab + ': ' + e.message);
      }
    }

    const tiadaBayar = [];
    const sebahagian = [];
    const konsisten  = [];

    for (const murid of muridList) {
      let aktivCount  = 0;
      let selesaiCount = 0;

      for (const b of ACTIVE_BULAN) {
        // Murid belum daftar semasa bulan ini berakhir → bukan aktif
        if (murid.tsMs > 0 && murid.tsMs > CUTOFF_MS[b.key]) continue;
        // Bulan sebelum bulan daftar dalam 2026 → N/A
        if (murid.daftarBulan > 0 && b.num < murid.daftarBulan) continue;

        aktivCount++;

        // Bulan daftar → auto-SELESAI (yuran daftar)
        if (murid.daftarBulan > 0 && b.num === murid.daftarBulan) {
          selesaiCount++;
          continue;
        }

        // Semak status dalam tab yuran
        const st = yuranLookup[b.key][murid.nama.toUpperCase()];
        if (st === 'SELESAI') selesaiCount++;
      }

      if (aktivCount <= 0) continue;

      if (selesaiCount === 0) {
        tiadaBayar.push({ nama: murid.nama, tarikhDaftar: murid.tarikhDaftar, bulanAktif: aktivCount });
      } else if (selesaiCount >= aktivCount) {
        konsisten.push({ nama: murid.nama, tarikhDaftar: murid.tarikhDaftar, bulanAktif: aktivCount });
      } else {
        sebahagian.push({
          nama        : murid.nama,
          tarikhDaftar: murid.tarikhDaftar,
          bulanAktif  : aktivCount,
          selesaiCount: selesaiCount,
          persen      : Math.round((selesaiCount / aktivCount) * 100)
        });
      }
    }

    sebahagian.sort((a, b) => a.persen - b.persen);

    return { success: true, tiadaBayar, sebahagian, konsisten };
  } catch (err) {
    return { success: false, message: 'Ralat sistem: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// AUTO-SYNC: Trigger automatik bila ada pendaftaran baru (eDaftar)
// ─────────────────────────────────────────────

function onEdaftarFormSubmit(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (lockErr) {
    Logger.log('[autoSync] Gagal dapat lock — skip kali ini: ' + lockErr.message);
    return;
  }

  try {
    Logger.log('[autoSync] eDaftar form submit dikesan — mula auto-sync...');
    const result = syncMuridToForms();
    if (result.success) {
      Logger.log('[autoSync] Berjaya. Forms dikemaskini: ' + result.updated
        + ' | Murid baru: ' + (result.muridBaru && result.muridBaru.length
          ? result.muridBaru.join(', ') : '0'));
      if (result.muridBaru && result.muridBaru.length > 0) {
        notifyAdminsMuridBaru(result.muridBaru, result.updated);
      }
    } else {
      Logger.log('[autoSync] syncMuridToForms gagal: ' + result.message);
    }
  } catch (err) {
    Logger.log('[autoSync] Ralat: ' + err.message);
  } finally {
    lock.releaseLock();
  }
}

// ── Helper: dapatkan semua email admin dari tab ADMIN UPKK ──
function getAdminEmails() {
  try {
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(TAB_ADMIN);
    if (!sheet) return [];
    const data   = sheet.getDataRange().getValues();
    const emails = new Set();
    for (let i = 1; i < data.length; i++) {
      const email = (data[i][COL_ADMIN.EMAIL] || '').toString().trim().toLowerCase();
      if (email) emails.add(email);
    }
    return Array.from(emails);
  } catch (err) {
    Logger.log('[getAdminEmails] Ralat: ' + err.message);
    return [];
  }
}

// ── Helper: hantar email notifikasi murid baru ke semua admin ──
function notifyAdminsMuridBaru(muridBaru, updatedForms) {
  try {
    const adminEmails = getAdminEmails();
    if (!adminEmails.length) {
      Logger.log('[notifyAdmins] Tiada email admin dijumpai dalam tab ADMIN UPKK.');
      return;
    }

    const tarikh      = Utilities.formatDate(new Date(), 'Asia/Kuala_Lumpur', 'dd/MM/yyyy HH:mm');
    const senaraiHtml = muridBaru.map(n => `<li>${n}</li>`).join('');

    const subject  = `🎉 ${muridBaru.length} Murid Baru Disync — UPKK eDaftar`;
    const htmlBody = `
      <div style="font-family:sans-serif;color:#1B5E20;">
        <h2 style="color:#1B5E20;margin-bottom:4px;">Murid Baru Berjaya Disync</h2>
        <p>Sistem UPKK mengesan <b>${muridBaru.length} murid baru</b> mendaftar
        dan secara automatik mengemaskini senarai nama pada Google Form eBayar
        (${updatedForms} borang dikemaskini).</p>
        <p><b>Senarai Murid Baru:</b></p>
        <ul>${senaraiHtml}</ul>
        <p style="color:#888;font-size:12px;margin-top:16px;">
        Tarikh: ${tarikh}<br>
        Sistem eDaftar · eBayar · eSemak UPKK — SKA Paya Rumput (automatik, tidak perlu balas)</p>
      </div>`;

    MailApp.sendEmail({
      to      : adminEmails.join(','),
      subject : subject,
      htmlBody: htmlBody,
      name    : 'Sistem UPKK eDaftar'
    });

    Logger.log('[notifyAdmins] Email dihantar ke: ' + adminEmails.join(', '));
  } catch (err) {
    Logger.log('[notifyAdmins] Ralat hantar email: ' + err.message);
  }
}

// ── RUN SEKALI SAHAJA dalam Apps Script Editor untuk pasang trigger ──
function setupAutoSyncTrigger() {
  deleteAutoSyncTrigger();

  const form = FormApp.openById(FORM_ID);
  ScriptApp.newTrigger('onEdaftarFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();

  Logger.log('[autoSync] Trigger dipasang pada Form eDaftar: ' + FORM_ID);
}

// ── Helper: buang trigger auto-sync sedia ada ──
function deleteAutoSyncTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;
  triggers.forEach(t => {
    if (t.getHandlerFunction() === 'onEdaftarFormSubmit') {
      ScriptApp.deleteTrigger(t);
      removed++;
    }
  });
  Logger.log('[autoSync] Trigger lama dibuang: ' + removed);
}

// ── Helper: semak trigger yang aktif sekarang (untuk debug) ──
function listAutoSyncTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => {
    Logger.log('[trigger] handler=' + t.getHandlerFunction()
      + ' | eventType=' + t.getEventType()
      + ' | source=' + t.getTriggerSource());
  });
}
