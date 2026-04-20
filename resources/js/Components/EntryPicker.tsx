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
        minHeight: '48px',
        border: 0,
        borderRadius: '12px',
        backgroundColor: '#f2f4f6',
        boxShadow: state.isFocused ? '0 0 0 2px #003f7b' : 'none',
        fontSize: '0.875rem',
    }),
    menu: (base) => ({
        ...base,
        zIndex: 30,
        borderRadius: '12px',
        overflow: 'hidden',
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
    const form = useForm({ group_name: '', player1_id: '', player2_id: '', substitute_ids: [] as string[] });
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
            onSuccess: () => form.reset(),
        });
    };

    return (
        <form onSubmit={submit} className="grid gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-4">
            {entryType === 'double' ? (
                <label className="grid gap-2 text-sm font-medium text-on-surface md:col-span-4">
                    <span>Group name</span>
                    <input value={form.data.group_name} onChange={(event) => form.setData('group_name', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3 text-base text-on-surface md:text-sm" />
                    {form.errors.group_name ? <span className="text-xs font-medium text-error">{form.errors.group_name}</span> : null}
                </label>
            ) : null}
            <UserSelect label="Player 1" value={form.data.player1_id} onChange={(value) => form.setData('player1_id', value)} users={player1Users} error={form.errors.player1_id} />
            <UserSelect label={entryType === 'double' ? 'Player 2' : 'Partner'} value={form.data.player2_id} onChange={(value) => form.setData('player2_id', value)} users={player2Users} disabled={entryType !== 'double'} optional error={form.errors.player2_id} />
            <UserMultiSelect label="Substitutes" value={form.data.substitute_ids} onChange={(value) => form.setData('substitute_ids', value)} users={substituteUsers} error={form.errors.substitute_ids} />
            <button disabled={form.processing} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary disabled:opacity-60">
                Add Entry
            </button>
            {Object.values(form.errors).length > 0 ? <p className="text-sm font-medium text-error md:col-span-4">{Object.values(form.errors)[0]}</p> : null}
        </form>
    );
}

function UserMultiSelect({ label, value, onChange, users, error }: { label: string; value: string[]; onChange: (value: string[]) => void; users: UserOption[]; error?: string }) {
    const options = userOptions(users);

    return (
        <label className="grid gap-2 text-sm font-medium text-on-surface">
            <span>{label}</span>
            <ReactSelect<SelectOption, true>
                isMulti
                options={options}
                value={options.filter((option) => value.includes(option.value))}
                onChange={(selected: MultiValue<SelectOption>) => onChange(selected.map((option) => option.value))}
                placeholder="Search substitutes"
                styles={selectStyles as StylesConfig<SelectOption, true>}
            />
            {error ? <span className="text-xs font-medium text-error">{error}</span> : null}
        </label>
    );
}

function UserSelect({ label, value, onChange, users, disabled, optional = false, error }: { label: string; value: string; onChange: (value: string) => void; users: UserOption[]; disabled?: boolean; optional?: boolean; error?: string }) {
    const options = userOptions(users);

    return (
        <label className="grid gap-2 text-sm font-medium text-on-surface">
            <span>{label}</span>
            <ReactSelect<SelectOption, false>
                isClearable={optional}
                isDisabled={disabled}
                options={options}
                value={options.find((option) => option.value === value) ?? null}
                onChange={(selected: SingleValue<SelectOption>) => onChange(selected?.value ?? '')}
                placeholder={optional ? 'Optional' : 'Select user'}
                styles={selectStyles as StylesConfig<SelectOption, false>}
            />
            {error ? <span className="text-xs font-medium text-error">{error}</span> : null}
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
