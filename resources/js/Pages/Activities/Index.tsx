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

    const join = (activity: Activity) => router.post(route('activities.join', activity.id), {}, { preserveScroll: true });

    return (
        <JRClubLayout active="Activities">
            <Head title="Activities" />

            <section className="-mx-4 -mt-4 bg-surface-container-lowest px-4 pb-0 pt-4 shadow-[0px_12px_32px_rgba(15,23,42,0.06)] md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
                <div className="flex flex-col gap-5">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Upcoming Fixtures · Week {getWeekNumber(new Date())}</p>
                            <h1 className="mt-1 text-4xl font-black leading-none tracking-normal text-on-surface md:text-5xl">Events</h1>
                        </div>
                        <div className="hidden items-center gap-2 rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant md:flex">
                            <span className="material-symbols-outlined text-[16px]">search</span>
                            <span>Search events...</span>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                        <FilterLink label="All" active={!selectedSport} href={route('activities.index')} />
                        {sports.map((sport) => (
                            <FilterLink key={sport.id} label={sport.name} active={selectedSport === sport.name} href={route('activities.index', { sport: sport.name })} />
                        ))}
                        <FilterLink label="Finished" active={false} href={route('activities.index')} />
                    </div>
                </div>
            </section>

            {featured ? (
                <section className="mt-6 overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid md:grid-cols-[20rem_minmax(0,1fr)]">
                    <Link href={route('activities.show', featured.id)} className="relative block min-h-56 overflow-hidden md:min-h-72">
                        <img src={getSportImage(featured.sport.name)} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface/20 via-transparent to-surface-container-lowest md:to-surface-container-lowest" />
                        <StatusPill activity={featured} className="absolute left-4 top-4" />
                    </Link>

                    <div className="p-5 md:p-8">
                        <div className="mb-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-primary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">Monthly League</span>
                            <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-tertiary">{featured.location.split(' ')[0]}</span>
                        </div>
                        <Link href={route('activities.show', featured.id)} className="text-3xl font-black tracking-normal text-on-surface md:text-4xl">
                            {featured.title}
                        </Link>
                        <p className="mt-2 text-sm font-medium text-on-surface-variant">
                            {featured.location} · {formatDateTime(featured.scheduled_at)}
                        </p>

                        <div className="my-7 grid grid-cols-3 gap-4 bg-surface-container-lowest py-4">
                            <FeaturedMetric label="Entrants" value={`${getParticipants(featured)}/${featured.max_participants}`} />
                            <FeaturedMetric label="Fill Rate" value={`${getFillPercent(featured)}%`} />
                            <FeaturedMetric label="Status" value={isParticipating(featured, user.id) ? 'Registered' : getStatusText(featured)} />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link href={route('activities.show', featured.id)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-transform active:scale-[0.98]">
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

            <section className="mt-5 grid gap-4 lg:grid-cols-2">
                {remaining.map((activity) => (
                    <CompactEventCard key={activity.id} activity={activity} userId={user.id} onJoin={() => join(activity)} />
                ))}
            </section>

            {canManage ? (
                <Link href={route('admin.activities.index')} className="fixed bottom-24 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_12px_24px_rgba(0,86,164,0.25)] md:bottom-8">
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

    return (
        <article className="grid grid-cols-[4.25rem_minmax(0,1fr)_auto] items-center gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] transition-transform active:scale-[0.98]">
            <Link href={route('activities.show', activity.id)} className="h-14 w-14 overflow-hidden rounded-lg bg-surface-container">
                <img src={getSportImage(activity.sport.name)} alt="" className="h-full w-full object-cover" />
            </Link>
            <div className="min-w-0">
                <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="truncate text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{activity.sport.name}</p>
                    <StatusPill activity={activity} />
                </div>
                <Link href={route('activities.show', activity.id)} className="block truncate text-base font-black tracking-normal text-on-surface">
                    {activity.title}
                </Link>
                <p className="mt-1 truncate text-xs font-medium text-on-surface-variant">
                    {activity.location} · {formatShortDate(activity.scheduled_at)}
                </p>
                <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container">
                        <div className="h-full rounded-full bg-gradient-to-br from-primary to-primary-container" style={{ width: `${getFillPercent(activity)}%` }} />
                    </div>
                    <p className="w-14 text-right text-[0.6875rem] font-black text-on-surface">{participants}/{activity.max_participants}</p>
                </div>
            </div>
            <button
                type="button"
                disabled={isFull || joined}
                onClick={onJoin}
                className={`hidden rounded-full px-4 py-2 text-xs font-bold md:block ${joined ? 'bg-primary-fixed text-primary' : isFull ? 'bg-surface-container-high text-on-surface-variant' : 'bg-surface-container-low text-on-surface hover:bg-primary hover:text-on-primary'}`}
            >
                {joined ? 'Joined' : isFull ? 'Full' : 'Join'}
            </button>
        </article>
    );
}

function FilterLink({ label, active, href }: { label: string; active: boolean; href: string }) {
    return (
        <Link href={href} className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition-colors ${active ? 'bg-surface text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}>
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
