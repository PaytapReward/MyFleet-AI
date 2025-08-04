import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'kn';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  isTranslating: boolean;
  translate: (text: string, targetLang?: SupportedLanguage) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Simple in-memory cache for translations
const translationCache = new Map<string, string>();

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language') as SupportedLanguage;
    if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  const translate = async (text: string, targetLang?: SupportedLanguage): Promise<string> => {
    const target = targetLang || currentLanguage;
    
    // Return original text if target is English or same as input
    if (target === 'en' || !text.trim()) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${target}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    try {
      setIsTranslating(true);
      
      // For demo purposes, using a simple mapping for common words
      // In production, you would integrate with Google Translate API
      const commonTranslations: Record<string, Record<SupportedLanguage, string>> = {
        'MyFleet AI': {
          hi: 'माईफ्लीट एआई',
          kn: 'ಮೈಫ್ಲೀಟ್ ಎಐ',
          en: 'MyFleet AI'
        },
        'Welcome back': {
          hi: 'वापस स्वागत है',
          kn: 'ಮರಳಿ ಸ್ವಾಗತ',
          en: 'Welcome back'
        },
        'Fleet Overview': {
          hi: 'फ्लीट अवलोकन',
          kn: 'ಫ್ಲೀಟ್ ಸಮೀಕ್ಷೆ',
          en: 'Fleet Overview'
        },
        'Total Vehicles': {
          hi: 'कुल वाहन',
          kn: 'ಒಟ್ಟು ವಾಹನಗಳು',
          en: 'Total Vehicles'
        },
        'PayTap Balance': {
          hi: 'पेटैप बैलेंस',
          kn: 'ಪೇಟ್ಯಾಪ್ ಬ್ಯಾಲೆನ್ಸ್',
          en: 'PayTap Balance'
        },
        'Pending Challans': {
          hi: 'लंबित चालान',
          kn: 'ಬಾಕಿ ಚಲಾನ್‌ಗಳು',
          en: 'Pending Challans'
        },
        'Statement': {
          hi: 'विवरण',
          kn: 'ಹೇಳಿಕೆ',
          en: 'Statement'
        },
        'Add Money': {
          hi: 'पैसे जोड़ें',
          kn: 'ಹಣ ಸೇರಿಸಿ',
          en: 'Add Money'
        },
        'Link FASTag': {
          hi: 'फास्टैग लिंक करें',
          kn: 'ಫಾಸ್‌ಟ್ಯಾಗ್ ಲಿಂಕ್ ಮಾಡಿ',
          en: 'Link FASTag'
        },
        'Assign Driver': {
          hi: 'ड्राइवर असाइन करें',
          kn: 'ಚಾಲಕ ನಿಯೋಜಿಸಿ',
          en: 'Assign Driver'
        },
        'Track Vehicle': {
          hi: 'वाहन ट्रैक करें',
          kn: 'ವಾಹನವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
          en: 'Track Vehicle'
        },
        'Settings': {
          hi: 'सेटिंग्स',
          kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
          en: 'Settings'
        },
        'Logout': {
          hi: 'लॉग आउट',
          kn: 'ಲಾಗ್ ಔಟ್',
          en: 'Logout'
        }
      };

      // Try to find translation in common translations
      if (commonTranslations[text] && commonTranslations[text][target]) {
        const translation = commonTranslations[text][target];
        translationCache.set(cacheKey, translation);
        return translation;
      }

      // For other text, return original (in production, call Google Translate API here)
      translationCache.set(cacheKey, text);
      return text;
      
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      isTranslating,
      translate,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};