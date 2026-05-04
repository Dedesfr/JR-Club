import AdminLayout from '@/Layouts/AdminLayout';
import Pagination, { PaginatedResponse } from '@/Components/Pagination';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Index({ users }: { users: PaginatedResponse<User> }) {
    return (
        <AdminLayout
            title="Users"
            actions={
                <Link
                    href={route('admin.users.create')}
                    className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-all hover:scale-[0.98] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)]"
                >
                    Create User
                </Link>
            }
        >
            <Head title="Users" />
            <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-outline-variant/20 bg-surface-container-low/50 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="group transition-colors hover:bg-surface-container-low/30">
                                        <td className="px-6 py-4 font-bold text-on-surface">{user.name}</td>
                                        <td className="px-6 py-4 text-on-surface-variant">{user.email}</td>
                                        <td className="px-6 py-4 text-on-surface-variant">{user.role}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
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
            <Pagination items={users} />
        </AdminLayout>
    );
}
