import React, { useState, useCallback, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BookmarkProps {
  name: string;
  ip: string;
  onSelect: (ip: string) => void;
  onDelete: (ip: string) => void;
}

export function Bookmark({ name, ip, onSelect, onDelete }: BookmarkProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const bookmarkRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const rect = bookmarkRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenuPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
    setShowContextMenu(true);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (bookmarkRef.current && !bookmarkRef.current.contains(event.target as Node)) {
      setShowContextMenu(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div ref={bookmarkRef} onContextMenu={handleContextMenu} className="relative">
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
      </TooltipProvider>
      
      {showContextMenu && (
        <div
          className="absolute z-50 bg-background border border-primary rounded shadow-md"
          style={{ top: `${contextMenuPosition.y}px`, left: `${contextMenuPosition.x}px` }}
        >
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive/80 p-2 flex items-center"
            onClick={() => {
              onDelete(ip);
              setShowContextMenu(false);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

