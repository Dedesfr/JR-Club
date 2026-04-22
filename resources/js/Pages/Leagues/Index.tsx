import JRClubLayout from '@/Layouts/JRClubLayout';
import { League, Sport, Team } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Select, { SingleValue } from 'react-select';

const statusLabels = ['upcoming', 'active', 'completed'] as const;
type SportOption = { value: string; label: string };

function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getInitials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function getStatusCopy(status: string) {
    switch (status) {
        case 'upcoming':
            return 'Registration and scheduling underway';
        case 'completed':
            return 'Competition wrapped and archived';
        default:
            return 'Standings and fixtures are live';
    }
}

function getAccentClasses(status: string) {
    switch (status) {
        case 'completed':
            return {
                badge: 'text-tertiary',
                icon: 'bg-tertiary-fixed text-on-tertiary-fixed',
                glow: 'from-tertiary-fixed/80 to-transparent',
            };
        case 'upcoming':
            return {
                badge: 'text-secondary',
                icon: 'bg-secondary-fixed text-on-secondary-fixed',
                glow: 'from-secondary-fixed/80 to-transparent',
            };
        default:
            return {
                badge: 'text-primary',
                icon: 'bg-primary-fixed text-on-primary-fixed',
                glow: 'from-primary-fixed/80 to-transparent',
            };
    }
}

