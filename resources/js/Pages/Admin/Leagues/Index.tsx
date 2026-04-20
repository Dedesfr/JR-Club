import AdminLayout from '@/Layouts/AdminLayout';
import { League } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';

const categoryLabels: Record<NonNullable<League['category']>, string> = {
    MS: 'Single Putra',
    WS: 'Single Putri',
    MD: 'Ganda Putra',
    WD: 'Ganda Putri',
    XD: 'Ganda Campuran',
};

export default function Index({ leagues }: { leagues: (League & { teams_count: number; entries_count: number; matches_count: number })[] }) {
    return (
        <AdminLayout title="Leagues">
            <Head title="Admin Leagues" />
            <div className="mb-6 flex justify-end">
                <Link href={route('admin.leagues.create')} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Create League</Link>
            </div>
            <div className="grid gap-4">
                {leagues.map((league) => (
                    <Link key={league.id} href={route('admin.leagues.show', league.id)} className="rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">{league.category ? categoryLabels[league.category] : league.sport?.name}</p>
                                <h3 className="text-xl font-black tracking-tight text-on-surface">{league.name}</h3>
                            </div>
                            <span className="rounded-full bg-surface-container-low px-3 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">{league.stage ?? league.status}</span>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <Stat label="Entries" value={league.entries_count ?? 0} />
                            <Stat label="Teams" value={league.teams_count ?? 0} />
                            <Stat label="Matches" value={league.matches_count ?? 0} />
                        </div>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return <div className="rounded-xl bg-surface-container-low px-4 py-3"><p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-primary">{value}</p></div>;
}
