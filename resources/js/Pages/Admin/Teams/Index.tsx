import Pagination, { PaginatedResponse } from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Team } from '@/types/jrclub';

export default function Index({ teams }: { teams: PaginatedResponse<Team & { members_count: number }> }) {
    return (
        <AdminLayout
            title="Teams"
            actions={
                <Link
                    href={route('admin.teams.create')}
                    className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] hover:scale-[0.98] transition-all"
                >
                    Create Team
                </Link>
            }
        >
            <Head title="Teams" />
            <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b border-outline-variant/20 bg-surface-container-low/50 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                            <tr>
                                <th className="px-6 py-4">Team</th>
                                <th className="px-6 py-4">Sport</th>
                                <th className="px-6 py-4 text-right">Members</th>
                                <th className="px-6 py-4" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {teams.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                                        No teams found.
                                    </td>
                                </tr>
                            ) : (
                                teams.data.map((team) => (
                                    <tr key={team.id} className="group transition-colors hover:bg-surface-container-low/30">
                                        <td className="px-6 py-4">
                                            <Link href={route('admin.teams.edit', team.id)} className="font-bold text-on-surface transition-colors group-hover:text-primary">
                                                {team.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-on-surface-variant">{team.sport?.name}</td>
                                        <td className="px-6 py-4 text-right font-medium text-on-surface-variant">{team.members_count ?? 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route('admin.teams.edit', team.id)} className="rounded-full bg-surface-container-low px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-colors">
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Delete "${team.name}"? This cannot be undone.`)) {
                                                            router.delete(route('admin.teams.destroy', team.id));
                                                        }
                                                    }}
                                                    className="rounded-full bg-error/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-error transition-colors hover:bg-error hover:text-white"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination items={teams} />
        </AdminLayout>
    );
}
