import JRClubLayout from '@/Layouts/JRClubLayout';
import { League, Sport, Standing, Team } from '@/types/jrclub';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ leagues, activeLeague, standings, sports, teams, canManage }: { leagues: League[]; activeLeague?: League; standings: Standing[]; sports: Sport[]; teams: Team[]; canManage: boolean }) {
    const form = useForm({ name: '', sport_id: sports[0]?.id ?? '', description: '', start_date: '', end_date: '', status: 'upcoming' });

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
                    <h2 className="text-2xl font-black tracking-tight">{activeLeague.name}</h2>
                </div>
            ) : null}

            {canManage ? (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(route('leagues.store'), { preserveScroll: true, onSuccess: () => form.reset('name', 'description', 'start_date', 'end_date') });
                    }}
                    className="my-6 grid gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]"
                >
                    <input className="rounded-md border-0 bg-surface-container-low" placeholder="League name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    <select className="rounded-md border-0 bg-surface-container-low" value={form.data.sport_id} onChange={(e) => form.setData('sport_id', Number(e.target.value))}>
                        {sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                    </select>
                    <input className="rounded-md border-0 bg-surface-container-low" type="date" value={form.data.start_date} onChange={(e) => form.setData('start_date', e.target.value)} />
                    <input className="rounded-md border-0 bg-surface-container-low" type="date" value={form.data.end_date} onChange={(e) => form.setData('end_date', e.target.value)} />
                    <input className="rounded-md border-0 bg-surface-container-low sm:col-span-2" placeholder="Description" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                    <button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Create League</button>
                </form>
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

            <section className="mt-8 space-y-3">
                <div>
                    <h2 className="text-lg font-black uppercase tracking-[-0.04em] text-on-surface">Standings</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{activeLeague?.name ?? 'Active league'}</p>
                </div>
                <div className="overflow-hidden rounded-xl bg-surface-container-high">
                    {standings.map((row, index) => (
                        <Link
                            key={row.team.id}
                            href={route('teams.show', row.team.id)}
                            className={`${index === 0 ? 'mx-1 my-1 scale-[1.02] rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)]' : index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low'} flex items-center px-4 py-3 text-sm`}
                        >
                            <div className="w-8 font-bold">{index + 1}</div>
                            <div className="flex flex-grow items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high text-[10px] font-bold text-on-surface">
                                    {row.team.name.charAt(0)}
                                </div>
                                <span className="font-bold">{row.team.name}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-black">{row.points}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Pts</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-2">
                {(activeLeague?.matches ?? []).map((match) => (
                    <Link key={match.id} href={route('matches.show', match.id)} className="rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                        <div className="flex items-center justify-between">
                            <span className="font-bold">{match.home_team.name}</span>
                            <span className="text-xl font-black text-primary">{match.home_score} - {match.away_score}</span>
                            <span className="font-medium">{match.away_team.name}</span>
                        </div>
                    </Link>
                ))}
            </section>
        </JRClubLayout>
    );
}
