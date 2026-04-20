import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({ status }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="JR Club Login" />
            <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface p-6 text-on-surface">
                <div className="absolute right-[-20%] top-[-10%] z-0 h-96 w-96 rounded-full bg-primary-fixed opacity-30 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-20%] z-0 h-80 w-80 rounded-full bg-secondary-fixed opacity-30 blur-3xl" />

                <div className="z-10 flex w-full max-w-md flex-col gap-8">
                    <header className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)]">
                            <span className="material-symbols-outlined fill text-3xl text-white">shield_person</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter text-on-surface">Welcome Back</h1>
                            <p className="mt-1 text-sm text-on-surface-variant">Sign in to access your JR Club portal.</p>
                        </div>
                    </header>

                    <section className="relative z-20 flex w-full flex-col gap-6 rounded-xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
                        {status ? <p className="text-sm font-bold text-primary">{status}</p> : null}
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 px-3 text-on-surface-variant">mail</span>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        className="w-full rounded-t border-0 border-b border-outline-variant/20 bg-surface-container-low py-3 pl-10 pr-4 text-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-0"
                                        placeholder="member@jrclub.com"
                                        autoComplete="email"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface">Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 px-3 text-on-surface-variant">lock</span>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                        className="w-full rounded-t border-0 border-b border-outline-variant/20 bg-surface-container-low py-3 pl-10 pr-12 text-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-0"
                                        placeholder="password"
                                        autoComplete="current-password"
                                    />
                                    <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 px-3 text-sm text-on-surface-variant">visibility_off</span>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <button
                                disabled={processing}
                                className="mt-4 w-full rounded-full bg-gradient-to-br from-primary to-primary-container py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)] transition-opacity hover:opacity-90 active:scale-[0.98]"
                            >
                                Sign In
                            </button>
                        </form>
                    </section>

                    <footer className="text-center">
                        <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">Need help signing in?</span>
                    </footer>
                </div>
            </main>
        </>
    );
}
