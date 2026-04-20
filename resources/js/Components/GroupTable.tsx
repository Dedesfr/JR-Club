import { LeagueStandingGroup } from '@/types/jrclub';
import { router } from '@inertiajs/react';

export default function GroupTable({ leagueId, standings }: { leagueId: number; standings: LeagueStandingGroup[] }) {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {standings.map((group) => (
                <section key={group.group} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                    <div className="bg-surface-container-low px-4 py-3">
                        <h3 className="text-sm font-black uppercase tracking-[-0.02em] text-on-surface">{group.group}</h3>
                    </div>
                    <div className="divide-y divide-outline-variant/20">
                        {group.entries.map((row, index) => (
                            <div key={row.id} className="grid gap-3 px-4 py-3 md:grid-cols-[auto,1fr,auto,auto] md:items-center">
                                <div className="text-lg font-black text-primary">{index + 1}</div>
                                <div>
                                    <p className="font-bold text-on-surface">{row.entry.label}</p>
                                    <p className="text-xs uppercase tracking-widest text-on-surface-variant">{row.points} pts</p>
                                </div>
                                <input
                                    type="number"
                                    min={1}
                                    defaultValue={row.manual_advance_rank ?? ''}
                                    onBlur={(event) => {
                                        router.patch(route('admin.leagues.groups.update', [leagueId, row.id]), { manual_advance_rank: event.target.value || null }, { preserveScroll: true });
                                    }}
                                    className="rounded-lg border-0 bg-surface-container-low px-3 py-2 text-sm"
                                />
                                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Manual rank</span>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
