import { Link } from '@inertiajs/react';
import { GameMatch } from '@/types/jrclub';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import JRClubLayout from '@/Layouts/JRClubLayout';

export default function Show({ match, canManage }: { match: GameMatch; canManage: boolean }) {
    const [score, setScore] = useState({ home: match.home_score, away: match.away_score, status: match.status });
    const homeLabel = match.home_label ?? match.home_team?.name ?? 'TBD';
    const awayLabel = match.away_label ?? match.away_team?.name ?? 'TBD';

    useEffect(() => {
        const echo = (window as any).Echo;
        if (!echo) return;

        const channel = echo.channel(`matches.${match.id}`).listen('.score.updated', (event: any) => {
            setScore({ home: event.home_score, away: event.away_score, status: event.status });
        });

        return () => echo.leaveChannel(`matches.${match.id}`);
    }, [match.id]);

    const saveScore = (home: number, away: number) => {
        router.patch(route('matches.score', match.id), { home_score: Math.max(0, home), away_score: Math.max(0, away) }, { preserveScroll: true });
        setScore({ ...score, home: Math.max(0, home), away: Math.max(0, away), status: 'live' });
    };

    return (
        <JRClubLayout active="Leagues">
            <Head title="Live Match" />
            <header className="md:hidden fixed top-0 z-50 w-full bg-white/85 shadow-sm backdrop-blur-md">
                <div className="flex w-full items-center justify-between px-6 py-4">
                    <Link href={route('leagues.index')} className="scale-95 text-on-surface"><span className="material-symbols-outlined">arrow_back</span></Link>
                    <h1 className="text-lg font-bold uppercase tracking-tight text-on-surface">Match Details</h1>
                    <span className="material-symbols-outlined text-on-surface">more_vert</span>
                </div>
            </header>

            <main className="mx-auto flex max-w-md flex-col gap-6 px-4 pt-20 md:pt-4 md:max-w-3xl lg:max-w-5xl lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
                <div className="flex flex-col gap-6 lg:col-span-8">
                    <section className="flex flex-col overflow-hidden rounded-xl bg-inverse-surface text-inverse-on-surface shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                        <div className="flex items-center justify-between bg-surface-container-highest/10 px-6 py-3">
                            <span className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-error"><span className="h-2 w-2 animate-pulse rounded-full bg-error" /> {score.status}</span>
                            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-inverse-on-surface/70">{match.league?.name}</span>
                        </div>
                        <div className="relative flex items-center justify-between px-6 py-10">
                            <TeamBlock name={homeLabel} />
                            <div className="z-10 flex flex-col items-center justify-center">
                                <div className="flex items-center gap-4">
                                    <span className="text-6xl font-black tracking-[-0.04em]">{score.home}</span>
                                    <span className="text-2xl font-bold text-outline-variant/40">-</span>
                                    <span className="text-6xl font-black tracking-[-0.04em] text-inverse-on-surface/50">{score.away}</span>
                                </div>
                            </div>
                            <TeamBlock name={awayLabel} muted />
                        </div>
                    </section>

                    <section className="flex flex-col gap-4 rounded-lg bg-surface-container-low p-5">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-outline">location_on</span>
                            <div><p className="text-sm font-bold tracking-tight text-on-surface">{match.location || 'Main Court'}</p><p className="text-[0.6875rem] font-medium text-on-surface-variant">{new Date(match.scheduled_at).toLocaleString()}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined fill text-outline">sports</span>
                            <div><p className="text-sm font-bold tracking-tight text-on-surface">League Match</p><p className="text-[0.6875rem] font-medium text-on-surface-variant">{match.league?.sport?.name}</p></div>
                        </div>
                    </section>

                    {match.league?.category && (
                        <section className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-surface-container-lowest p-5 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                                <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-primary">{homeLabel} Players</h2>
                                <div className="grid gap-2">
                                    <p className="text-sm font-bold text-on-surface">{match.home_entry?.player1?.name}</p>
                                    {match.home_entry?.player2 && <p className="text-sm font-bold text-on-surface">{match.home_entry.player2.name}</p>}
                                    {match.substitutions?.filter(s => s.entry_id === match.home_entry?.id).map(sub => {
                                        const subPlayer = match.home_entry?.substitutes?.find(p => p.id === sub.substitute_id);
                                        return subPlayer ? (
                                            <p key={sub.id} className="text-sm font-bold text-tertiary">
                                                {subPlayer.name} (Sub)
                                            </p>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                            <div className="rounded-xl bg-surface-container-lowest p-5 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                                <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-primary">{awayLabel} Players</h2>
                                <div className="grid gap-2">
                                    <p className="text-sm font-bold text-on-surface">{match.away_entry?.player1?.name}</p>
                                    {match.away_entry?.player2 && <p className="text-sm font-bold text-on-surface">{match.away_entry.player2.name}</p>}
                                    {match.substitutions?.filter(s => s.entry_id === match.away_entry?.id).map(sub => {
                                        const subPlayer = match.away_entry?.substitutes?.find(p => p.id === sub.substitute_id);
                                        return subPlayer ? (
                                            <p key={sub.id} className="text-sm font-bold text-tertiary">
                                                {subPlayer.name} (Sub)
                                            </p>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {(match.sets ?? []).length > 0 ? (
                        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                            <h2 className="mb-3 text-lg font-black uppercase tracking-[-0.04em] text-on-surface">Set Scores</h2>
                            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                                {match.sets?.map((set) => (
                                    <div key={set.id} className="flex items-center justify-between rounded-lg bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface">
                                        <span>Set {set.set_number}</span>
                                        <span>{set.home_points} - {set.away_points}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {match.documents && match.documents.length > 0 && (
                        <section className="flex flex-col gap-3">
                            <h2 className="mb-1 text-lg font-black uppercase tracking-[-0.04em] text-on-surface">Match Photos</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {match.documents.map((doc) => (
                                    <a key={doc.id} href={`/storage/${doc.path}`} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-lg border border-outline-variant overflow-hidden group block hover:ring-2 hover:ring-primary transition-all">
                                        <img src={`/storage/${doc.path}`} alt={doc.original_name} className="object-cover w-full h-full" />
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="flex flex-col gap-6 lg:col-span-4 lg:sticky lg:top-24">
                    {canManage ? (
                        <section className="grid gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                            <button onClick={() => router.post(route('matches.start', match.id))} className="rounded bg-gradient-to-br from-primary to-primary-container px-5 py-4 text-sm font-bold uppercase tracking-widest text-white">Start Match</button>
                            <div className="flex items-center justify-between gap-3">
                                <button onClick={() => saveScore(score.home - 1, score.away)} className="h-10 w-10 rounded-full bg-surface-container-high font-bold">-</button>
                                <span className="font-bold">{homeLabel}</span>
                                <button onClick={() => saveScore(score.home + 1, score.away)} className="h-10 w-10 rounded-full bg-primary font-bold text-on-primary">+</button>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <button onClick={() => saveScore(score.home, score.away - 1)} className="h-10 w-10 rounded-full bg-surface-container-high font-bold">-</button>
                                <span className="font-bold">{awayLabel}</span>
                                <button onClick={() => saveScore(score.home, score.away + 1)} className="h-10 w-10 rounded-full bg-primary font-bold text-on-primary">+</button>
                            </div>
                            <button onClick={() => router.post(route('matches.end', match.id))} className="rounded bg-tertiary px-5 py-4 text-sm font-bold uppercase tracking-widest text-white">End Match</button>
                        </section>
                    ) : null}

                    <section className="flex flex-col gap-3">
                        <h2 className="mb-1 text-lg font-black uppercase tracking-[-0.04em] text-on-surface">Play-by-Play</h2>
                        <div className="relative flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] before:absolute before:bottom-0 before:left-[43px] before:top-0 before:w-[2px] before:bg-surface-container-high">
                             <TimelineEvent icon="sports_score" time="Live" title={`${homeLabel} ${score.home} - ${score.away} ${awayLabel}`} detail="Latest score update" />
                            <TimelineEvent icon="change_circle" time="Kickoff" title="Match started" detail={new Date(match.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                        </div>
                    </section>
                </div>
            </main>
        </JRClubLayout>
    );
}

function TeamBlock({ name, muted = false }: { name: string; muted?: boolean }) {
    return <div className={`z-10 flex w-1/3 flex-col items-center gap-3 ${muted ? 'opacity-70' : ''}`}><div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-surface-container-high text-lg font-black text-primary shadow-sm ${muted ? 'grayscale' : ''}`}>{name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div><span className="text-center text-[0.6875rem] font-bold uppercase tracking-[0.05em]">{name}</span></div>;
}

function TimelineEvent({ icon, time, title, detail }: { icon: string; time: string; title: string; detail: string }) {
    return <div className="group relative flex gap-4 p-4 transition-colors hover:bg-surface-container-low"><div className="z-10 flex w-14 flex-shrink-0 flex-col items-center justify-start pt-1"><span className="bg-surface-container-lowest px-1 text-[0.6875rem] font-bold text-on-surface-variant">{time}</span></div><div className="z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm outline outline-4 outline-surface-container-lowest"><span className="material-symbols-outlined fill text-sm">{icon}</span></div><div className="flex-grow pb-2 pt-1"><p className="text-sm font-bold leading-snug tracking-tight text-on-surface">{title}</p><p className="mt-1 text-[0.6875rem] text-on-surface-variant">{detail}</p></div></div>;
}
