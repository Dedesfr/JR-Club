import DatePicker from '@/Components/DatePicker';
import SelectInput from '@/Components/SelectInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Branch, Sport } from '@/types/jrclub';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Create({ sports, branches }: { sports: Sport[]; branches: Branch[] }) {
    const { auth } = usePage<PageProps>().props;
    const form = useForm({
        title: '',
        description: '',
        location: '',
        scheduled_at: '',
        max_participants: '10',
        status: 'open',
        sport_id: sports[0]?.id ?? 0,
        branch_id: '',
    });
    const sportOptions = sports.map((sport) => ({ value: String(sport.id), label: sport.name }));
    const branchOptions = [{ value: '', label: 'National' }, ...branches.map((branch) => ({ value: String(branch.id), label: branch.name }))];

    return (
        <AdminLayout title="Create Activity">
            <Head title="Create Activity" />
            <form
                onSubmit={(event) => { event.preventDefault(); form.post(route('admin.activities.store')); }}
                className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2"
            >
                <Field label="Title"><input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Sport"><SelectInput options={sportOptions} value={form.data.sport_id} onChange={(value) => form.setData('sport_id', Number(value || sports[0]?.id || 0))} placeholder="Select sport" /></Field>
                <Field label="Location"><input value={form.data.location} onChange={(e) => form.setData('location', e.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Scheduled at"><DatePicker enableTime value={form.data.scheduled_at} onChange={(value) => form.setData('scheduled_at', value)} /></Field>
                <Field label="Max participants"><input type="number" min={1} value={form.data.max_participants} onChange={(e) => form.setData('max_participants', e.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Status"><input value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                {auth.isPusatAdmin ? (
                    <Field label="Branch"><SelectInput options={branchOptions} value={form.data.branch_id} onChange={(value) => form.setData('branch_id', value)} /></Field>
                ) : null}
                <Field label="Description" full><textarea value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} className="min-h-28 rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <div className="md:col-span-2 flex justify-end">
                    <button disabled={form.processing} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary disabled:opacity-50">
                        Create
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
    return <label className={`grid gap-2 text-sm font-medium text-on-surface ${full ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>;
}
