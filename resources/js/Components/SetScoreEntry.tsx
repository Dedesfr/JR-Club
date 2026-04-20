import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function SetScoreEntry({ matchId, label, homeLabel = 'Home', awayLabel = 'Away' }: { matchId: number; label: string; homeLabel?: string | null; awayLabel?: string | null }) {
    const [open, setOpen] = useState(false);
    const form = useForm({ home_points: '', away_points: '' });

    return (
        <>
            <button onClick={() => setOpen(true)} className="rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-primary">
                {label}
            </button>

            <Modal show={open} onClose={() => setOpen(false)}>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(route('admin.matches.sets.store', matchId), {
                            preserveScroll: true,
                            onSuccess: () => {
                                setOpen(false);
                                form.reset();
                            },
                        });
                    }}
                    className="grid gap-4 p-6"
                >
                    <div>
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">Live scoring</p>
                        <h3 className="text-xl font-black tracking-tight text-on-surface">Record set score</h3>
                    </div>
                    <label className="grid gap-2 text-sm font-medium text-on-surface">
                        <span>{homeLabel ?? 'Home'} points</span>
                        <input type="number" min={0} value={form.data.home_points} onChange={(event) => form.setData('home_points', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-on-surface">
                        <span>{awayLabel ?? 'Away'} points</span>
                        <input type="number" min={0} value={form.data.away_points} onChange={(event) => form.setData('away_points', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" />
                    </label>
                    <button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">
                        Save Set
                    </button>
                </form>
            </Modal>
        </>
    );
}
