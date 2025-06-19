import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { get, keys } from 'idb-keyval';

type StoredFile = {
  file: File;
  date: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const [entryTime, setEntryTime] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; date: string }[]>([]);

  useEffect(() => {
    const now = new Date().toLocaleString();
    setEntryTime(now);
  }, []);

  useEffect(() => {
    const loadUserFiles = async () => {
      const allKeys = await keys();
      const result: { name: string; date: string }[] = [];

      for (const key of allKeys) {
        if (typeof key === 'string') {
          const entry = await get<StoredFile>(key);
          if (entry) {
            result.push({ name: key, date: entry.date });
          }
        }
      }

      setUploadedFiles(result);
    };

    loadUserFiles();
  }, []);

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.interfaceBox}>
          <div style={styles.brand}>We AI</div>
          <h1 style={styles.title}>👤 Профиль гостя</h1>

          <p style={styles.text}>
            Вы вошли как <strong style={styles.glow}>Гость</strong>
          </p>
          <p style={styles.text}>
            Время входа: <strong style={styles.glow}>{entryTime}</strong>
          </p>

          <div style={styles.section}>
            <h2 style={styles.subtitle}>📦 Загруженные файлы</h2>
            {uploadedFiles.length === 0 ? (
              <p style={styles.text}>Файлы отсутствуют</p>
            ) : (
              <ul style={styles.fileList}>
                {uploadedFiles.map((file, idx) => (
                  <li key={idx} style={styles.fileItem}>
                    {file.name} <span style={styles.date}>({file.date})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button style={styles.button} onClick={() => navigate({ to: '/' })}>
            Назад на главную
          </button>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#0a0a0a',
    color: '#c2aaff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: `'Orbitron', sans-serif`,
  },
  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '60px',
    paddingBottom: '40px',
  },
  interfaceBox: {
    backgroundColor: '#131313',
    padding: '30px',
    borderRadius: '14px',
    border: '1px solid #7444aa',
    boxShadow: '0 0 25px #4d2c75',
    width: '90%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '20px',
  },
  brand: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#c2aaff',
    textShadow: '0 0 10px #b16eff',
  },
  title: {
    fontSize: '2.2rem',
    color: '#c2aaff',
    textShadow: '0 0 8px #b16eff',
  },
  subtitle: {
    fontSize: '1.4rem',
    color: '#bdaaff',
    textShadow: '0 0 6px #a174e9',
    marginBottom: '5px',
  },
  text: {
    fontSize: '1rem',
    color: '#bdaaff',
    textShadow: '0 0 4px #a174e9',
  },
  glow: {
    color: '#ffe0ff',
    textShadow: '0 0 6px #f090ff',
  },
  section: {
    width: '100%',
    marginTop: '20px',
  },
  fileList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    color: '#bdaaff',
    textShadow: '0 0 4px #a174e9',
  },
  fileItem: {
    padding: '8px 12px',
    marginBottom: '6px',
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    border: '1px solid #3f2b60',
    boxShadow: '0 0 6px #392454',
    fontSize: '0.95rem',
  },
  date: {
    fontSize: '0.85rem',
    color: '#a98fff',
    marginLeft: '6px',
  },
  button: {
    marginTop: '10px',
    padding: '14px 28px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '1px solid #7444aa',
    backgroundColor: '#1a1a1a',
    color: '#c2aaff',
    transition: 'all 0.3s ease',
    textShadow: '0 0 6px #9b67e1',
    boxShadow: '0 0 8px #4d2c75',
  } as React.CSSProperties,
};
