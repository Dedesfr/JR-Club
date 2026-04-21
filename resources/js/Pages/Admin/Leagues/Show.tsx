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
import { GameMatch, League, LeagueEntry, LeagueStandingGroup } from '@/types/jrclub';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import SecondaryButton from '@/Components/SecondaryButton';

const tabs = ['Overview', 'Participants', 'Groups', 'Bracket', 'Matches'] as const;
const categoryLabels: Record<NonNullable<League['category']>, string> = {
    MS: 'Single Putra',
    WS: 'Single Putri',
    MD: 'Ganda Putra',
    WD: 'Ganda Putri',
    XD: 'Ganda Campuran',
};
const statusOptions = ['upcoming', 'active', 'completed'].map((status) => ({ value: status, label: status }));

export default function Show({ league, users, divisionOptions, standings, upperBracket, lowerBracket }: { league: League; users: any[]; divisionOptions: { group_count: number; group_size: number }[]; standings: LeagueStandingGroup[]; upperBracket: GameMatch[][]; lowerBracket: GameMatch[][] }) {
    const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Overview');
    const form = useForm({
        name: league.name,
        description: league.description ?? '',
        start_date: league.start_date,
        end_date: league.end_date ?? '',
        status: league.status,
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

    const bracketForm = useForm({
        advance_upper_count: league.advance_upper_count?.toString() ?? '0',
        advance_lower_count: league.advance_lower_count?.toString() ?? '0',
        interval: 15,
        schedule: Array.from({
            length: Math.max(
                Math.ceil(Math.log2(Math.max(1, league.advance_upper_count ?? 0))),
                Math.ceil(Math.log2(Math.max(1, league.advance_lower_count ?? 0)))
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

    const groupedMatches = (league.matches ?? []).reduce((acc, match) => {
        const stage = match.stage ?? 'League Match';

        let key: string;
        if (['upper', 'lower', 'third_place', 'lower_third_place'].includes(stage)) {
            const bracketLabel = stage === 'third_place' ? 'Upper' : stage === 'lower_third_place' ? 'Lower' : stage.charAt(0).toUpperCase() + stage.slice(1);

            if (stage === 'third_place') {
                key = `${bracketLabel} Bracket > Third Place`;
            } else if (stage === 'lower_third_place') {
                key = `${bracketLabel} Bracket > Third Place`;
            } else {
                const upperMatches = (league.matches ?? []).filter(m => m.stage === stage && m.round != null);
                const maxRound = upperMatches.length > 0 ? Math.max(...upperMatches.map(m => m.round as number)) : 0;
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
    const sortedEntries = Object.entries(groupedMatches).sort(([a], [b]) => {
        const idxA = stageOrder.indexOf(a);
        const idxB = stageOrder.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    });

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
                            <Field label="Start date"><DatePicker value={form.data.start_date} onChange={(value) => form.setData('start_date', value)} /></Field>
                            <Field label="End date"><DatePicker value={form.data.end_date} onChange={(value) => form.setData('end_date', value)} /></Field>
                            <Field label="Participant total"><input type="number" min={2} value={form.data.participant_total} onChange={(event) => form.setData('participant_total', event.target.value)} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface" /></Field>
                            <Field label="Format"><div className="w-full border-0 border-b-2 border-outline-variant/10 rounded-t-md bg-surface-container-lowest px-3 py-2.5 text-sm font-bold text-on-surface-variant">{league.category ? `${categoryLabels[league.category]} • ${league.entry_type}` : 'Team based'}</div></Field>
                            <Field label="Description" full><textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="w-full min-h-[120px] bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface resize-y" /></Field>
                            <div className="md:col-span-2 flex justify-between gap-3 pt-2">
                                <button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all disabled:opacity-50" disabled={form.processing}>Save Changes</button>
                                <Link href={route('leagues.show', league.id)} className="rounded-full bg-surface-container-low border border-outline-variant/20 px-6 py-2 text-[0.875rem] font-bold text-on-surface hover:bg-surface-container transition-colors">Public View</Link>
                            </div>
                        </form>
                    ) : null}

                    {activeTab === 'Participants' ? (
                        <div className="grid gap-4">
                            {league.category ? (
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
                            ) : <EmptyState text="Participants are only available for badminton categories." />}
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
                                                    {entry.group_picture_path ? (
                                                        <img src={`/storage/${entry.group_picture_path}`} alt={entry.label} className="h-10 w-10 rounded-full object-cover bg-surface-container" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-xs font-bold shrink-0">
                                                            {entry.label.substring(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-bold text-on-surface">{entry.label}</td>
                                                <td className="px-4 py-3 text-on-surface-variant">{entry.group_name ? [entry.player1?.name, entry.player2?.name].filter(Boolean).join(' / ') : '-'}</td>
                                                <td className="px-4 py-3 text-on-surface-variant">{(entry.substitutes ?? []).length > 0 ? entry.substitutes?.map((sub) => sub.name).join(', ') : '-'}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setEditEntry(entry)} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-colors">Edit</button>
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
                                            {entry.group_picture_path ? (
                                                <img src={`/storage/${entry.group_picture_path}`} alt={entry.label} className="h-12 w-12 rounded-full object-cover bg-surface-container shrink-0" />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-sm font-bold shrink-0">
                                                    {entry.label.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-on-surface">{entry.label}</p>
                                                {entry.group_name ? <p className="text-sm text-on-surface-variant">{[entry.player1?.name, entry.player2?.name].filter(Boolean).join(' / ')}</p> : null}
                                                {(entry.substitutes ?? []).length > 0 ? <p className="text-xs text-on-surface-variant">Substitutes: {entry.substitutes?.map((substitute) => substitute.name).join(', ')}</p> : null}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditEntry(entry)} className="rounded-full bg-primary/10 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-colors">Edit</button>
                                            <button onClick={() => router.delete(route('admin.leagues.entries.destroy', [league.id, entry.id]), { preserveScroll: true })} className="rounded-full bg-error/10 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-widest text-error hover:bg-error hover:text-white transition-colors">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {activeTab === 'Groups' ? (
                        <div className="grid gap-4">
                            {divisionOptions.length > 0 ? <DivisionPicker leagueId={league.id} options={divisionOptions} /> : null}
                            {standings.length > 0 ? <GroupTable leagueId={league.id} standings={standings} /> : <EmptyState text="Generate groups after the entry list reaches the participant total." />}
                        </div>
                    ) : null}

                    {activeTab === 'Bracket' ? (
                        <div className="grid gap-4">
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
                            {upperBracket.length > 0 ? <BracketTree league={league} title="Upper Bracket" rounds={upperBracket} champion={league.upper_champion} thirdPlaceMatch={league.third_place_match} /> : <EmptyState text="Seed brackets after group standings are ready." />}
                            {lowerBracket.length > 0 ? <BracketTree league={league} title="Lower Bracket" rounds={lowerBracket} champion={league.lower_champion} thirdPlaceMatch={league.lower_third_place_match} /> : null}
                        </div>
                    ) : null}

                    {activeTab === 'Matches' ? (
                        <div className="grid gap-8">
                            {sortedEntries.map(([stage, matches]) => (
                                <div key={stage} className="grid gap-4">
                                    <h3 className="text-lg font-bold text-on-surface border-b-2 border-outline-variant/20 pb-2">{stage}</h3>

                                    {/* Desktop Fixture List View */}
                                    <div className="hidden lg:flex flex-col gap-3">
                                        {matches.map((match) => (
                                            <div key={match.id} className="group flex items-center justify-between bg-surface-container-lowest rounded-xl p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0px_12px_32px_rgba(15,23,42,0.06)] active:scale-[0.99] transition-all border border-outline-variant/20 relative overflow-hidden">
                                                {/* Status Accent */}
                                                {match.status === 'active' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>}

                                                {/* Time & Status (15%) */}
                                                <div className="w-[18%] flex flex-col gap-1.5 pl-2">
                                                    <div className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                                                        {match.scheduled_at ? new Date(match.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'TBA'}
                                                    </div>
                                                    <div className="inline-flex">
                                                        {match.status === 'active' ? (
                                                            <span className="rounded bg-error-container text-on-error-container px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] animate-pulse">Live</span>
                                                        ) : (
                                                            <span className="rounded bg-surface-container border border-outline-variant/20 text-on-surface-variant px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em]">{match.status}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Matchup (45%) */}
                                                <div className="w-[45%] flex items-center justify-center gap-6">
                                                    <div className="flex-1 text-right font-bold text-on-surface text-base truncate">{match.home_label ?? 'TBC'}</div>

                                                    <div className="flex flex-col items-center justify-center shrink-0 w-28">
                                                        <div className="bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-2 flex items-center justify-center gap-2 shadow-[inset_0px_2px_4px_rgba(15,23,42,0.02)]">
                                                            <span className={`text-xl font-black tracking-[-0.02em] ${match.status === 'upcoming' ? 'text-on-surface-variant' : 'text-on-surface'}`}>{match.home_score}</span>
                                                            <span className="text-outline-variant font-bold text-sm">-</span>
                                                            <span className={`text-xl font-black tracking-[-0.02em] ${match.status === 'upcoming' ? 'text-on-surface-variant' : 'text-on-surface'}`}>{match.away_score}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 text-left font-bold text-on-surface text-base truncate">{match.away_label ?? 'TBC'}</div>
                                                </div>

                                                {/* Sets (22%) */}
                                                <div className="w-[22%] flex flex-wrap justify-center gap-1.5 px-4">
                                                    {(match.sets ?? []).length > 0 ? (
                                                        match.sets?.map((set) => (
                                                            <span key={set.id} className="rounded bg-surface-container border border-outline-variant/20 px-2 py-1 text-[0.6875rem] font-bold text-on-surface-variant shadow-sm whitespace-nowrap">
                                                                {set.home_points}-{set.away_points}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[0.75rem] text-outline-variant italic font-medium">-</span>
                                                    )}
                                                </div>

                                                {/* Actions (15%) */}
                                                <div className="w-[15%] flex flex-col items-end justify-center gap-3">
                                                    <div className="flex gap-4">
                                                        <button type="button" onClick={() => setSubModalMatch(match)} className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">swap_horiz</span> Sub
                                                        </button>
                                                        <button type="button" onClick={() => setPhotoModalMatch(match)} className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">photo_camera</span> Pics
                                                        </button>
                                                    </div>
                                                    <div>
                                                        {league.category ? (
                                                            <SetScoreEntry matchId={match.id} label="Add Set" homeLabel={match.home_label} awayLabel={match.away_label} />
                                                        ) : (
                                                            <Link href={route('matches.show', match.id)} className="rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-1.5 text-[0.6875rem] font-bold uppercase tracking-widest shadow-[0px_4px_8px_rgba(0,86,164,0.15)] hover:shadow-[0px_8px_16px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all inline-block">
                                                                Open
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mobile Fixture Card View */}
                                    <div className="grid gap-4 lg:hidden">
                                        {matches.map((match) => (
                                            <div key={match.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] border border-outline-variant/20 relative overflow-hidden">
                                                {/* Status Accent */}
                                                {match.status === 'active' && <div className="absolute top-0 left-0 right-0 h-1 bg-error"></div>}

                                                {/* Top Row */}
                                                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3 mb-3">
                                                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                                                        {match.scheduled_at ? new Date(match.scheduled_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'TBA'}
                                                    </span>
                                                    {match.status === 'active' ? (
                                                        <span className="rounded bg-error-container text-on-error-container px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] animate-pulse">Live</span>
                                                    ) : (
                                                        <span className="rounded bg-surface-container border border-outline-variant/20 text-on-surface-variant px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em]">{match.status}</span>
                                                    )}
                                                </div>

                                                {/* Middle Row: Matchup */}
                                                <div className="flex justify-between items-center mb-4 px-1">
                                                    <div className="flex flex-col gap-2 flex-1 mr-4">
                                                        <span className="font-bold text-on-surface text-base leading-tight">{match.home_label ?? 'TBC'}</span>
                                                        <span className="font-bold text-on-surface text-base leading-tight">{match.away_label ?? 'TBC'}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2 text-right bg-surface-container-low border border-outline-variant/10 px-3 py-2 rounded-lg shadow-[inset_0px_2px_4px_rgba(15,23,42,0.02)] min-w-[3rem]">
                                                        <span className={`text-xl font-black tracking-[-0.02em] leading-none ${match.status === 'upcoming' ? 'text-on-surface-variant' : 'text-on-surface'}`}>{match.home_score}</span>
                                                        <span className={`text-xl font-black tracking-[-0.02em] leading-none ${match.status === 'upcoming' ? 'text-on-surface-variant' : 'text-on-surface'}`}>{match.away_score}</span>
                                                    </div>
                                                </div>

                                                {/* Sets Pill Badges */}
                                                {(match.sets ?? []).length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 border-t border-outline-variant/10 pt-3 mb-4">
                                                        {match.sets?.map((set) => (
                                                            <span key={set.id} className="rounded bg-surface-container border border-outline-variant/20 px-2 py-1 text-[0.6875rem] font-bold text-on-surface-variant">
                                                                Set {set.set_number}: {set.home_points}-{set.away_points}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Bottom Actions */}
                                                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/10 mt-2">
                                                    <div className="flex gap-4">
                                                        <button type="button" onClick={() => setSubModalMatch(match)} className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">swap_horiz</span> Sub
                                                        </button>
                                                        <button type="button" onClick={() => setPhotoModalMatch(match)} className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">photo_camera</span> Pics
                                                        </button>
                                                    </div>
                                                    <div>
                                                        {league.category ? (
                                                            <SetScoreEntry matchId={match.id} label="Add Set" homeLabel={match.home_label} awayLabel={match.away_label} />
                                                        ) : (
                                                            <Link href={route('matches.show', match.id)} className="rounded-full bg-surface-container-low border border-outline-variant/20 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface active:bg-surface-container">
                                                                Open
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {Object.keys(groupedMatches).length === 0 && (
                                <div className="rounded-xl bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                                    No matches found.
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
