import JRClubLayout from '@/Layouts/JRClubLayout';
import { PageProps } from '@/types';
import { Activity, Sport } from '@/types/jrclub';
import { Head, Link, router, usePage } from '@inertiajs/react';

const sportImages: Record<string, string> = {
    badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80',
    futsal: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    soccer: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
    tennis: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80',
    running: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=900&q=80',
};

export default function Index({ sports, activities, selectedSport, canManage }: { sports: Sport[]; activities: Activity[]; selectedSport?: string; canManage: boolean }) {
    const user = usePage<PageProps>().props.auth.user;
    const featured = activities[0];
    const remaining = activities.slice(1);
    const openCount = activities.filter((a) => a.status !== 'completed' && a.status !== 'cancelled' && a.status !== 'full').length;

    const join = (activity: Activity) => router.post(route('activities.join', activity.id), {}, { preserveScroll: true });

    return (
        <JRClubLayout active="Activities">
            <Head title="Activities" />

            {/* Section: Dark Athletic Header Band */}
            <section className="-mt-4 bg-inverse-surface" style={{ marginLeft: 'calc(50% - 50vw)', width: '100vw' }}>
                <div className="mx-auto max-w-md px-4 pt-5 pb-0 md:max-w-7xl md:px-6 lg:px-8">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Upcoming Fixtures · Week {getWeekNumber(new Date())}</p>
                            <h1 className="mt-1 text-4xl font-black leading-none text-inverse-on-surface md:text-5xl">Events</h1>
                        </div>
                        <div className="hidden items-center gap-2 self-center rounded-xl bg-white/10 px-4 py-2.5 text-sm text-inverse-on-surface/60 md:flex">
                            <span className="material-symbols-outlined text-[16px]">search</span>
                            <span>Search events...</span>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="mt-4 flex items-center gap-6 border-t border-white/10 pt-4 md:gap-10">
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Events</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{activities.length}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Open</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{openCount}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Sports</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{sports.length}</p>
                        </div>
                        {canManage ? (
                            <>
                                <div className="flex-1" />
                                <Link
                                    href={route('admin.activities.index')}
                                    className="hidden rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-inverse-on-surface/70 transition-colors hover:border-white/40 hover:text-inverse-on-surface lg:block"
                                >
                                    Manage Events
                                </Link>
                            </>
                        ) : null}
                    </div>

                    {/* Status tabs — flush to bottom */}
                    <div className="mt-4 flex overflow-x-auto">
                        <Link
                            href={route('activities.index')}
                            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition-colors md:px-6 ${!selectedSport ? 'border-inverse-on-surface text-inverse-on-surface' : 'border-transparent text-inverse-on-surface/40 hover:text-inverse-on-surface/70'}`}
                        >
                            All
                        </Link>
                        <Link
                            href={route('activities.index')}
                            className="whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm font-bold text-inverse-on-surface/40 transition-colors hover:text-inverse-on-surface/70 md:px-6"
                        >
                            Finished
                        </Link>
                    </div>
                </div>
            </section>

            {/* Section: Sport Filter Pills */}
            <section className="mt-5 flex gap-2 overflow-x-auto pb-1">
                <Link
                    href={route('activities.index')}
                    className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all active:scale-[0.98] ${!selectedSport ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]' : 'bg-surface-container-lowest text-on-surface-variant shadow-[0px_4px_12px_rgba(15,23,42,0.03)] hover:bg-surface-container-high'}`}
                >
                    All Sports
                </Link>
                {sports.map((sport) => (
                    <Link
                        key={sport.id}
                        href={route('activities.index', { sport: sport.name })}
                        className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all active:scale-[0.98] ${selectedSport === sport.name ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]' : 'bg-surface-container-lowest text-on-surface-variant shadow-[0px_4px_12px_rgba(15,23,42,0.03)] hover:bg-surface-container-high'}`}
                    >
                        {sport.name}
                    </Link>
                ))}
            </section>

            {/* Section: Featured Event Card */}
            {featured ? (
                <section className="mt-5 overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.06)] md:grid md:grid-cols-[2fr_3fr]">
                    {/* Cover image */}
                    <div className="relative h-52 md:h-auto md:min-h-72">
                        <img src={getSportImage(featured.sport.name)} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/70 via-inverse-surface/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-surface-container-lowest" />
                        {/* Status pill */}
                        <StatusPill activity={featured} className="absolute left-4 top-4" />
                        {/* Mobile-only: title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
                            <div className="mb-2 flex flex-wrap gap-1.5">
                                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm">Monthly League</span>
                                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm">{featured.location.split(' ')[0]}</span>
                            </div>
                            <Link href={route('activities.show', featured.id)} className="text-2xl font-black leading-tight text-white">
                                {featured.title}
                            </Link>
                        </div>
                    </div>

                    {/* Card content */}
                    <div className="flex flex-col justify-center p-5 md:p-8">
                        {/* Desktop-only: title + badges */}
                        <div className="hidden md:block">
                            <div className="mb-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-primary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">Monthly League</span>
                                <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-tertiary">{featured.location.split(' ')[0]}</span>
                            </div>
                            <Link href={route('activities.show', featured.id)} className="text-3xl font-black leading-tight tracking-normal text-on-surface lg:text-4xl">
                                {featured.title}
                            </Link>
                        </div>

                        <p className="mt-3 text-sm font-medium text-on-surface-variant">
                            {featured.location} · {formatDateTime(featured.scheduled_at)}
                        </p>

                        {/* Metrics block */}
                        <div className="mt-5 grid grid-cols-3 divide-x divide-surface-container rounded-xl bg-surface-container-low py-4">
                            <div className="px-3 text-center">
                                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-on-surface-variant">Entrants</p>
                                <p className="mt-1 text-2xl font-black text-on-surface md:text-3xl">{getParticipants(featured)}/{featured.max_participants}</p>
                            </div>
                            <div className="px-3 text-center">
                                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-on-surface-variant">Fill Rate</p>
                                <p className="mt-1 text-2xl font-black text-on-surface md:text-3xl">{getFillPercent(featured)}%</p>
                            </div>
                            <div className="px-3 text-center">
                                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-on-surface-variant">Status</p>
                                <p className="mt-1 text-lg font-black text-on-surface">{isParticipating(featured, user.id) ? 'Joined' : getStatusText(featured)}</p>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                href={route('activities.show', featured.id)}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-transform active:scale-[0.98]"
                            >
                                View Briefing
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                            <button type="button" className="rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container">
                                Venue Map
                            </button>
                        </div>
                    </div>
                </section>
            ) : null}

            {/* Section: Remaining event cards */}
            {remaining.length > 0 ? (
                <section className="mt-6">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-black tracking-tight text-on-surface md:text-xl">More Events</h2>
                            <span className="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded-full bg-surface-container px-2 text-xs font-bold text-on-surface-variant">
                                {remaining.length}
                            </span>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {remaining.map((activity) => (
                            <CompactEventCard key={activity.id} activity={activity} userId={user.id} onJoin={() => join(activity)} />
                        ))}
                    </div>
                </section>
            ) : null}

            {canManage ? (
                <Link href={route('admin.activities.index')} className="fixed bottom-24 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_12px_24px_rgba(0,86,164,0.25)] md:bottom-8 lg:hidden">
                    <span className="material-symbols-outlined">admin_panel_settings</span>
                </Link>
            ) : null}
        </JRClubLayout>
    );
}

