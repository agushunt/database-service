import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode";

// Default-exported React component (single-file app).
// Usage instructions (include in project README):
// 1) Create a React app (eg. `npx create-react-app my-app --template cra-template-pwa`)
// 2) Install dependencies: `npm install react-router-dom qrcode`
// 3) Add Tailwind CSS or use your preferred styling. The code below uses simple Tailwind classes.
// 4) Replace src/App.jsx with this file contents and run `npm start`.

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
        <div className="max-w-5xl mx-auto">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Aplikasi Toko Servis</h1>
            <nav className="space-x-3">
              <Link to="/" className="underline">Admin</Link>
              <Link to="/public" className="underline">Daftar Publik</Link>
            </nav>
          </header>

          <main className="bg-white p-6 rounded-2xl shadow-sm">
            <Routes>
              <Route path="/" element={<AdminView />} />
              <Route path="/public" element={<PublicListView />} />
              <Route path="/view/:id" element={<PublicView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

// --- Utilities: data storage in localStorage ---
const STORAGE_KEY = "service_shop_records_v1";

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error(e);
    return [];
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function generateId() {
  // short unique ID using timestamp + random
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// --- Admin view (create/edit service entries) ---
function AdminView() {
  const [records, setRecords] = useState(() => loadRecords());
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    device: "",
    problem: "",
    price: "",
    status: "Masuk",
  });
  const [editingId, setEditingId] = useState(null);
  const [qrImage, setQrImage] = useState(null);

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  function resetForm() {
    setForm({ customerName: "", phone: "", device: "", problem: "", price: "", status: "Masuk" });
    setEditingId(null);
    setQrImage(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.customerName || !form.device) {
      alert("Isi minimal nama customer dan device");
      return;
    }

    if (editingId) {
      const updated = records.map((r) => (r.id === editingId ? { ...r, ...form, updatedAt: Date.now() } : r));
      setRecords(updated);
    } else {
      const newRec = {
        id: generateId(),
        ...form,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setRecords([newRec, ...records]);
    }

    resetForm();
  }

  function handleEdit(id) {
    const rec = records.find((r) => r.id === id);
    if (!rec) return;
    setForm({ customerName: rec.customerName, phone: rec.phone, device: rec.device, problem: rec.problem, price: rec.price, status: rec.status });
    setEditingId(id);
  }

  function handleDelete(id) {
    if (!confirm("Hapus record ini?")) return;
    const filtered = records.filter((r) => r.id !== id);
    setRecords(filtered);
  }

  async function generateQrFor(id) {
    const url = window.location.origin + "/view/" + encodeURIComponent(id);
    try {
      const dataUrl = await QRCode.toDataURL(url, { margin: 2, width: 300 });
      setQrImage(dataUrl);
    } catch (e) {
      console.error(e);
      alert("Gagal membuat QR code");
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <section className="md:col-span-1">
        <h2 className="text-lg font-semibold mb-3">Tambah / Edit Service</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Nama Customer</label>
            <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Telepon</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Device</label>
            <input value={form.device} onChange={(e) => setForm({ ...form, device: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Keluhan / Problem</label>
            <textarea value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} className="w-full p-2 border rounded" rows={3} />
          </div>
          <div>
            <label className="block text-sm">Harga (opsional)</label>
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full p-2 border rounded">
              <option>Masuk</option>
              <option>Proses</option>
              <option>Selesai</option>
              <option>Diambil</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-sky-600 text-white rounded">{editingId ? "Simpan" : "Tambah"}</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Reset</button>
          </div>
        </form>

        {qrImage && (
          <div className="mt-4">
            <h3 className="text-sm font-medium">QR untuk pelanggan</h3>
            <img src={qrImage} alt="QR" className="mt-2 w-48 h-48 bg-white p-2 rounded" />
            <p className="text-xs mt-2">Scan QR untuk melihat detail service (halaman publik).</p>
          </div>
        )}
      </section>

      <section className="md:col-span-2">
        <h2 className="text-lg font-semibold mb-3">Daftar Service</h2>
        <div className="space-y-3">
          {records.length === 0 && <div className="p-4 text-sm text-slate-500">Belum ada record.</div>}
          {records.map((r) => (
            <div key={r.id} className="p-3 border rounded flex items-start justify-between">
              <div>
                <div className="font-medium">{r.customerName} — <span className="text-sm text-slate-500">{r.device}</span></div>
                <div className="text-sm text-slate-600">{r.problem}</div>
                <div className="text-xs text-slate-500 mt-1">ID: {r.id} — Status: {r.status} — Harga: {r.price || '-'} </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEdit(r.id)} className="px-3 py-1 border rounded">Edit</button>
                <button onClick={() => handleDelete(r.id)} className="px-3 py-1 border rounded">Hapus</button>
                <button onClick={() => generateQrFor(r.id)} className="px-3 py-1 bg-sky-600 text-white rounded">QR</button>
                <a className="px-3 py-1 border rounded text-sm" href={"/view/" + encodeURIComponent(r.id)} target="_blank" rel="noreferrer">Buka publik</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PublicListView() {
  const [records, setRecords] = useState(() => loadRecords());

  useEffect(() => {
    // reload from storage when mounted
    setRecords(loadRecords());
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Daftar Service (Publik)</h2>
      {records.length === 0 && <div className="text-sm text-slate-500">Belum ada service yang tersedia.</div>}
      <div className="space-y-3">
        {records.map((r) => (
          <div key={r.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{r.customerName} — <span className="text-sm text-slate-500">{r.device}</span></div>
              <div className="text-xs text-slate-500">ID: {r.id}</div>
            </div>
            <Link to={`/view/${encodeURIComponent(r.id)}`} className="px-3 py-1 border rounded">Lihat</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const records = loadRecords();
    const rec = records.find((r) => r.id === id);
    if (!rec) {
      setRecord(null);
    } else {
      setRecord(rec);
    }
  }, [id]);

  if (!record) {
    return (
      <div>
        <h2 className="text-lg font-semibold">Record tidak ditemukan</h2>
        <p className="text-sm text-slate-500">Pastikan QR atau link benar.</p>
        <div className="mt-4">
          <button onClick={() => navigate(-1)} className="px-3 py-1 border rounded">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-2">Detail Service</h2>
      <div className="p-4 border rounded mb-4 text-left">
        <div className="text-sm text-slate-500">ID: {record.id}</div>
        <div className="mt-2"><strong>Nama:</strong> {record.customerName}</div>
        <div className="mt-1"><strong>Telepon:</strong> {record.phone || '-'}</div>
        <div className="mt-1"><strong>Device:</strong> {record.device}</div>
        <div className="mt-1"><strong>Keluhan:</strong> {record.problem}</div>
        <div className="mt-1"><strong>Harga:</strong> {record.price || '-'}</div>
        <div className="mt-1"><strong>Status:</strong> {record.status}</div>
        <div className="mt-2 text-xs text-slate-500">Terakhir diupdate: {new Date(record.updatedAt).toLocaleString()}</div>
      </div>
      <p className="text-sm text-slate-500">Tunjukkan halaman ini kepada customer untuk tracking status service mereka. Anda juga bisa mencetak atau menampilkan QR yang mengarah ke halaman ini.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <h2 className="text-lg font-semibold">Halaman tidak ditemukan</h2>
      <p className="text-sm text-slate-500">Periksa alamat atau kembali ke beranda.</p>
      <Link to="/" className="mt-3 inline-block underline">Ke Admin</Link>
    </div>
  );
}

// Note: This is a minimal, local-only implementation intended for offline/demo use.
// Production suggestions (when you're ready):
// - Replace localStorage with a real backend + database (REST or GraphQL).
// - Secure public endpoints (if needed) and add authentication for admin.
// - Use server-side generation of QR or short links (so the public page doesn't depend on client-side localStorage).
// - Add file upload for images, service photos, and customer receipts.
// - Add notifications (SMS/WhatsApp/email) to notify customers when status changes.

// End of file
