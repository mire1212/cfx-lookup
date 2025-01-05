import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  setActiveTab: (tab: string) => void;
  setInitialDiscordId: (id: string) => void;
}

export function PlayerCard({ player, setActiveTab, setInitialDiscordId }: PlayerCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.split(':')[1]);
  };

  const handleDiscordClick = (identifier: string) => {
    const discordId = identifier.split(':')[1];
    setInitialDiscordId(discordId);
    setActiveTab('discord');
  };

  return (
    <div className="bg-card text-card-foreground border border-primary p-4 rounded-lg">
      <h3 className="text-lg terminal-text font-bold mb-2">{player.name}</h3>
      <div className="space-y-2">
        <p className="text-sm">Ping: {player.ping}ms</p>
        <p className="text-sm">ID: {player.id}</p>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Identifiers:</p>
          {player.identifiers.map((identifier, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-xs"
            >
              <span className="truncate mr-2">{identifier}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  identifier.startsWith('discord:')
                    ? handleDiscordClick(identifier)
                    : copyToClipboard(identifier)
                }
                className="hover:bg-primary hover:text-primary-foreground h-8 w-8 min-w-[32px]"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

