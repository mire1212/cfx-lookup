import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function DiscordTab({ initialDiscordId, activeTab, isDisabled }: {
  initialDiscordId: string | null;
  activeTab: string;
  isDisabled: boolean;
}) {
  const [discordId, setDiscordId] = useState<string>(() => {
    const saved = localStorage.getItem('lastDiscordSearch');
    return initialDiscordId || saved || '';
  });
  
  const [userData, setUserData] = useState<any>(() => {
    const saved = localStorage.getItem('lastDiscordUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialDiscordId) {
      setDiscordId(initialDiscordId);
      fetchDiscordUserInfo(initialDiscordId);
    }
  }, [initialDiscordId]);

  const fetchDiscordUserInfo = async (id: string = discordId) => {
    if (!id.trim() || isDisabled) return;

    try {
      setError(null);
      setLoading(true);
      setUserData(null);

      const response = await fetch(`/api/discord-profile?discordId=${id}`);
      if (!response.ok) throw new Error("User not found or API error.");

      const data = await response.json();
      setUserData(data);
      
      // Save to localStorage
      localStorage.setItem('lastDiscordSearch', id);
      localStorage.setItem('lastDiscordUser', JSON.stringify(data));
    } catch (err) {
      setError("Failed to fetch user information. Please check the ID.");
    } finally {
      setLoading(false);
    }
  }
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
          disabled={isDisabled}
        />
        <Button
          onClick={() => fetchDiscordUserInfo()}
          disabled={loading || isDisabled}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full sm:w-auto"
        >
          {loading ? "Searching..." : "Search"}
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

      {userData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.avatar?.link || "https://cdn.discordapp.com/embed/avatars/0.png"} />
              <AvatarFallback>{userData.username?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold terminal-text">{userData.username}</h2>
              <p className="text-sm text-muted-foreground">ID: {userData.id}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p><strong>Created At:</strong> {new Date(userData.created_at).toLocaleString()}</p>
            
            {userData.badges?.length > 0 && (
              <div className="space-y-2">
                <strong>Badges:</strong>
                <div className="flex flex-wrap gap-2">
                  {userData.badges.map((badge: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {badge.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default DiscordTab;
