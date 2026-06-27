// ... (Imports remain same)

function App() {
  // ... (State logic same)

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000', color: '#fff' }}>
      {/* Sidebar */}
      <div className="sidebar-wrapper" style={{ width: sidebarOpen ? '260px' : '0px', transition: '0.3s', background: '#0f0f0f', borderRight: '1px solid #222', overflow: 'hidden' }}>
        <div className="recent-header">
          <span>Recent</span>
          <button style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>+</button>
        </div>
        <div style={{ padding: '0 20px' }}>
            <button onClick={() => setChatHistory([])} style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', width: '100%', cursor: 'pointer' }}>Clear History</button>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', position: 'relative' }}>
        <div className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <SidebarIcon />
        </div>
        
        {/* Centered Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: chatHistory.length === 0 ? 'center' : 'flex-start', width: '100%', maxWidth: '750px', paddingTop: chatHistory.length === 0 ? '0' : '60px' }}>
            {chatHistory.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '40px', fontWeight: '500' }}>How can I help you?</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {["Explain Quantum Physics", "JEE Strategy 2026", "Solve Calculus", "Organic Chemistry"].map(t => (
                    <button key={t} className="suggestion-card" onClick={() => handleSearch(t)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#ccc', padding: '20px', borderRadius: '15px', textAlign: 'left', cursor: 'pointer' }}>{t}</button>
                ))}
                </div>
            </div>
            ) : (
            chatHistory.map((msg, i) => (
                <div key={i} style={{ marginBottom: '30px', padding: '15px', background: msg.type === 'user' ? '#1a1a1a' : 'transparent', borderRadius: '15px' }}>
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.text}</ReactMarkdown>
                </div>
            ))
            )}
        </div>

        {/* Floating Input */}
        <div style={{ width: '100%', maxWidth: '700px', background: '#1a1a1a', borderRadius: '30px', padding: '15px 20px', display: 'flex', alignItems: 'center', border: '1px solid #333' }}>
          <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter a prompt here" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', resize: 'none', fontSize: '16px', maxHeight: '100px' }} />
          <button onClick={() => handleSearch()} style={{ background: '#fff', borderRadius: '50%', padding: '10px', border: 'none', cursor: 'pointer', marginLeft: '10px' }}><SendIcon /></button>
        </div>
      </div>
    </div>
  );
}