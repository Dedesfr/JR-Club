import JRClubLayout from '@/Layouts/JRClubLayout';
import { formatJakartaDate, formatJakartaDateTime } from '@/lib/datetime';
import { GameMatch, League, Team } from '@/types/jrclub';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Dashboard({
    upcomingMatches,
    recentResults,
    teams,
    ongoingLeagues,
}: {
    upcomingMatches: GameMatch[];
    recentResults: GameMatch[];
    teams: Team[];
    ongoingLeagues: League[];
}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const getGreeting = () => {
        const hr = new Date().getHours();
        if (hr < 11) return 'Selamat Pagi';
        if (hr < 15) return 'Selamat Siang';
        if (hr < 19) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    return (
        <JRClubLayout active="Dashboard">
            <Head title="Dashboard" />

            <div className="mx-auto space-y-8 py-2 max-w-7xl">
                
                {/* Section: Hero Greeting & Quick Stats */}
                <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04),0px_0px_0px_1px_rgba(15,23,42,0.02)]">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="space-y-1">
                            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant/70">{todayStr}</span>
                            <h1 className="text-[1.5rem] font-bold tracking-tight text-on-surface">
                                {getGreeting()}, {user?.name.split(' ')[0]}
                            </h1>
                            <p className="text-xs text-on-surface-variant">
                                {user?.branch?.name || 'Pusat'} Branch · Member ID #{user?.id}
                            </p>
                        </div>
                        
                        {/* Quick Stats Grid */}
                        <div className="flex items-center gap-6 border-t border-outline-variant/10 pt-4 md:border-t-0 md:pt-0">
                            <div className="text-center">
                                <span className="block text-lg font-black text-primary">{teams.length}</span>
                                <span className="text-[0.625rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Teams</span>
                            </div>
                            <div className="h-6 w-px bg-outline-variant/20"></div>
                            <div className="text-center">
                                <span className="block text-lg font-black text-primary">{upcomingMatches.length}</span>
                                <span className="text-[0.625rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Active Matches</span>
                            </div>
                            <div className="h-6 w-px bg-outline-variant/20"></div>
                            <div className="text-center">
                                <span className="block text-lg font-black text-primary">{ongoingLeagues.length}</span>
                                <span className="text-[0.625rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Leagues</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Chips */}
                    <div className="mt-6 flex flex-wrap gap-2.5">
                        <Link 
                            href={route('activities.index')} 
                            className="inline-flex items-center gap-2 rounded-full bg-primary-fixed/40 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary transition-all hover:bg-primary-fixed hover:text-primary-container active:scale-[0.98] duration-150"
                        >
                            <span className="material-symbols-outlined text-[15px]">explore</span>
                            Browse Activities
                        </Link>
                        <Link 
                            href={route('leagues.index')} 
                            className="inline-flex items-center gap-2 rounded-full bg-primary-fixed/40 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary transition-all hover:bg-primary-fixed hover:text-primary-container active:scale-[0.98] duration-150"
                        >
                            <span className="material-symbols-outlined text-[15px]">sports_score</span>
                            Competitions
                        </Link>
                        <Link 
                            href={route('leaderboards.index')} 
                            className="inline-flex items-center gap-2 rounded-full bg-primary-fixed/40 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary transition-all hover:bg-primary-fixed hover:text-primary-container active:scale-[0.98] duration-150"
                        >
                            <span className="material-symbols-outlined text-[15px]">leaderboard</span>
                            Leaderboards
                        </Link>
                    </div>
                </section>

                {/* Two-Column Grid for Desktop Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Primary Area (Columns 1 & 2) */}
                    <div className="space-y-6 lg:col-span-2">
                        
                        {/* Section: Upcoming Matches */}
                        <DashboardSection
                            icon="calendar_today"
                            title="Upcoming Matches"
                            empty="No upcoming matches scheduled."
                        >
                            {upcomingMatches.map((match) => (
                                <MatchRow key={match.id} match={match} />
                            ))}
                        </DashboardSection>

                        {/* Section: Ongoing Competitions */}
                        <DashboardSection
                            icon="sports_score"
                            title="Ongoing Competitions"
                            empty="You are not enrolled in any active competition."
                        >
                            {ongoingLeagues.map((league) => (
                                <Link 
                                    key={league.id} 
                                    href={route('leagues.show', league.id)} 
                                    className="group flex items-center justify-between gap-4 rounded-xl bg-surface-container-lowest p-4 transition-all hover:bg-surface-container-low active:scale-[0.98] duration-150 shadow-[0px_4px_12px_rgba(15,23,42,0.02)]"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{league.name}</p>
                                        <p className="text-xs text-on-surface-variant mt-0.5">{league.sport.name}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="rounded-full bg-primary-fixed px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-primary">
                                            {league.status}
                                        </span>
                                        <span className="material-symbols-outlined text-base text-on-surface-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                                    </div>
                                </Link>
                            ))}
                        </DashboardSection>

                    </div>

                    {/* Sidebar Area (Column 3) */}
                    <div className="space-y-6">
                        
                        {/* Section: My Teams */}
                        <DashboardSection
                            icon="groups"
                            title="My Teams"
                            empty="You are not part of any team yet."
                        >
                            {teams.map((team) => (
                                <Link 
                                    key={team.id} 
                                    href={route('teams.show', team.id)} 
                                    className="group flex items-center gap-3.5 rounded-xl bg-surface-container-lowest p-4 transition-all hover:bg-surface-container-low active:scale-[0.98] duration-150 shadow-[0px_4px_12px_rgba(15,23,42,0.02)]"
                                >
                                    {team.logo_path ? (
                                        <img 
                                            src={`/storage/${team.logo_path}`} 
                                            alt={team.name} 
                                            className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm" 
                                        />
                                    ) : (
                                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-container text-on-surface-variant">
                                            <span className="material-symbols-outlined text-lg">group</span>
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{team.name}</p>
                                        <p className="text-xs text-on-surface-variant mt-0.5">{(team.sports ?? []).map((s) => s.name).join(', ')}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-base text-on-surface-variant group-hover:translate-x-0.5 transition-transform shrink-0">chevron_right</span>
                                </Link>
                            ))}
                        </DashboardSection>

                        {/* Section: Recent Results */}
                        <DashboardSection
                            icon="emoji_events"
                            title="Recent Results"
                            empty="No recent results."
                        >
                            {recentResults.map((match) => (
                                <MatchRow key={match.id} match={match} showResult />
                            ))}
                        </DashboardSection>

                    </div>

                </div>

            </div>
        </JRClubLayout>
    );
}

function DashboardSection({ icon, title, empty, children }: { icon: string; title: string; empty: string; children: React.ReactNode }) {
    const items = Array.isArray(children) ? children : [children];
    const hasContent = items.filter(Boolean).length > 0;

    return (
        <section className="space-y-3">
            <div className="flex items-center gap-2 px-1">
                <span className="material-symbols-outlined text-lg text-primary">{icon}</span>
                <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{title}</h2>
            </div>
            {hasContent ? (
                <div className="space-y-3">{children}</div>
            ) : (
                <div className="rounded-xl bg-surface-container-lowest p-6 text-center shadow-[0px_4px_12px_rgba(15,23,42,0.02)] border border-outline-variant/10">
                    <p className="text-sm text-on-surface-variant/75">{empty}</p>
                </div>
            )}
        </section>
    );
}

function MatchRow({ match, showResult = false }: { match: GameMatch; showResult?: boolean }) {
    const homeLabel = match.home_label ?? match.home_team?.name ?? 'TBC';
    const awayLabel = match.away_label ?? match.away_team?.name ?? 'TBC';

    return (
        <Link 
            href={route('matches.show', match.id)} 
            className="group flex items-center justify-between gap-4 rounded-xl bg-surface-container-lowest p-4 transition-all hover:bg-surface-container-low active:scale-[0.98] duration-150 shadow-[0px_4px_12px_rgba(15,23,42,0.02)]"
        >
            <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="rounded bg-surface-container px-2 py-0.5 text-[0.6rem] font-bold uppercase text-on-surface-variant">
                        {match.league?.sport?.name ?? 'Sport'}
                    </span>
                    <span className="text-[0.625rem] font-bold uppercase text-on-surface-variant/60 truncate max-w-[150px]">
                        {match.league?.name ?? ''}
                    </span>
                </div>
                <h3 className="truncate text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {homeLabel} <span className="font-medium text-on-surface-variant/60">vs</span> {awayLabel}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                    {match.scheduled_at ? (showResult ? formatJakartaDate(match.scheduled_at) : formatJakartaDateTime(match.scheduled_at)) : ''}
                </p>
            </div>
            {showResult ? (
                <span className="shrink-0 rounded bg-surface-container px-3 py-1.5 text-sm font-black tabular-nums text-on-surface">
                    {match.home_score} — {match.away_score}
                </span>
            ) : (
                <span className="material-symbols-outlined shrink-0 text-base text-on-surface-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
            )}
        </Link>
    );
}
