/* Storage boundary: legacy key and dataVersion:3 remain unchanged. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LifeRpgStorage = api;
})(typeof globalThis !== 'undefined' ? globalThis : undefined, function () {
  'use strict';
  const KEY = 'life-rpg-v3';
  const RECOVERY_KEY = 'life-rpg-v3-preimport-recovery';
  const SCHEMA_VERSION = 3;
  function read(storage, key = KEY) { return storage.getItem(key); }
  function parse(raw, validate) {
    if (raw == null) return null;
    const data = JSON.parse(raw);
    if (!validate(data)) throw new Error('保存データの形式が不正です');
    return data;
  }
  function write(storage, value, key = KEY) {
    const previous = storage.getItem(key);
    const serialized = JSON.stringify(value);
    try {
      storage.setItem(key, serialized);
      if (storage.getItem(key) !== serialized) throw new Error('書き込みを確認できませんでした');
    } catch (error) {
      try { if (previous === null) storage.removeItem(key); else storage.setItem(key, previous); } catch (_) {}
      throw error;
    }
    return serialized;
  }
  function preserve(storage) {
    const original = read(storage);
    if (original === null) return false;
    const previous = read(storage, RECOVERY_KEY);
    try {
      storage.setItem(RECOVERY_KEY, original);
      if (storage.getItem(RECOVERY_KEY) !== original) throw new Error('復元前のデータを保護できませんでした');
    } catch (error) {
      try { if (previous === null) storage.removeItem(RECOVERY_KEY); else storage.setItem(RECOVERY_KEY, previous); } catch (_) {}
      throw error;
    }
    return true;
  }
  // Read-only schema inspection. Never modify unknown future-version data.
  function inspect(raw) {
    if (raw === null || raw === undefined) return { status: 'empty', version: null };
    let value;
    try { value = JSON.parse(raw); } catch (_) { return { status: 'invalid-json', version: null }; }
    if (!value || typeof value !== 'object' || Array.isArray(value) || !Number.isInteger(value.dataVersion))
      return { status: 'invalid-schema', version: null };
    if (value.dataVersion > SCHEMA_VERSION) return { status: 'future-schema', version: value.dataVersion };
    if (value.dataVersion < SCHEMA_VERSION) return { status: 'legacy-schema', version: value.dataVersion };
    return { status: 'current-schema', version: value.dataVersion };
  }
  return Object.freeze({ KEY, RECOVERY_KEY, SCHEMA_VERSION, read, parse, write, preserve, inspect });
});
