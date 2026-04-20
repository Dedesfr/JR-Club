import JRClubLayout from '@/Layouts/JRClubLayout';
import { Team } from '@/types/jrclub';
import { Head } from '@inertiajs/react';

export default function Show({ team }: { team: Team }) {
    return (
        <JRClubLayout active="Leagues">
            <Head title={team.name} />
            <section className="mt-4 flex flex-col gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Team Management</span>
                        <h1 className="text-3xl font-black leading-none tracking-tight text-on-surface">{team.name}</h1>
                    </div>
                    <div className="rounded-lg bg-surface-container-low p-2">
                        <span className="material-symbols-outlined fill text-primary">{team.sport.icon}</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col"><span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Players</span><span className="text-4xl font-black tracking-tighter text-on-surface">{team.members?.length ?? 0}</span></div>
                    <div className="w-px bg-surface-container-highest" />
                    <div className="flex flex-col"><span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Sport</span><span className="text-2xl font-black tracking-tighter text-on-surface">{team.sport.name}</span></div>
                </div>
            </section>
            <h2 className="mb-4 mt-8 px-2 text-xl font-bold tracking-tight">Active Roster</h2>
            <div className="flex flex-col gap-2 rounded-lg bg-surface-container-low p-2">
                {(team.members ?? []).map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-3 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container font-bold text-on-primary">{member.name.charAt(0)}</div>
                            <div>
                                <h3 className="font-bold tracking-tight text-on-surface">{member.name}</h3>
                                <p className="text-sm text-on-surface-variant">{member.email}</p>
                            </div>
                        </div>
                        <span className={`rounded px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] ${member.pivot?.role === 'captain' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}>{member.pivot?.role ?? 'member'}</span>
                    </div>
                ))}
            </div>
        </JRClubLayout>
    );
}
