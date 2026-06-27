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
});

test('admin monthly cards can drill into filtered payment lists', () => {
  assert.match(html, /function openAdminMonth/);
  assert.match(html, /data-month=/);
  assert.match(html, /onclick="openAdminMonth/);
});

test('admin dashboard explains the meaning of monthly figures', () => {
  assert.match(html, /Selesai/);
  assert.match(html, /Belum/);
  assert.match(html, /Progress/);
});
