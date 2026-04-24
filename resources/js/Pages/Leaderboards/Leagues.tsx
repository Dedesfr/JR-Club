import BracketTree from '@/Components/BracketTree';
import SelectInput from '@/Components/SelectInput';
import JRClubLayout from '@/Layouts/JRClubLayout';
import { GameMatch, League, LeagueEntry, LeagueGroupStanding, LeagueStandingGroup, Sport, Standing } from '@/types/jrclub';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type LeagueBrief = { id: number; name: string };

function fallbackIcon(id: number): string {
    return `/images/icon-${((id - 1) % 7) + 1}.jpeg`;
}

function formatStatus(status?: string): { label: string; tone: 'completed' | 'active' | 'upcoming' } {
    const s = (status ?? '').toLowerCase();
    if (s === 'completed') return { label: 'Completed', tone: 'completed' };
    if (s === 'active' || s === 'in_progress') return { label: 'In progress', tone: 'active' };
    return { label: 'Upcoming', tone: 'upcoming' };
}

function formatLabel(league: League, hasGroups: boolean, hasUpper: boolean, hasLower: boolean): string {
    const parts: string[] = [];
    if (hasGroups) parts.push('Group stage');
    if (hasUpper && hasLower) parts.push('Double elimination');
    else if (hasUpper) parts.push('Single elimination');
    else if (!hasGroups) parts.push('Round robin');
    if (parts.length === 0) parts.push(league.sport?.name ?? 'League');
    return parts.join(' + ');
}

