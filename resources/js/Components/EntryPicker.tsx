import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import ReactSelect, { MultiValue, SingleValue, StylesConfig } from 'react-select';
import { League } from '@/types/jrclub';

type UserOption = {
    id: number;
    name: string;
    gender?: string | null;
};

type SelectOption = {
    value: string;
    label: string;
};

const selectStyles: StylesConfig<SelectOption, boolean> = {
    control: (base, state) => ({
        ...base,
        minHeight: '46px',
        border: '0',
        borderBottom: '2px solid rgba(193, 198, 213, 0.2)',
        borderRadius: '0.375rem 0.375rem 0 0',
        backgroundColor: '#f2f4f6',
        boxShadow: state.isFocused ? '0 2px 0 0 #0056a4' : 'none',
        fontSize: '0.875rem',
        padding: '0',
    }),
    menu: (base) => ({
        ...base,
        zIndex: 50,
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0px 12px 32px rgba(15, 23, 42, 0.12)',
        border: '1px solid rgba(193, 198, 213, 0.2)',
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#f2f4f6' : state.isSelected ? '#0056a4' : 'white',
        color: state.isSelected ? 'white' : '#191c1e',
        cursor: 'pointer',
        fontSize: '0.875rem',
        ':active': {
            backgroundColor: state.isSelected ? '#0056a4' : '#eceef0',
        },
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: 'rgba(0, 86, 164, 0.1)',
        borderRadius: '4px',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#0056a4',
        fontSize: '0.75rem',
        fontWeight: 'bold',
    }),
};

export default function EntryPicker({
    leagueId,
    users,
    category,
    entryType,
}: {
    leagueId: number;
    users: UserOption[];
    category: NonNullable<League['category']>;
    entryType?: 'single' | 'double' | null;
}) {
    const allowsGroupPicture = ['MD', 'WD', 'XD'].includes(category);
    const form = useForm({ group_name: '', player1_id: '', player2_id: '', substitute_ids: [] as string[], group_picture: null as File | null });
    const selectedPlayer1 = users.find((user) => String(user.id) === form.data.player1_id);
    const player1Users = useMemo(() => filterUsersByCategory(users, category, 'player1'), [users, category]);
    const player2Users = useMemo(() => filterUsersByCategory(users, category, 'player2', selectedPlayer1), [users, category, selectedPlayer1]);
    const substituteUsers = useMemo(() => {
        const selectedPlayerIds = [form.data.player1_id, form.data.player2_id].filter(Boolean);

        return filterUsersByCategory(users, category, 'substitute')
            .filter((user) => ! selectedPlayerIds.includes(String(user.id)));
    }, [users, category, form.data.player1_id, form.data.player2_id]);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(route('admin.leagues.entries.store', leagueId), {
            preserveScroll: true,
            onSuccess: () => form.reset('group_name', 'player1_id', 'player2_id', 'substitute_ids', 'group_picture'),
        });
    };

    return (
        <form onSubmit={submit} className="rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <div className="grid gap-4 md:grid-cols-4 md:items-end">
                {entryType === 'double' ? (
                    <label className="block md:col-span-4">
                        <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Group name</span>
                        <input value={form.data.group_name} onChange={(event) => form.setData('group_name', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface text-sm" placeholder="Optional team name" />
                        {form.errors.group_name ? <span className="text-xs font-medium text-error mt-1 block">{form.errors.group_name}</span> : null}
                    </label>
                ) : null}
                {allowsGroupPicture ? (
                    <label className="block md:col-span-4">
                        <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Group picture</span>
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(event) => form.setData('group_picture', event.target.files?.[0] ?? null)}
                            className="block w-full rounded-lg border border-outline-variant/20 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-primary"
                        />
                        <p className="mt-1 text-xs text-on-surface-variant">Optional. JPEG, PNG, or WEBP up to 5MB.</p>
                        {form.errors.group_picture ? <span className="text-xs font-medium text-error mt-1 block">{form.errors.group_picture}</span> : null}
                    </label>
                ) : null}
                <UserSelect label="Player 1" value={form.data.player1_id} onChange={(value) => form.setData('player1_id', value)} users={player1Users} error={form.errors.player1_id} />
                <UserSelect label={entryType === 'double' ? 'Player 2' : 'Partner'} value={form.data.player2_id} onChange={(value) => form.setData('player2_id', value)} users={player2Users} disabled={entryType !== 'double'} optional error={form.errors.player2_id} />
                <UserMultiSelect label="Substitutes" value={form.data.substitute_ids} onChange={(value) => form.setData('substitute_ids', value)} users={substituteUsers} error={form.errors.substitute_ids} />
                <div className="flex justify-end md:justify-start">
                    <button disabled={form.processing} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all disabled:opacity-50 h-[46px] w-full md:w-auto">
                        Add Entry
                    </button>
                </div>
            </div>
            {Object.values(form.errors).length > 0 ? <p className="text-sm font-medium text-error mt-3">{Object.values(form.errors)[0]}</p> : null}
        </form>
    );
}

function UserMultiSelect({ label, value, onChange, users, error }: { label: string; value: string[]; onChange: (value: string[]) => void; users: UserOption[]; error?: string }) {
    const options = userOptions(users);

    return (
        <label className="block w-full">
            <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</span>
            <ReactSelect<SelectOption, true>
                isMulti
                options={options}
                value={options.filter((option) => value.includes(option.value))}
                onChange={(selected: MultiValue<SelectOption>) => onChange(selected.map((option) => option.value))}
                placeholder="Search substitutes"
                styles={selectStyles as StylesConfig<SelectOption, true>}
            />
            {error ? <span className="text-xs font-medium text-error mt-1 block">{error}</span> : null}
        </label>
    );
}

function UserSelect({ label, value, onChange, users, disabled, optional = false, error }: { label: string; value: string; onChange: (value: string) => void; users: UserOption[]; disabled?: boolean; optional?: boolean; error?: string }) {
    const options = userOptions(users);

    return (
        <label className="block w-full">
            <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</span>
            <ReactSelect<SelectOption, false>
                isClearable={optional}
                isDisabled={disabled}
                options={options}
                value={options.find((option) => option.value === value) ?? null}
                onChange={(selected: SingleValue<SelectOption>) => onChange(selected?.value ?? '')}
                placeholder={optional ? 'Optional' : 'Select user'}
                styles={selectStyles as StylesConfig<SelectOption, false>}
            />
            {error ? <span className="text-xs font-medium text-error mt-1 block">{error}</span> : null}
        </label>
    );
}

function userOptions(users: UserOption[]): SelectOption[] {
    return users.map((user) => ({
        value: String(user.id),
        label: `${user.name}${user.gender ? ` (${user.gender})` : ''}`,
    }));
}

function filterUsersByCategory(users: UserOption[], category: NonNullable<League['category']>, field: 'player1' | 'player2' | 'substitute', player1?: UserOption) {
    if (category === 'MS') {
        return users.filter((user) => user.gender === 'male');
    }

    if (category === 'WS') {
        return users.filter((user) => user.gender === 'female');
    }

    if (category === 'MD') {
        return users.filter((user) => user.gender === 'male');
    }

    if (category === 'WD') {
        return users.filter((user) => user.gender === 'female');
    }

    if (field === 'player2' && player1?.gender) {
        return users.filter((user) => user.gender && user.gender !== player1.gender);
    }

    return users.filter((user) => user.gender === 'male' || user.gender === 'female');
}
