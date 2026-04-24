import JRClubLayout from '@/Layouts/JRClubLayout';
import { Head, Link } from '@inertiajs/react';

type Player = { id: number; name: string; picture?: string | null; activities_joined: number; matches_played: number; win_rate: number; score: number };

function playerAvatar(player: Player): string | null {
    if (player.picture) return `/storage/${player.picture}`;
    return `/images/icon-${((player.id - 1) % 7) + 1}.jpeg`;
}

export default function Index({ players }: { players: Player[] }) {
    return (
        <JRClubLayout active="Rankings">
            <Head title="Leaderboards" />

            {/* Section: Header + Tab Nav */}
            <section className="space-y-4 pt-4">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-on-surface">Leaderboards</h1>
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-container-high p-1 md:flex md:w-fit md:rounded-xl">
                    <Link
                        href={route('leaderboards.index')}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-on-primary shadow-[0px_4px_12px_rgba(0,86,164,0.25)]"
                    >
                        <span className="material-symbols-outlined fill text-[14px]">leaderboard</span>
                        Global
                    </Link>
                    <Link
                        href={route('leaderboards.leagues')}
                        className="flex items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-container"
                    >
                        <span className="material-symbols-outlined text-[14px]">emoji_events</span>
                        Leagues
                    </Link>
                </div>
            </section>

            {/* Section: Podium */}
            <section className="my-10">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Top Rankings</p>
                <div className="flex items-end justify-center gap-2">
                    {players[1] ? <PodiumPlayer player={players[1]} place="2nd" size="secondary" /> : null}
                    {players[0] ? <PodiumPlayer player={players[0]} place="1st" size="primary" /> : null}
                    {players[2] ? <PodiumPlayer player={players[2]} place="3rd" size="tertiary" /> : null}
                </div>
            </section>

            {/* Section: Player List */}
            <section className="space-y-2 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">All Players</p>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {players.slice(3).map((player, index) => (
                        <PlayerRow key={player.id} player={player} rank={index + 4} />
                    ))}
                </div>
            </section>
        </JRClubLayout>
    );
}

function PodiumPlayer({ player, place, size }: { player: Player; place: string; size: 'primary' | 'secondary' | 'tertiary' }) {
    const isPrimary = size === 'primary';
    const isSecondary = size === 'secondary';

    const widthClass = isPrimary ? 'w-[36%]' : 'w-[30%]';

    const avatarSize = isPrimary ? 'h-16 w-16 text-lg' : 'h-12 w-12 text-sm';
    const avatarBg = isPrimary
        ? 'bg-primary-fixed text-on-primary-fixed ring-4 ring-yellow-400 ring-offset-2 ring-offset-surface shadow-[0px_8px_20px_rgba(0,86,164,0.20)]'
        : isSecondary
        ? 'bg-surface-container-lowest text-on-surface ring-2 ring-surface-dim shadow-sm'
        : 'bg-tertiary-fixed text-on-tertiary-fixed ring-2 ring-[#ffb68f] shadow-sm';

    const badgeBg = isSecondary
        ? 'bg-gradient-to-br from-[#e6e8ea] to-[#d8dadc] text-neutral-600'
        : 'bg-gradient-to-br from-[#ffdbca] to-[#ffb68f] text-[#8f3d00]';

    const columnBg = isPrimary
        ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 shadow-[0px_-4px_24px_rgba(245,158,11,0.25)]'
        : isSecondary
        ? 'bg-gradient-to-br from-[#e6e8ea] to-[#d8dadc]'
        : 'bg-gradient-to-br from-[#ffdbca] to-[#ffb68f]';

    const scoreColor = isPrimary ? 'text-yellow-950' : isSecondary ? 'text-on-surface' : 'text-orange-950';
    const labelColor = isPrimary ? 'text-yellow-900/60' : isSecondary ? 'text-neutral-500' : 'text-orange-700/60';
    const scoreSize = isPrimary ? 'text-4xl' : 'text-2xl';
    // Stepped column heights: 1st tallest, 2nd medium, 3rd shortest
    const columnMinH = isPrimary ? 'min-h-36' : isSecondary ? 'min-h-24' : 'min-h-20';

    return (
        <div className={`flex ${widthClass} flex-col items-center`}>
            {isPrimary && (
                <div className="mb-2 flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-yellow-800 shadow-sm">
                    <span className="material-symbols-outlined fill text-[11px] text-yellow-600">workspace_premium</span>
                    Champion
                </div>
            )}

            {/* Avatar with rank badge */}
            <div className="relative mb-2">
                <div className={`flex items-center justify-center overflow-hidden rounded-full font-black ${avatarSize} ${avatarBg}`}>
                    {playerAvatar(player)
                        ? <img src={playerAvatar(player)!} alt={player.name} className="h-full w-full object-cover" />
                        : player.name.charAt(0)
                    }
                </div>
                {!isPrimary && (
                    <div className={`absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black shadow-sm ${badgeBg}`}>
                        {isSecondary ? '2' : '3'}
                    </div>
                )}
            </div>

            {/* Name */}
            <p className={`mb-2 max-w-full truncate px-1 text-center font-bold text-on-surface ${isPrimary ? 'text-sm' : 'text-[11px]'}`}>
                {isPrimary ? player.name : player.name.split(' ')[0]}
            </p>

            {/* Podium column — flex-col so content sits at top, height creates the step */}
            <div className={`flex w-full flex-col items-center justify-start rounded-t-xl px-2 pt-3 pb-2 text-center ${columnBg} ${columnMinH}`}>
                <span className={`block text-[9px] font-bold uppercase tracking-widest ${labelColor}`}>{place}</span>
                <span className={`block font-black tracking-tighter ${scoreSize} ${scoreColor}`}>{player.score}</span>
                <span className={`block text-[9px] font-bold uppercase ${labelColor}`}>pts</span>
            </div>
        </div>
    );
}

function PlayerRow({ player, rank }: { player: Player; rank: number }) {
    const isTop5 = rank <= 5;

    return (
        <Link
            href={route('profile.public', player.id)}
            className={`flex items-center gap-3 rounded-xl bg-surface-container-lowest transition-all active:scale-[0.98] ${isTop5 ? 'p-4 shadow-[0px_4px_16px_rgba(15,23,42,0.05)]' : 'p-3.5 shadow-[0px_2px_8px_rgba(15,23,42,0.04)] hover:bg-surface-container-low'}`}
        >
            <span className={`w-6 shrink-0 text-center font-bold ${isTop5 ? 'text-sm font-black text-on-surface' : 'text-sm text-on-surface-variant'}`}>
                {rank}
            </span>

            <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full font-black ${isTop5 ? 'h-9 w-9 bg-primary-fixed text-sm text-on-primary-fixed' : 'h-8 w-8 bg-surface-container-high text-xs text-on-surface-variant'}`}>
                {playerAvatar(player)
                    ? <img src={playerAvatar(player)!} alt={player.name} className="h-full w-full object-cover" />
                    : player.name.charAt(0)
                }
            </div>

            <div className="min-w-0 flex-grow">
                <p className="truncate text-sm font-bold text-on-surface">{player.name}</p>
                <p className="truncate text-[11px] text-on-surface-variant">
                    {player.activities_joined} activities · {player.matches_played} matches · {player.win_rate}% win
                </p>
            </div>

            <span className={`shrink-0 font-black ${isTop5 ? 'text-base text-primary' : 'text-sm text-on-surface-variant'}`}>
                {player.score}
            </span>
        </Link>
    );
}
