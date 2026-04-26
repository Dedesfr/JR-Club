import BracketTree from '@/Components/BracketTree';
import JRClubLayout from '@/Layouts/JRClubLayout';
import { GameMatch, League, LeagueGroupStanding, LeagueStandingGroup, Standing } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';

function fallbackIcon(id?: number): string {
    if (!id) return `/images/icon-1.jpeg`;
    return `/images/icon-${((id - 1) % 7) + 1}.jpeg`;
}

const sportImages: Record<string, string> = {
    badminton: '/images/badminton.jpeg',
    futsal: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    soccer: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    basketball: '/images/basketball.jpeg',
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
            const key = match.stage === 'group' && match.group
                ? `group|${match.group.position}|${match.group.name}`
                : (match.stage || 'unassigned');
            groups[key] = [...(groups[key] || []), match];
            return groups;
        }, {});
    }, [visibleMatches]);

    return (
        <JRClubLayout active="Leagues">
            <Head title={`${league.name} - ${league.sport?.name || 'League'} Details`} />

            <section className="-mt-4 bg-inverse-surface" style={{ marginLeft: 'calc(50% - 50vw)', width: '100vw' }}>
                <div className="mx-auto max-w-md px-4 pt-5 pb-0 md:max-w-7xl md:px-6 lg:px-8">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <Link href={route('leagues.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-inverse-on-surface/60 transition-colors hover:text-inverse-on-surface">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Leagues
                            </Link>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">League Details · {league.status}</p>
                            <h1 className="mt-1 text-4xl font-black leading-none text-inverse-on-surface md:text-5xl">{league.name}</h1>
                        </div>
                        <div className="hidden items-center gap-2 self-center rounded-xl bg-white/10 px-4 py-2.5 text-sm text-inverse-on-surface/60 md:flex">
                            <span className="material-symbols-outlined text-[16px]">{league.sport?.icon || 'emoji_events'}</span>
                            <span>{league.sport?.name || 'League'}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-6 border-t border-white/10 pt-4 md:gap-10">
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Entrants</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{entrants}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Matches</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{allMatches.length}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Period</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{startDate} – {endDate}</p>
                        </div>
                    </div>

                    <div className="mt-4 flex overflow-x-auto">
                        <DetailTab label="Overview" active />
                        <DetailTab label="Schedule" />
                        <DetailTab label="Standings" />
                        {(upperBracket.length > 0 || lowerBracket.length > 0) ? <DetailTab label="Brackets" /> : null}
                    </div>
                </div>
            </section>

            <section className="mt-6 overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_2px_12px_rgba(15,23,42,0.08),0px_0px_0px_1px_rgba(15,23,42,0.04)] md:grid md:grid-cols-[20rem_minmax(0,1fr)]">
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

                    <div className="my-6 grid grid-cols-3 border-b border-t border-outline-variant py-4">
                        <FeaturedMetric label="Entrants" value={String(entrants)} />
                        <div className="border-l border-outline-variant pl-4">
                            <FeaturedMetric label="Schedule" value={`${startDate} - ${endDate}`} />
                        </div>
                        <div className="border-l border-outline-variant pl-4">
                            <FeaturedMetric label="Matches" value={String(allMatches.length)} />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {allMatches[0] ? (
                            <Link href={route('matches.show', allMatches[0].id)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-transform active:scale-[0.98]">
                                Open Next Match
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                        ) : null}
                        <Link href={route('leaderboards.index')} className="rounded-full border border-outline-variant bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container">
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
                                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all active:scale-[0.98] ${selectedSchedule === option.value ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]' : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'}`}
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
                            <GroupStanding key={group.group} group={group} advanceCount={league.advance_upper_count ?? 0} />
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
                            <ParticipantCard key={team.id} id={team.id} label={team.name} />
                        ))}
                    </div>
                </section>
            ) : null}

            {league.entries && league.entries.length > 0 ? (
                <section className="mt-6 pb-8">
                    <SectionHeader eyebrow={`Entries · ${league.entries.length}`} title="Participating entries" />
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {league.entries.map((entry) => (
                            <ParticipantCard key={entry.id} id={entry.id} label={entry.label} imagePath={entry.group_picture_path} />
                        ))}
                    </div>
                </section>
            ) : null}
        </JRClubLayout>
    );
}

function DetailTab({ label, active = false }: { label: string; active?: boolean }) {
    return (
        <span className={`whitespace-nowrap px-4 py-3 text-sm font-bold ${active ? 'border-b-[3px] border-white text-white' : 'border-b-[3px] border-transparent text-outline'}`}>
            {label}
        </span>
    );
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
    return (
        <div className="mb-4 flex items-end justify-between gap-4">
            <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{eyebrow}</p>
                <h2 className="mt-1 text-2xl font-black tracking-normal text-on-surface">{title}</h2>
            </div>
            {action}
        </div>
    );
}

function getMatchAccentStyle(status: string): React.CSSProperties {
    if (status === 'completed') return { borderLeft: '3px solid #8f3d00' };
    if (status === 'active') return { borderLeft: '3px solid #0056a4' };
    if (status === 'scheduled') return { borderLeft: '3px solid #0056a4' };
    return { borderLeft: '3px solid #c1c6d5' };
}

function getMatchStatusBadge(status: string) {
    if (status === 'completed') return 'bg-tertiary-fixed text-tertiary';
    if (status === 'active') return 'bg-primary-fixed text-primary';
    if (status === 'scheduled') return 'bg-primary-fixed text-primary';
    return 'bg-surface-container text-on-surface-variant';
}

function MatchCard({ match }: { match: GameMatch }) {
    return (
        <Link
            href={route('matches.show', match.id)}
            className="grid gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.06),0px_0px_0px_1px_rgba(15,23,42,0.04)] transition-transform active:scale-[0.98]"
            style={getMatchAccentStyle(match.status)}
        >
            <div className="flex items-center justify-between gap-3">
                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{formatMatchDate(match.scheduled_at)}</span>
                <span className={`rounded-full px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.04em] ${getMatchStatusBadge(match.status)}`}>{match.status}</span>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
                <MatchSide label={match.home_label ?? 'TBC'} imagePath={match.home_entry?.group_picture_path} id={match.home_entry?.id} align="right" highlight={match.status === 'completed' && match.home_score > match.away_score} />
                {match.status === 'completed' ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-inverse-surface px-3 py-1 text-inverse-on-surface">
                        <span className={`text-sm font-black tabular-nums ${match.home_score > match.away_score ? '' : 'opacity-60'}`}>{match.home_score}</span>
                        <span className="text-xs font-bold opacity-60">-</span>
                        <span className={`text-sm font-black tabular-nums ${match.away_score > match.home_score ? '' : 'opacity-60'}`}>{match.away_score}</span>
                    </div>
                ) : (
                    <span className="rounded-full bg-inverse-surface px-3 py-1 text-xs font-black text-inverse-on-surface">VS</span>
                )}
                <MatchSide label={match.away_label ?? 'TBC'} imagePath={match.away_entry?.group_picture_path} id={match.away_entry?.id} highlight={match.status === 'completed' && match.away_score > match.home_score} />
            </div>
        </Link>
    );
}

function MatchSide({ label, imagePath, id, align = 'left', highlight = false }: { label: string; imagePath?: string | null; id?: number; align?: 'left' | 'right'; highlight?: boolean }) {
    return (
        <div className={`flex min-w-0 items-center gap-2 sm:gap-3 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
            <img
                src={imagePath ? `/storage/${imagePath}` : fallbackIcon(id)}
                alt={label}
                className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm bg-surface-container-high sm:h-11 sm:w-11"
            />
            <p className={`min-w-0 flex-1 break-words text-xs font-black leading-tight [overflow-wrap:anywhere] sm:text-sm ${highlight ? 'text-primary' : 'text-on-surface'}`}>{label}</p>
        </div>
    );
}

