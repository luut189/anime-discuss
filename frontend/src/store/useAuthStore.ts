import { IUser } from '@/common/interfaces';
import { toast } from 'sonner';
import { create } from 'zustand';
import { signupUser, loginUser, logoutUser, checkAuth } from '@/api/auth';

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
    signup: (_: Credential) => Promise<void>;
    login: (_: Credential) => Promise<void>;
    logout: () => Promise<void>;
    authCheck: () => Promise<void>;
    setUser: (_: IUser) => void;
};

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isCheckingAuth: true,

    signup: async (cred) => {
        set({ isSigningUp: true });
        try {
            const userData = await signupUser(cred);
            set({ user: userData, isSigningUp: false });
            toast.success('Signed up successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Sign up failed');
            set({ isSigningUp: false, user: null });
        }
    },

    login: async (cred) => {
        set({ isLoggingIn: true });
        try {
            const userData = await loginUser(cred);
            set({ user: userData, isLoggingIn: false });
            toast.success(`Welcome back ${userData.username}!`);
        } catch (error) {
            console.error(error);
            toast.error('Login failed');
            set({ isLoggingIn: false, user: null });
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await logoutUser();
            set({ user: null, isLoggingOut: false });
            toast.success('Logout successful!');
        } catch (error) {
            console.error(error);
            toast.error('Logout failed');
            set({ isLoggingOut: false });
        }
    },

    authCheck: async () => {
        set({ isCheckingAuth: true });
        try {
            const userData = await checkAuth();
            set({ user: userData, isCheckingAuth: false });
        } catch (error) {
            console.error(error);
            set({ isCheckingAuth: false });
        }
    },

    setUser: (newUser: IUser) => {
        set({ user: newUser });
    },
}));

export default useAuthStore;
