
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export function SearchableSelect({ 
  value, 
  onValueChange, 
  options, 
  placeholder = "Buscar...",
  className
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleSelect = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn("text-left", !value && "text-muted-foreground")}>
          {value || placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        )}
      </Button>
      
      {isOpen && (
        <Card className="absolute z-50 mt-1 w-full shadow-md">
          <div className="p-2">
            <Input
              placeholder={`Buscar en ${options.length} opciones...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-2 text-center text-sm text-muted-foreground">
                No se encontraron opciones
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={`${option}-${index}`}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value === option && "bg-accent"
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {value === option && <Check className="h-4 w-4" />}
                  </span>
                  {option}
                </button>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
