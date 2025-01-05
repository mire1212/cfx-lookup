import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserInfoProps {
  user: {
    id?: string;
    username?: string;
    avatar?: string;
  } | null;
  onLogout: () => void;
}

export function UserInfo({ user, onLogout }: UserInfoProps) {
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : undefined} />
        <AvatarFallback>{user.username ? user.username.charAt(0) : 'U'}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{user.username || 'Unknown User'}</span>
      <Button variant="ghost" size="sm" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}

