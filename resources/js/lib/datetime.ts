const JAKARTA_TIME_ZONE = 'Asia/Jakarta';

function formatWithTimeZone(value: string | Date, options: Intl.DateTimeFormatOptions, locale?: string) {
    return new Intl.DateTimeFormat(locale, {
        timeZone: JAKARTA_TIME_ZONE,
        ...options,
    }).format(new Date(value));
}

export function getJakartaDateKey(value: string | Date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: JAKARTA_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date(value));

    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

    return `${year}-${month}-${day}`;
}

export function formatJakartaDate(value: string | Date, options: Intl.DateTimeFormatOptions = {}, locale?: string) {
    return formatWithTimeZone(value, { month: 'short', day: 'numeric', ...options }, locale);
}

export function formatJakartaTime(value: string | Date, locale?: string) {
    return formatWithTimeZone(value, { hour: '2-digit', minute: '2-digit', hour12: false }, locale);
}

export function formatJakartaDateTime(value: string | Date, locale?: string) {
    return `${formatWithTimeZone(value, { weekday: 'short', month: 'short', day: 'numeric' }, locale)} at ${formatJakartaTime(value, locale)}`;
}

export function isSameJakartaDay(left: string | Date, right: string | Date) {
    return getJakartaDateKey(left) === getJakartaDateKey(right);
}

export { JAKARTA_TIME_ZONE };
