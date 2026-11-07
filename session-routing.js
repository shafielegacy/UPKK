/* Phase A: explicit enrolment session, independent of the calendar payment year.
 * Presentation routing only. Native ownership must be checked by its backend.
 * There is deliberately no Native enable switch or Native network transport here.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.UPKKSession = api;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const months = ['JAN','FEB','MAC','APRIL','MEI','JUN','JUL','OGOS','SEPT','OKT','NOV','DIS'];
  function contextKey(session, year, month) {
    return String(session) + '|' + String(year) + '|' + String(month);
  }
  function paymentRoute(session, year, month, forms) {
    const s = String(session), y = Number(year);
    if (!Number.isInteger(y) || !months.includes(month)) return {kind:'CLOSED'};
    if (s === '2026' && y === 2026) {
      const url = forms && forms[month];
      return typeof url === 'string' && url.startsWith('https://docs.google.com/forms/')
        ? {kind:'LEGACY_FORM',url:url} : {kind:'CLOSED'};
    }
    if (s === '2027' && ((y === 2026 && month === 'DIS') || y === 2027))
      return {kind:'NATIVE_CLOSED'};
    return {kind:'CLOSED'};
  }
  return Object.freeze({contextKey:contextKey,paymentRoute:paymentRoute});
});
