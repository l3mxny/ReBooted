'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, push, update } from 'firebase/database';

const curriculum = [
  { number: 1, theme: 'Staying Connected', modules: ['video-calls', 'send-photos', 'maps', 'stay-safe'] },
  { number: 2, theme: 'Getting Around', modules: ['using-transit', 'ordering-ride', 'saving-locations', 'finding-bus-schedules'] },
  { number: 3, theme: 'Everyday Tasks', modules: ['tracking-package', 'finding-post-office', 'paying-bills', 'filling-forms'] },
  { number: 4, theme: 'Food & Fun', modules: ['finding-restaurants', 'reading-reviews', 'making-reservation', 'ordering-delivery'] },
];

const moduleLabels: Record<string, string> = {
  'video-calls': 'Video Calls', 'send-photos': 'Send Photos', 'maps': 'Maps', 'stay-safe': 'Stay Safe',
  'using-transit': 'Using Transit', 'ordering-ride': 'Order a Ride', 'saving-locations': 'Save Locations', 'finding-bus-schedules': 'Bus Schedules',
  'tracking-package': 'Track Package', 'finding-post-office': 'Post Office', 'paying-bills': 'Pay Bills', 'filling-forms': 'Fill Forms',
  'finding-restaurants': 'Find Restaurants', 'reading-reviews': 'Read Reviews', 'making-reservation': 'Make Reservation', 'ordering-delivery': 'Order Delivery',
};

interface FamilyDashboardProps {
  data: Record<string, unknown>;
  accessCode: string;
}

interface ProgressData {
  completedModules?: string[];
  currentModule?: string | null;
  currentStep?: number;
  streak?: number;
  lastActiveDate?: string | null;
}

export default function FamilyDashboard({ data: initialData, accessCode }: FamilyDashboardProps) {
  const [data, setData] = useState<ProgressData>(initialData as ProgressData);
  const [isLive, setIsLive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const MAX_CHARS = 100;

  // Real-time listener
  useEffect(() => {
    const userRef = ref(db, `users/${accessCode}`);
    const unsub = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val() as ProgressData);
        setIsLive(true);
      }
    });
    return () => unsub();
  }, [accessCode]);

  const completedModules = data.completedModules ?? [];
  const streak = data.streak ?? 0;
  const lastActive = data.lastActiveDate;

  const getLastActiveText = useCallback(() => {
    if (!lastActive) return 'No activity yet';
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];
    if (lastActive === today) return 'Active today';
    if (lastActive === yesterday) return 'Active yesterday';
    return `Last active: ${lastActive}`;
  }, [lastActive]);

  const sendEncouragement = async () => {
    if (!message.trim()) return;
    const msgRef = ref(db, `users/${accessCode}/messages`);
    const newRef = push(msgRef);
    await update(newRef, { text: message.trim(), timestamp: new Date().getTime(), read: false });
    setSent(true);
    setTimeout(() => { setShowModal(false); setSent(false); setMessage(''); }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7FF', padding: '24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ background: '#7C3AED', borderRadius: '20px', padding: '28px 32px', marginBottom: '24px', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Nunito, sans-serif', marginBottom: '4px' }}>
                Family Progress
              </h1>
              <p style={{ fontSize: '15px', opacity: 0.85, fontFamily: 'Nunito, sans-serif' }}>
                {getLastActiveText()}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '6px 14px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isLive ? '#4ADE80' : '#9CA3AF' }} />
              <span style={{ fontSize: '13px', fontFamily: 'Nunito, sans-serif' }}>{isLive ? 'Live' : 'Offline'}</span>
            </div>
          </div>

          {/* Streak */}
          <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px 20px', display: 'inline-block' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Nunito, sans-serif' }}>
              🔥 {streak} Day Streak{streak >= 7 ? ' 🎉' : ''}
            </span>
          </div>
        </div>

        {/* Send Encouragement */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            width: '100%', height: '60px', background: '#7C3AED', color: 'white',
            border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 700,
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer', marginBottom: '24px',
            boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
          }}
        >
          💌 Send Encouragement
        </button>

        {/* Week Progress Cards */}
        {curriculum.map((week) => {
          const done = week.modules.filter(m => completedModules.includes(m)).length;
          const pct = (done / week.modules.length) * 100;
          return (
            <div key={week.number} style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Nunito, sans-serif' }}>
                    WEEK {week.number}
                  </p>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1F2937', fontFamily: 'Nunito, sans-serif' }}>
                    {week.theme}
                  </h3>
                </div>
                <span style={{ fontSize: '15px', color: '#6B7280', fontFamily: 'Nunito, sans-serif' }}>
                  {done}/{week.modules.length}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: '8px', background: '#EDE9FE', borderRadius: '4px', marginBottom: '16px' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: '#7C3AED', borderRadius: '4px', transition: 'width 0.5s' }} />
              </div>

              {/* Module list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {week.modules.map(m => {
                  const isComplete = completedModules.includes(m);
                  const isCurrent = data.currentModule === m;
                  return (
                    <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>{isComplete ? '✅' : '⭕'}</span>
                      <span style={{ fontSize: '15px', color: isComplete ? '#059669' : '#374151', fontFamily: 'Nunito, sans-serif', fontWeight: isComplete ? 600 : 400 }}>
                        {moduleLabels[m]}
                      </span>
                      {isCurrent && !isComplete && (
                        <span style={{ fontSize: '12px', color: '#7C3AED', background: '#EDE9FE', borderRadius: '8px', padding: '2px 8px', fontFamily: 'Nunito, sans-serif' }}>
                          Step {data.currentStep ?? 1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '440px', width: '100%' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1F2937', fontFamily: 'Nunito, sans-serif', marginBottom: '8px' }}>
              Send a message
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Nunito, sans-serif', marginBottom: '20px' }}>
              Your family member will see this on their home screen.
            </p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
              placeholder="You're doing great! Keep it up!"
              rows={3}
              style={{
                width: '100%', border: '2px solid #7C3AED', borderRadius: '10px',
                padding: '12px', fontSize: '16px', fontFamily: 'Nunito, sans-serif',
                resize: 'none', outline: 'none', marginBottom: '8px',
              }}
            />
            <p style={{ fontSize: '13px', color: '#9CA3AF', textAlign: 'right', marginBottom: '16px', fontFamily: 'Nunito, sans-serif' }}>
              {MAX_CHARS - message.length} characters remaining
            </p>
            {sent ? (
              <p style={{ textAlign: 'center', color: '#059669', fontWeight: 700, fontSize: '18px', fontFamily: 'Nunito, sans-serif' }}>
                ✅ Message sent!
              </p>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setShowModal(false); setMessage(''); }}
                  style={{ flex: 1, height: '48px', background: 'white', border: '2px solid #7C3AED', color: '#7C3AED', borderRadius: '10px', fontSize: '16px', fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={sendEncouragement}
                  disabled={!message.trim()}
                  style={{ flex: 1, height: '48px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: message.trim() ? 'pointer' : 'not-allowed', opacity: message.trim() ? 1 : 0.5 }}
                >
                  Send 💌
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
