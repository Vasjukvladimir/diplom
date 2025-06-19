import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { MessageSquareText, Upload, ArrowLeftCircle, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'chatAI_log';

export default function Chat() {
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setChatLog(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatLog));
  }, [chatLog]);

  useEffect(() => {
    fetch('http://localhost:5168')
      .then(() => console.log('[Startup] Сервер доступен'))
      .catch(() => console.warn('[Startup] Сервер НЕ доступен'));
  }, []);

  async function askAI(question: string) {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5168/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[askAI] Ошибка сервера: ${response.status} - ${errorText}`);
        return `Ошибка сервера: ${response.statusText}`;
      }

      const data = await response.json();
      const aiText = data.response?.trim();
      return aiText || 'ИИ ничего не ответил.';
    } catch (error) {
      console.error('[askAI] Исключение:', error);
      return 'Произошла ошибка при обращении к ИИ.';
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!input.trim()) return;
    const question = input.trim();
    setInput('');
    setChatLog((prev) => [...prev, { role: 'user', text: question }]);
    const answer = await askAI(question);
    setChatLog((prev) => [...prev, { role: 'ai', text: answer }]);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt')) {
      alert('Можно загрузить только .txt файлы');
      return;
    }

    try {
      const content = await file.text();
      const promptAddition = `\n\n[Файл: ${file.name}]\n${content}`;
      setInput((prev) => prev + promptAddition);
    } catch (error) {
      console.error('Ошибка при чтении файла:', error);
      alert('Ошибка при чтении файла');
    } finally {
      e.target.value = '';
    }
  }

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.brand}>We AI</div>
          <h1 style={styles.title}><MessageSquareText size={24} style={{ marginRight: 8 }} />Разговор с ChatAI</h1>

          <div style={styles.chatBox}>
            {chatLog.length === 0 && <p style={styles.subtitle}>Задайте вопрос или начните диалог с ИИ.</p>}
            {chatLog.map((entry, index) => (
              <div key={index} style={entry.role === 'user' ? styles.userMessage : styles.aiMessage}>
                {entry.text}
              </div>
            ))}
            {loading && <p style={{ color: '#bdaaff', fontStyle: 'italic', textAlign: 'center' }}>ИИ думает...</p>}
          </div>

          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Введите сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
            />
            <button onClick={handleSend} style={styles.button} disabled={loading || !input.trim()}>
              {loading ? 'Отправка...' : 'Отправить'}
            </button>
          </div>

          <div style={{ marginTop: 10, marginBottom: 20 }}>
            <label style={styles.uploadLabel}>
              <Upload size={18} style={{ marginRight: 6 }} /> Загрузить .txt файл
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                disabled={loading}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.button} onClick={() => navigate({ to: '/' })}>
              <ArrowLeftCircle size={18} style={{ marginRight: 6 }} /> Назад на главную
            </button>
            <button
              style={styles.button}
              onClick={() => {
                setChatLog([]);
                localStorage.removeItem(STORAGE_KEY);
              }}
            >
              <Trash2 size={18} style={{ marginRight: 6 }} /> Очистить чат
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    background: 'radial-gradient(circle at top, #1c1c2b, #0a0a0a)',
    color: '#c2aaff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: `'Orbitron', sans-serif`,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: '#141414',
    borderRadius: '16px',
    padding: '30px 25px',
    border: '1px solid #3f2b60',
    boxShadow: '0 0 12px #4d2c75',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center' as const,
  },
  brand: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#c2aaff',
    textShadow: '0 0 10px #b16eff',
    marginBottom: '10px',
  },
  title: {
    fontSize: '1.8rem',
    color: '#c2aaff',
    textShadow: '0 0 8px #b16eff',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#bdaaff',
    textAlign: 'center' as const,
    textShadow: '0 0 6px #a174e9',
    marginBottom: '10px',
  },
  chatBox: {
  flex: 1,
  width: '100%',
  height: '500px', // ← увеличили высоту
  maxHeight: '500px', // ← увеличили максимальную высоту
  overflowY: 'auto' as const,
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  padding: '18px',
  boxShadow: '0 0 12px #4d2c75 inset',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '14px',
  marginBottom: '24px',
},
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3a2b5c',
    padding: '10px 15px',
    borderRadius: '15px 15px 0 15px',
    color: '#c2aaff',
    maxWidth: '75%',
    wordBreak: 'break-word' as const,
    boxShadow: '0 0 8px #7444aa',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2c3a5c',
    padding: '10px 15px',
    borderRadius: '15px 15px 15px 0',
    color: '#c2aaff',
    maxWidth: '75%',
    wordBreak: 'break-word' as const,
    boxShadow: '0 0 8px #9b67e1',
  },
  inputGroup: {
    display: 'flex',
    width: '100%',
    gap: '10px',
    marginBottom: '10px',
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #7444aa',
    backgroundColor: '#1a1a1a',
    color: '#c2aaff',
    outline: 'none',
    boxShadow: '0 0 6px #7444aa inset',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    alignItems: 'center',
  },
  button: {
    padding: '12px 22px',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '1px solid #7444aa',
    backgroundColor: '#1a1a1a',
    color: '#c2aaff',
    transition: 'all 0.3s ease',
    textShadow: '0 0 6px #9b67e1',
    boxShadow: '0 0 8px #4d2c75',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  } as React.CSSProperties,
  uploadLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#c2aaff',
    border: '1px dashed #7444aa',
    borderRadius: '8px',
    padding: '10px 20px',
    backgroundColor: '#1a1a1a',
    textShadow: '0 0 6px #7444aa',
    boxShadow: '0 0 6px #3a2b5c',
    userSelect: 'none' as const,
  },
};
