import JRClubLayout from '@/Layouts/JRClubLayout';
import { Activity, Team } from '@/types/jrclub';
import { Head, Link, router } from '@inertiajs/react';

type Profile = {
    id: number;
    name: string;
    email?: string | null;
    role: string;
    activities: Activity[];
    teams: Team[];
    stats: { activities_joined: number; teams: number; matches_played: number; win_rate: number };
};

export default function Show({ profile, isPublic }: { profile: Profile; isPublic: boolean }) {
    const enablePush = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: undefined });
        router.post(route('push-subscription.store'), subscription.toJSON() as any, { preserveScroll: true });
    };

    const playedTotal = profile.stats.matches_played || profile.stats.activities_joined;

    return (
        <JRClubLayout active="Profile">
            <Head title={profile.name} />

            <section className="grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] lg:grid-cols-[minmax(0,1.35fr)_360px]">
                <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] sm:p-6 lg:p-8">
                    <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-10 rounded-full bg-primary-fixed opacity-70" />
                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-4 border-surface-container-lowest bg-primary-fixed text-4xl font-black text-on-primary-fixed shadow-[0px_12px_32px_rgba(15,23,42,0.06)] sm:h-28 sm:w-28">
                                {profile.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Member Profile</p>
                                <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-on-surface sm:text-4xl">{profile.name}</h1>
                                <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-on-surface-variant sm:text-base">
                                    {profile.role}{profile.email ? ` - ${profile.email}` : ''}
                                </p>
                            </div>
                        </div>
                        <div className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-container p-4 text-left text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] sm:w-44 sm:text-center">
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-primary/85">Win Rate</p>
                            <p className="mt-1 text-4xl font-black tracking-tight">{profile.stats.win_rate}%</p>
                        </div>
                    </div>
                </div>

                <aside className="rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] sm:p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Quick Controls</h2>
                        <span className="rounded-full bg-primary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{isPublic ? 'Public' : 'Private'}</span>
                    </div>
                    <div className="mt-4 space-y-2">
                        <Link href={route('teams.index')} className="flex items-center justify-between rounded-xl bg-primary p-4 text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-all hover:bg-primary-container hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <span className="flex items-center gap-3 font-bold"><span className="material-symbols-outlined fill">groups</span>My Teams</span>
                            <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                        </Link>
                        <button type="button" className="flex w-full items-center justify-between rounded-xl bg-surface-container-low p-4 text-left text-on-surface transition-colors hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <span className="flex items-center gap-3 font-bold"><span className="material-symbols-outlined fill text-primary">history</span>Match History</span>
                            <span className="material-symbols-outlined text-outline" aria-hidden="true">chevron_right</span>
                        </button>
                        {!isPublic ? (
                            <button onClick={enablePush} type="button" className="flex w-full items-center justify-between rounded-xl bg-surface-container-low p-4 text-left text-on-surface transition-colors hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                <span className="flex items-center gap-3 font-bold"><span className="material-symbols-outlined fill text-primary">notifications_active</span>Push Notifications</span>
                                <span className="rounded-full bg-surface-container-lowest px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">Enable</span>
                            </button>
                        ) : null}
                    </div>
                </aside>
            </section>

            <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-6">
                <Metric label="Played" value={playedTotal} variant="chart" />
                <Metric label="Teams" value={profile.stats.teams} />
                <Metric label="Events" value={profile.stats.activities_joined} variant="status" />
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Recent Participation</p>
                            <h2 className="mt-2 text-[1.5rem] font-bold tracking-tight text-on-surface">Activity History</h2>
                        </div>
                        <Link href={route('activities.index')} className="inline-flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            View all <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="mt-5 space-y-3">
                        {profile.activities.length ? profile.activities.map((activity) => (
                            <Link key={activity.id} href={route('activities.show', activity.id)} className="grid gap-3 rounded-xl bg-surface-container-low p-4 transition-colors hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:grid-cols-[1fr_auto] sm:items-center">
                                <div>
                                    <p className="font-bold text-on-surface">{activity.title}</p>
                                    <p className="mt-1 text-sm text-on-surface-variant">{activity.sport.name} - {formatDate(activity.scheduled_at)}</p>
                                </div>
                                <span className="w-fit rounded-full bg-surface-container-lowest px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{activity.status}</span>
                            </Link>
                        )) : (
                            <div className="rounded-xl bg-surface-container-low p-5 text-sm font-medium text-on-surface-variant">
                                No activity history yet. Join an event to start building your profile.
                            </div>
                        )}
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Team Context</p>
                        <h2 className="mt-2 text-xl font-black tracking-tight text-on-surface">Active squads</h2>
                        <div className="mt-4 space-y-2">
                            {profile.teams.length ? profile.teams.map((team) => (
                                <div key={team.id} className="rounded-xl bg-surface-container-low p-4">
                                    <p className="font-bold text-on-surface">{team.name}</p>
                                    <p className="mt-1 text-sm text-on-surface-variant">{team.sport.name}{typeof team.members_count === 'number' ? ` - ${team.members_count} members` : ''}</p>
                                </div>
                            )) : (
                                <div className="rounded-xl bg-surface-container-low p-4 text-sm font-medium text-on-surface-variant">No active teams yet.</div>
                            )}
                        </div>
                    </div>
                    {!isPublic ? (
                        <Link href={route('logout')} method="post" as="button" className="flex w-full items-center justify-between rounded-xl bg-surface-container-lowest p-4 text-left font-bold text-error shadow-[0px_12px_32px_rgba(15,23,42,0.04)] transition-colors hover:bg-error-container focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2">
                            <span className="flex items-center gap-3"><span className="material-symbols-outlined fill">logout</span>Log Out</span>
                            <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                        </Link>
                    ) : null}
                </aside>
            </section>
        </JRClubLayout>
    );
}

function Metric({ label, value, variant = 'avatars' }: { label: string; value: number; variant?: 'avatars' | 'chart' | 'status' }) {
    return (
        <article className="rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-4xl font-black tracking-tighter text-on-surface">{value}</p>
                {variant === 'chart' ? (
                    <div className="flex h-12 items-end gap-1" aria-hidden="true">
                        <span className="h-5 w-3 rounded-t bg-primary-fixed" />
                        <span className="h-8 w-3 rounded-t bg-primary-fixed-dim" />
                        <span className="h-12 w-3 rounded-t bg-primary" />
                    </div>
                ) : null}
                {variant === 'avatars' ? (
                    <div className="flex -space-x-2" aria-hidden="true">
                        <span className="h-9 w-9 rounded-full border-2 border-surface-container-lowest bg-primary-fixed" />
                        <span className="h-9 w-9 rounded-full border-2 border-surface-container-lowest bg-secondary-fixed" />
                        <span className="h-9 w-9 rounded-full border-2 border-surface-container-lowest bg-tertiary-fixed" />
                    </div>
                ) : null}
                {variant === 'status' ? <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-tertiary">Active</span> : null}
            </div>
        </article>
    );
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
