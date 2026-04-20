import JRClubLayout from '@/Layouts/JRClubLayout';
import { Activity, Sport } from '@/types/jrclub';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ sports, activities, selectedSport, canManage }: { sports: Sport[]; activities: Activity[]; selectedSport?: string; canManage: boolean }) {
    const form = useForm({ sport_id: sports[0]?.id ?? '', title: '', description: '', location: '', scheduled_at: '', max_participants: 8 });
    const user = usePage<PageProps>().props.auth.user;

    const join = (activity: Activity) => router.post(route('activities.join', activity.id), {}, { preserveScroll: true });
    const leave = (activity: Activity) => router.delete(route('activities.leave', activity.id), { preserveScroll: true });

    return (
        <JRClubLayout active="Activities">
            <Head title="Activities" />
            <section className="px-2 pb-6 pt-6">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="mb-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                        <h1 className="text-3xl font-black leading-[1.1] tracking-[-0.04em] text-on-surface">
                            Ready to play,<br />{user.name.split(' ')[0]}?
                        </h1>
                    </div>
                    {canManage ? (
                        <button
                            type="button"
                            onClick={() => document.getElementById('create-activity-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex scale-95 items-center gap-1 rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-white shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            Create
                        </button>
                    ) : null}
                </div>
            </section>

            <section className="-mx-4 overflow-x-auto px-6 pb-8">
                <div className="flex w-max gap-3">
                <Link href={route('activities.index')} className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold tracking-tight shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] ${!selectedSport ? 'bg-gradient-to-br from-primary to-primary-container text-white' : 'bg-surface-container-lowest text-on-surface-variant'}`}>
                    All Sports
                </Link>
                {sports.map((sport) => (
                    <Link
                        key={sport.id}
                        href={route('activities.index', { sport: sport.name })}
                        className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold tracking-tight shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] ${selectedSport === sport.name ? 'bg-gradient-to-br from-primary to-primary-container text-white' : 'bg-surface-container-lowest text-on-surface-variant'}`}
                    >
                        {sport.name}
                    </Link>
                ))}
                </div>
            </section>

            {canManage ? (
                <form
                    id="create-activity-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(route('activities.store'), { preserveScroll: true, onSuccess: () => form.reset('title', 'description', 'location', 'scheduled_at') });
                    }}
                    className="mb-6 grid gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]"
                >
                    <input className="rounded-md border-0 bg-surface-container-low" placeholder="Activity title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                    <input className="rounded-md border-0 bg-surface-container-low" placeholder="Location" value={form.data.location} onChange={(e) => form.setData('location', e.target.value)} />
                    <select className="rounded-md border-0 bg-surface-container-low" value={form.data.sport_id} onChange={(e) => form.setData('sport_id', Number(e.target.value))}>
                        {sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                    </select>
                    <input className="rounded-md border-0 bg-surface-container-low" type="datetime-local" value={form.data.scheduled_at} onChange={(e) => form.setData('scheduled_at', e.target.value)} />
                    <input className="rounded-md border-0 bg-surface-container-low" type="number" min="2" value={form.data.max_participants} onChange={(e) => form.setData('max_participants', Number(e.target.value))} />
                    <button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-2 font-bold text-on-primary">Create Activity</button>
                </form>
            ) : null}

            <main className="flex flex-col gap-6">
                {activities.map((activity) => {
                    const participants = activity.participants_count ?? activity.participants?.length ?? 0;
                    const spotsLeft = Math.max(0, activity.max_participants - participants);
                    const isFull = activity.status === 'full' || spotsLeft === 0;

                    return (
                        <article key={activity.id} className="flex flex-col rounded-xl bg-surface-container-lowest p-5 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                            <div className="mb-3 flex items-start justify-between">
                                <Link href={route('activities.show', activity.id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary">
                                    <span className="material-symbols-outlined fill">{activity.sport.icon}</span>
                                </Link>
                                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">
                                    {new Date(activity.scheduled_at).toLocaleDateString(undefined, { weekday: 'short' })}, {new Date(activity.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <Link href={route('activities.show', activity.id)} className="mb-4 block text-2xl font-black tracking-[-0.04em] text-on-surface">
                                {activity.title}
                            </Link>
                            <div className="mb-5 flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
                                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">location_on</span>
                                <span className="text-sm font-bold tracking-tight text-on-surface">{activity.location}</span>
                            </div>
                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {(activity.participants ?? []).slice(0, 3).map((person) => (
                                        <div key={person.id} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-primary-fixed text-xs font-bold text-on-primary-fixed">
                                            {person.name.charAt(0)}
                                        </div>
                                    ))}
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-surface-container-high text-[10px] font-bold text-on-surface-variant">+{Math.max(0, participants - 3)}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => leave(activity)} className="rounded-lg bg-surface-container-high px-4 py-2 text-sm font-bold tracking-tight text-on-surface">Leave</button>
                                    <button disabled={isFull} onClick={() => join(activity)} className={isFull ? 'rounded-lg bg-surface-container-high px-5 py-2 text-sm font-bold tracking-tight text-on-surface opacity-70' : 'rounded-lg bg-gradient-to-br from-primary to-primary-container px-5 py-2 text-sm font-bold tracking-tight text-white shadow-sm'}>
                                        {isFull ? 'Full' : 'Join'}
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </main>
        </JRClubLayout>
    );
}
