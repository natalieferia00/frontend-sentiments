import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. URL base de producción con el prefijo /api/v1
  const API_URL = "https://backend-sentiment-ai.onrender.com/api/v1";

  // Función para cargar el historial mapeada al endpoint real de reviews
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews`);
      const data = await res.json();
      // Validamos que la data sea un arreglo antes de asignarla para evitar crashes
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) { 
      console.error("Error cargando el historial:", e); 
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleAnalyze = async () => {
    if (!text) return;
    setLoading(true);
    try {
      // 2. Petición POST al endpoint /api/v1/analyze
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResult(data);
      fetchHistory(); // Recargar historial tras analizar
      setText(''); // Limpiar input
    } catch (e) { 
      console.error("Error en el análisis:", e); 
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>Sentiment AI</h1>
        <p className="subtitle">Software Engineering Project - Real Time Analysis</p>

        <textarea
          rows="3"
          placeholder="Escribe una opinión..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button className="btn-analyze" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Procesando...' : 'Analizar y Guardar'}
        </button>

        {result && (
          <div className="result-box" style={{ backgroundColor: `${result.color}20`, borderColor: result.color }}>
            <span style={{ color: result.color, fontWeight: 'bold' }}>{result.sentiment}</span>
            <p>"{result.text}"</p>
          </div>
        )}

        <div className="history-section">
          <h3 style={{marginTop: '2rem', fontSize: '1rem', opacity: 0.7}}>Historial Reciente</h3>
          {history.length === 0 ? (
            <p style={{fontSize: '0.85rem', opacity: 0.5, marginTop: '0.5rem'}}>No hay análisis registrados en Atlas aún.</p>
          ) : (
            history.map((item) => (
              <div key={item._id || item.date} className="history-item">
                <span className="dot" style={{ backgroundColor: item.color || '#6B7280' }}></span>
                <small>{item.date} - {item.sentiment}:</small>
                <p>{item.text ? item.text.substring(0, 40) : ''}...</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;