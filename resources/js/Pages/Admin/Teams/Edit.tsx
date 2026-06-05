import SelectInput from '@/Components/SelectInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Sport, Team } from '@/types/jrclub';
import { Head, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

type UserOption = { id: number; name: string; email: string };
type SportSquads = Record<number, number[]>;
type SportLogos = Record<number, string>;

function SportLogoUpload({ team, sport, logoUrl }: { team: Team; sport: Sport; logoUrl?: string }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);

        const data = new FormData();
        data.append('logo', file);

        router.post(route('admin.teams.sports.logo.store', [team.id, sport.id]), data, {
            preserveScroll: true,
            onSuccess: () => { if (inputRef.current) inputRef.current.value = ''; },
            onError: (errors) => setError(errors.logo ?? 'Upload failed.'),
            onFinish: () => setUploading(false),
        });
    }

    return (
        <div className="flex items-center gap-4">
            {logoUrl ? (
                <img src={logoUrl} alt={sport.name} className="h-14 w-14 rounded-xl object-cover ring-1 ring-outline-variant/20" />
            ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant">
                    <span className="material-symbols-outlined text-2xl">image</span>
                </div>
            )}
            <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                    {logoUrl ? 'Change logo' : 'Upload logo'}
                </p>
                <p className="mt-0.5 text-xs text-on-surface-variant/60">PNG, JPG — max 2 MB</p>
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="mt-1.5 rounded-full bg-surface-container-low px-3 py-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
                >
                    {uploading ? 'Uploading…' : 'Choose file'}
                </button>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {error && <p className="mt-1 text-xs text-error">{error}</p>}
            </div>
        </div>
    );
}

export default function Edit({
    team,
    sport_squads,
    sport_logos,
    users,
    sports,
}: {
    team: Team;
    sport_squads: SportSquads;
    sport_logos: SportLogos;
    users: UserOption[];
    sports: Sport[];
}) {
    const form = useForm<{ name: string; sport_ids: number[] }>({
        name: team.name,
        sport_ids: (team.sports ?? []).map((s) => s.id),
    });
    const memberForm = useForm({ user_id: '' });

    const globalMembers = team.members ?? [];
    const userOptions = users
        .filter((u) => !globalMembers.some((m) => m.id === u.id))
        .map((u) => ({ value: String(u.id), label: `${u.name} (${u.email})` }));

    function toggleSport(id: number) {
        const ids = form.data.sport_ids;
        form.setData('sport_ids', ids.includes(id) ? ids.filter((s) => s !== id) : [...ids, id]);
    }

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
                        onSubmit={(e) => { e.preventDefault(); form.patch(route('admin.teams.update', team.id)); }}
                        className="p-6 space-y-5"
                    >
                        <label className="block">
                            <span className="block mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Name</span>
                            <input
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3 focus:border-primary focus:outline-none focus:ring-0 transition-colors text-on-surface"
                            />
                        </label>
                        <div>
                            <span className="block mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Sports</span>
                            <div className="flex flex-wrap gap-2">
                                {sports.map((sport) => {
                                    const selected = form.data.sport_ids.includes(sport.id);
                                    return (
                                        <button key={sport.id} type="button" onClick={() => toggleSport(sport.id)}
                                            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${selected ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}>
                                            {sport.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={form.processing}
                                className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-on-primary disabled:opacity-50">
                                Save
                            </button>
                        </div>
                    </form>
                </div>

                {/* Global Roster */}
                <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="bg-surface-container-low/30 px-6 py-4 border-b border-outline-variant/10">
                        <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary">Global Roster</h3>
                        <p className="mt-0.5 text-[0.6875rem] text-on-surface-variant">All members of this team. Assign them to sport squads below.</p>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
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
                        <button type="submit" disabled={!memberForm.data.user_id || memberForm.processing}
                            className="rounded-full bg-surface-container-low px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40">
                            Add
                        </button>
                    </form>
                    {globalMembers.length === 0 ? (
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
                                {globalMembers.map((member) => (
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

                {/* Sport Squads */}
                {(team.sports ?? []).map((sport) => {
                    const assignedIds: number[] = sport_squads[sport.id] ?? [];
                    const assignedMembers = globalMembers.filter((m) => assignedIds.includes(m.id));
                    const unassignedMembers = globalMembers.filter((m) => !assignedIds.includes(m.id));

                    return (
                        <div key={sport.id} className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.04)] overflow-hidden">
                            <div className="bg-surface-container-low/30 px-6 py-4 border-b border-outline-variant/10 flex items-center gap-3">
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-widest text-primary">{sport.name}</span>
                                <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Squad</h3>
                            </div>

                            {/* Logo upload */}
                            <div className="px-6 py-5 border-b border-outline-variant/10">
                                <SportLogoUpload team={team} sport={sport} logoUrl={sport_logos[sport.id]} />
                            </div>

                            {/* Add to squad */}
                            {unassignedMembers.length > 0 && (
                                <div className="px-6 py-4 border-b border-outline-variant/10">
                                    <p className="mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Add from roster</p>
                                    <div className="flex flex-wrap gap-2">
                                        {unassignedMembers.map((member) => (
                                            <button
                                                key={member.id}
                                                type="button"
                                                onClick={() => router.post(route('admin.teams.sports.members.store', [team.id, sport.id, member.id]), {}, { preserveScroll: true })}
                                                className="rounded-full bg-surface-container-low px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors"
                                            >
                                                + {member.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Assigned squad members */}
                            {assignedMembers.length === 0 ? (
                                <p className="px-6 py-6 text-center text-sm text-on-surface-variant">No members assigned to this squad yet.</p>
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
                                        {assignedMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-surface-container-low/30 transition-colors">
                                                <td className="px-6 py-3 font-medium text-on-surface">{member.name}</td>
                                                <td className="px-6 py-3 text-on-surface-variant">{member.email ?? '—'}</td>
                                                <td className="px-6 py-3 text-right">
                                                    <button
                                                        onClick={() => router.delete(route('admin.teams.sports.members.destroy', [team.id, sport.id, member.id]), { preserveScroll: true })}
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
                    );
                })}
            </div>
        </AdminLayout>
    );
}
