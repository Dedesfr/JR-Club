import DatePicker from '@/Components/DatePicker';
import SelectInput from '@/Components/SelectInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatJakartaTime, getJakartaDateKey } from '@/lib/datetime';
import { Activity, Sport } from '@/types/jrclub';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

type User = { id: number; name: string; email: string };

export default function Edit({ activity, sports, users }: { activity: Activity & { participants: User[] }; sports: Sport[]; users: User[] }) {
    const form = useForm({
        title: activity.title,
        description: activity.description ?? '',
        location: activity.location,
        scheduled_at: `${getJakartaDateKey(activity.scheduled_at)}T${formatJakartaTime(activity.scheduled_at)}`,
        max_participants: activity.max_participants?.toString() ?? '10',
        status: activity.status,
        sport_id: activity.sport.id,
    });
    const sportOptions = sports.map((sport) => ({ value: String(sport.id), label: sport.name }));

    const participantIds = new Set(activity.participants.map((p) => p.id));
    const available = users.filter((u) => !participantIds.has(u.id));

    const [selectedUserId, setSelectedUserId] = useState<number | ''>(available[0]?.id ?? '');
    const userOptions = available.map((u) => ({ value: String(u.id), label: `${u.name} — ${u.email}` }));

    function addParticipant() {
        if (!selectedUserId) return;
        router.post(route('admin.activities.participants.store', activity.id), { user_id: selectedUserId }, { preserveScroll: true });
    }

    function removeParticipant(userId: number) {
        router.delete(route('admin.activities.participants.destroy', [activity.id, userId]), { preserveScroll: true });
    }

    return (
        <AdminLayout title={`Edit ${activity.title}`}>
            <Head title={activity.title} />

            <form
                onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.activities.update', activity.id)); }}
                className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2"
            >
                <Field label="Title"><input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Sport"><SelectInput options={sportOptions} value={form.data.sport_id} onChange={(value) => form.setData('sport_id', Number(value || sports[0]?.id || 0))} placeholder="Select sport" /></Field>
                <Field label="Location"><input value={form.data.location} onChange={(e) => form.setData('location', e.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Scheduled at"><DatePicker enableTime value={form.data.scheduled_at} onChange={(value) => form.setData('scheduled_at', value)} /></Field>
                <Field label="Max participants"><input type="number" min={1} value={form.data.max_participants} onChange={(e) => form.setData('max_participants', e.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Status"><input value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Description" full><textarea value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} className="min-h-28 rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <div className="md:col-span-2 flex justify-end">
                    <button disabled={form.processing} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary disabled:opacity-50">
                        Save
                    </button>
                </div>
            </form>

            <div className="mt-6 rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-4">
                    <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary">
                        Participants ({activity.participants.length}/{activity.max_participants})
                    </h2>
                </div>

                {available.length > 0 && (
                    <div className="flex items-center gap-3 border-b border-outline-variant/10 px-6 py-4">
                        <div className="flex-1">
                            <SelectInput
                                options={userOptions}
                                value={selectedUserId || ''}
                                onChange={(value) => setSelectedUserId(value ? Number(value) : '')}
                                placeholder="Select user to add"
                            />
                        </div>
                        <button
                            onClick={addParticipant}
                            disabled={!selectedUserId}
                            className="rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-on-primary disabled:opacity-40"
                        >
                            Add
                        </button>
                    </div>
                )}

                {activity.participants.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-on-surface-variant">No participants yet.</p>
                ) : (
                    <ul className="divide-y divide-outline-variant/10">
                        {activity.participants.map((participant) => (
                            <li key={participant.id} className="flex items-center justify-between px-6 py-3">
                                <div>
                                    <p className="text-sm font-medium text-on-surface">{participant.name}</p>
                                    <p className="text-xs text-on-surface-variant">{participant.email}</p>
                                </div>
                                <button
                                    onClick={() => removeParticipant(participant.id)}
                                    className="rounded-full bg-error/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-error transition-colors hover:bg-error hover:text-white"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AdminLayout>
    );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
    return <label className={`grid gap-2 text-sm font-medium text-on-surface ${full ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>;
}
