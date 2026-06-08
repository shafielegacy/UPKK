// =============================================
// SISTEM UPKK — SKA PAYA RUMPUT 2026
// =============================================

const SPREADSHEET_ID  = '1pHzToTNZBBvER7zk9XyQUwdl2f_XXDdpX-fEFml_UJg';
const FORM_ID         = '1K-CY3tkA2e-qb127F7I1IXEFR7iPkaqZXjIDKTdkslM';
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
  JUL    : 'UPKK JUL 2026',
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
  JUN:   '1K-CY3tkA2e-qb127F7I1IXEFR7iPkaqZXjIDKTdkslM',
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
        result = getDashboard(params.email);
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
      default:
        result = { success: false, message: 'Tindakan tidak dikenali: ' + action };
    }
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'Ralat API: ' + err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
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
        const data = daftarSheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          try {
            const row = data[i];
            if (!row[COL_DAFTAR.EMAIL]) continue;
            const rowEmail    = safe(row[COL_DAFTAR.EMAIL]).toLowerCase();
            const rowTel      = safe(row[COL_DAFTAR.NO_TELEFON]).replace(/\D/g, '');
            const rowTelLast6 = rowTel.slice(-6);
            if (rowEmail !== emailNorm || rowTelLast6 !== inputDigits) continue;
            const ts          = row[COL_DAFTAR.TIMESTAMP];
            const namaMurid   = safe(row[COL_DAFTAR.NAMA_MURID]);
            const namaPenjaga = safe(row[COL_DAFTAR.NAMA_PENJAGA]);
            Logger.log('[LOGIN] parent match — row ' + i + ', penjaga:"' + namaPenjaga + '", murid:"' + namaMurid + '"');
            return {
              success      : true,
              role         : 'parent',
              namaMurid,
              namaPenjaga,
              email        : safe(row[COL_DAFTAR.EMAIL]),
              tarikhDaftar : ts ? new Date(ts).toISOString() : ''
            };
          } catch (rowErr) { continue; }
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
function getDashboard(email) {
  try {
    const ss        = SpreadsheetApp.openById(SPREADSHEET_ID);
    const emailNorm = email.toString().trim().toLowerCase();

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

      try {
        const sheet = ss.getSheetByName(bulan.tab);
        if (!sheet) { console.log('[getDashboard] Tab tidak dijumpai: ' + bulan.tab); continue; }

        const range    = sheet.getDataRange();
        const data     = range.getValues();
        const richData = range.getRichTextValues();
        for (let i = 1; i < data.length; i++) {
          const row     = data[i];
          const richRow = richData[i];
          if (!row[COL_YURAN.EMAIL]) continue;
          const rowEmail = row[COL_YURAN.EMAIL].toString().trim().toLowerCase();
          if (rowEmail === emailNorm) {
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
              + ' | row[11]=' + JSON.stringify(row[COL_YURAN.MERGED_URL])
              + ' | mergedLink=' + mergedLink);

            statusYuran[bulan.key] = {
              label      : bulan.label,
              status     : status || 'MENUNGGU',
              jumlah     : parseFloat(row[COL_YURAN.JUMLAH]) || 0,
              tarikhBayar: (row[COL_YURAN.TARIKH_BAYAR] || '').toString().trim(),
              noResit    : (row[COL_YURAN.NO_RESIT] || '').toString().trim(),
              mergedLink : mergedLink
            };
            break;
          }
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
      'MENUNGGU',                        // STATUS
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

    const daftarSheet = ss.getSheetByName(TAB.DAFTAR);
    const jumlahMurid = daftarSheet ? Math.max(0, daftarSheet.getLastRow() - 1) : 0;

    let totalSelesai = 0, totalBelum = 0, totalMenunggu = 0, totalKutipan = 0;
    const perBulan = [];
    const rekod    = [];

    for (const bulan of bulanList) {
      let selesai = 0, menunggu = 0, belum = 0, jumlahRM = 0;

      try {
        const sheet = ss.getSheetByName(bulan.tab);
        if (!sheet) { perBulan.push({ bulan: bulan.key, label: bulan.label, selesai: 0, menunggu: 0, belum: 0, jumlahRM: 0 }); continue; }

        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row[COL_YURAN.EMAIL]) continue;

          const status = (row[COL_YURAN.STATUS] || '').toString().trim().toUpperCase();
          const jumlah = parseFloat(row[COL_YURAN.JUMLAH]) || 0;

          if (status === 'SELESAI')       { selesai++; totalSelesai++; jumlahRM += jumlah; totalKutipan += jumlah; }
          else if (status === 'MENUNGGU') { menunggu++; totalMenunggu++; }
          else                            { belum++; totalBelum++; }

          rekod.push({
            bulan      : bulan.key,
            bulanLabel : bulan.label,
            email      : row[COL_YURAN.EMAIL].toString().trim(),
            namaMurid  : (row[COL_YURAN.NAMA_MURID] || '').toString().trim(),
            tarikhBayar: (row[COL_YURAN.TARIKH_BAYAR] || '').toString().trim(),
            jumlah,
            noResit    : (row[COL_YURAN.NO_RESIT] || '').toString().trim(),
            status     : status || 'BELUM'
          });
        }
      } catch (tabErr) {
        console.log('[getAdminDashboard] ERROR tab ' + bulan.tab + ': ' + tabErr.message);
      }

      perBulan.push({ bulan: bulan.key, label: bulan.label, selesai, menunggu, belum, jumlahRM });
    }

    return { success: true, jumlahMurid, totalSelesai, totalBelum, totalMenunggu, totalKutipan, perBulan, rekod };
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

    const data = sheet.getDataRange().getValues();
    const muridList = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[COL_DAFTAR.NAMA_MURID]) continue;
      const nama = row[COL_DAFTAR.NAMA_MURID].toString().trim();
      const ts   = row[COL_DAFTAR.TIMESTAMP] ? new Date(row[COL_DAFTAR.TIMESTAMP]).getTime() : 0;
      if (nama) muridList.push({ nama, ts });
    }

    const bulanKeys = Object.keys(FORM_EDIT_IDS);
    let updatedForms = 0;
    const breakdown  = [];
    const errors     = [];

    for (const key of bulanKeys) {
      const formId   = FORM_EDIT_IDS[key];
      const cutoff   = CUTOFF_MS[key];
      const filtered = muridList.filter(m => m.ts > 0 && m.ts <= cutoff).map(m => m.nama);

      breakdown.push({ bulan: LABEL_MAP[key] || key, count: filtered.length });
      if (filtered.length === 0) {
        Logger.log('[SYNC] ' + key + ' — skip (0 murid)');
        continue;
      }

      try {
        const form  = FormApp.openById(formId);
        const items = form.getItems(); // semua item, bukan filter type
        Logger.log('[SYNC] ' + key + ' — form: ' + formId + ', items: ' + items.length + ', murid: ' + filtered.length);

        let updated = false;
        for (const item of items) {
          const title = item.getTitle().toUpperCase();
          if (!title.includes('NAMA') && !title.includes('MURID')) continue;

          const type = item.getType();
          Logger.log('[SYNC] ' + key + ' — item: "' + item.getTitle() + '", type: ' + type);

          try {
            if (type === FormApp.ItemType.LIST) {
              item.asListItem().setChoiceValues(filtered);
              updated = true;
            } else if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
              item.asMultipleChoiceItem().setChoices(
                filtered.map(n => item.asMultipleChoiceItem().createChoice(n))
              );
              updated = true;
            } else if (type === FormApp.ItemType.CHECKBOX) {
              item.asCheckboxItem().setChoices(
                filtered.map(n => item.asCheckboxItem().createChoice(n))
              );
              updated = true;
            }
            if (updated) { Logger.log('[SYNC] ' + key + ' — OK, choices set'); break; }
          } catch (castErr) {
            Logger.log('[SYNC] ' + key + ' — cast error: ' + castErr.message);
          }
        }

        if (updated) {
          updatedForms++;
        } else {
          Logger.log('[SYNC] ' + key + ' — tiada item NAMA/MURID dijumpai');
          errors.push(key + ': tiada soalan NAMA MURID dalam form');
        }
      } catch (formErr) {
        Logger.log('[SYNC] ' + key + ' — form error: ' + formErr.message);
        errors.push(key + ': ' + formErr.message);
      }
    }

    return {
      success   : true,
      updated   : updatedForms,
      breakdown,
      errors    : errors.length ? errors : undefined
    };
  } catch (err) {
    return { success: false, message: 'Ralat sistem: ' + err.message };
  }
}

