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

// 🔥 NEW SVG FOR SIDEBAR TOGGLE
const SidebarToggleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
  </svg>
);

// SVGS FOR PROMPT CHIPS
const AtomIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const CodeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const MathIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 9.5 12 17l-7.5-7.5"></path><path d="M12 2v14"></path><path d="M22 22H2"></path></svg>;
const PenIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>;
const UserAvatarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SettingsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;


// --- SUPER FAST TYPEWRITER & MARKDOWN COMPONENT ---
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

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        color: '#e0e0e0', fontSize: '20px', lineHeight: '1.9', letterSpacing: '0.4px', fontFamily: "'Inter', sans-serif", width: '100%'
      }}>
        <ReactMarkdown 
          remarkPlugins={[remarkMath]} 
          rehypePlugins={[[rehypeKatex, { strict: false }]]}
          components={{
            p: ({node, ...props}) => <p style={{ margin: '0 0 18px 0' }} {...props} />,
            h1: ({node, ...props}) => <h1 style={{ fontSize: '1.8em', marginTop: '16px' }} {...props} />,
            h2: ({node, ...props}) => <h2 style={{ fontSize: '1.5em', marginTop: '16px' }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ paddingLeft: '30px', marginBottom: '18px' }} {...props} />,
            ol: ({node, ...props}) => <ol style={{ paddingLeft: '30px', marginBottom: '18px' }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: '10px' }} {...props} />,
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div style={{ borderRadius: '8px', overflow: 'hidden', margin: '15px 0', border: '1px solid #333' }}>
                  <div style={{ background: '#1e1e1e', padding: '8px 15px', fontSize: '14px', color: '#888', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{match[1]}</span>
                  </div>
                  <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '15px', fontSize: '16px' }} {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code style={{ background: '#333', padding: '4px 8px', borderRadius: '6px', color: '#ff9800', fontFamily: 'monospace' }} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {displayedText}
        </ReactMarkdown>

        {isTyping && (
          <span style={{ display: 'inline-block', width: '10px', height: '22px', background: '#3b82f6', marginLeft: '6px', verticalAlign: 'middle', animation: 'cursorBlink 0.8s infinite' }} />
        )}
      </div>

      {!isTyping && (
        <button onClick={handleCopy} style={{
          background: 'transparent', border: 'none', color: copied ? '#4ade80' : '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px', fontSize: '15px', fontFamily: "'Inter', sans-serif", padding: '5px 10px', borderRadius: '5px', transition: '0.3s'
        }} className="copy-btn">
          {copied ? '✔ Copied!' : '📋 Copy Text'}
        </button>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
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

  const recentChats = [
    "Thermodynamics Basics",
    "React Hooks UseEffect",
    "JEE Main 2026 Strategy",
    "Python API Integration"
  ];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    }, 600);

    const timer = setTimeout(() => setIsSidebarOpen(true), 1500);
    const starArray = Array.from({ length: 60 }).map(() => ({
      top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`, duration: `${Math.random() * 3 + 2}s`
    }));
    setStars(starArray);
    
    if (textareaRef.current) textareaRef.current.focus();

    return () => {
      clearTimeout(timer);
      clearTimeout(greetingTimer);
    };
  }, []);

  const handleNewChat = () => {
    setChatHistory([]);
    setIsChatStarted(false);
    setQuery('');
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus(); 
    }
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSearch = async (overrideQuery = null) => {
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim()) return;
    
    if (finalQuery.trim().toLowerCase() === 'clear') {
      handleNewChat();
      return; 
    }
    
    setIsChatStarted(true); 
    setChatHistory(prev => [...prev, { type: 'user', text: finalQuery }]);
    setQuery(''); 
    
    setIsFetching(true); 
    setIsGenerating(true); 
    setForceStopTyping(false); 

    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setTimeout(scrollToBottom, 100); 

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('http://127.0.0.1:8000/stream-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: finalQuery }),
        signal: abortControllerRef.current.signal
      });
      const data = await res.text();
      setIsFetching(false); 
      setChatHistory(prev => [...prev, { type: 'ai', text: data }]);
      setTimeout(scrollToBottom, 100); 
    } catch (err) {
      setIsFetching(false);
      setIsGenerating(false);
      if (err.name === 'AbortError') {
        setChatHistory(prev => [...prev, { type: 'ai', text: "Generation stopped." }]);
      } else {
        setChatHistory(prev => [...prev, { type: 'ai', text: "Backend Error: Check if your server is running." }]);
      }
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort(); 
    setForceStopTyping(true); 
    setIsFetching(false); 
    setIsGenerating(false); 
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating) handleSearch(); 
    }
  };

  const isInputEmpty = query.trim() === '';

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', background: '#000', overflow: 'hidden' }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600;700&display=swap');
          
          @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          @keyframes pulseText { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
          
          .katex { color: #8bb4f7; font-size: 1.1em; } 
          
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #555; }

          .suggest-chip { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s ease; }
          .suggest-chip:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.3); transform: translateY(-2px); }
          .sidebar-item { transition: 0.2s; }
          .sidebar-item:hover { background: rgba(255,255,255,0.1); }
          .copy-btn:hover { background: rgba(255,255,255,0.1) !important; }

          /* 🔥 GLOW EFFECT ON INPUT FOCUS */
          .search-bar-container { transition: all 0.3s ease; }
          .search-bar-container:focus-within {
            border-color: rgba(96, 165, 250, 0.5) !important;
            box-shadow: 0 0 15px rgba(96, 165, 250, 0.15) !important;
          }
        `}
      </style>

      {/* Sidebar */}
      <div style={{ width: isSidebarOpen ? '320px' : '0px', background: '#111', transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', overflow: 'hidden', borderRight: isSidebarOpen ? '1px solid #333' : 'none', display: 'flex', flexDirection: 'column', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '25px 25px 15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#fff' }}>
            <img src="/logo.png" style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="logo"/>
            <h2 style={{ fontSize: '20px', whiteSpace: 'nowrap', fontFamily: "'Poppins', sans-serif" }}>Acurithm AI</h2>
          </div>
          {/* 🔥 NEW SIDEBAR TOGGLE SVG */}
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#aaa'}>
            <SidebarToggleIcon />
          </button>
        </div>
        <div style={{ padding: '0 25px' }}>
          <button onClick={handleNewChat} style={{ width: '100%', padding: '14px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '12px', color: '#fff', fontSize: '16px', fontFamily: "'Poppins', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.3s' }}>
            <span style={{ fontSize: '22px', fontWeight: '500' }}>+</span> New Chat
          </button>
        </div>
        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          <p style={{ color: '#666', fontSize: '13px', fontWeight: '600', marginBottom: '15px', fontFamily: "'Inter', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>Recent</p>
          {recentChats.map((chat, i) => (
            <div key={i} className="sidebar-item" style={{ 
              padding: '12px 15px', borderRadius: '10px', 
              color: i === 0 ? '#fff' : '#e0e0e0', // 🔥 ACTIVE HIGHLIGHT
              background: i === 0 ? 'rgba(255,255,255,0.08)' : 'transparent', 
              fontSize: '15px', fontFamily: "'Inter', sans-serif", cursor: 'pointer', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' 
            }}>
              <span style={{ color: i === 0 ? '#fff' : '#888' }}><ChatBubbleIcon /></span> {chat}
            </div>
          ))}
        </div>
        
        <div style={{ padding: '20px 25px', borderTop: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <UserAvatarIcon />
            </div>
            <span style={{ color: '#fff', fontSize: '15px', fontFamily: "'Inter', sans-serif", fontWeight: '500' }}>Raushan</span>
          </div>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.transform='rotate(45deg)'} onMouseOut={e => e.currentTarget.style.transform='rotate(0deg)'}>
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* Main Screen */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: isChatStarted ? 'space-between' : 'center', paddingBottom: isChatStarted ? '30px' : '0' }}>
        
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} style={{ position: 'absolute', top: '30px', left: '30px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa', padding: '5px', zIndex: 10, transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#aaa'}>
            <SidebarToggleIcon />
          </button>
        )}

        {stars.map((s, i) => (
          <div key={i} style={{ position: 'absolute', top: s.top, left: s.left, width: s.size, height: s.size, background: 'white', borderRadius: '50%', opacity: 0.6, animation: `blink ${s.duration} infinite`, pointerEvents: 'none' }} />
        ))}

        <div ref={chatContainerRef} style={{ width: '100%', maxWidth: '1200px', flex: isChatStarted ? 1 : 'none', overflowY: isChatStarted ? 'auto' : 'visible', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: isChatStarted ? '80px' : '0', zIndex: 5 }}>
          
          {!isChatStarted && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: greeting ? 1 : 0, transition: 'opacity 0.8s ease-in' }}>
              <h1 style={{ marginBottom: '60px', minHeight: '50px', fontFamily: "'Poppins', sans-serif", fontWeight: '600', fontSize: '3.8rem', textAlign: 'center', background: 'linear-gradient(90deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', padding: '0 20px' }}>
                {greeting}
              </h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px', maxWidth: '850px', width: '100%', padding: '0 20px' }}>
                {promptSuggestions.map((suggestion, i) => (
                  <div key={i} onClick={() => handleSearch(suggestion.text)} className="suggest-chip" style={{ padding: '16px 22px', borderRadius: '16px', cursor: 'pointer', color: '#fff', fontSize: '16px', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '28px' }}>
                      {suggestion.icon}
                    </div>
                    {suggestion.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isChatStarted && chatHistory.map((msg, i) => (
            <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start', padding: '0 25px', marginBottom: '45px' }}>
              {msg.type === 'user' ? (
                <div style={{ background: '#252525', padding: '18px 30px', borderRadius: '30px 30px 8px 30px', color: '#fff', fontSize: '18px', border: '1px solid rgba(255, 255, 255, 0.05)', maxWidth: '75%', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.7', fontFamily: "'Poppins', sans-serif", fontWeight: '400' }}>
                  {msg.text}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '22px', maxWidth: '98%', alignItems: 'flex-start', width: '100%' }}>
                  <div style={{ minWidth: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '24px', marginTop: '2px', boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)' }}>
                    ✧
                  </div>
                  <AIResponseText text={msg.text} forceStop={forceStopTyping} onComplete={() => setIsGenerating(false)} scrollTrigger={scrollToBottom} />
                </div>
              )}
            </div>
          ))}

          {isFetching && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0 25px', marginBottom: '45px' }}>
              <div style={{ display: 'flex', gap: '22px', maxWidth: '95%', alignItems: 'center' }}>
                <div style={{ minWidth: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '24px' }}>
                  ✧
                </div>
                <div style={{ color: '#888', fontSize: '20px', fontStyle: 'italic', animation: 'pulseText 1.5s infinite', fontFamily: "'Inter', sans-serif" }}>
                  Acurithm is thinking...
                </div>
              </div>
            </div>
          )}
          {isChatStarted && <div style={{ height: '20px', width: '100%' }} />}
        </div>

        <div style={{ width: '90%', maxWidth: '950px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, marginTop: '20px' }}>
          
          {/* 🔥 SEARCH BAR CONTAINER WITH FOCUS GLOW */}
          <div className="search-bar-container" style={{ 
            width: '100%', background: 'rgba(37, 37, 37, 0.65)', borderRadius: '40px', padding: '12px 20px', 
            display: 'flex', alignItems: 'flex-end', gap: '15px', border: '1px solid rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'
          }}>
            
            <button style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', paddingBottom: '12px', display: 'flex', alignItems: 'center', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#aaa'}>
              <AttachmentIcon />
            </button>
            
            <textarea 
              ref={textareaRef} rows="1" value={query} onChange={handleInputChange} onKeyDown={handleKeyDown} autoFocus 
              placeholder="Ask Acurithm or type 'clear'..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', outline: 'none', fontFamily: "'Poppins', sans-serif", resize: 'none', maxHeight: '200px', overflowY: 'auto', lineHeight: '1.5', padding: '12px 0', margin: 0 }} 
              disabled={isGenerating} 
            />
            
            {!query.trim() && !isGenerating && (
              <button style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', paddingBottom: '12px', paddingRight: '5px', display: 'flex', alignItems: 'center', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#aaa'}>
                <MicIcon />
              </button>
            )}

            <button 
              onClick={isGenerating ? handleStop : () => handleSearch()} 
              disabled={isInputEmpty && !isGenerating}
              style={{ 
                background: isGenerating ? '#ef4444' : (isInputEmpty ? '#444' : '#e5e5e5'), 
                color: isGenerating ? '#fff' : (isInputEmpty ? '#888' : '#000'), 
                border: 'none', borderRadius: '50%', width: '45px', height: '45px', 
                cursor: isInputEmpty && !isGenerating ? 'default' : 'pointer', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.3s', marginBottom: '2px'
              }}>
              {isGenerating ? <div style={{ width: '14px', height: '14px', backgroundColor: '#fff', borderRadius: '3px' }} /> : <SendIcon />}
            </button>
          </div>

          {isChatStarted && (
            <div style={{ marginTop: '14px', fontSize: '13px', color: '#666', fontFamily: "'Inter', sans-serif" }}>
              Acurithm is AI and can make mistakes
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
export default App;