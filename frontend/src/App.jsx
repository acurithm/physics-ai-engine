import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SendIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const SidebarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>;

function App() {
  const [query, setQuery] = useState('');
  // LocalStorage se history load karna
  const [chatHistory, setChatHistory] = useState(() => JSON.parse(localStorage.getItem('chatHistory')) || []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // History update hone par save karna
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsTyping(true);
    const userMsg = query;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setQuery('');
    
    try {
      const res = await fetch('https://physics-ai-engine.onrender.com/stream-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.text();
      setChatHistory(prev => [...prev, { type: 'ai', text: data }]);
    } catch {
      setChatHistory(prev => [...prev, { type: 'ai', text: "Error: Server unreachable." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000' }}>
      <div style={{ width: sidebarOpen ? '260px' : '0px', transition: '0.3s', background: '#111', borderRight: '1px solid #333', overflow: 'hidden', padding: sidebarOpen ? '20px' : '0' }}>
        <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '20px' }}>Recent Chats</h2>
        <button onClick={() => setChatHistory([])} style={{ background: '#333', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' }}>Clear History</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#fff', margin: '20px', cursor: 'pointer' }}><SidebarIcon /></button>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', background: msg.type === 'user' ? '#252525' : 'transparent', padding: '15px', borderRadius: '15px', maxWidth: '70%' }}>
              <ReactMarkdown 
                remarkPlugins={[remarkMath]} 
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline ? (
                      <div style={{ position: 'relative' }}>
                        <button onClick={() => navigator.clipboard.writeText(children)} style={{ position: 'absolute', right: 5, top: 5, fontSize: '10px', cursor: 'pointer' }}>Copy</button>
                        <SyntaxHighlighter style={vscDarkPlus} language={match ? match[1] : null} PreTag="div" {...props}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                      </div>
                    ) : <code className={className} {...props}>{children}</code>;
                  }
                }}
              >{msg.text}</ReactMarkdown>
            </div>
          ))}
          {isTyping && <div style={{ color: '#666', fontStyle: 'italic' }}>Acurithm is thinking...</div>}
        </div>

        <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '15px', borderRadius: '25px', outline: 'none' }} placeholder="Ask Acurithm..." />
          <button onClick={handleSearch} style={{ background: '#fff', border: 'none', borderRadius: '50%', padding: '15px', cursor: 'pointer' }}><SendIcon /></button>
        </div>
      </div>
    </div>
  );
}
export default App;