function TeamStandings({ standings }: { standings: Standing[] }) {
    return (
        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_4px_12px_rgba(15,23,42,0.06),0px_0px_0px_1px_rgba(15,23,42,0.04)]">
            <div className="flex items-center border-b border-outline-variant/30 bg-surface-container-low px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="w-5 shrink-0 text-center">#</div>
                <div className="min-w-0 flex-grow pl-2">Club</div>
                <div className="w-7 shrink-0 text-center">MP</div>
                <div className="w-7 shrink-0 text-center">W</div>
                <div className="w-7 shrink-0 text-center">L</div>
                <div className="w-9 shrink-0 text-right font-black text-on-surface">Pts</div>
            </div>
            {standings.map((row, index) => {
                const isLeader = index === 0 && row.played > 0;

                return (
                    <div key={row.team.id} className={`flex items-center border-b border-outline-variant/10 px-3 py-2.5 text-sm last:border-b-0 ${isLeader ? 'border-l-2 border-l-primary bg-primary/5' : ''}`}>
                        <div className={`w-5 shrink-0 text-center ${isLeader ? 'font-black text-primary' : 'font-medium text-on-surface-variant'}`}>{index + 1}</div>
                        <div className="flex min-w-0 flex-grow items-center gap-2 pl-2">
                            <img src={fallbackIcon(row.team.id)} alt={row.team.name} className="h-6 w-6 shrink-0 rounded-full bg-surface-container-high object-cover shadow-sm" />
                            <span className={`min-w-0 break-words leading-tight [overflow-wrap:anywhere] ${isLeader ? 'font-black text-on-surface' : 'font-semibold text-on-surface'}`}>{row.team.name}</span>
                        </div>
                        <div className="w-7 shrink-0 text-center text-on-surface-variant">{row.played}</div>
                        <div className="w-7 shrink-0 text-center text-on-surface-variant">{row.won}</div>
                        <div className="w-7 shrink-0 text-center text-on-surface-variant">{row.lost}</div>
                        <div className={`w-9 shrink-0 text-right ${isLeader ? 'font-black text-primary' : 'font-bold text-on-surface'}`}>{row.points ?? (row.won ?? 0) * 2 + (row.lost ?? 0)}</div>
                    </div>
                );
            })}
        </div>
    );
}