export default function Leagues({
    sports,
    selectedSportId,
    leagues,
    selectedLeagueId,
    league,
    standings,
    upperBracket,
    lowerBracket
}: {
    sports: Sport[];
    selectedSportId?: number;
    leagues: LeagueBrief[];
    selectedLeagueId?: number;
    league?: League | null;
    standings: Standing[] | LeagueStandingGroup[];
    upperBracket?: GameMatch[][];
    lowerBracket?: GameMatch[][];
}) {
    const isGroupStandings = standings.some((row) => 'group' in row);
    const hasUpperBracket = !!(upperBracket && upperBracket.length > 0);
    const hasLowerBracket = !!(lowerBracket && lowerBracket.length > 0);
    const status = formatStatus(league?.status);
    const isCompleted = status.tone === 'completed';

    // Match progress (played vs total)
    const allMatches = league?.matches ?? [];
    const matchesTotal = allMatches.length;
    const matchesPlayed = allMatches.filter((m) => m.status === 'completed').length;

    // Podium derivation (finalists + 3rd place)
    type Podiumist = { label: string; imageUrl: string };
    const entryIcon = (entry?: LeagueEntry | null, fallbackId?: number): string =>
        entry?.group_picture_path ? `/storage/${entry.group_picture_path}` : fallbackIcon(fallbackId ?? entry?.id ?? 0);

    let upperWinner: Podiumist | null = null;
    let upperRunnerUp: Podiumist | null = null;
    let thirdPlace: Podiumist | null = null;
    let lowerWinner: Podiumist | null = null;

    if (league) {
        if (isGroupStandings) {
            if (league.upper_champion) {
                upperWinner = { label: league.upper_champion.label, imageUrl: entryIcon(league.upper_champion) };
                if (hasUpperBracket) {
                    const finalMatch = upperBracket![upperBracket!.length - 1]?.[0];
                    if (finalMatch) {
                        let runnerUpEntry: LeagueEntry | null | undefined = null;
                        let runnerUpLabel: string | null = null;
                        if (finalMatch.home_entry?.id === league.upper_champion.id) {
                            runnerUpEntry = finalMatch.away_entry;
                            runnerUpLabel = finalMatch.away_label ?? null;
                        } else if (finalMatch.away_entry?.id === league.upper_champion.id) {
                            runnerUpEntry = finalMatch.home_entry;
                            runnerUpLabel = finalMatch.home_label ?? null;
                        }
                        if (runnerUpLabel) upperRunnerUp = { label: runnerUpLabel, imageUrl: entryIcon(runnerUpEntry) };
                    }
                }
            }
            if (league.lower_champion) {
                lowerWinner = { label: league.lower_champion.label, imageUrl: entryIcon(league.lower_champion) };
            }

            const tp = league.third_place_match;
            if (tp && tp.status === 'completed') {
                const homeSets = (tp.sets ?? []).filter((s) => s.home_points > s.away_points).length;
                const awaySets = (tp.sets ?? []).filter((s) => s.away_points > s.home_points).length;
                let homeWon: boolean | null = null;
                if (homeSets !== awaySets) homeWon = homeSets > awaySets;
                else if (tp.home_score !== tp.away_score) homeWon = tp.home_score > tp.away_score;
                if (homeWon === true && tp.home_label) thirdPlace = { label: tp.home_label, imageUrl: entryIcon(tp.home_entry) };
                else if (homeWon === false && tp.away_label) thirdPlace = { label: tp.away_label, imageUrl: entryIcon(tp.away_entry) };
            }
        } else {
            const teamStandings = standings as Standing[];
            const toPodiumist = (row: Standing): Podiumist => ({ label: row.team.name, imageUrl: fallbackIcon(row.team.id) });
            if (teamStandings.length > 0 && teamStandings[0].played > 0) upperWinner = toPodiumist(teamStandings[0]);
            if (teamStandings.length > 1 && teamStandings[1].played > 0) upperRunnerUp = toPodiumist(teamStandings[1]);
            if (teamStandings.length > 2 && teamStandings[2].played > 0) thirdPlace = toPodiumist(teamStandings[2]);
        }
    }

    const showPodium = isCompleted && !!(upperWinner || upperRunnerUp);

    // Current leader (non-completed state)
    let currentLeader: { label: string; points: number } | null = null;
    if (!showPodium) {
        if (isGroupStandings) {
            const all = (standings as LeagueStandingGroup[]).flatMap((g) => g.entries);
            const topRow = all.filter((r) => (r.played ?? 0) > 0).sort((a, b) => ((b.won ?? 0) * 2 + (b.lost ?? 0)) - ((a.won ?? 0) * 2 + (a.lost ?? 0)))[0];
            if (topRow) currentLeader = { label: topRow.entry.label, points: (topRow.won ?? 0) * 2 + (topRow.lost ?? 0) };
        } else {
            const top = (standings as Standing[])[0];
            if (top && top.played > 0) currentLeader = { label: top.team.name, points: (top.won ?? 0) * 2 + (top.lost ?? 0) };
        }
    }

    const advanceCount = league?.advance_upper_count ?? 0;

    return (
        <JRClubLayout active="Rankings">
            <Head title="Leaderboards" />

            {/* Header: title + view segmented control */}
            <section className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Rankings</p>
                    <h1 className="mt-1 text-2xl font-black uppercase tracking-tighter text-on-surface sm:text-3xl">Leaderboards</h1>
                </div>
                <div className="inline-flex self-start rounded-full bg-surface-container-high p-0.5 text-xs font-bold uppercase tracking-widest">
                    <Link href={route('leaderboards.index')} className="rounded-full px-4 py-1.5 text-on-surface-variant hover:text-on-surface">Players</Link>
                    <Link href={route('leaderboards.leagues')} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-1.5 text-on-primary shadow-sm">Leagues</Link>
                </div>
            </section>

            {/* Filter bar: sport chips + league picker in one card */}
            <section className="mt-4 flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-3 shadow-[0_4px_12px_-6px_rgba(25,28,30,0.08)] md:flex-row md:items-center">
                <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 md:flex-1 md:flex-wrap md:overflow-visible md:pb-0">
                    <Link
                        href={route('leaderboards.leagues')}
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest transition-colors ${!selectedSportId ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}
                    >
                        All
                    </Link>
                    {sports.map((sport) => (
                        <Link
                            key={sport.id}
                            href={route('leaderboards.leagues', { sport_id: sport.id })}
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest transition-colors ${selectedSportId === sport.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}
                        >
                            {sport.name}
                        </Link>
                    ))}
                </div>
                {leagues.length > 0 && (
                    <div className="md:w-72">
                        <SelectInput
                            value={selectedLeagueId}
                            options={leagues.map((l) => ({ value: String(l.id), label: l.name }))}
                            onChange={(value) => {
                                router.get(route('leaderboards.leagues'), {
                                    sport_id: selectedSportId,
                                    league_id: value,
                                }, { preserveState: true });
                            }}
                            placeholder="Select a league"
                        />
                    </div>
                )}
            </section>

            {/* League context strip */}
            {league && (
                <section className="mt-4 flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0_4px_12px_-6px_rgba(25,28,30,0.08)] sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-lg font-black uppercase tracking-tight text-on-surface">{league.name}</h2>
                            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                        </div>
                        <p className="mt-1 text-xs text-on-surface-variant">
                            <span className="font-bold text-on-surface">{league.sport?.name}</span>
                            <span className="mx-1.5 opacity-50">·</span>
                            <span>{formatLabel(league, isGroupStandings, hasUpperBracket, hasLowerBracket)}</span>
                            {matchesTotal > 0 && (
                                <>
                                    <span className="mx-1.5 opacity-50">·</span>
                                    <span>{matchesPlayed} / {matchesTotal} matches</span>
                                </>
                            )}
                        </p>
                    </div>
                </section>
            )}

            {/* Podium (completed) */}
            {showPodium && (
                <section className="mt-5">
                    <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Final Results</h3>
                    <div className="grid grid-cols-3 items-end gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-[0_8px_20px_-6px_rgba(25,28,30,0.08)] sm:gap-4 sm:p-6">
                        {/* 2nd */}
                        <div className="flex flex-col items-center">
                            <PodiumAvatar src={upperRunnerUp?.imageUrl} alt={upperRunnerUp?.label} rank={2} tone="silver" />
                            <div className="w-full rounded-t-lg bg-surface-container-high px-2 pb-4 pt-3 text-center text-on-surface sm:pb-6 sm:pt-4">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Runner-up</div>
                                <div className="mt-1 truncate text-sm font-black">{upperRunnerUp?.label ?? '—'}</div>
                            </div>
                        </div>
                        {/* 1st */}
                        <div className="flex flex-col items-center">
                            <PodiumAvatar src={upperWinner?.imageUrl} alt={upperWinner?.label} rank={1} tone="gold" />
                            <div className="w-full rounded-t-lg bg-gradient-to-br from-yellow-300 to-yellow-500 px-2 pb-6 pt-4 text-center text-yellow-950 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.18)] sm:pb-10 sm:pt-6">
                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Champion</div>
                                <div className="mt-1 truncate text-base font-black">{upperWinner?.label ?? '—'}</div>
                            </div>
                        </div>
                        {/* 3rd */}
                        <div className="flex flex-col items-center">
                            <PodiumAvatar src={thirdPlace?.imageUrl} alt={thirdPlace?.label} rank={3} tone="bronze" />
                            <div className="w-full rounded-t-lg bg-surface-container-high px-2 pb-3 pt-2 text-center text-on-surface sm:pb-5 sm:pt-3">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">3rd Place</div>
                                <div className="mt-1 truncate text-sm font-black">{thirdPlace?.label ?? '—'}</div>
                            </div>
                        </div>
                    </div>
                    {lowerWinner && (
                        <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-dashed border-outline-variant/50 bg-surface-container-lowest px-4 py-2.5 text-xs">
                            <span className="font-bold uppercase tracking-widest text-on-surface-variant">Lower bracket winner</span>
                            <span className="flex min-w-0 items-center gap-2">
                                <img
                                    src={lowerWinner.imageUrl}
                                    alt={lowerWinner.label}
                                    className="h-6 w-6 shrink-0 rounded-full bg-surface-container-high object-cover"
                                />
                                <span className="truncate font-black text-on-surface">{lowerWinner.label}</span>
                            </span>
                        </div>
                    )}
                </section>
            )}

            {/* Current leader (non-completed) */}
            {!showPodium && currentLeader && (
                <section className="mt-5">
                    <div className="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0_4px_12px_-6px_rgba(25,28,30,0.08)]">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-sm font-black text-on-primary">1</div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Current leader</div>
                            <div className="truncate text-base font-black text-on-surface">{currentLeader.label}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-on-surface">{currentLeader.points}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Points</div>
                        </div>
                    </div>
                </section>
            )}

            {/* Standings */}
            <section className="mb-8 mt-6">
                <div className="mb-3 flex items-end justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Standings</h3>
                    <div className="hidden gap-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant sm:flex">
                        <span>MP · Played</span>
                        <span>W · Won</span>
                        <span>L · Lost</span>
                        {isGroupStandings && <span>Scr · Score</span>}
                        <span>Pts</span>
                    </div>
                </div>

                {leagues.length === 0 ? (
                    <EmptyCard>No leagues found for this sport.</EmptyCard>
                ) : standings.length === 0 ? (
                    <EmptyCard>No standings available for this league yet.</EmptyCard>
                ) : isGroupStandings ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {(standings as LeagueStandingGroup[]).map((group) => (
                            <GroupStanding key={group.group} group={group} advanceCount={advanceCount} />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_4px_12px_-6px_rgba(25,28,30,0.08)]">
                        <TeamStandings standings={standings as Standing[]} />
                    </div>
                )}
            </section>

            {/* Bracket (tabbed, collapsible) */}
            {league && (hasUpperBracket || hasLowerBracket) && (
                <BracketSection
                    league={league}
                    upperBracket={upperBracket}
                    lowerBracket={lowerBracket}
                />
            )}
        </JRClubLayout>
    );
}

function PodiumAvatar({
    src,
    alt,
    rank,
    tone,
}: {
    src?: string;
    alt?: string;
    rank: 1 | 2 | 3;
    tone: 'gold' | 'silver' | 'bronze';
}) {
    const size = rank === 1 ? 'h-14 w-14 sm:h-16 sm:w-16' : 'h-11 w-11 sm:h-12 sm:w-12';
    const ring =
        tone === 'gold' ? 'ring-yellow-400 shadow-[0_8px_20px_-4px_rgba(234,179,8,0.45)]' :
        tone === 'silver' ? 'ring-surface-container-high shadow-[0_4px_12px_-4px_rgba(25,28,30,0.2)]' :
        'ring-amber-700/40 shadow-[0_4px_12px_-4px_rgba(180,83,9,0.25)]';
    const badgeCls =
        tone === 'gold' ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-950' :
        tone === 'silver' ? 'bg-surface-container-highest text-on-surface' :
        'bg-amber-600 text-white';
    return (
        <div className="relative mb-2">
            <div className={`overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-surface-container-lowest bg-surface-container-high ${size} ${ring}`}>
                {src ? (
                    <img src={src} alt={alt ?? ''} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full bg-surface-container-high" />
                )}
            </div>
            <span className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black shadow-md ring-2 ring-surface-container-lowest ${badgeCls}`}>
                {rank}
            </span>
        </div>
    );
}

function StatusBadge({ tone, children }: { tone: 'completed' | 'active' | 'upcoming'; children: React.ReactNode }) {
    const cls =
        tone === 'completed' ? 'bg-primary text-on-primary' :
        tone === 'active' ? 'border border-outline-variant bg-surface-container-lowest text-on-surface' :
        'bg-surface-container-high text-on-surface-variant';
    return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${cls}`}>{children}</span>;
}

function EmptyCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_4px_12px_-6px_rgba(25,28,30,0.08)]">
            <p className="p-4 text-sm text-on-surface-variant">{children}</p>
        </div>
    );
}

