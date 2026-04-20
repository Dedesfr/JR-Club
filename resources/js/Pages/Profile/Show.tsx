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

    return (
        <JRClubLayout active="Profile">
            <Head title={profile.name} />
            <section className="mt-8 flex flex-col items-center space-y-4 text-center">
                <div className="relative">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-surface-container-lowest bg-primary-fixed text-5xl font-black text-on-primary-fixed shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                        {profile.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-br from-primary to-primary-container px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-primary shadow-md">
                        {profile.stats.win_rate}% Win Rate
                    </div>
                </div>
                <div className="pt-2">
                    <h1 className="text-3xl font-black tracking-[-0.04em] text-on-surface">{profile.name}</h1>
                    <p className="mt-1 text-sm font-bold uppercase tracking-wider text-primary">{profile.role}{profile.email ? ` - ${profile.email}` : ''}</p>
                </div>
            </section>

            <section className="my-8 grid grid-cols-3 gap-3">
                <Metric label="Played" value={profile.stats.matches_played || profile.stats.activities_joined} />
                <Metric label="Teams" value={profile.stats.teams} />
                <Metric label="Events" value={profile.stats.activities_joined} />
            </section>

            <section className="mb-8 flex flex-col gap-1 overflow-hidden rounded-xl bg-surface-container-lowest pb-1 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                <Link href={route('teams.index')} className="flex w-full items-center justify-between bg-surface-container-lowest p-5 text-left transition-colors hover:bg-surface-container-low">
                    <div className="flex items-center gap-4"><span className="material-symbols-outlined fill text-primary">groups</span><span className="font-bold tracking-tight text-on-surface">My Teams</span></div>
                    <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                </Link>
                <button className="flex w-full items-center justify-between bg-surface-container-lowest p-5 text-left transition-colors hover:bg-surface-container-low">
                    <div className="flex items-center gap-4"><span className="material-symbols-outlined fill text-primary">history</span><span className="font-bold tracking-tight text-on-surface">Match History</span></div>
                    <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                </button>
                {!isPublic ? (
                    <button onClick={enablePush} className="flex w-full items-center justify-between bg-surface-container-lowest p-5 text-left">
                        <div className="flex items-center gap-4"><span className="material-symbols-outlined fill text-primary">notifications_active</span><span className="font-bold tracking-tight text-on-surface">Push Notifications</span></div>
                        <span className="rounded-full bg-primary px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-primary">Enable</span>
                    </button>
                ) : null}
                {!isPublic ? (
                    <Link href={route('logout')} method="post" as="button" className="flex w-full items-center gap-4 bg-surface-container-lowest p-5 text-left transition-colors hover:bg-error-container">
                        <span className="material-symbols-outlined fill text-error">logout</span>
                        <span className="font-bold tracking-tight text-error">Log Out</span>
                    </Link>
                ) : null}
            </section>

            <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Activity History</h2>
                {profile.activities.map((activity) => (
                    <Link key={activity.id} href={route('activities.show', activity.id)} className="block rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                        <p className="font-bold">{activity.title}</p>
                        <p className="text-sm text-on-surface-variant">{activity.sport.name} - {new Date(activity.scheduled_at).toLocaleDateString()}</p>
                    </Link>
                ))}
            </section>
        </JRClubLayout>
    );
}

function Metric({ label, value }: { label: string; value: number }) {
    return <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-low p-4 text-center shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]"><span className="mb-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</span><span className="text-3xl font-black tracking-tighter text-on-surface">{value}</span></div>;
}
