import SelectInput from '@/Components/SelectInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Sport, SportCategory } from '@/types/jrclub';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const entryTypeOptions = [
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Double' },
    { value: 'team', label: 'Team' },
];

const genderRuleOptions = [
    { value: 'open', label: 'Open' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'mixed', label: 'Mixed' },
];

export default function Edit({ sport }: { sport: Sport }) {
    const form = useForm({
        name: sport.name,
        icon: sport.icon,
        max_players_per_team: sport.max_players_per_team?.toString() ?? '2',
        description: sport.description ?? '',
    });

    return (
        <AdminLayout title={`Edit ${sport.name}`}>
            <Head title={`Edit ${sport.name}`} />
            <div className="grid gap-6">
                <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.sports.update', sport.id)); }} className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2">
                    <Field label="Name"><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                    <Field label="Icon"><input value={form.data.icon} onChange={(event) => form.setData('icon', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                    <Field label="Max players"><input type="number" min={1} value={form.data.max_players_per_team} onChange={(event) => form.setData('max_players_per_team', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                    <Field label="Description" full><textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="min-h-28 rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                    <div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Save Sport</button></div>
                </form>

                <section className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                    <div>
                        <h2 className="text-lg font-bold text-on-surface">Categories</h2>
                        <p className="text-sm text-on-surface-variant">These options appear in league creation after selecting {sport.name}.</p>
                    </div>

                    <CategoryForm sportId={sport.id} />

                    <div className="grid gap-3">
                        {(sport.categories ?? []).length > 0 ? sport.categories?.map((category) => (
                            <CategoryRow key={category.id} sportId={sport.id} category={category} />
                        )) : <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">No categories configured yet.</div>}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

function CategoryForm({ sportId }: { sportId: number }) {
    const form = useForm({
        code: '',
        name: '',
        entry_type: 'team',
        player_count: '1',
        gender_rule: 'open',
        sort_order: '0',
        is_active: true,
    });

    return (
        <form onSubmit={(event) => { event.preventDefault(); form.post(route('admin.sports.categories.store', sportId), { preserveScroll: true, onSuccess: () => form.reset() }); }} className="grid gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 md:grid-cols-6 md:items-end">
            <Field label="Code"><input value={form.data.code} onChange={(event) => form.setData('code', event.target.value.toUpperCase())} className="rounded-xl border-0 bg-white px-3 py-3" placeholder="3V3" /></Field>
            <Field label="Name"><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="rounded-xl border-0 bg-white px-3 py-3" placeholder="3 vs 3" /></Field>
            <Field label="Entry type"><SelectInput options={entryTypeOptions} value={form.data.entry_type} onChange={(value) => form.setData('entry_type', value || 'team')} /></Field>
            <Field label="Players"><input type="number" min={1} value={form.data.player_count} onChange={(event) => form.setData('player_count', event.target.value)} className="rounded-xl border-0 bg-white px-3 py-3" /></Field>
            <Field label="Gender"><SelectInput options={genderRuleOptions} value={form.data.gender_rule} onChange={(value) => form.setData('gender_rule', value || 'open')} /></Field>
            <button disabled={form.processing} className="rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Add</button>
            {Object.values(form.errors).length > 0 ? <p className="text-sm font-medium text-error md:col-span-6">{Object.values(form.errors)[0]}</p> : null}
        </form>
    );
}

function CategoryRow({ sportId, category }: { sportId: number; category: SportCategory }) {
    const [editing, setEditing] = useState(false);
    const form = useForm({
        code: category.code,
        name: category.name,
        entry_type: category.entry_type,
        player_count: String(category.player_count),
        gender_rule: category.gender_rule || 'open',
        sort_order: String(category.sort_order ?? 0),
        is_active: category.is_active,
    });

    if (!editing) {
        return (
            <div className="flex flex-col gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-bold text-on-surface">{category.name} <span className="text-xs uppercase tracking-widest text-on-surface-variant">{category.code}</span></p>
                    <p className="text-sm text-on-surface-variant">{category.entry_type} • {category.player_count} player{category.player_count > 1 ? 's' : ''} • {category.gender_rule} {category.is_active ? '' : '• inactive'}</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={() => setEditing(true)} className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">Edit</button>
                    <button type="button" onClick={() => router.delete(route('admin.sports.categories.destroy', [sportId, category.id]), { preserveScroll: true })} className="rounded-full bg-error/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-error">Delete</button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.sports.categories.update', [sportId, category.id]), { preserveScroll: true, onSuccess: () => setEditing(false) }); }} className="grid gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 md:grid-cols-6 md:items-end">
            <Field label="Code"><input value={form.data.code} onChange={(event) => form.setData('code', event.target.value.toUpperCase())} className="rounded-xl border-0 bg-white px-3 py-3" /></Field>
            <Field label="Name"><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="rounded-xl border-0 bg-white px-3 py-3" /></Field>
            <Field label="Entry type"><SelectInput options={entryTypeOptions} value={form.data.entry_type} onChange={(value) => form.setData('entry_type', value === 'single' || value === 'double' ? value : 'team')} /></Field>
            <Field label="Players"><input type="number" min={1} value={form.data.player_count} onChange={(event) => form.setData('player_count', event.target.value)} className="rounded-xl border-0 bg-white px-3 py-3" /></Field>
            <Field label="Gender"><SelectInput options={genderRuleOptions} value={form.data.gender_rule} onChange={(value) => form.setData('gender_rule', value || 'open')} /></Field>
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface"><input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="rounded border-outline-variant/20 text-primary focus:ring-primary" /> Active</label>
            <div className="flex gap-2 md:col-span-6 md:justify-end">
                <button type="button" onClick={() => setEditing(false)} className="rounded-full bg-surface-container-low px-5 py-2 text-sm font-bold text-on-surface">Cancel</button>
                <button disabled={form.processing} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-on-primary">Save Category</button>
            </div>
            {Object.values(form.errors).length > 0 ? <p className="text-sm font-medium text-error md:col-span-6">{Object.values(form.errors)[0]}</p> : null}
        </form>
    );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
    return <label className={`grid gap-2 text-sm font-medium text-on-surface ${full ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>;
}
