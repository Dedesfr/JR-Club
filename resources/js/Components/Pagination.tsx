import { Link } from '@inertiajs/react';

type PaginationLink = {
    active: boolean;
    label: string;
    url: string | null;
};

type Paginated<T> = {
    data: T[];
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

export type PaginatedResponse<T> = Paginated<T>;

export default function Pagination<T>({ items }: { items: Paginated<T> }) {
    if (items.links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-on-surface-variant">
                Showing {items.from ?? 0}-{items.to ?? 0} of {items.total}
            </p>
            <nav className="flex flex-wrap gap-2" aria-label="Pagination">
                {items.links.map((link, index) => {
                    const baseClassName = 'rounded-full px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation';

                    if (!link.url) {
                        return (
                            <span
                                key={`${link.label}-${index}`}
                                className={`${baseClassName} cursor-not-allowed bg-surface-container-low text-on-surface-variant/50`}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url}
                            preserveScroll
                            className={`${baseClassName} ${link.active ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
