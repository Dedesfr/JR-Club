import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Team } from '@/types/jrclub';

export default function Index({ teams }: { teams: { data: Team[] } }) {
    return <AdminLayout title="Teams"><Head title="Teams" /><div className="grid gap-3">{teams.data.map((team) => <Link key={team.id} href={route('admin.teams.edit', team.id)} className="rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]"><p className="font-bold text-on-surface">{team.name}</p><p className="text-xs uppercase tracking-widest text-on-surface-variant">{team.sport?.name}</p></Link>)}</div></AdminLayout>;
}
