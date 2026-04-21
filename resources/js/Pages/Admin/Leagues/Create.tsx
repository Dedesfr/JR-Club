import AdminLayout from '@/Layouts/AdminLayout';
import DatePicker from '@/Components/DatePicker';
import SelectInput, { SelectOption } from '@/Components/SelectInput';
import { Sport } from '@/types/jrclub';
import { Head, useForm } from '@inertiajs/react';

const categoryOptions: SelectOption[] = [
    { value: 'MS', label: 'Single Putra' },
    { value: 'WS', label: 'Single Putri' },
    { value: 'MD', label: 'Ganda Putra' },
    { value: 'WD', label: 'Ganda Putri' },
    { value: 'XD', label: 'Ganda Campuran' },
];

export default function Create({ sports }: { sports: Sport[] }) {
    const form = useForm({
        name: '',
        sport_id: sports[0]?.id ?? '',
        category: 'MS',
        description: '',
        start_date: '',
        end_date: '',
        status: 'upcoming',
        participant_total: '8',
        sets_to_win: '2',
        points_per_set: '21',
        advance_upper_count: '1',
        advance_lower_count: '1',
    });
    const sportOptions = sports.map((sport) => ({ value: String(sport.id), label: sport.name }));

    return (
        <AdminLayout 
            title="Create League"
            actions={
                <button 
                    type="submit" 
                    form="create-league-form" 
                    disabled={form.processing}
                    className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                    Save League
                </button>
            }
        >
            <Head title="Create League" />
            
            <form id="create-league-form" onSubmit={(event) => { event.preventDefault(); form.post(route('admin.leagues.store')); }} className="space-y-6">
                
                {/* Section 1: General Info */}
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="bg-surface-container-low/30 px-6 py-4 border-b border-outline-variant/10">
                        <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary">General Information</h3>
                    </div>
                    <div className="p-6 grid gap-6 md:grid-cols-2">
                        <Field label="League name" full>
                            <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface" placeholder="e.g. JR Club Championship 2026" />
                        </Field>
                        <Field label="Sport">
                            <div className="editorial-select-wrapper relative">
                                <SelectInput options={sportOptions} value={form.data.sport_id} onChange={(value) => form.setData('sport_id', Number(value || sports[0]?.id || 0))} placeholder="Select sport" />
                            </div>
                        </Field>
                        <Field label="Category">
                            <div className="editorial-select-wrapper relative">
                                <SelectInput options={categoryOptions} value={form.data.category} onChange={(value) => form.setData('category', value || 'MS')} placeholder="Select category" />
                            </div>
                        </Field>
                        <Field label="Description" full>
                            <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="w-full min-h-[120px] bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface resize-y" placeholder="League details and rules..." />
                        </Field>
                    </div>
                </div>

                {/* Section 2: Schedule & Participants */}
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="bg-surface-container-low/30 px-6 py-4 border-b border-outline-variant/10">
                        <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary">Schedule & Participants</h3>
                    </div>
                    <div className="p-6 grid gap-6 md:grid-cols-3">
                        <Field label="Start date">
                            <DatePicker value={form.data.start_date} onChange={(value) => form.setData('start_date', value)} />
                        </Field>
                        <Field label="End date">
                            <DatePicker value={form.data.end_date} onChange={(value) => form.setData('end_date', value)} />
                        </Field>
                        <Field label="Participant total">
                            <input type="number" min={2} value={form.data.participant_total} onChange={(event) => form.setData('participant_total', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface" />
                        </Field>
                    </div>
                </div>

                {/* Section 3: Match Rules */}
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="bg-surface-container-low/30 px-6 py-4 border-b border-outline-variant/10">
                        <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary">Match Rules & Advancement</h3>
                    </div>
                    <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Field label="Sets to win">
                            <input type="number" min={1} value={form.data.sets_to_win} onChange={(event) => form.setData('sets_to_win', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface" />
                        </Field>
                        <Field label="Points per set">
                            <input type="number" min={1} value={form.data.points_per_set} onChange={(event) => form.setData('points_per_set', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface" />
                        </Field>
                        <Field label="Upper advances">
                            <input type="number" min={0} value={form.data.advance_upper_count} onChange={(event) => form.setData('advance_upper_count', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface" />
                        </Field>
                        <Field label="Lower advances">
                            <input type="number" min={0} value={form.data.advance_lower_count} onChange={(event) => form.setData('advance_lower_count', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface" />
                        </Field>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
    return (
        <label className={`block ${full ? 'md:col-span-2' : ''}`}>
            <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</span>
            {children}
        </label>
    );
}
