export type Sport = {
    id: number;
    name: string;
    icon: string;
    max_players_per_team: number;
    description?: string;
};

export type Activity = {
    id: number;
    title: string;
    description?: string;
    location: string;
    scheduled_at: string;
    max_participants: number;
    status: string;
    sport: Sport;
    participants?: { id: number; name: string; email?: string }[];
    participants_count?: number;
};

export type Team = {
    id: number;
    name: string;
    sport: Sport;
    members?: { id: number; name: string; email?: string; pivot?: { role: string } }[];
    members_count?: number;
};

export type League = {
    id: number;
    name: string;
    description?: string;
    status: string;
    start_date: string;
    sport: Sport;
    teams?: Team[];
    matches?: GameMatch[];
};

export type GameMatch = {
    id: number;
    status: string;
    scheduled_at: string;
    home_score: number;
    away_score: number;
    home_team: Team;
    away_team: Team;
    league?: League;
};

export type Standing = {
    team: Team;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goals_for: number;
    goals_against: number;
    points: number;
};