// ─────────────────────────────────────────────
// getSenaraiByuran(bulan, status, carian)
// Cross-reference DAFTAR UPKK dengan tab yuran bulan berkenaan.
// Langkah 1: semua murid daftar ≤ cutoff bulan → senarai wajib bayar
// Langkah 2: baca tab yuran → bina lookup nama → rekod bayaran
// Langkah 3: gabungkan → SELESAI / MENUNGGU / BELUM
// Params: bulan = short key (JAN/FEB/...), status = '', 'SELESAI', 'MENUNGGU', 'BELUM'
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
    const TAB_YURAN = {
      'JAN'  : 'UPKK JAN 2026',   'FEB'  : 'UPKK FEB 2026',
      'MAC'  : 'UPKK MAC 2026',   'APRIL': 'UPKK APRIL 2026',
      'MEI'  : 'UPKK MEI 2026',   'JUN'  : 'UPKK JUN 2026',
      'JUL'  : 'UPKK JUL 2026',   'OGOS' : 'UPKK OGOS 2026',
      'SEPT' : 'UPKK SEPT 2026',  'OKT'  : 'UPKK OKT 2026',
      'NOV'  : 'UPKK NOV 2026',   'DIS'  : 'UPKK DIS 2026'
    };
    const LABEL_MAP = {
      'JAN':'Januari','FEB':'Februari','MAC':'Mac','APRIL':'April',
      'MEI':'Mei','JUN':'Jun','JUL':'Julai','OGOS':'Ogos',
      'SEPT':'September','OKT':'Oktober','NOV':'November','DIS':'Disember'
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
    const tabName  = TAB_YURAN[bulanKey];
    const cutoff   = CUTOFF_LOCAL[bulanKey];
    const label    = LABEL_MAP[bulanKey] || bulanKey;

    if (!tabName || !cutoff) {
      return { success: false, message: 'Bulan tidak sah: ' + bulanKey };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Langkah 1 — Murid yang wajib bayar bulan ini (daftar ≤ cutoff)
    const daftarSheet = ss.getSheetByName(TAB.DAFTAR);
    if (!daftarSheet) return { success: false, message: 'Tab DAFTAR UPKK tidak dijumpai.' };

    const daftarData = daftarSheet.getDataRange().getValues();
    const muridList  = [];
    for (let i = 1; i < daftarData.length; i++) {
      try {
        const row  = daftarData[i];
        const nama = safe(row[COL_DAFTAR.NAMA_MURID]);
        if (!nama) continue;
        const ts = parseTs(row[COL_DAFTAR.TIMESTAMP]);
        if (!ts || ts > cutoff) continue;
        muridList.push({ namaMurid: nama, email: safe(row[COL_DAFTAR.EMAIL]) });
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
            const row  = yuranData[i];
            const nama = safe(row[COL_YURAN.NAMA_MURID]);
            if (!nama) continue;
            const st = safe(row[COL_YURAN.STATUS]).toUpperCase();
            yuranMap[nama.toLowerCase()] = {
              status     : st || 'MENUNGGU',
              tarikhBayar: safe(row[COL_YURAN.TARIKH_BAYAR]),
              jumlah     : parseFloat(row[COL_YURAN.JUMLAH]) || 0,
              noResit    : safe(row[COL_YURAN.NO_RESIT])
            };
          } catch (e) { continue; }
        }
      }
    } catch (e) {
      console.log('[getSenaraiByuran] tab yuran error: ' + e.message);
    }

    // Langkah 3 — Gabungkan
    let result = muridList.map(m => {
      const y  = yuranMap[m.namaMurid.toLowerCase()];
      const st = y ? (y.status || 'MENUNGGU') : 'BELUM';
      return {
        bulan      : bulanKey,
        bulanLabel : label,
        namaMurid  : m.namaMurid,
        email      : m.email,
        tarikhBayar: y ? y.tarikhBayar : '',
        jumlah     : y ? y.jumlah : 0,
        noResit    : y ? y.noResit : '',
        status     : st
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
