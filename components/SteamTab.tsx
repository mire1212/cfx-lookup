import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface SteamUser {
  personaname: string;
  avatarfull: string;
  profileurl: string;
  loccountrycode: string;
  lastlogoff: number;
  realname: string;
  personastate: number;
  steamid: string;
}

interface SteamTabProps {
  initialSteamHex: string | null;
  activeTab: string;
  isDisabled: boolean;
}

export function SteamTab({ initialSteamHex, activeTab, isDisabled }: SteamTabProps) {
  const [steamHex, setSteamHex] = useState(initialSteamHex || '');
  const [userData, setUserData] = useState<SteamUser | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchSteamUserInfo = async () => {
    if (!steamHex.trim()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setUserData(null);

    try {
      const response = await fetch(`/api/steam-profile?hex=${encodeURIComponent(steamHex)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch Steam profile.');
      }

      setUserData(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch user information. Please check the Steam Hex ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialSteamHex && activeTab === 'steam') {
      setSteamHex(initialSteamHex);
      fetchSteamUserInfo();
    }
  }, [initialSteamHex, activeTab]);

  const getPersonaState = (state: number): string => {
    const states = ['Offline', 'Online', 'Busy', 'Away', 'Snooze', 'Looking to Trade', 'Looking to Play'];
    return states[state] || 'Unknown';
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
          value={steamHex}
          onChange={(e) => setSteamHex(e.target.value)}
          placeholder="Enter Steam Hex ID (e.g., steam:110000138bc2bb3)"
          className="flex-grow bg-muted text-foreground border-primary h-12"
          disabled={isDisabled}
        />
        <Button
          onClick={fetchSteamUserInfo}
          disabled={isLoading || isDisabled}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full sm:w-auto"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
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

      {(userData || isLoading) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <Skeleton className="h-20 w-20 rounded-full" />
            ) : (
              <Avatar className="h-20 w-20">
                <AvatarImage src={userData?.avatarfull} />
                <AvatarFallback>{userData?.personaname?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
            )}
            <div>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <h2 className="text-2xl font-bold terminal-text">{userData?.personaname}</h2>
              )}
              {isLoading ? (
                <Skeleton className="h-4 w-24 mt-2" />
              ) : (
                userData?.realname && <p className="text-sm text-muted-foreground">{userData.realname}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </>
            ) : (
              <>
                <p><strong>Steam ID:</strong> {userData?.steamid}</p>
                <p>
                  <strong>Profile URL:</strong>{' '}
                  <a href={userData?.profileurl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {userData?.profileurl}
                  </a>
                </p>
                <p><strong>Country:</strong> {userData?.loccountrycode || 'N/A'}</p>
                <p><strong>Last Online:</strong> {userData?.lastlogoff ? new Date(userData.lastlogoff * 1000).toLocaleString() : 'N/A'}</p>
                <p><strong>Status:</strong> {userData?.personastate !== undefined ? getPersonaState(userData.personastate) : 'N/A'}</p>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

