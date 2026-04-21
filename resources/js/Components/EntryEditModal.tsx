import Modal from '@/Components/Modal';
import { League, LeagueEntry } from '@/types/jrclub';
import { useForm } from '@inertiajs/react';
import React, { useMemo } from 'react';
import ReactSelect, { MultiValue, SingleValue, StylesConfig } from 'react-select';

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

export default function EntryEditModal({
    league,
    entry,
    users,
    onClose,
}: {
    league: League;
    entry: LeagueEntry;
    users: UserOption[];
    onClose: () => void;
}) {
    const category = league.category!;
    const entryType = league.entry_type;
    const allowsGroupPicture = ['MD', 'WD', 'XD'].includes(category);
    
    const form = useForm({
        group_name: entry.group_name ?? '',
        player1_id: entry.player1?.id ? String(entry.player1.id) : '',
        player2_id: entry.player2?.id ? String(entry.player2.id) : '',
        substitute_ids: entry.substitutes?.map((sub) => String(sub.id)) ?? [],
        seed: entry.seed?.toString() ?? '',
        group_picture: null as File | null,
        remove_group_picture: false,
        _method: 'PATCH',
    });

    const selectedPlayer1 = users.find((user) => String(user.id) === form.data.player1_id);
    const player1Users = useMemo(() => filterUsersByCategory(users, category, 'player1'), [users, category]);
    const player2Users = useMemo(() => filterUsersByCategory(users, category, 'player2', selectedPlayer1), [users, category, selectedPlayer1]);
    const substituteUsers = useMemo(() => {
        const selectedPlayerIds = [form.data.player1_id, form.data.player2_id].filter(Boolean);

        return filterUsersByCategory(users, category, 'substitute')
            .filter((user) => !selectedPlayerIds.includes(String(user.id)));
    }, [users, category, form.data.player1_id, form.data.player2_id]);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(route('admin.leagues.entries.update', [league.id, entry.id]), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="xl">
            <div className="p-6">
                <h2 className="mb-6 text-lg font-bold text-on-surface">Edit Entry</h2>
                
                <form onSubmit={submit} className="grid gap-5">
                    {entryType === 'double' ? (
                        <label className="block">
                            <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Group name</span>
                            <input value={form.data.group_name} onChange={(event) => form.setData('group_name', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface text-sm" placeholder="Optional team name" />
                            {form.errors.group_name ? <span className="text-xs font-medium text-error mt-1 block">{form.errors.group_name}</span> : null}
                        </label>
                    ) : null}
                    
                    {allowsGroupPicture ? (
                        <label className="block">
                            <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Group picture</span>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(event) => form.setData('group_picture', event.target.files?.[0] ?? null)}
                                className="block w-full rounded-lg border border-outline-variant/20 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-primary"
                            />
                            <div className="mt-2 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="remove_group_picture"
                                    checked={form.data.remove_group_picture}
                                    onChange={(e) => form.setData('remove_group_picture', e.target.checked)}
                                    className="rounded border-outline-variant/20 text-primary focus:ring-primary"
                                />
                                <label htmlFor="remove_group_picture" className="text-xs text-on-surface-variant">Remove current picture</label>
                            </div>
                            <p className="mt-1 text-xs text-on-surface-variant">Optional. JPEG, PNG, or WEBP up to 5MB.</p>
                            {form.errors.group_picture ? <span className="text-xs font-medium text-error mt-1 block">{form.errors.group_picture}</span> : null}
                        </label>
                    ) : null}
                    
                    <UserSelect label="Player 1" value={form.data.player1_id} onChange={(value) => form.setData('player1_id', value)} users={player1Users} error={form.errors.player1_id} />
                    <UserSelect label={entryType === 'double' ? 'Player 2' : 'Partner'} value={form.data.player2_id} onChange={(value) => form.setData('player2_id', value)} users={player2Users} disabled={entryType !== 'double'} optional error={form.errors.player2_id} />
                    <UserMultiSelect label="Substitutes" value={form.data.substitute_ids} onChange={(value) => form.setData('substitute_ids', value)} users={substituteUsers} error={form.errors.substitute_ids} />
                    
                    <label className="block">
                        <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Seed</span>
                        <input type="number" min={1} value={form.data.seed} onChange={(event) => form.setData('seed', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface text-sm" placeholder="Optional seed number" />
                        {form.errors.seed ? <span className="text-xs font-medium text-error mt-1 block">{form.errors.seed}</span> : null}
                    </label>

                    {Object.values(form.errors).length > 0 ? <p className="text-sm font-medium text-error">{Object.values(form.errors)[0]}</p> : null}

                    <div className="mt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="rounded-full bg-surface-container-low px-6 py-2.5 text-[0.875rem] font-bold text-on-surface hover:bg-surface-container transition-colors">
                            Cancel
                        </button>
                        <button disabled={form.processing} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all disabled:opacity-50">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
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
