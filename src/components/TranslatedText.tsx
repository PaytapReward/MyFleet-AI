import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { SupportedLanguage } from '@/contexts/LanguageContext';

interface TranslatedTextProps {
  children: string;
  targetLang?: SupportedLanguage;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  showLoading?: boolean;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  children, 
  targetLang, 
  className = '',
  as: Component = 'span',
  showLoading = false
}) => {
  const { translatedText, isLoading } = useTranslation(children, targetLang);

  if (showLoading && isLoading) {
    return (
      <Component className={`${className} animate-pulse`}>
        {children}
      </Component>
    );
  }

  return (
    <Component className={className}>
      {translatedText}
    </Component>
  );
};

export default TranslatedText;