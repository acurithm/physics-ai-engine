import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- PREMIUM SVG ICONS ---
const AttachmentIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const MicIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
  </svg>
);

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SidebarToggleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
  </svg>
);

const AtomIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const CodeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const MathIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 9.5 12 17l-7.5-7.5"></path><path d="M12 2v14"></path><path d="M22 22H2"></path></svg>;
const PenIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>;
const UserAvatarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SettingsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

const AIResponseText = ({ text, forceStop, onComplete, scrollTrigger }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const formattedText = text
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/\\\[/g, '$$$')
    .replace(/\\\]/g, '$$$');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    setIsTyping(true);
    intervalRef.current = setInterval(() => {
      i += 4; 
      setDisplayedText(formattedText.slice(0, i));
      if (scrollTrigger) scrollTrigger();
      if (i >= formattedText.length) {
        clearInterval(intervalRef.current);
        setDisplayedText(formattedText);
        setIsTyping(false);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, 10); 
    return () => clearInterval(intervalRef.current);
  }, [formattedText]);

  useEffect(() => {
    if (forceStop && isTyping) {
      clearInterval(intervalRef.current);
      setIsTyping(false);
    }
  }, [forceStop, isTyping]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ color: '#e0e0e0', fontSize: '20px', lineHeight: '1.9', letterSpacing: '0.4px', fontFamily: "'Inter', sans-serif", width: '100%' }}>
        <ReactMarkdown 
          remarkPlugins={[remarkMath]} 
          rehypePlugins={[[rehypeKatex, { strict: false }]]}
          components={{
            p: ({node, ...props}) => <p style={{ margin: '0 0 18px 0' }} {...props} />,
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div style={{ borderRadius: '8px', overflow: 'hidden', margin: '15px 0', border: '1px solid #333' }}>
                  <div style={{ background: '#1e1e1e', padding: '8px 15px', fontSize: '14px', color: '#888', borderBottom: '1px solid #333' }}><span>{match[1]}</span></div>
                  <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '15px', fontSize: '16px' }} {...props}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                </div>
              ) : <code style={{ background: '#333', padding: '4px 8px', borderRadius: '6px', color: '#ff9800', fontFamily: 'monospace' }} {...props}>{children}</code>
            }
          }}
        >{displayedText}</ReactMarkdown>
        {isTyping && <span style={{ display: 'inline-block', width: '10px', height: '22px', background: '#3b82f6', marginLeft: '6px', verticalAlign: 'middle', animation: 'cursorBlink 0.8s infinite' }} />}
      </div>
    </div>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stars, setStars] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]); 
  const [isChatStarted, setIsChatStarted] = useState(false); 
  const [isFetching, setIsFetching] = useState(false); 
  const [isGenerating, setIsGenerating] = useState(false); 
  const [forceStopTyping, setForceStopTyping] = useState(false);
  const abortControllerRef = useRef(null); 
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null); 

  const greetings = ["Ask away, I'm ready!", "Ready to solve JEE problems?", "How can I help you today?", "Let's crack JEE together!"];
  const promptSuggestions = [
    { icon: <AtomIcon />, text: 'Explain Quantum Physics simply' },
    { icon: <CodeIcon />, text: 'Write a React Login Component' },
    { icon: <MathIcon />, text: 'Solve a tough Calculus integration' },
    { icon: <PenIcon />, text: 'Draft a professional email' }
  ];
  const recentChats = ["Thermodynamics Basics", "React Hooks UseEffect", "JEE Main 2026 Strategy", "Python API Integration"];

  const scrollToBottom = () => { if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; };

  useEffect(() => {
    const timer = setTimeout(() => setIsSidebarOpen(true), 1500);
    setStars(Array.from({ length: 60 }).map(() => ({ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, size: `${Math.random() * 2 + 1}px`, duration: `${Math.random() * 3 + 2}s` })));
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    return () => clearTimeout(timer);
  }, []);

  const handleNewChat = () => { setChatHistory([]); setIsChatStarted(false); setQuery(''); };

  const handleSearch = async (overrideQuery = null) => {
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim()) return;
    if (finalQuery.trim().toLowerCase() === 'clear') { handleNewChat(); return; }
    
    setIsChatStarted(true); 
    setChatHistory(prev => [...prev, { type: 'user', text: finalQuery }]);
    setQuery(''); 
    setIsFetching(true); setIsGenerating(true); setForceStopTyping(false); 
    
    abortControllerRef.current = new AbortController();
    try {
      // 🔥 LIVE RENDER URL
      const res = await fetch('https://physics-ai-engine.onrender.com/stream-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: finalQuery }),
        signal: abortControllerRef.current.signal
      });
      const data = await res.text();
      setIsFetching(false); 
      setChatHistory(prev => [...prev, { type: 'ai', text: data }]);
    } catch (err) {
      setIsFetching(false); setIsGenerating(false);
      setChatHistory(prev => [...prev, { type: 'ai', text: "Error: Backend unreachable." }]);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', background: '#000', overflow: 'hidden' }}>
      <div style={{ width: isSidebarOpen ? '320px' : '0px', background: '#111', transition: 'width 0.4s', overflow: 'hidden', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', zIndex: 20 }}>
        <div style={{ padding: '25px' }}>
          <button onClick={handleNewChat} style={{ width: '100%', padding: '14px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '12px', color: '#fff', cursor: 'pointer' }}>+ New Chat</button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: isChatStarted ? 'space-between' : 'center' }}>
        {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} style={{ position: 'absolute', top: '30px', left: '30px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa' }}><SidebarToggleIcon /></button>}
        
        <div ref={chatContainerRef} style={{ width: '100%', maxWidth: '1200px', flex: 1, overflowY: 'auto' }}>
          {!isChatStarted && (
            <div style={{ textAlign: 'center', paddingTop: '100px' }}>
              <h1 style={{ background: 'linear-gradient(90deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3.8rem' }}>{greeting}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px', padding: '20px' }}>
                {promptSuggestions.map((s, i) => <div key={i} onClick={() => handleSearch(s.text)} className="suggest-chip" style={{ padding: '16px', borderRadius: '16px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)' }}>{s.icon} {s.text}</div>)}
              </div>
            </div>
          )}
          {isChatStarted && chatHistory.map((msg, i) => (
             <div key={i} style={{ padding: '20px', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
               <div style={{ display: 'inline-block', padding: '15px', background: msg.type === 'user' ? '#252525' : 'transparent', borderRadius: '20px', color: '#fff', textAlign: 'left', maxWidth: '80%' }}>
                 {msg.type === 'user' ? msg.text : <AIResponseText text={msg.text} scrollTrigger={scrollToBottom} />}
               </div>
             </div>
          ))}
        </div>
        
        <div style={{ width: '90%', maxWidth: '950px', padding: '20px' }}>
          <div className="search-bar-container" style={{ background: 'rgba(37, 37, 37, 0.65)', borderRadius: '40px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)' }}>
            <textarea ref={textareaRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask Acurithm..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', resize: 'none', outline: 'none' }} />
            <button onClick={() => handleSearch()} style={{ background: '#e5e5e5', borderRadius: '50%', width: '45px', height: '45px', border: 'none', cursor: 'pointer' }}><SendIcon /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;