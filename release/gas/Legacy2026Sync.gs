/** Phase A preview only. No Form, email, Sheet mutation or production mode.
 * Existing production trigger behaviour is NOT changed by this workspace file.
 * Apply the matching narrow patch only in an explicitly authorised QA runtime.
 */
function legacy2026SyncPreview_(bulanKey) {
  const closed = () => ({success:false,preview:false,message:'Sync Legacy kekal dikunci.'});
  try {
    const p = PropertiesService.getScriptProperties();
    if (p.getProperty('UPKK_LEGACY_SYNC_MODE') !== 'QA_PREVIEW' ||
        p.getProperty('UPKK_LEGACY_SYNC_QA_SPREADSHEET_ID') !== SPREADSHEET_ID)
      return closed();
    const all = ['JAN','FEB','MAC','APRIL','MEI','JUN','JUL','OGOS','SEPT','OKT','NOV','DIS'];
    // undefined means the existing full sync; malformed input never broadens it.
    const months = bulanKey === undefined ? all : all.includes(bulanKey) ? [bulanKey] : [];
    if (!months.length) return closed();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const students = readMuridListFromDaftar_(ss.getSheetByName(TAB.DAFTAR));
    const plans = months.map(month => ({month:month,names:buildEbayarChoices_(
      students,getPaidNameCellsForBulan_(ss,month),CUTOFF_MS[month],BULAN_NUM[month])}));
    // false intentionally prevents trigger success/notification branches firing.
    return {success:false,preview:true,plans:plans,message:'Pratonton QA sahaja; tiada Google Form dikemas kini.'};
  } catch (_) { return closed(); }
}
