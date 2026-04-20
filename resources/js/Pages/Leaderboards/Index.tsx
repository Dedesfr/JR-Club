import JRClubLayout from '@/Layouts/JRClubLayout';
import { Head, Link } from '@inertiajs/react';

type Player = { id: number; name: string; activities_joined: number; matches_played: number; win_rate: number; score: number };

export default function Index({ players }: { players: Player[] }) {
    return (
        <JRClubLayout active="Rankings">
            <Head title="Leaderboards" />
            <section className="space-y-4 pt-4">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-on-surface">Leaderboards</h1>
                <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
                    <Link href={route('leaderboards.index')} className="shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-br from-primary to-primary-container text-on-primary">Global Players</Link>
                    <Link href={route('leaderboards.leagues')} className="shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest bg-surface-container-high text-on-surface">League Standings</Link>
                </div>
            </section>

            <section className="relative my-12 flex h-64 items-end justify-center gap-2">
                {players[1] ? <PodiumPlayer player={players[1]} place="2nd" size="secondary" /> : null}
                {players[0] ? <PodiumPlayer player={players[0]} place="1st" size="primary" /> : null}
                {players[2] ? <PodiumPlayer player={players[2]} place="3rd" size="tertiary" /> : null}
            </section>

            <section className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Players</h2>
                {players.slice(3).map((player, index) => (
                    <Link key={player.id} href={route('profile.public', player.id)} className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                        <div>
                            <p className="font-bold">{index + 4}. {player.name}</p>
                            <p className="text-xs text-on-surface-variant">{player.activities_joined} activities - {player.matches_played} matches - {player.win_rate}% win rate</p>
                        </div>
                        <span className="text-xl font-black text-primary">{player.score}</span>
                    </Link>
                ))}
            </section>
        </JRClubLayout>
    );
}

function PodiumPlayer({ player, place, size }: { player: Player; place: string; size: 'primary' | 'secondary' | 'tertiary' }) {
    const primary = size === 'primary';
    const height = primary ? 'h-52 w-28' : size === 'secondary' ? 'h-40 w-24' : 'h-36 w-24';

    return (
        <div className={`relative flex flex-col items-center rounded-xl ${height} ${primary ? 'z-20 bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-950 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)]' : 'z-10 bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]'}`}>
            <div className={`absolute ${primary ? '-top-10' : '-top-8'} rounded-full bg-surface-container-lowest p-1 shadow-sm`}>
                <div className={`${primary ? 'h-16 w-16' : 'h-14 w-14'} flex items-center justify-center rounded-full bg-primary-fixed text-xl font-black text-on-primary-fixed`}>
                    {player.name.charAt(0)}
                </div>
            </div>
            {primary ? <div className="absolute -right-4 -top-12 flex h-8 w-8 rotate-12 items-center justify-center rounded-full bg-yellow-100 text-xs font-black text-yellow-900 shadow-sm">#1</div> : null}
            <div className={`mt-8 flex w-full flex-grow flex-col items-center justify-center rounded-b-xl ${primary ? '' : size === 'tertiary' ? 'bg-surface-container-high' : 'bg-surface-container-low'}`}>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">{place}</span>
                <span className={`${primary ? 'text-4xl' : 'text-2xl'} font-black tracking-tighter`}>{player.score}</span>
                <span className="text-[10px] font-bold uppercase opacity-80">Pts</span>
                {primary ? <span className="mt-2 px-2 text-center text-sm font-bold uppercase tracking-widest">{player.name}</span> : null}
            </div>
        </div>
    );
}
