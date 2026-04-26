import BracketTree from '@/Components/BracketTree';
import DatePicker from '@/Components/DatePicker';
import DivisionPicker from '@/Components/DivisionPicker';
import EntryPicker from '@/Components/EntryPicker';
import GroupTable from '@/Components/GroupTable';
import SelectInput from '@/Components/SelectInput';
import SetScoreEntry from '@/Components/SetScoreEntry';
import SubstitutionModal from '@/Components/SubstitutionModal';
import PhotoUploader from '@/Components/PhotoUploader';
import ParticipantImportDialog from '@/Components/ParticipantImportDialog';
import EntryEditModal from '@/Components/EntryEditModal';
import AdminLayout from '@/Layouts/AdminLayout';
import { GameMatch, League, LeagueEntry, LeagueStandingGroup, Team } from '@/types/jrclub';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import SecondaryButton from '@/Components/SecondaryButton';
import ReactSelect, { MultiValue, StylesConfig } from 'react-select';

type UserOption = {
    id: number;
    name: string;
    gender?: string | null;
};

type MultiSelectOption = {
    value: string;
    label: string;
};

const selectStyles: StylesConfig<MultiSelectOption, true> = {
    control: (base, state) => ({
        ...base,
        minHeight: '46px',
        border: '0',
        borderBottom: '2px solid rgba(193, 198, 213, 0.2)',
        borderRadius: '0.375rem 0.375rem 0 0',
        backgroundColor: '#f2f4f6',
        boxShadow: state.isFocused ? '0 2px 0 0 #0056a4' : 'none',
        fontSize: '0.875rem',
    }),
    menu: (base) => ({ ...base, zIndex: 50 }),
};

const tabs = ['Overview', 'Participants', 'Groups', 'Bracket', 'Matches'] as const;
const categoryLabels: Record<string, string> = {
    MS: 'Single Putra',
    WS: 'Single Putri',
    MD: 'Ganda Putra',
    WD: 'Ganda Putri',
    XD: 'Ganda Campuran',
};
const statusOptions = ['upcoming', 'active', 'completed'].map((status) => ({ value: status, label: status }));
const startStageOptions = [
    { value: 'group', label: 'Group Stage' },
    { value: 'bracket', label: 'Bracket' },
];

