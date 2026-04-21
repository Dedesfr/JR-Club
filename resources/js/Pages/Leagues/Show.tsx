import BracketTree from '@/Components/BracketTree';
import { GameMatch, League, LeagueStandingGroup, Standing } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';

export default function Show({ league, standings, upperBracket, lowerBracket }: { league: League; standings: Standing[] | LeagueStandingGroup[]; upperBracket: GameMatch[][]; lowerBracket: GameMatch[][] }) {
    const startDate = new Date(league.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endDate = league.end_date ? new Date(league.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD';

    // Get upcoming matches (limit to 2 for preview)
    const upcomingMatches = league.matches
        ?.filter(m => new Date(m.scheduled_at) > new Date() && m.status !== 'completed')
        .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
        .slice(0, 2) || [];

    const formatMatchDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()} • ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    };

    return (
        <div className="bg-surface text-on-surface pb-24 md:pb-0 pt-16 min-h-screen">
            <Head title={`${league.name} - ${league.sport?.name || 'League'} Details`} />

            {/* TopAppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-[0_4px_20px_-2px_rgba(25,28,30,0.04)] flex items-center justify-between px-6 h-16">
                <Link href={route('leagues.index')} className="active:scale-95 duration-150 p-2 -ml-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="material-symbols-outlined text-blue-900 dark:text-blue-200">arrow_back</span>
                </Link>
                <h1 className="font-bold tracking-[-0.04em] uppercase text-sm text-blue-900 dark:text-blue-200">LEAGUE DETAILS</h1>
                <div className="w-8"></div> {/* Spacer for centering */}
            </header>

            <main className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
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

                {/* Standings Summary */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-variant">CURRENT STANDINGS</h3>
                        <Link href={route('leaderboards.index')} className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-primary hover:text-primary-container transition-colors">
                            View Full Leaderboard
                        </Link>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] flex flex-col space-y-2">
                        {!league.category && standings.length > 0 ? (standings as Standing[]).slice(0, 3).map((standing, index) => (
                            <div key={standing.team.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${index === 0 ? 'bg-surface' : 'hover:bg-surface cursor-pointer active:scale-[0.98]'}`}>
                                <div className="flex items-center space-x-4">
                                    <span className={`font-black text-lg w-4 text-center ${index === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{index + 1}</span>
                                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold shadow-sm">
                                        {standing.team.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="font-bold text-on-surface">{standing.team.name}</span>
                                </div>
                                <span className="font-black text-xl text-on-surface">{standing.points}<span className="text-xs text-on-surface-variant ml-1 font-bold">PTS</span></span>
                            </div>
                        )) : (
                            league.category && (standings as LeagueStandingGroup[]).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(standings as LeagueStandingGroup[]).map((group) => (
                                        <div key={group.group} className="rounded-xl bg-surface-container-low p-3">
                                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{group.group}</p>
                                            <div className="mt-2 space-y-2">
                                                {group.entries.map((entry, index) => (
                                                    <div key={entry.id} className="flex items-center justify-between rounded-lg bg-surface-container-lowest px-3 py-2">
                                                        <span className="font-bold text-on-surface">{index + 1}. {entry.entry.label}</span>
                                                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{entry.points} pts</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-on-surface-variant p-2 text-center">No standings available yet.</p>
                        )}
                    </div>
                </section>

                {(upperBracket.length > 0 || lowerBracket.length > 0) && (
                    <section className="space-y-4">
                        <h3 className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-variant">TOURNAMENT BRACKETS</h3>
                        {upperBracket.length > 0 ? <BracketTree league={league} title="Upper Bracket" rounds={upperBracket} thirdPlaceMatch={league.third_place_match} champion={league.upper_champion} readOnly /> : null}
                        {lowerBracket.length > 0 ? <BracketTree league={league} title="Lower Bracket" rounds={lowerBracket} thirdPlaceMatch={league.lower_third_place_match} champion={league.lower_champion} readOnly /> : null}
                    </section>
                )}

                {/* Upcoming Matches */}
                {upcomingMatches.length > 0 && (
                    <section>
                        <h3 className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-variant mb-4">UPCOMING MATCHES</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {upcomingMatches.map(match => (
                                <Link href={route('matches.show', match.id)} key={match.id} className="block bg-surface-container-lowest rounded-xl p-5 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] cursor-pointer active:scale-[0.98] transition-transform">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-variant bg-surface px-2 py-1 rounded">
                                            {formatMatchDate(match.scheduled_at)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between relative">
                                        <div className="flex flex-col items-center flex-1">
                                            <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold shadow-sm mb-2 text-xl">
                                                {(match.home_label ?? 'TBD').substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-sm text-center">{match.home_label}</span>
                                        </div>
                                        <div className="px-4 z-10 bg-surface-container-lowest">
                                            <span className="text-[0.6875rem] font-bold tracking-[0.05em] text-on-surface-variant bg-surface rounded-full px-3 py-1">VS</span>
                                        </div>
                                        {/* Connecting line */}
                                        <div className="absolute left-1/4 right-1/4 top-1/2 h-px bg-surface-container-high -z-0"></div>
                                        <div className="flex flex-col items-center flex-1">
                                            <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold shadow-sm mb-2 text-xl">
                                                {(match.away_label ?? 'TBD').substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-sm text-center">{match.away_label}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
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
            
            {/* Nav to emulate layout on mobile */}
            <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-[0_-8px_32px_-4px_rgba(25,28,30,0.06)] flex justify-around items-center px-4 py-3 border-t border-transparent bg-gradient-to-t from-white to-transparent">
                <Link href={route('activities.index')} className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-700 dark:hover:text-blue-300 transition-all active:scale-90 duration-200">
                    <span className="material-symbols-outlined mb-1 text-[24px]">explore</span>
                    <span className="text-[10px] font-bold tracking-[0.05em] uppercase">ACTIVITIES</span>
                </Link>
                <Link href={route('leagues.index')} className="flex flex-col items-center justify-center bg-gradient-to-br from-[#003f7b] to-[#0056a4] text-white rounded-lg px-4 py-1.5 active:scale-90 duration-200 shadow-sm">
                    <span className="material-symbols-outlined mb-1 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    <span className="text-[10px] font-bold tracking-[0.05em] uppercase">LEAGUES</span>
                </Link>
                <Link href={route('leaderboards.index')} className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-700 dark:hover:text-blue-300 transition-all active:scale-90 duration-200">
                    <span className="material-symbols-outlined mb-1 text-[24px]">leaderboard</span>
                    <span className="text-[10px] font-bold tracking-[0.05em] uppercase">RANKINGS</span>
                </Link>
                <Link href={route('profile.show')} className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-700 dark:hover:text-blue-300 transition-all active:scale-90 duration-200">
                    <span className="material-symbols-outlined mb-1 text-[24px]">person</span>
                    <span className="text-[10px] font-bold tracking-[0.05em] uppercase">PROFILE</span>
                </Link>
            </nav>
        </div>
    );
}
