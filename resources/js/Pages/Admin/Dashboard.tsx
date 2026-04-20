import AdminLayout from '@/Layouts/AdminLayout';
import { League } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ kpis, recentLeagues }: { kpis: Record<string, number>; recentLeagues: League[] }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    ['Active leagues', kpis.activeLeagues],
                    ['Registered entries', kpis.registeredEntries],
                    ['Upcoming matches', kpis.upcomingMatches],
                    ['Live matches', kpis.liveMatches],
                ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</p>
                        <p className="mt-3 text-4xl font-black tracking-tight text-primary">{value}</p>
                    </div>
                ))}
            </div>

            <section className="mt-6 rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Recent leagues</p>
                        <h3 className="text-xl font-black tracking-tight text-on-surface">Latest competitions</h3>
                    </div>
                    <Link href={route('admin.leagues.create')} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-primary">New league</Link>
                </div>
                <div className="grid gap-3">
                    {recentLeagues.map((league) => (
                        <Link key={league.id} href={route('admin.leagues.show', league.id)} className="rounded-xl bg-surface-container-low p-4">
                            <p className="text-sm font-bold text-on-surface">{league.name}</p>
                            <p className="text-xs uppercase tracking-widest text-on-surface-variant">{league.sport?.name} • {league.status}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </AdminLayout>
    );
}