export default function Index({
    leagues,
    allLeagues,
    activeLeague,
    sports,
    teams,
    canManage,
    statusFilter,
}: {
    leagues: League[];
    allLeagues: League[];
    activeLeague?: League;
    sports: Sport[];
    teams: Team[];
    canManage: boolean;
    statusFilter: (typeof statusLabels)[number];
}) {
    const [selectedSportId, setSelectedSportId] = useState<string>('all');
    const sportOptions: SportOption[] = [{ value: 'all', label: 'All sports' }, ...sports.map((sport) => ({ value: String(sport.id), label: sport.name }))];
    const visibleLeagues = selectedSportId === 'all' ? leagues : leagues.filter((league) => String(league.sport.id) === selectedSportId);
    const featuredLeague = (selectedSportId === 'all' ? activeLeague : visibleLeagues[0]) ?? visibleLeagues[0];
    const activeCount = allLeagues.filter((league) => league.status === 'active').length;
    const statusCounts = {
        upcoming: allLeagues.filter((league) => league.status === 'upcoming').length,
        active: activeCount,
        completed: allLeagues.filter((league) => league.status === 'completed').length,
    };
    const totalTeamCount = teams.length || leagues.reduce((count, league) => count + (league.teams?.length ?? 0), 0);

    return (
        <JRClubLayout active="Leagues">
            <Head title="Leagues" />

            <section className="relative overflow-hidden rounded-[2rem] bg-inverse-surface text-inverse-on-surface shadow-[0px_18px_40px_rgba(15,23,42,0.14)]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,86,164,0.16),transparent_45%),radial-gradient(circle_at_top_left,rgba(167,200,255,0.28),transparent_30%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
                <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -right-12 top-[-2rem] h-56 w-56 rounded-full border border-white/15" />
                <div className="absolute right-4 top-4 h-40 w-40 rounded-full border border-white/10" />
                <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-primary-container/20 blur-3xl" />

                <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.45fr_0.85fr] lg:p-8">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white/80">
                            <span className="material-symbols-outlined text-[16px]">sports_score</span>
                            Active Competitions
                        </div>

                        <h1 className="max-w-xl text-[2.2rem] font-black uppercase leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl">
                            League season, framed like an event.
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
                            A stronger hero, a featured competition panel, and more structured league cards make this screen feel like a live tournament board instead of a plain list.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            {featuredLeague ? (
                                <Link
                                    href={route('leagues.show', featuredLeague.id)}
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-transform duration-200 hover:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined text-[18px]">emoji_events</span>
                                    View Featured League
                                </Link>
                            ) : null}

                            {canManage ? (
                                <Link
                                    href={route('admin.leagues.index')}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold text-white/90 transition-colors hover:bg-white/12"
                                >
                                    <span className="material-symbols-outlined text-[18px]">tune</span>
                                    Manage Leagues
                                </Link>
                            ) : null}
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white/60">Active</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">{activeCount}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white/60">Sports</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">{sports.length}</p>
                            </div>
                            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm sm:col-span-1">
                                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white/60">Teams</p>
                                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">{totalTeamCount}</p>
                            </div>
                        </div>
                    </div>

                    {featuredLeague ? (
                        <div className="relative self-end">
                            <div className="rounded-[1.75rem] border border-white/10 bg-white/95 p-5 text-on-surface shadow-[0px_12px_32px_rgba(15,23,42,0.16)]">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-on-surface-variant">Featured League</p>
                                        <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">{featuredLeague.name}</h2>
                                    </div>
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                                        <span className="material-symbols-outlined fill text-[28px]">{featuredLeague.sport.icon}</span>
                                    </div>
                                </div>

                                <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                                    {featuredLeague.description || getStatusCopy(featuredLeague.status)}
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl bg-surface-container-low p-3">
                                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-on-surface-variant">Start</p>
                                        <p className="mt-2 text-sm font-bold text-on-surface">{formatDate(featuredLeague.start_date)}</p>
                                    </div>
                                    <div className="rounded-2xl bg-surface-container-low p-3">
                                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-on-surface-variant">Format</p>
                                        <p className="mt-2 text-sm font-bold text-on-surface">{featuredLeague.entry_type ? `${featuredLeague.entry_type} entry` : featuredLeague.category || 'League play'}</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex -space-x-3">
                                    {(featuredLeague.teams ?? []).slice(0, 4).map((team) => (
                                        <div key={team.id} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary-fixed text-xs font-bold text-on-primary-fixed">
                                            {getInitials(team.name)}
                                        </div>
                                    ))}
                                    {(featuredLeague.teams?.length ?? 0) > 4 ? (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-surface-container-low text-xs font-bold text-on-surface-variant">
                                            +{(featuredLeague.teams?.length ?? 0) - 4}
                                        </div>
                                    ) : null}
                                </div>

                                <Link
                                    href={route('leagues.show', featuredLeague.id)}
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.18)] transition-transform duration-200 hover:scale-[0.99]"
                                >
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    Open Standings
                                </Link>
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,24rem)] xl:items-start">
                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-[0_12px_32px_rgba(15,23,42,0.03)]">
                    <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-on-surface-variant">Filter by status</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                        {statusLabels.map((status) => (
                            <Link
                                key={status}
                                href={route('leagues.index', { status })}
                                preserveScroll
                                className={`rounded-2xl border px-4 py-3 text-left transition-colors ${status === statusFilter
                                        ? 'border-primary/20 bg-primary-fixed/70 text-primary shadow-[0_8px_20px_rgba(0,86,164,0.08)]'
                                        : 'border-outline-variant/30 bg-surface-container-low text-on-surface hover:border-primary/20 hover:bg-surface-container'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] opacity-70">{status}</p>
                                        <p className="mt-2 text-xl font-black tracking-[-0.03em]">{statusCounts[status]}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-[20px] opacity-60">tune</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-[0_12px_32px_rgba(15,23,42,0.03)]">
                    <p className="mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-on-surface-variant">Filter by sport</p>
                    <Select<SportOption, false>
                        options={sportOptions}
                        value={sportOptions.find((option) => option.value === selectedSportId) ?? sportOptions[0]}
                        onChange={(option: SingleValue<SportOption>) => setSelectedSportId(option?.value ?? 'all')}
                        isSearchable={false}
                        className="text-sm font-bold"
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                minHeight: '48px',
                                backgroundColor: 'var(--surface-container-low, #f2f4f6)',
                                borderColor: state.isFocused ? 'var(--primary, #0056a4)' : 'rgba(15, 23, 42, 0.12)',
                                borderRadius: '0.875rem',
                                boxShadow: 'none',
                                paddingInline: '0.25rem',
                                '&:hover': {
                                    borderColor: 'var(--primary, #0056a4)',
                                },
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                paddingInline: '0.5rem',
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: 'var(--on-surface, #111827)',
                            }),
                            indicatorSeparator: () => ({ display: 'none' }),
                            dropdownIndicator: (base) => ({
                                ...base,
                                color: 'var(--on-surface-variant, #6b7280)',
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                    ? 'var(--primary-fixed, #dbeafe)'
                                    : state.isFocused
                                        ? 'var(--surface-container-high, #e5e7eb)'
                                        : 'var(--surface-container-lowest, #ffffff)',
                                color: 'var(--on-surface, #111827)',
                                fontWeight: state.isSelected ? 700 : 600,
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 30,
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                backgroundColor: 'var(--surface-container-lowest, #ffffff)',
                                boxShadow: '0 16px 32px rgba(15, 23, 42, 0.12)',
                            }),
                        }}
                    />
                </div>
            </section>

            <section className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Browse Leagues</p>
                    <h2 className="mt-2 text-[2rem] font-black uppercase tracking-[-0.04em] text-on-surface">Current competition board</h2>
                </div>
            </section>

            <section className="my-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visibleLeagues.length > 0 ? (
                    visibleLeagues.map((league) => {
                        const accent = getAccentClasses(league.status);
                        const teamCount = league.teams?.length ?? 0;

                        return (
                            <Link
                                key={league.id}
                                href={route('leagues.show', league.id)}
                                className="group relative overflow-hidden rounded-[1.75rem] bg-surface-container-lowest p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)] ring-1 ring-outline-variant/20 transition-transform duration-300 hover:-translate-y-1"
                            >
                                <div className={`absolute right-0 top-0 h-32 w-32 rounded-bl-[2rem] bg-gradient-to-br ${accent.glow}`} />
                                <div className="relative z-10 flex items-start justify-between gap-4">
                                    <div>
                                        <p className={`text-[0.6875rem] font-bold uppercase tracking-[0.14em] ${accent.badge}`}>
                                            {formatDate(league.start_date)} • {league.status}
                                        </p>
                                        <h3 className="mt-2 w-3/4 text-[1.6rem] font-bold leading-tight tracking-tight text-on-surface">{league.name}</h3>
                                    </div>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.icon}`}>
                                        <span className="material-symbols-outlined fill text-[24px]">{league.sport.icon}</span>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl bg-surface-container-low p-3">
                                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-on-surface-variant">Format</p>
                                        <p className="mt-2 text-sm font-bold text-on-surface">{league.entry_type ? `${league.entry_type} entry` : league.category || 'League play'}</p>
                                    </div>
                                    <div className="rounded-2xl bg-surface-container-low p-3">
                                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-on-surface-variant">Teams</p>
                                        <p className="mt-2 text-sm font-bold text-on-surface">{teamCount || league.participant_total || 0}</p>
                                    </div>
                                </div>

                                <p className="relative z-10 mt-5 text-sm leading-6 text-on-surface-variant">
                                    {league.description || getStatusCopy(league.status)}
                                </p>

                                <div className="relative z-10 mt-5 flex items-center justify-between gap-4">
                                    <div className="flex -space-x-3">
                                        {(league.teams ?? []).slice(0, 3).map((team, index) => (
                                            <div
                                                key={team.id}
                                                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface-container-lowest text-xs font-bold ${index === 0 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface'}`}
                                            >
                                                {getInitials(team.name)}
                                            </div>
                                        ))}
                                        {teamCount > 3 ? (
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-surface-container-low text-xs font-bold text-on-surface-variant">
                                                +{teamCount - 3}
                                            </div>
                                        ) : null}
                                    </div>

                                    <span className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-[0.12em] text-primary">
                                        Standings
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </span>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] ring-1 ring-outline-variant/20 md:col-span-2 xl:col-span-3">
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-on-surface-variant">No matching leagues</p>
                        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">No leagues found for this sport in the selected status.</h3>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
                            Try another sport category or switch the status tab to browse the rest of the competition board.
                        </p>
                    </div>
                )}
            </section>
        </JRClubLayout>
    );
}
