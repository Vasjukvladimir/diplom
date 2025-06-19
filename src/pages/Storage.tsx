import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { set, get, del, keys } from 'idb-keyval';

type StoredFile = {
  file: File;
  date: string;
};

type UploadedFile = {
  name: string;
  date: string;
  downloadUrl: string;
};

export default function Storage() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const loadFiles = async () => {
      const allKeys = await keys();
      const loadedFiles: UploadedFile[] = [];

      for (const key of allKeys) {
        if (typeof key === 'string') {
          const entry = await get<StoredFile>(key);
          if (entry) {
            const blobUrl = URL.createObjectURL(entry.file);
            loadedFiles.push({ name: key, date: entry.date, downloadUrl: blobUrl });
          }
        }
      }

      setUploadedFiles(loadedFiles);
    };

    loadFiles();
  }, []);

  const saveFiles = async (files: FileList) => {
    const now = new Date().toLocaleString();

    for (const file of Array.from(files)) {
      const storedFile: StoredFile = { file, date: now };
      await set(file.name, storedFile);
      const blobUrl = URL.createObjectURL(file);
      setUploadedFiles((prev) => [...prev, { name: file.name, date: now, downloadUrl: blobUrl }]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      saveFiles(e.target.files);
    }
  };

  const handleDelete = async (index: number) => {
    const file = uploadedFiles[index];
    await del(file.name);
    URL.revokeObjectURL(file.downloadUrl);
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        saveFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    },
    []
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.interfaceBox}>
          <div style={styles.brand}>We AI</div>
          <h1 style={styles.title}>📁 Хранилище файлов</h1>

          <div style={styles.dropZone} onDrop={handleDrop} onDragOver={handleDragOver}>
            <p style={styles.dropText}>Перетащи файлы сюда или выбери вручную</p>
            <label htmlFor="file-upload" style={styles.uploadLabel}>
              Загрузить файл
            </label>
            <input id="file-upload" type="file" multiple onChange={handleFileChange} style={styles.fileInput} />
          </div>

          {uploadedFiles.length > 0 && (
            <div style={styles.fileContainer}>
              <ul style={styles.fileList}>
                {uploadedFiles.map((file, idx) => (
                  <li key={idx} style={styles.fileItem}>
                    <span>
                      <strong>{file.name}</strong>{' '}
                      <span style={styles.date}>({file.date})</span>
                    </span>
                    <div style={styles.actions}>
                      <a href={file.downloadUrl} download={file.name} style={styles.downloadButton}>
                        Скачать
                      </a>
                      <button onClick={() => handleDelete(idx)} style={styles.deleteButton}>
                        Удалить
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
    flexDirection: 'column' as const,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '70px',
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
    gap: '24px',
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
  dropZone: {
    border: '2px dashed #7444aa',
    borderRadius: '10px',
    padding: '30px',
    textAlign: 'center' as const,
    width: '100%',
    backgroundColor: '#141414',
    boxShadow: '0 0 12px #472e6d',
    color: '#c2aaff',
    textShadow: '0 0 6px #b16eff',
  },
  dropText: {
    marginBottom: '10px',
    fontSize: '1rem',
    color: '#c2aaff',
    textShadow: '0 0 4px #9b67e1',
  },
  uploadLabel: {
    fontSize: '1rem',
    display: 'inline-block',
    marginTop: '10px',
    padding: '10px 20px',
    border: '1px solid #7444aa',
    borderRadius: '6px',
    backgroundColor: '#1a1a1a',
    color: '#c2aaff',
    cursor: 'pointer',
    textShadow: '0 0 6px #9b67e1',
    boxShadow: '0 0 8px #4d2c75',
  },
  fileInput: {
    display: 'none',
  },
  fileContainer: {
    width: '100%',
    maxHeight: '300px',
    overflowY: 'auto' as const,
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    boxShadow: 'inset 0 0 10px #4d2c75',
    padding: '12px',
  },
  fileList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    color: '#bdaaff',
    textShadow: '0 0 4px #a174e9',
  },
  fileItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#161616',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '10px',
    border: '1px solid #3f2b60',
    boxShadow: '0 0 6px #392454',
  },
  date: {
    fontSize: '0.85rem',
    color: '#a98fff',
    marginLeft: '6px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px',
    justifyContent: 'flex-end',
  },
  downloadButton: {
    backgroundColor: '#3c1e5f',
    color: '#ffe0ff',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    fontSize: '0.9rem',
    textDecoration: 'none',
    textShadow: '0 0 4px #d780ff',
    boxShadow: '0 0 6px #532b7a',
    transition: 'background-color 0.2s ease',
  },
  deleteButton: {
    backgroundColor: '#2d0e45',
    color: '#ffc4ff',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    textShadow: '0 0 4px #d780ff',
    transition: 'background-color 0.2s ease',
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
