import SelectInput from '@/Components/SelectInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Sport, Team } from '@/types/jrclub';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ team, sports }: { team: Team; sports: Sport[] }) {
    const form = useForm({ name: team.name, sport_id: team.sport.id });
    const sportOptions = sports.map((sport) => ({ value: String(sport.id), label: sport.name }));

    return (
        <AdminLayout title={`Edit ${team.name}`}>
            <Head title={team.name} />
            <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.teams.update', team.id)); }} className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2">
                <Field label="Name"><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Sport"><SelectInput options={sportOptions} value={form.data.sport_id} onChange={(value) => form.setData('sport_id', Number(value || sports[0]?.id || 0))} placeholder="Select sport" /></Field>
                <div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Save</button></div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <label className="grid gap-2 text-sm font-medium text-on-surface"><span>{label}</span>{children}</label>;
}
