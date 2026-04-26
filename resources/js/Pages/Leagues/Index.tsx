import JRClubLayout from '@/Layouts/JRClubLayout';
import { League, Sport, Team } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const statusLabels = ['upcoming', 'active', 'completed'] as const;

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
    const visibleLeagues = selectedSportId === 'all' ? leagues : leagues.filter((league) => String(league.sport.id) === selectedSportId);
    const featuredLeague = (selectedSportId === 'all' ? activeLeague : visibleLeagues[0]) ?? visibleLeagues[0];
    const remainingLeagues = visibleLeagues.filter((league) => league.id !== featuredLeague?.id);
    const activeCount = allLeagues.filter((league) => league.status === 'active').length;
    const totalTeamCount = teams.length || allLeagues.reduce((count, league) => count + getLeagueEntrants(league), 0);

    return (
        <JRClubLayout active="Leagues">
            <Head title="Leagues" />

            {/* Section: Dark Athletic Header Band */}
            <section className="-mt-4 bg-inverse-surface" style={{ marginLeft: 'calc(50% - 50vw)', width: '100vw' }}>
                <div className="mx-auto max-w-md px-4 pt-5 pb-0 md:max-w-7xl md:px-6 lg:px-8">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Competition Board · Season Live</p>
                            <h1 className="mt-1 text-4xl font-black leading-none text-inverse-on-surface md:text-5xl">Leagues</h1>
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
                                    Manage Leagues
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
                {sports.map((sport) => (
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
            {featuredLeague ? (
                <section className="mt-5 overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_2px_12px_rgba(15,23,42,0.08),0px_0px_0px_1px_rgba(15,23,42,0.04)] md:grid md:grid-cols-[20rem_minmax(0,1fr)]">
                    {/* Cover image */}
                    <div className="relative min-h-56 overflow-hidden md:min-h-72">
                        <img src={getSportImage(featuredLeague.sport.name)} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/70 via-inverse-surface/20 to-transparent md:bg-gradient-to-r md:from-inverse-surface/20 md:via-transparent md:to-surface-container-lowest" />
                        {/* Status pill */}
                        <StatusPill status={featuredLeague.status} className="absolute left-4 top-4" />
                        {/* Mobile-only: title overlay on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
                            <div className="mb-2 flex flex-wrap gap-1.5">
                                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm">{featuredLeague.sport.name}</span>
                                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm">{getLeagueFormat(featuredLeague)}</span>
                            </div>
                            <Link href={route('leagues.show', featuredLeague.id)} className="text-2xl font-black leading-tight text-white">
                                {featuredLeague.name}
                            </Link>
                        </div>
                    </div>

                    {/* Card content */}
                    <div className="flex flex-col justify-center p-5 md:p-8">
                        {/* Desktop-only: title + badges */}
                        <div className="hidden md:block">
                            <div className="mb-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-primary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{featuredLeague.sport.name}</span>
                                <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-tertiary">{getLeagueFormat(featuredLeague)}</span>
                            </div>
                            <Link href={route('leagues.show', featuredLeague.id)} className="text-3xl font-black leading-tight tracking-normal text-on-surface lg:text-4xl">
                                {featuredLeague.name}
                            </Link>
                        </div>

                        <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-on-surface-variant">
                            {featuredLeague.description || getStatusCopy(featuredLeague.status)}
                        </p>

                        {/* Metrics block */}
                        <div className="mt-5 grid grid-cols-3 divide-x divide-surface-container rounded-xl bg-surface-container-low py-4">
                            <div className="px-3 text-center">
                                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-on-surface-variant">Entrants</p>
                                <p className="mt-1 text-2xl font-black text-on-surface md:text-3xl">{getLeagueEntrants(featuredLeague)}</p>
                            </div>
                            <div className="px-3 text-center">
                                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-on-surface-variant">Groups</p>
                                <p className="mt-1 text-2xl font-black text-on-surface md:text-3xl">{featuredLeague.group_count ?? featuredLeague.groups?.length ?? '-'}</p>
                            </div>
                            <div className="px-3 text-center">
                                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-on-surface-variant">Status</p>
                                <p className="mt-1 text-lg font-black text-on-surface">{toTitle(featuredLeague.status)}</p>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                href={route('leagues.show', featuredLeague.id)}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-transform active:scale-[0.98]"
                            >
                                Open Standings
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                            {canManage ? (
                                <Link href={route('admin.leagues.index')} className="rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container lg:hidden">
                                    Manage
                                </Link>
                            ) : null}
                        </div>
                    </div>
                </section>
            ) : null}

            {/* Section: Remaining league cards */}
            {remainingLeagues.length > 0 ? (
                <section className="mt-6">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-black tracking-tight text-on-surface md:text-xl">Other Leagues</h2>
                            <span className="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded-full bg-surface-container px-2 text-xs font-bold text-on-surface-variant">
                                {remainingLeagues.length}
                            </span>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {remainingLeagues.map((league) => (
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
                    <p className="mt-5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">No matching leagues</p>
                    <h2 className="mx-auto mt-2 max-w-md text-2xl font-black tracking-normal text-on-surface">No leagues found for this sport and status.</h2>
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
    const bannerUrl = getSportImage(league.sport.name);
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
    return 'League Play';
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
    return 'League';
}

function getDaysUntil(date: string) {
    const diff = new Date(date).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `in ${days}d` : days === 0 ? 'today' : 'started';
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function toTitle(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
