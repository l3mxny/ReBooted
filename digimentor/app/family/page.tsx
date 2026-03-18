'use client';

import { useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import FamilyDashboard from '@/components/FamilyDashboard';

export default function FamilyPage() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seniorData, setSeniorData] = useState<Record<string, unknown> | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = digits.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const snapshot = await get(ref(db, `users/${code}`));
      if (snapshot.exists()) {
        setSeniorData(snapshot.val());
      } else {
        setError('Code not found. Please check with your family member.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (seniorData) {
    return <FamilyDashboard data={seniorData} accessCode={digits.join('')} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', maxWidth: '480px', width: '100%', boxShadow: '0 8px 40px rgba(124,58,237,0.1)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#7C3AED', fontFamily: 'Nunito, sans-serif', marginBottom: '4px' }}>
            ReBooted
          </h1>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#1F2937', fontFamily: 'Nunito, sans-serif', marginBottom: '8px' }}>
            Family Portal
          </p>
          <p style={{ fontSize: '15px', color: '#6B7280', fontFamily: 'Nunito, sans-serif' }}>
            Enter your loved one&apos;s access code
          </p>
        </div>

        {/* 6-digit input */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: '56px',
                height: '64px',
                textAlign: 'center',
                fontSize: '28px',
                fontWeight: 700,
                fontFamily: 'Nunito, sans-serif',
                border: `2px solid ${d ? '#7C3AED' : '#D1D5DB'}`,
                borderRadius: '8px',
                outline: 'none',
                color: '#1F2937',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#7C3AED')}
              onBlur={e => (e.target.style.borderColor = digits[i] ? '#7C3AED' : '#D1D5DB')}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: '#EF4444', fontSize: '14px', textAlign: 'center', marginBottom: '16px', fontFamily: 'Nunito, sans-serif' }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            height: '52px',
            background: '#7C3AED',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 700,
            fontFamily: 'Nunito, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: '20px',
          }}
        >
          {loading ? 'Checking...' : 'View Progress / 查看进度'}
        </button>

        {/* Hint */}
        <p style={{ fontSize: '13px', color: '#9CA3AF', textAlign: 'center', fontFamily: 'Nunito, sans-serif', lineHeight: '1.5' }}>
          Don&apos;t have a code? Ask your family member to check their ReBooted app home screen.
        </p>
      </div>
    </div>
  );
}
