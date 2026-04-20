import Flatpickr from 'react-flatpickr';

export default function DatePicker({ value, onChange, enableTime = false }: { value: string; onChange: (value: string) => void; enableTime?: boolean }) {
    return (
        <Flatpickr
            value={value}
            onChange={(_, dateString) => onChange(dateString)}
            options={{
                allowInput: true,
                altFormat: enableTime ? 'd M Y H:i' : 'd M Y',
                altInput: true,
                altInputClass: 'rounded-xl border-0 bg-surface-container-low px-3 py-3 text-base text-on-surface md:text-sm',
                dateFormat: enableTime ? 'Y-m-d\\TH:i' : 'Y-m-d',
                disableMobile: true,
                enableTime,
                time_24hr: true,
            }}
            className="rounded-xl border-0 bg-surface-container-low px-3 py-3 text-base text-on-surface md:text-sm"
        />
    );
}
