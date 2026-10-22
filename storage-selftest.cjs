const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

// 使用项目已有 TypeScript 编译器执行真实解析代码，无新增测试依赖。
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(
    fs.readFileSync(filename, 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } },
  ).outputText, filename);
}
const { parseSavedPreorder } = require('./src/state/PreorderContext.tsx');
const { PRODUCTS } = require('./src/data/catalog.ts');
const product = PRODUCTS[0];
const line = { productId: product.id, size: product.sizes[0], color: product.colorways[0].name, qty: 2, key: 'old-key' };
const receipt = { ref: 'test-ref', placedAt: '2026-10-22T00:00:00.000Z', name: '测试', phone: '13800000000', email: '', batchId: 'test', note: '', terms: 'yes', lines: [line] };

test('missing and malformed storage recover without throwing', () => {
  for (const raw of [null, '{broken', 'null', '[]', '{"lines":{}}']) {
    assert.deepEqual(parseSavedPreorder(raw), { lines: [], receipt: null });
  }
});
test('partial receipts cannot crash the receipt view', () => {
  for (const invalid of [{ref:'x'}, {...receipt,phone:undefined}, {...receipt,lines:{}}, {...receipt,placedAt:'invalid'}]) {
    assert.equal(parseSavedPreorder(JSON.stringify({lines:[line],receipt:invalid})).receipt, null);
  }
});
test('restored line quantities and variants are validated', () => {
  const invalid = [{...line,qty:1.5},{...line,qty:21},{...line,qty:'2'},{...line,size:'invalid'},{...line,color:'invalid'},{...line,productId:'unknown'},null];
  assert.deepEqual(parseSavedPreorder(JSON.stringify({lines:invalid})).lines, []);
});
test('valid receipt and lines survive and line keys are reconstructed', () => {
  const saved = parseSavedPreorder(JSON.stringify({lines:[line],receipt}));
  assert.equal(saved.lines.length, 1);
  assert.equal(saved.lines[0].key, `${line.productId}|${line.size}|${line.color}`);
  assert.equal(saved.receipt.phone, receipt.phone);
  assert.equal(saved.receipt.lines[0].qty, 2);
});
