import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BookmarkProps {
  name: string;
  ip: string;
  onSelect: (ip: string) => void;
  onDelete: (ip: string) => void;
}

export function Bookmark({ name, ip, onSelect, onDelete }: BookmarkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 p-0 h-auto"
            onClick={() => onSelect(ip)}
          >
            <span className="flex flex-col items-center">
              <span className="text-sm">&lt;/{name}&gt;</span>
              <span className="w-full h-[1px] bg-primary mt-1"></span>
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{ip}</p>
        </TooltipContent>
      </Tooltip>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary/80 ml-1"
        onClick={() => onDelete(ip)}
      >
        <X className="h-4 w-4" />
      </Button>
    </TooltipProvider>
  );
}

