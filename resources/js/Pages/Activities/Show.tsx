import { Activity } from '@/types/jrclub';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Show({ activity }: { activity: Activity }) {
    const user = usePage<PageProps>().props.auth.user;
    const isParticipating = (activity.participants ?? []).some((p) => p.id === user.id);
    const isFull = activity.status === 'full';
    
    // Format date and time
    const date = new Date(activity.scheduled_at);
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const isToday = date.toDateString() === new Date().toLocaleDateString();
    const displayDate = isToday ? `TODAY, ${formattedTime}` : `${formattedDate}, ${formattedTime}`;

    const slotsFilled = (activity.participants ?? []).length;
    const totalSlots = activity.max_participants;

    const handleJoinLeave = () => {
        if (isParticipating) {
            router.delete(route('activities.leave', activity.id));
        } else if (!isFull) {
            router.post(route('activities.join', activity.id));
        }
    };

    return (
        <div className="bg-background text-on-surface antialiased flex flex-col min-h-screen">
            <Head title={`${activity.title} - ${activity.sport.name}`} />

            {/* TopAppBar Semantic Shell */}
            <header className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md sticky top-0 w-full z-50 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] flex items-center justify-between px-6 py-4">
                <Link href={route('activities.index')} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center text-[#003f7b] dark:text-blue-400">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="font-bold tracking-[-0.04em] text-lg text-[#003f7b] dark:text-blue-400">Activity Details</h1>
                <button className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center text-[#003f7b] dark:text-blue-400 opacity-0 pointer-events-none">
                    <span className="material-symbols-outlined">share</span>
                </button>
            </header>

            <main className="flex-grow pb-28 px-4 pt-6 space-y-6 max-w-lg mx-auto w-full">
                {/* Hero Section */}
                <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {activity.sport.icon || 'sports_tennis'}
                        </span>
                    </div>
                    <h2 className="font-black text-3xl tracking-[-0.04em] text-on-surface">{activity.title}</h2>
                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
                        {activity.sport.name}
                    </span>
                </section>

                {/* Info Block */}
                <section className="bg-surface-container-low rounded-xl p-5 space-y-4">
                    <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-primary">calendar_today</span>
                        <div>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Date & Time</p>
                            <p className="font-bold text-on-surface tracking-[-0.02em] uppercase">{displayDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        <div>
                            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Location</p>
                            <p className="font-bold text-on-surface tracking-[-0.02em]">{activity.location}</p>
                        </div>
                    </div>
                </section>

                {/* Description */}
                {activity.description && (
                    <section className="px-2">
                        <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant mb-2">Details</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                            {activity.description}
                        </p>
                    </section>
                )}

                {/* Participants Section */}
                <section className="px-2 space-y-4">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                            Participants ({slotsFilled}/{totalSlots})
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {(activity.participants ?? []).map((participant, index) => (
                            <div key={participant.id} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                                        {participant.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface tracking-[-0.02em]">
                                            {participant.name}
                                            {index === 0 && <span className="text-xs font-normal text-on-surface-variant ml-1">(Organizer)</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty Slots */}
                        {Array.from({ length: Math.max(0, totalSlots - slotsFilled) }).map((_, i) => (
                            <div key={`empty-${i}`} className="flex items-center space-x-3 p-3 border-2 border-dashed border-outline-variant rounded-lg opacity-60">
                                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                                    <span className="material-symbols-outlined">person_add</span>
                                </div>
                                <p className="font-bold text-on-surface-variant tracking-[-0.02em]">Waiting for player...</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Sticky CTA */}
            {activity.status !== 'completed' && activity.status !== 'cancelled' && (
                <div className="fixed bottom-0 w-full p-4 bg-gradient-to-t from-surface to-transparent pb-safe z-50">
                    <button 
                        onClick={handleJoinLeave}
                        disabled={isFull && !isParticipating}
                        className={`w-full max-w-lg mx-auto block rounded text-[0.875rem] font-bold uppercase tracking-[0.05em] py-4 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.2)] active:scale-95 transition-transform duration-200 ${
                            isParticipating 
                                ? 'bg-surface-container-high text-error'
                                : isFull 
                                    ? 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'
                                    : 'bg-gradient-to-br from-primary to-primary-container text-on-primary'
                        }`}
                    >
                        {isParticipating ? 'LEAVE ACTIVITY' : isFull ? 'ACTIVITY FULL' : 'JOIN ACTIVITY'}
                    </button>
                </div>
            )}
        </div>
    );
}
