import AdminLayout from '@/Layouts/AdminLayout';
import { Activity } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';

export default function Index({ activities }: { activities: { data: Activity[] } }) {
    return <AdminLayout title="Activities"><Head title="Activities" /><div className="grid gap-3">{activities.data.map((activity) => <Link key={activity.id} href={route('admin.activities.edit', activity.id)} className="rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]"><p className="font-bold text-on-surface">{activity.title}</p><p className="text-xs uppercase tracking-widest text-on-surface-variant">{activity.sport?.name} • {activity.status}</p></Link>)}</div></AdminLayout>;
}
