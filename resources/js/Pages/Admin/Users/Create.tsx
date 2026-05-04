import SelectInput from '@/Components/SelectInput';
import AdminLayout from '@/Layouts/AdminLayout';
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

export default function Create() {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'member' as 'member' | 'admin',
        gender: '',
    });

    return (
        <AdminLayout
            title="Create User"
            actions={
                <button
                    type="submit"
                    form="create-user-form"
                    disabled={form.processing}
                    className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-[0.875rem] font-bold text-on-primary shadow-[0px_8px_16px_rgba(0,86,164,0.15)] transition-all hover:scale-[0.98] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)] disabled:opacity-50 disabled:hover:scale-100"
                >
                    Save User
                </button>
            }
        >
            <Head title="Create User" />
            <form
                id="create-user-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post(route('admin.users.store'));
                }}
                className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] md:grid-cols-2"
            >
                <Field label="Name" error={form.errors.name}>
                    <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" />
                </Field>
                <Field label="Email" error={form.errors.email}>
                    <input value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" />
                </Field>
                <Field label="Password" error={form.errors.password}>
                    <input type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" />
                </Field>
                <Field label="Confirm password" error={form.errors.password_confirmation}>
                    <input type="password" value={form.data.password_confirmation} onChange={(event) => form.setData('password_confirmation', event.target.value)} className="rounded-xl border-0 bg-surface-container-low px-3 py-3" />
                </Field>
                <Field label="Role" error={form.errors.role}>
                    <SelectInput options={roleOptions} value={form.data.role} onChange={(value) => form.setData('role', value as 'member' | 'admin')} />
                </Field>
                <Field label="Gender" error={form.errors.gender}>
                    <SelectInput isClearable options={genderOptions} value={form.data.gender} onChange={(value) => form.setData('gender', value)} />
                </Field>
            </form>
        </AdminLayout>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <label className="grid gap-2 text-sm font-medium text-on-surface">
            <span>{label}</span>
            {children}
            {error ? <p className="text-xs text-error">{error}</p> : null}
        </label>
    );
}
