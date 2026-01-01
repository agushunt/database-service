
// ===============================
// src/utils/storage.js
// ===============================
const KEY = "service_records_v2";
export const loadRecords = () => JSON.parse(localStorage.getItem(KEY) || "[]");
export const saveRecords = (r) => localStorage.setItem(KEY, JSON.stringify(r));
export const generateId = () => Date.now().toString(36);
