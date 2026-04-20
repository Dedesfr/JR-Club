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
        <div className="min-h-screen bg-surface pb-32 pt-20 text-on-surface">
            <header className="fixed top-0 z-50 w-full bg-white/85 shadow-sm backdrop-blur-md dark:bg-slate-900/85">
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

            <main className="mx-auto max-w-md px-4">{children}</main>

            {installPrompt ? (
                <button
                    onClick={() => {
                        installPrompt.prompt();
                        setInstallPrompt(null);
                    }}
                    className="fixed bottom-24 right-4 z-50 rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold text-on-primary shadow-[0px_12px_24px_rgba(0,86,164,0.25)]"
                >
                    Install JR Club
                </button>
            ) : null}

            <nav className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 rounded-full bg-white/80 px-4 py-2 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)] backdrop-blur-lg dark:bg-slate-900/80">
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
