import BracketTree from '@/Components/BracketTree';
import JRClubLayout from '@/Layouts/JRClubLayout';
import { GameMatch, League, LeagueGroupStanding, LeagueStandingGroup, Standing } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const sportImages: Record<string, string> = {
    badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80',
    futsal: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    soccer: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
    tennis: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80',
    running: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=900&q=80',
};

export default function Show({
    league,
    standings,
    upperBracket,
    lowerBracket,
}: {
    league: League;
    standings: Standing[] | LeagueStandingGroup[];
    upperBracket: GameMatch[][];
    lowerBracket: GameMatch[][];
}) {
    const allMatches = league.matches || [];
    const startDate = formatDate(league.start_date);
    const endDate = league.end_date ? formatDate(league.end_date) : 'TBD';
    const entrants = getLeagueEntrants(league);

    const scheduleOptions = useMemo(() => {
        const dates = allMatches
            .map((match) => match.scheduled_at)
            .filter((date): date is string => Boolean(date))
            .map((date) => {
                const value = toDateValue(date);
                return {
                    value,
                    label: new Date(date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }),
                };
            });

        return Array.from(new Map(dates.map((item) => [item.value, item])).values()).sort((a, b) => new Date(a.value).getTime() - new Date(b.value).getTime());
    }, [allMatches]);

    const [selectedSchedule, setSelectedSchedule] = useState<string>(() => {
        const now = new Date();
        const upcoming = allMatches
            .filter((match) => match.scheduled_at && new Date(match.scheduled_at) > now && match.status !== 'completed')
            .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0];

        return upcoming?.scheduled_at ? toDateValue(upcoming.scheduled_at) : scheduleOptions[0]?.value ?? '';
    });

    const visibleMatches = useMemo(() => {
        return allMatches
            .filter((match) => !selectedSchedule || toDateValue(match.scheduled_at) === selectedSchedule)
            .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    }, [allMatches, selectedSchedule]);

    const groupedMatches = useMemo(() => {
        return visibleMatches.reduce<Record<string, GameMatch[]>>((groups, match) => {
            const key = match.stage || 'unassigned';
            groups[key] = [...(groups[key] || []), match];
            return groups;
        }, {});
    }, [visibleMatches]);

    return (
        <JRClubLayout active="Leagues">
            <Head title={`${league.name} - ${league.sport?.name || 'League'} Details`} />

            <section className="-mx-4 -mt-4 bg-surface-container-lowest px-4 pb-0 pt-4 shadow-[0px_12px_32px_rgba(15,23,42,0.06)] md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
                <div className="flex flex-col gap-5">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <Link href={route('leagues.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-primary">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Leagues
                            </Link>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">League Details · {league.status}</p>
                            <h1 className="mt-1 text-4xl font-black leading-none tracking-normal text-on-surface md:text-5xl">{league.name}</h1>
                        </div>
                        <div className="hidden items-center gap-2 rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant md:flex">
                            <span className="material-symbols-outlined text-[16px]">{league.sport?.icon || 'emoji_events'}</span>
                            <span>{league.sport?.name || 'League'}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                        <DetailTab label="Overview" active />
                        <DetailTab label="Schedule" />
                        <DetailTab label="Standings" />
                        {(upperBracket.length > 0 || lowerBracket.length > 0) ? <DetailTab label="Brackets" /> : null}
                    </div>
                </div>
            </section>

            <section className="mt-6 overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid md:grid-cols-[20rem_minmax(0,1fr)]">
                <div className="relative min-h-56 overflow-hidden md:min-h-72">
                    <img src={getSportImage(league.sport?.name)} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface/20 via-transparent to-surface-container-lowest md:to-surface-container-lowest" />
                    <StatusPill status={league.status} className="absolute left-4 top-4" />
                </div>

                <div className="p-5 md:p-8">
                    <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-primary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{league.sport?.name || 'Sport'}</span>
                        <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-tertiary">{getLeagueFormat(league)}</span>
                    </div>
                    <p className="max-w-3xl text-sm font-medium leading-6 text-on-surface-variant">
                        {league.description || getStatusCopy(league.status)}
                    </p>

                    <div className="my-7 grid grid-cols-3 gap-4 bg-surface-container-lowest py-4">
                        <FeaturedMetric label="Entrants" value={String(entrants)} />
                        <FeaturedMetric label="Schedule" value={`${startDate} - ${endDate}`} />
                        <FeaturedMetric label="Matches" value={String(allMatches.length)} />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {allMatches[0] ? (
                            <Link href={route('matches.show', allMatches[0].id)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-transform active:scale-[0.98]">
                                Open Next Match
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                        ) : null}
                        <Link href={route('leaderboards.index')} className="rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container">
                            View Leaderboard
                        </Link>
                    </div>
                </div>
            </section>

            {scheduleOptions.length > 0 ? (
                <section className="mt-6">
                    <SectionHeader eyebrow="Schedule" title="Match board" />
                    <div className="mb-4 flex gap-2 overflow-x-auto">
                        {scheduleOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setSelectedSchedule(option.value)}
                                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all active:scale-[0.98] ${selectedSchedule === option.value ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]' : 'bg-surface-container-lowest text-on-surface-variant shadow-[0px_4px_12px_rgba(15,23,42,0.03)] hover:bg-surface-container-high'}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {visibleMatches.length > 0 ? (
                        <div className="grid gap-4">
                            {Object.entries(groupedMatches).map(([stage, matches]) => (
                                <div key={stage}>
                                    <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{getStageName(stage)}</p>
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        {matches.map((match) => (
                                            <MatchCard key={match.id} match={match} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyPanel message="No matches found for this schedule." />
                    )}
                </section>
            ) : null}

            <section className="mt-6">
                <SectionHeader eyebrow="Current Standings" title="Competition table" action={<Link href={route('leaderboards.index')} className="text-sm font-bold text-primary">View full leaderboard</Link>} />
                {standings.length === 0 ? (
                    <EmptyPanel message="No standings available yet." />
                ) : league.category ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {(standings as LeagueStandingGroup[]).map((group) => (
                            <GroupStanding key={group.group} group={group} />
                        ))}
                    </div>
                ) : (
                    <TeamStandings standings={standings as Standing[]} />
                )}
            </section>

            {(upperBracket.length > 0 || lowerBracket.length > 0) ? (
                <section className="mt-6 space-y-4">
                    <SectionHeader eyebrow="Brackets" title="Tournament path" />
                    {upperBracket.length > 0 ? <BracketTree league={league} title="Upper Bracket" rounds={upperBracket} thirdPlaceMatch={league.third_place_match} champion={league.upper_champion} readOnly /> : null}
                    {lowerBracket.length > 0 ? <BracketTree league={league} title="Lower Bracket" rounds={lowerBracket} thirdPlaceMatch={league.lower_third_place_match} champion={league.lower_champion} readOnly /> : null}
                </section>
            ) : null}

            {league.teams && league.teams.length > 0 ? (
                <section className="mt-6 pb-8">
                    <SectionHeader eyebrow={`Teams · ${league.teams.length}`} title="Participating teams" />
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {league.teams.map((team) => (
                            <ParticipantCard key={team.id} label={team.name} />
                        ))}
                    </div>
                </section>
            ) : null}

            {league.entries && league.entries.length > 0 ? (
                <section className="mt-6 pb-8">
                    <SectionHeader eyebrow={`Entries · ${league.entries.length}`} title="Participating entries" />
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {league.entries.map((entry) => (
                            <ParticipantCard key={entry.id} label={entry.label} imagePath={entry.group_picture_path} />
                        ))}
                    </div>
                </section>
            ) : null}
        </JRClubLayout>
    );
}

function DetailTab({ label, active = false }: { label: string; active?: boolean }) {
    return <span className={`whitespace-nowrap px-4 py-3 text-sm font-bold ${active ? 'bg-surface text-primary' : 'text-on-surface-variant'}`}>{label}</span>;
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
    return (
        <div className="mb-4 flex items-end justify-between gap-4">
            <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{eyebrow}</p>
                <h2 className="mt-1 text-2xl font-black tracking-normal text-on-surface">{title}</h2>
            </div>
            {action}
        </div>
    );
}

function MatchCard({ match }: { match: GameMatch }) {
    return (
        <Link href={route('matches.show', match.id)} className="grid gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] transition-transform active:scale-[0.98]">
            <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-primary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{formatMatchDate(match.scheduled_at)}</span>
                <span className="rounded-full bg-surface-container-low px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{match.status}</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <MatchSide label={match.home_label ?? 'TBC'} imagePath={match.home_entry?.group_picture_path} align="right" />
                <span className="rounded-full bg-surface-container-low px-3 py-1 text-xs font-black text-on-surface-variant">VS</span>
                <MatchSide label={match.away_label ?? 'TBC'} imagePath={match.away_entry?.group_picture_path} />
            </div>
        </Link>
    );
}

function MatchSide({ label, imagePath, align = 'left' }: { label: string; imagePath?: string | null; align?: 'left' | 'right' }) {
    return (
        <div className={`flex min-w-0 items-center gap-3 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
            {imagePath ? (
                <img src={`/storage/${imagePath}`} alt={label} className="h-11 w-11 shrink-0 rounded-full object-cover shadow-sm" />
            ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-xs font-black text-on-surface-variant">{label.substring(0, 2).toUpperCase()}</div>
            )}
            <p className="truncate text-sm font-black text-on-surface">{label}</p>
        </div>
    );
}

function TeamStandings({ standings }: { standings: Standing[] }) {
    return (
        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_repeat(4,2.5rem)] items-center bg-surface-container-low px-4 py-3 text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                <div>#</div>
                <div>Team</div>
                <div className="text-center">P</div>
                <div className="text-center">W</div>
                <div className="text-center">L</div>
                <div className="text-right text-on-surface">Pts</div>
            </div>
            {standings.map((row, index) => (
                <div key={row.team.id} className={`grid grid-cols-[2.5rem_minmax(0,1fr)_repeat(4,2.5rem)] items-center px-4 py-3 text-sm ${index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low'}`}>
                    <div className="font-black text-primary">{index + 1}</div>
                    <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-xs font-bold text-on-primary-fixed">{row.team.name.charAt(0)}</div>
                        <span className="truncate font-bold text-on-surface">{row.team.name}</span>
                    </div>
                    <div className="text-center text-on-surface-variant">{row.played}</div>
                    <div className="text-center text-on-surface-variant">{row.won}</div>
                    <div className="text-center text-on-surface-variant">{row.lost}</div>
                    <div className="text-right font-black text-on-surface">{row.points ?? (row.won ?? 0) * 2 + (row.lost ?? 0)}</div>
                </div>
            ))}
        </div>
    );
}

function GroupStanding({ group }: { group: LeagueStandingGroup }) {
    return (
        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <div className="bg-surface-container-low px-4 py-3 text-sm font-black uppercase tracking-[0.05em] text-primary">{group.group}</div>
            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_repeat(5,2.5rem)] items-center px-4 py-3 text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                <div>#</div>
                <div>Club</div>
                <div className="text-center">MP</div>
                <div className="text-center">W</div>
                <div className="text-center">L</div>
                <div className="text-center">Scr</div>
                <div className="text-right text-on-surface">Pts</div>
            </div>
            {group.entries.map((row: LeagueGroupStanding, index) => (
                <div key={row.id} className={`grid grid-cols-[2.5rem_minmax(0,1fr)_repeat(5,2.5rem)] items-center px-4 py-3 text-sm ${index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low'}`}>
                    <div className="font-black text-primary">{index + 1}</div>
                    <div className="flex min-w-0 items-center gap-2">
                        {row.entry.group_picture_path ? (
                            <img src={`/storage/${row.entry.group_picture_path}`} alt={row.entry.label} className="h-7 w-7 shrink-0 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-xs font-bold text-on-primary-fixed">{row.entry.label.charAt(0)}</div>
                        )}
                        <span className="truncate font-bold text-on-surface">{row.entry.label}</span>
                    </div>
                    <div className="text-center text-on-surface-variant">{row.played ?? 0}</div>
                    <div className="text-center text-on-surface-variant">{row.won ?? 0}</div>
                    <div className="text-center text-on-surface-variant">{row.lost ?? 0}</div>
                    <div className="text-center text-on-surface-variant">{row.score ?? 0}</div>
                    <div className="text-right font-black text-on-surface">{row.points ?? (row.won ?? 0) * 2 + (row.lost ?? 0)}</div>
                </div>
            ))}
        </div>
    );
}

function ParticipantCard({ label, imagePath }: { label: string; imagePath?: string | null }) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            {imagePath ? (
                <img src={`/storage/${imagePath}`} alt={label} className="h-11 w-11 rounded-full object-cover" />
            ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-fixed text-sm font-black text-on-primary-fixed">{label.substring(0, 2).toUpperCase()}</div>
            )}
            <p className="min-w-0 truncate font-bold text-on-surface">{label}</p>
        </div>
    );
}

function FeaturedMetric({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</p>
            <p className="mt-1 text-xl font-black tracking-normal text-on-surface">{value}</p>
        </div>
    );
}

function StatusPill({ status, className = '' }: { status: string; className?: string }) {
    return (
        <span className={`rounded-full px-3 py-1 text-[0.625rem] font-black uppercase tracking-[0.05em] ${status === 'completed' ? 'bg-tertiary-fixed text-tertiary' : status === 'active' ? 'bg-primary-fixed text-primary' : 'bg-secondary-fixed text-secondary'} ${className}`}>
            {toTitle(status)}
        </span>
    );
}

function EmptyPanel({ message }: { message: string }) {
    return (
        <div className="rounded-xl bg-surface-container-lowest p-8 text-center shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-bold text-on-surface-variant">{message}</p>
        </div>
    );
}

function getLeagueEntrants(league: League) {
    return league.teams?.length ?? league.entries?.length ?? league.participant_total ?? 0;
}

function getLeagueFormat(league: League) {
    if (league.entry_type) return `${toTitle(league.entry_type)} Entry`;
    if (league.category) return league.category;
    return 'League Play';
}

function getStatusCopy(status: string) {
    switch (status) {
        case 'upcoming':
            return 'Registration and scheduling are underway.';
        case 'completed':
            return 'Competition wrapped and archived.';
        default:
            return 'Standings and fixtures are live.';
    }
}

function getStageName(stage: string) {
    if (stage.toLowerCase() === 'group') return 'Group Stage';
    if (stage.toLowerCase() === 'upper') return 'Upper Bracket';
    if (stage.toLowerCase() === 'lower') return 'Lower Bracket';
    if (stage.toLowerCase() === 'unassigned') return 'Other Matches';
    return toTitle(stage);
}

function getSportImage(name?: string) {
    return sportImages[(name || '').toLowerCase()] ?? sportImages.badminton;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatMatchDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function toDateValue(dateString?: string | null) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function toTitle(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
