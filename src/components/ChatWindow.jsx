import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

const ENDPOINT = 'https://n8n.dkuaik.dev/webhook/chat-indava-rag';
const SESSION_KEY = 'chatbot_session_id';

function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

const WELCOME_MSG = `**¡Bienvenido al Chatbot de Indava!**\n\nConsulta la documentación de Indava en tiempo real gracias a la integración RAG (Retrieval Augmented Generation).\n\n*Escribe tu pregunta sobre procesos, herramientas o cualquier tema de la documentación y obtén respuestas inmediatas sin buscar manualmente.*`;

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: WELCOME_MSG },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const sessionId = getSessionId();
    const userMsg = { role: 'user', content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    setInput('');
    try {
      const payload = [
        {
          sessionId,
          action: 'sendMessage',
          chatInput: input,
        },
      ];
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const output = Array.isArray(data) ? data[0]?.output : data.output;
      setMessages((msgs) => [
        ...msgs,
        { role: 'bot', content: output },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { role: 'bot', content: 'Error al conectar con el servidor.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-indava-container">
      <div className="chatbot-header">
        <img src="/favicon.svg" alt="Indava Logo" className="indava-logo" />
        <div className="indava-title">Indava Chatbot RAG</div>
        <div className="indava-subtitle">Your goals. Our focus.</div>
      </div>
      <div className="chat-window">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role}>
              <div
                className="bubble"
                dangerouslySetInnerHTML={{ __html: marked.parse(msg.content.replace(/\n/g, '  \n')) }}
              />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="input-bar" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
      <style>{`
        .chatbot-indava-container {
          max-width: 520px;
          margin: 2.5rem auto;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px #0002;
          border: 2px solid #1a355e;
          font-family: 'Segoe UI', 'Arial', sans-serif;
        }
        .chatbot-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #1a355e;
          border-radius: 14px 14px 0 0;
          padding: 1.2rem 1rem 0.7rem 1rem;
        }
        .indava-logo {
          width: 60px;
          height: 60px;
          margin-bottom: 0.3rem;
        }
        .indava-title {
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .indava-subtitle {
          color: #b0c4de;
          font-size: 1rem;
          margin-top: 0.2rem;
          font-style: italic;
        }
        .chat-window {
          display: flex;
          flex-direction: column;
          height: 65vh;
          background: #f7fafd;
          border-radius: 0 0 14px 14px;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.2rem 1rem 0.5rem 1rem;
        }
        .user .bubble {
          background: #1a355e;
          color: #fff;
          align-self: flex-end;
        }
        .bot .bubble {
          background: #e3eaf6;
          color: #1a355e;
          align-self: flex-start;
        }
        .bubble {
          padding: 0.8em 1.1em;
          border-radius: 1.1em;
          margin-bottom: 0.6em;
          max-width: 85%;
          word-break: break-word;
          box-shadow: 0 1px 4px #0001;
          font-size: 1.05rem;
          line-height: 1.5;
        }
        .input-bar {
          display: flex;
          border-top: 1px solid #dbe3ef;
          padding: 0.7rem 0.7rem 0.7rem 0.7rem;
          background: #f7fafd;
          border-radius: 0 0 14px 14px;
        }
        .input-bar input {
          flex: 1;
          padding: 0.6em;
          border: 1.5px solid #1a355e;
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
        }
        .input-bar button {
          margin-left: 0.7em;
          padding: 0.6em 1.2em;
          border: none;
          background: #1a355e;
          color: #fff;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        .input-bar button:disabled {
          background: #b0c4de;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .chatbot-indava-container {
            max-width: 100vw;
            border-radius: 0;
            border: none;
          }
          .chat-window {
            height: 70vh;
            border-radius: 0 0 10px 10px;
          }
        }
      `}</style>
    </div>
  );
} 