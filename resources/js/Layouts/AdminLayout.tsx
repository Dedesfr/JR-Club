import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import { PageProps } from '@/types';

const links = [
    { label: 'Dashboard', icon: 'dashboard', route: 'admin.dashboard' },
    { label: 'Leagues', icon: 'emoji_events', route: 'admin.leagues.index' },
    { label: 'Sports', icon: 'sports', route: 'admin.sports.index' },
    { label: 'Activities', icon: 'explore', route: 'admin.activities.index' },
    { label: 'Users', icon: 'group', route: 'admin.users.index' },
    { label: 'Teams', icon: 'shield', route: 'admin.teams.index' },
];

export default function AdminLayout({ children, title, actions }: PropsWithChildren<{ title: string; actions?: React.ReactNode }>) {
    const { auth } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            {/* Mobile Header */}
            <header className="flex items-center justify-between border-b border-outline-variant/30 bg-surface px-4 py-3 md:hidden">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container-low">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div>
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">Admin</p>
                        <h1 className="text-lg font-black tracking-tight text-on-surface">JR Club</h1>
                    </div>
                </div>
                <Link href={route('activities.index')} className="rounded-full bg-surface-container-low px-3 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    App
                </Link>
            </header>

            <div className="flex min-h-screen flex-col md:flex-row">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 z-40 bg-black/50 md:hidden" 
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col justify-between transform border-r border-outline-variant/30 bg-surface-container-lowest p-5 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">Admin Area</p>
                            <h1 className="text-2xl font-black tracking-tight text-on-surface">JR Club</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href={route('activities.index')} className="hidden rounded-full bg-surface-container-low px-3 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant md:block">
                                App
                            </Link>
                            <button onClick={() => setSidebarOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container md:hidden">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>

                    <nav className="grid gap-2">
                        {links.map((link) => (
                            <Link
                                key={link.route}
                                href={route(link.route)}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold tracking-tight ${route().current(link.route) ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]' : 'bg-surface text-on-surface-variant hover:bg-surface-container-low'}`}
                            >
                                <span className="material-symbols-outlined">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto rounded-xl bg-surface-container-low p-4 text-sm">
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Signed in as</p>
                        <p className="mt-1 font-bold text-on-surface">{auth.user.name}</p>
                        <p className="text-xs uppercase tracking-widest text-on-surface-variant">{auth.user.role}</p>
                    </div>
                </aside>

                <main className="flex-1 p-4 md:p-8">
                    <div className="mb-6 flex items-center justify-between rounded-xl bg-white/85 px-5 py-4 shadow-[0px_12px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                        <div>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Admin</p>
                            <h2 className="text-2xl font-black tracking-tight text-on-surface">{title}</h2>
                        </div>
                        {actions && <div>{actions}</div>}
                    </div>

                    {children}
                </main>
            </div>
        </div>
    );
}
