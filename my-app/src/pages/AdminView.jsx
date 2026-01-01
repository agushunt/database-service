
// ===============================
// src/pages/AdminView.jsx
// ===============================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadRecords, saveRecords, generateId } from "../utils/storage";
import QRCode from "qrcode";

export default function AdminView() {
  const [records, setRecords] = useState(loadRecords);
  const [form, setForm] = useState({ customerName: "", device: "", problem: "", status: "Masuk" });
  const [qrCodes, setQrCodes] = useState({});
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => saveRecords(records), [records]);

  useEffect(() => {
    console.log('QR codes state changed:', Object.keys(qrCodes).length, 'QR codes available');
  }, [qrCodes]);

  function logout() {
    localStorage.removeItem("admin");
    navigate("/");
  }

  function submit(e) {
    e.preventDefault();
    if (!form.customerName || !form.device) return alert("Data belum lengkap");

    const rec = { id: generateId(), ...form, history: [{ status: form.status, at: Date.now() }], updatedAt: Date.now() };
    setRecords([rec, ...records]);
    setForm({ customerName: "", device: "", problem: "", status: "Masuk" });
  }

  async function makeQr(id) {
    try {
      const url = window.location.origin + "/view/" + id;
      console.log('Generating QR for URL:', url);
      const qrCodeDataUrl = await QRCode.toDataURL(url);
      console.log('QR generated successfully for ID:', id);
      setQrCodes(prev => ({
        ...prev,
        [id]: qrCodeDataUrl
      }));
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Gagal membuat QR code: ' + error.message);
    }
  }

  function exportPdf(r) {
    const w = window.open("", "_blank");
    w.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bukti Service - ${r.customerName}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #333;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header p {
            color: #666;
            margin: 5px 0 0 0;
            font-size: 14px;
          }
          .info-section {
            margin-bottom: 25px;
          }
          .info-row {
            display: flex;
            margin-bottom: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #007bff;
          }
          .label {
            font-weight: bold;
            color: #333;
            min-width: 120px;
            font-size: 14px;
          }
          .value {
            color: #555;
            font-size: 14px;
            flex: 1;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-masuk { background: #e3f2fd; color: #1976d2; }
          .status-proses { background: #fff3e0; color: #f57c00; }
          .status-selesai { background: #e8f5e8; color: #388e3c; }
          .status-diambil { background: #f3e5f5; color: #7b1fa2; }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .service-id {
            background: #007bff;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
            margin-top: 10px;
          }
          @media print {
            body { background: white; }
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Bukti Service</h1>
            <p>Service Center - Sistem Manajemen Servis Modern</p>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <div class="label">Nama Customer:</div>
              <div class="value">${r.customerName}</div>
            </div>
            
            <div class="info-row">
              <div class="label">Device:</div>
              <div class="value">${r.device}</div>
            </div>
            
            <div class="info-row">
              <div class="label">Keluhan:</div>
              <div class="value">${r.problem}</div>
            </div>
            
            <div class="info-row">
              <div class="label">Status:</div>
              <div class="value">
                <span class="status-badge status-${r.status.toLowerCase()}">${r.status}</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="label">Tanggal Masuk:</div>
              <div class="value">${new Date(r.history?.[0]?.at || Date.now()).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <div class="service-id">No. Service: ${r.id}</div>
          </div>
          
          <div class="footer">
            <p>Terima kasih telah mempercayakan service device Anda kepada kami</p>
            <p>kioratech © ${new Date().getFullYear()} - Sistem Manajemen Servis Modern</p>
          </div>
        </div>
      </body>
      </html>
    `);
    w.document.close();
    w.print();
  }

  const filtered = filter === "ALL" ? records : records.filter(r => r.status === filter);

  return (
    <div>
      <div style={{marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <h2 style={{margin: 0}}>Panel Admin - Manajemen Service</h2>
        <button 
          onClick={logout}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{marginBottom:12,display:'flex',gap:6,flexWrap:'wrap', background: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <button className="btn" onClick={()=>setFilter('ALL')}>Semua</button>
        <button className="btn" onClick={()=>setFilter('Masuk')}>Masuk</button>
        <button className="btn" onClick={()=>setFilter('Proses')}>Proses</button>
        <button className="btn" onClick={()=>setFilter('Selesai')}>Selesai</button>
        <button className="btn" onClick={()=>setFilter('Diambil')}>Diambil</button>
         
      </div>

      <div className="grid" style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <form onSubmit={submit}>
          <input className="input" placeholder="Nama" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
          <input className="input" placeholder="Device" value={form.device} onChange={e => setForm({ ...form, device: e.target.value })} />
          <textarea className="textarea" placeholder="Keluhan" value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} />
          <button className="btn btn-primary">Tambah</button>
        </form>

        <div>
          {filtered.map(r => (
            <div key={r.id} className="list-item">
              <div>
                <b>{r.customerName}</b> - {r.device}
                <div className="muted">ID: {r.id}</div>
                
                {qrCodes[r.id] && (
                  <div style={{
                    marginTop: '10px',
                    textAlign: 'center',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    <img src={qrCodes[r.id]} className="qr-img" alt="qr" />
                    <p style={{marginTop: '5px', fontSize: '11px', color: '#666'}}>
                      Scan untuk status service
                    </p>
                  </div>
                )}
                
                <select
                  className="select"
                  value={r.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setRecords(records.map(x => x.id === r.id ? {
                      ...x,
                      status: newStatus,
                      history: [...(x.history || []), { status: newStatus, at: Date.now() }],
                      updatedAt: Date.now()
                    } : x));
                  }}
                >
                  <option value="Masuk">Masuk</option>
                  <option value="Proses">Sedang Diproses</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Diambil">Sudah Diambil</option>
                </select>
              </div>
              <div style={{display:'flex',gap:6}}>
                <button className="btn" onClick={() => makeQr(r.id)}>QR</button>
                <button className="btn" onClick={() => exportPdf(r)}>PDF</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


