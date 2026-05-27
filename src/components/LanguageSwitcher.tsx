import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { LANGUAGES } from "@/lib/i18n/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const current = LANGUAGES.find((l) => l.code === lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={`Change language (current: ${current?.name ?? lang})`}
          className="border-border/60 gap-1.5"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-xs uppercase tracking-wider">
            {current?.code}
          </span>
          <span className="sm:hidden">{current?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={lang === l.code ? "bg-primary/10 text-primary" : ""}
          >
            <span className="mr-2">{l.flag}</span>
            <span className="flex-1">{l.name}</span>
            <span className="text-xs uppercase text-muted-foreground">{l.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
