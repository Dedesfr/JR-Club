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
            <AdminLayout 
            title="Tournaments" 
            actions={
                <Link href={route('admin.leagues.create')} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all">
                    Create Tournament
                </Link>
            }
        >
            <Head title="Admin Tournaments" />
            
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-surface-container-low/50 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant border-b border-outline-variant/20">
                            <tr>
                                <th className="px-6 py-4">Tournament</th>
                                <th className="px-6 py-4">Branch</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Entries</th>
                                <th className="px-6 py-4 text-right">Teams</th>
                                <th className="px-6 py-4 text-right">Matches</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {leagues.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                                        No tournaments found.
                                    </td>
                                </tr>
                            ) : (
                                leagues.map((league) => (
                                    <tr key={league.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={route('admin.leagues.show', league.id)} className="block">
                                                <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{league.name}</p>
                                                <p className="text-[0.75rem] text-on-surface-variant mt-0.5">{league.category ? categoryLabels[league.category] : league.sport?.name}</p>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <BranchBadge name={league.branch?.name} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-surface-container-low px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                                                {league.stage ?? league.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-on-surface-variant">{league.entries_count ?? 0}</td>
                                        <td className="px-6 py-4 text-right font-medium text-on-surface-variant">{league.teams_count ?? 0}</td>
                                        <td className="px-6 py-4 text-right font-medium text-on-surface-variant">{league.matches_count ?? 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

function BranchBadge({ name }: { name?: string }) {
    return (
        <span className="rounded-full bg-surface-container-low px-2.5 py-1 text-xs font-bold text-on-surface-variant">
            {name ?? 'National'}
        </span>
    );
}
