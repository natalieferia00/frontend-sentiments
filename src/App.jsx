import { useState } from 'react';
import './App.css';

function App() {
  const [mapLink, setMapLink] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  // 💡 DETECTA AUTOMÁTICAMENTE EL ENTORNO:
  // Si estás ejecutando tu app en localhost, usa el puerto 8000 de tu Mac.
  // Si la subes a producción, usa de forma limpia la URL correcta de tu Render (sin el -ai).
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : 'https://backend-sentiments.onrender.com';

  const manejarAnalisis = async (e) => {
    e.preventDefault();
    if (!mapLink.trim()) return;

    setLoading(true);
    setResultado(null); 

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: mapLink }), 
      });

      if (response.ok) {
        const data = await response.json();
        setResultado(data); 
      } else {
        console.error("Error en el servidor al analizar. Código:", response.status);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <center>
          <h1>Sentiment AI</h1>
          <p className="subtitle">Software Engineering Project - Real Time Analysis</p>
        </center>

        <form onSubmit={manejarAnalisis}>
          <textarea 
            rows="2"
            placeholder="Introduce las palabras o frases a analizar..." 
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn-analyze" 
            disabled={loading || !mapLink.trim()}
          >
            {loading ? 'Analizando...' : 'Analizar y Guardar'}
          </button>
        </form>

        {resultado && (
          <div style={{ marginTop: '2rem' }}>
            <div className="reseña-card" style={{ borderLeft: `5px solid ${resultado.color}` }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                <strong>Texto analizado:</strong> <span style={{ color: '#94a3b8' }}>{resultado.text}</span>
              </p>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                <strong>Sentimiento:</strong>{' '}
                <span style={{ color: resultado.color, fontWeight: 'bold' }}>
                  {resultado.sentiment}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}> ({resultado.score})</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;