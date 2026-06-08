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
// Semak email + NO. TELEFON dalam tab DAFTAR UPKK
// Return: { success, namaMurid, namaPenjaga, email } | { success:false, message }
// ─────────────────────────────────────────────
function login(email, telefon) {
  try {
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(TAB.DAFTAR);
    if (!sheet) return { success: false, message: 'Tab DAFTAR UPKK tidak dijumpai dalam spreadsheet.' };

    const data       = sheet.getDataRange().getValues();
    const emailNorm  = email.toString().trim().toLowerCase();
    const telNorm    = telefon.toString().trim().replace(/[\s\-()]/g, '');

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[COL_DAFTAR.EMAIL]) continue;

      const rowEmail = row[COL_DAFTAR.EMAIL].toString().trim().toLowerCase();
      const rowTel   = row[COL_DAFTAR.NO_TELEFON].toString().trim().replace(/[\s\-()]/g, '');

      if (rowEmail === emailNorm && rowTel === telNorm) {
        return {
          success    : true,
          namaMurid  : row[COL_DAFTAR.NAMA_MURID].toString().trim(),
          namaPenjaga: row[COL_DAFTAR.NAMA_PENJAGA].toString().trim(),
          email      : row[COL_DAFTAR.EMAIL].toString().trim()
        };
      }
    }

    return { success: false, message: 'E-mel atau No. Telefon tidak sepadan. Sila semak semula.' };
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
        label      : bulan.label,
        status     : 'BELUM',
        jumlah     : 0,
        tarikhBayar: '',
        noResit    : '',
        mergedLink : ''
      };

      const sheet = ss.getSheetByName(bulan.tab);
      if (!sheet) continue;

      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[COL_YURAN.EMAIL]) continue;
        const rowEmail = row[COL_YURAN.EMAIL].toString().trim().toLowerCase();
        if (rowEmail === emailNorm) {
          const status = row[COL_YURAN.STATUS].toString().trim();
          statusYuran[bulan.key] = {
            label      : bulan.label,
            status     : status || 'MENUNGGU',
            jumlah     : parseFloat(row[COL_YURAN.JUMLAH]) || 0,
            tarikhBayar: row[COL_YURAN.TARIKH_BAYAR].toString().trim(),
            noResit    : row[COL_YURAN.NO_RESIT].toString().trim(),
            mergedLink : row[COL_YURAN.MERGED_LINK].toString().trim()
          };
          break;
        }
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
        const link = row[COL_YURAN.MERGED_LINK].toString().trim();
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
