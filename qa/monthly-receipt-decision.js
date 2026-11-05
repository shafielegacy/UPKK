'use strict';
/**
 * UPKK V2 monthly receipt QA-only decision model.
 * NOT connected to GAS, Sheets, AutoCrat, Drive or email.
 * A real implementation MUST perform reservation atomically under LockService,
 * preserve a durable receipt ledger and reconcile uncertain external merges.
 */
function receiptDecision(payment, ledger, otherRecords) {
  const p = payment || {};
  const records = Array.isArray(otherRecords) ? otherRecords : [];
  const status = String(p.status || '').toUpperCase();
  const requestId = String(p.requestId || '').trim();
  const childId = String(p.childId || '').trim();
  const month = Number(p.month);
  const year = Number(p.year);
  const amount = Number(p.amount);
  if (!/^[a-zA-Z0-9_-]{4,100}$/.test(requestId) || !childId ||
      !Number.isInteger(month) || month < 1 || month > 12 ||
      !Number.isInteger(year) || year < 2026 || year > 2099 ||
      !Number.isFinite(amount) || amount <= 0)
    return {action:'BLOCK',reason:'INVALID_PAYMENT'};
  const key = [childId,year,String(month).padStart(2,'0')].join('|');
  const peers = records.filter(r => r && r.requestId !== requestId &&
    [String(r.childId||'').trim(),Number(r.year),String(Number(r.month)).padStart(2,'0')].join('|') === key &&
    String(r.status||'').toUpperCase() === 'SELESAI');
  if (peers.length) return {action:'BLOCK',reason:'DUPLICATE_SETTLED_PERIOD',key};
  if (status !== 'SELESAI') return {action:'BLOCK',reason:'PAYMENT_NOT_SETTLED',key};
  if (!ledger) return {action:'RESERVE_WITH_LOCK',key,requestId};
  if (ledger.key !== key || ledger.requestId !== requestId ||
      !/^[A-Z0-9-]{6,60}$/.test(String(ledger.serial||'')))
    return {action:'BLOCK',reason:'LEDGER_MISMATCH',key};
  if (ledger.pdfUrl && ledger.phase !== 'READY')
    return {action:'HOLD_RECONCILE',reason:'PDF_WITHOUT_READY_STATE',key,serial:ledger.serial};
  switch (ledger.phase) {
    case 'READY':
      return ledger.pdfUrl && /^https:\/\//.test(ledger.pdfUrl)
        ? {action:'NOOP_READY',key,serial:ledger.serial,pdfUrl:ledger.pdfUrl}
        : {action:'HOLD_RECONCILE',reason:'READY_WITHOUT_PDF',key,serial:ledger.serial};
    case 'RESERVED':
      return {action:'MERGE_MANUAL_ONLY',key,serial:ledger.serial};
    case 'MERGING':
    case 'UNCERTAIN':
    case 'FAILED':
      return {action:'HOLD_RECONCILE',reason:ledger.phase,key,serial:ledger.serial};
    default:
      return {action:'BLOCK',reason:'INVALID_LEDGER_STATE',key};
  }
}
if (typeof module !== 'undefined') module.exports = {receiptDecision};
