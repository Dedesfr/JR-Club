import BracketTree from '@/Components/BracketTree';
import SelectInput from '@/Components/SelectInput';
import JRClubLayout from '@/Layouts/JRClubLayout';
import { GameMatch, League, LeagueGroupStanding, LeagueStandingGroup, Sport, Standing } from '@/types/jrclub';
import { Head, Link, router } from '@inertiajs/react';

type LeagueBrief = { id: number; name: string };

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

    let upperWinner: string | null = null;
    let upperRunnerUp: string | null = null;
    let lowerWinner: string | null = null;
    let lowerRunnerUp: string | null = null;

    if (league) {
        if (isGroupStandings) {
            if (league.upper_champion) {
                upperWinner = league.upper_champion.label;

                if (upperBracket && upperBracket.length > 0) {
                    const finalRound = upperBracket[upperBracket.length - 1];
                    if (finalRound && finalRound.length > 0) {
                        const finalMatch = finalRound[0];
                        if (finalMatch.home_entry?.id === league.upper_champion.id) {
                            upperRunnerUp = finalMatch.away_label ?? null;
                        } else if (finalMatch.away_entry?.id === league.upper_champion.id) {
                            upperRunnerUp = finalMatch.home_label ?? null;
                        }
                    }
                }
            }
            if (league.lower_champion) {
                lowerWinner = league.lower_champion.label;

                if (lowerBracket && lowerBracket.length > 0) {
                    const finalRound = lowerBracket[lowerBracket.length - 1];
                    if (finalRound && finalRound.length > 0) {
                        const finalMatch = finalRound[0];
                        if (finalMatch.home_entry?.id === league.lower_champion.id) {
                            lowerRunnerUp = finalMatch.away_label ?? null;
                        } else if (finalMatch.away_entry?.id === league.lower_champion.id) {
                            lowerRunnerUp = finalMatch.home_label ?? null;
                        }
                    }
                }
            }
        } else {
            const teamStandings = standings as Standing[];
            if (teamStandings.length > 0 && teamStandings[0].played > 0) {
                upperWinner = teamStandings[0].team.name;
            }
            if (teamStandings.length > 1 && teamStandings[1].played > 0) {
                upperRunnerUp = teamStandings[1].team.name;
            }
        }
    }

    return (
        <JRClubLayout active="Rankings">
            <Head title="Leaderboards" />
            <section className="space-y-4 pt-4">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-on-surface">Leaderboards</h1>
                <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
                    <Link href={route('leaderboards.index')} className="shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest bg-surface-container-high text-on-surface">Global Players</Link>
                    <Link href={route('leaderboards.leagues')} className="shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-br from-primary to-primary-container text-on-primary">League Standings</Link>
                </div>

                <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
                    <Link href={route('leaderboards.leagues')} className={`flex shrink-0 items-center gap-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest ${!selectedSportId ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface'}`}>All Sports</Link>
                    {sports.map((sport) => <Link key={sport.id} href={route('leaderboards.leagues', { sport_id: sport.id })} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest ${selectedSportId === sport.id ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface'}`}>{sport.name}</Link>)}
                </div>

                {leagues.length > 0 && (
                    <div className="pt-2">
                        <SelectInput
                            value={selectedLeagueId}
                            options={leagues.map((l) => ({ value: String(l.id), label: l.name }))}
                            onChange={(value) => {
                                router.get(route('leaderboards.leagues'), {
                                    sport_id: selectedSportId,
                                    league_id: value
                                }, { preserveState: true });
                            }}
                            placeholder="Select a league"
                        />
                    </div>
                )}
            </section>

            {(upperWinner || upperRunnerUp || lowerWinner || lowerRunnerUp) && (
                <section className="mt-6 space-y-4">
                    {(upperWinner || upperRunnerUp) && (
                        <div>
                            {league?.lower_champion && <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant">Upper Bracket</h3>}
                            <div className="grid grid-cols-2 gap-4">
                                {upperWinner && (
                                    <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 to-yellow-500 p-4 text-yellow-950 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)]">
                                        <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-xs font-black text-yellow-900 shadow-sm">#1</div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Champion</span>
                                        <span className="mt-1 text-center text-base font-black">{upperWinner}</span>
                                    </div>
                                )}
                                {upperRunnerUp && (
                                    <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-high p-4 text-on-surface shadow-[0_8px_20px_-4px_rgba(25,28,30,0.06)]">
                                        <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest text-xs font-black text-on-surface shadow-sm">#2</div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Runner Up</span>
                                        <span className="mt-1 text-center text-base font-black">{upperRunnerUp}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {(lowerWinner || lowerRunnerUp) && (
                        <div>
                            <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant">Lower Bracket</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {lowerWinner && (
                                    <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 to-yellow-500 p-4 text-yellow-950 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)]">
                                        <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-xs font-black text-yellow-900 shadow-sm">#1</div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Champion</span>
                                        <span className="mt-1 text-center text-base font-black">{lowerWinner}</span>
                                    </div>
                                )}
                                {lowerRunnerUp && (
                                    <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-high p-4 text-on-surface shadow-[0_8px_20px_-4px_rgba(25,28,30,0.06)]">
                                        <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest text-xs font-black text-on-surface shadow-sm">#2</div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Runner Up</span>
                                        <span className="mt-1 text-center text-base font-black">{lowerRunnerUp}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            )}

            <section className="mb-8 mt-6">
                {leagues.length === 0 ? (
                    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                        <p className="p-4 text-sm text-on-surface-variant">No leagues found for this sport.</p>
                    </div>
                ) : standings.length === 0 ? (
                    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                        <p className="p-4 text-sm text-on-surface-variant">No standings available for this league yet.</p>
                    </div>
                ) : isGroupStandings ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {(standings as LeagueStandingGroup[]).map((group) => (
                            <div key={group.group} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                                <GroupStanding group={group} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                        <TeamStandings standings={standings as Standing[]} />
                    </div>
                )}
            </section>

            {league && upperBracket && upperBracket.length > 0 && (
                <section className="mb-8">
                    <BracketTree league={league} title="Upper Bracket" rounds={upperBracket} thirdPlaceMatch={league.third_place_match} champion={league.upper_champion} readOnly />
                </section>
            )}

            {league && lowerBracket && lowerBracket.length > 0 && (
                <section className="mb-8">
                    <BracketTree league={league} title="Lower Bracket" rounds={lowerBracket} champion={league.lower_champion} readOnly />
                </section>
            )}
        </JRClubLayout>
    );
}

function TeamStandings({ standings }: { standings: Standing[] }) {
    return (
        <>
            <div className="flex items-center bg-surface-container-low px-4 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="w-8">#</div><div className="flex-grow">Team</div><div className="w-8 text-center">P</div><div className="w-8 text-center">W</div><div className="w-8 text-center">D</div><div className="w-8 text-center">L</div><div className="w-10 text-right font-black text-on-surface">Pts</div>
            </div>
            {standings.map((row, index) => (
                <div key={row.team.id} className={`${index === 0 ? 'mx-1 my-1 scale-[1.02] rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)]' : index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low'} flex items-center px-4 py-3 text-sm`}>
                    <div className="w-8 font-bold">{index + 1}</div>
                    <div className="flex flex-grow items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-high text-[10px] font-bold text-on-surface">{row.team.name.charAt(0)}</div><span className="font-bold">{row.team.name}</span></div>
                    <div className="w-8 text-center text-on-surface-variant">{row.played}</div>
                    <div className="w-8 text-center text-on-surface-variant">{row.won}</div>
                    <div className="w-8 text-center text-on-surface-variant">{row.drawn}</div>
                    <div className="w-8 text-center text-on-surface-variant">{row.lost}</div>
                    <div className="w-10 text-right font-black">{(row.won ?? 0) * 2 + (row.lost ?? 0)}</div>
                </div>
            ))}
        </>
    );
}

function GroupStanding({ group }: { group: LeagueStandingGroup }) {
    return (
        <div className="flex flex-col h-full bg-surface-container-lowest">
            <div className="bg-surface-container-low px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary">
                {group.group}
            </div>
            <div className="flex items-center border-b border-outline-variant/30 px-4 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="w-8 shrink-0 text-center">#</div>
                <div className="flex-grow min-w-0">Club</div>
                <div className="w-8 shrink-0 text-center" title="Match Played">MP</div>
                <div className="w-8 shrink-0 text-center" title="Win">W</div>
                <div className="w-8 shrink-0 text-center" title="Loss">L</div>
                <div className="w-10 shrink-0 text-center" title="Accumulated Score">Scr</div>
                <div className="w-10 shrink-0 text-right font-black text-on-surface" title="Points">Pts</div>
            </div>
            {group.entries.map((row: LeagueGroupStanding, index) => (
                <div key={row.id} className="flex items-center border-b border-outline-variant/10 px-4 py-3 text-sm last:border-b-0 hover:bg-surface-container-low transition-colors">
                    <div className="w-8 shrink-0 font-medium text-on-surface-variant text-center">{index + 1}</div>
                    <div className="flex flex-grow min-w-0 items-center gap-2">
                        {row.entry.group_picture_path ? (
                            <img src={`/storage/${row.entry.group_picture_path}`} alt={row.entry.label} className="h-6 w-6 shrink-0 rounded-full object-cover shadow-sm bg-surface-container-high" />
                        ) : (
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-[10px] font-bold text-on-surface">
                                {row.entry.label.charAt(0)}
                            </div>
                        )}
                        <span className="truncate font-medium text-on-surface">{row.entry.label}</span>
                    </div>
                    <div className="w-8 shrink-0 text-center text-on-surface-variant">{row.played ?? 0}</div>
                    <div className="w-8 shrink-0 text-center text-on-surface-variant">{row.won ?? 0}</div>
                    <div className="w-8 shrink-0 text-center text-on-surface-variant">{row.lost ?? 0}</div>
                    <div className="w-10 shrink-0 text-center text-on-surface-variant">{row.score ?? 0}</div>
                    <div className="w-10 shrink-0 text-right font-bold text-on-surface">{(row.won ?? 0) * 2 + (row.lost ?? 0)}</div>
                </div>
            ))}
        </div>
    );
}
