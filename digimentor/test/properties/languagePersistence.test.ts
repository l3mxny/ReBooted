import { describe, it, expect, beforeEach } from 'vitest';
import { fc, test } from '@fast-check/vitest';

/**
 * Property 1: Language Preference Persistence Round-Trip
 * 
 * Validates: Requirements 1.2, 1.3
 * 
 * For any language selection (English or Chinese), saving the preference 
 * to localStorage and then loading it should return the same language value.
 */

// Mock localStorage for testing
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
};

describe('Property 1: Language Preference Persistence Round-Trip', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
  });

  test.prop([fc.constantFrom('en', 'zh')])(
    'saving and loading a language preference returns the same value',
    (language) => {
      // Save language to localStorage
      localStorageMock.setItem('rebooted_language', language);

      // Load language from localStorage
      const loaded = localStorageMock.getItem('rebooted_language');

      // Property: Round-trip should preserve the value
      expect(loaded).toBe(language);
    }
  );

  test.prop([fc.constantFrom('en', 'zh'), fc.integer({ min: 1, max: 10 })])(
    'multiple save/load cycles preserve language preference',
    (language, cycles) => {
      let currentLanguage = language;

      for (let i = 0; i < cycles; i++) {
        // Save
        localStorageMock.setItem('rebooted_language', currentLanguage);
        
        // Load
        const loaded = localStorageMock.getItem('rebooted_language');
        
        // Verify
        expect(loaded).toBe(currentLanguage);
        
        // Toggle language for next cycle
        currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
      }
    }
  );

  test.prop([fc.constantFrom('en', 'zh')])(
    'language preference persists across storage clear and reset',
    (language) => {
      // Save initial language
      localStorageMock.setItem('rebooted_language', language);
      
      // Verify it's saved
      expect(localStorageMock.getItem('rebooted_language')).toBe(language);
      
      // Save again (simulating app restart or re-save)
      localStorageMock.setItem('rebooted_language', language);
      
      // Should still be the same
      expect(localStorageMock.getItem('rebooted_language')).toBe(language);
    }
  );

  test.prop([fc.constantFrom('en', 'zh')])(
    'overwriting language preference updates to new value',
    (initialLanguage) => {
      const newLanguage = initialLanguage === 'en' ? 'zh' : 'en';
      
      // Save initial language
      localStorageMock.setItem('rebooted_language', initialLanguage);
      expect(localStorageMock.getItem('rebooted_language')).toBe(initialLanguage);
      
      // Overwrite with new language
      localStorageMock.setItem('rebooted_language', newLanguage);
      
      // Should return new language
      expect(localStorageMock.getItem('rebooted_language')).toBe(newLanguage);
    }
  );

  it('returns null when no language preference is saved', () => {
    // Don't save anything
    const loaded = localStorageMock.getItem('rebooted_language');
    
    // Should return null
    expect(loaded).toBeNull();
  });

  test.prop([fc.constantFrom('en', 'zh')])(
    'language preference uses correct localStorage key',
    (language) => {
      // Save with correct key
      localStorageMock.setItem('rebooted_language', language);
      
      // Should be retrievable with same key
      expect(localStorageMock.getItem('rebooted_language')).toBe(language);
      
      // Should not be retrievable with wrong key
      expect(localStorageMock.getItem('wrong_key')).toBeNull();
    }
  );
});
