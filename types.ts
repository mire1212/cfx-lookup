export interface ServerData {
  Data: {
    hostname: string;
    clients: number;
    sv_maxclients: number;
    players: Player[];
  };
}

export interface Player {
  id: number;
  name: string;
  ping: number;
  identifiers: string[];
}

export interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: {
    link: string;
  };
  created_at: string;
  badges: string[];
}

export interface BookmarkData {
  name: string;
  ip: string;
  color: string;
}

