import AdminLayout from '@/Layouts/AdminLayout';
import { Sport } from '@/types/jrclub';
import { Head, Link } from '@inertiajs/react';

export default function Index({ sports }: { sports: { data: Sport[] } }) {
    return <ListPage title="Sports" items={sports.data.map((sport) => ({ id: sport.id, title: sport.name, subtitle: sport.description ?? sport.icon, href: route('admin.sports.edit', sport.id) }))} />;
}

function ListPage({ title, items }: { title: string; items: { id: number; title: string; subtitle: string; href: string }[] }) {
    return <AdminLayout title={title}><Head title={title} /><div className="grid gap-3">{items.map((item) => <Link key={item.id} href={item.href} className="rounded-xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.04)]"><p className="font-bold text-on-surface">{item.title}</p><p className="text-xs uppercase tracking-widest text-on-surface-variant">{item.subtitle}</p></Link>)}</div></AdminLayout>;
}
