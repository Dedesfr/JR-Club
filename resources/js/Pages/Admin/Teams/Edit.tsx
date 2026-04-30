import SelectInput from '@/Components/SelectInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Team } from '@/types/jrclub';
import { Head, router, useForm } from '@inertiajs/react';

type UserOption = { id: number; name: string; email: string };

export default function Edit({ team, users }: { team: Team; users: UserOption[] }) {
    const form = useForm({ name: team.name });
    const memberForm = useForm({ user_id: '' });
    const userOptions = users
        .filter((u) => !(team.members ?? []).some((m) => m.id === u.id))
        .map((u) => ({ value: String(u.id), label: `${u.name} (${u.email})` }));

    return (
        <AdminLayout title={`Edit ${team.name}`}>
            <Head title={team.name} />
            <div className="space-y-6">
                {/* Team Details */}
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="bg-surface-container-low/30 px-6 py-4 border-b border-outline-variant/10">
                        <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary">Team Details</h3>
                    </div>
                    <form
                        onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.teams.update', team.id)); }}
                        className="p-6 flex gap-4 items-end"
                    >
                        <label className="flex-1 block">
                            <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Name</span>
                            <input
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-on-primary disabled:opacity-50"
                        >
                            Save
                        </button>
                    </form>
                </div>

                {/* Members */}
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="bg-surface-container-low/30 px-6 py-4 border-b border-outline-variant/10">
                        <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary">Roster</h3>
                    </div>

                    {/* Add member form */}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            memberForm.post(route('admin.teams.members.store', team.id), {
                                preserveScroll: true,
                                onSuccess: () => memberForm.reset(),
                            });
                        }}
                        className="p-6 flex gap-4 items-end border-b border-outline-variant/10"
                    >
                        <label className="flex-1 block">
                            <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Add member</span>
                            <SelectInput
                                options={userOptions}
                                value={memberForm.data.user_id}
                                onChange={(value) => memberForm.setData('user_id', value || '')}
                                placeholder="Select user"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={!memberForm.data.user_id || memberForm.processing}
                            className="rounded-full bg-surface-container-low px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
                        >
                            Add
                        </button>
                    </form>

                    {/* Members list */}
                    {(team.members ?? []).length === 0 ? (
                        <p className="px-6 py-8 text-center text-sm text-on-surface-variant">No members yet.</p>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant border-b border-outline-variant/10">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {(team.members ?? []).map((member) => (
                                    <tr key={member.id} className="hover:bg-surface-container-low/30 transition-colors">
                                        <td className="px-6 py-3 font-medium text-on-surface">{member.name}</td>
                                        <td className="px-6 py-3 text-on-surface-variant">{member.email ?? '—'}</td>
                                        <td className="px-6 py-3 text-right">
                                            <button
                                                onClick={() => router.delete(route('admin.teams.members.destroy', [team.id, member.id]), { preserveScroll: true })}
                                                className="rounded-full bg-error/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-error hover:bg-error hover:text-white transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
