import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { PageProps } from '@/types';

const navItems = [
    ['Activities', 'explore', 'activities.index'],
    ['Leagues', 'emoji_events', 'leagues.index'],
    ['Rankings', 'leaderboard', 'leaderboards.index'],
    ['Profile', 'person', 'profile.show'],
];

export default function JRClubLayout({ children, active, actionHref }: PropsWithChildren<{ active: string; actionHref?: string }>) {
    const user = usePage<PageProps>().props.auth.user;
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    return (
        <div className="min-h-screen bg-surface text-on-surface md:flex">
            {/* Mobile Header */}
            <header className="fixed top-0 z-50 w-full bg-white/85 shadow-sm backdrop-blur-md dark:bg-slate-900/85 md:hidden">
                <div className="flex w-full items-center justify-between px-6 py-4">
                    <Link href={route('profile.show')} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-black text-on-primary shadow-sm">
                            {user.name.charAt(0)}
                        </div>
                        <span className="hidden text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant sm:block">{user.role}</span>
                    </Link>
                    <Link href={route('activities.index')} className="text-xl font-black uppercase tracking-tighter text-primary">JR CLUB</Link>
                    <div className="flex items-center gap-2">
                        {user.role === 'admin' && actionHref ? (
                            <Link href={actionHref} className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-surface-container-low">
                                <span className="material-symbols-outlined">add</span>
                            </Link>
                        ) : null}
                        <span className="material-symbols-outlined text-primary">notifications</span>
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden w-72 flex-col justify-between border-r border-outline-variant/30 bg-surface-container-lowest p-5 md:flex">
                <div>
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">App Area</p>
                            <h1 className="text-2xl font-black tracking-tight text-on-surface">JR Club</h1>
                        </div>
                        {user.role === 'admin' && (
                            <Link href={route('admin.dashboard')} className="flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                            </Link>
                        )}
                    </div>

                    <nav className="grid gap-2">
                        {navItems.map(([label, icon, routeName]) => {
                            const isActive = active === label;

                            return (
                                <Link
                                    key={label}
                                    href={route(routeName)}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold tracking-tight ${isActive ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]' : 'bg-surface text-on-surface-variant hover:bg-surface-container-low'}`}
                                >
                                    <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>{icon}</span>
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto rounded-xl bg-surface-container-low p-4 text-sm">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Signed in as</p>
                    <p className="mt-1 font-bold text-on-surface">{user.name}</p>
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant">{user.role}</p>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 pb-32 pt-20 md:pb-8 md:pt-8">
                {user.role === 'admin' && actionHref && (
                    <div className="hidden max-w-md px-4 md:mx-auto md:mb-6 md:flex md:max-w-5xl lg:max-w-6xl">
                        <Link href={actionHref} className="ml-auto flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary shadow-sm hover:bg-primary/90">
                            <span className="material-symbols-outlined">add</span>
                            Add New
                        </Link>
                    </div>
                )}
                <main className="mx-auto max-w-md px-4 md:max-w-5xl lg:max-w-6xl">{children}</main>
            </div>

            {installPrompt ? (
                <button
                    onClick={() => {
                        installPrompt.prompt();
                        setInstallPrompt(null);
                    }}
                    className="fixed bottom-24 right-4 z-50 rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold text-on-primary shadow-[0px_12px_24px_rgba(0,86,164,0.25)] md:bottom-8"
                >
                    Install JR Club
                </button>
            ) : null}

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 rounded-full bg-white/80 px-4 py-2 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)] backdrop-blur-lg dark:bg-slate-900/80 md:hidden">
                <div className="flex w-full items-center justify-between">
                    {navItems.map(([label, icon, routeName]) => {
                        const isActive = active === label;

                        return (
                            <Link
                                key={label}
                                href={route(routeName)}
                                className={
                                    isActive
                                        ? 'flex scale-95 flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-2 text-on-primary shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)]'
                                        : 'flex scale-95 flex-col items-center justify-center rounded-full px-4 py-2 text-slate-400 transition-all hover:bg-slate-100/50 hover:text-primary dark:text-slate-500'
                                }
                            >
                                <span className={`material-symbols-outlined mb-1 text-[20px] ${isActive ? 'fill' : ''}`}>{icon}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
