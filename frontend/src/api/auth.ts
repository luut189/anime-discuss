import { IUser } from '@/common/interfaces';

export async function signupUser(credentials: { username: string; password: string }) {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Signup failed');

    return (await response.json()).user as IUser;
}

export async function loginUser(credentials: { username: string; password: string }) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Login failed');

    return (await response.json()).user as IUser;
}

export async function logoutUser() {
    await fetch('/api/auth/logout', { method: 'POST' });
}

export async function checkAuth() {
    const response = await fetch('/api/auth/check');

    if (!response.ok) throw new Error('Auth check failed');

    return (await response.json()).user as IUser;
}
