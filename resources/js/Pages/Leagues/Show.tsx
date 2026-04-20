import JRClubLayout from '@/Layouts/JRClubLayout';
import { League, Standing } from '@/types/jrclub';
import { Head } from '@inertiajs/react';

export default function Show({ league, standings }: { league: League; standings: Standing[] }) {
    return (
        <JRClubLayout active="Leagues">
            <Head title={league.name} />
            <h1 className="mb-2 text-3xl font-black tracking-tight">{league.name}</h1>
            <p className="mb-6 text-on-surface-variant">{league.description}</p>
            <div className="space-y-3">
                {standings.map((row, index) => (
                    <div key={row.team.id} className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                        <span className="font-bold">{index + 1}. {row.team.name}</span>
                        <span className="text-primary font-black">{row.points} pts</span>
                    </div>
                ))}
            </div>
        </JRClubLayout>
    );
}
