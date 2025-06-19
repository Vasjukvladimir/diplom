import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Home as HomeIcon, MessageSquareText, UserCircle2, FolderOpen } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.brand}>We AI</div>
        <p style={styles.subtitle}>Интеллектуальный помощник для работы с текстом и файлами</p>

        <div style={styles.card}>
          <h1 style={styles.title}>
            <HomeIcon size={28} style={{ marginRight: 10, verticalAlign: 'middle' }} />
            Добро пожаловать!
          </h1>
          <hr style={styles.divider} />

          <div style={styles.buttonGroup}>
            <button style={styles.button} onClick={() => navigate({ to: '/chat' })}>
              <MessageSquareText size={18} style={styles.icon} />
              Разговор с ИИ
            </button>
            <button style={styles.button} onClick={() => navigate({ to: '/storage' })}>
              <FolderOpen size={18} style={styles.icon} />
              Хранилище
            </button>
            <button style={styles.button} onClick={() => navigate({ to: '/profile' })}>
              <UserCircle2 size={18} style={styles.icon} />
              Профиль
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
  brand: {
    fontSize: '2.4rem',
    fontWeight: 'bold',
    color: '#c2aaff',
    textShadow: '0 0 12px #b16eff',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#a78bfa',
    textShadow: '0 0 4px #7444aa',
    marginBottom: '40px',
    textAlign: 'center' as const,
  },
  card: {
    backgroundColor: '#141414',
    borderRadius: '16px',
    padding: '40px 30px',
    border: '1px solid #3f2b60',
    boxShadow: '0 0 12px #4d2c75',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center' as const,
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
  divider: {
    border: 'none',
    borderTop: '1px solid #5c3c84',
    marginBottom: '25px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    alignItems: 'stretch',
  },
  button: {
    padding: '14px 24px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    borderRadius: '10px',
    border: '1px solid #7444aa',
    backgroundColor: '#1a1a1a',
    color: '#c2aaff',
    transition: 'all 0.3s ease',
    textShadow: '0 0 6px #9b67e1',
    boxShadow: '0 0 8px #4d2c75',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  } as React.CSSProperties,
  icon: {
    verticalAlign: 'middle',
  },
};
