import DatePicker from '@/Components/DatePicker';
import SelectInput from '@/Components/SelectInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Activity, Sport } from '@/types/jrclub';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ activity, sports }: { activity: Activity; sports: Sport[] }) {
    const form = useForm({
        title: activity.title,
        description: activity.description ?? '',
        location: activity.location,
        scheduled_at: activity.scheduled_at.slice(0, 16),
        max_participants: activity.max_participants?.toString() ?? '10',
        status: activity.status,
        sport_id: activity.sport.id,
    });
    const sportOptions = sports.map((sport) => ({ value: String(sport.id), label: sport.name }));

    return (
        <AdminLayout title={`Edit ${activity.title}`}>
            <Head title={activity.title} />
            <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.activities.update', activity.id)); }} className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2">
                <Field label="Title"><input value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Sport"><SelectInput options={sportOptions} value={form.data.sport_id} onChange={(value) => form.setData('sport_id', Number(value || sports[0]?.id || 0))} placeholder="Select sport" /></Field>
                <Field label="Location"><input value={form.data.location} onChange={(event) => form.setData('location', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Scheduled at"><DatePicker enableTime value={form.data.scheduled_at} onChange={(value) => form.setData('scheduled_at', value)} /></Field>
                <Field label="Max participants"><input type="number" min={1} value={form.data.max_participants} onChange={(event) => form.setData('max_participants', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Status"><input value={form.data.status} onChange={(event) => form.setData('status', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Description" full><textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="min-h-28 rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Save</button></div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
    return <label className={`grid gap-2 text-sm font-medium text-on-surface ${full ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>;
}
