import JRClubLayout from '@/Layouts/JRClubLayout';
import { formatJakartaDate, getJakartaDateKey } from '@/lib/datetime';
import { League, Sport, Team } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const statusLabels = ['upcoming', 'active', 'completed'] as const;
const sportOrder = ['Badminton', 'Basketball', 'Padel', 'Mini Soccer', 'Other'] as const;

const sportImages: Record<string, string> = {
    badminton: '/images/badminton.jpeg',
    futsal: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    soccer: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    basketball: '/images/basketball.jpeg',
    tennis: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80',
    running: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=900&q=80',
};

export default function Index({
    leagues,
    allLeagues,
    sports,
    teams,
    canManage,
    statusFilter,
}: {
    leagues: League[];
    allLeagues: League[];
    sports: Sport[];
    teams: Team[];
    canManage: boolean;
    statusFilter: (typeof statusLabels)[number];
}) {
    const orderedSports = [...sports].sort((left, right) => {
        const leftIndex = sportOrder.indexOf(left.name as (typeof sportOrder)[number]);
        const rightIndex = sportOrder.indexOf(right.name as (typeof sportOrder)[number]);

        if (leftIndex === -1 && rightIndex === -1) return left.name.localeCompare(right.name);
        if (leftIndex === -1) return 1;
        if (rightIndex === -1) return -1;

        return leftIndex - rightIndex;
    });
    const [selectedSportId, setSelectedSportId] = useState<string>('all');
    const visibleLeagues = selectedSportId === 'all' ? leagues : leagues.filter((league) => String(league.sport.id) === selectedSportId);
    const activeCount = allLeagues.filter((league) => league.status === 'active').length;
    const totalTeamCount = teams.length || allLeagues.reduce((count, league) => count + getLeagueEntrants(league), 0);

    return (
        <JRClubLayout active="Tournaments">
            <Head title="Tournaments" />

            {/* Section: Athletic Header Band */}
            <section className="relative -mt-4 overflow-hidden bg-inverse-surface" style={{ marginLeft: 'calc(50% - 50vw)', width: '100vw' }}>
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-35"
                    style={{ backgroundImage: "url('/images/hero-bg.jpeg')" }}
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface/70 via-inverse-surface/55 to-inverse-surface/70" aria-hidden="true" />
                <div className="relative mx-auto max-w-md px-4 pt-5 pb-0 md:max-w-7xl md:px-6 lg:px-8">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Competition Board · Season Live</p>
                            <h1 className="mt-1 text-4xl font-black leading-none text-inverse-on-surface md:text-5xl">Tournaments</h1>
                        </div>
                        <div className="hidden items-center gap-2 self-center rounded-xl bg-white/10 px-4 py-2.5 text-sm text-inverse-on-surface/60 md:flex">
                            <span className="material-symbols-outlined text-[16px]">search</span>
                            <span>Search leagues...</span>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="mt-4 flex items-center gap-6 border-t border-white/10 pt-4 md:gap-10">
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Active</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{activeCount}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Sports</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{sports.length}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Teams</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{totalTeamCount}</p>
                        </div>
                        {canManage ? (
                            <>
                                <div className="flex-1" />
                                <Link
                                    href={route('admin.leagues.index')}
                                    className="hidden rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-inverse-on-surface/70 transition-colors hover:border-white/40 hover:text-inverse-on-surface lg:block"
                                >
                                    Manage Tournaments
                                </Link>
                            </>
                        ) : null}
                    </div>

                    {/* Status filter tabs — underline style, flush to bottom */}
                    <div className="mt-4 flex overflow-x-auto">
                        {statusLabels.map((status) => (
                            <Link
                                key={status}
                                href={route('leagues.index', { status })}
                                preserveScroll
                                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition-colors md:px-6 ${
                                    status === statusFilter
                                        ? 'border-inverse-on-surface text-inverse-on-surface'
                                        : 'border-transparent text-inverse-on-surface/40 hover:text-inverse-on-surface/70'
                                }`}
                            >
                                {toTitle(status)}
                            </Link>
                        ))}
                    </div>

                </div>
            </section>

            {/* Section: Sport Filter Pills */}
            <section className="mt-5 flex gap-2 overflow-x-auto pb-1">
                <button
                    type="button"
                    onClick={() => setSelectedSportId('all')}
                    className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all active:scale-[0.98] ${selectedSportId === 'all' ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]' : 'bg-surface-container-lowest text-on-surface-variant shadow-[0px_4px_12px_rgba(15,23,42,0.03)] hover:bg-surface-container-high'}`}
                >
                    All Sports
                </button>
                {orderedSports.map((sport) => (
                    <button
                        key={sport.id}
                        type="button"
                        onClick={() => setSelectedSportId(String(sport.id))}
                        className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all active:scale-[0.98] ${selectedSportId === String(sport.id) ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]' : 'bg-surface-container-lowest text-on-surface-variant shadow-[0px_4px_12px_rgba(15,23,42,0.03)] hover:bg-surface-container-high'}`}
                    >
                        {sport.name}
                    </button>
                ))}
            </section>

            {/* Section: Featured League Card */}
            {/* Section: League cards */}
            {visibleLeagues.length > 0 ? (
                <section className="mt-6">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-black tracking-tight text-on-surface md:text-xl">Tournaments</h2>
                            <span className="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded-full bg-surface-container px-2 text-xs font-bold text-on-surface-variant">
                                {visibleLeagues.length}
                            </span>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {visibleLeagues.map((league) => (
                            <CompactLeagueCard key={league.id} league={league} />
                        ))}
                    </div>
                </section>
            ) : null}

            {visibleLeagues.length === 0 ? (
                <section className="mt-5 rounded-xl bg-surface-container-lowest px-6 py-10 text-center shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:px-10">
                    <span className="material-symbols-outlined mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-2xl text-on-surface-variant">
                        emoji_events
                    </span>
                    <p className="mt-5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">No matching tournaments</p>
                    <h2 className="mx-auto mt-2 max-w-md text-2xl font-black tracking-normal text-on-surface">No tournaments found for this sport and status.</h2>
                    <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-on-surface-variant">Try a different sport or switch status tabs to see more competitions.</p>
                    {selectedSportId !== 'all' ? (
                        <button
                            type="button"
                            onClick={() => setSelectedSportId('all')}
                            className="mt-5 inline-flex items-center justify-center rounded-full bg-surface-container-low px-5 py-2.5 text-sm font-bold text-on-surface transition-all hover:bg-surface-container active:scale-[0.98]"
                        >
                            Show all sports
                        </button>
                    ) : null}
                </section>
            ) : null}
        </JRClubLayout>
    );
}

function CompactLeagueCard({ league }: { league: League }) {
    const entrants = getLeagueEntrants(league);
    const isCompleted = league.status === 'completed';
    const isActive = league.status === 'active';
    const isUpcoming = league.status === 'upcoming';
    const bannerUrl = league.banner_url || getSportImage(league.sport.name);
    const groupCount = league.group_count ?? league.groups?.length ?? '-';
    const matchCount = league.matches?.length ?? 0;
    const champion = isCompleted ? (league.upper_champion ?? league.lower_champion) : null;

    return (
        <Link
            href={route('leagues.show', league.id)}
            className={`group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_4px_16px_rgba(15,23,42,0.04)] transition-all active:scale-[0.98] hover:shadow-[0px_12px_32px_rgba(15,23,42,0.08)] ${isCompleted ? 'opacity-75' : ''}`}
        >
            {/* Banner */}
            <div className="relative aspect-[16/6] overflow-hidden">
                <img
                    src={bannerUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/40 via-inverse-surface/10 to-transparent" />

                <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-wider backdrop-blur-sm ${
                        isActive ? 'bg-inverse-surface/80 text-inverse-on-surface' : 'bg-white/90 text-on-surface'
                    }`}
                >
                    {toTitle(league.status)}
                </span>

                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-on-surface backdrop-blur-sm">
                    {league.sport.name} · {getLeagueFormat(league)}
                </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="line-clamp-2 text-[1rem] font-black leading-snug text-on-surface">{league.name}</h3>

                <div className="grid grid-cols-3 divide-x divide-surface-container rounded-lg bg-surface-container-low py-2">
                    <div className="px-2 text-center">
                        <p className="text-[0.55rem] font-bold uppercase tracking-wider text-on-surface-variant">{getEntrantLabel(league)}</p>
                        <p className="text-sm font-black text-on-surface">{entrants}</p>
                    </div>
                    <div className="px-2 text-center">
                        <p className="text-[0.55rem] font-bold uppercase tracking-wider text-on-surface-variant">Groups</p>
                        <p className="text-sm font-black text-on-surface">{groupCount}</p>
                    </div>
                    <div className="px-2 text-center">
                        <p className="text-[0.55rem] font-bold uppercase tracking-wider text-on-surface-variant">
                            {isCompleted ? 'Matches' : isUpcoming ? 'Format' : 'Matches'}
                        </p>
                        <p className="text-sm font-black text-on-surface">
                            {isCompleted ? matchCount : isUpcoming ? getLeagueFormatShort(league) : matchCount}
                        </p>
                    </div>
                </div>

                {isActive && (
                    <div className="mt-auto flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">play_circle</span>
                            <span>{league.stage ? toTitle(league.stage) : 'In Progress'}</span>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                    </div>
                )}

                {isUpcoming && (
                    <div className="mt-auto flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">event</span>
                            <span>Starts {formatDate(league.start_date)}</span>
                        </div>
                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-on-surface-variant">{getDaysUntil(league.start_date)}</span>
                    </div>
                )}

                {isCompleted && champion && (
                    <div className="mt-auto flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="material-symbols-outlined text-[18px] text-on-surface">emoji_events</span>
                            <div className="min-w-0">
                                <p className="text-[0.55rem] font-bold uppercase tracking-wider text-on-surface-variant leading-none">Champion</p>
                                <p className="text-xs font-black text-on-surface truncate leading-tight mt-0.5">{champion.label}</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                    </div>
                )}
            </div>
        </Link>
    );
}

function StatusPill({ status, className = '' }: { status: string; className?: string }) {
    const completed = status === 'completed';

    return (
        <span className={`rounded-full px-3 py-1 text-[0.625rem] font-black uppercase tracking-[0.05em] ${completed ? 'bg-tertiary-fixed text-tertiary' : status === 'active' ? 'bg-primary-fixed text-primary' : 'bg-secondary-fixed text-secondary'} ${className}`}>
            {toTitle(status)}
        </span>
    );
}

function getLeagueEntrants(league: League) {
    return league.teams?.length ?? league.entries?.length ?? league.participant_total ?? 0;
}

function getLeagueFormat(league: League) {
    if (league.entry_type) return `${toTitle(league.entry_type)} Entry`;
    if (league.category) return league.category;
    return 'Tournament Play';
}

function getStatusCopy(status: string) {
    switch (status) {
        case 'upcoming':
            return 'Registration and scheduling underway.';
        case 'completed':
            return 'Competition wrapped and archived.';
        default:
            return 'Standings and fixtures are live.';
    }
}

function getSportImage(name: string) {
    return sportImages[name.toLowerCase()] ?? sportImages.badminton;
}

function getEntrantLabel(league: League) {
    if (league.sport.name.toLowerCase() === 'running') return 'Runners';
    if (league.sport.name.toLowerCase() === 'badminton' && league.entry_type === 'single') return 'Players';
    return 'Teams';
}

function getLeagueFormatShort(league: League) {
    if (league.category) return league.category;
    if (league.entry_type) return toTitle(league.entry_type);
    return 'Tournament';
}

function getDaysUntil(date: string) {
    const parseDateKey = (dateKey: string) => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const target = parseDateKey(date);
    const today = parseDateKey(getJakartaDateKey(new Date()));
    const days = Math.round((target.getTime() - today.getTime()) / 86400000);

    return days > 0 ? `in ${days}d` : days === 0 ? 'today' : 'started';
}

function formatDate(date: string) {
    return formatJakartaDate(date);
}

function toTitle(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
