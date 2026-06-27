import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
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
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(Array.from({ length: 60 }).map(() => ({ 
        top: `${Math.random() * 100}%`, 
        left: `${Math.random() * 100}%`, 
        size: `${Math.random() * 2 + 1}px`, 
        duration: `${Math.random() * 3 + 2}s` 
    })));
  }, []);

  const handleSearch = async (overrideQuery = null) => {
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim()) return;
    setIsChatStarted(true);
    setChatHistory(prev => [...prev, { type: 'user', text: finalQuery }]);
    setQuery('');
    try {
      const res = await fetch('https://physics-ai-engine.onrender.com/stream-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: finalQuery }),
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
        body { background: #000; color: #fff; margin: 0; font-family: 'Inter', sans-serif; overflow: hidden; }
        .star { position: absolute; background: white; border-radius: 50%; opacity: 0.5; animation: twinkle linear infinite; }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        .chat-container { width: 100%; max-width: 900px; margin: 0 auto; height: 80vh; overflow-y: auto; padding: 20px; }
        .input-wrapper { position: fixed; bottom: 30px; width: 90%; max-width: 900px; left: 50%; transform: translateX(-50%); background: rgba(37,37,37,0.8); border: 1px solid #333; padding: 15px 25px; border-radius: 40px; display: flex; align-items: center; backdrop-filter: blur(10px); }
      `}</style>
      
      {stars.map((s, i) => <div key={i} className="star" style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDuration: s.duration }} />)}

      <div style={{ display: 'flex', height: '100vh', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {!isChatStarted && (
            <div style={{ marginTop: '20vh', textAlign: 'center' }}>
              <h1 style={{ fontSize: '3.5rem', marginBottom: '40px' }}>Let's crack JEE together!</h1>
              <div style={{ display: 'flex', gap: '15px' }}>
                {['Explain Quantum Physics', 'Write React Component'].map(t => (
                  <button key={t} onClick={() => handleSearch(t)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '12px 20px', borderRadius: '15px', cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
            </div>
          )}
          
          <div className="chat-container">
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ margin: '20px 0', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                <div style={{ padding: '15px 20px', borderRadius: '20px', background: msg.type === 'user' ? '#252525' : 'transparent', display: 'inline-block', maxWidth: '80%' }}>
                  {msg.type === 'user' ? msg.text : <AIResponseText text={msg.text} />}
                </div>
              </div>
            ))}
          </div>

          <div className="input-wrapper">
            <textarea value={query} onChange={(e) => setQuery(e.target.value)} style={{ flex: 1, background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '18px' }} placeholder="Ask Acurithm..." />
            <button onClick={handleSearch} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><SendIcon /></button>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;