function GroupStanding({ group, advanceCount }: { group: LeagueStandingGroup; advanceCount: number }) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_4px_12px_rgba(15,23,42,0.06),0px_0px_0px_1px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-4 py-2.5">
                <span className="text-xs font-black uppercase tracking-widest text-on-surface">{group.group}</span>
                {advanceCount > 0 ? <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Top {advanceCount} advance</span> : null}
            </div>
            <div className="flex items-center border-b border-outline-variant/20 bg-surface-container-low/60 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="w-5 shrink-0 text-center">#</div>
                <div className="min-w-0 flex-grow pl-2">Club</div>
                <div className="w-7 shrink-0 text-center" title="Match Played">MP</div>
                <div className="w-7 shrink-0 text-center" title="Win">W</div>
                <div className="w-7 shrink-0 text-center" title="Loss">L</div>
                <div className="w-9 shrink-0 text-center" title="Accumulated Score">Scr</div>
                <div className="w-9 shrink-0 text-right font-black text-on-surface" title="Points">Pts</div>
            </div>
            {group.entries.map((row: LeagueGroupStanding, index) => {
                const advances = advanceCount > 0 && index < advanceCount;
                const isCutRow = advanceCount > 0 && index === advanceCount;

                return (
                    <div key={row.id}>
                        {isCutRow ? (
                            <div className="border-t border-dashed border-outline-variant/60 px-3 py-0.5 text-center text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                                Cut line
                            </div>
                        ) : null}
                        <div className={`flex items-center border-b border-outline-variant/10 px-3 py-2.5 text-sm last:border-b-0 transition-colors ${advances ? 'border-l-2 border-l-primary bg-primary/5' : ''}`}>
                            <div className={`w-5 shrink-0 text-center ${advances ? 'font-black text-primary' : 'font-medium text-on-surface-variant'}`}>{index + 1}</div>
                            <div className="flex min-w-0 flex-grow items-center gap-2 pl-2">
                                <img
                                    src={row.entry.group_picture_path ? `/storage/${row.entry.group_picture_path}` : fallbackIcon(row.id)}
                                    alt={row.entry.label}
                                    className="h-6 w-6 shrink-0 rounded-full bg-surface-container-high object-cover shadow-sm"
                                />
                                <span className={`min-w-0 break-words leading-tight [overflow-wrap:anywhere] ${advances ? 'font-black text-on-surface' : 'font-semibold text-on-surface'}`}>{row.entry.label}</span>
                            </div>
                            <div className="w-7 shrink-0 text-center text-on-surface-variant">{row.played ?? 0}</div>
                            <div className="w-7 shrink-0 text-center text-on-surface-variant">{row.won ?? 0}</div>
                            <div className="w-7 shrink-0 text-center text-on-surface-variant">{row.lost ?? 0}</div>
                            <div className="w-9 shrink-0 text-center text-on-surface-variant">{row.score ?? 0}</div>
                            <div className={`w-9 shrink-0 text-right ${advances ? 'font-black text-primary' : 'font-bold text-on-surface'}`}>{row.points ?? (row.won ?? 0) * 2 + (row.lost ?? 0)}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ParticipantCard({ label, imagePath, id }: { label: string; imagePath?: string | null; id?: number }) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.06),0px_0px_0px_1px_rgba(15,23,42,0.04)]">
            <img
                src={imagePath ? `/storage/${imagePath}` : fallbackIcon(id)}
                alt={label}
                className="h-11 w-11 shrink-0 rounded-full object-cover bg-surface-container-high"
            />
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
    if (stage.startsWith('group|')) return stage.split('|')[2];
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
