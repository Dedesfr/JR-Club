import JRClubLayout from '@/Layouts/JRClubLayout';
import { Sport, Team } from '@/types/jrclub';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ teams, sports, myTeams, canManage }: { teams: Team[]; sports: Sport[]; myTeams: Team[]; canManage: boolean }) {
    const form = useForm({ name: '', sport_id: sports[0]?.id ?? '' });

    return (
        <JRClubLayout active="Leagues">
            <Head title="Teams" />
            <section className="mt-4 flex flex-col gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Team Management</span>
                        <h1 className="text-3xl font-black leading-none tracking-tight text-on-surface">{teams[0]?.name ?? 'JR Club Teams'}</h1>
                    </div>
                    <div className="rounded-lg bg-surface-container-low p-2">
                        <span className="material-symbols-outlined fill text-primary">sports_soccer</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col"><span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Teams</span><span className="text-4xl font-black tracking-tighter text-on-surface">{teams.length}</span></div>
                    <div className="w-px bg-surface-container-highest" />
                    <div className="flex flex-col"><span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">My Teams</span><span className="text-4xl font-black tracking-tighter text-on-surface">{myTeams.length}</span></div>
                </div>
            </section>

            {canManage ? (
                <form onSubmit={(e) => { e.preventDefault(); form.post(route('teams.store'), { preserveScroll: true, onSuccess: () => form.reset('name') }); }} className="my-6 grid gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                    <input className="rounded-md border-0 bg-surface-container-low" placeholder="Team name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    <select className="rounded-md border-0 bg-surface-container-low" value={form.data.sport_id} onChange={(e) => form.setData('sport_id', Number(e.target.value))}>
                        {sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                    </select>
                    <button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Create Team</button>
                </form>
            ) : null}

            <section className="mt-8 flex flex-col gap-4">
                <h2 className="px-2 text-xl font-bold tracking-tight text-on-surface">Active Roster</h2>
                <div className="flex flex-col gap-2 rounded-lg bg-surface-container-low p-2">
                {teams.map((team) => (
                    <Link key={team.id} href={route('teams.show', team.id)} className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-3 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-sm font-black text-on-primary">{team.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div>
                            <div>
                                <h2 className="font-bold tracking-tight text-on-surface">{team.name}</h2>
                                <p className="text-sm text-on-surface-variant">{team.sport.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="rounded bg-surface-container-high px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface">{team.members_count ?? team.members?.length ?? 0} Members</span>
                            <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                        </div>
                    </Link>
                ))}
                </div>
            </section>
        </JRClubLayout>
    );
}
