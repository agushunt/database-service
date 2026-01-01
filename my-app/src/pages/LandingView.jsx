import { Link } from "react-router-dom";

export default function LandingView() {
  return (
    <div style={{
      minHeight: '100vh',
      
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '10px',
          color: '#333',
          fontWeight: 'bold'
        }}>
          Service Center
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Sistem manajemen servis profesional untuk melacak dan mengelola status perbaikan perangkat Anda
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            padding: '30px',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{marginBottom: '15px', color: '#495057', fontSize: '1.3rem'}}>Cek Status Servis</h3>
            <p style={{fontSize: '1rem', color: '#6c757d', marginBottom: '20px', lineHeight: '1.5'}}>
              Masukkan nomor servis Anda untuk melihat status perbaikan perangkat secara real-time
            </p>
            <Link
              to="/cek"
              style={{
                display: 'inline-block',
                padding: '12px 30px',
                background: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background 0.3s'
              }}
            >
              Cek Status Servis
            </Link>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #e9ecef',
          paddingTop: '20px',
          color: '#6c757d',
          fontSize: '0.9rem'
        }}>
          <p>© 2025 kioratech - Sistem Manajemen Servis Modern</p>
        </div>
      </div>
    </div>
  );
}