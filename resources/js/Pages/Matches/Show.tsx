import { Link } from '@inertiajs/react';
import { GameMatch, MatchSet } from '@/types/jrclub';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import JRClubLayout from '@/Layouts/JRClubLayout';

const CARD_SHADOW = 'shadow-[0_12px_32px_rgba(15,23,42,0.04)]';

function getFallbackIcon(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    const index = (Math.abs(hash) % 7) + 1;
    return `/images/icon-${index}.jpeg`;
}

function resolveIconPath(icon?: string | null): string {
    if (!icon) return '';
    if (icon.startsWith('http') || icon.startsWith('/')) return icon;
    return `/storage/${icon}`;
}

export default function Show({ match, canManage }: { match: GameMatch; canManage: boolean }) {
    const [score, setScore] = useState({ home: match.home_score, away: match.away_score, status: match.status });
    const homeLabel = match.home_label ?? match.home_team?.name ?? 'TBC';
    const awayLabel = match.away_label ?? match.away_team?.name ?? 'TBC';

    useEffect(() => {
        const echo = (window as any).Echo;
        if (!echo) return;

        echo.channel(`matches.${match.id}`).listen('.score.updated', (event: any) => {
            setScore({ home: event.home_score, away: event.away_score, status: event.status });
        });

        return () => echo.leaveChannel(`matches.${match.id}`);
    }, [match.id]);

    const saveScore = (home: number, away: number) => {
        const h = Math.max(0, home);
        const a = Math.max(0, away);
        router.patch(route('matches.score', match.id), { home_score: h, away_score: a }, { preserveScroll: true });
        setScore({ home: h, away: a, status: 'live' });
    };

    // Derived match narrative
    const completedSets: MatchSet[] = match.sets ?? [];
    const setsWonHome = completedSets.filter((s) => s.home_points > s.away_points).length;
    const setsWonAway = completedSets.filter((s) => s.away_points > s.home_points).length;
    const setsToWin = match.league?.sets_to_win ?? 2;
    const pointsPerSet = match.league?.points_per_set ?? 21;
    const totalSetSlots = Math.max(1, 2 * setsToWin - 1);
    const currentSetNumber = completedSets.length + 1;
    const isLive = score.status === 'live';
    const isFinal = score.status === 'final' || score.status === 'completed' || setsWonHome >= setsToWin || setsWonAway >= setsToWin;
    const homeLeading = score.home > score.away;
    const awayLeading = score.away > score.home;

    // Auto-generated play-by-play from set transitions + current state
    type TimelineItem = { key: string; time: string; title: string; detail: string; icon: string; emphasis?: boolean };
    const timeline: TimelineItem[] = [];
    if (isFinal) {
        const winner = setsWonHome > setsWonAway ? homeLabel : awayLabel;
        timeline.push({ key: 'final', time: 'Final', title: `${winner} won ${Math.max(setsWonHome, setsWonAway)} — ${Math.min(setsWonHome, setsWonAway)}`, detail: 'Match ended', icon: 'emoji_events', emphasis: true });
    } else if (isLive) {
        timeline.push({ key: 'live', time: 'Now', title: `${homeLabel} ${score.home} — ${score.away} ${awayLabel}`, detail: `Set ${Math.min(currentSetNumber, totalSetSlots)} · first to ${pointsPerSet}`, icon: 'sports_score', emphasis: true });
    }
    [...completedSets].reverse().forEach((set) => {
        const winner = set.home_points > set.away_points ? homeLabel : awayLabel;
        timeline.push({
            key: `set-${set.id}`,
            time: `Set ${set.set_number}`,
            title: `${winner} took set ${set.set_number}`,
            detail: `${set.home_points} — ${set.away_points}`,
            icon: 'flag',
        });
    });
    timeline.push({
        key: 'start',
        time: new Date(match.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Match scheduled',
        detail: match.location || 'Main Court',
        icon: 'schedule',
    });

    const statusLabel = isFinal ? 'Final' : isLive ? 'Live' : 'Upcoming';
    const statusDotClass = isLive ? 'bg-error animate-pulse' : isFinal ? 'bg-tertiary' : 'bg-outline';

    return (
        <JRClubLayout active="Leagues">
            <Head title={`${homeLabel} vs ${awayLabel}`} />

            {/* Section: Top Bar — shared across breakpoints */}
            <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <Link
                            href={match.league ? route('leagues.show', match.league.id) : route('leagues.index')}
                            className="grid h-9 w-9 place-items-center rounded-full text-on-surface transition active:scale-95 hover:bg-surface-container-low"
                            aria-label="Back"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <div className="min-w-0">
                            <p className="truncate text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                                {match.league?.sport?.name ?? 'Match'}
                                {match.league?.category ? ` · ${match.league.category}` : ''}
                                {match.group?.name ? ` · ${match.group.name}` : ''}
                            </p>
                            <h1 className="truncate text-sm font-bold tracking-tight text-on-surface">
                                {match.league?.name ?? 'Match Details'}
                            </h1>
                        </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container-low px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface">
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass}`} />
                        {statusLabel}
                    </span>
                </div>
            </header>

            <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">

                {/* Section: Primary Column */}
                <div className="flex flex-col gap-6 lg:col-span-8">

                    {/* Section: Hero Scoreboard */}
                    <section className={`overflow-hidden rounded-xl bg-inverse-surface text-inverse-on-surface ${CARD_SHADOW}`}>
                        <div className="flex items-center justify-between border-b border-white/5 px-5 py-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-inverse-on-surface/70 sm:px-6">
                            <span>
                                Set {Math.min(currentSetNumber, totalSetSlots)} of {totalSetSlots} · First to {pointsPerSet}
                            </span>
                            <span className="hidden sm:inline">
                                {match.location || 'Main Court'} · {new Date(match.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-8 sm:gap-6 sm:px-8 sm:py-10">
                            <TeamColumn
                                label={homeLabel}
                                score={score.home}
                                leading={homeLeading}
                                dimmed={awayLeading}
                                align="right"
                                serving={isLive && homeLeading}
                                icon={match.home_entry?.group_picture_path ? resolveIconPath(match.home_entry.group_picture_path) : undefined}
                            />

                            <div className="flex flex-col items-center gap-2">
                                <span className="rounded-full bg-white/10 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-inverse-on-surface">
                                    {setsWonHome} — {setsWonAway}
                                </span>
                                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-inverse-on-surface/50">Sets</span>
                            </div>

                            <TeamColumn
                                label={awayLabel}
                                score={score.away}
                                leading={awayLeading}
                                dimmed={homeLeading}
                                align="left"
                                serving={isLive && awayLeading}
                                icon={match.away_entry?.group_picture_path ? resolveIconPath(match.away_entry.group_picture_path) : undefined}
                            />
                        </div>

                        {canManage && (
                            <div className="grid grid-cols-2 gap-0 border-t border-white/5 bg-black/20">
                                <ScoreStepper label={homeLabel} value={score.home} onInc={() => saveScore(score.home + 1, score.away)} onDec={() => saveScore(score.home - 1, score.away)} />
                                <ScoreStepper label={awayLabel} value={score.away} onInc={() => saveScore(score.home, score.away + 1)} onDec={() => saveScore(score.home, score.away - 1)} align="end" />
                            </div>
                        )}
                    </section>

                    {/* Section: Admin Controls — separated from scoreboard */}
                    {canManage && (
                        <section className={`flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-container-lowest p-4 ${CARD_SHADOW}`}>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Match Controls</p>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => router.post(route('matches.start', match.id))}
                                    disabled={isLive || isFinal}
                                    className="inline-flex items-center gap-1.5 rounded bg-gradient-to-br from-primary to-primary-container px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-primary shadow-[0_8px_16px_rgba(0,86,164,0.15)] transition hover:shadow-[0_12px_24px_rgba(0,86,164,0.25)] disabled:opacity-40 disabled:shadow-none"
                                >
                                    <span className="material-symbols-outlined text-base">play_arrow</span>
                                    Start
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('End this match? This cannot be undone.')) router.post(route('matches.end', match.id));
                                    }}
                                    disabled={isFinal}
                                    className="inline-flex items-center gap-1.5 rounded bg-surface-container-high px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface transition hover:bg-surface-container-highest disabled:opacity-40"
                                >
                                    <span className="material-symbols-outlined text-base">stop_circle</span>
                                    End Match
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Section: Set-by-Set Strip */}
                    <section className={`rounded-xl bg-surface-container-lowest p-5 ${CARD_SHADOW}`}>
                        <div className="mb-4 flex items-baseline justify-between">
                            <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface">Sets</h2>
                            <p className="text-[0.6875rem] font-medium text-on-surface-variant">
                                {setsWonHome} — {setsWonAway} · best of {totalSetSlots}
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {Array.from({ length: totalSetSlots }).map((_, i) => {
                                const setNumber = i + 1;
                                const played = completedSets.find((s) => s.set_number === setNumber);
                                const isCurrent = !played && !isFinal && setNumber === currentSetNumber;
                                return (
                                    <SetCard
                                        key={setNumber}
                                        setNumber={setNumber}
                                        homeLabel={homeLabel}
                                        awayLabel={awayLabel}
                                        state={played ? 'final' : isCurrent ? 'live' : 'pending'}
                                        homePoints={played?.home_points ?? (isCurrent ? score.home : null)}
                                        awayPoints={played?.away_points ?? (isCurrent ? score.away : null)}
                                    />
                                );
                            })}
                        </div>
                    </section>

                    {/* Section: Match Info */}
                    <section className={`grid gap-4 rounded-xl bg-surface-container-lowest p-5 sm:grid-cols-2 ${CARD_SHADOW}`}>
                        <InfoRow icon="location_on" label="Venue" title={match.location || 'Main Court'} detail={new Date(match.scheduled_at).toLocaleString()} />
                        <InfoRow icon="sports" label="Format" title={match.league ? 'League Match' : 'Team Match'} detail={`${match.league?.sport?.name ?? ''}${match.league?.category ? ` · ${match.league.category}` : ''}`.trim() || '—'} />
                    </section>

                    {/* Section: Match Photos */}
                    {match.documents && match.documents.length > 0 && (
                        <section className="flex flex-col gap-3">
                            <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface">Match Photos</h2>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-4">
                                {match.documents.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={`/storage/${doc.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative block aspect-square overflow-hidden rounded-lg bg-surface-container-low transition hover:ring-2 hover:ring-primary"
                                    >
                                        <img src={`/storage/${doc.path}`} alt={doc.original_name} className="h-full w-full object-cover transition group-hover:scale-105" />
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Section: Sidebar */}
                <aside className="flex flex-col gap-6 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">

                    {/* Section: Rosters */}
                    {match.league?.category && (
                        <section className={`rounded-xl bg-surface-container-lowest p-5 ${CARD_SHADOW}`}>
                            <h2 className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface">Rosters</h2>
                            <RosterBlock label={homeLabel} entry={match.home_entry} subs={match.substitutions?.filter((s) => s.entry_id === match.home_entry?.id) ?? []} />
                            <div className="my-4 h-px bg-surface-container-high" />
                            <RosterBlock label={awayLabel} entry={match.away_entry} subs={match.substitutions?.filter((s) => s.entry_id === match.away_entry?.id) ?? []} />
                        </section>
                    )}

                    {/* Section: Play-by-Play */}
                    <section className={`rounded-xl bg-surface-container-lowest p-5 ${CARD_SHADOW}`}>
                        <div className="mb-4 flex items-baseline justify-between">
                            <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface">Play-by-Play</h2>
                            <p className="text-[0.6875rem] font-medium text-on-surface-variant">{isLive ? 'Live' : isFinal ? 'Final' : 'Pending'}</p>
                        </div>
                        <ol className="relative space-y-4 border-l-2 border-surface-container-high pl-4">
                            {timeline.map((item) => (
                                <li key={item.key} className="relative">
                                    <span className={`absolute -left-[21px] top-0.5 grid h-4 w-4 place-items-center rounded-full ${item.emphasis ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border-2 border-surface-container-high text-on-surface-variant'}`}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 10 }}>{item.icon}</span>
                                    </span>
                                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{item.time}</p>
                                    <p className="text-sm font-bold tracking-tight text-on-surface">{item.title}</p>
                                    <p className="text-[0.75rem] text-on-surface-variant">{item.detail}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                </aside>
            </main>
        </JRClubLayout>
    );
}

function TeamColumn({ label, score, leading, dimmed, align, serving, icon }: { label: string; score: number; leading: boolean; dimmed: boolean; align: 'left' | 'right'; serving: boolean; icon?: string }) {
    const src = icon || getFallbackIcon(label);
    return (
        <div className={`flex flex-col items-center gap-3 text-center ${dimmed ? 'opacity-60' : ''}`}>
            <img
                src={src}
                alt={label}
                className={`h-14 w-14 rounded-full border-2 object-cover sm:h-16 sm:w-16 ${leading ? 'border-inverse-on-surface' : 'border-white/10'}`}
            />
            <div>
                <p className="max-w-[9rem] truncate text-xs font-bold uppercase tracking-[0.05em] text-inverse-on-surface sm:text-sm">{label}</p>
                {serving && <p className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary-fixed-dim">● Serving</p>}
            </div>
            <p
                className={`font-black tabular-nums tracking-[-0.04em] leading-none transition-all ${leading ? 'text-6xl sm:text-7xl text-inverse-on-surface' : 'text-5xl sm:text-6xl text-inverse-on-surface/50'}`}
                style={{ textAlign: align === 'right' ? 'right' : 'left' }}
            >
                {score}
            </p>
        </div>
    );
}

function ScoreStepper({ label, value, onInc, onDec, align = 'start' }: { label: string; value: number; onInc: () => void; onDec: () => void; align?: 'start' | 'end' }) {
    return (
        <div className={`flex items-center justify-between gap-2 px-4 py-3 ${align === 'end' ? 'border-l border-white/5' : ''}`}>
            <button
                onClick={onDec}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-inverse-on-surface transition active:scale-95 hover:bg-white/20"
                aria-label={`Decrease ${label} score`}
            >
                <span className="material-symbols-outlined text-base">remove</span>
            </button>
            <div className="min-w-0 flex-1 text-center">
                <p className="truncate text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-inverse-on-surface/70">{label}</p>
                <p className="text-lg font-black tabular-nums text-inverse-on-surface">{value}</p>
            </div>
            <button
                onClick={onInc}
                className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0_8px_16px_rgba(0,86,164,0.25)] transition active:scale-95"
                aria-label={`Increase ${label} score`}
            >
                <span className="material-symbols-outlined text-base">add</span>
            </button>
        </div>
    );
}

function SetCard({ setNumber, homeLabel, awayLabel, state, homePoints, awayPoints }: { setNumber: number; homeLabel: string; awayLabel: string; state: 'final' | 'live' | 'pending'; homePoints: number | null; awayPoints: number | null }) {
    const base = 'rounded-lg p-4 transition';
    if (state === 'pending') {
        return (
            <div className={`${base} border-2 border-dashed border-surface-container-high bg-surface-container-low/40`}>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant/60">Set {setNumber} · Pending</p>
                <div className="mt-2 flex items-end justify-between">
                    <p className="text-2xl font-black tabular-nums text-on-surface-variant/30">—</p>
                    <span className="text-outline/40">·</span>
                    <p className="text-2xl font-black tabular-nums text-on-surface-variant/30">—</p>
                </div>
            </div>
        );
    }
    const isLive = state === 'live';
    const homeWon = (homePoints ?? 0) > (awayPoints ?? 0);
    return (
        <div className={`${base} ${isLive ? 'bg-surface-container-lowest ring-2 ring-primary' : 'bg-surface-container-low'}`}>
            <p className={`text-[0.6875rem] font-bold uppercase tracking-[0.05em] ${isLive ? 'text-primary' : 'text-on-surface-variant'}`}>
                {isLive ? <><span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-error align-middle" />Set {setNumber} · Live</> : `Set ${setNumber} · Final`}
            </p>
            <div className="mt-2 flex items-end justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.6875rem] font-medium uppercase tracking-[0.05em] text-on-surface-variant">{homeLabel}</p>
                    <p className={`text-2xl font-black tabular-nums ${!isLive && homeWon ? 'text-on-surface' : 'text-on-surface-variant'}`}>{homePoints}</p>
                </div>
                <span className="pb-1 text-outline-variant">{!isLive && homeWon ? '‹' : !isLive ? '›' : '·'}</span>
                <div className="min-w-0 flex-1 text-right">
                    <p className="truncate text-[0.6875rem] font-medium uppercase tracking-[0.05em] text-on-surface-variant">{awayLabel}</p>
                    <p className={`text-2xl font-black tabular-nums ${!isLive && !homeWon ? 'text-on-surface' : 'text-on-surface-variant'}`}>{awayPoints}</p>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, title, detail }: { icon: string; label: string; title: string; detail: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className="min-w-0">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</p>
                <p className="truncate text-sm font-bold tracking-tight text-on-surface">{title}</p>
                <p className="truncate text-[0.75rem] text-on-surface-variant">{detail}</p>
            </div>
        </div>
    );
}

function RosterBlock({ label, entry, subs }: { label: string; entry?: GameMatch['home_entry']; subs: NonNullable<GameMatch['substitutions']> }) {
    const players = [entry?.player1, entry?.player2].filter(Boolean) as { id: number; name: string }[];
    return (
        <div>
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</p>
            <ul className="space-y-2">
                {players.map((p, i) => (
                    <PlayerRow key={p.id} name={p.name} role={`Player ${i + 1}`} icon={getFallbackIcon(p.name + p.id)} />
                ))}
                {subs.map((sub) => {
                    const subPlayer = entry?.substitutes?.find((p) => p.id === sub.substitute_id);
                    const original = [entry?.player1, entry?.player2].find((p) => p?.id === sub.original_player_id);
                    if (!subPlayer) return null;
                    return (
                        <PlayerRow
                            key={sub.id}
                            name={subPlayer.name}
                            role={`Sub · in for ${original?.name ?? 'player'}`}
                            highlight
                            icon={getFallbackIcon(subPlayer.name + subPlayer.id)}
                        />
                    );
                })}
            </ul>
        </div>
    );
}

function PlayerRow({ name, role, highlight = false, icon }: { name: string; role: string; highlight?: boolean; icon?: string }) {
    const src = icon || getFallbackIcon(name);
    return (
        <li className={`flex items-center gap-3 rounded-lg px-2 py-1.5 ${highlight ? 'bg-tertiary-fixed/40' : ''}`}>
            <img
                src={src}
                alt={name}
                className={`h-9 w-9 shrink-0 rounded-full object-cover ${highlight ? 'ring-2 ring-tertiary' : ''}`}
            />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold tracking-tight text-on-surface">{name}</p>
                <p className={`truncate text-[0.6875rem] font-bold uppercase tracking-[0.05em] ${highlight ? 'text-on-tertiary-container' : 'text-on-surface-variant'}`}>{role}</p>
            </div>
        </li>
    );
}
