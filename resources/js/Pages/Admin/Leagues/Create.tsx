import AdminLayout from '@/Layouts/AdminLayout';
import DatePicker from '@/Components/DatePicker';
import SelectInput, { SelectOption } from '@/Components/SelectInput';
import { Branch, MatchFormatOption, Sport } from '@/types/jrclub';
import { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

const startStageOptions: SelectOption[] = [
    { value: 'group', label: 'Group Stage' },
    { value: 'bracket', label: 'Bracket' },
];

export default function Create({ sports, branches, matchFormats }: { sports: Sport[]; branches: Branch[]; matchFormats: MatchFormatOption[] }) {
    const { auth } = usePage<PageProps>().props;
    const initialSport = sports[0];
    const initialCategory = initialSport?.categories?.[0];
    const form = useForm<{
        name: string;
        sport_id: number | string;
        sport_category_id: string;
        description: string;
        start_date: string;
        status: string;
        start_stage: string;
        participant_total: string;
        sets_to_win: string;
        points_per_set: string;
        match_format: string;
        advance_upper_count: string;
        advance_lower_count: string;
        branch_id: string;
        banner: File | null;
    }>({
        name: '',
        sport_id: initialSport?.id ?? '',
        sport_category_id: initialCategory?.id ? String(initialCategory.id) : '',
        description: '',
        start_date: '',
        status: 'upcoming',
        start_stage: 'group',
        participant_total: '8',
        sets_to_win: '2',
        points_per_set: '21',
        match_format: '',
        advance_upper_count: '1',
        advance_lower_count: '1',
        branch_id: '',
        banner: null,
    });
    const sportOptions = sports.map((sport) => ({ value: String(sport.id), label: sport.name }));
    const selectedSport = useMemo(() => sports.find((sport) => sport.id === Number(form.data.sport_id)), [sports, form.data.sport_id]);
    const categoryOptions = (selectedSport?.categories ?? []).map((category) => ({ value: String(category.id), label: category.name }));
    const branchOptions = [{ value: '', label: 'National' }, ...branches.map((branch) => ({ value: String(branch.id), label: branch.name }))];
    const matchFormatOptions = [{ value: '', label: 'Custom / Badminton default' }, ...matchFormats.map((format) => ({ value: format.value, label: format.label }))];
    const selectedCategory = selectedSport?.categories?.find((category) => String(category.id) === form.data.sport_category_id);

    const handleSportChange = (value: string) => {
        const sport = sports.find((item) => item.id === Number(value));
        form.setData((data) => ({
            ...data,
            sport_id: Number(value || sports[0]?.id || 0),
            sport_category_id: sport?.categories?.[0]?.id ? String(sport.categories[0].id) : '',
        }));
    };

    const handleMatchFormatChange = (value: string) => {
        const format = matchFormats.find((item) => item.value === value);
        form.setData((data) => ({
            ...data,
            match_format: value,
            sets_to_win: format ? String(format.sets_to_win) : data.sets_to_win,
            points_per_set: format ? String(format.points_per_set) : data.points_per_set,
        }));
    };

    return (
            <AdminLayout 
            title="Create Tournament"
            actions={
                <button 
                    type="submit" 
                    form="create-league-form" 
                    disabled={form.processing}
                    className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                    Save Tournament
                </button>
            }
        >
            <Head title="Create Tournament" />
            
            <form id="create-league-form" onSubmit={(event) => { event.preventDefault(); form.post(route('admin.leagues.store'), { forceFormData: true }); }} className="space-y-6">
                
                {/* Section 1: General Info */}
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="bg-surface-container-low/30 px-6 py-4 border-b border-outline-variant/10">
                        <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary">General Information</h3>
                    </div>
                    <div className="p-6 grid gap-6 md:grid-cols-2">
                        <Field label="Tournament name" full>
                            <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface" placeholder="e.g. JR Sport Hub Championship 2026" />
                        </Field>
                        <Field label="Sport">
                            <div className="editorial-select-wrapper relative">
                                <SelectInput options={sportOptions} value={form.data.sport_id} onChange={handleSportChange} placeholder="Select sport" />
                            </div>
                        </Field>
                        <Field label="Category">
                            <div className="editorial-select-wrapper relative">
                                <SelectInput options={categoryOptions} value={form.data.sport_category_id} onChange={(value) => form.setData('sport_category_id', value || '')} placeholder={categoryOptions.length > 0 ? 'Select category' : 'No categories configured'} />
                            </div>
                            {selectedCategory ? <span className="mt-1 block text-xs text-on-surface-variant">{selectedCategory.player_count} player{selectedCategory.player_count > 1 ? 's' : ''} • {selectedCategory.entry_type}</span> : null}
                        </Field>
                        <Field label="Start from">
                            <div className="editorial-select-wrapper relative">
                                <SelectInput options={startStageOptions} value={form.data.start_stage} onChange={(value) => form.setData('start_stage', value || 'group')} placeholder="Select start stage" />
                            </div>
                        </Field>
                        {auth.isPusatAdmin ? (
                            <Field label="Branch">
                                <div className="editorial-select-wrapper relative">
                                    <SelectInput options={branchOptions} value={form.data.branch_id} onChange={(value) => form.setData('branch_id', value)} placeholder="Select branch" />
                                </div>
                            </Field>
                        ) : null}
                        <Field label="Description" full>
                            <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="w-full min-h-[120px] bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface resize-y" placeholder="Tournament details and rules..." />
                        </Field>
                        <Field label="Banner image" full>
                            <div className="flex flex-col gap-3">
                                {form.data.banner ? (
                                    <img src={URL.createObjectURL(form.data.banner)} alt="Banner preview" className="h-32 w-full rounded-lg object-cover" />
                                ) : null}
                                <label className="flex cursor-pointer items-center gap-3 rounded-t-md border-b-2 border-outline-variant/20 bg-surface-container-low px-4 py-3 transition-colors hover:bg-surface-container">
                                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">upload</span>
                                    <span className="text-sm text-on-surface-variant">{form.data.banner ? form.data.banner.name : 'Choose image file (max 5 MB)'}</span>
                                    <input type="file" accept="image/*" className="sr-only" onChange={(event) => form.setData('banner', event.target.files?.[0] ?? null)} />
                                </label>
                                {form.errors.banner ? <span className="text-xs font-medium text-error">{form.errors.banner}</span> : null}
                            </div>
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
                        <Field label="Match format">
                            <div className="editorial-select-wrapper relative">
                                <SelectInput options={matchFormatOptions} value={form.data.match_format} onChange={(value) => handleMatchFormatChange(value || '')} placeholder="Select format" />
                            </div>
                        </Field>
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
