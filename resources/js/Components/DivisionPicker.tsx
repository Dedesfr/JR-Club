import SelectInput from '@/Components/SelectInput';
import DatePicker from '@/Components/DatePicker';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function DivisionPicker({ leagueId, options }: { leagueId: number; options: { group_count: number; group_size: number }[] }) {
    const defaultOption = options[0];
    const initialRounds = defaultOption ? Math.max(1, defaultOption.group_size - 1) : 1;
    
    const [rounds, setRounds] = useState(initialRounds);

    const { data, setData, post } = useForm({
        group_count: defaultOption?.group_count ?? 2,
        interval: 15,
        schedule: Array.from({ length: initialRounds }).map((_, i) => ({
            round: i + 1,
            scheduled_at: new Date().toISOString().split('T')[0],
        })),
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
            const newRounds = Math.max(1, opt.group_size - 1);
            setRounds(newRounds);
            
            const currentSchedule = [...data.schedule];
            
            if (currentSchedule.length < newRounds) {
                while (currentSchedule.length < newRounds) {
                    currentSchedule.push({ 
                        round: currentSchedule.length + 1, 
                        scheduled_at: new Date().toISOString().split('T')[0] 
                    });
                }
            } else if (currentSchedule.length > newRounds) {
                currentSchedule.length = newRounds;
            }
            
            setData('schedule', currentSchedule);
        }
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                post(route('admin.leagues.groups.store', leagueId), { preserveScroll: true });
            }}
            className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]"
        >
            <div className="flex flex-col md:flex-row md:items-end gap-4">
                <label className="grid flex-1 gap-2 text-sm font-medium text-on-surface">
                    <span>Division format</span>
                    <SelectInput 
                        options={divisionOptions} 
                        value={String(data.group_count)} 
                        onChange={handleOptionChange} 
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
                <button className="shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-container px-6 h-[42px] text-[0.8125rem] font-bold uppercase tracking-widest text-on-primary shadow-sm hover:scale-[0.98] transition-all">
                    Generate Groups
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
                                enableTime={true}
                            />
                        </label>
                    ))}
                </div>
            </div>
        </form>
    );
}
