import { useForm, router } from '@inertiajs/react';
import { useMemo } from 'react';
import ReactSelect, { MultiValue, SingleValue, StylesConfig } from 'react-select';
import { League, Team } from '@/types/jrclub';

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
        ':active': { backgroundColor: state.isSelected ? '#0056a4' : '#eceef0' },
    }),
    valueContainer: (base) => ({ ...base, padding: '0 8px' }),
    multiValue: (base) => ({ ...base, backgroundColor: 'rgba(0, 86, 164, 0.1)', borderRadius: '4px' }),
    multiValueLabel: (base) => ({ ...base, color: '#0056a4', fontSize: '0.75rem', fontWeight: 'bold' }),
};

export default function ParticipantPicker({
    league,
    users,
    teams,
}: {
    league: League;
    users: UserOption[];
    teams: Team[];
}) {
    const playerCount = league.sport_category?.player_count ?? 1;
    const isTeamEntry = league.entry_type === 'team';
    const isDoubles = league.entry_type === 'double';
    const allowsGroupPicture = ['MD', 'WD', 'XD'].includes(league.category ?? '');

    const form = useForm({
        team_id: '',
        player_ids: Array.from({ length: playerCount }, () => ''),
        substitute_ids: [] as string[],
        group_name: '',
        group_picture: null as File | null,
    });

    const selectedTeam = teams.find((t) => String(t.id) === form.data.team_id) ?? null;

    const activeUsers = useMemo(() => {
        if (!selectedTeam?.members) return users;
        const memberIds = new Set(selectedTeam.members.map((m) => String(m.id)));
        return users.filter((u) => memberIds.has(String(u.id)));
    }, [users, selectedTeam]);

    const getPlayerOptions = (slotIndex: number): SelectOption[] => {
        const takenIds = new Set(form.data.player_ids.filter((id, i) => i !== slotIndex && id));
        let pool = activeUsers.filter((u) => !takenIds.has(String(u.id)));

        const cat = league.category;
        if (cat === 'MS' || cat === 'MD') {
            pool = pool.filter((u) => u.gender === 'male' || u.gender == null);
        } else if (cat === 'WS' || cat === 'WD') {
            pool = pool.filter((u) => u.gender === 'female' || u.gender == null);
        } else if (cat === 'XD') {
            const otherSlot = slotIndex === 0 ? form.data.player_ids[1] : form.data.player_ids[0];
            const otherPlayer = otherSlot ? activeUsers.find((u) => String(u.id) === otherSlot) : null;
            if (otherPlayer?.gender) {
                pool = pool.filter((u) => !u.gender || u.gender !== otherPlayer.gender);
            }
        }

        return pool.map((u) => ({
            value: String(u.id),
            label: `${u.name}${u.gender ? ` (${u.gender})` : ''}`,
        }));
    };

    const substituteOptions = useMemo(() => {
        const taken = new Set(form.data.player_ids.filter(Boolean));
        return activeUsers
            .filter((u) => !taken.has(String(u.id)))
            .map((u) => ({ value: String(u.id), label: u.name }));
    }, [activeUsers, form.data.player_ids]);

    const teamOptions = teams.map((t) => ({ value: String(t.id), label: t.name }));

    const handleTeamChange = (value: string) => {
        const team = teams.find((t) => String(t.id) === value) ?? null;
        form.setData((data) => ({
            ...data,
            team_id: value,
            group_name: isDoubles ? (team?.name ?? '') : '',
            player_ids: Array.from({ length: playerCount }, () => ''),
            substitute_ids: [],
        }));
    };

    const setPlayerAt = (index: number, value: string) => {
        const ids = [...form.data.player_ids];
        ids[index] = value;
        form.setData('player_ids', ids);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isTeamEntry) {
            form.post(route('admin.leagues.teams.store', league.id), {
                preserveScroll: true,
                onSuccess: () => form.reset(),
            });
        } else {
            const body = new FormData();
            body.append('player1_id', form.data.player_ids[0] ?? '');
            if (form.data.player_ids[1]) body.append('player2_id', form.data.player_ids[1]);
            if (form.data.group_name) body.append('group_name', form.data.group_name);
            if (form.data.group_picture) body.append('group_picture', form.data.group_picture);
            form.data.substitute_ids.forEach((id) => body.append('substitute_ids[]', id));
            router.post(route('admin.leagues.entries.store', league.id), body, {
                preserveScroll: true,
                onSuccess: () => form.reset(),
            });
        }
    };

    const colSpan = playerCount === 1 ? 'md:col-span-2' : 'md:col-span-1';
    const isSubmitDisabled =
        form.processing ||
        form.data.player_ids.some((id) => !id) ||
        (isTeamEntry && !form.data.team_id) ||
        (isDoubles && !form.data.group_name);

    return (
        <form onSubmit={submit} className="rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <div className="grid gap-4 md:grid-cols-4 md:items-end">
                {/* Team selector */}
                <label className="block md:col-span-4">
                    <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                        Team {isTeamEntry ? '' : <span className="font-normal normal-case tracking-normal">(optional — filters players)</span>}
                    </span>
                    <ReactSelect<SelectOption, false>
                        isClearable={!isTeamEntry}
                        options={teamOptions}
                        value={teamOptions.find((o) => o.value === form.data.team_id) ?? null}
                        onChange={(selected: SingleValue<SelectOption>) => handleTeamChange(selected?.value ?? '')}
                        placeholder={isTeamEntry ? 'Select team' : 'Select team to filter players'}
                        styles={selectStyles as StylesConfig<SelectOption, false>}
                    />
                    {form.errors.team_id ? <span className="text-xs font-medium text-error mt-1 block">{form.errors.team_id}</span> : null}
                </label>

                {/* Group name — doubles only */}
                {isDoubles ? (
                    <label className="block md:col-span-4">
                        <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Group name</span>
                        <input
                            value={form.data.group_name}
                            onChange={(e) => form.setData('group_name', e.target.value)}
                            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface text-sm"
                            placeholder="Optional group name"
                        />
                        {form.errors.group_name ? <span className="text-xs font-medium text-error mt-1 block">{form.errors.group_name}</span> : null}
                    </label>
                ) : null}

                {/* Group picture — MD / WD / XD */}
                {allowsGroupPicture ? (
                    <label className="block md:col-span-4">
                        <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Group picture</span>
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => form.setData('group_picture', e.target.files?.[0] ?? null)}
                            className="block w-full rounded-lg border border-outline-variant/20 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-primary"
                        />
                        <p className="mt-1 text-xs text-on-surface-variant">Optional. JPEG, PNG, or WEBP up to 5MB.</p>
                        {form.errors.group_picture ? <span className="text-xs font-medium text-error mt-1 block">{form.errors.group_picture}</span> : null}
                    </label>
                ) : null}

                {/* N player slots */}
                {Array.from({ length: playerCount }).map((_, i) => {
                    const options = getPlayerOptions(i);
                    const currentValue = options.find((o) => o.value === form.data.player_ids[i]) ?? null;
                    const errors = form.errors as Record<string, string>;
                    const playerError = errors[`player_ids.${i}`] ?? errors['player1_id'] ?? undefined;

                    return (
                        <label key={i} className={`block ${colSpan}`}>
                            <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Player {i + 1}</span>
                            <ReactSelect<SelectOption, false>
                                isClearable
                                options={options}
                                value={currentValue}
                                onChange={(selected: SingleValue<SelectOption>) => setPlayerAt(i, selected?.value ?? '')}
                                placeholder={selectedTeam || !isTeamEntry ? 'Select player' : 'Select team first'}
                                isDisabled={isTeamEntry && !form.data.team_id}
                                styles={selectStyles as StylesConfig<SelectOption, false>}
                            />
                            {playerError ? <span className="text-xs font-medium text-error mt-1 block">{playerError}</span> : null}
                        </label>
                    );
                })}

                {/* Substitutes */}
                <label className={`block ${playerCount === 1 ? 'md:col-span-2' : playerCount % 4 === 0 ? 'md:col-span-4' : 'md:col-span-2'}`}>
                    <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Substitutes</span>
                    <ReactSelect<SelectOption, true>
                        isMulti
                        options={substituteOptions}
                        value={substituteOptions.filter((o) => form.data.substitute_ids.includes(o.value))}
                        onChange={(selected: MultiValue<SelectOption>) => form.setData('substitute_ids', selected.map((o) => o.value))}
                        placeholder={isTeamEntry && !form.data.team_id ? 'Select team first' : 'Optional substitutes'}
                        isDisabled={isTeamEntry && !form.data.team_id}
                        styles={selectStyles as StylesConfig<SelectOption, true>}
                    />
                    {form.errors.substitute_ids ? <span className="text-xs font-medium text-error mt-1 block">{form.errors.substitute_ids}</span> : null}
                </label>

                {/* Submit */}
                <div className="flex justify-end md:justify-start md:col-span-1">
                    <button
                        disabled={isSubmitDisabled}
                        className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all disabled:opacity-50 h-[46px] w-full md:w-auto"
                    >
                        Add Entry
                    </button>
                </div>
            </div>
            {Object.values(form.errors).length > 0 ? (
                <p className="text-sm font-medium text-error mt-3">{Object.values(form.errors)[0]}</p>
            ) : null}
        </form>
    );
}
