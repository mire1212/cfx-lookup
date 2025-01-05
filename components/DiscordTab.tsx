import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar,AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DiscordUser } from '../types';

interface DiscordTabProps {
  initialDiscordId: string | null;
  activeTab: string;
}

export function DiscordTab({ initialDiscordId, activeTab }: DiscordTabProps) {
  const [discordId, setDiscordId] = useState(initialDiscordId || '');
  const [userData, setUserData] = useState<DiscordUser | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchDiscordUserInfo = async () => {
    if (!discordId.trim()) return;

    setIsLoading(true);
    setError('');
    setUserData(null);

    try {
      const response = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${discordId}`);
      if (!response.ok) {
        throw new Error('User not found or API error');
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      setError('Failed to fetch user information. Please check the ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialDiscordId && activeTab === 'discord') {
      setDiscordId(initialDiscordId);
      fetchDiscordUserInfo();
    }
  }, [initialDiscordId, activeTab]);

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
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder="Enter Discord ID"
          className="flex-grow bg-muted text-foreground border-primary h-12"
        />
        <Button 
          onClick={fetchDiscordUserInfo} 
          disabled={isLoading}
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
                <AvatarImage src={userData?.avatar.link || 'https://cdn.discordapp.com/embed/avatars/0.png'} />
                <AvatarFallback>{userData?.username.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <h2 className="text-2xl font-bold terminal-text">{userData?.username}</h2>
              )}
              {isLoading ? (
                <Skeleton className="h-4 w-24 mt-2" />
              ) : (
                userData?.global_name && <p className="text-sm text-muted-foreground">{userData.global_name}</p>
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
                <p><strong>User ID:</strong> {userData?.id}</p>
                <p><strong>Created At:</strong> {new Date(userData?.created_at || '').toLocaleString()}</p>
                <div>
                  <strong>Badges:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData?.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground">
                        {badge.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

