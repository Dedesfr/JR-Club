import { Branch } from './jrclub';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'member' | 'admin' | 'super_admin';
    branch_id: number;
    branch?: Branch | null;
    gender?: 'male' | 'female' | null;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
        isPusatAdmin: boolean;
        branches: Branch[];
    };
};
