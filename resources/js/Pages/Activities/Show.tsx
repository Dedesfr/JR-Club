import JRClubLayout from '@/Layouts/JRClubLayout';
import { PageProps } from '@/types';
import { Activity } from '@/types/jrclub';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({ activity }: { activity: Activity }) {
    const user = usePage<PageProps>().props.auth.user;
    const isParticipating = (activity.participants ?? []).some((p) => p.id === user.id);
    const slotsFilled = activity.participants?.length ?? activity.participants_count ?? 0;
    const totalSlots = activity.max_participants;
    const spotsLeft = Math.max(0, totalSlots - slotsFilled);
    const isFull = activity.status === 'full' || spotsLeft === 0;
    const fillPercent = totalSlots > 0 ? Math.min(100, Math.round((slotsFilled / totalSlots) * 100)) : 0;

    const date = new Date(activity.scheduled_at);
    const isToday = date.toDateString() === new Date().toDateString();
    const displayDate = isToday
        ? `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : `${date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const handleJoinLeave = () => {
        if (isParticipating) {
            router.delete(route('activities.leave', activity.id), { preserveScroll: true });
        } else if (!isFull) {
            router.post(route('activities.join', activity.id), {}, { preserveScroll: true });
        }
    };

    return (
        <JRClubLayout active="Activities">
            <Head title={`${activity.title} - ${activity.sport.name}`} />

            <section className="-mt-4 bg-inverse-surface" style={{ marginLeft: 'calc(50% - 50vw)', width: '100vw' }}>
                <div className="mx-auto max-w-md px-4 pt-5 pb-0 md:max-w-7xl md:px-6 lg:px-8">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <Link href={route('activities.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-inverse-on-surface/60 transition-colors hover:text-inverse-on-surface">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Events
                            </Link>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">
                                {activity.sport.name} · {displayDate}
                            </p>
                            <h1 className="mt-1 text-4xl font-black leading-none text-inverse-on-surface md:text-5xl">{activity.title}</h1>
                        </div>
                        <div className="hidden items-center gap-2 self-center rounded-xl bg-white/10 px-4 py-2.5 text-sm text-inverse-on-surface/60 md:flex">
                            <span className="material-symbols-outlined fill text-[16px]">{activity.sport.icon || 'sports_tennis'}</span>
                            <span>{activity.sport.name}</span>
                        </div>
                    </div>

                    {activity.description ? (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-inverse-on-surface/60">{activity.description}</p>
                    ) : null}

                    <div className="mt-4 flex items-center gap-6 border-t border-white/10 pt-4 md:gap-10">
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Slots</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{slotsFilled}/{totalSlots}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Spots Left</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">{spotsLeft}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-inverse-on-surface/50">Status</p>
                            <p className="mt-0.5 text-xl font-black text-inverse-on-surface md:text-2xl">
                                {isParticipating ? 'Joined' : isFull ? 'Full' : 'Open'}
                            </p>
                        </div>
                    </div>

                    {/* Fill bar */}
                    <div className="mt-4 pb-5">
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${fillPercent}%` }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoBlock icon="calendar_today" label="Date & Time" value={displayDate} />
                <InfoBlock icon="location_on" label="Location" value={activity.location} />
            </section>

            <section className="mt-6 rounded-xl bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
                <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Roster</p>
                        <h2 className="mt-1 text-2xl font-black tracking-normal text-on-surface">Participants</h2>
                    </div>
                    <span className="rounded-full bg-surface-container-low px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                        {slotsFilled}/{totalSlots}
                    </span>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    {(activity.participants ?? []).map((participant, index) => (
                        <ParticipantRow key={participant.id} name={participant.name} meta={index === 0 ? 'Organizer' : 'Participant'} filled />
                    ))}
                    {Array.from({ length: spotsLeft }).map((_, index) => (
                        <ParticipantRow key={`empty-${index}`} name="Waiting for player" meta="Open slot" />
                    ))}
                </div>
            </section>

            {activity.status !== 'completed' && activity.status !== 'cancelled' ? (
                <section className="sticky bottom-24 z-40 mt-6 rounded-full bg-white/85 p-2 shadow-[0px_12px_32px_rgba(15,23,42,0.12)] backdrop-blur-md md:bottom-6">
                    <button
                        onClick={handleJoinLeave}
                        disabled={isFull && !isParticipating}
                        className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold uppercase tracking-[0.05em] transition-transform active:scale-[0.98] ${
                            isParticipating
                                ? 'bg-surface-container-high text-error'
                                : isFull
                                  ? 'cursor-not-allowed bg-surface-container-high text-on-surface-variant opacity-60'
                                  : 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)]'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">{isParticipating ? 'logout' : 'how_to_reg'}</span>
                        {isParticipating ? 'Leave Activity' : isFull ? 'Activity Full' : 'Join Activity'}
                    </button>
                </section>
            ) : null}
        </JRClubLayout>
    );
}

function InfoBlock({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-surface-container-low p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]">
            <span className="material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-full bg-primary-fixed text-primary">{icon}</span>
            <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</p>
                <p className="mt-1 text-sm font-bold text-on-surface sm:text-base">{value}</p>
            </div>
        </div>
    );
}

function ParticipantRow({ name, meta, filled = false }: { name: string; meta: string; filled?: boolean }) {
    return (
        <div className={`flex items-center gap-3 rounded-lg p-3 ${filled ? 'bg-surface-container-low' : 'bg-surface-container text-on-surface-variant opacity-75'}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${filled ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                {filled ? name.charAt(0).toUpperCase() : <span className="material-symbols-outlined">person_add</span>}
            </div>
            <div>
                <p className="font-bold text-on-surface">{name}</p>
                <p className="text-xs text-on-surface-variant">{meta}</p>
            </div>
        </div>
    );
}