function BracketSection({
    league,
    upperBracket,
    lowerBracket,
}: {
    league: League;
    upperBracket?: GameMatch[][];
    lowerBracket?: GameMatch[][];
}) {
    const hasUpper = !!(upperBracket && upperBracket.length > 0);
    const hasLower = !!(lowerBracket && lowerBracket.length > 0);
    const hasBoth = hasUpper && hasLower;
    const [tab, setTab] = useState<'upper' | 'lower'>(hasUpper ? 'upper' : 'lower');

    return (
        <section className="mb-8">
            <div className="mb-3 flex items-end justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Bracket</h3>
                {hasBoth && (
                    <div className="inline-flex rounded-full bg-surface-container-high p-0.5 text-xs font-bold uppercase tracking-widest">
                        <button
                            onClick={() => setTab('upper')}
                            className={`rounded-full px-3 py-1 transition-colors ${tab === 'upper' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Upper
                        </button>
                        <button
                            onClick={() => setTab('lower')}
                            className={`rounded-full px-3 py-1 transition-colors ${tab === 'lower' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Lower
                        </button>
                    </div>
                )}
            </div>
            {tab === 'upper' && hasUpper && (
                <BracketTree
                    league={league}
                    title={hasBoth ? 'Upper Bracket' : 'Bracket'}
                    rounds={upperBracket!}
                    thirdPlaceMatch={league.third_place_match}
                    champion={league.upper_champion}
                    readOnly
                />
            )}
            {tab === 'lower' && hasLower && (
                <BracketTree
                    league={league}
                    title={hasBoth ? 'Lower Bracket' : 'Bracket'}
                    rounds={lowerBracket!}
                    champion={league.lower_champion}
                    readOnly
                />
            )}
        </section>
    );
}

function TeamStandings({ standings }: { standings: Standing[] }) {
    return (
        <>
            <div className="flex items-center border-b border-outline-variant/30 bg-surface-container-low px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="w-6 text-center">#</div>
                <div className="flex-grow pl-2">Team</div>
                <div className="w-7 text-center">P</div>
                <div className="w-7 text-center">W</div>
                <div className="w-7 text-center">D</div>
                <div className="w-7 text-center">L</div>
                <div className="w-10 text-right font-black text-on-surface">Pts</div>
            </div>
            {standings.map((row, index) => {
                const isLeader = index === 0 && row.played > 0;
                return (
                    <div
                        key={row.team.id}
                        className={`flex items-center border-b border-outline-variant/10 px-4 py-2.5 text-sm last:border-b-0 ${isLeader ? 'border-l-2 border-l-primary bg-primary/5' : ''}`}
                    >
                        <div className={`w-6 text-center ${isLeader ? 'font-black text-primary' : 'font-medium text-on-surface-variant'}`}>{index + 1}</div>
                        <div className="flex flex-grow items-center gap-2 pl-2 min-w-0">
                            <img src={fallbackIcon(row.team.id)} alt={row.team.name} className="h-6 w-6 shrink-0 rounded-full bg-surface-container-high object-cover" />
                            <span className={`truncate ${isLeader ? 'font-black text-on-surface' : 'font-semibold text-on-surface'}`}>{row.team.name}</span>
                        </div>
                        <div className="w-7 text-center text-on-surface-variant">{row.played}</div>
                        <div className="w-7 text-center text-on-surface-variant">{row.won}</div>
                        <div className="w-7 text-center text-on-surface-variant">{row.drawn}</div>
                        <div className="w-7 text-center text-on-surface-variant">{row.lost}</div>
                        <div className={`w-10 text-right ${isLeader ? 'font-black text-primary' : 'font-bold text-on-surface'}`}>{(row.won ?? 0) * 2 + (row.lost ?? 0)}</div>
                    </div>
                );
            })}
        </>
    );
}

function GroupStanding({ group, advanceCount }: { group: LeagueStandingGroup; advanceCount: number }) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_4px_12px_-6px_rgba(25,28,30,0.08)]">
            <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-4 py-2.5">
                <span className="text-xs font-black uppercase tracking-widest text-on-surface">{group.group}</span>
                {advanceCount > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Top {advanceCount} advance</span>
                )}
            </div>
            <div className="flex items-center border-b border-outline-variant/20 bg-surface-container-low/60 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="w-5 shrink-0 text-center">#</div>
                <div className="flex-grow min-w-0 pl-2">Club</div>
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
                        {isCutRow && (
                            <div className="border-t border-dashed border-outline-variant/60 px-3 py-0.5 text-center text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                                Cut line
                            </div>
                        )}
                        <div className={`flex items-center border-b border-outline-variant/10 px-3 py-2.5 text-sm last:border-b-0 transition-colors ${advances ? 'border-l-2 border-l-primary bg-primary/5' : ''}`}>
                            <div className={`w-5 shrink-0 text-center ${advances ? 'font-black text-primary' : 'font-medium text-on-surface-variant'}`}>{index + 1}</div>
                            <div className="flex min-w-0 flex-grow items-center gap-2 pl-2">
                                <img
                                    src={row.entry.group_picture_path ? `/storage/${row.entry.group_picture_path}` : fallbackIcon(row.id)}
                                    alt={row.entry.label}
                                    className="h-6 w-6 shrink-0 rounded-full bg-surface-container-high object-cover shadow-sm"
                                />
                                <span className={`truncate ${advances ? 'font-black text-on-surface' : 'font-semibold text-on-surface'}`}>{row.entry.label}</span>
                            </div>
                            <div className="w-7 shrink-0 text-center text-on-surface-variant">{row.played ?? 0}</div>
                            <div className="w-7 shrink-0 text-center text-on-surface-variant">{row.won ?? 0}</div>
                            <div className="w-7 shrink-0 text-center text-on-surface-variant">{row.lost ?? 0}</div>
                            <div className="w-9 shrink-0 text-center text-on-surface-variant">{row.score ?? 0}</div>
                            <div className={`w-9 shrink-0 text-right ${advances ? 'font-black text-primary' : 'font-bold text-on-surface'}`}>{(row.won ?? 0) * 2 + (row.lost ?? 0)}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
