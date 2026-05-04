import SelectInput from '@/Components/SelectInput';
import DatePicker from '@/Components/DatePicker';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

type RoundSchedule = {
    round: number;
    scheduled_at: string;
};

export default function DivisionPicker({ leagueId, options, startDate, hasExistingGroups = false, hasExistingGroupMatches = false, groupLocked = false, initialGroupCount, initialInterval = 15, initialStartTime = '17:00', initialSchedule }: { leagueId: number; options: { group_count: number; group_size: number }[]; startDate?: string; hasExistingGroups?: boolean; hasExistingGroupMatches?: boolean; groupLocked?: boolean; initialGroupCount?: number; initialInterval?: number; initialStartTime?: string; initialSchedule?: RoundSchedule[] }) {
    const defaultOption = options[0];
    const activeGroupCount = initialGroupCount ?? defaultOption?.group_count ?? 2;
    const activeOption = options.find((option) => option.group_count === activeGroupCount) ?? defaultOption;
    const initialRounds = Math.max(1, initialSchedule?.length ?? activeOption?.group_size ?? 1);
    
    const [rounds, setRounds] = useState(initialRounds);

    const { data, setData } = useForm({
        group_count: activeGroupCount,
        interval: initialInterval,
        start_time: initialStartTime,
        schedule: initialSchedule && initialSchedule.length > 0 ? initialSchedule : buildWeeklySchedule(initialRounds, startDate),
    });

    const divisionOptions = options.map((option) => ({
        value: String(option.group_count),
        label: `${option.group_count} groups x ${option.group_size}`,
    }));

    const updateRoundSchedule = (index: number, dateStr: string) => {
        const newSchedule = [...data.schedule];
        if (newSchedule[index]) {
            newSchedule[index].scheduled_at = dateStr;
            setData('schedule', newSchedule);
        }
    };

    const handleOptionChange = (value: string) => {
        const numValue = Number(value);
        setData('group_count', numValue);
        
        const opt = options.find(o => o.group_count === numValue);
        if (opt) {
            const newRounds = Math.max(1, opt.group_size);
            setRounds(newRounds);

            setData('schedule', buildWeeklySchedule(newRounds, data.schedule[0]?.scheduled_at ?? startDate));
        }
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();

                const payload = {
                    ...data,
                    schedule: data.schedule.map((round) => ({
                        ...round,
                        scheduled_at: combineDateAndTime(round.scheduled_at, data.start_time),
                    })),
                };

                if (groupLocked) {
                    router.patch(route('admin.leagues.groups.schedule.update', leagueId), payload, { preserveScroll: true });
                    return;
                }

                if ((hasExistingGroups || hasExistingGroupMatches) && !window.confirm('Groups and group matches already exist. Generating again will replace them. Continue?')) {
                    return;
                }

                router.post(route('admin.leagues.groups.store', leagueId), payload, { preserveScroll: true });
            }}
            className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]"
        >
            {groupLocked ? (
                <div className="rounded-lg border border-outline-variant/20 bg-surface-container px-3 py-2 text-sm font-medium text-on-surface-variant">
                    Groups are locked. Regeneration is disabled for this league, but you can still adjust the group match schedule here.
                </div>
            ) : null}

            <div className="flex flex-col md:flex-row md:items-end gap-4">
                <label className="grid flex-1 gap-2 text-sm font-medium text-on-surface">
                    <span>Division format</span>
                    <SelectInput 
                        options={divisionOptions} 
                        value={String(data.group_count)} 
                        onChange={handleOptionChange} 
                        disabled={groupLocked}
                    />
                </label>
                <label className="grid w-32 shrink-0 gap-2 text-sm font-medium text-on-surface">
                    <span>Interval (min)</span>
                    <input 
                        type="number" 
                        min="0" 
                        value={data.interval} 
                        onChange={(e) => setData('interval', Number(e.target.value))}
                        className="rounded-lg border-0 bg-surface-container-low px-3 py-2 focus:ring-2 focus:ring-primary text-sm transition-colors text-on-surface h-[42px]"
                    />
                </label>
                <label className="grid w-36 shrink-0 gap-2 text-sm font-medium text-on-surface">
                    <span>Start time</span>
                    <input
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                        className="rounded-lg border-0 bg-surface-container-low px-3 py-2 focus:ring-2 focus:ring-primary text-sm transition-colors text-on-surface h-[42px]"
                    />
                </label>
                <button className="shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-container px-6 h-[42px] text-[0.8125rem] font-bold uppercase tracking-widest text-on-primary shadow-sm hover:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-50">
                    {groupLocked ? 'Save Schedule' : 'Generate Groups'}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        if (!groupLocked && window.confirm('Lock groups? After locking, group generation will no longer be available for this league.')) {
                            router.post(route('admin.leagues.groups.lock', leagueId), {}, { preserveScroll: true });
                        }
                    }}
                    disabled={groupLocked}
                    className="shrink-0 rounded-full border border-outline-variant/20 bg-surface-container-low px-6 h-[42px] text-[0.8125rem] font-bold uppercase tracking-widest text-on-surface transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {groupLocked ? 'Locked' : 'Lock'}
                </button>
            </div>

            <div className="border-t border-outline-variant pt-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">Group Matches Schedule</h4>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {Array.from({ length: rounds }).map((_, i) => (
                        <label key={i} className="grid gap-1">
                            <span className="text-xs font-medium text-on-surface">Round {i + 1}</span>
                            <DatePicker 
                                value={data.schedule[i]?.scheduled_at || ''} 
                                onChange={(val) => updateRoundSchedule(i, val)} 
                            />
                        </label>
                    ))}
                </div>
            </div>
        </form>
    );
}

function buildWeeklySchedule(rounds: number, baseDate?: string) {
    const start = baseDate ? new Date(baseDate) : new Date();

    if (Number.isNaN(start.getTime())) {
        start.setTime(Date.now());
    }

    return Array.from({ length: rounds }).map((_, i) => {
        const scheduledAt = new Date(start);
        scheduledAt.setDate(start.getDate() + i * 7);

        return {
            round: i + 1,
            scheduled_at: toDateInputValue(scheduledAt),
        };
    });
}

function toDateInputValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function combineDateAndTime(date: string, time: string) {
    return `${date}T${time || '00:00'}`;
}
