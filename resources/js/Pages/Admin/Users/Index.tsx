import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { User } from '@/types';

export default function Index({ users }: { users: { data: User[] } }) {
    return <AdminLayout title="Users"><Head title="Users" /><div className="grid gap-3">{users.data.map((user) => <Link key={user.id} href={route('admin.users.edit', user.id)} className="rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]"><p className="font-bold text-on-surface">{user.name}</p><p className="text-xs uppercase tracking-widest text-on-surface-variant">{user.email} • {user.role}</p></Link>)}</div></AdminLayout>;
}
