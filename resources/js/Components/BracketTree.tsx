import { GameMatch, LeagueEntry, League } from '@/types/jrclub';
import { useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Bracket, Seed, SeedItem, SeedTeam, type IRenderSeedProps, type IRoundProps, type ISeedProps } from 'react-brackets';
import SecondaryButton from './SecondaryButton';
import Modal from './Modal';
import SelectInput from './SelectInput';

type BracketTeam = {
    name: string;
    score: number;
    won: boolean;
};

type BracketSeed = ISeedProps & {
    statusLabel: string;
    teams: BracketTeam[];
    match: GameMatch;
    onMatchClick?: (match: GameMatch) => void;
    isAdjustMode?: boolean;
};

export default function BracketTree({
    league,
    title,
    rounds,
    thirdPlaceMatch,
    champion,
    readOnly = false,
}: {
    league: League;
    title: string;
    rounds: GameMatch[][];
    thirdPlaceMatch?: GameMatch | null;
    champion?: LeagueEntry | null;
    readOnly?: boolean;
}) {
    const [adjustMode, setAdjustMode] = useState(false);
    const [adjustMatch, setAdjustMatch] = useState<GameMatch | null>(null);

    const adjustForm = useForm({
        match_id: 0,
        home_entry_id: '' as string | number,
        away_entry_id: '' as string | number,
    });

    const entriesOptions = useMemo(() => {
        if (!rounds || rounds.length === 0) return [];
        const entriesMap = new Map<number, string>();
        rounds[0].forEach(match => {
            if (match.home_entry) entriesMap.set(match.home_entry.id, match.home_label || 'Unknown');
            if (match.away_entry) entriesMap.set(match.away_entry.id, match.away_label || 'Unknown');
        });
        
        return Array.from(entriesMap.entries())
            .map(([id, label]) => ({ value: String(id), label }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [rounds]);

    const handleMatchClick = (match: GameMatch) => {
        if (!adjustMode || readOnly) return;
        
        if (match.sets && match.sets.length > 0) {
            alert('Cannot adjust a match that already has scores.');
            return;
        }

        adjustForm.setData({
            match_id: match.id,
            home_entry_id: match.home_entry?.id?.toString() || '',
            away_entry_id: match.away_entry?.id?.toString() || '',
        });
        
        setAdjustMatch(match);
    };

    const submitAdjust = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (adjustForm.data.home_entry_id === adjustForm.data.away_entry_id && adjustForm.data.home_entry_id !== '') {
            alert('Home and Away teams cannot be the same.');
            return;
        }

        adjustForm.post(route('admin.leagues.brackets.adjust', league.id), {
            onSuccess: () => {
                setAdjustMatch(null);
                setAdjustMode(false);
            },
            onError: (errors: any) => {
                alert(errors.error || 'Failed to adjust match slots');
            }
        });
    };

    const bracketRounds = toBracketRounds(rounds, handleMatchClick, adjustMode);

    return (
        <section className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-primary px-4 py-3 text-on-primary">
                <h3 className="font-black uppercase tracking-[0.02em]">{title}</h3>
                <div className="flex items-center gap-3">
                    {!readOnly && rounds.length > 0 && (
                        <SecondaryButton 
                            onClick={() => {
                                setAdjustMode(!adjustMode);
                                setAdjustMatch(null);
                            }}
                            className="!py-1 !text-xs"
                        >
                            {adjustMode ? 'Cancel Adjust' : 'Adjust Slots'}
                        </SecondaryButton>
                    )}
                    <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">{readOnly ? 'Member view' : 'Admin view'}</p>
                </div>
            </div>

            {adjustMode && (
                <div className="bg-primary-container px-4 py-2 text-sm text-on-primary-container font-medium">
                    Click any match to adjust its assigned teams.
                </div>
            )}

            <div className="overflow-x-auto bg-surface px-4 py-5">
                <div className="min-w-[900px]">
                    <Bracket
                        bracketClassName="jr-bracket"
                        mobileBreakpoint={0}
                        roundTitleComponent={(roundTitle) => <RoundTitle title={roundTitle} />}
                        rounds={bracketRounds}
                        renderSeedComponent={renderSeed}
                    />
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center max-w-2xl mx-auto">
                    <div className="flex-1 grid gap-2 rounded-lg border border-outline bg-surface-container-lowest p-3 shadow-[0px_8px_20px_rgba(15,23,42,0.06)]">
                        <p className="text-center text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Champion</p>
                        <p className="min-h-7 text-center text-base font-black text-on-surface">{champion?.label ?? 'TBD'}</p>
                    </div>

                    {thirdPlaceMatch && (
                        <div className="flex-1 grid gap-2 rounded-lg border border-outline bg-surface-container-lowest p-3 shadow-[0px_8px_20px_rgba(15,23,42,0.06)]">
                            <p className="text-center text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Third Place Match</p>
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mt-2">
                                <span className={['text-sm font-bold truncate text-right', isWinner(thirdPlaceMatch, 'home') ? 'text-primary' : 'text-on-surface'].join(' ')}>
                                    {thirdPlaceMatch.home_label ?? 'TBD'}
                                </span>
                                <span className="text-xs font-black text-on-surface-variant px-2 py-1 bg-surface-variant rounded">VS</span>
                                <span className={['text-sm font-bold truncate', isWinner(thirdPlaceMatch, 'away') ? 'text-primary' : 'text-on-surface'].join(' ')}>
                                    {thirdPlaceMatch.away_label ?? 'TBD'}
                                </span>
                            </div>
                            {(thirdPlaceMatch.home_score > 0 || thirdPlaceMatch.away_score > 0) && (
                                <p className="text-center text-xs font-black text-primary mt-1">
                                    {thirdPlaceMatch.home_score} - {thirdPlaceMatch.away_score}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal show={adjustMatch !== null} onClose={() => setAdjustMatch(null)}>
                <form onSubmit={submitAdjust} className="p-6">
                    <h2 className="text-lg font-bold text-on-surface mb-6">Adjust Match Teams</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Home Team</label>
                            <SelectInput
                                options={[{ value: '', label: 'TBD (Bye)' }, ...entriesOptions]}
                                value={String(adjustForm.data.home_entry_id)}
                                onChange={(value) => adjustForm.setData('home_entry_id', value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Away Team</label>
                            <SelectInput
                                options={[{ value: '', label: 'TBD (Bye)' }, ...entriesOptions]}
                                value={String(adjustForm.data.away_entry_id)}
                                onChange={(value) => adjustForm.setData('away_entry_id', value)}
                            />
                        </div>
                        
                        <div className="pt-2 text-xs text-on-surface-variant">
                            Note: Assigning a team that is already placed in another match will automatically swap them to ensure bracket integrity.
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setAdjustMatch(null)} type="button">Cancel</SecondaryButton>
                        <button 
                            type="submit" 
                            disabled={adjustForm.processing}
                            className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2 text-sm font-bold text-on-primary shadow-sm hover:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}

function renderSeed({ seed, breakpoint }: IRenderSeedProps) {
    const bracketSeed = seed as BracketSeed;
    const canAdjust = bracketSeed.onMatchClick && (!bracketSeed.match.sets || bracketSeed.match.sets.length === 0) && bracketSeed.isAdjustMode;

    return (
        <Seed mobileBreakpoint={breakpoint}>
            <SeedItem 
                className={[
                    '!rounded-lg !border !border-outline !bg-surface-container-lowest !p-0 !text-on-surface !shadow-[0px_8px_20px_rgba(15,23,42,0.06)]',
                    canAdjust ? 'cursor-pointer hover:!ring-2 hover:!ring-primary transition-all' : ''
                ].join(' ')}
                onClick={() => {
                    if (canAdjust) bracketSeed.onMatchClick!(bracketSeed.match);
                }}
            >
                <div className="grid w-full overflow-hidden rounded-lg">
                    {bracketSeed.teams.map((team, index) => {
                        const side = index === 0 ? 'home' : 'away';

                        return (
                            <SeedTeam
                                key={`${bracketSeed.id}-${index}`}
                                className={[
                                    '!grid !min-h-10 !grid-cols-[1fr_2.5rem] !items-center !gap-3 !px-3 !py-2 !text-left',
                                    index > 0 ? '!border-t !border-outline-variant' : '',
                                    team.won ? '!bg-primary-fixed !text-on-primary-fixed' : '!bg-surface-container-lowest !text-on-surface',
                                ].join(' ')}
                            >
                                <span className="line-clamp-2 text-sm font-black uppercase leading-tight" title={team.name}>{team.name}</span>
                                <span className={['text-right text-base font-black', team.won ? 'text-current' : 'text-on-surface-variant'].join(' ')}>{team.score}</span>
                            </SeedTeam>
                        );
                    })}
                </div>
            </SeedItem>
            <p className="mt-2 text-center text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">{bracketSeed.statusLabel}</p>
        </Seed>
    );
}

function RoundTitle({ title }: { title: string | JSX.Element }) {
    return <p className="mb-2 text-center text-[0.6875rem] font-black uppercase tracking-[0.12em] text-primary">{title}</p>;
}

function toBracketRounds(
    rounds: GameMatch[][], 
    onMatchClick?: (match: GameMatch) => void,
    isAdjustMode?: boolean
): IRoundProps[] {
    const visibleRounds = rounds.filter((round) => round.length > 0);

    if (visibleRounds.length === 0) {
        return [
            {
                title: 'Round 1',
                seeds: [
                    {
                        id: 'empty',
                        statusLabel: 'waiting',
                        match: {} as GameMatch,
                        teams: [
                            { name: 'TBD', score: 0, won: false },
                            { name: 'TBD', score: 0, won: false },
                        ],
                    } as BracketSeed,
                ],
            },
        ];
    }

    return visibleRounds.map((round, roundIndex) => ({
        title: roundTitle(roundIndex, visibleRounds.length),
        seeds: round.map(match => {
            const seed = toBracketSeed(match);
            return {
                ...seed,
                match,
                onMatchClick,
                isAdjustMode,
            } as BracketSeed;
        }),
    }));
}

function toBracketSeed(match: GameMatch): BracketSeed {
    return {
        id: match.id,
        statusLabel: matchStatus(match.status),
        match: match,
        teams: [
            {
                name: match.home_label ?? 'TBD',
                score: match.home_score,
                won: isWinner(match, 'home'),
            },
            {
                name: match.away_label ?? 'TBD',
                score: match.away_score,
                won: isWinner(match, 'away'),
            },
        ],
    };
}

function isWinner(match: GameMatch, side: 'home' | 'away') {
    if (match.status !== 'completed') {
        return false;
    }

    return side === 'home' ? match.home_score > match.away_score : match.away_score > match.home_score;
}

function matchStatus(status: string) {
    return status.replaceAll('_', ' ');
}

function roundTitle(roundIndex: number, totalRounds: number) {
    if (roundIndex === totalRounds - 1) {
        return 'Final';
    }

    if (roundIndex === totalRounds - 2) {
        return 'Semifinal';
    }

    return `Round ${roundIndex + 1}`;
}
