import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { GameMatch } from '@/types/jrclub';
import { useForm, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function PhotoUploader({ match, onClose }: { match: GameMatch; onClose: () => void }) {
    const { data, setData, post, processing, errors, reset, progress } = useForm<{ documents: File[] }>({
        documents: [],
    });
    
    const [previews, setPreviews] = useState<{file: File, url: string}[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = [...data.documents, ...acceptedFiles].slice(0, 10);
        setData('documents', newFiles);
        
        // Generate previews
        const newPreviews = acceptedFiles.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        
        setPreviews(prev => [...prev, ...newPreviews].slice(0, 10));
    }, [data.documents]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        maxSize: 5242880, // 5MB
        maxFiles: 10
    });

    const removeFile = (index: number) => {
        const newFiles = [...data.documents];
        newFiles.splice(index, 1);
        setData('documents', newFiles);
        
        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.matches.documents.store', match.id), {
            onSuccess: () => {
                previews.forEach(p => URL.revokeObjectURL(p.url));
                onClose();
            },
        });
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="2xl">
            <div className="p-6 bg-surface-container-lowest text-on-surface">
                <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-primary">Match Photos</h2>
                
                {match.documents && match.documents.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">Existing Photos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {match.documents.map((doc) => (
                                <div key={doc.id} className="relative aspect-square rounded-lg border border-outline-variant overflow-hidden group">
                                    <img src={`/storage/${doc.path}`} alt={doc.original_name} className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            onClick={() => router.delete(route('admin.matches.documents.destroy', [match.id, doc.id]), { preserveScroll: true })}
                                            className="bg-error text-white text-xs px-2 py-1 rounded-full uppercase tracking-widest font-bold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <form onSubmit={submit} className="space-y-4 border-t border-outline-variant pt-4">
                    <div 
                        {...getRootProps()} 
                        className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
                            isDragActive ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-primary hover:bg-surface-variant'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <p className="text-on-surface-variant">
                            {isDragActive ? "Drop the files here..." : "Drag 'n' drop images here, or click to select files"}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-2 uppercase tracking-widest">
                            JPEG, PNG, WEBP up to 5MB (Max 10 files)
                        </p>
                    </div>
                    
                    <InputError message={errors.documents} />

                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-lg border border-outline-variant overflow-hidden group">
                                    <img src={preview.url} alt={`preview ${index}`} className="object-cover w-full h-full" />
                                    <button 
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 bg-error text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {progress && (
                        <div className="w-full bg-surface-variant rounded-full h-2.5 mt-2">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={onClose} type="button">Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing || data.documents.length === 0}>Upload Photos</PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}