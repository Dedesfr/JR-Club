import JRClubLayout from '@/Layouts/JRClubLayout';
import { formatJakartaDate, formatJakartaDateTime } from '@/lib/datetime';
import { GameMatch, League, Team } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';

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
    return (
        <JRClubLayout active="Dashboard">
            <Head title="Dashboard" />

            <div className="mx-auto max-w-2xl space-y-6 py-6">
                <h1 className="text-2xl font-black tracking-tight text-on-surface">My Dashboard</h1>

                <DashboardSection
                    icon="calendar_today"
                    title="Upcoming Matches"
                    empty="No upcoming matches."
                >
                    {upcomingMatches.map((match) => (
                        <MatchRow key={match.id} match={match} />
                    ))}
                </DashboardSection>

                <DashboardSection
                    icon="emoji_events"
                    title="Recent Results"
                    empty="No recent results."
                >
                    {recentResults.map((match) => (
                        <MatchRow key={match.id} match={match} showResult />
                    ))}
                </DashboardSection>

                <DashboardSection
                    icon="groups"
                    title="My Teams"
                    empty="You are not part of any team yet."
                >
                    {teams.map((team) => (
                        <Link key={team.id} href={route('teams.show', team.id)} className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3 transition hover:bg-surface-container">
                            {team.logo_path ? (
                                <img src={`/storage/${team.logo_path}`} alt={team.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                            ) : (
                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-container-high text-on-surface-variant">
                                    <span className="material-symbols-outlined text-base">group</span>
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="truncate font-bold text-on-surface">{team.name}</p>
                                <p className="text-[0.6875rem] text-on-surface-variant">{team.sport.name}</p>
                            </div>
                        </Link>
                    ))}
                </DashboardSection>

                <DashboardSection
                    icon="sports_score"
                    title="Ongoing Competitions"
                    empty="You are not enrolled in any active competition."
                >
                    {ongoingLeagues.map((league) => (
                        <Link key={league.id} href={route('leagues.show', league.id)} className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low px-4 py-3 transition hover:bg-surface-container">
                            <div className="min-w-0">
                                <p className="truncate font-bold text-on-surface">{league.name}</p>
                                <p className="text-[0.6875rem] text-on-surface-variant">{league.sport.name}</p>
                            </div>
                            <span className="shrink-0 rounded-full bg-surface-container px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-on-surface-variant">
                                {league.status}
                            </span>
                        </Link>
                    ))}
                </DashboardSection>
            </div>
        </JRClubLayout>
    );
}

function DashboardSection({ icon, title, empty, children }: { icon: string; title: string; empty: string; children: React.ReactNode }) {
    const items = Array.isArray(children) ? children : [children];
    const hasContent = items.filter(Boolean).length > 0;

    return (
        <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_4px_12px_rgba(15,23,42,0.06),0px_0px_0px_1px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-2 border-b border-outline-variant/20 bg-surface-container-low px-4 py-3">
                <span className="material-symbols-outlined text-base text-on-surface-variant">{icon}</span>
                <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface">{title}</h2>
            </div>
            {hasContent ? (
                <div className="divide-y divide-outline-variant/10">{children}</div>
            ) : (
                <p className="px-4 py-5 text-sm text-on-surface-variant">{empty}</p>
            )}
        </section>
    );
}

function MatchRow({ match, showResult = false }: { match: GameMatch; showResult?: boolean }) {
    const homeLabel = match.home_label ?? match.home_team?.name ?? 'TBC';
    const awayLabel = match.away_label ?? match.away_team?.name ?? 'TBC';

    return (
        <Link href={route('matches.show', match.id)} className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-surface-container-low">
            <div className="min-w-0">
                <p className="truncate text-sm font-bold text-on-surface">
                    {homeLabel} <span className="font-medium text-on-surface-variant">vs</span> {awayLabel}
                </p>
                <p className="text-[0.6875rem] text-on-surface-variant">
                    {match.league?.name ?? ''}
                    {match.scheduled_at ? ` · ${showResult ? formatJakartaDate(match.scheduled_at) : formatJakartaDateTime(match.scheduled_at)}` : ''}
                </p>
            </div>
            {showResult ? (
                <span className="shrink-0 text-sm font-black tabular-nums text-on-surface">
                    {match.home_score} — {match.away_score}
                </span>
            ) : (
                <span className="material-symbols-outlined shrink-0 text-[16px] text-on-surface-variant">chevron_right</span>
            )}
        </Link>
    );
}
