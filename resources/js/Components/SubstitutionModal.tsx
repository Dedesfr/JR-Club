import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { GameMatch } from '@/types/jrclub';
import { useForm } from '@inertiajs/react';

export default function SubstitutionModal({ match, onClose }: { match: GameMatch; onClose: () => void }) {
    const form = useForm({
        entry_id: '',
        original_player_id: '',
        substitute_id: '',
        reason: '',
    });

    const entries = [
        ...(match.home_entry ? [match.home_entry] : []),
        ...(match.away_entry ? [match.away_entry] : []),
    ];

    const selectedEntry = entries.find(e => e.id.toString() === form.data.entry_id);

    const originalPlayerOptions = selectedEntry 
        ? [
            ...(selectedEntry.player1 ? [{ value: selectedEntry.player1.id.toString(), label: selectedEntry.player1.name }] : []),
            ...(selectedEntry.player2 ? [{ value: selectedEntry.player2.id.toString(), label: selectedEntry.player2.name }] : []),
        ] : [];

    const substituteOptions = selectedEntry && selectedEntry.substitutes
        ? selectedEntry.substitutes.map(sub => ({ value: sub.id.toString(), label: sub.name }))
        : [];

    const entryOptions = entries.map(e => ({ value: e.id.toString(), label: e.label }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('admin.matches.substitutions.store', match.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="md">
            <div className="p-6 bg-surface-container-lowest text-on-surface">
                <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-primary">Match Substitution</h2>
                
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel value="Select Entry / Team" />
                        <div className="mt-1 block w-full">
                            <SelectInput
                                value={form.data.entry_id}
                                onChange={(val) => {
                                    form.setData('entry_id', val);
                                    form.setData('original_player_id', '');
                                    form.setData('substitute_id', '');
                                }}
                                options={[{ value: '', label: 'Select entry' }, ...entryOptions]}
                            />
                        </div>
                        <InputError message={form.errors.entry_id} className="mt-2" />
                    </div>

                    {selectedEntry && (
                        <>
                            <div>
                                <InputLabel value="Original Player" />
                                <div className="mt-1 block w-full">
                                    <SelectInput
                                        value={form.data.original_player_id}
                                        onChange={(val) => form.setData('original_player_id', val)}
                                        options={[{ value: '', label: 'Select player' }, ...originalPlayerOptions]}
                                    />
                                </div>
                                <InputError message={form.errors.original_player_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel value="Substitute Player" />
                                <div className="mt-1 block w-full">
                                    <SelectInput
                                        value={form.data.substitute_id}
                                        onChange={(val) => form.setData('substitute_id', val)}
                                        options={[{ value: '', label: 'Select substitute' }, ...substituteOptions]}
                                    />
                                </div>
                                {substituteOptions.length === 0 && (
                                    <p className="text-xs text-error mt-1">This entry has no declared substitutes.</p>
                                )}
                                <InputError message={form.errors.substitute_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel value="Reason (Optional)" />
                                <TextInput
                                    value={form.data.reason}
                                    onChange={(e) => form.setData('reason', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="e.g. Injury, Sick"
                                />
                                <InputError message={form.errors.reason} className="mt-2" />
                            </div>
                        </>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={form.processing || !form.data.substitute_id}>Confirm Substitution</PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}