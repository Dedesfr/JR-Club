import { GameMatch, LeagueEntry } from '@/types/jrclub';
import { Bracket, Seed, SeedItem, SeedTeam, type IRenderSeedProps, type IRoundProps, type ISeedProps } from 'react-brackets';

type BracketTeam = {
    name: string;
    score: number;
    won: boolean;
};

type BracketSeed = ISeedProps & {
    statusLabel: string;
    teams: BracketTeam[];
};

export default function BracketTree({
    title,
    rounds,
    champion,
    readOnly = false,
}: {
    title: string;
    rounds: GameMatch[][];
    champion?: LeagueEntry | null;
    readOnly?: boolean;
}) {
    const bracketRounds = toBracketRounds(rounds);

    return (
        <section className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-primary px-4 py-3 text-on-primary">
                <h3 className="font-black uppercase tracking-[0.02em]">{title}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">{readOnly ? 'Member view' : 'Admin view'}</p>
            </div>

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

                <div className="mx-auto mt-5 grid max-w-sm gap-2 rounded-lg border border-outline bg-surface-container-lowest p-3 shadow-[0px_8px_20px_rgba(15,23,42,0.06)]">
                    <p className="text-center text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Champion</p>
                    <p className="min-h-7 text-center text-base font-black text-on-surface">{champion?.label ?? 'TBD'}</p>
                </div>
            </div>
        </section>
    );
}

function renderSeed({ seed, breakpoint }: IRenderSeedProps) {
    const bracketSeed = seed as BracketSeed;

    return (
        <Seed mobileBreakpoint={breakpoint}>
            <SeedItem className="!rounded-lg !border !border-outline !bg-surface-container-lowest !p-0 !text-on-surface !shadow-[0px_8px_20px_rgba(15,23,42,0.06)]">
                <div className="grid w-full overflow-hidden rounded-lg">
                    {bracketSeed.teams.map((team, index) => (
                        <SeedTeam
                            key={`${bracketSeed.id}-${index}`}
                            className={[
                                '!grid !min-h-10 !grid-cols-[1fr_2.5rem] !items-center !gap-3 !px-3 !py-2 !text-left',
                                index > 0 ? '!border-t !border-outline-variant' : '',
                                team.won ? '!bg-primary-fixed !text-on-primary-fixed' : '!bg-surface-container-lowest !text-on-surface',
                            ].join(' ')}
                        >
                            <span className="line-clamp-2 text-sm font-black uppercase leading-tight" title={team.name}>{team.name}</span>
                            <span className={['text-right text-base font-black', team.won ? 'text-primary' : 'text-on-surface-variant'].join(' ')}>{team.score}</span>
                        </SeedTeam>
                    ))}
                </div>
            </SeedItem>
            <p className="mt-2 text-center text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">{bracketSeed.statusLabel}</p>
        </Seed>
    );
}

function RoundTitle({ title }: { title: string | JSX.Element }) {
    return <p className="mb-2 text-center text-[0.6875rem] font-black uppercase tracking-[0.12em] text-primary">{title}</p>;
}

function toBracketRounds(rounds: GameMatch[][]): IRoundProps[] {
    const visibleRounds = rounds.filter((round) => round.length > 0);

    if (visibleRounds.length === 0) {
        return [
            {
                title: 'Round 1',
                seeds: [
                    {
                        id: 'empty',
                        statusLabel: 'waiting',
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
        seeds: round.map(toBracketSeed),
    }));
}

function toBracketSeed(match: GameMatch): BracketSeed {
    return {
        id: match.id,
        statusLabel: matchStatus(match.status),
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
