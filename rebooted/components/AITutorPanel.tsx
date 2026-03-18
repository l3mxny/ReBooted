'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ModuleStep } from '@/lib/types';
import { generateStepWelcome } from '@/lib/ai-tutor-prompt';

interface AITutorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: ModuleStep;
  currentStepNumber: number;
  onAskQuestion: (question: string) => Promise<string>;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function makeWelcome(stepNumber: number, language: 'en' | 'zh'): Message {
  return { role: 'assistant', content: generateStepWelcome(stepNumber, language) };
}

export default function AITutorPanel({
  isOpen,
  onClose,
  currentStep,
  currentStepNumber,
  onAskQuestion,
}: AITutorPanelProps) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(() => [
    makeWelcome(currentStepNumber, language),
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const trackedStep = useRef(currentStepNumber);

  // When step changes, reset chat with new welcome message
  if (trackedStep.current !== currentStepNumber) {
    trackedStep.current = currentStepNumber;
  }

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset messages when step number changes
  useEffect(() => {
    setMessages([makeWelcome(currentStepNumber, language)]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepNumber]);

  // Universal suggested questions for every step
  const suggestedQuestions =
    language === 'zh'
      ? [
          `"${getKeyWord(currentStep, 'zh')}"是什么意思？`,
          '可以帮我翻译一下吗？',
          '可以解释得更简单一点吗？',
        ]
      : [
          `What does "${getKeyWord(currentStep, 'en')}" mean?`,
          'Can you translate that for me?',
          'Can you explain that more simply?',
        ];

  const handleSuggestedQuestion = async (question: string) => {
    await handleSendMessage(question);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await onAskQuestion(text);
      setTimeout(() => {
        const assistantMessage: Message = { role: 'assistant', content: response };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: t('errors.aiUnavailable'),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Show suggestions until the user has sent their first message
  const userHasSentMessage = messages.some((m) => m.role === 'user');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col animate-slide-in-right"
        style={{ maxHeight: '80vh' }}
      >
        {/* Header — Kiro banner */}
        <div className="relative border-b border-light-gray" style={{ borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
          <img
            src="/kiroBetter.webp"
            alt="Kiro mascot"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          {/* Dark gradient + text overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
              padding: '24px 16px 12px',
            }}
          >
            <p style={{ color: 'white', fontSize: '16px', fontFamily: 'Nunito', fontWeight: 600, textAlign: 'center' }}>
              Ask me anything! 问我任何问题！
            </p>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:opacity-80 transition-opacity flex items-center justify-center"
            style={{
              minWidth: '40px',
              minHeight: '40px',
              fontSize: '22px',
              background: 'rgba(0,0,0,0.35)',
              borderRadius: '50%',
            }}
            aria-label="Close AI Tutor"
          >
            ✕
          </button>
        </div>

        {/* Suggested Questions — shown until user sends first message */}
        {!userHasSentMessage && (
          <div className="p-6 border-b border-light-gray">
            <p className="text-senior-base text-medium-gray mb-4">
              {t('aiTutor.suggestedQuestions')}
            </p>
            <div className="flex flex-col gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left p-4 rounded-xl text-senior-sm text-dark-text hover:opacity-80 transition-colors"
                  style={{ minHeight: '48px', backgroundColor: '#EEE8F7' }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-soft-blue text-dark-text'
                    : 'bg-light-gray text-dark-text'
                }`}
              >
                <p className="text-senior-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-light-gray p-4 rounded-xl">
                <p className="text-senior-sm text-medium-gray">Typing... 正在输入...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-light-gray">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('aiTutor.placeholder')}
              className="flex-1 p-4 border-2 border-light-gray rounded-xl text-senior-sm focus:outline-none"
              style={{ minHeight: '56px' }}
              onFocus={(e) => (e.target.style.borderColor = '#7B5EA7')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              style={{ minWidth: '80px', minHeight: '56px', fontSize: '20px', backgroundColor: '#7B5EA7' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Extract a key word from the step title for the "What does X mean?" suggestion.
 */
function getKeyWord(step: ModuleStep, lang: 'en' | 'zh'): string {
  const title = step.title[lang];
  if (lang === 'zh') {
    return title;
  }
  const words = title.split(' ').filter((w) => w.length > 3);
  return words[words.length - 1] || title.split(' ').pop() || title;
}
