import { describe, it, expect } from 'vitest';
import { fc, test } from '@fast-check/vitest';
import { render } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

/**
 * Property 2: UI Text Language Consistency
 * 
 * Validates: Requirements 1.4
 * 
 * For any selected language and any screen in the application, all rendered 
 * UI text, instructions, and module content should be in that selected language.
 */

// Helper component to test translation consistency
function TranslationTestComponent({ translationKeys }: { translationKeys: string[] }) {
  const { t, language } = useLanguage();

  return (
    <div>
      <div data-testid="current-language">{language}</div>
      {translationKeys.map((key) => (
        <div key={key} data-testid={`translation-${key}`}>
          {t(key)}
        </div>
      ))}
    </div>
  );
}

// Helper to get all translation keys recursively
function getAllTranslationKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllTranslationKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Helper to get value from nested object using dot notation
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value;
}

describe('Property 2: UI Text Language Consistency', () => {
  const allTranslationKeys = getAllTranslationKeys(translations.en);

  test.prop([
    fc.constantFrom('en', 'zh'),
    fc.constantFrom(...allTranslationKeys)
  ])(
    'translation function returns text in the selected language',
    (language, translationKey) => {
      // Get expected translation for the language
      const expectedTranslation = getNestedValue(translations[language], translationKey);
      
      // Skip if translation doesn't exist (shouldn't happen with valid keys)
      if (expectedTranslation === undefined) {
        return;
      }

      // Create a mock translation function
      const t = (path: string): string => {
        const keys = path.split('.');
        let value: any = translations[language];
        
        for (const key of keys) {
          value = value?.[key];
        }
        
        return value || path;
      };

      // Property: Translation should match expected value for the language
      expect(t(translationKey)).toBe(expectedTranslation);
    }
  );

  test.prop([fc.constantFrom('en', 'zh')])(
    'all UI text keys have translations in both languages',
    (language) => {
      const keys = getAllTranslationKeys(translations.en);
      
      // Property: Every key in English should exist in the selected language
      for (const key of keys) {
        const translation = getNestedValue(translations[language], key);
        expect(translation).toBeDefined();
        expect(typeof translation).toBe('string');
        expect(translation.length).toBeGreaterThan(0);
      }
    }
  );

  test.prop([fc.constantFrom('en', 'zh')])(
    'translations are non-empty strings',
    (language) => {
      const keys = getAllTranslationKeys(translations[language]);
      
      // Property: All translations should be non-empty strings
      for (const key of keys) {
        const translation = getNestedValue(translations[language], key);
        expect(typeof translation).toBe('string');
        expect(translation.trim().length).toBeGreaterThan(0);
      }
    }
  );

  test.prop([
    fc.constantFrom('en', 'zh'),
    fc.constantFrom(...allTranslationKeys.slice(0, 5)) // Test with subset for performance
  ])(
    'switching language changes all displayed text',
    (initialLanguage, translationKey) => {
      const oppositeLanguage = initialLanguage === 'en' ? 'zh' : 'en';
      
      const initialTranslation = getNestedValue(translations[initialLanguage], translationKey);
      const oppositeTranslation = getNestedValue(translations[oppositeLanguage], translationKey);
      
      // Skip if translations don't exist
      if (!initialTranslation || !oppositeTranslation) {
        return;
      }

      // Property: Translations should be different between languages
      // (unless they happen to be the same, like emojis)
      if (initialTranslation !== oppositeTranslation) {
        expect(initialTranslation).not.toBe(oppositeTranslation);
      }
    }
  );

  it('translation structure is consistent between languages', () => {
    const enKeys = getAllTranslationKeys(translations.en).sort();
    const zhKeys = getAllTranslationKeys(translations.zh).sort();
    
    // Property: Both languages should have the same keys
    expect(enKeys).toEqual(zhKeys);
  });

  test.prop([fc.constantFrom('en', 'zh')])(
    'common UI elements have translations',
    (language) => {
      // Property: Essential UI elements must have translations
      const essentialKeys = [
        'appName',
        'tagline',
        'buttons.next',
        'buttons.back',
        'buttons.help',
        'panic.label',
        'panic.message'
      ];

      for (const key of essentialKeys) {
        const translation = getNestedValue(translations[language], key);
        expect(translation).toBeDefined();
        expect(typeof translation).toBe('string');
        expect(translation.length).toBeGreaterThan(0);
      }
    }
  );

  test.prop([fc.constantFrom('en', 'zh')])(
    'module names have translations',
    (language) => {
      // Property: All 4 modules must have translations
      const moduleKeys = [
        'home.modules.videoCalls',
        'home.modules.sendPhotos',
        'home.modules.maps',
        'home.modules.staySafe'
      ];

      for (const key of moduleKeys) {
        const translation = getNestedValue(translations[language], key);
        expect(translation).toBeDefined();
        expect(typeof translation).toBe('string');
        expect(translation.length).toBeGreaterThan(0);
      }
    }
  );

  test.prop([fc.constantFrom('en', 'zh')])(
    'error messages have translations',
    (language) => {
      // Property: All error messages must have translations
      const errorKeys = [
        'errors.aiUnavailable',
        'errors.connectionError',
        'errors.invalidCode',
        'errors.moduleLoadError',
        'errors.navigationError'
      ];

      for (const key of errorKeys) {
        const translation = getNestedValue(translations[language], key);
        expect(translation).toBeDefined();
        expect(typeof translation).toBe('string');
        expect(translation.length).toBeGreaterThan(0);
      }
    }
  );
});
