import { IUser } from '@/common/interfaces';
import { toast } from 'sonner';
import { create } from 'zustand';

type Credential = {
    username: string;
    password: string;
};

type AuthState = {
    user: IUser | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isLoggingOut: boolean;
    isCheckingAuth: boolean;
    signup: (arg: Credential) => void;
    login: (arg: Credential) => void;
    logout: () => void;
    authCheck: () => void;
};

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isCheckingAuth: true,
    signup: async (cred: Credential) => {
        set({ isSigningUp: true });
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cred),
            });
            if (!response.ok) {
                throw new Error();
            }
            const data = await response.json();
            const userData: IUser = data.user;
            set({ user: userData, isSigningUp: false });
            toast.success('Signed up successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Sign up failed');
            set({ isSigningUp: false, user: null });
        }
    },
    login: async (cred: Credential) => {
        set({ isLoggingIn: true });
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cred),
            });
            if (!response.ok) {
                throw new Error();
            }
            const data = await response.json();
            const userData: IUser = data.user;
            set({ user: userData, isLoggingIn: false });
            toast.success(`Welcome back ${userData.username}!`);
        } catch (error) {
            console.error(error);
            toast.error('Login failed');
            set({ isLoggingIn: false, user: null });
        }
    },
    logout: async () => {
        set({ isLoggingOut: false });
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            set({ user: null, isLoggingOut: false });
            toast.success('Logout successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Logout failed');
            set({ isLoggingOut: false });
        }
    },
    authCheck: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await fetch('/api/auth/check');
            if (!response.ok) {
                throw new Error();
            }
            const data = await response.json();
            const userData: IUser = data.user;
            set({ user: userData, isCheckingAuth: false });
        } catch (error) {
            console.error(error);
            set({ isCheckingAuth: false });
        }
    },
}));
