// ===============================
// src/pages/PublicView.jsx
// ===============================
import { useParams, useSearchParams } from "react-router-dom";
import { loadRecords } from "../utils/storage";

export default function PublicView() {
  const { id: pathId } = useParams();
  const [params] = useSearchParams();
  const queryId = params.get("servisan");
  const id = pathId || queryId;

  const r = loadRecords().find(x => x.id === id);

  if (!r) {
    return (
      <div className="cek-wrapper">
        <div className="cek-card">Data servisan tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="cek-wrapper">
      <div className="cek-card">
        <h2 className="cek-title">Cek Status Servisan</h2>

        <div className="cek-row">
          <span>No Servisan</span>
          <b>{r.id}</b>
        </div>
        <div className="cek-row">
          <span>Nama</span>
          <b>{r.customerName}</b>
        </div>
        <div className="cek-row">
          <span>Device</span>
          <b>{r.device}</b>
        </div>
        <div className="cek-row">
          <span>Keluhan</span>
          <b>{r.problem}</b>
        </div>
        <div className="cek-row">
          <span>Status</span>
          <b className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</b>
        </div>

        {r.history && r.history.length > 0 && (
          <div className="cek-history">
            <h4>Riwayat Servisan</h4>
            <ul>
              {r.history.map((h, i) => (
                <li key={i}>{new Date(h.at).toLocaleString()} — {h.status}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
