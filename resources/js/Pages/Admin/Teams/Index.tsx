import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Team } from '@/types/jrclub';

export default function Index({ teams }: { teams: { data: (Team & { members_count: number })[] } }) {
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
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-surface-container-low/50 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant border-b border-outline-variant/20">
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
                                    <tr key={team.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={route('admin.teams.edit', team.id)} className="font-bold text-on-surface group-hover:text-primary transition-colors">
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
                                                    className="rounded-full bg-error/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-error hover:bg-error hover:text-white transition-colors"
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
        </AdminLayout>
    );
}
