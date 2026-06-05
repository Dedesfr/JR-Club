import SelectInput from '@/Components/SelectInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Branch, Sport } from '@/types/jrclub';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Create({ branches, sports }: { branches: Branch[]; sports: Sport[] }) {
    const { auth } = usePage<PageProps>().props;
    const form = useForm<{ name: string; branch_id: string; sport_ids: number[] }>({ name: '', branch_id: '', sport_ids: [] });
    const branchOptions = [{ value: '', label: 'National' }, ...branches.map((branch) => ({ value: String(branch.id), label: branch.name }))];

    function toggleSport(id: number) {
        const ids = form.data.sport_ids;
        form.setData('sport_ids', ids.includes(id) ? ids.filter((s) => s !== id) : [...ids, id]);
    }

    return (
        <AdminLayout
            title="Create Team"
            actions={
                <button
                    type="submit"
                    form="create-team-form"
                    disabled={form.processing}
                    className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                    Save Team
                </button>
            }
        >
            <Head title="Create Team" />
            <form
                id="create-team-form"
                onSubmit={(event) => { event.preventDefault(); form.post(route('admin.teams.store')); }}
                className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden"
            >
                <div className="bg-surface-container-low/30 px-6 py-4 border-b border-outline-variant/10">
                    <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary">Team Information</h3>
                </div>
                <div className="p-6 space-y-6">
                    <label className="block">
                        <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Team name</span>
                        <input
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface"
                            placeholder="e.g. Garuda FC"
                        />
                        {form.errors.name ? <p className="mt-1 text-xs text-error">{form.errors.name}</p> : null}
                    </label>
                    {auth.isPusatAdmin ? (
                        <label className="block">
                            <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Branch</span>
                            <SelectInput options={branchOptions} value={form.data.branch_id} onChange={(value) => form.setData('branch_id', value)} />
                        </label>
                    ) : null}

                    <div>
                        <span className="block mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Sports</span>
                        <div className="flex flex-wrap gap-2">
                            {sports.map((sport) => {
                                const selected = form.data.sport_ids.includes(sport.id);
                                return (
                                    <button
                                        key={sport.id}
                                        type="button"
                                        onClick={() => toggleSport(sport.id)}
                                        className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${selected ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                                    >
                                        {sport.name}
                                    </button>
                                );
                            })}
                        </div>
                        {form.errors.sport_ids ? <p className="mt-1 text-xs text-error">{form.errors.sport_ids}</p> : null}
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
