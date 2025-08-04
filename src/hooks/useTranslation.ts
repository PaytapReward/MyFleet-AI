import { useEffect, useState } from 'react';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';

export const useTranslation = (text: string, targetLang?: SupportedLanguage) => {
  const { translate, currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      const target = targetLang || currentLanguage;
      
      if (target === 'en') {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const result = await translate(text, target);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(text); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, currentLanguage, targetLang, translate]);

  return {
    translatedText,
    isLoading,
    originalText: text,
  };
};