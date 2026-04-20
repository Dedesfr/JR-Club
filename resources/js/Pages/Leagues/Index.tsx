import JRClubLayout from '@/Layouts/JRClubLayout';
import { League, LeagueStandingGroup, Sport, Standing, Team } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';

export default function Index({ leagues, activeLeague, sports, teams, canManage }: { leagues: League[]; activeLeague?: League; sports: Sport[]; teams: Team[]; canManage: boolean }) {
    return (
        <JRClubLayout active="Leagues">
            <Head title="Leagues" />
            <section className="flex flex-col items-start gap-2 pt-4">
                <h1 className="text-4xl font-black uppercase leading-none tracking-tighter text-on-surface">LEAGUES</h1>
                <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Active Competitions</p>
            </section>

            <div className="sticky top-24 z-40 my-6 flex rounded-full bg-surface-container-high p-1">
                {['upcoming', 'active', 'completed'].map((status) => (
                    <Link
                        key={status}
                        href={route('leagues.index')}
                        className={`flex-1 rounded-full py-2 text-center text-xs font-bold uppercase tracking-widest transition-colors ${status === 'active' ? 'bg-surface-container-lowest text-primary shadow-[0_4px_12px_rgba(25,28,30,0.05)]' : 'text-on-surface-variant hover:bg-surface-container-lowest'}`}
                    >
                        {status}
                    </Link>
                ))}
            </div>

            {activeLeague ? (
                <div className="mb-6 rounded-xl bg-surface-container-low p-4">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Featured</p>
                    <div className="flex items-start justify-between gap-3">
                        <h2 className="text-2xl font-black tracking-tight">{activeLeague.name}</h2>
                        {canManage ? <Link href={route('admin.leagues.index')} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-primary">Admin</Link> : null}
                    </div>
                </div>
            ) : null}

            <section className="my-6 space-y-6">
                <div className="space-y-6">
                    {leagues.map((league) => (
                        <Link
                            key={league.id}
                            href={route('leagues.show', league.id)}
                            className="group relative block overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] transition-transform duration-300 hover:scale-[1.01]"
                        >
                            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-primary-container/10 to-transparent" />
                            <div className="absolute right-4 top-4 z-10 text-primary-container">
                                <span className="material-symbols-outlined fill text-3xl">{league.sport.icon}</span>
                            </div>
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">
                                        {new Date(league.start_date).toLocaleDateString()} - {league.status}
                                    </span>
                                    <h3 className="w-3/4 text-2xl font-bold leading-tight tracking-tight text-on-surface">{league.name}</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {(league.teams ?? []).slice(0, 3).map((team) => (
                                            <div key={team.id} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-primary-fixed text-xs font-bold text-on-primary-fixed">
                                                {team.name.charAt(0)}
                                            </div>
                                        ))}
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-surface-container-high text-xs font-bold text-on-surface-variant">
                                            +{Math.max(0, (league.teams?.length ?? 0) - 3)}
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Teams</span>
                                </div>
                                <span className="mt-2 inline-flex w-max items-center gap-1 text-sm font-bold uppercase tracking-widest text-primary">
                                    View Standings
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </JRClubLayout>
    );
}
