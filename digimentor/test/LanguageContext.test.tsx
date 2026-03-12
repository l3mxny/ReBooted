import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component that uses the language context
function TestComponent() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      <div data-testid="current-language">{language}</div>
      <div data-testid="translated-text">{t('appName')}</div>
      <button onClick={() => setLanguage('zh')}>Switch to Chinese</button>
      <button onClick={() => setLanguage('en')}>Switch to English</button>
    </div>
  );
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should default to English language', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-language').textContent).toBe('en');
  });

  it('should load saved language preference from localStorage', async () => {
    localStorageMock.setItem('rebooted_language', 'zh');

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Wait for useEffect to run
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(screen.getByTestId('current-language').textContent).toBe('zh');
  });

  it('should persist language selection to localStorage', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const switchButton = screen.getByText('Switch to Chinese');
    act(() => {
      switchButton.click();
    });

    expect(localStorageMock.getItem('rebooted_language')).toBe('zh');
  });

  it('should translate text based on current language', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Default English
    expect(screen.getByTestId('translated-text').textContent).toBe('ReBooted');

    // Switch to Chinese
    const switchButton = screen.getByText('Switch to Chinese');
    act(() => {
      switchButton.click();
    });

    expect(screen.getByTestId('translated-text').textContent).toBe('重启');
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Mock localStorage to throw an error
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = () => {
      throw new Error('localStorage is not available');
    };

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const switchButton = screen.getByText('Switch to Chinese');
    act(() => {
      switchButton.click();
    });

    // Should still update the language state even if localStorage fails
    expect(screen.getByTestId('current-language').textContent).toBe('zh');
    expect(consoleWarnSpy).toHaveBeenCalled();

    // Restore
    localStorageMock.setItem = originalSetItem;
    consoleWarnSpy.mockRestore();
  });
});
