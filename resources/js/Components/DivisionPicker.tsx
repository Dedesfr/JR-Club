import SelectInput from '@/Components/SelectInput';
import { useForm } from '@inertiajs/react';

export default function DivisionPicker({ leagueId, options }: { leagueId: number; options: { group_count: number; group_size: number }[] }) {
    const form = useForm({ group_count: options[0]?.group_count ?? 2 });
    const divisionOptions = options.map((option) => ({
        value: String(option.group_count),
        label: `${option.group_count} groups x ${option.group_size}`,
    }));

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                form.post(route('admin.leagues.groups.store', leagueId), { preserveScroll: true });
            }}
            className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:flex-row md:items-end"
        >
            <label className="grid flex-1 gap-2 text-sm font-medium text-on-surface">
                <span>Division format</span>
                <SelectInput options={divisionOptions} value={form.data.group_count} onChange={(value) => form.setData('group_count', Number(value))} />
            </label>
            <button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">
                Generate Groups
            </button>
        </form>
    );
}
