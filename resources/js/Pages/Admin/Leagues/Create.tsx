import AdminLayout from '@/Layouts/AdminLayout';
import DatePicker from '@/Components/DatePicker';
import SelectInput, { SelectOption } from '@/Components/SelectInput';
import { Sport } from '@/types/jrclub';
import { Head, useForm } from '@inertiajs/react';

const categoryOptions: SelectOption[] = [
    { value: 'MS', label: 'Single Putra' },
    { value: 'WS', label: 'Single Putri' },
    { value: 'MD', label: 'Ganda Putra' },
    { value: 'WD', label: 'Ganda Putri' },
    { value: 'XD', label: 'Ganda Campuran' },
];

export default function Create({ sports }: { sports: Sport[] }) {
    const form = useForm({
        name: '',
        sport_id: sports[0]?.id ?? '',
        category: 'MS',
        description: '',
        start_date: '',
        end_date: '',
        status: 'upcoming',
        participant_total: '8',
        sets_to_win: '2',
        points_per_set: '21',
        advance_upper_count: '1',
        advance_lower_count: '1',
    });
    const sportOptions = sports.map((sport) => ({ value: String(sport.id), label: sport.name }));

    return (
        <AdminLayout title="Create League">
            <Head title="Create League" />
            <form onSubmit={(event) => { event.preventDefault(); form.post(route('admin.leagues.store')); }} className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2">
                <Field label="League name"><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Sport"><SelectInput options={sportOptions} value={form.data.sport_id} onChange={(value) => form.setData('sport_id', Number(value || sports[0]?.id || 0))} placeholder="Select sport" /></Field>
                <Field label="Category"><SelectInput options={categoryOptions} value={form.data.category} onChange={(value) => form.setData('category', value || 'MS')} placeholder="Select category" /></Field>
                <Field label="Participant total"><input type="number" min={2} value={form.data.participant_total} onChange={(event) => form.setData('participant_total', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Start date"><DatePicker value={form.data.start_date} onChange={(value) => form.setData('start_date', value)} /></Field>
                <Field label="End date"><DatePicker value={form.data.end_date} onChange={(value) => form.setData('end_date', value)} /></Field>
                <Field label="Sets to win"><input type="number" min={1} value={form.data.sets_to_win} onChange={(event) => form.setData('sets_to_win', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Points per set"><input type="number" min={1} value={form.data.points_per_set} onChange={(event) => form.setData('points_per_set', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Upper advances"><input type="number" min={0} value={form.data.advance_upper_count} onChange={(event) => form.setData('advance_upper_count', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Lower advances"><input type="number" min={0} value={form.data.advance_lower_count} onChange={(event) => form.setData('advance_lower_count', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Description" full><textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="min-h-28 rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Create League</button></div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
    return <label className={`grid gap-2 text-sm font-medium text-on-surface ${full ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>;
}