export default function Show({ league, users, teams, divisionOptions, standings, upperBracket, lowerBracket }: { league: League; users: UserOption[]; teams: Team[]; divisionOptions: { group_count: number; group_size: number }[]; standings: LeagueStandingGroup[]; upperBracket: GameMatch[][]; lowerBracket: GameMatch[][] }) {
    const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Overview');
    const form = useForm({
        name: league.name,
        description: league.description ?? '',
        start_date: league.start_date,
        end_date: league.end_date ?? '',
        status: league.status,
        start_stage: league.start_stage ?? 'group',
        participant_total: league.participant_total?.toString() ?? '',
        sets_to_win: league.sets_to_win?.toString() ?? '2',
        points_per_set: league.points_per_set?.toString() ?? '21',
        advance_upper_count: league.advance_upper_count?.toString() ?? '0',
        advance_lower_count: league.advance_lower_count?.toString() ?? '0',
    });

    const [importModalOpen, setImportModalOpen] = useState(false);
    const [editEntry, setEditEntry] = useState<LeagueEntry | null>(null);
    const [subModalMatch, setSubModalMatch] = useState<GameMatch | null>(null);
    const [photoModalMatch, setPhotoModalMatch] = useState<GameMatch | null>(null);


    const startsFromBracket = (league.start_stage ?? 'group') === 'bracket';
    const usesDirectEntries = league.entry_type === 'single' || league.entry_type === 'double';
    const usesTeamEntries = league.entry_type === 'team';
    const usesTournamentEntries = usesDirectEntries || usesTeamEntries;
    const formatLabel = league.sport_category?.name ?? (league.category ? (categoryLabels[league.category] ?? league.category) : 'Team based');
    const bracketSeedSize = startsFromBracket ? (league.entries?.length || league.participant_total || 0) : (league.advance_upper_count ?? 0);
    const bracketForm = useForm({
        advance_upper_count: startsFromBracket ? String(bracketSeedSize) : (league.advance_upper_count?.toString() ?? '0'),
        advance_lower_count: startsFromBracket ? '0' : (league.advance_lower_count?.toString() ?? '0'),
        interval: 15,
        schedule: Array.from({
            length: Math.max(
                Math.ceil(Math.log2(Math.max(1, bracketSeedSize))),
                Math.ceil(Math.log2(Math.max(1, startsFromBracket ? 0 : (league.advance_lower_count ?? 0))))
            ) + 1
        }).map((_, i) => ({
            round: i + 1,
            scheduled_at: new Date().toISOString().split('T')[0],
        })),
    });

    const calculateBracketRounds = (upper: number, lower: number) => {
        const upperRounds = Math.ceil(Math.log2(Math.max(1, upper)));
        const lowerRounds = Math.ceil(Math.log2(Math.max(1, lower)));
        const maxMainRounds = Math.max(upperRounds, lowerRounds);
        return maxMainRounds > 0 ? maxMainRounds + 1 : 0; // +1 for the third place match round
    };

    const [bracketRoundsCount, setBracketRoundsCount] = useState(() =>
        calculateBracketRounds(Number(bracketForm.data.advance_upper_count), Number(bracketForm.data.advance_lower_count))
    );

    const handleBracketAdvanceChange = (field: 'advance_upper_count' | 'advance_lower_count', value: string) => {
        bracketForm.setData(field, value);

        const numValue = Number(value) || 0;
        const upper = field === 'advance_upper_count' ? numValue : (Number(bracketForm.data.advance_upper_count) || 0);
        const lower = field === 'advance_lower_count' ? numValue : (Number(bracketForm.data.advance_lower_count) || 0);

        const newRounds = calculateBracketRounds(upper, lower);
        setBracketRoundsCount(newRounds);

        const currentSchedule = [...bracketForm.data.schedule];
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

        bracketForm.setData('schedule', currentSchedule);
    };

    const updateBracketRoundSchedule = (index: number, dateStr: string) => {
        const newSchedule = [...bracketForm.data.schedule];
        if (newSchedule[index]) {
            newSchedule[index].scheduled_at = dateStr;
            bracketForm.setData('schedule', newSchedule);
        }
    };

    const groupedByStage = (league.matches ?? []).reduce((acc, match) => {
        const stage = match.stage ?? 'League Match';

        let key: string;
        if (['upper', 'lower', 'third_place', 'lower_third_place'].includes(stage)) {
            const bracketLabel = stage === 'third_place' ? 'Upper' : stage === 'lower_third_place' ? 'Lower' : stage.charAt(0).toUpperCase() + stage.slice(1);

            if (stage === 'third_place') {
                key = `${bracketLabel} Bracket > Third Place`;
            } else if (stage === 'lower_third_place') {
                key = `${bracketLabel} Bracket > Third Place`;
            } else {
                const bracketMatches = (league.matches ?? []).filter(m => m.stage === stage && m.round != null);
                const maxRound = bracketMatches.length > 0 ? Math.max(...bracketMatches.map(m => m.round as number)) : 0;
                if (match.round === maxRound) {
                    key = `${bracketLabel} Bracket > Final`;
                } else if (match.round === maxRound - 1) {
                    key = `${bracketLabel} Bracket > Semifinal`;
                } else {
                    key = `${bracketLabel} Bracket > Group`;
                }
            }
        } else {
            key = stage;
        }

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(match);
        return acc;
    }, {} as Record<string, GameMatch[]>);

    const stageOrder = ['Group', 'League Match', 'Upper Bracket > Group', 'Upper Bracket > Semifinal', 'Upper Bracket > Final', 'Upper Bracket > Third Place', 'Lower Bracket > Group', 'Lower Bracket > Semifinal', 'Lower Bracket > Final', 'Lower Bracket > Third Place'];
    const sortedByStage = Object.entries(groupedByStage).sort(([a], [b]) => {
        const idxA = stageOrder.indexOf(a);
        const idxB = stageOrder.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    });

    const stageFilters = useMemo(() => {
        const filters = new Set<string>();
        for (const [stage] of sortedByStage) {
            if (stage.includes('Upper Bracket')) filters.add('Upper Bracket');
            else if (stage.includes('Lower Bracket')) filters.add('Lower Bracket');
            else filters.add(stage);
        }
        return ['all', ...Array.from(filters)];
    }, [sortedByStage]);

    const [matchFilter, setMatchFilter] = useState<string>('all');

    const filteredByStage = useMemo(() => {
        if (matchFilter === 'all') return sortedByStage;
        return sortedByStage.filter(([stage]) => {
            if (matchFilter === 'Upper Bracket') return stage.includes('Upper Bracket');
            if (matchFilter === 'Lower Bracket') return stage.includes('Lower Bracket');
            return stage === matchFilter;
        });
    }, [sortedByStage, matchFilter]);

    const groupMatchesByDate = (matches: GameMatch[]) => {
        return matches.reduce((acc, match) => {
            const date = match.scheduled_at ? new Date(match.scheduled_at).toDateString() : 'TBA';
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(match);
            return acc;
        }, {} as Record<string, GameMatch[]>);
    };

    const sortByDate = (entries: [string, GameMatch[]][]) => {
        return entries.sort(([dateA], [dateB]) => {
            if (dateA === 'TBA') return 1;
            if (dateB === 'TBA') return -1;
            return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
    };

    return (
        <AdminLayout title={league.name}>
            <Head title={league.name} />

            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                <div className="mb-6 flex shrink-0 flex-wrap gap-2 lg:mb-0 lg:w-56 lg:flex-col">
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors lg:rounded-xl lg:py-3 lg:text-left lg:text-sm lg:tracking-tight ${activeTab === tab ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 min-w-0">
                    {activeTab === 'Overview' ? (
                        <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.leagues.update', league.id)); }} className="grid gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2">
                            <Field label="Name"><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface" /></Field>
                            <Field label="Status"><SelectInput options={statusOptions} value={form.data.status} onChange={(value) => form.setData('status', value)} /></Field>
                            <Field label="Start from"><SelectInput options={startStageOptions} value={form.data.start_stage} onChange={(value) => form.setData('start_stage', value === 'bracket' ? 'bracket' : 'group')} /></Field>
                            <Field label="Start date"><DatePicker value={form.data.start_date} onChange={(value) => form.setData('start_date', value)} /></Field>
                            <Field label="End date"><DatePicker value={form.data.end_date} onChange={(value) => form.setData('end_date', value)} /></Field>
                            <Field label="Participant total"><input type="number" min={2} value={form.data.participant_total} onChange={(event) => form.setData('participant_total', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface" /></Field>
                            <Field label="Format"><div className="w-full border-0 border-b-2 border-outline-variant/10 rounded-t-md bg-surface-container-lowest px-3 py-2.5 text-sm font-bold text-on-surface-variant">{`${formatLabel} • ${league.entry_type ?? 'team'}`}</div></Field>
                            <Field label="Description" full><textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="w-full min-h-[120px] bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface resize-y" /></Field>
                            <div className="md:col-span-2 flex justify-between gap-3 pt-2">
                                <button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all disabled:opacity-50" disabled={form.processing}>Save Changes</button>
                                <Link href={route('leagues.show', league.id)} className="rounded-full bg-surface-container-low border border-outline-variant/20 px-6 py-2 text-[0.875rem] font-bold text-on-surface hover:bg-surface-container transition-colors">Public View</Link>
                            </div>
                        </form>
                    ) : null}

                    {activeTab === 'Participants' ? (
                        <div className="grid gap-4">
                            {usesDirectEntries && league.category ? (
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <div className="flex-1 w-full">
                                        <EntryPicker leagueId={league.id} users={users} category={league.category} entryType={league.entry_type} />
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0 self-stretch justify-end">
                                        <SecondaryButton onClick={() => setImportModalOpen(true)} className="!py-2 !px-4 text-xs">
                                            Import / Export
                                        </SecondaryButton>
                                    </div>
                                </div>
                            ) : <TeamParticipants league={league} users={users} />}
                            {usesDirectEntries ? <EntryList league={league} onEdit={setEditEntry} /> : null}
                        </div>
                    ) : null}

                    {activeTab === 'Groups' ? (
                        <div className="grid gap-4">
                            {startsFromBracket ? (
                                <EmptyState text="This league starts from the bracket, so group generation is skipped. Complete participants, then seed brackets from the Bracket tab." />
                            ) : (
                                <>
                                    {divisionOptions.length > 0 ? <DivisionPicker leagueId={league.id} options={divisionOptions} startDate={league.start_date} /> : null}
                                    {standings.length > 0 ? <GroupTable leagueId={league.id} standings={standings} /> : <EmptyState text="Generate groups after the entry list reaches the participant total." />}
                                </>
                            )}
                        </div>
                    ) : null}

                    {activeTab === 'Bracket' ? (
                        <div className="grid gap-4">
                            {usesTournamentEntries ? (
                                <>
                                    <form onSubmit={(event) => { event.preventDefault(); bracketForm.post(route('admin.leagues.brackets.store', league.id), { preserveScroll: true }); }} className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                                        <div className="flex flex-col md:flex-row gap-4 md:items-end">
                                            <Field label="Upper advances">
                                                <input type="number" min={0} value={bracketForm.data.advance_upper_count} onChange={(event) => handleBracketAdvanceChange('advance_upper_count', event.target.value)} className="w-full md:w-32 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface text-sm" />
                                            </Field>
                                            <Field label="Lower advances">
                                                <input type="number" min={0} value={bracketForm.data.advance_lower_count} onChange={(event) => handleBracketAdvanceChange('advance_lower_count', event.target.value)} className="w-full md:w-32 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface text-sm" />
                                            </Field>
                                            <Field label="Interval (min)">
                                                <input type="number" min={0} value={bracketForm.data.interval} onChange={(event) => bracketForm.setData('interval', Number(event.target.value))} className="w-full md:w-24 bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface text-sm" />
                                            </Field>
                                            <button className="shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2 h-[42px] text-[0.8125rem] font-bold uppercase tracking-widest text-on-primary shadow-sm hover:scale-[0.98] transition-all">
                                                Seed Brackets
                                            </button>
                                        </div>

                                        {bracketRoundsCount > 0 && (
                                            <div className="border-t border-outline-variant pt-4 mt-2">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">Bracket Matches Schedule</h4>
                                                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                                                    {Array.from({ length: bracketRoundsCount }).map((_, i) => (
                                                        <label key={i} className="grid gap-1">
                                                            <span className="text-xs font-medium text-on-surface">
                                                                {i === bracketRoundsCount - 2 ? 'Final' : i === bracketRoundsCount - 1 ? 'Third Place' : `Round ${i + 1}`}
                                                            </span>
                                                            <DatePicker
                                                                value={bracketForm.data.schedule[i]?.scheduled_at || ''}
                                                                onChange={(val) => updateBracketRoundSchedule(i, val)}
                                                                enableTime={true}
                                                            />
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                    {upperBracket.length > 0 ? <BracketTree league={league} title="Upper Bracket" rounds={upperBracket} champion={league.upper_champion} thirdPlaceMatch={league.third_place_match} /> : <EmptyState text={startsFromBracket ? "Complete participants, then seed brackets to create manual assignment slots." : "Seed brackets after group standings are ready."} />}
                                    {lowerBracket.length > 0 ? <BracketTree league={league} title="Lower Bracket" rounds={lowerBracket} champion={league.lower_champion} thirdPlaceMatch={league.lower_third_place_match} /> : null}
                                </>
                            ) : (
                                <EmptyState text="This league category does not use tournament brackets." />
                            )}
                        </div>
                    ) : null}

                    {activeTab === 'Matches' ? (
                        <div className="grid gap-6">
                            {/* Stage Filter Chips */}
                            {stageFilters.length > 1 && (
                                <div className="flex flex-wrap gap-2">
                                    {stageFilters.map((filter) => (
                                        <button key={filter} onClick={() => setMatchFilter(filter)} className={`whitespace-nowrap px-5 py-2 rounded-full text-[0.875rem] font-semibold transition-colors ${matchFilter === filter ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20 shadow-[0px_4px_12px_rgba(15,23,42,0.03)] hover:bg-surface-container-high'}`}>
                                            {filter === 'all' ? 'All Stages' : filter.replace(/\b\w/g, (m: string) => m.toUpperCase())}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {filteredByStage.map(([stage, matches]) => {
                                const activeCount = matches.filter(m => m.status === 'active').length;
                                const completedCount = matches.filter(m => m.status === 'completed').length;
                                const matchCount = matches.length;

                                const groupedByDate = groupMatchesByDate(matches);
                                const sortedDates = sortByDate(Object.entries(groupedByDate));

                                return (
                                    <div key={stage} className="grid gap-4">
                                        {/* Stage Header */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-[1.5rem] font-bold tracking-tight text-on-surface">
                                                    {stage.includes('>') ? (
                                                        <>
                                                            {stage.split(' > ')[0]} <span className="text-outline-variant">›</span> {stage.split(' > ')[1]}
                                                        </>
                                                    ) : stage}
                                                </h3>
                                                <p className="text-xs text-on-surface-variant font-medium mt-0.5">{matchCount} match{matchCount !== 1 ? 'es' : ''} • {completedCount} completed</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {activeCount > 0 && <span className="px-2.5 py-1 rounded-full bg-error-container text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-error-container">{activeCount} live</span>}
                                            </div>
                                        </div>

                                        {/* Date Groups within Stage */}
                                        {sortedDates.map(([dateKey, dateMatches]) => {
                                            const dateActiveCount = dateMatches.filter(m => m.status === 'active').length;

                                            const formatDateHeader = (date: string) => {
                                                if (date === 'TBA') return { label: 'TBA', isPrimary: false };
                                                const d = new Date(date);
                                                const today = new Date();
                                                const tomorrow = new Date(today);
                                                tomorrow.setDate(tomorrow.getDate() + 1);
                                                
                                                if (d.toDateString() === today.toDateString()) {
                                                    return { label: `Today, ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, isPrimary: true };
                                                } else if (d.toDateString() === tomorrow.toDateString()) {
                                                    return { label: `Tomorrow, ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, isPrimary: false };
                                                }
                                                return { label: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }), isPrimary: false };
                                            };

                                            const dateInfo = formatDateHeader(dateKey);

                                            return (
                                                <div key={dateKey} className="grid gap-2">
                                                    {/* Date Header */}
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[0.6875rem] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded ${dateInfo.isPrimary ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant'}`}>
                                                            {dateInfo.label}
                                                        </span>
                                                        {dateActiveCount > 0 && <span className="px-2 py-0.5 rounded bg-error-container text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-error-container">{dateActiveCount} live</span>}
                                                    </div>

                                                    {/* Section: Desktop Match Rows - Compact */}
                                                    <div className="hidden lg:flex flex-col gap-2">
                                                        {dateMatches.map((match) => {
                                                            const isLive = match.status === 'active';
                                                            const isUpcoming = match.status === 'upcoming';

                                                            return (
                                                                <div key={match.id} className={`flex items-center bg-surface-container-lowest rounded-xl py-2.5 px-3 shadow-[0px_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0px_8px_24px_rgba(15,23,42,0.06)] transition-all border border-outline-variant/20 ${isLive ? 'border-l-4 border-l-error' : ''} ${isUpcoming ? 'opacity-70' : ''}`}>
                                                                    {/* Time & Status */}
                                                                    <div className="w-28 shrink-0 flex flex-col gap-1">
                                                                        <span className="text-[0.6875rem] font-medium text-on-surface-variant leading-tight">
                                                                            {match.scheduled_at ? new Date(match.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                                                                        </span>
                                                                        <span className={`inline-block w-fit px-1.5 py-0.5 rounded text-[0.6875rem] font-bold uppercase tracking-[0.05em] ${isLive ? 'bg-error-container text-on-error-container animate-pulse' : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant'}`}>
                                                                            {isLive ? 'Live' : match.status}
                                                                        </span>
                                                                    </div>

                                                                    {/* Home Player */}
                                                                    <div className="flex-1 text-right pr-3">
                                                                        <span className={`font-semibold text-sm leading-tight block ${isUpcoming ? 'text-on-surface-variant' : 'text-on-surface'}`}>{match.home_label ?? 'TBC'}</span>
                                                                    </div>

                                                                    {/* Score - Compact inline */}
                                                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded shrink-0 ${isLive ? 'bg-primary text-on-primary' : isUpcoming ? 'bg-surface-container-low border border-outline-variant/20 text-on-surface-variant' : 'bg-surface-container text-on-surface'}`}>
                                                                        <span className="text-lg font-black tracking-[-0.02em] leading-none">{isUpcoming ? '-' : match.home_score}</span>
                                                                        <span className={`font-bold text-sm leading-none ${isLive ? 'text-on-primary/60' : 'text-outline-variant'}`}>-</span>
                                                                        <span className="text-lg font-black tracking-[-0.02em] leading-none">{isUpcoming ? '-' : match.away_score}</span>
                                                                    </div>

                                                                    {/* Away Player */}
                                                                    <div className="flex-1 text-left pl-3">
                                                                        <span className={`font-semibold text-sm leading-tight block ${isUpcoming ? 'text-on-surface-variant' : 'text-on-surface'}`}>{match.away_label ?? 'TBC'}</span>
                                                                    </div>

                                                                    {/* Sets - inline */}
                                                                    <div className="flex gap-1 px-2 shrink-0">
                                                                        {(match.sets ?? []).length > 0 ? (
                                                                            match.sets?.map((set) => (
                                                                                <span key={set.id} className="rounded bg-surface-container border border-outline-variant/20 px-1.5 py-0.5 text-[0.6875rem] font-bold text-on-surface-variant">{set.home_points}-{set.away_points}</span>
                                                                            ))
                                                                        ) : (
                                                                            <span className="text-[0.6875rem] text-outline-variant italic">No sets</span>
                                                                        )}
                                                                    </div>

                                                                    {/* Actions */}
                                                                    <div className="flex items-center gap-1 shrink-0">
                                                                        <button type="button" onClick={() => setSubModalMatch(match)} className="rounded border border-outline-variant/20 px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary hover:bg-surface-container hover:text-primary transition-colors">Sub</button>
                                                                        <button type="button" onClick={() => setPhotoModalMatch(match)} className="rounded border border-outline-variant/20 px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary hover:bg-surface-container hover:text-primary transition-colors">Pics</button>
                                                                        {usesTournamentEntries ? (
                                                                            <SetScoreEntry matchId={match.id} label="+ Set" homeLabel={match.home_label} awayLabel={match.away_label} />
                                                                        ) : (
                                                                            <Link href={route('matches.show', match.id)} className="rounded-full bg-primary text-on-primary px-3 py-1 text-[0.6875rem] font-bold shadow-[0px_4px_8px_rgba(0,86,164,0.15)] hover:scale-[0.98] transition-all">Open</Link>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Section: Mobile Match Cards - Compact */}
                                                    <div className="grid gap-2 lg:hidden">
                                                        {dateMatches.map((match) => {
                                                            const isLive = match.status === 'active';
                                                            const isUpcoming = match.status === 'upcoming';

                                                            return (
                                                                <div key={match.id} className={`bg-surface-container-lowest rounded-xl p-3 shadow-[0px_4px_12px_rgba(15,23,42,0.02)] border border-outline-variant/20 ${isLive ? 'border-l-4 border-l-error' : ''} ${isUpcoming ? 'opacity-70' : ''}`}>
                                                                    {/* Top: Time + Status + Actions */}
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[0.6875rem] font-medium text-on-surface-variant">
                                                                                {match.scheduled_at ? new Date(match.scheduled_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'TBA'}
                                                                            </span>
                                                                            <span className={`inline-block w-fit px-1.5 py-0.5 rounded text-[0.6875rem] font-bold uppercase tracking-[0.05em] ${isLive ? 'bg-error-container text-on-error-container animate-pulse' : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant'}`}>
                                                                                {isLive ? 'Live' : match.status}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex gap-1">
                                                                            <button type="button" onClick={() => setSubModalMatch(match)} className="rounded border border-outline-variant/20 px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary hover:bg-surface-container transition-colors">Sub</button>
                                                                            <button type="button" onClick={() => setPhotoModalMatch(match)} className="rounded border border-outline-variant/20 px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary hover:bg-surface-container transition-colors">Pics</button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Middle: Matchup + Score */}
                                                                    <div className="flex items-center justify-between gap-2 mb-3">
                                                                        <div className="flex-1 text-right">
                                                                            <span className={`font-semibold text-sm leading-tight block ${isUpcoming ? 'text-on-surface-variant' : 'text-on-surface'}`}>{match.home_label ?? 'TBC'}</span>
                                                                            <span className={`font-semibold text-sm leading-tight block ${isUpcoming ? 'text-on-surface-variant' : 'text-on-surface'}`}>{match.away_label ?? 'TBC'}</span>
                                                                        </div>
                                                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${isLive ? 'bg-primary text-on-primary' : isUpcoming ? 'bg-surface-container-low border border-outline-variant/20 text-on-surface-variant' : 'bg-surface-container text-on-surface'}`}>
                                                                            <span className="text-xl font-black tracking-[-0.02em] leading-none">{isUpcoming ? '-' : match.home_score}</span>
                                                                            <span className={`font-bold text-sm leading-none ${isLive ? 'text-on-primary/60' : 'text-outline-variant'}`}>-</span>
                                                                            <span className="text-xl font-black tracking-[-0.02em] leading-none">{isUpcoming ? '-' : match.away_score}</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Sets */}
                                                                    {(match.sets ?? []).length > 0 && (
                                                                        <div className="flex flex-wrap gap-1 border-t border-outline-variant/10 pt-2 mb-3">
                                                                            {match.sets?.map((set) => (
                                                                                <span key={set.id} className="rounded bg-surface-container border border-outline-variant/20 px-2 py-0.5 text-[0.6875rem] font-bold text-on-surface-variant">
                                                                                    {set.home_points}-{set.away_points}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {/* Bottom: Action */}
                                                                    <div className="flex items-center justify-center pt-2 border-t border-outline-variant/10">
                                                                        {usesTournamentEntries ? (
                                                                            <SetScoreEntry matchId={match.id} label="Record Set" homeLabel={match.home_label} awayLabel={match.away_label} />
                                                                        ) : (
                                                                            <Link href={route('matches.show', match.id)} className="rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 text-[0.875rem] font-bold uppercase tracking-widest shadow-[0px_4px_8px_rgba(0,86,164,0.15)] hover:scale-[0.98] transition-all">Open</Link>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* End of Stage */}
                                        </div>
                                    );
                                })}
                            {filteredByStage.length === 0 && (
                                <div className="bg-surface-container-lowest rounded-xl p-10 text-center shadow-[0px_12px_32px_rgba(15,23,42,0.04)] border border-outline-variant/20">
                                    <span className="material-symbols-outlined text-4xl text-outline-variant/50 mb-3 block">sport_tennis</span>
                                    <p className="text-sm font-bold text-on-surface-variant">No matches generated yet.</p>
                                    <p className="text-xs text-on-surface-variant/70 mt-1">Seed groups or brackets to create fixtures.</p>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>

            {importModalOpen && (
                <ParticipantImportDialog league={league} onClose={() => setImportModalOpen(false)} />
            )}

            {editEntry && (
                <EntryEditModal league={league} entry={editEntry} users={users} onClose={() => setEditEntry(null)} />
            )}

            {subModalMatch && (
                <SubstitutionModal match={subModalMatch} onClose={() => setSubModalMatch(null)} />
            )}

            {photoModalMatch && (
                <PhotoUploader match={photoModalMatch} onClose={() => setPhotoModalMatch(null)} />
            )}
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

function EmptyState({ text }: { text: string }) {
    return <div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-on-surface-variant shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">{text}</div>;
}

function EntryList({ league, onEdit }: { league: League; onEdit: (entry: LeagueEntry) => void }) {
    return (
        <>
            <div className="hidden lg:block overflow-auto max-h-[500px] rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)] ring-1 ring-outline-variant/10">
                <table className="w-full text-left text-sm relative">
                    <thead className="sticky top-0 z-10 bg-[#f2f4f6] shadow-[0_1px_3px_rgba(15,23,42,0.06)] text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                        <tr>
                            <th className="px-4 py-3 w-16">Picture</th>
                            <th className="px-4 py-3">Group</th>
                            <th className="px-4 py-3">Players</th>
                            <th className="px-4 py-3">Substitutes</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                        {(league.entries ?? []).map((entry) => (
                            <tr key={entry.id} className="hover:bg-surface-container-lowest/50">
                                <td className="px-4 py-3">
                                    {entry.group_picture_path ? <img src={`/storage/${entry.group_picture_path}`} alt={entry.label} className="h-10 w-10 rounded-full object-cover bg-surface-container" /> : <div className="h-10 w-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-xs font-bold shrink-0">{entry.label.substring(0, 2).toUpperCase()}</div>}
                                </td>
                                <td className="px-4 py-3 font-bold text-on-surface">{entry.label}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{entry.group_name ? [entry.player1?.name, entry.player2?.name].filter(Boolean).join(' / ') : '-'}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{(entry.substitutes ?? []).length > 0 ? entry.substitutes?.map((sub) => sub.name).join(', ') : '-'}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => onEdit(entry)} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-colors">Edit</button>
                                        <button onClick={() => router.delete(route('admin.leagues.entries.destroy', [league.id, entry.id]), { preserveScroll: true })} className="rounded-full bg-error/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-error hover:bg-error hover:text-white transition-colors">Remove</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="grid gap-3 lg:hidden overflow-y-auto max-h-[500px] pr-1 pb-1">
                {(league.entries ?? []).map((entry) => (
                    <div key={entry.id} className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            {entry.group_picture_path ? <img src={`/storage/${entry.group_picture_path}`} alt={entry.label} className="h-12 w-12 rounded-full object-cover bg-surface-container shrink-0" /> : <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-sm font-bold shrink-0">{entry.label.substring(0, 2).toUpperCase()}</div>}
                            <div>
                                <p className="font-bold text-on-surface">{entry.label}</p>
                                {entry.group_name ? <p className="text-sm text-on-surface-variant">{[entry.player1?.name, entry.player2?.name].filter(Boolean).join(' / ')}</p> : null}
                                {(entry.substitutes ?? []).length > 0 ? <p className="text-xs text-on-surface-variant">Substitutes: {entry.substitutes?.map((substitute) => substitute.name).join(', ')}</p> : null}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onEdit(entry)} className="rounded-full bg-primary/10 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-colors">Edit</button>
                            <button onClick={() => router.delete(route('admin.leagues.entries.destroy', [league.id, entry.id]), { preserveScroll: true })} className="rounded-full bg-error/10 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-widest text-error hover:bg-error hover:text-white transition-colors">Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

function TeamParticipants({ league, users }: { league: League; users: UserOption[] }) {
    const requiredPlayers = league.sport_category?.player_count ?? league.sport?.max_players_per_team ?? 1;
    const form = useForm({ name: '', player_ids: Array.from({ length: requiredPlayers }).map(() => ''), substitute_ids: [] as string[] });
    const userOptions = users.map((user) => ({ value: String(user.id), label: `${user.name}${user.gender ? ` (${user.gender})` : ''}` }));
    const selectedPlayerIds = form.data.player_ids.filter(Boolean);
    const substituteOptions = userOptions.filter((option) => !selectedPlayerIds.includes(option.value));

    const setPlayer = (index: number, value: string) => {
        const playerIds = [...form.data.player_ids];
        playerIds[index] = value;
        form.setData('player_ids', playerIds);
    };

    return (
        <div className="grid gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <form onSubmit={(event) => { event.preventDefault(); form.post(route('admin.leagues.teams.store', league.id), { preserveScroll: true, onSuccess: () => form.reset() }); }} className="flex-1 rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                    <div className="grid gap-4 md:grid-cols-4 md:items-end">
                    <Field label="Group name" full>
                        <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface text-sm" placeholder="e.g. Garuda Court" />
                    </Field>
                    {Array.from({ length: requiredPlayers }).map((_, index) => {
                        const takenIds = form.data.player_ids.filter((_, playerIndex) => playerIndex !== index);
                        const options = userOptions.filter((option) => !takenIds.includes(option.value));

                        return (
                            <Field key={index} label={`Player ${index + 1}`}>
                                <SelectInput options={options} value={form.data.player_ids[index] ?? ''} onChange={(value) => setPlayer(index, value || '')} placeholder="Select user" />
                            </Field>
                        );
                    })}
                    <label className="block">
                        <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Substitutes</span>
                        <ReactSelect<MultiSelectOption, true>
                            isMulti
                            options={substituteOptions}
                            value={substituteOptions.filter((option) => form.data.substitute_ids.includes(option.value))}
                            onChange={(selected: MultiValue<MultiSelectOption>) => form.setData('substitute_ids', selected.map((option) => option.value))}
                            placeholder="Search substitutes"
                            styles={selectStyles}
                        />
                    </label>
                    <div className="flex justify-end md:justify-start">
                        <button disabled={form.processing || !form.data.name || form.data.player_ids.filter(Boolean).length !== requiredPlayers} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] disabled:opacity-50 h-[46px] w-full md:w-auto">Add Entry</button>
                    </div>
                    </div>
                    {Object.values(form.errors).length > 0 ? <p className="text-sm font-medium text-error mt-3">{Object.values(form.errors)[0]}</p> : null}
                </form>
            </div>

            <div className="hidden lg:block overflow-auto max-h-[500px] rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)] ring-1 ring-outline-variant/10">
                <table className="w-full text-left text-sm relative">
                    <thead className="sticky top-0 z-10 bg-[#f2f4f6] shadow-[0_1px_3px_rgba(15,23,42,0.06)] text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                        <tr>
                            <th className="px-4 py-3 w-16">Picture</th>
                            <th className="px-4 py-3">Group</th>
                            <th className="px-4 py-3">Players</th>
                            <th className="px-4 py-3">Substitutes</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                        {(league.teams ?? []).map((team) => {
                            const members = team.members ?? [];
                            const players = members.filter((member) => member.pivot?.role !== 'substitute');
                            const substitutes = members.filter((member) => member.pivot?.role === 'substitute');

                            return (
                                <tr key={team.id} className="hover:bg-surface-container-lowest/50">
                                    <td className="px-4 py-3"><div className="h-10 w-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-xs font-bold shrink-0">{team.name.substring(0, 2).toUpperCase()}</div></td>
                                    <td className="px-4 py-3 font-bold text-on-surface">{team.name}</td>
                                    <td className="px-4 py-3 text-on-surface-variant">{players.length > 0 ? players.map((member) => member.name).join(' / ') : '-'}</td>
                                    <td className="px-4 py-3 text-on-surface-variant">{substitutes.length > 0 ? substitutes.map((member) => member.name).join(', ') : '-'}</td>
                                    <td className="px-4 py-3 text-right"><button onClick={() => router.delete(route('admin.leagues.teams.destroy', [league.id, team.id]), { preserveScroll: true })} className="rounded-full bg-error/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-error hover:bg-error hover:text-white transition-colors">Remove</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="grid gap-3 lg:hidden overflow-y-auto max-h-[500px] pr-1 pb-1">
                {(league.teams ?? []).map((team) => {
                    const members = team.members ?? [];
                    const players = members.filter((member) => member.pivot?.role !== 'substitute');
                    const substitutes = members.filter((member) => member.pivot?.role === 'substitute');

                    return (
                        <div key={team.id} className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-sm font-bold shrink-0">{team.name.substring(0, 2).toUpperCase()}</div>
                                <div>
                                    <p className="font-bold text-on-surface">{team.name}</p>
                                    <p className="text-sm text-on-surface-variant">{players.map((member) => member.name).join(' / ') || '-'}</p>
                                    {substitutes.length > 0 ? <p className="text-xs text-on-surface-variant">Substitutes: {substitutes.map((member) => member.name).join(', ')}</p> : null}
                                </div>
                            </div>
                            <button onClick={() => router.delete(route('admin.leagues.teams.destroy', [league.id, team.id]), { preserveScroll: true })} className="rounded-full bg-error/10 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-widest text-error hover:bg-error hover:text-white transition-colors">Remove</button>
                        </div>
                    );
                })}
                {(league.teams ?? []).length === 0 ? <EmptyState text="No teams registered yet. Add an entry to set up participants for this league." /> : null}
            </div>
        </div>
    );
}

function TeamBasedState({ league }: { league: League }) {
    return (
        <div className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 text-sm text-on-surface-variant shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <div>
                <p className="font-bold text-on-surface">Team-based category</p>
                <p className="mt-1">{league.category ?? 'This category'} uses registered teams instead of direct-entry groups. Group generation is only available for single/double direct-entry categories.</p>
            </div>
            {(league.teams ?? []).length > 0 ? (
                <div className="grid gap-2 md:grid-cols-2">
                    {league.teams?.map((team) => (
                        <div key={team.id} className="rounded-lg bg-surface-container-low px-4 py-3">
                            <p className="font-bold text-on-surface">{team.name}</p>
                            <p className="text-xs uppercase tracking-widest text-on-surface-variant">Registered team</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="rounded-lg bg-surface-container-low px-4 py-3">No teams registered yet.</p>
            )}
        </div>
    );
}
