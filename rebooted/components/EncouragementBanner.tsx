'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, update } from 'firebase/database';

interface Message {
  key: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export default function EncouragementBanner({ accessCode }: { accessCode: string }) {
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!accessCode) return;
    const msgsRef = ref(db, `users/${accessCode}/messages`);
    const unsub = onValue(msgsRef, (snapshot) => {
      if (!snapshot.exists()) { setMessage(null); return; }
      const all = snapshot.val() as Record<string, Omit<Message, 'key'>>;
      // Find latest unread
      const unread = Object.entries(all)
        .map(([key, val]) => ({ key, ...val }))
        .filter(m => !m.read)
        .sort((a, b) => b.timestamp - a.timestamp);
      setMessage(unread[0] ?? null);
    });
    return () => unsub();
  }, [accessCode]);

  const dismiss = async () => {
    if (!message) return;
    await update(ref(db, `users/${accessCode}/messages/${message.key}`), { read: true });
    setMessage(null);
  };

  if (!message) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
      borderRadius: '16px',
      padding: '16px 20px',
      margin: '16px 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      boxShadow: '0 2px 12px rgba(124,58,237,0.15)',
    }}>
      <span style={{ fontSize: '24px', flexShrink: 0 }}>💌</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#7C3AED', fontFamily: 'Nunito, sans-serif', marginBottom: '4px' }}>
          Message from your family:
        </p>
        <p style={{ fontSize: '16px', color: '#1F2937', fontFamily: 'Nunito, sans-serif', lineHeight: '1.5' }}>
          {message.text}
        </p>
      </div>
      <button
        onClick={dismiss}
        style={{ background: 'none', border: 'none', fontSize: '20px', color: '#7C3AED', cursor: 'pointer', flexShrink: 0, padding: '0 4px' }}
        aria-label="Dismiss message"
      >
        ✕
      </button>
    </div>
  );
}
