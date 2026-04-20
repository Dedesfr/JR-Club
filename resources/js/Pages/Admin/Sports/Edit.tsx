import AdminLayout from '@/Layouts/AdminLayout';
import { Sport } from '@/types/jrclub';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ sport }: { sport: Sport }) {
    const form = useForm({ name: sport.name, icon: sport.icon, max_players_per_team: sport.max_players_per_team?.toString() ?? '2', description: sport.description ?? '' });
    return <EditPage title={`Edit ${sport.name}`} onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.sports.update', sport.id)); }}><Field label="Name"><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field><Field label="Icon"><input value={form.data.icon} onChange={(event) => form.setData('icon', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field><Field label="Max players"><input type="number" min={1} value={form.data.max_players_per_team} onChange={(event) => form.setData('max_players_per_team', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field><Field label="Description" full><textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="min-h-28 rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field></EditPage>;
}

function EditPage({ title, onSubmit, children }: { title: string; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; children: React.ReactNode }) {
    return <AdminLayout title={title}><Head title={title} /><form onSubmit={onSubmit} className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2">{children}<div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Save</button></div></form></AdminLayout>;
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) { return <label className={`grid gap-2 text-sm font-medium text-on-surface ${full ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>; }
