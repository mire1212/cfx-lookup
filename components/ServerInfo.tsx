import React, { useState } from 'react';
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ServerData, Player } from '../types';
import { PlayerCard } from './PlayerCard';

interface ServerInfoProps {
  serverData: ServerData;
  setActiveTab: (tab: 'fivem' | 'discord' | 'steam') => void;
  setInitialDiscordId: (id: string) => void;
  setInitialSteamHex: (hex: string) => void;
}

export function ServerInfo({ serverData, setActiveTab, setInitialDiscordId, setInitialSteamHex }: ServerInfoProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'name' | 'id'>('name');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stripColorCodes = (text: string) => {
    return text.replace(/\^[0-9]/g, '');
  };

  const filteredPlayers = serverData.Data.players
    .filter((player) => {
      if (searchField === 'id') {
        return player.id.toString().includes(searchTerm.toLowerCase());
      }
      return player.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      // Sort numbers and special characters first
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="terminal-text text-lg sm:text-xl md:text-2xl font-bold">
        {isLoading ? (
          <Skeleton className="h-8 w-3/4 bg-muted" />
        ) : (
          `${stripColorCodes(serverData.Data.hostname)} - ${serverData.Data.clients}/${serverData.Data.sv_maxclients} Players`
        )}
      </h2>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search players"
          className="flex-grow bg-muted text-foreground border-primary h-12"
        />
        <Select value={searchField} onValueChange={(value) => setSearchField(value as 'name' | 'id')}>
          <SelectTrigger className="w-full sm:w-[180px] bg-muted text-foreground border-primary h-12">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">Search by ID</SelectItem>
            <SelectItem value="name">Search by Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[200px] w-full bg-muted" />
          ))
        ) : (
          filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              setActiveTab={setActiveTab}
              setInitialDiscordId={setInitialDiscordId}
              setInitialSteamHex={setInitialSteamHex}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}
