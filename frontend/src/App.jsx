import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSearch = (text = query) => {
    if (!text.trim()) return;
    setChatHistory([...chatHistory, { type: 'user', text: text }, { type: 'ai', text: "Solving JEE concept..." }]);
    setQuery('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {sidebarOpen && (
        <div className="sidebar">
          <button style={{ background: '#282829', color: '#fff', border: 'none', padding: '10px', borderRadius: '20px', cursor: 'pointer' }}>+ New Chat</button>
          <div style={{ marginTop: '20px', color: '#888', fontSize: '12px' }}>Recent</div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: chatHistory.length === 0 ? 'center' : 'flex-start', padding: '20px' }}>
        
        {chatHistory.length === 0 ? (
          <div style={{ width: '100%', maxWidth: '700px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '500', marginBottom: '40px', background: 'linear-gradient(90deg, #8ab4f8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hello, Raushan.</h1>
            <div className="suggestion-grid">
              {["Explain Quantum Physics", "JEE Strategy 2026", "Solve Calculus", "Organic Chemistry"].map(t => (
                <button key={t} className="suggestion-card" onClick={() => handleSearch(t)}>{t}</button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '750px', overflowY: 'auto', paddingBottom: '100px' }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ marginBottom: '20px', padding: '15px', borderRadius: '15px', background: msg.type === 'user' ? '#1e1e1f' : 'transparent' }}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
          </div>
        )}

        <div style={{ position: 'fixed', bottom: '20px', width: '100%', maxWidth: '700px' }}>
            <div style={{ background: '#1e1e1f', borderRadius: '30px', padding: '12px 20px', display: 'flex', alignItems: 'center', border: '1px solid #333' }}>
                <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter a prompt here" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', resize: 'none', fontSize: '16px' }} />
                <button onClick={() => handleSearch()} style={{ background: '#444', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}>➤</button>
            </div>
        </div>
      </div>
    </div>
  );
}
export default App;