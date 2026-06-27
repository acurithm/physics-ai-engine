import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const SendIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const SidebarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>;

function App() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState(() => JSON.parse(localStorage.getItem('chatHistory')) || []);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => { localStorage.setItem('chatHistory', JSON.stringify(chatHistory)); }, [chatHistory]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsTyping(true);
    const userMsg = query;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setQuery('');
    textareaRef.current.style.height = 'auto';
    
    try {
      const res = await fetch('https://physics-ai-engine.onrender.com/stream-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.text();
      setChatHistory(prev => [...prev, { type: 'ai', text: data }]);
    } catch { setChatHistory(prev => [...prev, { type: 'ai', text: "Error: Server unreachable." }]); }
    finally { setIsTyping(false); }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000', color: '#fff', overflow: 'hidden' }}>
      {/* Sidebar Overlay for Mobile */}
      <div style={{ width: sidebarOpen ? '260px' : '0px', transition: '0.3s', background: '#111', zIndex: 100, borderRight: '1px solid #333', padding: sidebarOpen ? '20px' : '0', overflow: 'hidden', position: window.innerWidth < 768 ? 'absolute' : 'relative' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Recent Chats</h2>
        <button onClick={() => setChatHistory([])} style={{ background: '#333', color: '#fff', border: 'none', padding: '8px', borderRadius: '5px', width: '100%' }}>Clear History</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#fff', margin: '20px', cursor: 'pointer', width: 'fit-content' }}><SidebarIcon /></button>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {chatHistory.length === 0 && <h1 style={{ marginTop: '20vh' }}>Let's crack JEE together!</h1>}
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ width: '100%', maxWidth: '800px', margin: '15px 0', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
              <div style={{ padding: '15px', borderRadius: '15px', background: msg.type === 'user' ? '#252525' : 'transparent', display: 'inline-block', textAlign: 'left', maxWidth: '90%' }}>
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isTyping && <div style={{ color: '#666', padding: '20px' }}>Acurithm is thinking ✧.*</div>}
        </div>

        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '800px', display: 'flex', alignItems: 'flex-end', background: '#1a1a1a', borderRadius: '25px', padding: '10px 20px' }}>
            <textarea ref={textareaRef} value={query} onChange={(e) => { setQuery(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '10px 0', outline: 'none', resize: 'none', maxHeight: '150px' }} placeholder="Ask Acurithm..." />
            <button onClick={handleSearch} style={{ background: '#fff', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', marginLeft: '10px' }}><SendIcon /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;