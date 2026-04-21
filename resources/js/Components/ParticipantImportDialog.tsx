import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { League } from '@/types/jrclub';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function ParticipantImportDialog({ league, onClose }: { league: League; onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm<{ file: File | null; import_errors?: string[] }>({
        file: null,
    });
    const fileInput = useRef<HTMLInputElement>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.leagues.participants.import', league.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="lg">
            <div className="p-6 bg-surface-container-lowest text-on-surface">
                <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-primary">Import/Export Participants</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <a 
                        href={route('admin.leagues.participants.template')} 
                        download
                        className="flex-1 text-center py-3 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface font-bold uppercase tracking-widest text-xs hover:bg-surface-variant transition-colors"
                    >
                        Download Template
                    </a>
                    <a 
                        href={route('admin.leagues.participants.export', league.id)} 
                        download
                        className="flex-1 text-center py-3 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface font-bold uppercase tracking-widest text-xs hover:bg-surface-variant transition-colors"
                    >
                        Export Current
                    </a>
                </div>

                <div className="border-t border-outline-variant pt-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Import Excel File</h3>
                    
                    <form onSubmit={submit} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                className="hidden"
                                ref={fileInput}
                                onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                            />
                            <SecondaryButton 
                                type="button" 
                                onClick={() => fileInput.current?.click()}
                                className="!bg-surface-variant"
                            >
                                Select File
                            </SecondaryButton>
                            <span className="text-sm text-on-surface-variant truncate flex-1">
                                {data.file ? data.file.name : 'No file chosen'}
                            </span>
                        </div>

                        {errors.import_errors && (
                            <div className="p-4 rounded-xl bg-error-container text-on-error-container text-sm mt-4 max-h-40 overflow-y-auto">
                                <p className="font-bold mb-2">Import Errors:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {(errors.import_errors as unknown as string[]).map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {errors.file && <p className="text-sm text-error">{errors.file}</p>}

                        <div className="mt-8 flex justify-end gap-3">
                            <SecondaryButton onClick={onClose} type="button">Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing || !data.file}>Import Data</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}