function CompactEventCard({ activity, userId, onJoin }: { activity: Activity; userId: number; onJoin: () => void }) {
    const participants = getParticipants(activity);
    const isFull = activity.status === 'full' || participants >= activity.max_participants;
    const joined = isParticipating(activity, userId);
    const isDone = activity.status === 'completed' || activity.status === 'cancelled';
    const isOpen = !isDone && !isFull;
    const fillPct = getFillPercent(activity);

    return (
        <article className={`group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_4px_16px_rgba(15,23,42,0.04)] transition-all active:scale-[0.98] hover:shadow-[0px_12px_32px_rgba(15,23,42,0.08)] ${isDone ? 'opacity-75' : ''}`}>
            {/* Banner */}
            <Link href={route('activities.show', activity.id)} className="relative block aspect-[16/6] overflow-hidden">
                <img
                    src={getSportImage(activity.sport.name)}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/40 via-inverse-surface/10 to-transparent" />

                {/* Status pill — top right */}
                <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-wider backdrop-blur-sm ${
                        isOpen ? 'bg-inverse-surface/80 text-inverse-on-surface' : 'bg-white/90 text-on-surface'
                    }`}
                >
                    {joined ? 'Joined' : getStatusText(activity)}
                </span>

                {/* Sport / location chip — bottom left */}
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-on-surface backdrop-blur-sm">
                    {activity.sport.name} · {activity.location.split(',')[0]}
                </span>
            </Link>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <Link href={route('activities.show', activity.id)} className="line-clamp-2 text-[1rem] font-black leading-snug text-on-surface">
                    {activity.title}
                </Link>

                {/* Metric row */}
                <div className="grid grid-cols-3 divide-x divide-surface-container rounded-lg bg-surface-container-low py-2">
                    <div className="px-2 text-center">
                        <p className="text-[0.55rem] font-bold uppercase tracking-wider text-on-surface-variant">Joined</p>
                        <p className="text-sm font-black text-on-surface">{participants}/{activity.max_participants}</p>
                    </div>
                    <div className="px-2 text-center">
                        <p className="text-[0.55rem] font-bold uppercase tracking-wider text-on-surface-variant">Fill</p>
                        <p className="text-sm font-black text-on-surface">{fillPct}%</p>
                    </div>
                    <div className="px-2 text-center">
                        <p className="text-[0.55rem] font-bold uppercase tracking-wider text-on-surface-variant">Date</p>
                        <p className="text-sm font-black text-on-surface">{formatShortDate(activity.scheduled_at)}</p>
                    </div>
                </div>

                {/* Footer: fill bar + join button */}
                <div className="mt-auto flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container">
                        <div
                            className={`h-full rounded-full transition-all ${
                                isFull ? 'bg-on-surface-variant' : 'bg-gradient-to-br from-primary to-primary-container'
                            }`}
                            style={{ width: `${fillPct}%` }}
                        />
                    </div>
                    <button
                        type="button"
                        disabled={isFull || joined || isDone}
                        onClick={onJoin}
                        className={`flex-none rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                            joined
                                ? 'bg-primary-fixed text-primary'
                                : isFull || isDone
                                  ? 'bg-surface-container-high text-on-surface-variant'
                                  : 'bg-surface-container-low text-on-surface hover:bg-primary hover:text-on-primary'
                        }`}
                    >
                        {joined ? 'Joined' : isFull ? 'Full' : isDone ? 'Done' : 'Join'}
                    </button>
                </div>
            </div>
        </article>
    );
}

function StatusPill({ activity, className = '' }: { activity: Activity; className?: string }) {
    const text = getStatusText(activity);
    const done = activity.status === 'completed' || activity.status === 'cancelled';

    return (
        <span className={`rounded-full px-3 py-1 text-[0.625rem] font-black uppercase tracking-[0.05em] ${done ? 'bg-tertiary-fixed text-tertiary' : 'bg-primary-fixed text-primary'} ${className}`}>
            {text}
        </span>
    );
}

function getParticipants(activity: Activity) {
    return activity.participants_count ?? activity.participants?.length ?? 0;
}

function getFillPercent(activity: Activity) {
    return activity.max_participants > 0 ? Math.min(100, Math.round((getParticipants(activity) / activity.max_participants) * 100)) : 0;
}

function isParticipating(activity: Activity, userId: number) {
    return (activity.participants ?? []).some((person) => person.id === userId);
}

function getStatusText(activity: Activity) {
    if (activity.status === 'completed') return 'Done';
    if (activity.status === 'cancelled') return 'Cancelled';
    if (activity.status === 'full' || getParticipants(activity) >= activity.max_participants) return 'Full';
    return 'Open';
}

function getSportImage(name: string) {
    return sportImages[name.toLowerCase()] ?? sportImages.badminton;
}

function formatDateTime(value: string) {
    const date = new Date(value);
    return `${date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function formatShortDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getWeekNumber(date: Date) {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const dayOffset = (date.getTime() - firstDay.getTime()) / 86400000;
    return Math.ceil((dayOffset + firstDay.getDay() + 1) / 7);
}
