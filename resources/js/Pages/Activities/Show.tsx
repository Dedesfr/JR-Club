import JRClubLayout from '@/Layouts/JRClubLayout';
import { Activity } from '@/types/jrclub';
import { Head, router } from '@inertiajs/react';

export default function Show({ activity }: { activity: Activity }) {
    return (
        <JRClubLayout active="Activities">
            <Head title={activity.title} />
            <article className="rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
                        <span className="material-symbols-outlined text-3xl">{activity.sport.icon}</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.05em] text-primary">{activity.sport.name}</p>
                        <h1 className="text-2xl font-black tracking-tight">{activity.title}</h1>
                    </div>
                </div>
                <p className="mb-4 text-on-surface-variant">{activity.description}</p>
                <div className="mb-6 rounded-md bg-surface-container-low p-4 text-sm">
                    <p className="font-bold">{activity.location}</p>
                    <p>{new Date(activity.scheduled_at).toLocaleString()}</p>
                </div>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Participants</h2>
                <div className="space-y-2">
                    {(activity.participants ?? []).map((person) => (
                        <div key={person.id} className="flex items-center justify-between rounded-lg bg-surface-container-low p-3">
                            <span className="font-semibold">{person.name}</span>
                            <span className="text-sm text-on-surface-variant">{person.email}</span>
                        </div>
                    ))}
                </div>
                <button onClick={() => router.post(route('activities.join', activity.id))} className="mt-6 rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-3 font-bold text-on-primary">Join Session</button>
            </article>
        </JRClubLayout>
    );
}
