import Pagination, { PaginatedResponse } from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Sport } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';

export default function Index({ sports }: { sports: PaginatedResponse<Sport> }) {
    return (
        <AdminLayout
            title="Sports"
            actions={
                <Link
                    href={route('admin.sports.create')}
                    className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-all hover:scale-[0.98] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)]"
                >
                    Create Sport
                </Link>
            }
        >
            <Head title="Sports" />
            <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-outline-variant/20 bg-surface-container-low/50 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Icon</th>
                                <th className="px-6 py-4">Max Players</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {sports.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                                        No sports found.
                                    </td>
                                </tr>
                            ) : (
                                sports.data.map((sport) => (
                                    <tr key={sport.id} className="group transition-colors hover:bg-surface-container-low/30">
                                        <td className="px-6 py-4 font-bold text-on-surface">{sport.name}</td>
                                        <td className="px-6 py-4 text-on-surface-variant">{sport.icon}</td>
                                        <td className="px-6 py-4 text-on-surface-variant">{sport.max_players_per_team}</td>
                                        <td className="max-w-xs px-6 py-4 text-on-surface-variant">
                                            <span className="block truncate">{sport.description ?? '-'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={route('admin.sports.edit', sport.id)}
                                                className="rounded-full bg-surface-container-low px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-container"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination items={sports} />
        </AdminLayout>
    );
}
