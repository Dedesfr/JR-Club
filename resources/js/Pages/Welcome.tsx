import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="JR Club" />
            <main className="min-h-screen bg-surface text-on-surface">
                <header className="fixed left-0 right-0 top-0 z-50 bg-white/85 shadow-[0px_12px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-container text-sm font-black tracking-normal text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]">
                                JR
                            </div>
                            <div>
                                <p className="text-base font-black tracking-normal text-on-surface">JR Club</p>
                                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Event Hub</p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link href={route('activities.index')} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-transform active:scale-[0.98]">
                                    Open Club
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="rounded-full px-4 py-2 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-transform active:scale-[0.98]">
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <section className="relative min-h-screen overflow-hidden pt-16">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,86,164,0.9),rgba(0,110,207,0.68)_54%,rgba(45,49,51,0.72)),url('https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
                    <div className="absolute -right-32 top-12 h-96 w-96 rounded-full border border-white/10" />
                    <div className="absolute bottom-0 right-16 h-56 w-56 rounded-full border border-white/10" />

                    <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-end gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
                        <div className="pb-8">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-white backdrop-blur-md">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                Season Live
                            </span>
                            <h1 className="mt-5 max-w-4xl text-[3.5rem] font-black leading-[0.9] tracking-normal text-white sm:text-7xl lg:text-8xl">
                                Play hard. Win together.
                            </h1>
                            <p className="mt-5 max-w-xl text-base leading-7 text-white/84">
                                Corporate sports events, league standings, and registrations for JR Club members across every active fixture.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href={auth.user ? route('activities.index') : route('login')} className="rounded-full bg-white px-6 py-3 text-sm font-black text-primary shadow-[0px_12px_24px_rgba(0,0,0,0.18)] transition-transform active:scale-[0.98]">
                                    Browse Activities
                                </Link>
                                <Link href={auth.user ? route('leaderboards.index') : route('register')} className="rounded-full bg-white/15 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20">
                                    View Rankings
                                </Link>
                            </div>
                        </div>

                        <div className="mb-8 grid grid-cols-2 gap-3 lg:mb-0">
                            <Stat label="Fixtures" value="Live" />
                            <Stat label="Sports" value="Multi" />
                            <Stat label="Leagues" value="Ranked" />
                            <Stat label="Teams" value="Active" />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/50 bg-white/85 p-4 text-on-surface shadow-[0px_12px_32px_rgba(15,23,42,0.12)] backdrop-blur-md">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</p>
            <p className="mt-2 text-2xl font-black tracking-normal text-primary">{value}</p>
        </div>
    );
}
