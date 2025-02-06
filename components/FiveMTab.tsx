import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ServerInfo } from './ServerInfo';
import { Bookmark } from './Bookmark';
import { ServerData } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


interface FiveMTabProps {
  setActiveTab: (tab: 'fivem' | 'discord' | 'steam') => void;
  setInitialDiscordId: (id: string) => void;
  setInitialSteamHex: (hex: string) => void;
  serverData: ServerData | null;
  setServerData: React.Dispatch<React.SetStateAction<ServerData | null>>;
  serverIp: string;
  setServerIp: React.Dispatch<React.SetStateAction<string>>;
  isDisabled: boolean;
}

interface BookmarkData {
  name: string;
  ip: string;
  displayName: string;
}

export function FiveMTab({
  setActiveTab,
  setInitialDiscordId,
  setInitialSteamHex,
  serverData,
  setServerData,
  serverIp,
  setServerIp,
  isDisabled
}: FiveMTabProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [newBookmarkIp, setNewBookmarkIp] = useState('');
  const [newBookmarkDisplayName, setNewBookmarkDisplayName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDiscordAlert, setShowDiscordAlert] = useState(true);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem('serverBookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  const saveBookmarks = (newBookmarks: BookmarkData[]) => {
    localStorage.setItem('serverBookmarks', JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  const fetchServerInfo = async (ip: string) => {
    if (!ip.trim()) return;

    setIsLoading(true);
    setError('');
    setServerData(null);

    try {
      const response = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${ip}`);
      if (!response.ok) {
        throw new Error('Server not found or API error');
      }
      const data = await response.json();
      setServerData(data);
      setServerIp(ip);
    } catch (error) {
      setError('Failed to fetch server information. Please check the IP and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchServerInfo(serverIp);
  };

  const handleAddBookmark = async () => {
    if (newBookmarkIp && newBookmarkDisplayName) {
      setIsLoading(true);
      try {
        const response = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${newBookmarkIp}`);
        if (!response.ok) {
          throw new Error('Server not found or API error');
        }
        const data = await response.json();
        const newBookmark: BookmarkData = {
          name: data.Data.hostname.replace(/\^[0-9]/g, ''),
          ip: newBookmarkIp,
          displayName: newBookmarkDisplayName
        };
        const updatedBookmarks = [...bookmarks, newBookmark];
        saveBookmarks(updatedBookmarks);
        setNewBookmarkIp('');
        setNewBookmarkDisplayName('');
        setIsDialogOpen(false);
      } catch (error) {
        setError('Failed to add bookmark. Please check the IP and try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteBookmark = (ip: string) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.ip !== ip);
    saveBookmarks(updatedBookmarks);
  };

  return (
    <motion.div
      className="space-y-4 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          type="text"
          value={serverIp}
          onChange={(e) => setServerIp(e.target.value)}
          placeholder="Enter server IP"
          className="flex-grow bg-muted text-foreground border-primary h-12"
          disabled={isDisabled}
        />
        <Button 
          onClick={handleSearch} 
          disabled={isLoading || isDisabled} 
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full sm:w-auto"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {bookmarks.map((bookmark, index) => (
          <Bookmark
            key={index}
            name={bookmark.displayName}
            ip={bookmark.ip}
            onSelect={(ip) => {
              setServerIp(ip);
              fetchServerInfo(ip);
            }}
            onDelete={handleDeleteBookmark}
          />
        ))}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Bookmark</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Bookmark</DialogTitle>
              <DialogDescription>
                Enter a server IP and display name to create a new bookmark.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serverIp" className="text-right">
                  Server IP
                </Label>
                <Input
                  id="serverIp"
                  value={newBookmarkIp}
                  onChange={(e) => setNewBookmarkIp(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter server IP"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayName" className="text-right">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={newBookmarkDisplayName}
                  onChange={(e) => setNewBookmarkDisplayName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter display name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddBookmark} disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Bookmark'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {serverData && (
        <ServerInfo
          serverData={serverData}
          setActiveTab={setActiveTab}
          setInitialDiscordId={setInitialDiscordId}
          setInitialSteamHex={setInitialSteamHex}
        />
      )}
    </motion.div>
  );
}

