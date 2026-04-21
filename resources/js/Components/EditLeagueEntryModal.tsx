import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { League, LeagueEntry } from '@/types/jrclub';
import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
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

export default function EditLeagueEntryModal({
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
    const allowsGroupPicture = ['MD', 'WD', 'XD'].includes(league.category ?? '');
    const form = useForm({
        _method: 'patch',
        group_name: entry.group_name ?? '',
        player1_id: String(entry.player1.id),
        player2_id: entry.player2 ? String(entry.player2.id) : '',
        substitute_ids: (entry.substitutes ?? []).map((substitute) => String(substitute.id)),
        group_picture: null as File | null,
        remove_group_picture: false,
    });

    const selectedPlayer1 = users.find((user) => String(user.id) === form.data.player1_id);
    const player1Users = useMemo(() => filterUsersByCategory(users, league.category!, 'player1'), [users, league.category]);
    const player2Users = useMemo(() => filterUsersByCategory(users, league.category!, 'player2', selectedPlayer1), [users, league.category, selectedPlayer1]);
    const substituteUsers = useMemo(() => {
        const selectedPlayerIds = [form.data.player1_id, form.data.player2_id].filter(Boolean);

        return filterUsersByCategory(users, league.category!, 'substitute').filter((user) => !selectedPlayerIds.includes(String(user.id)));
    }, [users, league.category, form.data.player1_id, form.data.player2_id]);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(route('admin.leagues.entries.update', [league.id, entry.id]), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="grid gap-4 bg-surface-container-lowest p-6 text-on-surface">
                <div>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">Participants</p>
                    <h3 className="text-xl font-black tracking-tight">Edit Entry</h3>
                </div>

                {league.entry_type === 'double' ? (
                    <label className="block">
                        <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Group name</span>
                        <input value={form.data.group_name} onChange={(event) => form.setData('group_name', event.target.value)} className="w-full rounded-t-md border-0 border-b-2 border-outline-variant/20 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-0" placeholder="Optional team name" />
                        <InputError message={form.errors.group_name} className="mt-1" />
                    </label>
                ) : null}

                {allowsGroupPicture ? (
                    <div className="grid gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
                        {entry.group_picture_path ? (
                            <div className="flex items-center gap-3">
                                <img src={`/storage/${entry.group_picture_path}`} alt={entry.label} className={`h-16 w-16 rounded-lg object-cover ring-1 ring-outline-variant/20 ${form.data.remove_group_picture ? 'opacity-40' : ''}`} />
                                <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                                    <input type="checkbox" checked={form.data.remove_group_picture} onChange={(event) => form.setData('remove_group_picture', event.target.checked)} className="rounded border-outline-variant text-primary focus:ring-primary" />
                                    Remove current picture
                                </label>
                            </div>
                        ) : null}

                        <label className="block">
                            <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Group picture</span>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(event) => {
                                    form.setData('group_picture', event.target.files?.[0] ?? null);
                                    if (event.target.files?.[0]) {
                                        form.setData('remove_group_picture', false);
                                    }
                                }}
                                className="block w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-primary"
                            />
                            <p className="mt-1 text-xs text-on-surface-variant">Optional. Upload a new image to replace the current picture.</p>
                            <InputError message={form.errors.group_picture} className="mt-1" />
                            <InputError message={form.errors.remove_group_picture} className="mt-1" />
                        </label>
                    </div>
                ) : null}

                <UserSelect label="Player 1" value={form.data.player1_id} onChange={(value) => form.setData('player1_id', value)} users={player1Users} error={form.errors.player1_id} />
                <UserSelect label={league.entry_type === 'double' ? 'Player 2' : 'Partner'} value={form.data.player2_id} onChange={(value) => form.setData('player2_id', value)} users={player2Users} disabled={league.entry_type !== 'double'} optional error={form.errors.player2_id} />
                <UserMultiSelect label="Substitutes" value={form.data.substitute_ids} onChange={(value) => form.setData('substitute_ids', value)} users={substituteUsers} error={form.errors.substitute_ids} />

                {Object.values(form.errors).length > 0 ? <p className="text-sm font-medium text-error">{Object.values(form.errors)[0]}</p> : null}

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="rounded-full border border-outline-variant/20 bg-surface-container-low px-5 py-2 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container">Cancel</button>
                    <button disabled={form.processing} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-2 text-sm font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-all hover:scale-[0.98] disabled:opacity-50">Save Changes</button>
                </div>
            </form>
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
            <InputError message={error} className="mt-1" />
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
            <InputError message={error} className="mt-1" />
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
