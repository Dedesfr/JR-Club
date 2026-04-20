import BracketTree from '@/Components/BracketTree';
import DatePicker from '@/Components/DatePicker';
import DivisionPicker from '@/Components/DivisionPicker';
import EntryPicker from '@/Components/EntryPicker';
import GroupTable from '@/Components/GroupTable';
import SelectInput from '@/Components/SelectInput';
import SetScoreEntry from '@/Components/SetScoreEntry';
import AdminLayout from '@/Layouts/AdminLayout';
import { GameMatch, League, LeagueStandingGroup } from '@/types/jrclub';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

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

    const bracketForm = useForm({
        advance_upper_count: league.advance_upper_count?.toString() ?? '0',
        advance_lower_count: league.advance_lower_count?.toString() ?? '0',
    });

    return (
        <AdminLayout title={league.name}>
            <Head title={league.name} />

            <div className="mb-6 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest ${activeTab === tab ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Overview' ? (
                <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.leagues.update', league.id)); }} className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2">
                    <Field label="Name"><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                    <Field label="Status"><SelectInput options={statusOptions} value={form.data.status} onChange={(value) => form.setData('status', value)} /></Field>
                    <Field label="Start date"><DatePicker value={form.data.start_date} onChange={(value) => form.setData('start_date', value)} /></Field>
                    <Field label="End date"><DatePicker value={form.data.end_date} onChange={(value) => form.setData('end_date', value)} /></Field>
                    <Field label="Participant total"><input type="number" min={2} value={form.data.participant_total} onChange={(event) => form.setData('participant_total', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                    <Field label="Format"><div className="rounded-xl bg-surface-container-low px-3 py-3 text-sm font-bold text-on-surface">{league.category ? `${categoryLabels[league.category]} • ${league.entry_type}` : 'Team based'}</div></Field>
                    <Field label="Description" full><textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="min-h-28 rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                    <div className="md:col-span-2 flex justify-between gap-3"><button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Save Changes</button><Link href={route('leagues.show', league.id)} className="rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-surface-variant">Public View</Link></div>
                </form>
            ) : null}

            {activeTab === 'Participants' ? (
                <div className="grid gap-4">
                    {league.category ? <EntryPicker leagueId={league.id} users={users} category={league.category} entryType={league.entry_type} /> : <EmptyState text="Participants are only available for badminton categories." />}
                    <div className="grid gap-3">
                        {(league.entries ?? []).map((entry) => (
                            <div key={entry.id} className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="font-bold text-on-surface">{entry.label}</p>
                                    {entry.group_name ? <p className="text-sm text-on-surface-variant">{[entry.player1?.name, entry.player2?.name].filter(Boolean).join(' / ')}</p> : null}
                                    {(entry.substitutes ?? []).length > 0 ? <p className="text-xs text-on-surface-variant">Substitutes: {entry.substitutes?.map((substitute) => substitute.name).join(', ')}</p> : null}
                                    <p className="text-xs uppercase tracking-widest text-on-surface-variant">Seed {entry.seed ?? entry.id}</p>
                                </div>
                                <button onClick={() => router.delete(route('admin.leagues.entries.destroy', [league.id, entry.id]), { preserveScroll: true })} className="rounded-full bg-error px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">Remove</button>
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
                    <form onSubmit={(event) => { event.preventDefault(); bracketForm.post(route('admin.leagues.brackets.store', league.id), { preserveScroll: true }); }} className="grid gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-3">
                        <Field label="Upper advances"><input type="number" min={0} value={bracketForm.data.advance_upper_count} onChange={(event) => bracketForm.setData('advance_upper_count', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                        <Field label="Lower advances"><input type="number" min={0} value={bracketForm.data.advance_lower_count} onChange={(event) => bracketForm.setData('advance_lower_count', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                        <button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Seed Brackets</button>
                    </form>
                    {upperBracket.length > 0 ? <BracketTree title="Upper Bracket" rounds={upperBracket} champion={league.upper_champion} /> : <EmptyState text="Seed brackets after group standings are ready." />}
                    {lowerBracket.length > 0 ? <BracketTree title="Lower Bracket" rounds={lowerBracket} champion={league.lower_champion} /> : null}
                </div>
            ) : null}

            {activeTab === 'Matches' ? (
                <div className="grid gap-4">
                    {(league.matches ?? []).map((match) => (
                        <div key={match.id} className="rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{match.stage ?? 'league match'}</p>
                                    <p className="text-lg font-black tracking-tight text-on-surface">{match.home_label ?? 'TBD'} vs {match.away_label ?? 'TBD'}</p>
                                    <p className="text-xs uppercase tracking-widest text-on-surface-variant">{match.status} • {match.home_score} - {match.away_score}</p>
                                </div>
                                {league.category ? <SetScoreEntry matchId={match.id} label="Add Set" homeLabel={match.home_label} awayLabel={match.away_label} /> : <Link href={route('matches.show', match.id)} className="rounded-full bg-surface-container-low px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Open Match</Link>}
                            </div>
                            {(match.sets ?? []).length > 0 ? <div className="mt-3 flex flex-wrap gap-2">{match.sets?.map((set) => <span key={set.id} className="rounded-full bg-surface-container-low px-3 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Set {set.set_number}: {set.home_points}-{set.away_points}</span>)}</div> : null}
                        </div>
                    ))}
                </div>
            ) : null}
        </AdminLayout>
    );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
    return <label className={`grid gap-2 text-sm font-medium text-on-surface ${full ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>;
}

function EmptyState({ text }: { text: string }) {
    return <div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-on-surface-variant shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">{text}</div>;
}
