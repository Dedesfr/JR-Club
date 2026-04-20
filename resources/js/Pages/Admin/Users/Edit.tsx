import SelectInput from '@/Components/SelectInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { User } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const roleOptions = [
    { value: 'member', label: 'member' },
    { value: 'admin', label: 'admin' },
];
const genderOptions = [
    { value: '', label: 'Unset' },
    { value: 'male', label: 'male' },
    { value: 'female', label: 'female' },
];

export default function Edit({ userRecord }: { userRecord: User }) {
    const form = useForm({ name: userRecord.name, email: userRecord.email, role: userRecord.role, gender: userRecord.gender ?? '' });

    return (
        <AdminLayout title={`Edit ${userRecord.name}`}>
            <Head title={userRecord.name} />
            <form onSubmit={(event) => { event.preventDefault(); form.patch(route('admin.users.update', userRecord.id)); }} className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2">
                <Field label="Name"><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Email"><input value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" /></Field>
                <Field label="Role"><SelectInput options={roleOptions} value={form.data.role} onChange={(value) => form.setData('role', value as 'member' | 'admin')} /></Field>
                <Field label="Gender"><SelectInput isClearable options={genderOptions} value={form.data.gender} onChange={(value) => form.setData('gender', value)} /></Field>
                <div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-primary">Save</button></div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <label className="grid gap-2 text-sm font-medium text-on-surface"><span>{label}</span>{children}</label>;
}
