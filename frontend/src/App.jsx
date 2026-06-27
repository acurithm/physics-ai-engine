import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const SendIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>;
const SidebarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>;

function App() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState(() => JSON.parse(localStorage.getItem('chatHistory')) || []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const textareaRef = useRef(null);

  const suggestions = [
    { title: "Explain Quantum Physics", prompt: "Explain the basics of Quantum Physics simply." },
    { title: "JEE Strategy 2026", prompt: "Give me a daily study plan for JEE Main 2026." },
    { title: "Solve Calculus", prompt: "Help me solve a tough integration problem." }
  ];

  useEffect(() => { localStorage.setItem('chatHistory', JSON.stringify(chatHistory)); }, [chatHistory]);

  const handleSearch = async (promptText = query) => {
    if (!promptText.trim()) return;
    const userMsg = promptText;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setQuery('');
    
    // API Call here... (Same logic as before)
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000', color: '#fff' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? '280px' : '0px', transition: '0.3s', background: '#0f0f0f', borderRight: '1px solid #222', padding: sidebarOpen ? '20px' : '0', overflow: 'hidden' }}>
        <h3 style={{ marginBottom: '20px', color: '#aaa' }}>Recent</h3>
        <button onClick={() => setChatHistory([])} style={{ background: 'transparent', color: '#aaa', border: '1px solid #333', padding: '8px', borderRadius: '10px', width: '100%', cursor: 'pointer' }}>Clear History</button>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: chatHistory.length === 0 ? 'center' : 'flex-start', padding: '20px' }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><SidebarIcon /></button>
        
        {chatHistory.length === 0 ? (
          <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '40px', fontWeight: '500' }}>How can I help you?</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSearch(s.prompt)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '20px', borderRadius: '15px', cursor: 'pointer', textAlign: 'left', fontSize: '14px' }}>
                  {s.title}
                </button>
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

        {/* Input - The "Gemini" Floating Bar */}
        <div style={{ width: '100%', maxWidth: '700px', background: '#1a1a1a', borderRadius: '30px', padding: '15px 20px', display: 'flex', alignItems: 'center', border: '1px solid #333', marginBottom: '20px' }}>
          <textarea ref={textareaRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter a prompt here" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', resize: 'none', fontSize: '16px' }} />
          <button onClick={() => handleSearch()} style={{ background: '#fff', borderRadius: '50%', padding: '10px', border: 'none', cursor: 'pointer' }}><SendIcon /></button>
        </div>
      </div>
    </div>
  );
}
export default App;