import BracketTree from '@/Components/BracketTree';
import { GameMatch, League, LeagueGroupStanding, LeagueStandingGroup, Standing } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Select from 'react-select';
import JRClubLayout from '@/Layouts/JRClubLayout';

export default function Show({ league, standings, upperBracket, lowerBracket }: { league: League; standings: Standing[] | LeagueStandingGroup[]; upperBracket: GameMatch[][]; lowerBracket: GameMatch[][] }) {
    const startDate = new Date(league.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endDate = league.end_date ? new Date(league.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD';

    // Get all matches
    const allMatches = league.matches || [];

    const [selectedSchedule, setSelectedSchedule] = useState<string>(() => {
        const now = new Date();
        const upcomingDates = allMatches
            .filter(m => m.scheduled_at && new Date(m.scheduled_at) > now && m.status !== 'completed')
            .map(m => new Date(m.scheduled_at));
        
        if (upcomingDates.length > 0) {
            upcomingDates.sort((a, b) => a.getTime() - b.getTime());
            const d = upcomingDates[0];
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
        
        if (allMatches.length > 0) {
            const sortedMatches = [...allMatches].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
            const d = new Date(sortedMatches[0].scheduled_at);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
        
        return '';
    });

    // Extract unique schedule dates for filter options
    const scheduleOptions = useMemo(() => {
        const dates = allMatches
            .map(m => m.scheduled_at)
            .filter((date): date is string => Boolean(date))
            .map(date => {
                const d = new Date(date);
                // Return YYYY-MM-DD format for internal value and a readable label
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const value = `${yyyy}-${mm}-${dd}`;
                
                return {
                    value,
                    label: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                };
            });
        
        // Remove duplicates by stringifying and parsing a set
        const uniqueDatesMap = new Map();
        dates.forEach(item => {
            uniqueDatesMap.set(item.value, item);
        });
        
        const sortedOptions = Array.from(uniqueDatesMap.values()).sort((a, b) => new Date(a.value).getTime() - new Date(b.value).getTime());
        
        return sortedOptions;
    }, [allMatches]);

    // Filter upcoming matches based on selection
    const upcomingMatches = useMemo(() => {
        let matches = allMatches;
        
        if (selectedSchedule) {
            matches = matches.filter(m => {
                if (!m.scheduled_at) return false;
                const d = new Date(m.scheduled_at);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}` === selectedSchedule;
            });
        }
        
        return matches.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    }, [allMatches, selectedSchedule]);

    // Group upcoming matches by stage for better display when a date is selected
    const groupedUpcomingMatches = useMemo(() => {
        const groups: Record<string, GameMatch[]> = {};
        const matchesToGroup = upcomingMatches;
        
        matchesToGroup.forEach(match => {
            const stage = match.stage || 'unassigned';
            if (!groups[stage]) {
                groups[stage] = [];
            }
            groups[stage].push(match);
        });
        
        return groups;
    }, [upcomingMatches]);

    const getStageName = (stage: string) => {
        if (stage.toLowerCase() === 'group') return 'Group Stage';
        if (stage.toLowerCase() === 'upper') return 'Upper Bracket';
        if (stage.toLowerCase() === 'lower') return 'Lower Bracket';
        if (stage.toLowerCase() === 'unassigned') return 'Other Matches';
        return stage.charAt(0).toUpperCase() + stage.slice(1);
    };

    const formatMatchDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()} • ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    };

    return (
        <JRClubLayout active="Leagues">
            <Head title={`${league.name} - ${league.sport?.name || 'League'} Details`} />

            {/* TopAppBar for Mobile Only */}
            <header className="md:hidden fixed top-0 w-full z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-[0_4px_20px_-2px_rgba(25,28,30,0.04)] flex items-center justify-between px-6 h-16">
                <Link href={route('leagues.index')} className="active:scale-95 duration-150 p-2 -ml-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="material-symbols-outlined text-blue-900 dark:text-blue-200">arrow_back</span>
                </Link>
                <h1 className="font-bold tracking-[-0.04em] uppercase text-sm text-blue-900 dark:text-blue-200">LEAGUE DETAILS</h1>
                <div className="w-8"></div> {/* Spacer for centering */}
            </header>

            <main className="max-w-3xl mx-auto p-4 md:p-0 space-y-8 pt-20 md:pt-4">
                {/* League Hero Section */}
                <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary to-primary-container opacity-10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="bg-surface-container-high text-on-surface px-2 py-1 rounded text-[0.6875rem] font-bold tracking-[0.05em] uppercase flex items-center">
                            <span className="material-symbols-outlined text-xs mr-1">{league.sport?.icon || 'emoji_events'}</span> 
                            {league.sport?.name || 'SPORTS'}
                        </span>
                        <span className="text-on-surface-variant text-[0.6875rem] font-bold tracking-[0.05em] uppercase">
                            {startDate} - {endDate}
                        </span>
                    </div>
                    <h2 className="font-black text-3xl md:text-4xl tracking-tight leading-tight text-on-surface mb-2">{league.name}</h2>
                    {league.description && (
                        <p className="text-on-surface-variant text-sm max-w-md">{league.description}</p>
                    )}
                </section>

                {/* Upcoming Matches */}
                {scheduleOptions.length > 0 && (
                    <section>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
                            <h3 className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-variant">UPCOMING MATCHES</h3>
                            
                            {/* Filter Dropdown */}
                            <div className="relative w-full sm:w-64 z-20">
                                <Select
                                    options={scheduleOptions}
                                    value={scheduleOptions.find(opt => opt.value === selectedSchedule) || null}
                                    onChange={(option) => setSelectedSchedule(option?.value || '')}
                                    className="text-sm font-bold"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: 'var(--surface-container-low, #f3f4f6)',
                                            borderColor: 'rgba(var(--outline-variant, 15, 23, 42), 0.2)',
                                            borderRadius: '0.5rem',
                                            padding: '2px',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                borderColor: 'var(--primary, #3b82f6)',
                                            }
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected ? 'var(--primary, #3b82f6)' : state.isFocused ? 'var(--surface-container-highest, #e5e7eb)' : 'transparent',
                                            color: state.isSelected ? 'white' : 'var(--on-surface, #0f172a)',
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: 'var(--on-surface, #0f172a)',
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: 'var(--surface-container-lowest, #ffffff)',
                                            borderRadius: '0.5rem',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                        })
                                    }}
                                    isSearchable={false}
                                />
                            </div>
                        </div>

                        {upcomingMatches.length > 0 ? (
                            <>
                                <div className="space-y-6">
                                    {Object.entries(groupedUpcomingMatches).map(([stage, matches]) => (
                                        <div key={stage} className="space-y-3">
                                            <h4 className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-primary border-b border-surface-container-high pb-1">
                                                {getStageName(stage)}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {matches.map(match => (
                                                    <Link href={route('matches.show', match.id)} key={match.id} className="block bg-surface-container-lowest rounded-xl p-5 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] cursor-pointer active:scale-[0.98] transition-transform">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <span className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-variant bg-surface px-2 py-1 rounded">
                                                                {formatMatchDate(match.scheduled_at)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between relative">
                                                            <div className="flex flex-col items-center flex-1">
                                                                {match.home_entry?.group_picture_path ? (
                                                                    <img src={`/storage/${match.home_entry.group_picture_path}`} alt={match.home_label ?? 'TBC'} className="w-14 h-14 rounded-full object-cover shadow-sm mb-2 ring-2 ring-surface-container-lowest" />
                                                                ) : (
                                                                    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-bold shadow-sm mb-2 ring-2 ring-surface-container-lowest mx-auto">
                                                                        {(match.home_label ?? 'TBC').substring(0, 2).toUpperCase()}
                                                                    </div>
                                                                )}
                                                                <span className="font-bold text-sm text-center">{match.home_label}</span>
                                                            </div>
                                                            <div className="px-4 z-10 bg-surface-container-lowest">
                                                                <span className="text-[0.6875rem] font-bold tracking-[0.05em] text-on-surface-variant bg-surface rounded-full px-3 py-1">VS</span>
                                                            </div>
                                                            {/* Connecting line */}
                                                            <div className="absolute left-1/4 right-1/4 top-1/2 h-px bg-surface-container-high -z-0"></div>
                                                            <div className="flex flex-col items-center flex-1">
                                                                {match.away_entry?.group_picture_path ? (
                                                                    <img src={`/storage/${match.away_entry.group_picture_path}`} alt={match.away_label ?? 'TBC'} className="w-14 h-14 rounded-full object-cover shadow-sm mb-2 ring-2 ring-surface-container-lowest" />
                                                                ) : (
                                                                    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-bold shadow-sm mb-2 ring-2 ring-surface-container-lowest mx-auto">
                                                                        {(match.away_label ?? 'TBC').substring(0, 2).toUpperCase()}
                                                                    </div>
                                                                )}
                                                                <span className="font-bold text-sm text-center">{match.away_label}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="bg-surface-container-lowest rounded-xl p-8 text-center shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                                <p className="text-sm font-bold text-on-surface-variant">No matches found for this schedule.</p>
                            </div>
                        )}
                    </section>
                )}

                {/* Standings Summary */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-variant">CURRENT STANDINGS</h3>
                        <Link href={route('leaderboards.index')} className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-primary hover:text-primary-container transition-colors">
                            View Full Leaderboard
                        </Link>
                    </div>
                    {standings.length === 0 ? (
                        <div className="bg-surface-container-lowest rounded-xl p-8 text-center shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                            <p className="text-sm font-bold text-on-surface-variant">No standings available yet.</p>
                        </div>
                    ) : league.category ? (
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

                {(upperBracket.length > 0 || lowerBracket.length > 0) && (
                    <section className="space-y-4">
                        <h3 className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-variant">TOURNAMENT BRACKETS</h3>
                        {upperBracket.length > 0 ? <BracketTree league={league} title="Upper Bracket" rounds={upperBracket} thirdPlaceMatch={league.third_place_match} champion={league.upper_champion} readOnly /> : null}
                        {lowerBracket.length > 0 ? <BracketTree league={league} title="Lower Bracket" rounds={lowerBracket} thirdPlaceMatch={league.lower_third_place_match} champion={league.lower_champion} readOnly /> : null}
                    </section>
                )}

                {/* Participating Teams */}
                {league.teams && league.teams.length > 0 && (
                    <section className="pb-8">
                        <h3 className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-variant mb-4">PARTICIPATING TEAMS ({league.teams.length})</h3>
                        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                            {league.teams.map(team => (
                                <div key={team.id} className="flex flex-col items-center min-w-[72px]">
                                    <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold shadow-sm mb-2 border-2 border-surface-container-lowest text-xl">
                                        {team.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-xs font-bold text-center truncate w-full px-1" title={team.name}>{team.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {league.entries && league.entries.length > 0 && (
                    <section className="pb-8">
                        <h3 className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-variant mb-4">PARTICIPATING ENTRIES ({league.entries.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {league.entries.map((entry) => (
                                <div key={entry.id} className="rounded-xl bg-surface-container-lowest px-4 py-3 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                                    <span className="font-bold text-on-surface">{entry.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
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
                <div key={row.team.id} className={`${index === 0 ? 'mx-1 my-1 scale-[1.02] rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)] z-10 relative' : index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low'} flex items-center px-4 py-3 text-sm`}>
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
