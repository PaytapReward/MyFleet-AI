import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/contexts/LanguageContext";

const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  const currentLangOption = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language.code)}
            className={`flex items-center justify-between ${
              currentLanguage === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-sm">{language.name}</span>
            <span className="text-xs text-muted-foreground">
              {language.nativeName}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;