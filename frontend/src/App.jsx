import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Icons
const SendIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const SidebarToggleIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>;
const AtomIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle></svg>;

const AIResponseText = ({ text }) => (
  <div style={{ color: '#e0e0e0', fontSize: '16px', lineHeight: '1.6' }}>
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{text}</ReactMarkdown>
  </div>
);

function App() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatStarted, setIsChatStarted] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsChatStarted(true);
    setChatHistory(prev => [...prev, { type: 'user', text: query }]);
    const currentQuery = query;
    setQuery('');
    try {
      const res = await fetch('https://physics-ai-engine.onrender.com/stream-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuery }),
      });
      const data = await res.text();
      setChatHistory(prev => [...prev, { type: 'ai', text: data }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { type: 'ai', text: "Error: Backend unreachable." }]);
    }
  };

  return (
    <>
      <style>{`
        body { background: #000; color: #fff; margin: 0; font-family: 'Inter', sans-serif; }
        .chat-container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .input-area { position: fixed; bottom: 20px; width: 100%; max-width: 800px; left: 50%; transform: translateX(-50%); background: #1a1a1a; padding: 15px; border-radius: 20px; display: flex; }
      `}</style>
      
      <div style={{ padding: '20px' }}>
        {!isChatStarted && <h1 style={{ textAlign: 'center', marginTop: '100px' }}>Let's crack JEE together!</h1>}
        <div className="chat-container">
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ margin: '20px 0', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
              <div style={{ padding: '10px 15px', borderRadius: '10px', background: msg.type === 'user' ? '#333' : 'transparent', display: 'inline-block' }}>
                {msg.type === 'user' ? msg.text : <AIResponseText text={msg.text} />}
              </div>
            </div>
          ))}
        </div>
        <div className="input-area">
          <textarea value={query} onChange={(e) => setQuery(e.target.value)} style={{ flex: 1, background: 'transparent', color: '#fff', border: 'none', outline: 'none' }} placeholder="Ask Acurithm..." />
          <button onClick={handleSearch} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><SendIcon /></button>
        </div>
      </div>
    </>
  );
}
export default App;