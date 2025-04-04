import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export function Search({
  onSearch,
  placeholder = "Tìm kiếm sản phẩm...",
  className,
  compact = false
}: SearchProps) {
  const [query, setQuery] = useState<string>("");
  const [expanded, setExpanded] = useState<boolean>(!compact);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onSearch) {
      onSearch("");
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        compact &&
        expanded &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        query === ""
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [compact, expanded, query]);

  return (
    <div
      className={cn(
        "relative flex items-center transition-all duration-300",
        compact && !expanded ? "w-10" : "w-full md:w-80",
        className
      )}
    >
      {compact && !expanded ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpand}
          className="rounded-full h-10 w-10 p-0"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
      ) : (
        <>
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className={cn(
                "pl-9 pr-8 py-2 w-full bg-background border-border",
                "focus-visible:ring-1 focus-visible:ring-primary"
              )}
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {compact && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleExpand}
              className="ml-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
