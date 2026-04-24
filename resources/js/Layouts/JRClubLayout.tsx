import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { PageProps } from '@/types';

const navItems = [
    ['Activities', 'Events', 'explore', 'activities.index'],
    ['Leagues', 'Leagues', 'emoji_events', 'leagues.index'],
    ['Rankings', 'Standings', 'leaderboard', 'leaderboards.index'],
    ['Profile', 'Profile', 'person', 'profile.show'],
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
        <div className="min-h-screen bg-surface text-on-surface">
            {/* Top Header */}
            <header className="fixed top-0 z-50 w-full bg-white/85 shadow-[0px_12px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href={route('profile.show')} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-black text-on-primary shadow-sm">
                            {user.name.charAt(0)}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-black tracking-normal text-on-surface">JR Club</p>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Event Hub</p>
                        </div>
                    </Link>
                    <nav className="hidden items-center gap-2 md:flex">
                        {navItems.map(([key, label, icon, routeName]) => {
                            const isActive = active === key;

                            return (
                                <Link
                                    key={key}
                                    href={route(routeName)}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold tracking-normal transition-all active:scale-[0.98] ${isActive ? 'bg-primary-fixed text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
                                >
                                    <span className={`material-symbols-outlined text-[17px] ${isActive ? 'fill' : ''}`}>{icon}</span>
                                    {label}
                                </Link>
                            );
                        })}
                        {user.role === 'admin' ? (
                            <Link href={route('admin.dashboard')} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold tracking-normal text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary">
                                <span className="material-symbols-outlined text-[17px]">admin_panel_settings</span>
                                Admin
                            </Link>
                        ) : null}
                    </nav>
                    <div className="flex items-center gap-1">
                        {user.role === 'admin' && actionHref ? (
                            <Link href={actionHref} className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-surface-container-low">
                                <span className="material-symbols-outlined">add</span>
                            </Link>
                        ) : null}
                        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-surface-container-low">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="hidden items-center gap-2 pl-2 md:flex">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-on-primary">{user.name.charAt(0)}</div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-on-surface">{user.name}</p>
                                <p className="text-[0.6875rem] text-on-surface-variant">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="pb-32 pt-20 md:pb-8">
                {user.role === 'admin' && actionHref && (
                    <div className="hidden max-w-md px-4 md:mx-auto md:mb-6 md:flex md:max-w-7xl">
                        <Link href={actionHref} className="ml-auto flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary shadow-sm hover:bg-primary/90">
                            <span className="material-symbols-outlined">add</span>
                            Add New
                        </Link>
                    </div>
                )}
                <main className="mx-auto max-w-md px-4 md:max-w-7xl md:px-6 lg:px-8">{children}</main>
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
            <nav className="fixed bottom-4 left-4 right-4 z-50 rounded-full bg-white/85 px-3 py-2 shadow-[0px_12px_32px_rgba(15,23,42,0.12)] backdrop-blur-md md:hidden">
                <div className="flex w-full items-center justify-between">
                    {navItems.map(([key, label, icon, routeName]) => {
                        const isActive = active === key;

                        return (
                            <Link
                                key={key}
                                href={route(routeName)}
                                className={
                                    isActive
                                        ? 'flex scale-105 flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-2 text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]'
                                        : 'flex flex-col items-center justify-center rounded-full px-4 py-2 text-on-surface-variant transition-all hover:bg-surface-container-low hover:text-primary active:scale-[0.98]'
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
