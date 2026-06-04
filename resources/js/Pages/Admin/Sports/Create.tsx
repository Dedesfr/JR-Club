import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const form = useForm({
        name: '',
        icon: '',
        max_players_per_team: '2',
        description: '',
    });

    return (
        <AdminLayout title="Create Sport">
            <Head title="Create Sport" />
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post(route('admin.sports.store'));
                }}
                className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2"
            >
                <Field label="Name">
                    <input
                        value={form.data.name}
                        onChange={(event) => form.setData('name', event.target.value)}
                        className="rounded-xl border-0 bg-surface-container-low px-3 py-3"
                    />
                </Field>
                <Field label="Icon">
                    <input
                        value={form.data.icon}
                        onChange={(event) => form.setData('icon', event.target.value)}
                        className="rounded-xl border-0 bg-surface-container-low px-3 py-3"
                    />
                </Field>
                <Field label="Max players">
                    <input
                        type="number"
                        min={1}
                        value={form.data.max_players_per_team}
                        onChange={(event) => form.setData('max_players_per_team', event.target.value)}
                        className="rounded-xl border-0 bg-surface-container-low px-3 py-3"
                    />
                </Field>
                <Field label="Description" full>
                    <textarea
                        value={form.data.description}
                        onChange={(event) => form.setData('description', event.target.value)}
                        className="min-h-28 rounded-xl border-0 bg-surface-container-low px-3 py-3"
                    />
                </Field>
                {Object.values(form.errors).length > 0 ? (
                    <p className="text-sm font-medium text-error md:col-span-2">{Object.values(form.errors)[0]}</p>
                ) : null}
                <div className="flex justify-end md:col-span-2">
                    <button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">
                        Save Sport
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
    return <label className={`grid gap-2 text-sm font-medium text-on-surface ${full ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>;
}
