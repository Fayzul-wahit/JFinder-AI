import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';

const INITIAL_MESSAGE = {
  id: 'init',
  role: 'ai',
  text: "Hi! I'm your JFinder AI Mentor. Ask me anything about your career, skills, or job preparation!"
};

const AIMentorFloat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const storedUser = (() => {
        try { return JSON.parse(localStorage.getItem('auth'))?.user; } catch { return null; }
      })();
      const currentUser = user || storedUser;

      const res = await api.post('/api/ai-mentor/chat', {
        message: trimmed,
        userId: currentUser?.id || currentUser?._id || ''
      });

      const reply = res.data?.data?.reply || res.data?.reply || 'I received your message!';
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: "Sorry, I couldn't connect right now. Please try again later."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating Chat Panel ── */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '340px',
          height: '460px',
          background: '#13132A',
          border: '1px solid #7C3AED',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 40px rgba(124,58,237,0.25)',
          overflow: 'hidden'
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid rgba(124,58,237,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(124,58,237,0.1)'
          }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>AI Mentor</div>
              <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '1px' }}>Ask me anything about your career</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#64748B', display: 'flex', alignItems: 'center',
                padding: '4px', borderRadius: '6px', transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#7C3AED transparent'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '9px 13px',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user' ? '#1E1B4B' : 'rgba(124,58,237,0.25)',
                  border: msg.role === 'user' ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(124,58,237,0.4)',
                  color: '#E2E8F0',
                  fontSize: '0.85rem',
                  lineHeight: 1.5
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 16px',
                  borderRadius: '14px 14px 14px 4px',
                  background: 'rgba(124,58,237,0.25)',
                  border: '1px solid rgba(124,58,237,0.4)',
                  display: 'flex', gap: '4px', alignItems: 'center'
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#9F67F7',
                      animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid rgba(124,58,237,0.2)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            background: 'rgba(10,10,26,0.5)'
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              disabled={isTyping}
              style={{
                flex: 1,
                background: '#0F0F2E',
                border: '1px solid rgba(124,58,237,0.4)',
                borderRadius: '10px',
                padding: '9px 12px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#7C3AED'}
              onBlur={e => e.target.style.borderColor = 'rgba(124,58,237,0.4)'}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: input.trim() && !isTyping ? '#7C3AED' : 'rgba(124,58,237,0.3)',
                border: 'none', cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0
              }}
            >
              <Send size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Trigger Button ── */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
        <button
          onClick={() => setOpen(prev => !prev)}
          title="AI Mentor"
          style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: '#7C3AED',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(124,58,237,0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.7)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.5)';
          }}
        >
          {open ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
        </button>
      </div>

      {/* Bounce animation for typing dots */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
};

export default AIMentorFloat;
