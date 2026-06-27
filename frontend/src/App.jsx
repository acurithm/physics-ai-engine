import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const SendIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>;
const SidebarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>;

function App() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState(() => JSON.parse(localStorage.getItem('chatHistory')) || []);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => { localStorage.setItem('chatHistory', JSON.stringify(chatHistory)); }, [chatHistory]);

  const handleSearch = async (text = query) => {
    if (!text.trim()) return;
    setChatHistory(prev => [...prev, { type: 'user', text: text }]);
    setQuery('');
    // API logic remains same
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000' }}>
      {/* Sidebar */}
      <div className="sidebar-wrapper" style={{ width: sidebarOpen ? '260px' : '0px' }}>
        <div className="recent-header">
          <span>Recent</span>
          <button onClick={() => setChatHistory([])} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>+</button>
        </div>
        <div style={{ padding: '10px 20px' }}>
            <button onClick={() => setChatHistory([])} style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', width: '100%', cursor: 'pointer' }}>Clear History</button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><SidebarIcon /></button>
        
        {chatHistory.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '40px', fontWeight: '400' }}>How can I help you?</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {["Explain Quantum Physics", "JEE Strategy 2026", "Solve Calculus", "Organic Chemistry"].map(t => (
                <button key={t} onClick={() => handleSearch(t)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#ccc', padding: '20px', borderRadius: '15px', cursor: 'pointer', textAlign: 'left' }}>{t}</button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '750px', overflowY: 'auto', paddingTop: '60px' }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ marginBottom: '30px', padding: '15px', background: msg.type === 'user' ? '#1a1a1a' : 'transparent', borderRadius: '15px' }}>
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.text}</ReactMarkdown>
              </div>
            ))}
          </div>
        )}

        <div className="input-box" style={{ width: '100%', maxWidth: '700px', background: '#1a1a1a', borderRadius: '30px', padding: '15px 20px', display: 'flex', alignItems: 'center', border: '1px solid #333' }}>
          <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter a prompt here" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', resize: 'none', fontSize: '16px', maxHeight: '100px' }} />
          <button onClick={() => handleSearch()} style={{ background: '#fff', borderRadius: '50%', padding: '10px', border: 'none', cursor: 'pointer', marginLeft: '10px' }}><SendIcon /></button>
        </div>
      </div>
    </div>
  );
}
export default App;