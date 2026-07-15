export type Branch = {
    id: number;
    name: string;
    is_global: boolean;
};

export type SportCategory = {
    id: number;
    sport_id: number;
    code: string;
    name: string;
    entry_type: 'single' | 'double' | 'team';
    player_count: number;
    gender_rule: 'male' | 'female' | 'mixed' | 'open' | string;
    sort_order: number;
    is_active: boolean;
};

export type Sport = {
    id: number;
    name: string;
    icon: string;
    max_players_per_team: number;
    description?: string;
    categories?: SportCategory[];
};

export type Activity = {
    id: number;
    branch_id?: number | null;
    branch?: Branch | null;
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

export type LeagueAward = {
    id: number;
    title: string;
    winner_label: string;
    sort_order?: number;
};

export type MatchFormatOption = {
    value: string;
    label: string;
    sets_to_win: number;
    points_per_set: number;
    deuce: boolean;
    completion_mode: 'first_to_win' | 'all_sets' | 'single_block';
};

export type LeagueEntry = {
    id: number;
    label: string;
    team?: Team | null;
    group_name?: string | null;
    group_picture_path?: string | null;
    seed?: number | null;
    player1: { id: number; name: string; gender?: string | null };
    player2?: { id: number; name: string; gender?: string | null } | null;
    substitute?: { id: number; name: string; gender?: string | null } | null;
    substitutes?: { id: number; name: string; gender?: string | null }[];
    players?: { id: number; name: string; gender?: string | null }[];
};

export type MatchSet = {
    id: number;
    set_number: number;
    home_points: number;
    away_points: number;
};

export type LeagueGroupStanding = {
    id: number;
    points: number;
    manual_advance_rank?: number | null;
    entry: LeagueEntry;
    played?: number;
    won?: number;
    lost?: number;
    score?: number;
    score_difference?: number;
};

export type LeagueStandingGroup = {
    group: string;
    entries: LeagueGroupStanding[];
};

export type Team = {
    id: number;
    branch_id?: number | null;
    branch?: Branch | null;
    name: string;
    logo_path?: string | null;
    sport_logo?: string | null;
    sports?: Sport[];
    members?: { id: number; name: string; email?: string; pivot?: { role: string } }[];
    members_count?: number;
    has_squad?: boolean;
};

export type League = {
    id: number;
    branch_id?: number | null;
    branch?: Branch | null;
    name: string;
    banner_url?: string | null;
    description?: string;
    documentation_url?: string | null;
    status: string;
    stage?: string;
    start_stage?: 'group' | 'bracket';
    sport_category_id?: number | null;
    category?: string | null;
    entry_type?: 'single' | 'double' | 'team' | null;
    match_format?: string | null;
    start_date: string;
    end_date?: string;
    participant_total?: number | null;
    group_count?: number | null;
    group_size?: number | null;
    group_locked?: boolean;
    sets_to_win?: number;
    points_per_set?: number;
    advance_upper_count?: number;
    advance_lower_count?: number;
    bracket_preset_enabled?: boolean;
    bracket_preset_reveal_at?: number | null;
    bracket_seed_count?: number;
    bracket_preset_slots?: (number | null)[] | null;
    sport: Sport;
    awards?: LeagueAward[];
    sport_category?: SportCategory | null;
    teams?: Team[];
    entries?: LeagueEntry[];
    groups?: {
        id: number;
        name: string;
        position: number;
        group_entries?: LeagueGroupStanding[];
        matches?: GameMatch[];
    }[];
    matches?: GameMatch[];
    upper_champion?: LeagueEntry | null;
    lower_champion?: LeagueEntry | null;
    third_place_match?: GameMatch | null;
    lower_third_place_match?: GameMatch | null;
};

export type MatchSubstitution = {
    id: number;
    match_id: number;
    entry_id: number;
    original_player_id: number;
    substitute_id: number;
    reason?: string | null;
    activated_at: string;
};

export type MatchDocument = {
    id: number;
    match_id: number;
    path: string;
    original_name: string;
    uploaded_by: number;
    created_at: string;
};

export type GameMatch = {
    id: number;
    status: string;
    locked?: boolean;
    stage?: string | null;
    round?: number | null;
    group?: {
        id: number;
        name: string;
        position: number;
    } | null;
    scheduled_at: string;
    location?: string | null;
    home_score: number;
    away_score: number;
    home_team?: Team | null;
    away_team?: Team | null;
    home_entry?: LeagueEntry | null;
    away_entry?: LeagueEntry | null;
    home_label?: string | null;
    away_label?: string | null;
    sets?: MatchSet[];
    substitutions?: MatchSubstitution[];
    documents?: MatchDocument[];
    next_match_id?: number | null;
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
    score_difference?: number;
};
