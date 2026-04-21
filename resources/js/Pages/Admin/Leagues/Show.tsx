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
import AdminLayout from '@/Layouts/AdminLayout';
import { GameMatch, League, LeagueStandingGroup } from '@/types/jrclub';
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
    const [subModalMatch, setSubModalMatch] = useState<GameMatch | null>(null);
    const [photoModalMatch, setPhotoModalMatch] = useState<GameMatch | null>(null);

    const bracketForm = useForm({
        advance_upper_count: league.advance_upper_count?.toString() ?? '0',
        advance_lower_count: league.advance_lower_count?.toString() ?? '0',
        interval: 15,
        schedule: Array.from({ length: Math.max(
            Math.ceil(Math.log2(Math.max(1, league.advance_upper_count ?? 0))),
            Math.ceil(Math.log2(Math.max(1, league.advance_lower_count ?? 0)))
        ) + 1 }).map((_, i) => ({
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
        if (!acc[stage]) {
            acc[stage] = [];
        }
        acc[stage].push(match);
        return acc;
    }, {} as Record<string, GameMatch[]>);

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
                                            <th className="px-4 py-3">Label</th>
                                            <th className="px-4 py-3">Players</th>
                                            <th className="px-4 py-3">Substitutes</th>
                                            <th className="px-4 py-3">Seed</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/20">
                                        {(league.entries ?? []).map((entry) => (
                                            <tr key={entry.id} className="hover:bg-surface-container-lowest/50">
                                                <td className="px-4 py-3 font-bold text-on-surface">{entry.label}</td>
                                                <td className="px-4 py-3 text-on-surface-variant">{entry.group_name ? [entry.player1?.name, entry.player2?.name].filter(Boolean).join(' / ') : '-'}</td>
                                                <td className="px-4 py-3 text-on-surface-variant">{(entry.substitutes ?? []).length > 0 ? entry.substitutes?.map((sub) => sub.name).join(', ') : '-'}</td>
                                                <td className="px-4 py-3 text-on-surface-variant">{entry.seed ?? entry.id}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button onClick={() => router.delete(route('admin.leagues.entries.destroy', [league.id, entry.id]), { preserveScroll: true })} className="rounded-full bg-error/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-error hover:bg-error hover:text-white">Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="grid gap-3 lg:hidden overflow-y-auto max-h-[500px] pr-1 pb-1">
                                {(league.entries ?? []).map((entry) => (
                                    <div key={entry.id} className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="font-bold text-on-surface">{entry.label}</p>
                                            {entry.group_name ? <p className="text-sm text-on-surface-variant">{[entry.player1?.name, entry.player2?.name].filter(Boolean).join(' / ')}</p> : null}
                                            {(entry.substitutes ?? []).length > 0 ? <p className="text-xs text-on-surface-variant">Substitutes: {entry.substitutes?.map((substitute) => substitute.name).join(', ')}</p> : null}
                                            <p className="text-xs uppercase tracking-widest text-on-surface-variant">Seed {entry.seed ?? entry.id}</p>
                                        </div>
                                        <button onClick={() => router.delete(route('admin.leagues.entries.destroy', [league.id, entry.id]), { preserveScroll: true })} className="rounded-full bg-error/10 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-widest text-error hover:bg-error hover:text-white transition-colors">Remove</button>
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
                            {Object.entries(groupedMatches).map(([stage, matches]) => (
                                <div key={stage} className="grid gap-4">
                                    <h3 className="text-lg font-bold text-on-surface border-b-2 border-outline-variant/20 pb-2">{stage}</h3>
                                    
                                    {/* Desktop Table View */}
                                    <div className="hidden lg:block overflow-auto max-h-[600px] rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)] ring-1 ring-outline-variant/10">
                                        <table className="w-full text-left text-sm relative">
                                            <thead className="sticky top-0 z-10 bg-[#f2f4f6] shadow-[0_1px_3px_rgba(15,23,42,0.06)] text-[0.6875rem] uppercase tracking-[0.05em] text-on-surface-variant">
                                                <tr>
                                                    <th className="px-4 py-3 font-bold">Time</th>
                                                    <th className="px-4 py-3 font-bold">Matchup</th>
                                                    <th className="px-4 py-3 font-bold text-center">Score</th>
                                                    <th className="px-4 py-3 font-bold">Sets</th>
                                                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-outline-variant/10">
                                                {matches.map((match) => (
                                                    <tr key={match.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                                        <td className="px-4 py-4 align-top">
                                                            <p className="text-[0.75rem] text-on-surface-variant mt-1">{match.scheduled_at ? new Date(match.scheduled_at).toLocaleString() : 'TBA'}</p>
                                                        </td>
                                                        <td className="px-4 py-4 align-top">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="font-bold text-on-surface">{match.home_label ?? 'TBD'}</div>
                                                                <div className="font-bold text-on-surface">{match.away_label ?? 'TBD'}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 align-top text-center">
                                                            <div className="inline-flex flex-col items-center justify-center rounded-lg bg-surface-container-low px-3 py-1.5 shadow-[inset_0px_2px_4px_rgba(15,23,42,0.02)]">
                                                                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant mb-0.5">{match.status}</span>
                                                                <span className="text-lg font-black tracking-tight text-on-surface">{match.home_score} - {match.away_score}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 align-top max-w-[200px]">
                                                            {(match.sets ?? []).length > 0 ? (
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {match.sets?.map((set) => (
                                                                        <span key={set.id} className="rounded bg-surface-container-low border border-outline-variant/20 px-2 py-1 text-[0.6875rem] font-bold text-on-surface-variant">
                                                                            {set.home_points}-{set.away_points}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : <span className="text-[0.75rem] text-on-surface-variant italic">-</span>}
                                                        </td>
                                                        <td className="px-4 py-4 align-top text-right">
                                                            <div className="flex flex-col items-end gap-3">
                                                                <div className="flex gap-3">
                                                                    <button type="button" onClick={() => setSubModalMatch(match)} className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors">Sub</button>
                                                                    <button type="button" onClick={() => setPhotoModalMatch(match)} className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors">Photos</button>
                                                                </div>
                                                                <div>
                                                                    {league.category ? <SetScoreEntry matchId={match.id} label="Add Set" homeLabel={match.home_label} awayLabel={match.away_label} /> : <Link href={route('matches.show', match.id)} className="rounded-full bg-surface-container-low border border-outline-variant/20 px-4 py-1.5 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container transition-colors inline-block">Open Match</Link>}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="grid gap-3 lg:hidden overflow-y-auto max-h-[600px] pr-1 pb-1">
                                        {matches.map((match) => (
                                            <div key={match.id} className="rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                                                <div className="mb-3 flex items-center justify-between border-b border-outline-variant/10 pb-3">
                                                    <div>
                                                        <p className="text-[0.6875rem] text-on-surface-variant mt-0.5">{match.scheduled_at ? new Date(match.scheduled_at).toLocaleString() : 'TBA'}</p>
                                                    </div>
                                                    <span className="rounded-full bg-surface-container-low px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{match.status}</span>
                                                </div>
                                                <div className="mb-4 flex items-center justify-between px-1">
                                                    <div className="grid gap-2">
                                                        <p className="font-bold text-on-surface leading-none">{match.home_label ?? 'TBD'}</p>
                                                        <p className="font-bold text-on-surface leading-none">{match.away_label ?? 'TBD'}</p>
                                                    </div>
                                                    <div className="grid gap-2 text-right">
                                                        <p className="text-xl font-black tracking-tight text-on-surface leading-none">{match.home_score}</p>
                                                        <p className="text-xl font-black tracking-tight text-on-surface leading-none">{match.away_score}</p>
                                                    </div>
                                                </div>
                                                {(match.sets ?? []).length > 0 && (
                                                    <div className="mb-4 flex flex-wrap gap-1.5 border-t border-outline-variant/10 pt-3">
                                                        {match.sets?.map((set) => (
                                                            <span key={set.id} className="rounded bg-surface-container-low border border-outline-variant/20 px-2 py-1 text-[0.6875rem] font-bold text-on-surface-variant">
                                                                Set {set.set_number}: {set.home_points}-{set.away_points}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/10 mt-2">
                                                    <div className="flex gap-4">
                                                        <button type="button" onClick={() => setSubModalMatch(match)} className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary hover:text-primary">Sub</button>
                                                        <button type="button" onClick={() => setPhotoModalMatch(match)} className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-secondary hover:text-primary">Photos</button>
                                                    </div>
                                                    <div>
                                                        {league.category ? <SetScoreEntry matchId={match.id} label="Add Set" homeLabel={match.home_label} awayLabel={match.away_label} /> : <Link href={route('matches.show', match.id)} className="rounded-full bg-surface-container-low border border-outline-variant/20 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface">Open Match</Link>}
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
