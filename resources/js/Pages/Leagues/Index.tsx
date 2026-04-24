import JRClubLayout from '@/Layouts/JRClubLayout';
import { League, Sport, Team } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const statusLabels = ['upcoming', 'active', 'completed'] as const;

const sportImages: Record<string, string> = {
    badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80',
    futsal: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    soccer: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
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

            <section className="-mx-4 -mt-4 bg-surface-container-lowest px-4 pb-0 pt-4 shadow-[0px_12px_32px_rgba(15,23,42,0.06)] md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
                <div className="flex flex-col gap-5">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Competition Board · Season Live</p>
                            <h1 className="mt-1 text-4xl font-black leading-none tracking-normal text-on-surface md:text-5xl">Leagues</h1>
                        </div>
                        <div className="hidden items-center gap-2 rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant md:flex">
                            <span className="material-symbols-outlined text-[16px]">search</span>
                            <span>Search leagues...</span>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                        {statusLabels.map((status) => (
                            <FilterLink
                                key={status}
                                label={toTitle(status)}
                                active={status === statusFilter}
                                href={route('leagues.index', { status })}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="mt-5 flex gap-2 overflow-x-auto">
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

            {featuredLeague ? (
                <section className="mt-5 overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid md:grid-cols-[20rem_minmax(0,1fr)]">
                    <Link href={route('leagues.show', featuredLeague.id)} className="relative block min-h-56 overflow-hidden md:min-h-72">
                        <img src={getSportImage(featuredLeague.sport.name)} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface/20 via-transparent to-surface-container-lowest md:to-surface-container-lowest" />
                        <StatusPill status={featuredLeague.status} className="absolute left-4 top-4" />
                    </Link>

                    <div className="p-5 md:p-8">
                        <div className="mb-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-primary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{featuredLeague.sport.name}</span>
                            <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-tertiary">{getLeagueFormat(featuredLeague)}</span>
                        </div>
                        <Link href={route('leagues.show', featuredLeague.id)} className="text-3xl font-black tracking-normal text-on-surface md:text-4xl">
                            {featuredLeague.name}
                        </Link>
                        <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-on-surface-variant">
                            {featuredLeague.description || getStatusCopy(featuredLeague.status)}
                        </p>

                        <div className="my-7 grid grid-cols-3 gap-4 bg-surface-container-lowest py-4">
                            <FeaturedMetric label="Entrants" value={String(getLeagueEntrants(featuredLeague))} />
                            <FeaturedMetric label="Groups" value={String(featuredLeague.group_count ?? featuredLeague.groups?.length ?? '-')} />
                            <FeaturedMetric label="Status" value={toTitle(featuredLeague.status)} />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link href={route('leagues.show', featuredLeague.id)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-transform active:scale-[0.98]">
                                Open Standings
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                            {canManage ? (
                                <Link href={route('admin.leagues.index')} className="rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container">
                                    Manage Leagues
                                </Link>
                            ) : null}
                        </div>
                    </div>
                </section>
            ) : null}

            <section className="mt-5 grid gap-4 lg:grid-cols-2">
                {remainingLeagues.map((league) => (
                    <CompactLeagueCard key={league.id} league={league} />
                ))}
            </section>

            {visibleLeagues.length === 0 ? (
                <section className="mt-5 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">No matching leagues</p>
                    <h2 className="mt-2 text-2xl font-black tracking-normal text-on-surface">No leagues found for this sport and status.</h2>
                </section>
            ) : null}

            <section className="mt-5 grid grid-cols-3 gap-3">
                <SummaryMetric label="Active" value={activeCount} />
                <SummaryMetric label="Sports" value={sports.length} />
                <SummaryMetric label="Teams" value={totalTeamCount} />
            </section>
        </JRClubLayout>
    );
}

function CompactLeagueCard({ league }: { league: League }) {
    const entrants = getLeagueEntrants(league);

    return (
        <Link href={route('leagues.show', league.id)} className="grid grid-cols-[4.25rem_minmax(0,1fr)_auto] items-center gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] transition-transform active:scale-[0.98]">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-primary-fixed text-primary">
                <span className="material-symbols-outlined fill text-[28px]">{league.sport.icon}</span>
            </div>
            <div className="min-w-0">
                <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="truncate text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{league.sport.name} · {getLeagueFormat(league)}</p>
                    <StatusPill status={league.status} />
                </div>
                <p className="truncate text-base font-black tracking-normal text-on-surface">{league.name}</p>
                <p className="mt-1 truncate text-xs font-medium text-on-surface-variant">
                    Starts {formatDate(league.start_date)} · {entrants} entrants
                </p>
                <div className="mt-3 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {(league.teams ?? []).slice(0, 3).map((team) => (
                            <div key={team.id} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-primary-fixed text-[0.625rem] font-bold text-on-primary-fixed">
                                {getInitials(team.name)}
                            </div>
                        ))}
                    </div>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container">
                        <div className="h-full rounded-full bg-gradient-to-br from-primary to-primary-container" style={{ width: `${Math.min(100, entrants * 8)}%` }} />
                    </div>
                    <p className="w-10 text-right text-[0.6875rem] font-black text-on-surface">{entrants}</p>
                </div>
            </div>
            <span className="material-symbols-outlined hidden text-primary md:block">arrow_forward</span>
        </Link>
    );
}

function FilterLink({ label, active, href }: { label: string; active: boolean; href: string }) {
    return (
        <Link href={href} preserveScroll className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition-colors ${active ? 'bg-surface text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}>
            {label}
        </Link>
    );
}

function FeaturedMetric({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</p>
            <p className="mt-1 text-xl font-black tracking-normal text-on-surface">{value}</p>
        </div>
    );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</p>
            <p className="mt-1 text-2xl font-black tracking-normal text-primary">{value}</p>
        </div>
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

function getInitials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function getSportImage(name: string) {
    return sportImages[name.toLowerCase()] ?? sportImages.badminton;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function toTitle(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
